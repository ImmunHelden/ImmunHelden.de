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
const cors = require('./cors-utils.test.js')
const assert = require('chai').assert

// TODO: Using the `done` callback here is one option and while it does work,
// it will cause failures to be reported as `timeout exceeded`.
//
// Unfortunately, I didn't manage to get the promise-based variant to work.
// IIUC it's the recommended option, but (working with CORS-enabled functions)
// it didn't correctly await the function completion, so that assertion
// failures are reported after the test case already reported success.
//
it("details_html should include addendum and description", /* async */ (done) => {
  /* await */ fns.details_html(
    cors.req({
      params: { '0': '/maps/__test__/details/test-test-test' },
    }),
    cors.res({
      send: (html) => {
        assert.isOk(html.includes('addendum'))
        assert.isOk(html.includes('description'))
        done()
      },
    }),
  )
})

// TODO: This test is likely to break anytime soon, but it's fine for now.
it("pin_locations should provide title and latlng", /* async */ (done) => {
  /* await */ fns.pin_locations(
    cors.req({
      params: { '0': '/maps/__test__/pins' },
    }),
    cors.res({
      json: (response) => {
        assert.equal(Object.keys(response).length, 1);

        const key = Object.keys(response)[0];
        const value = response[key];
        assert.equal(value.title, "title");
        assert.equal(value.latlng.length, 2);
        assert.equal(value.latlng[0], 0);
        assert.equal(value.latlng[1], 0);

        return {
          send: () => {
            done()
          },
        }
      },
    }),
  )
})

test.cleanup()
