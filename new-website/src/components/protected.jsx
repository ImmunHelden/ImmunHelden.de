import React, { useEffect, useState } from "react"
import { navigate } from "gatsby-plugin-intl"
import { useAuth } from "../hooks/use-auth"
import firebase from "gatsby-plugin-firebase"
import { userContext } from "../hooks/use-session"
import { Roller } from "react-spinners-css"
import { Paper, makeStyles, Grid } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    loading: {
        display: "flex",
        justifyContent: "center",
        height: "400px",
        alignItems: "center",
    },
    padding: {
        padding: 10,
    },
}))

export const Protected = ({ children, loginUrl }) => {
    const { initializing, user } = useAuth(firebase)
    const [partner, setPartner] = useState(null)
    const classes = useStyles()

    useEffect(() => {
        async function getPartner() {
            if (user) {
                try {
                    const res = await firebase.firestore().collection("users").doc(user.uid).get()
                    if (res.exists) {
                        setPartner(res.data().partner ?? null)
                    }
                } catch (err) {
                    console.log(err.message, user.uid)
                }
            }
        }
        getPartner()
    }, [user])

    if (initializing) {
        return (
            <Grid container justify="center" alignContent="center" spacing={0} style={{ height: "100%" }}>
                <Grid item xs={12} md={8} lg={5} xl={3}>
                    <Paper className={classes.padding}>
                        <div className={classes.loading}>
                            <Roller />
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        )
    }

    if (!user || !user.emailVerified) {
        navigate(loginUrl)

        // return <Alert severity="error">You are not logged in!</Alert>
    }

    return <userContext.Provider value={{ user, partner }}>{children}</userContext.Provider>
}
