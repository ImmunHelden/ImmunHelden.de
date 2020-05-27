import React, { useEffect, useState } from "react"
import { useSession } from "../../hooks/use-session"
import firebase from "gatsby-plugin-firebase"
import MaterialTable from "material-table"
import "@material-ui/icons"
import { Grid, Paper } from "@material-ui/core"
import { LocationTable } from "./location-table"
import { useCollection } from "react-firebase-hooks/firestore"
import { mapLocation } from "../../util/location"
import { isNode } from "@firebase/util"

const useLocationCollection = partner => {
    if (isNode()) return [undefined, undefined, undefined]
    const [collection, loading, error] = useCollection(
        firebase.firestore().collection("blutspendende").where("partnerID", "==", partner),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )
    const locations =
        collection?.docs?.reduce((prev, doc) => mapLocation(prev, { ...doc.data(), id: doc.id }), []) ?? []
    return [locations, loading, error]
}

export const LocationOverview = () => {
    const { partner } = useSession()
    const [locations] = useLocationCollection(partner)
    return (
        <Grid container justify="center" spacing={0} style={{ height: "100%" }}>
            <Grid item xs={12} lg={10}>
                <Paper style={{ maxWidth: "100%" }}>
                    <h1>Locations</h1>
                    <LocationTable partner={partner} locations={locations} />
                </Paper>
            </Grid>
        </Grid>
    )
}
