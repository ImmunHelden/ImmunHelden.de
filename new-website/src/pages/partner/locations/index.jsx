import React, { useState } from "react"
import { Location } from '@reach/router'
import queryString from 'query-string'
import firebase from "gatsby-plugin-firebase"
import { useDocument } from "react-firebase-hooks/firestore"
import { EditForm } from '../../../components/location/edit-form'
import { ErrorBoundary } from "../../../components/error/error-boundary"

const EditLocations = ({ location }) => {
    const state = location.state;
    console.log(state);

    // TODO: User loggged in?
    // TODO: PartnerId valid
    // TODO: Permission to edit?

    const params = location.search ? queryString.parse(location.search) : {}
    if (!params.edit) {
        const doc = firebase.firestore().collection(state.collection).add({
            partnerId: state.partnerId
        })
        params.edit = doc.id
    }

    const [doc, loading, error] = useDocument(
        firebase.firestore().collection(state.collection).doc(params.edit), {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    return (
        <ErrorBoundary>
            <div>
                <h1>Edit entry</h1>
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <span>Document: Loading...</span>}
                {doc && (
                    <EditForm
                        partnerId={state.partnerId}
                        partnerConfig={state.partnerConfig}
                        docId={params.edit}
                        doc={doc.data()}
                    />
                )}
            </div>
        </ErrorBoundary>
    )

}

export default EditLocations
