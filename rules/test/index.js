const firebase = require("@firebase/testing")
const fs = require("fs")

/*
 * ============
 *    Setup
 * ============
 */
const projectId = "immunhelden"
const firebasePort = require("../../firebase.json").emulators.firestore.port
const port = firebasePort /** Exists? */ ? firebasePort : 8080
const coverageUrl = `http://localhost:${port}/emulator/v1/projects/${projectId}:ruleCoverage.html`

const rules = fs.readFileSync("firestore.rules", "utf8")

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth) {
    return firebase.initializeTestApp({ projectId, auth }).firestore()
}

/*
 * ============
 *  Test Cases
 * ============
 */
beforeEach(async () => {
    // Clear the database between tests
    // await firebase.clearFirestoreData({ projectId })
})

before(async () => {
    await firebase.loadFirestoreRules({ projectId, rules })
})

after(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()))
    console.log(`View rule coverage information at ${coverageUrl}\n`)
})

describe("Plasma", () => {
    const collection = "plasma"
    it("everyone can access plasma locations", async () => {
        const db = authedApp(null)
        const profile = db.collection(collection)
        await firebase.assertSucceeds(profile.get())
    })
    it("anonymus can not write plasma locations", async () => {
        const db = authedApp(null)
        const profile = db.collection(collection)
        await firebase.assertFails(profile.add({ id: "test" }))
    })
    it("anonymus can not delete plasma locations", async () => {
        const db = authedApp(null)
        const profile = db.collection(collection).doc("foo")
        await firebase.assertFails(profile.delete())
    })
    it("logged in user can delete plasma locations", async () => {
        const db = authedApp({ uid: "alice", email_verified: true })
        const profile = db.collection(collection).doc("foo")
        await firebase.assertSucceeds(profile.update({ id: "foo" }))
    })
    it("logged in user can write plasma locations", async () => {
        const db = authedApp({ uid: "alice", email_verified: true })
        const profile = db.collection(collection)
        await firebase.assertSucceeds(profile.add({ id: "test" }))
    })
    it("logged in user can delete plasma locations", async () => {
        const db = authedApp({ uid: "alice", email_verified: true })
        const profile = db.collection(collection).doc("foo")
        await firebase.assertSucceeds(profile.delete())
    })
    it("logged in user can delete plasma locations", async () => {
        const db = authedApp({ uid: "alice", email_verified: true })
        const profile = db.collection(collection).doc("foo")
        await firebase.assertSucceeds(profile.update({ id: "foo" }))
    })
})
