import React, { useState } from "react"
import { Location } from '@reach/router'
import queryString from 'query-string'
import firebase from "gatsby-plugin-firebase"
import { useDocument } from "react-firebase-hooks/firestore"
import { EditForm } from '../../../components/location/edit-form'
import MuiAlert from "@material-ui/lab/Alert"
import { FormattedMessage, navigate, useIntl } from "gatsby-plugin-intl"
import { Snackbar } from "@material-ui/core"
import { ErrorBoundary } from "../../../components/error/error-boundary"

function Alert({ open, severity, message, onClose }) {
    return (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            autoHideDuration={6000}
            open={open}
            onClose={onClose}
        >
            <MuiAlert elevation={6} variant="filled" severity={severity}>
                {message}
            </MuiAlert>
        </Snackbar>
    )
}

const EditLocations = ({ location }) => {
    const { formatMessage } = useIntl()
    const [alert, setAlert] = useState({ message: null, severity: "error", open: false })
    const onError = ({ code }) => {
        setAlert({
            open: true,
            message: formatMessage({ id: code }),
            severity: "error",
        })
    }
    const closeAlert = () => setAlert({ ...alert, open: false })

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
            <Alert {...alert} onClose={closeAlert} />
            <div>
                <h1>
                    <FormattedMessage id="partnerLocation_editEntry" />
                </h1>
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <span>Document: Loading...</span>}
                {doc && (
                    <EditForm
                        partnerId={state.partnerId}
                        collection={state.collection}
                        docId={params.edit}
                        doc={doc.data()}
                        onError={onError}
                    />
                )}
            </div>
        </ErrorBoundary>
    )

}

export default EditLocations
