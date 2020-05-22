import React, { useState } from "react"
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from "@material-ui/core"
import { Face, Fingerprint } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import { useForm } from "react-hook-form"
import { navigate } from "gatsby-plugin-intl"
import firebase from "gatsby-plugin-firebase"

const useStyles = makeStyles(theme => ({
    margin: {
        margin: 10 * 2,
    },
    padding: {
        padding: 10,
    },
}))

const Login = ({ successUrl = "/" }) => {
    const classes = useStyles()
    const { register, handleSubmit } = useForm()
    const [errorMessage, setErrorMessage] = useState(null)

    const onSubmit = ({ email, password }) => {
        setErrorMessage(null)
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(error => {
                const errorCode = error.code
                const errorMessage = error.message
                if (errorCode === "auth/wrong-password" || errorCode === "auth/user-not-found") {
                    setErrorMessage("Wrong email or password.")
                } else {
                    setErrorMessage(errorMessage)
                }
                console.log(error)
            })
            .then(() => {
                navigate(successUrl)
            })
    }

    return (
        <Paper className={classes.padding}>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.margin}>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Face />
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField
                            id="email"
                            label="Email"
                            type="email"
                            name="email"
                            inputRef={register({ required: true })}
                            fullWidth
                            autoFocus
                            required
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Fingerprint />
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField
                            id="password"
                            label="Password"
                            name="password"
                            inputRef={register({ required: true })}
                            type="password"
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>
                {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
                <Grid container justify="center" style={{ marginTop: "10px" }}>
                    <Button type="submit" variant="outlined" color="primary" style={{ textTransform: "none" }}>
                        Login
                    </Button>
                </Grid>
            </form>
        </Paper>
    )
}

export default Login
