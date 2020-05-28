import React from "react"
import { Grid } from "@material-ui/core"
import ReactPlayer from "react-player"

export const VideoLane = ({ url }) => {
    return (
        <Grid container xs={12} justify="center">
            <Grid item xs={12} md={8} justify="center" component={ReactPlayer} url={url} />
        </Grid>
    )
}
