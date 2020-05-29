import React, { useState, useEffect } from "react"
import firebase from "gatsby-plugin-firebase"
import { Grid, Paper } from "@material-ui/core"
import { useSession } from "../../../hooks/use-session"
import { useCollection } from "react-firebase-hooks/firestore"
import { isNode } from "@firebase/util"
import { Spinner } from "react-spinners-css"
import { Invite } from "./invite"

/**
 * Fixes the issue with building the pages since
 * Firebase is not available during build time in nodejs
 * @param {string} partner
 */
const getQuery = partnerId => {
    if (isNode() || !partnerId) {
        return null
    }
    return firebase.firestore().collection("partner").doc(partnerId).collection("invites")
}

const renderInvites = (invites = []) => (
    <ul>
        {invites?.map(invite => (
            <Invite invite={invite} />
        ))}
    </ul>
)

export const Invites = () => {
    const { partner } = useSession()
    const [invites, setInvites] = useState([])
    const [collection, loading, error] = useCollection(getQuery(partner), {
        snapshotListenOptions: { includeMetadataChanges: true },
    })

    useEffect(() => {
        setInvites(collection?.docs?.map(doc => doc.data()))
    }, [collection])

    const isLoading = (!collection || loading) && !error
    if (isLoading || error?.code === "permission-denied") {
        return null
    }

    return (
        <Grid container justify="center" spacing={0}>
            <Grid item xs={12} lg={10}>
                <Paper style={{ maxWidth: "100%" }}>
                    <h1>Invites</h1>
                    {isLoading && <Spinner></Spinner>}
                    {!isLoading && !error && renderInvites(invites)}
                    {error && <div style={{ color: "red" }}>{error.message}</div>}
                </Paper>
            </Grid>
        </Grid>
    )
}
