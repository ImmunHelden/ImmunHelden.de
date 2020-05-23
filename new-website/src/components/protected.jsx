import React, { useEffect, useState } from "react"
import { navigate } from "gatsby-plugin-intl"
import { useAuth } from "../hooks/use-auth"
import firebase from "gatsby-plugin-firebase"
import { userContext } from "../hooks/use-session"

export const Protected = ({ children, loginUrl }) => {
    const { initializing, user } = useAuth(firebase)
    const [partners, setPartners] = useState(null)

    useEffect(() => {
        async function getPartners() {
            if (user) {
                const res = await firebase.firestore().collection("users").doc("iHEgHzEO6Xbdk7cuUfMKtSdIt6q2").get()
                if (res.exists) {
                    setPartners(res.data().partners)
                }
            }
        }
        getPartners()
    }, [user])

    if (initializing) {
        return <h1>...</h1>
    }

    if (!user) {
        navigate(loginUrl)
        return <error>NotLoggedIn</error>
    }

    return <userContext.Provider value={{ user, partners }}>{children}</userContext.Provider>
}
