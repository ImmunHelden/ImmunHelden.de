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
import { ErrorBoundary } from "../error/error-boundary"

export const LOCATION_COLLECTION = "plasma"

/**
 * Fixes the issue with building the pages since
 * Firebase is not available during build time in nodejs
 * @param {string} partner
 */
const getQuery = partnerIds => {
    if (isNode() || !partnerIds || partnerIds.length === 0) {
        return null
    }
    return firebase.firestore().collection(LOCATION_COLLECTION).where("partnerId", "in", partnerIds)
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

export const LocationOverview = ({ location }) => {
    const { formatMessage } = useIntl()
    const [alert, setAlert] = useState({ message: null, severity: "error", open: false })
    const { user, partnerConfigs, isLoading } = useSession("LocationOverview")
    const { partnerIds } = user

    const [collection] = useCollection(getQuery(partnerIds), {
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

    const onSuccess = (msg) => {
        setAlert({
            open: true,
            message: formatMessage({ id: msg }),
            severity: "success",
        })
    }

    // This isn't working currently. Passing the 'sucess' state from the edit page
    // back here should work like this (and it used to work the other way around):
    // https://www.gatsbyjs.org/docs/gatsby-link/#pass-state-as-props-to-the-linked-page

    console.log("Location:", location)
    if (location?.state?.saved == "success") {
        onSuccess("partnerLocation_entrySaved")
    }

    const closeAlert = () => setAlert({ ...alert, open: false })

    return (
        <ErrorBoundary>
            <Alert {...alert} onClose={closeAlert} />
            <Grid container justify="center" spacing={0} style={{ height: "100%" }}>
                <Grid item xs={12} lg={10}>
                    <Paper style={{ maxWidth: "100%" }}>
                        {partnerIds && (
                            <>
                                <h1>
                                    <FormattedMessage id="partnerLocationsTitle" />
                                </h1>
                                <LocationTable
                                    isLoading={isLoading}
                                    userAllowedPartnerIds={user.partnerIds}
                                    partnerConfigs={partnerConfigs}
                                    locations={locations}
                                    onError={onError}
                                />
                            </>
                        )}
                        {!partnerIds && <FormattedMessage id="partnerUserNoOrga" />}
                    </Paper>
                </Grid>
            </Grid>
        </ErrorBoundary>
    )
}
