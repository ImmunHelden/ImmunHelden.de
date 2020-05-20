import React from "react"
import { Typography, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { useForm } from "react-hook-form"
import { FormattedMessage, Link } from "gatsby-plugin-intl"

const useStyles = makeStyles(theme => ({
    container: {
        padding: "2rem",
        borderRadius: "2rem 0 0 2rem",
        backgroundColor: "#f4f4f4d4",
        color: "black",
    },
    introDescription: {
        whiteSpace: "pre-line",
    },
    h2: {
        textTransform: "none",
        color: "black",
        marginBottom: "1rem",
    },
    label: {
        fontWeight: "bold",
    },
}))

export const ImmuneHeroContactFrom = () => {
    const classes = useStyles()
    const { register, handleSubmit, formState } = useForm()

    return (
        <Grid item md={7} lg={4} xs={12} className={classes.container}>
            <Typography variant="h5" component="h2" className={classes.h2}>
                <FormattedMessage id="introTitle" />
            </Typography>
            <Typography variant="body1" className={classes.introDescription}>
                <FormattedMessage id="introDescription" />
            </Typography>
            <Grid xs={12} container component="form">
                <Grid container xs={12}>
                    <Grid container xs={3} direction="column">
                        <Grid item component="label" for="postcode" className={classes.label}>
                            <FormattedMessage id="postCodeShort" />
                        </Grid>
                        <Grid
                            item
                            component="input"
                            id="postcode"
                            name="postcode"
                            ref={register({ required: true })}
                            required
                            type="text"
                        />
                    </Grid>
                    <Grid container xs={3} direction="column">
                        <Grid item component="label" for="email" className={classes.label}>
                            <FormattedMessage id="email" />
                        </Grid>
                        <Grid
                            item
                            component="input"
                            id="email"
                            name="email"
                            ref={register({ required: true })}
                            required
                            type="email"
                        />
                    </Grid>
                    <Grid item component="button">
                        <FormattedMessage id="letsGoButtonText" />
                    </Grid>
                </Grid>
                <Grid container xs={12}>
                    <Grid item>
                        <input
                            type="checkbox"
                            id="dp_agreement"
                            name="dp_agreement"
                            ref={register({ required: true })}
                        />
                        <label for="dp_agreement">
                            <FormattedMessage
                                id="dpAgreementText"
                                values={{
                                    a: (...chunks) => <Link to="/datenschutzs">{chunks}</Link>,
                                }}
                            ></FormattedMessage>
                        </label>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
