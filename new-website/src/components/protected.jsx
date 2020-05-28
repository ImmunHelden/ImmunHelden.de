import React, { useEffect, useState } from "react"
import { navigate } from "gatsby-plugin-intl"
import { useAuth } from "../hooks/use-auth"
import firebase from "gatsby-plugin-firebase"
import { userContext } from "../hooks/use-session"
import { LoadingScreen } from "./loadingScreen"

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
        return <LoadingScreen />
    }

    if (!user || !user.emailVerified) {
        navigate(loginUrl)
    }

    return <userContext.Provider value={{ user, partner }}>{children}</userContext.Provider>
}
