import React, { useEffect, useState } from "react"
import { navigate } from "gatsby-plugin-intl"
import { useAuth } from "../hooks/use-auth"
import firebase from "gatsby-plugin-firebase"
import { userContext } from "../hooks/use-session"

export const Protected = ({ children, loginUrl }) => {
    const { initializing, user } = useAuth(firebase)
    const [partner, setPartner] = useState(null)

    useEffect(() => {
        async function getPartner() {
            if (user) {
                const res = await firebase.firestore().collection("users").doc(user.uid).get()
                if (res.exists) {
                    setPartner(res.data().partner ?? null)
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
        return <error>NotLoggedIn</error>
    }
    return <userContext.Provider value={{ user, partner }}>{children}</userContext.Provider>
}
