import React, { useState } from "react"
import { navigate } from "gatsby-plugin-intl"
import firebase from "gatsby-plugin-firebase"
import Login from "./login"
import Register from "./register"
import { isNode } from "@firebase/util"
import { useAuth } from "../../hooks/use-auth"

export const LoginRegisterForm = ({ loginSuccessUrl }) => {
    const [showLogin, setShowLogin] = useState(true)
    const switchScreen = () => setShowLogin(!showLogin)
    const { initializing, user } = useAuth(firebase)

    if (user) {
        navigate(loginSuccessUrl)
    }

    if (initializing) {
        return <h1>initializing</h1>
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
