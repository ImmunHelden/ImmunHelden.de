import React from "react"
import { Paper, Grid, TextField, Button } from "@material-ui/core"
import { Face, Fingerprint } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import { useForm } from "react-hook-form"
import firebase from "gatsby-plugin-firebase"
import LoginSVG from "../../images/svg/undraw_Login_v483.svg"
import { FormattedMessage, useIntl } from "gatsby-plugin-intl"

const useStyles = makeStyles(theme => ({
    margin: {
        margin: 10 * 2,
    },
    padding: {
        padding: 10,
    },
}))

const Login = ({ onError = () => {}, onSuccess = () => {} }) => {
    const { formatMessage } = useIntl()
    const classes = useStyles()
    const { register, handleSubmit } = useForm()

    const onSubmit = ({ email, password }) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(user => onSuccess(user))
            .catch(error => onError(error.code, error.message))
    }

    return (
        <Paper className={classes.padding}>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.margin}>
                <Grid container direction="column" justify="center" alignContent="center">
                    <Grid item>
                        <h1>
                            <FormattedMessage id="loginScreen_login_title" />
                        </h1>
                    </Grid>
                    <Grid item style={{ textAlign: "center" }}>
                        <LoginSVG style={{ height: "auto", width: "10rem" }} />
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="flex-end">
                    <Grid item>
                        <Face />
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField
                            id="email"
                            label={formatMessage({ id: "email" })}
                            type="email"
                            name="email"
                            inputRef={register({ required: true })}
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="flex-end">
                    <Grid item>
                        <Fingerprint />
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField
                            id="password"
                            label={formatMessage({ id: "password" })}
                            name="password"
                            inputRef={register({ required: true })}
                            type="password"
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>
                <Grid container justify="center" style={{ marginTop: "10px" }}>
                    <Button type="submit" variant="outlined" color="primary" style={{ textTransform: "none" }}>
                        <FormattedMessage id="loginScreen_signIn" />
                    </Button>
                </Grid>
            </form>
        </Paper>
    )
}

export default Login
