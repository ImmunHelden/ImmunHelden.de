const cors = require("cors")({
  origin: true,
})

exports.pin_locations = function(admin, req, res) {
  // Apparently we have to extract the 'type' parameter from the URL manually.
  // E.g. req.params is { '0': '/maps/sample/pins' } => type is 'sample'
  const match = /\/maps\/(.*)\/pins/.exec(req.params['0'])
  const type = match[1]

  // This endpoint supports cross-origin requests.
  return cors(req, res, async () => {
    const locationsRef = admin.firestore().collection("locations")
    const entries = await locationsRef.where('type', '==', type).get()
    const pins = {}
    entries.forEach(doc => {
      const geoPoint = doc.get('latlng')
      pins[doc.id] = {
        title: doc.get('title'),
        latlng: [geoPoint.latitude, geoPoint.longitude],
      }
    })

    console.log('Serving', Object.keys(pins).length, 'locations in response to query', req.params[0])
    res.json(pins).send()
  })
}

exports.details_html = function(admin, req, res) {
  // This endpoint supports cross-origin requests.
  return cors(req, res, async () => {
    // TODO: Figure out how to access the ID and grab the respective document.
    const doc = await admin.firestore().collection("plasma").doc("VUoS00fHyd3q5Qow5m8h").get()
    const fields = doc.data()
    res.send(`
      <html>
      <body>
        <div>
          ${fields.description}
          <br>
          ${fields.addendum}
        </div>
      </body>
      </html>
    `)
  })
}

// Currently unused.
exports.regions = function(req, res) {
  // This endpoint supports cross-origin requests.
  return cors(req, res, () => {
    res.json({})
  })
}
