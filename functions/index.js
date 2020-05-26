const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fs = require('fs');

// Tools for processing data from blutspenden.de (internal use only).
const toolsBlutspendenDe = require(`./tools-blutspenden-de.js`);
exports.parseBlutspendenDe = toolsBlutspendenDe.parse;
exports.renderBlutspendenDe = toolsBlutspendenDe.render;

// Tools for finding the markdown for our email templates on GitHub, expanding
// placeholders, formatting it as HTML and sending sample mails for tests.
const messageTemplates = require(`./message-templates.js`);
exports.sendExampleMail = messageTemplates.sendExampleMail;
exports.doSendExampleMail = messageTemplates.doSendExampleMail;

admin.initializeApp(functions.config().firebase);

// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({
  origin: true,
});

const immuneHeroesTable = '/immuneHeroes'
const stakeHoldersTable = '/stakeHolders'


function parseBool(string) {
  if (string) {
    switch (string.toLowerCase().trim()) {
      case "true": case "yes": case "1": case "on": return true;
      case "false": case "no": case "0": case "off": case null: return false;
      default: return Boolean(string);
    }
  }
  return false;
}

exports.addImmuneHero = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(400).send('Please send a POST request');
    return;
  }

  const newHeroRef = await admin.database().ref('/heroes').push();
  newHeroRef.set({
    email: req.body.email,
    zipCode: req.body.zipCode
  });

  // Render E-Mail
  const msg = await messageTemplates.render('email/de/hero_welcome.md', {
    link_hero_double_opt_in: `https://immunhelden.de/verifyHero?key=${newHeroRef.key}`,
    link_hero_opt_out: `https://immunhelden.de/deleteHero?key=${newHeroRef.key}`
  });

  // Trigger E-Mail
  admin.firestore().collection('mail').add({
    to: req.body.email,
    message: msg
  });

  res.redirect(`../heldeninfo.html?key=${newHeroRef.key}`);
});

exports.verifyHero = functions.https.onRequest(async (req, res) => {
  if (req.method !== "GET" || !req.query.key) {
    res.status(400).send('Invalid request');
    return;
  }

  const heroRef = admin.database().ref('/heroes/' + req.query.key);
  heroRef.update({ 'doubleOptIn': true });

  res.redirect("../generic.html");
});

exports.deleteHero = functions.https.onRequest(async (req, res) => {
  if (req.method !== "GET" || !req.query.key) {
    res.status(400).send('Invalid request');
    return;
  }

  const heroRef = admin.database().ref('/heroes/' + req.query.key);
  await heroRef.remove();

  res.send('Subscription deleted');
});

exports.submitHeldenInfo = functions.https.onRequest(async (req, res) => {
  // Check for POST request
  if (req.method !== "POST") {
    res.status(400).send('Please send a POST request');
    return;
  }

  //console.log('Eintrag ' + req.body.key + ': ' + req.body.name + ' available ' + req.body.availability + ' and status ' + req.body.status);

  const key = req.body.key;
  const heroRef = admin.database().ref(`/heroes/${key}`);
  try {
    const heroSnapshot = await heroRef.once('value');
    if (!heroSnapshot)
      throw new Error(`Unknown heroes key '${key}'`);

    const heroJson = heroSnapshot.toJSON();
    console.log(`About to update HeldenInfo ${key}:`, heroJson);

    const heroRefChanged = heroRef.update({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      availability: req.body.availability,
      frequency: req.body.frequency,
      status: req.body.status
    });

    res.redirect(`../map.html?registered=${heroJson.zipCode}`);

    await heroRefChanged.then(async () => {
      const updatedSnapshot = await heroRef.once('value');
      console.log(`Done updating HeldenInfo ${key}:`, updatedSnapshot.toJSON());
      return;
    });
  } catch (err) {
    console.error(`Error Message:`, err);
    res.status(400).send('Invalid request. See function logs for details.');
  }
});

exports.addStakeHolder = functions.https.onRequest(async (req, res) => {
  // Check for POST request
  if (req.method !== "POST") {
    res.status(400).send('Please send a POST request');
    return;
  }

  const address = req.body.address;
  const zipCode = req.body.zipCode;
  const city = req.body.city;
  const country = "Germany";

  // LocationIQ query
  const baseUrl = "https://eu1.locationiq.com/v1/search.php";
  const params = {
    key: "pk.861b8037ac48a2b23d05c90e89658064",
    format: "json",
    q: [address, zipCode, city, country].join(',')
  };

  // LocationIQ request with retry
  const requestLatLng = async (maxAttempts, retryDelay) => {
    console.log(`Requesting: ${baseUrl}?key=${params.key}&format=${params.format}&q=${params.q}`);
    const STATUS_CODE_RATE_LIMIT_EXCEEDED = 429;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await rp.get({ uri: baseUrl, qs: params, json: true });
      } catch (err) {
        console.log(err);
        if (err.statusCode === STATUS_CODE_RATE_LIMIT_EXCEEDED) {
          // Our free LocationIQ account has a rate limit and it may kick in
          // when multiple users register at the same time. We will have to pay
          // for the service in order to avoid that. For now log a warning and
          // retry.
          console.warn('Failed to resolve coordinates. Will try again in ' +
                        retryDelay + 'ms.');
          await new Promise((wakeup, _) => setTimeout(wakeup, retryDelay));
        } else {
          console.error(err);
          throw err;
        }
      }
    }

    // We cannot let the user wait forever..
    // TODO: Forward users to a "Try again later page".
    throw new Error(
      'Give up trying to resolve coordinates for address after ' +
      maxAttempts + ' attempts over ' + (maxAttempts * retryDelay / 1000) +
      ' seconds.');
  };

  // LocationIQ response validation
  const hasValidLatLngMatch = (matches) => {
    return matches.hasOwnProperty("length") && matches.length > 0 &&
           matches[0].hasOwnProperty("lat") && matches[0].hasOwnProperty("lon");
  };

  // Kick-off request to LocationIQ and process result.
  const pendingLocationQuery = requestLatLng(10, 500)
    .then(response => {
      if (!hasValidLatLngMatch(response))
        throw new Error(`Invalid response: ${response}`);

      return {
        "lat": parseFloat(response[0].lat),
        "lon": parseFloat(response[0].lon)
      };
    });

  // Add records to database
  const stakeholderRef = await admin.database().ref('/stakeholders').push();
  const accountRef = await admin.database().ref('/accounts').push();
  const postRef = await admin.database().ref('/posts').push();

  // Render verification E-Mail
  const msg = await messageTemplates.render('email/de/org_welcome.md', {
    prop_org_name: req.body.organization,
    prop_org_login_first_name: req.body.firstName,
    link_org_login_double_opt_in: `https://immunhelden.de/verifyOrg?key=${stakeholderRef.key}`,
    link_org_login_opt_out: `https://immunhelden.de/deleteOrg?key=${stakeholderRef.key}`
  });

  // Trigger verification E-Mail
  admin.firestore().collection('mail').add({
    to: req.body.email,
    message: msg
  });

  // Fill records in database
  stakeholderRef.set({
    organisation: req.body.organization || '',
    accounts: [ accountRef.key ],
    posts: [ postRef.key ]
  });

  accountRef.set({
    stakeholder: stakeholderRef.key,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone
  });

  // Wait for location.
  const resolvedLocation = await pendingLocationQuery;
  console.log("Best match:", resolvedLocation);

  postRef.set({
    stakeholder: stakeholderRef.key,
    address: address,
    zipCode: zipCode,
    city: city,
    latitude: resolvedLocation.lat,
    longitude: resolvedLocation.lon,
    text: req.body.text,
    showOnMap: false
  });

  // Forward to verification page.
  // Organizations -> opt-out from display on map
  // Private person -> opt-in to display on map
  const addToMapDefault = (req.body.organization.length > 0) ? "true" : "false";
  const qs = [
    'key=' + stakeholderRef.key,
    'lat=' + resolvedLocation.lat,
    'lng=' + resolvedLocation.lon,
    'map-opt-out=' + addToMapDefault
  ];

  // TODO: For security reasons the key for adjustments should time out!
  res.redirect('../verifyStakeholderPin.html?' + qs.join('&'));
});

exports.doneVerifyStakeholderPin = functions.https.onRequest(async (req, res) => {
  // TODO: Check the key didn't time out yet!
  const updates = {};
  const key = req.query.key;
  updates[`/stakeHolders/${key}/latitude`] = parseFloat(req.query.exact_lat);
  updates[`/stakeHolders/${key}/longitude`] = parseFloat(req.query.exact_lng);
  updates[`/stakeHolders/${key}/directContact`] = parseBool(req.query.show_on_map);

  // Update database record with confirmed exact pin location.
  admin.database().ref().update(updates);
  res.redirect("../generic.html");
});

exports.verifyOrg = functions.https.onRequest(async (req, res) => {
  if (req.method !== "GET" || !req.query.key) {
    res.status(400).send('Invalid request');
    return;
  }

  const ref = admin.database().ref('/stakeholders/' + req.query.key);
  ref.update({ 'doubleOptIn': true });

  res.redirect("../generic.html");
});

exports.deleteOrg = functions.https.onRequest(async (req, res) => {
  if (req.method !== "GET" || !req.query.key) {
    res.status(400).send('Invalid request');
    return;
  }

  const ref = admin.database().ref('/stakeholders/' + req.query.key);
  await ref.remove();

  res.send('Subscription deleted');
});

// exports.getImmuneHeroesInZipCodeRangeAsJson = functions.https.onRequest(async (req, res) => {
//   const searchZipCode = parseInt(req.query.searchZipCode)
//   const result = await getImmuneHeroesInZipCodeRange(searchZipCode)
//   res.json(result.toJSON()).send();
// });

exports.pin_locations = functions.https.onRequest(async (req, res) => {
  // This endpoint supports cross-origin requests.
  return cors(req, res, () => {
    res.json({
      "blutspendende-U0_T_pAy9": {
        "title": "Blutspende am Universitätsklinikum Freiburg",
        "latlng": [ 48.0066478, 7.8381151 ]
      }
    }).send();
  });
});

exports.regions = functions.https.onRequest(async (req, res) => {
  // This endpoint supports cross-origin requests.
  return cors(req, res, () => {
    res.json({});
  });
});

exports.details_html = functions.https.onRequest(async (req, res) => {
  // This endpoint supports cross-origin requests.
  return cors(req, res, () => {
    res.send(`
      <link rel="stylesheet" href="details.css">
      <div>
        <div class="title">Blutspende am Universitätsklinikum Freiburg</div>
        <div class="contact">Blutspendezentrale Haus Langerhans</div>
        <div class="address">Hugstetter Str. 55, 79106 Freiburg</div>
        <div class="phone"><a href="tel:+497612704444">0761 2704444</a></div>
        <div class="url"><a href="http://www.uniklinik-freiburg.de/blutspende/live/index.html">http://www.uniklinik-freiburg.de/blutspende/live/index.html</a></div>
        <div class="permalink"><a href="#blutspendende-U0_T_pAy9" target="_parent">Permalink</a></div>
      </div>
    `);
  });
});


exports.contactStakeholder = functions.https.onRequest(async (req, res) => {
  // Check for POST request
  if (req.method !== "POST") {
    res.status(400).send('Please send a POST request');
    return;
  }

  res.send(req.body.contact + ' an ' + req.body.key + ':\n' + req.body.message);
});


exports.getStakeHoldersInZipCodeRangeAsJson = functions.https.onRequest(async (req, res) => {
  const searchZipCode = parseInt(req.query.searchZipCode)
  const result = await getStakeHoldersInZipCodeRange(searchZipCode)
  res.json(result.toJSON()).send();
});

//exports.getStakeHoldersInZipCodeRangeAsHtmlTable = functions.https.onRequest(async (req, res) => {
//  const searchZipCode = parseInt(req.query.searchZipCode)
//  return res.send(wrapStakeHoldersHtmlTableInBody(await createStakeHoldersInZipCodeRangeHtmlTable(searchZipCode)));
//});

//daily
// exports.scheduledDailyEmailNotificationDaily = functions.pubsub.schedule('every day 16:00')
//   .timeZone('Europe/Berlin')
//   .onRun(async (context) => {
//     const snapshot = await getAllImmuneHeroesWithEmailCategory("daily");
//     snapshot.forEach(childSnapshot => {
//       const immuneHero = getImmuneHeroFromSnapshot(childSnapshot);
//       notifyImmuneHero(immuneHero)
//     })
//     return null;
//   });

// //weekly
// exports.scheduledDailyEmailNotificationWeekly = functions.pubsub.schedule('every monday 09:00')
//   .timeZone('Europe/Berlin')
//   .onRun(async (context) => {
//     const snapshot = await getAllImmuneHeroesWithEmailCategory("weekly");
//     snapshot.forEach(childSnapshot => {
//       const immuneHero = getImmuneHeroFromSnapshot(childSnapshot);
//       notifyImmuneHero(immuneHero)
//     })
//     return null;
//   });

exports.notifyImmuneHeroesInZipCodeRangeOnCreateStakeHolder = functions.database.ref(stakeHoldersTable + '/{pushId}')
  .onCreate(async (newStakeHolderSnapshot, context) => {
    const searchZipCode = parseInt(newStakeHolderSnapshot.val().zipCode)
    const numberStakeHolder = (await getStakeHoldersInZipCodeRange(searchZipCode)).numChildren()
    if (numberStakeHolder > 0) {
      const snapshot = await getImmuneHeroesInZipCodeRange(searchZipCode);
      snapshot.forEach(childSnapshot => {
        const stakeHoldersHtmlTable = createStakeHoldersInZipCodeRangeHtmlTable(searchZipCode);
        const immuneHero = getImmuneHeroFromSnapshot(childSnapshot);
        if (immuneHero.emailCategory === "direct") {
          const success = sendEmailToImmuneHero(immuneHero, stakeHoldersHtmlTable);
        }
      });
      return null;
    } else {
      return null;
    }
  });

//Automatic Email
exports.notifyImmuneHeroOnCreateImmuneHero = functions.database.ref(immuneHeroesTable + '/{pushId}')
  .onCreate(async (newImmuneHeroSnapShot, context) => {
    const searchZipCode = parseInt(newImmuneHeroSnapShot.val().zipCode)
    console.log("Number: " + searchZipCode)
    const numberStakeHolder = (await getStakeHoldersInZipCodeRange(searchZipCode)).numChildren()
    console.log("Number:" + numberStakeHolder)
    if (numberStakeHolder > 0) {
      const stakeHoldersHtmlTable = createStakeHoldersInZipCodeRangeHtmlTable(searchZipCode);
      const immuneHero = getImmuneHeroFromSnapshot(newImmuneHeroSnapShot)
      return sendEmailToImmuneHero(immuneHero, stakeHoldersHtmlTable)
    } else {
      return null;
    }
  });

// Automatic Email Http Request
// exports.notifyImmuneHeroesInZipCodeRange = functions.https.onRequest(async (req, res) => {
//   const searchZipCode = parseInt(req.query.searchZipCode)
//   const numberStakeHolder = (await getStakeHoldersInZipCodeRange(searchZipCode)).numChildren()
//   console.log("Number:" + numberStakeHolder)
//   if (numberStakeHolder > 0) {
//     console.log("Ja")
//     return getImmuneHeroesInZipCodeRange(searchZipCode).then(snapshot => {
//       var successList = "";
//       snapshot.forEach(childSnapshot => {
//         const stakeHoldersHtmlTable = createStakeHoldersInZipCodeRangeHtmlTable(searchZipCode);
//         const immuneHero = getImmuneHeroFromSnapshot(childSnapshot)
//         console.log(immuneHero.emailAddress)
//         const success = sendEmailToImmuneHero(immuneHero, stakeHoldersHtmlTable)
//         if (success) {
//           successList += "Email successfully sent to" + immuneHero.key + "\n"
//         } else {
//           successList += "Email not sent to" + immuneHero.key + "\n"
//         }
//       });
//       return res.send(successList)
//     });
//   } else {
//     return null;
//   }
// });

async function notifyImmuneHero(immuneHero) {
  const searchZipCode = immuneHero.zipCode
  console.log("Number: " + searchZipCode)
  const numberStakeHolder = (await getStakeHoldersInZipCodeRange(searchZipCode)).numChildren()
  console.log("Number:" + numberStakeHolder)
  if (numberStakeHolder > 0) {
    const stakeHoldersHtmlTable = createStakeHoldersInZipCodeRangeHtmlTable(searchZipCode);
    return sendEmailToImmuneHero(immuneHero, stakeHoldersHtmlTable)
  } else {
    return null;
  }
}

async function createStakeHoldersInZipCodeRangeHtmlTable(searchZipCode) {
  const stakeHoldersList = await getStakeHoldersInZipCodeRange(searchZipCode)
  return createStakeHoldersHtmlTable(stakeHoldersList);
}

function createStakeHoldersHtmlTable(stakeHoldersList) {
  var table = "<table><tr><td style='width: 100px; color: red; text-align: left'>Vorname</td>";
  table += "<td style='width: 100px; color: red; text-align: left;'>Nachname</td>";
  table += "<td style='width: 100px; color: red; text-align: left;'>Organisation</td>";
  table += "<td style='width: 100px; color: red; text-align: left;'>Email</td>";
  table += "<td style='width: 100px; color: red; text-align: left;'>Telefonnummer</td>";
  table += "<td style='width: 200px; color: red; text-align: left;'>Was wird benötigt?</td>";
  table += "<td style='width: 100px; color: red; text-align: left;'>Addresse (Einsatzort)</td>";
  table += "<td style='width: 100px; color: red; text-align: left;'>Postleitzahl (Einsatzort)</td>";
  table += "<td style='width: 100px; color: red; text-align: left;'>Stadt (Einsatzort)</td></tr>";

  table += "<tr><td style='width: 100px; text-align: left;'>---------------</td>";
  table += "<td     style='width: 100px; text-align: left;'>---------------</td>";
  table += "<td     style='width: 100px; text-align: left;'>---------------</td>";
  table += "<td     style='width: 100px; text-align: left;'>---------------</td>";
  table += "<td     style='width: 100px; text-align: left;'>---------------</td>";
  table += "<td     style='width: 100px; text-align: left;'>---------------</td>";
  table += "<td     style='width: 100px; text-align: left;'>---------------</td>";
  table += "<td     style='width: 100px; text-align: left;'>---------------</td>";
  table += "<td     style='width: 100px; text-align: left;'>---------------</td></tr>";

  stakeHoldersList.forEach(childSnapshot => {
    const stakeHolder = getStakeHolderFromSnapshot(childSnapshot);
    table += "<tr><td style='width: 100px; text-align: left;'>" + stakeHolder.preName + "</td>";
    table += "<td style='width: 100px; text-align: left;'>" + stakeHolder.lastName + "</td>";
    table += "<td style='width: 100px; text-align: left;'>" + stakeHolder.organisation + "</td>";
    table += "<td style='width: 100px; text-align: left;'>" + stakeHolder.emailAddress + "</td>";
    table += "<td style='width: 100px; text-align: left;'>" + stakeHolder.phoneNumber + "</td>";
    table += "<td style='width: 100px; text-align: left;'>" + stakeHolder.text + "</td>";
    table += "<td style='width: 100px; text-align: left;'>" + stakeHolder.address + "</td>";
    table += "<td style='width: 100px; text-align: left;'>" + stakeHolder.zipCode + "</td>";
    table += "<td style='width: 100px; text-align: left;'>" + stakeHolder.city + "</td></tr>";
  });
  table += "</table>";
  return table;
}

function wrapStakeHoldersHtmlTableInBody(stakeHoldersHtmlTable) {
  var body = "<!doctype html>"
  body += "<html>"
  body += "<title>ImmunHelden</title>"
  body += "</head>"
  body += "<h3>Diese Personen/Organisationen benötigen deine Hilfe:</h3>"
  body += stakeHoldersHtmlTable
  body += "</body>"
  body += "</html>"
  return body;
}

function wrapStakeHoldersHtmlTableInBodyWithImmuneHeroInformation(immuneHero, stakeHoldersHtmlTable) {
  var body = "<!doctype html>"
  body += "<html>"
  body += "<title>ImmunHelden</title>"
  body += "</head>"
  body += "<h3>Hey " + immuneHero.preName + ",</h3>"
  body += "<p>danke, dass Du mit dabei bist!</p>"
  body += "<h4>Diese Personen/Organisationen benötigen gerade deine Hilfe:</h4>"
  body += stakeHoldersHtmlTable
  body += "<p>Bitte melde dich direkt bei Ihnen!</p>"
  body += "<p>Dein ImmunHelden Team</p>"
  body += "</body>"
  body += "</html>"
  return body;
}

function getStakeHolderFromSnapshot(snapshot) {
  return stakeHolder = { key: snapshot.key, preName: snapshot.val().preName, lastName: snapshot.val().lastName, organisation: snapshot.val().organisation, emailAddress: snapshot.val().emailAddress, phoneNumber: snapshot.val().phoneNumber, text: snapshot.val().text, address: snapshot.val().address, zipCode: snapshot.val().zipCode, city: snapshot.val().city }
}

function getAllStakeHolders() {
  return admin.database().ref(stakeHoldersTable).once('value')
}

function getImmuneHeroFromSnapshot(snapshot) {
  return immuneHero = { key: snapshot.key, preName: snapshot.val().preName, lastName: snapshot.val().lastName, emailAddress: snapshot.val().emailAddress, zipCode: snapshot.val().zipCode, emailCategory: snapshot.val().emailCategory }
}

function getAllImmuneHeroesWithEmailCategory(emailCategory) {
  return admin.database().ref(immuneHeroesTable).orderByChild("emailCategory").equalTo(emailCategory).once('value')
}

function getImmuneHeroesInZipCodeRange(searchZipCode) {
  const searchZipCodeBounds = getSearchZipCodeBounds(searchZipCode)
  return admin.database().ref(immuneHeroesTable).orderByChild("zipCode").startAt(searchZipCodeBounds.searchZipCodeLowerBound).endAt(searchZipCodeBounds.searchZipCodeUpperBound).once('value')
}

function getStakeHoldersInZipCodeRange(searchZipCode) {
  const searchZipCodeBounds = getSearchZipCodeBounds(searchZipCode)
  return admin.database().ref(stakeHoldersTable).orderByChild("zipCode").startAt(searchZipCodeBounds.searchZipCodeLowerBound).endAt(searchZipCodeBounds.searchZipCodeUpperBound).once('value')
}

function getSearchZipCodeBounds(searchZipCode) {
  const searchZipCodeLowerBound = searchZipCode - (searchZipCode % 1000)
  const searchZipCodeUpperBound = searchZipCodeLowerBound + 999
  return searchZipCodeBounds = { searchZipCodeLowerBound: searchZipCodeLowerBound, searchZipCodeUpperBound: searchZipCodeUpperBound }
}

//Email
//let mailTransport = nodemailer.createTransport({
//  service: 'gmail',
//  auth: {
//    user: 'immune.heroes@gmail.com',
//    pass: ''
//  }
//});
//
async function sendEmailToImmuneHero(immuneHero, stakeHoldersHtmlTable) {
//  const mailOptions = {
//    from: "ImmunHelden",
//    to: immuneHero.emailAddress
//  };
//  mailOptions.subject = 'Hey ImmuneHero: Wir brauchen dich!';
//  mailOptions.text = 'Hey ' + immuneHero.preName + ',\n\nWir brauchen deine Unterstützung!\n\nDein ImmunHelden Team';
//  mailOptions.html = wrapStakeHoldersHtmlTableInBodyWithImmuneHeroInformation(immuneHero, await stakeHoldersHtmlTable);
//  return await mailTransport.sendMail(mailOptions);
}
