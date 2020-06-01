import React from "react"
import { Paper, Grid, Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import firebase from "gatsby-plugin-firebase"
import { useAuth } from "../../hooks/use-auth"
import PostBoxSVG from "../../images/svg/undraw_mail_box_kd5i.svg"
import { usePersistedState } from "../../hooks/use-persisted-state"
import { FormattedMessage } from "gatsby-plugin-intl"

const useStyles = makeStyles(theme => ({
    margin: {
        margin: 10 * 2,
    },
    padding: {
        padding: 10,
    },
}))

const FIVE_MIN = 5 * 60 * 1000
const isSpamProtectionActive = verifiedLast => new Date() - new Date(verifiedLast) <= FIVE_MIN

const Verify = ({ onError = () => {}, onSuccess = () => {} }) => {
    const { user, signOut } = useAuth(firebase)
    const [verifiedLast, setVerifiedLast] = usePersistedState("lastVerifySend")
    const classes = useStyles()
    const email = user?.email ?? "..."

    const sendEmail = () => {
        if (!user) {
            onError("something-wrong")
            return
        }
        if (isSpamProtectionActive(verifiedLast)) {
            onError("verify/spam-protection")
            return
        }
        if (user.emailVerified) {
            onError("verify/already-verified")
            return
        }
        user.sendEmailVerification()
            .then(() => {
                setVerifiedLast(new Date())
                onSuccess("Email sent.")
            })
            .catch(error => onError(error.code, error.message))
    }

    // Send automatically an email if we did not already.
    // usually happens when the user just registered.
    if (!verifiedLast) {
        sendEmail()
    }

    return (
        <Paper className={classes.padding}>
            <div className={classes.margin}>
                <Grid container spacing={8} justify="center">
                    <Grid item style={{ textAlign: "center" }}>
                        <h1>
                            <FormattedMessage id="loginScreen_verify_title" />
                        </h1>
                        <h2>
                            <FormattedMessage id="loginScreen_verify_subtitle" />
                        </h2>
                    </Grid>
                    <Grid item>
                        <PostBoxSVG style={{ height: "auto", width: "10rem" }} />
                    </Grid>
                    <Grid item>
                        <h4>
                            <FormattedMessage values={{ email }} id="loginScreen_verify_body" />
                        </h4>
                    </Grid>
                </Grid>
                <Grid container justify="center" style={{ marginTop: "10px" }}>
                    <Button variant="outlined" color="primary" onClick={sendEmail}>
                        <FormattedMessage id="loginScreen_verify_resend" />
                    </Button>
                    <Button color="primary" onClick={signOut}>
                        <FormattedMessage id="loginScreen_verify_notMyEmail" />
                    </Button>
                </Grid>
            </div>
        </Paper>
    )
}

export default Verify
