import React from "react"
import { useSession } from "../../hooks/use-session"
import firebase from "gatsby-plugin-firebase"
import "@material-ui/icons"
import { Grid, Paper } from "@material-ui/core"
import { LocationTable } from "./location-table"
import { useCollection } from "react-firebase-hooks/firestore"
import { mapLocation } from "../../util/location"
import { isNode } from "@firebase/util"
import { FormattedMessage } from "gatsby-plugin-intl"

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

export const LocationOverview = () => {
    const { partner } = useSession()
    const [collection] = useCollection(getQuery(partner), {
        snapshotListenOptions: { includeMetadataChanges: true },
    })
    const locations =
        collection?.docs?.reduce((prev, doc) => mapLocation(prev, { ...doc.data(), id: doc.id }), []) ?? []
    return (
        <Grid container justify="center" spacing={0}>
            <Grid item xs={12} lg={10}>
                <Paper style={{ maxWidth: "100%" }}>
                    <h1>
                        <FormattedMessage id="partnerLocationsTitle" />
                    </h1>
                    <LocationTable partner={partner} locations={locations} />
                </Paper>
            </Grid>
        </Grid>
    )
}
