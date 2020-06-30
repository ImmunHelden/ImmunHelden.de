import React, { useState } from "react"
import { Location } from '@reach/router'
import firebase from "gatsby-plugin-firebase"
import { useDocument } from "react-firebase-hooks/firestore"
import { useSession } from "../../hooks/use-session"
import { EditForm } from './edit-form'
import { FormattedMessage, } from "gatsby-plugin-intl"
import { LOCATION_COLLECTION } from "."

export const EditPage = ({ docId, onError }) => {
    const { user, partnerConfigs, isLoading } = useSession()
    console.log(user, partnerConfigs, isLoading) // <- all undefined

    if (docId == "new") {
        const doc = firebase.firestore().collection(LOCATION_COLLECTION).add({
            partnerId: "" // TODO
        })
        docId = doc.id
    }

    const [doc, loading, error] = useDocument(
        firebase.firestore().collection(LOCATION_COLLECTION).doc(docId), {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )

    return (
        <div>
            <h1>
                <FormattedMessage id="partnerLocation_editEntry" />
            </h1>
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <span>Document: Loading...</span>}
            {doc && (
                <EditForm
                    partnerId={doc.partnerId}
                    collection={LOCATION_COLLECTION}
                    docId={docId}
                    doc={doc.data()}
                    onError={onError}
                />
            )}
        </div>
    )

}

export default EditPage
