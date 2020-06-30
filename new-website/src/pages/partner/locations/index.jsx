import React, { useState } from "react"
import queryString from 'query-string'
import { EditPage } from '../../../components/location/edit-page'
import MuiAlert from "@material-ui/lab/Alert"
import { useIntl } from "gatsby-plugin-intl"
import Layout from "../../../components/layout"
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
    const [alert, setAlert] = useState({ message: null, severity: "error", open: false })
    const closeAlert = () => setAlert({ ...alert, open: false })

    const { formatMessage } = useIntl()
    const onError = ({ code }) => {
        setAlert({
            open: true,
            message: formatMessage({ id: code }),
            severity: "error",
        })
    }

    const editParam = queryString.parse(location?.search)?.edit || 'new'
    return (
        <ErrorBoundary>
            <Layout>
                <Alert {...alert} onClose={closeAlert} />
                <EditPage docId={editParam} onError={onError} />
            </Layout>
        </ErrorBoundary>
    )

}

export default EditLocations
