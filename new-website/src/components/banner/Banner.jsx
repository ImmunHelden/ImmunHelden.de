import React from "react"
import BannerImage from "./BannerImage"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    banner: {
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
}))

export default function BannerComponent() {
    const classes = useStyles()
    return (
        <section className={classes.banner}>
            <BannerImage />
        </section>
    )
}
