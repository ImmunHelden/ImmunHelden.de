import React, { useState } from "react"
import queryString from 'query-string'
import { EditPage } from '../../../components/location/edit-page'
import MuiAlert from "@material-ui/lab/Alert"
import { useIntl } from "gatsby-plugin-intl"
import { Protected } from "../../../components/protected"
import Layout from "../../../components/layout"
import { Snackbar } from "@material-ui/core"

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
    const onError = (err) => {
        setAlert({
            open: true,
            message: formatMessage({ id: err }),
            severity: "error",
        })
    }

    const editParam = queryString.parse(location?.search)?.edit || 'new'
    return (
        <Layout>
            <Protected loginUrl="/partner/login">
                <Alert {...alert} onClose={closeAlert} />
                <EditPage docId={editParam} errorNote={onError} />
            </Protected>
        </Layout>
    )

}

export default EditLocations
