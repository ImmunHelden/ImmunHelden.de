import React from "react"
import { Typography, makeStyles } from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import superhero from "../../images/superhero.png"

const useStyles = makeStyles(theme => ({
    image: {
        padding: "10px",
    },
    text: {
        fontWeight: "bold",
    },
    logo: {
        display: "flex",
        flexDirection: "row",
        color: "black",
        alignItems: "center",
    },
}))

export const ImmunHeldenLogo = () => {
    const classes = useStyles()

    return (
        <div className={classes.logo}>
            <img src={superhero} alt="ImmunHelden.de Logo" width="40" className={classes.image} />
            <Typography className={classes.text}>
                <FormattedMessage id="pageTitle" />
            </Typography>
        </div>
    )
}
