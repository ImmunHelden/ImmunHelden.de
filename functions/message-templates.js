const functions = require('firebase-functions');
const rp = require('request-promise');
const crypto = require('crypto');
const showdown = require('showdown');
const fillTemplate = require('es6-dynamic-template');

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
