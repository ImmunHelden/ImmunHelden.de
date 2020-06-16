import React from "react"
import { Paper, Grid, TextField, Button } from "@material-ui/core"
import { Face, Fingerprint } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import { useForm } from "react-hook-form"
import firebase from "gatsby-plugin-firebase"
import RegisterSVG from "../../images/svg/undraw_welcome_3gvl.svg"
import { FormattedMessage, useIntl } from "gatsby-plugin-intl"

const useStyles = makeStyles(theme => ({
    margin: {
        margin: 10 * 2,
    },
    padding: {
        padding: 10,
    },
}))

const Register = ({ onError = () => {}, onSuccess = () => {} }) => {
    const classes = useStyles()
    const { formatMessage } = useIntl()
    const { register, handleSubmit } = useForm()

    const onSubmitRegister = ({ email, password }) => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(user => onSuccess(user))
            .catch(error => onError(error.code, error.message))
    }

    return (
        <Paper className={classes.padding}>
            <form onSubmit={handleSubmit(onSubmitRegister)} className={classes.margin}>
                <Grid container direction="column" justify="center" alignContent="center">
                    <Grid item>
                        <h1>
                            <FormattedMessage id="loginScreen_register_title" />
                        </h1>
                    </Grid>
                    <Grid item style={{ textAlign: "center" }}>
                        <RegisterSVG style={{ height: "auto", width: "10rem" }} />
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
                            fullWidth
                            required
                            inputRef={register({ required: true })}
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
                            type="password"
                            name="password"
                            fullWidth
                            required
                            inputRef={register({ required: true })}
                        />
                    </Grid>
                </Grid>
                <Grid container justify="center" style={{ marginTop: "10px" }}>
                    <Button type="submit" variant="outlined" color="primary" style={{ textTransform: "none" }}>
                        <FormattedMessage id="loginScreen_signUp" />
                    </Button>
                </Grid>
            </form>
        </Paper>
    )
}

export default Register
