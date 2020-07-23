const moment = require("moment")
const cors = require("cors")({
  origin: true,
});

function invalid(res, logText) {
  // TODO: How can we log it in Sentry?
  res.status(400).send("Invalid request");
  if (logText)
    console.error(logText);
}

function isLiveNow(doc) {
  if (!doc.published)
      return false;
  if (!doc.dateRangeExplicit)
      return true;
  const begin = moment(doc.dateRangeFrom, 'YYYY-MM-DD', true);
  const now = moment(new Date());
  const end = moment(doc.dateRangeTo, 'YYYY-MM-DD', true);
  const started = begin.isValid() ? begin.isSameOrBefore(now) : true;
  const stillRunning = end.isValid() ? end.isSameOrAfter(now) : true;
  return started && stillRunning;
}

exports.all_pin_locations = function(admin, req, res) {
  // Support cross-origin requests.
  return cors(req, res, async () => {
    const locationsRef = admin.firestore().collection("locations");
    const entries = await locationsRef.where('published', '==', true).get();
    const pins = {};
    entries.forEach(doc => {
      const fields = doc.data();
      if (isLiveNow(fields)) {
        pins[doc.id] = {
          title: fields.title,
          type: fields.type,
          latlng: [fields.latlng.latitude, fields.latlng.longitude],
        };
      }
    });

    res.json(pins).send();
    console.log('Served', Object.keys(pins).length,
                'locations in response to query', req.params[0]);
  })
}

exports.pin_locations = function(admin, req, res) {
  // Apparently we have to extract the 'type' parameter from the URL manually.
  // E.g. req.params is { '0': '/maps/sample/pins' } => type is 'sample'
  const match = /\/maps\/(.*)\/pins/.exec(req.params['0']);
  const type = match[1];

  // Support cross-origin requests.
  return cors(req, res, async () => {
    const locationsRef = admin.firestore().collection("locations");
    const entries = await locationsRef.where('type', '==', type).get();
    const pins = {};
    entries.forEach(doc => {
      const fields = doc.data();
      if (fields.published) {
        pins[doc.id] = {
          title: fields.title,
          latlng: [fields.latlng.latitude, fields.latlng.longitude],
        };
      }
    });

    res.json(pins).send();
    console.log('Served', Object.keys(pins).length,
                'locations in response to query', req.params[0]);
  })
}

exports.details_html = function(admin, req, res) {
  // Apparently we have to extract the 'type' and 'id' parameters from the URL
  // manually, with req.params['0'] looking like: `/maps/type/details_html/id`
  const uri = req.params['0'];
  const match = /\/maps\/.*details\/(.*)/.exec(uri);
  if (!match || match.length !== 2)
    return invalid(res);

  const id = match[1];

  // Support cross-origin requests.
  return cors(req, res, async () => {
    const doc = await admin.firestore().collection("locations").doc(id).get();
    if (!doc.exists)
      return invalid(res, `Requested doc does't exist: ${uri}`);

    const fields = doc.data();
    if (!fields.published)
      return invalid(res, `Requested doc not published: ${uri}`);

    if (!fields.description || !fields.addendum)
      console.error("Requested doc doesn't have all required fields:", uri);

    res.send(`
      <html>
      <body>
        <div>
          ${fields.description || ""}
          <br>
          ${fields.addendum || ""}
        </div>
      </body>
      </html>
    `)
  })
}
