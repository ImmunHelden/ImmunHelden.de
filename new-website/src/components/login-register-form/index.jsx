import React, { useState } from "react"
import { navigate } from "gatsby-plugin-intl"
import firebase from "gatsby-plugin-firebase"
import Login from "./login"
import Register from "./register"
import { useAuth } from "../../hooks/use-auth"
import MuiAlert from "@material-ui/lab/Alert"
import { Snackbar, Button } from "@material-ui/core"
import Verify from "./verify"

function Alert({ open, severity, message, onClose }) {
    return (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            autoHideDuration={6000}
            open={open}
            onClose={onClose}
        >
            <MuiAlert elevation={6} variant="filled" severity={severity}>
                {message}
            </MuiAlert>
        </Snackbar>
    )
}

const isWrongPasswordOrEmail = code => ["auth/user-not-found", "auth/wrong-password"].includes(code)
const isWeakPassword = code => ["auth/weak-password"].includes(code)
const isAccountExists = code => ["auth/email-already-in-use"].includes(code)

function readableErrorMessage(code, message) {
    if (isWrongPasswordOrEmail(code)) {
        return "Wrong Username or Password!"
    }
    if (isWeakPassword(code)) {
        return "Password to weak!"
    }
    if (isAccountExists(code)) {
        return "The email address is already in use."
    }
    if (code === "verify/spam-protection") {
        return "Already send verification email in the last 5 min"
    }
    if (code === "verify/already-verified") {
        return "Already verified"
    }
    return `${code} - ${message}`
}

const screens = {
    LOGIN: "login",
    REGISTER: "register",
    VERIFY: "verify",
}

const isUserEmailVerified = user => user?.emailVerified

export const LoginRegisterForm = ({ loginSuccessUrl }) => {
    const [showScreen, setShowScreen] = useState(screens.LOGIN)

    const { user } = useAuth(firebase)
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "error",
    })

    const switchToLogin = () => showScreen !== screens.LOGIN && setShowScreen(screens.LOGIN)
    const switchToRegister = () => showScreen !== screens.REGISTER && setShowScreen(screens.REGISTER)
    const switchToVerify = () => showScreen !== screens.VERIFY && setShowScreen(screens.VERIFY)

    if (!user) {
        if (showScreen === screens.VERIFY) {
            switchToLogin()
        }
    } else {
        if (isUserEmailVerified(user)) {
            navigate(loginSuccessUrl)
            return <p>...</p>
        }

        if (!isUserEmailVerified(user) && showScreen !== screens.VERIFY) {
            switchToVerify()
        }
    }
    const onError = (code, message) => {
        setAlert({
            open: true,
            message: readableErrorMessage(code, message),
            severity: "error",
        })
    }

    const onSuccess = user => {
        if (user?.emailVerified) {
            navigate(loginSuccessUrl)
        }
        setShowScreen(screens.VERIFY)
    }

    const onVerifySuccess = message => {
        setAlert({
            open: true,
            message,
            severity: "info",
        })
    }

    const closeAlert = () => setAlert({ ...alert, open: false })

    return (
        <>
            <Alert {...alert} onClose={closeAlert} />
            {showScreen === screens.LOGIN && [
                <Login key="login" onSuccess={onSuccess} onError={onError} />,
                <div key="doNotHaveAccountKey">
                    Don't have an Account?{" "}
                    <Button variant="text" onClick={switchToRegister}>
                        Sign up
                    </Button>
                </div>,
            ]}
            {showScreen === screens.REGISTER && [
                <Register key="register" onError={onError} onSuccess={onSuccess} />,
                <div key="doHaveAccountKey">
                    Already have an Account?{" "}
                    <Button variant="text" onClick={switchToLogin}>
                        Sign in
                    </Button>
                </div>,
            ]}
            {showScreen === screens.VERIFY && <Verify key="verify" onError={onError} onSuccess={onVerifySuccess} />}
        </>
    )
}
