import React, { useState } from "react"
import { useSession } from "../../hooks/use-session"
import firebase from "gatsby-plugin-firebase"
import "@material-ui/icons"
import { Grid, Paper, Snackbar } from "@material-ui/core"
import { LocationTable } from "./location-table"
import { useCollection } from "react-firebase-hooks/firestore"
import { mapLocation } from "../../util/location"
import { isNode } from "@firebase/util"
import { FormattedMessage, useIntl } from "gatsby-plugin-intl"
import MuiAlert from "@material-ui/lab/Alert"

export const LOCATION_COLLECTION = "plasma"

/**
 * Fixes the issue with building the pages since
 * Firebase is not available during build time in nodejs
 * @param {string} partner
 */
const getQuery = partner => {
    if (isNode()) {
        return null
    }
    return firebase.firestore().collection(LOCATION_COLLECTION).where("partnerId", "==", partner)
}

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

export const LocationOverview = () => {
    const { formatMessage } = useIntl()
    const [alert, setAlert] = useState({ message: null, severity: "error", open: false })
    const { partner } = useSession()
    const [collection] = useCollection(getQuery(partner), {
        snapshotListenOptions: { includeMetadataChanges: true },
    })
    const locations =
        collection?.docs?.reduce((prev, doc) => mapLocation(prev, { ...doc.data(), id: doc.id }), []) ?? []

    const onError = ({ code }) => {
        setAlert({
            open: true,
            message: formatMessage({ id: code }),
            severity: "error",
        })
    }

    const closeAlert = () => setAlert({ ...alert, open: false })

    return (
        <>
            <Alert {...alert} onClose={closeAlert} />
            <Grid container justify="center" spacing={0} style={{ height: "100%" }}>
                <Grid item xs={12} lg={10}>
                    <Paper style={{ maxWidth: "100%" }}>
                        <h1>
                            <FormattedMessage id="partnerLocationsTitle" />
                        </h1>
                        <LocationTable partner={partner} locations={locations} onError={onError} />
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}
