import React, { useState, useEffect } from "react"
import firebase from "gatsby-plugin-firebase"
import { useSession } from "../../hooks/use-session"
import { EditForm } from './edit-form'
import { FormattedMessage, navigate, } from "gatsby-plugin-intl"
import { LOCATION_COLLECTION } from "."

function fetchDoc(docId, onError) {
    const locations = firebase.firestore().collection(LOCATION_COLLECTION)
    return locations.doc(docId).get().catch(onError)
}

async function createDoc(partnerIds, onError) {
  // TODO: Issue this error to sentry
  if (!partnerIds || partnerIds.length === 0)
    throw new Error("partnerId/unavailable")

  const locations = firebase.firestore().collection(LOCATION_COLLECTION)
  return (await locations.add({ partnerId: partnerIds[0] })).get()
}

export const EditPage = ({ docId, onError }) => {
    const { user, partnerConfigs, isLoading } = useSession()
    const [doc, setDoc] = useState(null)

    // Navigate back to the overview page and report errors there.
    const abortError = (err) => {
      navigate("/partner/", {
        replace: true,
        state: { result: err },
      })
    }

    // Once the session is loaded, we can load the document.
    // Getting an async function to work here requires the IIFE hack.
    useEffect(() => { (async function loadDoc() {
      // Isn't there a way to get rid of this check and instead "await" it?
      if (isLoading)
        return;

      const doc = await ((docId === "new")
                ? createDoc(user.partnerIds, abortError)
                : fetchDoc(docId, abortError))

      if (user.partnerIds.includes(doc.get("partnerId"))) {
        setDoc(doc)
      }
      else {
        // Everyone could read, but write would fail. Let's just prevent people
        // from enter the edit page for locations of other partners altogether.
        abortError("partnerId/inaccessible")
      }
    })() }, [isLoading])

    return (
        <div>
            <h1>
                <FormattedMessage id="partnerLocation_editEntry" />
            </h1>
            {!doc && <span>Document: Loading...</span>}
            {doc && (
                <EditForm
                    docId={doc.id}
                    doc={doc.data()}
                    onError={onError}
                />
            )}
        </div>
    )

}

export default EditPage
