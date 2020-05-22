import React from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import firebase from "gatsby-plugin-firebase"
import { navigate } from "gatsby-plugin-intl"

export const Protected = ({ children, loginUrl }) => {
    const [user, loading] = useAuthState(firebase.auth())
    if (loading) {
        return <h1>...</h1>
    }
    if (!user) {
        navigate(loginUrl)
        return <h1>NotLoggedIn</h1>
    }
    return <div>{children}</div>
}
