import React, { useState, useEffect, useCallback } from "react"
import firebase from "gatsby-plugin-firebase"
import { useSession } from "../../hooks/use-session"
import { EditForm } from './edit-form'
import { Grid, Paper } from "@material-ui/core"
import { FormattedMessage, navigate, } from "gatsby-plugin-intl"
import { sentryWarn } from '../../util/sentry'
import { LOCATION_COLLECTION } from "."
import { mayTrimErrorPrefix } from "../../util/errors"

async function fetchDoc(partnerIds, docId) {
  const locations = firebase.firestore().collection(LOCATION_COLLECTION)
  const doc = await locations.doc(docId).get();
  if (!doc.exists) {
    sentryWarn("Attempt to access a nonexistent map entry")
    throw new Error("partnerLocation/entryNotFound")
  }

  // Everyone could read, but write would fail. Let's just prevent people
  // from entering the edit page for foreign locations altogether.
  const docOwner = doc.get("partnerId")
  if (!partnerIds.includes(docOwner)) {
    sentryWarn("Attempt to access the map entry of another partner")
    throw new Error("partnerId/inaccessible")
  }

  return doc
}

async function createDoc(partnerIds) {
  if (!partnerIds || partnerIds.length === 0) {
    sentryWarn("Attempt to create map entry without associated partner ID")
    throw new Error("partnerId/unavailable")
  }

  const locations = firebase.firestore().collection(LOCATION_COLLECTION)
  const docRef = await locations.add({ partnerId: partnerIds[0] })
  return await docRef.get()
}

export const EditPage = ({ docId, onError }) => {
    const { user, isLoading } = useSession()
    const [doc, setDoc] = useState(null)

    // Navigate back to the overview page and report errors there.
    const errorAbort = useCallback((err) => {
      navigate("/partner/", {
        replace: true,
        state: { result: mayTrimErrorPrefix(err) },
      })
    }, [])

    // Once the session is loaded, we can load the document.
    // Getting an async function to work here requires the IIFE hack.
    useEffect(() => { (async function loadDoc() {
      // Isn't there a way to get rid of this check and instead "await" it?
      if (isLoading)
        return;

      try {
        const doc = (docId === "new") ? createDoc(user.partnerIds)
                                      : fetchDoc(user.partnerIds, docId)
        setDoc(await doc)
      } catch (err) {
        errorAbort(err)
      }
    })() }, [isLoading, user, docId, errorAbort])

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
