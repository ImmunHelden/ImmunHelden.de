// ImmuneHeros Functions as Firebase Backe-End
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();

const immuneHeroesTable = '/immuneHeroes'
const stakeHoldersTable = '/stakeHolders'

exports.addImmuneHero = functions.https.onRequest(async (req, res) => {
  const preName = req.query.preName
  const lastName = req.query.lastName
  const emailAddress = req.query.emailAddress
  const zipCode = parseInt(req.query.zipCode)
  const result = await admin.database().ref(immuneHeroesTable).push({ preName: preName, lastName: lastName, emailAddress: emailAddress, zipCode: zipCode });
  res.json(result.toJSON()).send();
});

exports.addStakeHolder = functions.https.onRequest(async (req, res) => {
  const preName = req.query.preName
  const lastName = req.query.lastName
  const organisation = req.query.organisation
  const text = req.query.text
  const emailAddress = req.query.emailAddress
  const phoneNumber = req.query.phoneNumber
  const address = req.query.address
  const zipCode = parseInt(req.query.zipCode)
  const city = req.query.city
  const result = await admin.database().ref(stakeHoldersTable).push({ preName: preName, lastName: lastName, organisation: organisation, text: text, emailAddress: emailAddress, phoneNumber: phoneNumber, address: address, zipCode: zipCode, city: city });
  res.json(result.toJSON()).send();
});

exports.getImmuneHeroesInZipCodeRangeAsJson = functions.https.onRequest(async (req, res) => {
  const searchZipCode = parseInt(req.query.searchZipCode)
  const result = await getImmuneHeroesInZipCodeRange(searchZipCode)
  res.json(result.toJSON()).send();
});

exports.getStakeHoldersInZipCodeRangeAsJson = functions.https.onRequest(async (req, res) => {
  const searchZipCode = parseInt(req.query.searchZipCode)
  const result = await getStakeHoldersInZipCodeRange(searchZipCode)
  res.json(result.toJSON()).send();
});

exports.getStakeHoldersInZipCodeRangeAsHtmlTable = functions.https.onRequest(async (req, res) => {
  const searchZipCode = parseInt(req.query.searchZipCode)
  return res.send(wrapStakeHoldersHtmlTableInBody(await createStakeHoldersInZipCodeRangeHtmlTable(searchZipCode)));
});

exports.notifyImmuneHeroesInZipCodeRange = functions.https.onRequest(async (req, res) => {
  const searchZipCode = parseInt(req.query.searchZipCode)
  return getImmuneHeroesInZipCodeRange(searchZipCode).then(snapshot => {
    snapshot.forEach(childSnapshot => {
      const stakeHoldersHtmlTable = createStakeHoldersInZipCodeRangeHtmlTable(searchZipCode)
      const immuneHero = getImmuneHeroFromSnapshot(childSnapshot)
      const success = sendEmailToImmuneHero(immuneHero, stakeHoldersHtmlTable)
      if (success) {
        return res.append("Email successfully sent to" + immuneHero.key)
      } else {
        return res.append("Email not sent to" + immuneHero.key)
      }
    });
    return res.send()
  });
});

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

function wrapStakeHoldersHtmlTableInBody(stakeHoldersHtmlTable){
  var body = "<!doctype html>"
  body +=    "<html>"
  body +=    "<title>ImmuneHeroes</title>"
  body +=    "</head>"
  body +=    "<h3>Diese Personen/Organisationen benötigen deine Hilfe:</h3>"
  body +=    stakeHoldersHtmlTable
  body +=    "</body>"
  body +=    "</html>"
  return body;
}

function wrapStakeHoldersHtmlTableInBodyWithImmuneHeroInformation(immuneHero, stakeHoldersHtmlTable){
  var body = "<!doctype html>"
  body +=    "<html>"
  body +=    "<title>ImmuneHeroes</title>"
  body +=    "</head>"
  body +=    "<h3>Hey " + immuneHero.preName + ",</h3>"
  body +=    "<p>danke, dass du mit dabei bist!</p>"
  body +=    "<h4>Diese Personen/Organisationen benötigen gerade deine Hilfe:</h4>"
  body +=    stakeHoldersHtmlTable
  body +=    "<p>Bitte melde dich direkt bei Ihnen!</p>"
  body +=    "<p>Dein ImmuneHeroes Team</p>"
  body +=    "</body>"
  body +=    "</html>"
  return body;
}

function getStakeHolderFromSnapshot(snapshot) {
  return stakeHolder = { key: snapshot.val().key, preName: snapshot.val().preName, lastName: snapshot.val().lastName, organisation: snapshot.val().organisation, emailAddress: snapshot.val().emailAddress, phoneNumber: snapshot.val().phoneNumber, text: snapshot.val().text, address: snapshot.val().address, zipCode: snapshot.val().zipCode, city: snapshot.val().city }
}

function getImmuneHeroFromSnapshot(snapshot) {
  return immuneHero = { key: snapshot.val().key, preName: snapshot.val().preName, lastName: snapshot.val().lastName, emailAddress: snapshot.val().emailAddress, zipCode: snapshot.val().zipCode }
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
    pass: 'WIRWSWIRUS20'
  }
});

async function sendEmailToImmuneHero(immuneHero, stakeHoldersHtmlTable) {
  const mailOptions = {
    from: "ImmuneHeroes",
    to: immuneHero.emailAddress
  };
  mailOptions.subject = 'Hey ImmuneHero: Wir brauchen dich!';
  mailOptions.text = 'Hey ' + immuneHero.preName +',\n\nWir brauchen deine Unterstützung!\n\nDein ImmuneHeroes Team';
  mailOptions.body = wrapStakeHoldersHtmlTableInBodyWithImmuneHeroInformation(immuneHero, stakeHoldersHtmlTable);
  return await mailTransport.sendMail(mailOptions);
}
