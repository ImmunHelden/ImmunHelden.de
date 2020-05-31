const functions = require('firebase-functions');
const path = require('path');
const shortid = require('shortid');
const rp = require('request-promise');
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

function escapeHtml(unsafe) {
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
}

exports.parse = functions.https.onRequest(async (req, res) => {
  const html = await rp.get({ uri: "https://www.blutspenden.de/blutspendedienste/" });
  //const html = await readFile('blutspenden.html', 'utf8');
  const oneliner = html.replace(/\s+/g, ' ')
                       .replace(/[ ]?<br[ ]?\/>[ ]?/g, ', ')
                       .replace(/\n/g, '');
  const allListItems = oneliner.match(new RegExp(`<li.*?/li>`, 'g'));

  const indicator = new RegExp('data-covid="1"', 'g');
  const relevantListItems = allListItems.filter(li => li.match(indicator));

  const propCaptures = {
    title: '<div.*?institutions__title">(.*?)</div>',
    contact: '<div.*?institutions__contact">(.*?)</div>',
    address: '<div.*?institutions__address">(.*?)</div>',
    phone: '<div.*?institutions__phone">.*?"tel://(.*?)".*?</div>',
    email: '<div.*?institutions__email">.*>(.*?\\(at\\).*?)<.*?</div>',
    url: '<div.*?institutions__url">.*?"(http[s]?://.*?)".*?</div>'
  };
  const excludedProps = new Set(req.query.hasOwnProperty('exclude') ? req.query.exclude.split(',') : []);
  const selectedProps = Object.keys(propCaptures).filter(name => !excludedProps.has(name));
  const selectedCaptures = selectedProps.map(name => new RegExp(propCaptures[name]));

  const records = [];
  const failures = [];
  for (const li of relevantListItems) {
    const record = {};
    for (const [i, capture] of selectedCaptures.entries()) {
      const groups = [...li.matchAll(capture)];
      if (groups.length === 0 || !groups[0].hasOwnProperty('length')) {
        failures.push(`Missing ${selectedProps[i]} in: ${li}`);
        continue;
      }
      if (groups[0].length !== 2) {
        console.error("For each property, please specify a capture that matches exactly once. " +
                      `${capture} has ${(groups[0].length - 1)} matches.`);
        continue;
      }
      record[selectedProps[i]] = groups[0][1].trim();
    }
    // Assign ID now to keep it consistent across renderings.
    record.id = shortid.generate();
    records.push(record);
  }

  if (!req.query.hasOwnProperty('debug')) {
    res.json(records).send();
  } else {
    const sec = [];
    sec.push(`${relevantListItems.length} relevant li's out of ${allListItems.length} in total`);
    sec.push(`${JSON.stringify(records)}`);
    sec.push(`Failures:\n${escapeHtml(failures.join('\n'))}`);
    sec.push(`Irrelevant:\n${escapeHtml(allListItems.filter(li => !li.match(indicator)).join('\n'))}`);
    res.send(`<pre>${sec.join('\n\n\n')}</pre>`);
  }
});

exports.render = functions.https.onRequest(async (req, res) => {
  // Start reading description
  const loadJson = readFile('blutspenden-clean.json', 'utf8');
  //const loadJson = rp.get({ uri: 'https://raw.githubusercontent.com/ImmunHelden/ImmunHelden.de/data/blutspenden.de/blutspenden-clean.json' });

  // Prepare output directory
  const outdirPrefix = req.query['outdir-prefix'] || 'tmp';
  let postfix = 0;
  while (fs.existsSync(outdirPrefix + postfix))
    postfix += 1;
  const outdir = outdirPrefix + postfix;

  // LocationIQ: resolve coordinates for address
  const sleep = async (ms) => {
    await new Promise((wakeup, _) => setTimeout(wakeup, ms));
  };
  const tryResolve = async (address, retries) => {
    const STATUS_CODE_RATE_LIMIT_EXCEEDED = 429;
    for (let i = 0; i < retries; i++) {
      await sleep(500); // rate limit second
      try {
        return await rp.get({
          uri: "https://eu1.locationiq.com/v1/search.php",
          json: true,
          qs: {
            key: "pk.861b8037ac48a2b23d05c90e89658064",
            format: "json",
            q: address
        }});
      } catch (err) {
        // TODO: Handling this, currently causes a function timeout in Firebase.
        // For now we can simply process a list in 2 steps.
        //if (err.statusCode === STATUS_CODE_RATE_LIMIT_EXCEEDED &&
        //    err.error.error === 'Rate Limited Minute') {
        //  console.warn(err);
        //  await sleep(60000); // rate limit minute
        //} else {
          throw new Error(`Resolution failure for address '${address}': ${err}`);
        //}
      }
    }
    throw new Error(`Resolution failure for address '${address}': ` +
                    `Hanging up after trying ${retries} times`);
  };
  const requestLatLng = async (address) => {
    const matches = await tryResolve(address, 3);
    if (matches.hasOwnProperty("length") && matches.length > 0 &&
        matches[0].hasOwnProperty("lat") && matches[0].hasOwnProperty("lon")) {
      return [
        parseFloat(matches[0].lat),
        parseFloat(matches[0].lon)
      ];
    }

    //throw new Error(`Invalid response: ${matches}`);
    return null;
  };

  const streamlinePhone = (str) => {
    const digits = str.replace(/\D/g,'');
    if (str.charAt(0) === '+')
      return '+' + digits;
    if (str.startsWith('00'))
      return '+' + str.substring(2);
    if (str.charAt(0) === '0') // German number
      return '+49' + str.substring(1);
    throw new Error('Unrecognized format in phone number: ' + str);
  };

  // Render HTML for a record
  const renderDetailsHtml = (rec, id) => {
    const lines = [];
    lines.push('<div>');
    for (const field of ['title', 'contact', 'address']) {
      if (rec.hasOwnProperty(field)) {
        lines.push(`<div class="${field}">${rec[field]}</div>`);
      }
    }
    if (rec.hasOwnProperty('phone')) {
      const prefix = (rec.phone.charAt(0) === '+' || rec.phone.startsWith('00')) ? '+' : null;
      const digits = rec.phone.replace(/\D/g,'');
      const international = prefix ? prefix + digits : digits.replace(/^0/g,'+49');
      lines.push(`<div class="phone"><a href="tel:${international}">${rec.phone}</a></div>`);
    }
    if (rec.hasOwnProperty('email')) {
      lines.push(`<div class="email"><a href="mailto:${rec.email}">${rec.email}</a></div>`);
    }
    if (rec.hasOwnProperty('url')) {
      lines.push(`<div class="url"><a href="${rec.url}">Webseite</a></div>`);
    }
    lines.push(`<div class="permalink"><a href="#${id}" target="_parent">Permalink</a></div>`);
    lines.push('</div>');
    return lines.join('\n');
  };

  // Put it all together
  let outputComplete = true;
  const detailsHtmls = {};
  const pinsJson = {};
  const fileNamePrefix = req.query['id-prefix'] || shortid.generate();

  const records = JSON.parse(await loadJson);
  try {
    for (const rec of records) {
      if (!rec.hasOwnProperty('id'))
        rec.id = shortid.generate();

      const id = fileNamePrefix + '-' + rec.id;
      detailsHtmls[id] = renderDetailsHtml(rec, id);

      if (rec.hasOwnProperty('latlng')) {
        console.log('Exact location', rec.latlng, 'given for address', rec.address);
      }
      else {
        rec.latlng = await requestLatLng(rec.address);
        console.log('Resolved', rec.latlng, 'for address', rec.address);
      }
      pinsJson[id] = { title: rec.title, latlng: rec.latlng };
    }
  }
  catch (err) {
    console.warn('Processing stopped unexpectedly:', err);
    outputComplete = false;
  }

  if (!req.query.hasOwnProperty('debug')) {
    // Write results to disk and send summary to client
    fs.mkdirSync(outdir);
    fs.mkdirSync(path.join(outdir, 'html'));

    const successStr = outputComplete ? 'successfully' : 'partially'
    let msg = `<h1>Map input rendered ${successStr}</h1>Files written:<br>`;

    await writeFile(path.join(outdir, 'pins'), JSON.stringify(pinsJson));
    msg += path.join(outdir, 'pins') + '<br>';

    for (const id in detailsHtmls) {
      await writeFile(path.join(outdir, 'html', id), detailsHtmls[id]);
      msg += path.join(outdir, 'html', id) + '<br>';
    }

    res.send(msg);
  } else {
    // Dump results and send to client
    const htmls = [];
    for (const [id, html] of detailsHtmls.entries()) {
      htmls.push(`<h1>${entry.name}</h1>\n` +
                 `${f.details}`);
    }
    htmls.push('<hr>' + JSON.stringify(pinsJson));
    res.send(htmls.join('\n<br>\n'));
  }
});
