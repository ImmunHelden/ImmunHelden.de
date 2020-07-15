import React, { useState, useEffect } from "react"
import firebase from "gatsby-plugin-firebase"
import { useSession } from "../../hooks/use-session"
import { EditForm } from './edit-form'
import { Grid, Paper, Snackbar } from "@material-ui/core"
import { FormattedMessage, navigate, } from "gatsby-plugin-intl"
import * as Sentry from "@sentry/browser"
import { LOCATION_COLLECTION } from "."
import { mayTrimErrorPrefix } from "../../util/errors"

function fetchDoc(docId) {
  const locations = firebase.firestore().collection(LOCATION_COLLECTION)
  return locations.doc(docId).get()
}

async function createDoc(partnerIds) {
  if (!partnerIds || partnerIds.length === 0) {
    Sentry.withScope(scope => {
      scope.setLevel("warning")
      Sentry.captureEvent({
        message: "Attempt to create map entry without associated partner ID"
      })
    })
    throw new Error("partnerId/unavailable")
  }

  const locations = firebase.firestore().collection(LOCATION_COLLECTION)
  return (await locations.add({ partnerId: partnerIds[0] })).get()
}

export const EditPage = ({ docId, onError }) => {
    const { user, isLoading } = useSession()
    const [doc, setDoc] = useState(null)

    // Navigate back to the overview page and report errors there.
    const errorAbort = (err) => {
      navigate("/partner/", {
        replace: true,
        state: { result: mayTrimErrorPrefix(err) },
      })
    }

    // Once the session is loaded, we can load the document.
    // Getting an async function to work here requires the IIFE hack.
    useEffect(() => { (async function loadDoc() {
      // Isn't there a way to get rid of this check and instead "await" it?
      if (isLoading)
        return;

      try {
        const doc = await ((docId === "new") ? createDoc(user.partnerIds)
                                             : fetchDoc(docId))

        // Everyone could read, but write would fail. Let's just prevent people
        // from entering the edit page for foreign locations altogether.
        if (!user.partnerIds.includes(doc.get("partnerId")))
          throw new Error("partnerId/inaccessible")

        setDoc(doc)
      } catch (err) {
        errorAbort(err)
      }
    })() }, [isLoading])

    return (
        <Grid container justify="center" spacing={0} style={{ height: "100%" }}>
            <Grid item xs={12} lg={10}>
                <Paper style={{ maxWidth: "100%" }}>
                  <h1>
                      <FormattedMessage id="partnerLocation_editEntry" />
                  </h1>
                  {!doc && <span>Document: Loading...</span>}
                  {doc && (
                      <EditForm
                          docId={doc.id}
                          doc={doc.data()}
                          onError={err => onError(mayTrimErrorPrefix(err))}
                      />
                  )}
                </Paper>
            </Grid>
        </Grid>
    )

}

export default EditPage
