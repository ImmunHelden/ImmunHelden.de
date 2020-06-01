import React, { useEffect, useState } from "react"
import { navigate } from "gatsby-plugin-intl"
import { LoadingScreen } from "./loadingScreen"
import { AuthContextProvider, AuthContext } from "./context/auth-context"
import { useContext } from "react"
import { UserContextProvider } from "./context/user-context"

const RedirectIfNotLoggedIn = ({ children, url }) => {
    const { state } = useContext(AuthContext)
    if (state.isLoading) {
        return <LoadingScreen />
    }
    if (!state.isLoading && !state.isAuthenticated) {
        navigate(url)
        return <LoadingScreen />
    }
    return <>{children}</>
}

export const Protected = ({ children, loginUrl }) => {
    return (
        <AuthContextProvider>
            <RedirectIfNotLoggedIn url={loginUrl}>
                <UserContextProvider>{children}</UserContextProvider>
            </RedirectIfNotLoggedIn>
        </AuthContextProvider>
    )
}
