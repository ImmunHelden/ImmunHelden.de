const functions = require('firebase-functions');
const rp = require('request-promise');
const crypto = require('crypto');
const showdown = require('showdown');
const fillTemplate = require('es6-dynamic-template');
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

// Transform all headings that represent questions into clickable anchors with a
// chain symbol in front. Filtering out non-ascii characters from anchor names
// makes it bullet-proof.
showdown.extension('header-anchors', function() {
  const chain_svg =
      '<svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16">' +
      '  <path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>' +
      '</svg>'

  return [{
    type: 'html',
    regex: /<h3 id="([^"]+?)">(.*<\/h3>)/g,
    replace: function(match, p1, p2) {
      // Remove all non-ascii characters from permalinks
      const a = p1.replace(/[^\x00-\x7F]/g, "");
      return `<h3 id="${a}"><a id="user-content-${a}" class="anchor" href="#${a}" aria-hidden="true">${chain_svg}</a>${p2}`;
    }
  }];
});

// Transform email footers so that they appear greyed out.
showdown.extension('email-footers', function() {
  return [{
    type: 'html',
    regex: /<p>(--<br>[\s\S]*)<\/p>/gm,
    replace: '<p style="color: #888">$1</p>'
  }];
});

exports.render = async function(template, params) {
  const baseUrl = 'https://raw.githubusercontent.com/ImmunHelden/ImmunHelden.de/markdown/';
  const template_markdown = await rp.get({ uri: baseUrl + template });

  const match = /# (.*?)\n(.*)/s.exec(template_markdown);
  if (match.length !== 3) {
    console.error('Invalid markdown given. Regex match invalid:', match);
    throw new Error(`Invalid markdown. Please follow the example here: https://raw.githubusercontent.com/ImmunHelden/ImmunHelden.de/markdown/email/hero_welcome.md`);
  }

  const markdown = fillTemplate(match[2], params);
  const conv = new showdown.Converter({
    extensions: ['email-footers']
  });

  return {
    subject: fillTemplate(match[1], params),
    html: conv.makeHtml(markdown)
  };
}

exports.sendExampleMail = async (req, res) => {
  if (req.method !== "GET") {
    res.status(400).send('Invalid request');
    return;
  }

  try {
    // Render message for preview
    const msg = await exports.render(req.query.template, {
      link_hero_double_opt_in: 'https://immunhelden.de/confirmImmuneHero?id=test',
      link_hero_opt_out: 'https://immunhelden.de/removeImmuneHero?id=test',
      prop_org_name: 'Test-Organisation',
      prop_org_login_first_name: 'Test-Vorname',
      link_org_login_double_opt_in: `https://immunhelden.de/verifyOrg?key=test`,
      link_org_login_opt_out: `https://immunhelden.de/deleteOrg?key=test`
    });

    res.send(`
      <link rel="stylesheet" href="https://newcss.net/new.min.css">
      <form action="/doSendExampleMail" method="POST">
        <input type="text" name="template" value="${req.query.template}">
        <input type="password" name="pass" value="" placeholder="Passwort">
        <input type="email" name="email" placeholder="Empfänger E-Mail">
        <input type="submit">
      </form>
      <hr>
      Subject: ${msg.subject}
      <hr>
      ${msg.html}
    `);
  }
  catch (err) {
    res.status(400).send(err.message);
  }
}

exports.doSendExampleMail = async (admin, req, res) => {
  if (req.method !== "POST" || !req.body.pass || !req.body.email || !req.body.template) {
    res.status(400).send('Invalid request');
    return;
  }

  // For now simple security should be sufficient.
  const shasum = crypto.createHash('sha1').update(req.body.pass);
  if (shasum.digest('hex') !== '0ae1588ad4b7568ec2539065fc830cafba9a7d6a') {
    res.status(400).send('Invalid request');
    return;
  }

  try {
    // Render message to send
    const mail = {
      to: req.body.email,
      message: await exports.render(req.body.template, {
        link_hero_double_opt_in: 'https://immunhelden.de/confirmImmuneHero?id=test',
        link_hero_opt_out: 'https://immunhelden.de/removeImmuneHero?id=test',
        prop_org_name: 'Test-Organisation',
        prop_org_login_first_name: 'Test-Vorname',
        link_org_login_double_opt_in: `https://immunhelden.de/verifyOrg?key=test`,
        link_org_login_opt_out: `https://immunhelden.de/deleteOrg?key=test`
      })
    };

    admin.firestore().collection('mail').add(mail);
    res.send('Ok');
  }
  catch (err) {
    res.status(400).send(err.message);
  }
}

exports.doSendOrgWelcomeMail = async (admin, email, template) => {
  try {
    // Render message to send
    const mail = {
      to: email,
      message: await exports.render(template, {})
    };

    admin.firestore().collection('mail').add(mail);
    console.log('Sent org welcome mail');
  }
  catch (err) {
    console.log(err.message);
  }
}

exports.renderFaq = functions.https.onRequest(async (req, res) => {
  const url = 'https://raw.githubusercontent.com/ImmunHelden/ImmunHelden.de/markdown/faq/faq.md';
  const markdown = await rp.get({ uri: url });
  const conv = new showdown.Converter({
    extensions: ['header-anchors']
  });
  conv.setFlavor('github');
  res.send(conv.makeHtml(markdown));
});

exports.zip2latlng = async function(zip) {
  const zip2latlng = JSON.parse(await readFile('zip2latlng.json'));
  if (zip2latlng.hasOwnProperty(zip)) {
    return zip2latlng[zip];
  } else {
    console.log('Cannot find ZIP:', zip);
    return null;
  }
}

const renderUpdateMail = async function(template, updateSeries, recipient) {
  const lat = Math.round(recipient.latlng[0] * 1000) / 1000;
  const lng = Math.round(recipient.latlng[1] * 1000) / 1000;
  const zoom = recipient.dist > 10 ? 11 : 13;
  const paramsTracking = `utm_update=${updateSeries}&utm_range=${recipient.dist}`;
  const paramsHero = `lat=${lat}&lng=${lng}&zoom=${zoom}&${paramsTracking}`;

  const contents = [];
  for (const ad of recipient.ads) {
    contents.push(`[${ad.title}: ${ad.address}](https://immunhelden.de/de/maps/all/?${paramsTracking}#${ad.id})`);
  }

  return await exports.render(template, {
    prop_ads_distance: `${recipient.dist}km`,
    prop_hero_zip: recipient.zip,
    list_ads: contents.join('<br>'),
    link_hero_location_map: `https://immunhelden.de/de/maps/all/?${paramsHero}`,
    link_hero_opt_out: `https://immunhelden.de/removeImmuneHero?id=${recipient.key}`
  });
}

exports.sendUpdateMails = async function(req, res) {
  if (req.method !== "GET") {
    res.status(400).send('Invalid request');
    return;
  }

  if (typeof(req.query.template) === "undefined") {
    res.status(400).send("Invalid request: parameter 'template' is required");
    return;
  }

  try {
    // Render message for preview
    const demoRecipient = {
      key: 'demo-key',
      zip: '12345',
      latlng: [52.453, 13.492],
      dist: 15,
      ads: [
        { title: 'Anzeige 1', address: 'Adresse 1', id: 'stadtmission-iudDZ87_23' },
        { title: 'Anzeige 2', address: 'Adresse 2', id: 'blutspendende-SsUTW0dcf-E' }
      ]
    };
    const msg = await renderUpdateMail(req.query.template, 'demo-update',
                                       demoRecipient);

    // For local debugging use /immunhelden/us-central1/doSendUpdateMails
    res.send(`
      <link rel="stylesheet" href="https://newcss.net/new.min.css">
      <form action="/doSendUpdateMails" method="POST">
        <input type="text" name="template" value="${req.query.template}">
        <input type="password" name="pass" value="" placeholder="Passwort">
        <input type="email" name="email" placeholder="Empfänger E-Mail">
        <input type="submit"><br>
        <label><input type="checkbox" name="heroes" id="heroes"> Wirklich an alle Heroes senden (Achtung echte E-Mails an echte Nutzer)</label>
      </form>
      <hr>
      Subject: ${msg.subject}
      <hr>
      ${msg.html}
    `);
  }
  catch (err) {
    res.status(400).send(err.message);
  }
};

function parseBool(string) {
  if (string) {
    switch (string.toLowerCase().trim()) {
      case "true": case "yes": case "1": case "on":
        return true;
      case "false": case "no": case "0": case "off": case null:
        return false;
      default:
        return Boolean(string);
    }
  }
  return false;
}

exports.doSendUpdateMails =  async function(req, res, admin) {
  if (req.method !== "POST" || !req.body.template) {
    res.status(400).send('Invalid request');
    return;
  }
  if (parseBool(req.body.heroes) === (req.body.email.length > 0)) {
    res.status(400).send('Invalid request: Can only send to given email or to heroes. Please make a choice!');
    return;
  }

  // For now simple security should be sufficient.
  const shasum = crypto.createHash('sha1').update(req.body.pass);
  if (shasum.digest('hex') !== '0ae1588ad4b7568ec2539065fc830cafba9a7d6a') {
    res.status(400).send('Bad credentials');
    return;
  }

  const candidates = [];
  const heroes = await admin.firestore().collection('heroes').get();
  const zip2latlng = JSON.parse(await readFile('zip2latlng.json'));

  heroes.forEach(hero => {
    if (hero.get('doubleOptIn')) {
      candidates.push({
        email: hero.get('email'),
        zip: hero.get('zipCode'),
        latlng: zip2latlng[hero.get('zipCode')],
        key: hero.id,
        ads: [],
        dist: 0
      });
    }
  });

  const fetchAdDetails = async (facilities) => {
    const ads = [];
    for (const f in facilities) {
      const record = await admin.firestore().collection(facilities[f].collection).doc(f).get();
      ads.push({
        id: record.id,
        address: record.get('address'),
        title: record.get('title')
      });
    }
    return ads;
  }

  const distNear = 5;
  const distFar = 15;
  for (const candidate of candidates) {
    const facilities = await exports.doCalcDistances(
        admin, candidate.latlng, ['locations'], [distNear, distFar]);

    const total = Object.keys(facilities).length;
    if (total > 0) {
      // Create subset of facilities that are near-by.
      const facilitiesNearBy = {};
      for (const id in facilities) {
        if (facilities[id].hasOwnProperty(`${distNear}km`)) {
          facilitiesNearBy[id] = facilities[id];
        }
      }

      // List facilities that are near-by, if there is more than 1 or we only
      // have one and it's near-by. Otherwise list all we found.
      const nearBy = Object.keys(facilitiesNearBy).length;
      if (nearBy > 1 || (nearBy === 1 && total === 1)) {
        candidate.ads = await fetchAdDetails(facilitiesNearBy);
        candidate.dist = distNear;
      } else {
        candidate.ads = await fetchAdDetails(facilities);
        candidate.dist = distFar;
      }
    } else {
      console.log(`No facilities for candidate ${candidate.key}`);
    }
  }

  const recipients = candidates.filter(c => c.ads.length > 0);

  // Allow to send all mails to one given address for debugging
  if (!parseBool(req.body.heroes) || req.body.email.length > 0) {
    for (const r of recipients) {
      r.email = req.body.email;
    }
  }

  try {
    // For debugging
    //for (const recipient of recipients) {
    //  recipient.email = await renderUpdateMail(req.body.template, 'mua', recipient);
    //}
    //res.json(recipients).send();
    //return;

    // Render message to send
    for (const recipient of recipients) {
      admin.firestore().collection('mail').add({
        to: recipient.email,
        message: await renderUpdateMail(req.body.template, 'mua', recipient)
      });
    }

    res.send(`Sent updates to ${recipients.length} recipients ` +
             `(out of ${candidates.length} candidates)\n`);
  }
  catch (err) {
    res.status(400).send(err.message);
  }
};

function haversineKiloMeters(c1, c2) {
  const R = 6371e3; // metres
  const φ1 = c1[0] * Math.PI/180; // φ, λ in radians
  const φ2 = c2[0] * Math.PI/180;
  const Δφ = (c2[0]-c1[0]) * Math.PI/180;
  const Δλ = (c2[1]-c1[1]) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = Math.round(R * c / 1000); // in kilo-metres

  //console.log(c1, '=>', c2, `= ${d}km`);
  return d;
}

exports.doCalcDistances = async function(admin, fromCoord, toCollections, distRanges) {
  if (!fromCoord) {
    console.warn(`Cannot calculate distances: no coord given`);
    return {};
  }

  console.log("\nAbout to measure distance from", fromCoord,
              "to all items in collections", toCollections);

  const results = {};
  const addResult = (facility, type, range) => {
    results[facility] = results[facility] || { collection: type };
    if (results[facility].hasOwnProperty(range)) {
      results[facility][range]++;
    } else {
      results[facility][range] = 1;
    }
  };

  const matchDistRange = (doc) => {
    const geoPoint = doc.get('latlng');
    if (!geoPoint || !geoPoint.latitude || !geoPoint.longitude) {
      console.warn(`Skipping entry ${doc.id}: no geo-point available`);
      return null;
    }

    const dist = haversineKiloMeters(fromCoord, [geoPoint.latitude, geoPoint.longitude]);
    for (const range of distRanges) {
      if (dist <= range) {
        console.log(`${doc.id} [${geoPoint.latitude}, ${geoPoint.longitude}]:`,
                    `dist = ${dist}km (within ${range}km range)`);
        return range;
      }
    }

    return null;
  };

  try {
    let totalMatches = 0;
    let totalLocations = 0;
    for (const type of toCollections) {
      const collection = await admin.firestore().collection(type).get();
      totalLocations += collection.docs.length;
      totalMatches += collection.docs.reduce((sum, doc) => {
        const range = matchDistRange(doc);
        if (range) {
          addResult(doc.id, type, range + "km");
          return sum + 1;
        } else {
          return sum;
        }
      }, 0);
    }

    console.log("Matched", totalMatches, "out of", totalLocations, "locations",
                "to", distRanges.length, "ranges");
    return results;
  }
  catch (err) {
    console.error("Error calculating distances from", fromCoord, ":", err);
  }
}
