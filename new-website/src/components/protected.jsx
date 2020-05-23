import React from "react"
import { navigate } from "gatsby-plugin-intl"
import { useAuth } from "../hooks/use-auth"
import firebase from "gatsby-plugin-firebase"
import { userContext } from "../hooks/use-session"

export const Protected = ({ children, loginUrl }) => {
    const { initializing, user } = useAuth(firebase)
    if (initializing) {
        return <h1>...</h1>
    }

    if (!user) {
        navigate(loginUrl)
        return <error>NotLoggedIn</error>
    }

    return <userContext.Provider value={{ user }}>{children}</userContext.Provider>
}
