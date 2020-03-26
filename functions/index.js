const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const rp = require('request-promise');
const fs = require('fs');
admin.initializeApp();

const immuneHeroesTable = '/immuneHeroes'
const stakeHoldersTable = '/stakeHolders'

exports.addImmuneHero = functions.https.onRequest(async (req, res) => {
  const preName = req.query.preName
  const lastName = req.query.lastName
  const emailAddress = req.query.emailAddress
  const zipCode = parseInt(req.query.zipCode)
  const emailCategory = req.query.emailCategory
  const result = await admin.database().ref(immuneHeroesTable).push({ preName: preName, lastName: lastName, emailAddress: emailAddress, zipCode: zipCode, emailCategory: emailCategory});
  res.redirect('../generic.html');
});

exports.addStakeHolder = functions.https.onRequest(async (req, res) => {
  const address = req.query.address;
  const zipCode = parseInt(req.query.zipCode);
  const city = req.query.city;
  const country = "Germany";

  // LocationIQ query
  const baseUrl = "https://eu1.locationiq.com/v1/search.php";
  const params = {
    key: "pk.861b8037ac48a2b23d05c90e89658064",
    format: "json",
    q: [address, zipCode, city, country].join(',')
  };

  // LocationIQ request with retry
  const requestLatLng = (attemptsRemaining, retryDelay) => {
    console.log(`${baseUrl}?key=${params.key}&format=${params.format}&q=${params.q}`);
    return rp.get({ uri: baseUrl, qs: params, json: true })
      .then(response => {
        console.log("requestLatLng::doRequest::then");
        console.log(response);
        return response;
      });
    };

  // LocationIQ response validation
  const hasValidLatLngMatch = (matches) => {
    return matches.hasOwnProperty("length") && matches.length > 0 &&
           matches[0].hasOwnProperty("lat") && matches[0].hasOwnProperty("lon");
  };

  // Resolve location via LocationIQ
  const bestMatch = await requestLatLng(10, 500)
    .then(response => {
      if (!hasValidLatLngMatch(response))
        throw new Error(`Invalid response: ${response}`);

      return {
        "lat": parseFloat(response[0].lat),
        "lon": parseFloat(response[0].lon)
      };
    });

  console.log("Best match:", bestMatch);

  // Add record to database
  const entry = {
    "preName": req.query.preName,
    "lastName": req.query.lastName,
    "organisation": req.query.organisation,
    "text": req.query.text,
    "emailAddress": req.query.emailAddress,
    "phoneNumber": req.query.phoneNumber,
    "address": address,
    "zipCode": zipCode,
    "city": city,
    "latitude": bestMatch.lat,
    "longitude": bestMatch.lon
  };

  // TODO: For security reasons the key for adjustment should time out!
  const result = await admin.database().ref(stakeHoldersTable).push(entry);

  res.redirect('../generic.html');
});

// exports.getImmuneHeroesInZipCodeRangeAsJson = functions.https.onRequest(async (req, res) => {
//   const searchZipCode = parseInt(req.query.searchZipCode)
//   const result = await getImmuneHeroesInZipCodeRange(searchZipCode)
//   res.json(result.toJSON()).send();
// });

exports.getAllImmuneHeroesNutsAsJson = functions.https.onRequest(async (req, res) => {
  const heroesData = await admin.database().ref(immuneHeroesTable).once('value');

  // Load map of zipCode => NUTS_ID, build from CSV data:
  // https://ec.europa.eu/eurostat/web/nuts/correspondence-tables/postcodes-and-nuts
  fs.readFile('zip2nuts.json', 'utf8', (err, data) => {
    if (err) throw err;
    const heroes = heroesData.toJSON();
    const heroesPerNuts = {};
    const zip2nuts = JSON.parse(data);

    for (const key in heroes) {
      const zip = heroes[key].zipCode;
      if (!zip2nuts.hasOwnProperty(zip)) {
        // TODO: Handle invalid/unknown ZIP codes.
        continue;
      }

      const nuts = zip2nuts[zip];
      if (heroesPerNuts.hasOwnProperty(nuts)) {
        heroesPerNuts[nuts] += 1;
      } else {
        heroesPerNuts[nuts] = 1;
      }
    }

    // Load map of NUTS_ID => shape, extracted from:
    // https://datahub.io/core/geo-nuts-administrative-boundaries/r/nuts_rg_60m_2013_lvl_3.geojson
    fs.readFile('nuts_lvl_3_de_by_id.json', 'utf8', (err, data) => {
      if (err) throw err;
      const nutsLvl3 = JSON.parse(data);

      const resp = [];
      for (const nutsId in heroesPerNuts) {
        if (!nutsLvl3.hasOwnProperty(nutsId)) {
          // TODO: Handle invalid/unknown NUTS.
          continue;
        }

        resp.push({
          "shape": nutsLvl3[nutsId][0],
          "users": heroesPerNuts[nutsId]
        });
      }

      res.json(resp).send();
    })
  });
});

exports.getAllStakeHoldersAsJson = functions.https.onRequest(async (req, res) => {
  const result = await getAllStakeHolders()
  res.json(result.toJSON()).send();
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
  body += "<title>ImmuneHeroes</title>"
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
  body += "<title>ImmuneHeroes</title>"
  body += "</head>"
  body += "<h3>Hey " + immuneHero.preName + ",</h3>"
  body += "<p>danke, dass Du mit dabei bist!</p>"
  body += "<h4>Diese Personen/Organisationen benötigen gerade deine Hilfe:</h4>"
  body += stakeHoldersHtmlTable
  body += "<p>Bitte melde dich direkt bei Ihnen!</p>"
  body += "<p>Dein ImmuneHeroes Team</p>"
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
let mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'immune.heroes@gmail.com',
    pass: ''
  }
});

async function sendEmailToImmuneHero(immuneHero, stakeHoldersHtmlTable) {
  const mailOptions = {
    from: "ImmuneHeroes",
    to: immuneHero.emailAddress
  };
  mailOptions.subject = 'Hey ImmuneHero: Wir brauchen dich!';
  mailOptions.text = 'Hey ' + immuneHero.preName + ',\n\nWir brauchen deine Unterstützung!\n\nDein ImmuneHeroes Team';
  mailOptions.html = wrapStakeHoldersHtmlTableInBodyWithImmuneHeroInformation(immuneHero, await stakeHoldersHtmlTable);
  return await mailTransport.sendMail(mailOptions);
}
