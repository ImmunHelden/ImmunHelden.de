import React from "react"
import BannerImage from "./BannerImage"
import { makeStyles, Grid } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    banner: {
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        zIndex: 1,
    },
    content: {
        position: "absolute",
        zIndex: 2,
    },
}))

export default function BannerComponent({ children }) {
    const classes = useStyles()
    return (
        <section className={classes.banner}>
            <BannerImage />
            <Grid container xs={12} className={classes.content} justify="flex-end">
                {children}
            </Grid>
        </section>
    )
}
