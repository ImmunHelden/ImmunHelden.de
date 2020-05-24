import React, { useEffect, useState } from "react"
import { navigate } from "gatsby-plugin-intl"
import { useAuth } from "../hooks/use-auth"
import firebase from "gatsby-plugin-firebase"
import { userContext } from "../hooks/use-session"
import MuiAlert from "@material-ui/lab/Alert"

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

export const Protected = ({ children, loginUrl }) => {
    const { initializing, user } = useAuth(firebase)
    const [partner, setPartner] = useState(null)

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
        return <h1>...</h1>
    }

    if (!user) {
        navigate(loginUrl)
        return <Alert severity="error">You are not logged in!</Alert>
    }
                                   
    if (!user.emailVerified) {
        return <Alert severity="error">Email address is not verified!</Alert>
    }

    return <userContext.Provider value={{ user, partner }}>{children}</userContext.Provider>
}
