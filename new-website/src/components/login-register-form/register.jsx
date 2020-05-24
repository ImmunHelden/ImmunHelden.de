import React from "react"
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from "@material-ui/core"
import { Face, Fingerprint } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import MuiAlert from "@material-ui/lab/Alert"
import { useForm } from "react-hook-form"
import firebase from "gatsby-plugin-firebase"

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const useStyles = makeStyles(theme => ({
    margin: {
        margin: 10 * 2,
    },
    padding: {
        padding: 10,
    },
}))

const Register = () => {
    const classes = useStyles()
    const { register, handleSubmit } = useForm()

    const onSubmit = ({ email, password }) => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => <Alert severity="success">Account Created! Please verify Email!</Alert>)
            .catch(error => {
                const errorCode = error.code
                const errorMessage = error.message
                console.log({ errorCode, errorMessage })
                return <Alert severity="error">Something went wrong please try again later!</Alert>
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
                            fullWidth
                            autoFocus
                            required
                            inputRef={register({ required: true })}
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
                        Register
                    </Button>
                </Grid>
            </form>
        </Paper>
    )
}

export default Register
