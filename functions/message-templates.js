const functions = require('firebase-functions');
const rp = require('request-promise');
const crypto = require('crypto');
const showdown = require('showdown');
const fillTemplate = require('es6-dynamic-template');

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

exports.render = async function(template, params) {
  const baseUrl = 'https://raw.githubusercontent.com/ImmunHelden/ImmunHelden.de/notifications/';
  const template_markdown = await rp.get({ uri: baseUrl + template });

  const match = /# (.*?)\n(.*)/s.exec(template_markdown);
  if (match.length !== 3) {
    console.error('Invalid markdown given. Regex match invalid:', match);
    throw new Error(`Invalid markdown. Plese follow the example here: https://raw.githubusercontent.com/ImmunHelden/ImmunHelden.de/notifications/email/hero_welcome.md`);
  }

  const markdown = fillTemplate(match[2], params);
  const converter = new showdown.Converter();
  return {
    subject: fillTemplate(match[1], params),
    html: converter.makeHtml(markdown)
  };
}

exports.sendExampleMail = functions.https.onRequest(async (req, res) => {
  if (req.method !== "GET") {
    res.status(400).send('Invalid request');
    return;
  }

  try {
    // Render message for preview
    const msg = await exports.render(req.query.template, {
      link_hero_double_opt_in: 'https://immunhelden.de/verifyHero?key=test',
      link_hero_opt_out: 'https://immunhelden.de/deleteHero?key=test',
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
});

exports.doSendExampleMail = functions.https.onRequest(async (req, res) => {
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
        link_hero_double_opt_in: 'https://immunhelden.de/verifyHero?key=test',
        link_hero_opt_out: 'https://immunhelden.de/deleteHero?key=test'
      })
    };

    admin.firestore().collection('mail').add(mail);
    res.send('Ok');
  }
  catch (err) {
    res.status(400).send(err.message);
  }
});

exports.renderFaq = functions.https.onRequest(async (req, res) => {
  const url = 'https://raw.githubusercontent.com/ImmunHelden/ImmunHelden.de/markdown/faq/faq.md';
  const markdown = await rp.get({ uri: url });
  const conv = new showdown.Converter({
    extensions: ['header-anchors']
  });
  conv.setFlavor('github');
  res.send(conv.makeHtml(markdown));
});
