// In order to run the tests, a service account key is required.
//
// % export GOOGLE_APPLICATION_CREDENTIALS=/Users/staefsn/.ssh/immunhelden-b4cf6fd1620c.json
// % cd functions
// % npm test
//
const test = require('firebase-functions-test')({
  projectId: "immunhelden",
  databaseURL: "https://immunhelden.firebaseio.com",
  storageBucket: "immunhelden.appspot.com"
}, process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Import all functions. TODO: Check wehter or not it can be dangerous.
const fns = require('../index.js');

// Test utilities
const assert = require('chai').assert

// TODO: Using the `done` callback here is one option and while it does work,
// it will cause failures to be reported as `timeout exceeded`.
//
// Unfortunately, I didn't manage to get the promise-based variant to work.
// IIUC it's the recommended option, but (working with CORS-enabled functions)
// it didn't correctly await the function completion, so that assertion
// failures are reported after the test case already reported success.
//
it("details_html should include the correct heading", /* async */ (done) => {
  const req = {
    params: { id: 'VUoS00fHyd3q5Qow5m8h' },
    headers: {
      origin: true
    }
  }
  const res = {
    getHeader: (key) => {
      //console.log("getHeader:", key)
    },
    setHeader: (key, value) => {
      //console.log("setHeader:", key, "=", value)
    },
    send: (html) => {
      assert.isOk(html.includes('Freiwillige für Studie gesucht'))
      done()
    }
  };

  /* await */ fns.details_html(req, res)
})

test.cleanup()
