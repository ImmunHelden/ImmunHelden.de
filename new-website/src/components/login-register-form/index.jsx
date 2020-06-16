import React, { useState } from "react"
import { navigate, useIntl, FormattedMessage } from "gatsby-plugin-intl"
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

export const screens = {
    LOGIN: "login",
    REGISTER: "register",
    VERIFY: "verify",
}

const isUserEmailVerified = user => user?.emailVerified

export const LoginRegisterForm = ({ loginSuccessUrl, screen = screens.LOGIN }) => {
    const [showScreen, setShowScreen] = useState(screen)
    const { formatMessage } = useIntl()
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
    const onError = (code = "unkown_error", message) => {
        try {
            setAlert({
                open: true,
                message: formatMessage({ id: code }),
                severity: "error",
            })
        } catch (err) {
            console.error("Login/Signup Error", { code, err, message })
        }
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
                    <FormattedMessage id="loginScreen_noAccount" />
                    <Button variant="text" onClick={switchToRegister}>
                        <FormattedMessage id="loginScreen_signUp" />
                    </Button>
                </div>,
            ]}
            {showScreen === screens.REGISTER && [
                <Register key="register" onError={onError} onSuccess={onSuccess} />,
                <div key="doHaveAccountKey">
                    <FormattedMessage id="loginScreen_hasAccount" />
                    <Button variant="text" onClick={switchToLogin}>
                        <FormattedMessage id="loginScreen_signIn" />
                    </Button>
                </div>,
            ]}
            {showScreen === screens.VERIFY && <Verify key="verify" onError={onError} onSuccess={onVerifySuccess} />}
        </>
    )
}
