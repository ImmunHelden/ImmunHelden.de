import React, { useState } from "react"
import { useSession } from "../../hooks/use-session"
import "@material-ui/icons"
import { Grid, Paper, Snackbar } from "@material-ui/core"
import { LocationTable } from "./location-table"
import { FormattedMessage, useIntl } from "gatsby-plugin-intl"
import MuiAlert from "@material-ui/lab/Alert"
import { ErrorBoundary } from "../error/error-boundary"

export const LOCATION_COLLECTION = "locations"

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

export const LocationOverview = ({ state }) => {
    const { formatMessage } = useIntl()
    const [alert, setAlert] = useState({ message: null, severity: "error", open: false })
    const { user, partnerConfigs, isLoading } = useSession()

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

    React.useEffect(() => {
        if (state && state.editResult) {
            if (state.editResult === "saved") {
                onSuccess("partnerLocation_entrySaved")
            }
            else {
                onError({ code: state.editResult })
            }
        }
    }, [])

    const closeAlert = () => setAlert({ ...alert, open: false })

    return (
        <ErrorBoundary>
            <Alert {...alert} onClose={closeAlert} />
            <Grid container justify="center" spacing={0} style={{ height: "100%" }}>
                <Grid item xs={12} lg={10}>
                    <Paper style={{ maxWidth: "100%" }}>
                        {user.partnerIds && (
                            <>
                                <h1 style={{padding: 10}}>
                                    <FormattedMessage id="partnerLocationsTitle" />
                                </h1>
                                <LocationTable
                                    isLoading={isLoading}
                                    userAllowedPartnerIds={user.partnerIds}
                                    partnerConfigs={partnerConfigs}
                                    onError={onError}
                                    onSuccess={onSuccess}
                                />
                            </>
                        )}
                        {!user.partnerIds && <FormattedMessage id="partnerUserNoOrga" />}
                    </Paper>
                </Grid>
            </Grid>
        </ErrorBoundary>
    )
}
