import React from "react"
import { makeStyles } from "@material-ui/core"

const useStyle = makeStyles(theme => ({
    ribbon: {
        width: "130px",
        height: "130px",
        overflow: "hidden",
        position: "fixed",
        top: "0",
        right: "0",
        zIndex: "10002",
    },
    bar: {
        fontWeight: "bold",
        textAlign: "center",
        transform: "rotate(45deg)",
        position: "relative",
        padding: "7px 0",
        left: "0px",
        top: "11px",
        width: "200px",
        backgroundColor: "#ffea94",
        backgroundImage: "linear-gradient(to bottom, #ffea94, #ffea5e)",
        color: "black",
        boxShadow: "0 0 7px -1px gray",
    },
}))

export default function BetaRibbon() {
    const classes = useStyle()
    return (
        <div className={classes.ribbon}>
            <div className={classes.bar}>Beta</div>
        </div>
    )
}
