import React, { useState } from "react"
import { navigate } from "gatsby-plugin-intl"
import firebase from "gatsby-plugin-firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import Login from "./login"
import Register from "./register"

export const LoginRegisterForm = ({ loginSuccessUrl }) => {
    const [showLogin, setShowLogin] = useState(true)
    const switchScreen = () => setShowLogin(!showLogin)
    const [user, loading] = useAuthState(firebase.auth())

    if (user) {
        navigate(loginSuccessUrl)
    }

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <>
            {showLogin && [
                <Login key="login" successUrl={loginSuccessUrl} />,
                <div key="doNotHaveAccountKey">
                    Don't have an Account? <a onClick={switchScreen}>Sign up</a>
                </div>,
            ]}
            {!showLogin && [
                <Register key="register" />,
                <div key="doHaveAccountKey">
                    Already have an Account? <a onClick={switchScreen}>Sign in</a>
                </div>,
            ]}
        </>
    )
}
