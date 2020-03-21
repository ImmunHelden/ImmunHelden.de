// Coronabook / ImmuneHeros Functions
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
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
  const snapshot = await admin.database().ref(immuneHeroesTable).push({preName: preName, lastName: lastName, emailAddress: emailAddress, zipCode:zipCode});
  res.redirect(303, snapshot.ref.toString());
});

exports.addStakeHolder = functions.https.onRequest(async (req, res) => {
  const preName = req.query.preName
  const lastName = req.query.lastName
  const organisation = req.query.organisation
  const text = req.query.text
  const emailAddress = req.query.emailAddress
  const zipCode = parseInt(req.query.zipCode)
  const phoneNumber = req.query.phoneNumber
  const snapshot = await admin.database().ref(stakeHoldersTable).push({preName: preName, lastName: lastName, organisation: organisation, text: text, emailAddress: emailAddress, zipCode:zipCode, phoneNumber: phoneNumber});
  res.redirect(303, snapshot.ref.toString());
});

exports.getImmuneHeroesWithZipCodeAsJson = functions.https.onRequest(async (req, res) => {
  const searchZipCode = parseInt(req.query.searchZipCode)
  const searchZipCodeBounds = getSearchZipCodeBounds(searchZipCode)
  var result = await admin.database().ref(immuneHeroesTable).orderByChild("zipCode").startAt(searchZipCodeBounds.searchZipCodeLowerBound).endAt(searchZipCodeBounds.searchZipCodeUpperBound).once('value')
  res.json(result.toJSON()).send();
});

exports.notifyImmuneHeroesInZipCodeRange = functions.https.onRequest(async (req, res) => {
  const searchZipCode = parseInt(req.query.searchZipCode)
  const searchZipCodeBounds = getSearchZipCodeBounds(searchZipCode)
  return admin.database().ref(immuneHeroesTable).orderByChild("zipCode").startAt(searchZipCodeBounds.searchZipCodeLowerBound).endAt(searchZipCodeBounds.searchZipCodeUpperBound).once('value').then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
      immuneHero = {preName: childSnapshot.val().preName, lastName: childSnapshot.val().lastName, emailAddress: childSnapshot.val().emailAddress, zipCode: childSnapshot.val().zipCode}
      sendEmailToImmuneHero(immuneHero)
      return
    });
    return res.send("Emails send successfully!")
  });
});

function getSearchZipCodeBounds(searchZipCode){
  const searchZipCodeLowerBound = searchZipCode - (searchZipCode % 1000)
  const searchZipCodeUpperBound = searchZipCodeLowerBound + 999
  return searchZipCodeBounds = {searchZipCodeLowerBound: searchZipCodeLowerBound, searchZipCodeUpperBound:searchZipCodeUpperBound}
}

let mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'immune.heroes@gmail.com',
      pass: 'WIRWSWIRUS20'
  }
});

async function sendEmailToImmuneHero(immuneHero) {
  const mailOptions = {
    from: "ImmuneHeroes",
    to: immuneHero.emailAddress
  };
  mailOptions.subject = 'We need you!';
  mailOptions.text = 'We need your support!';
  await mailTransport.sendMail(mailOptions);
  console.log('Email send to ImmuneHero:', email);
  return;
}
