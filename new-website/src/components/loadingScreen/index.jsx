import React from "react"
import { Roller } from "react-spinners-css"
import { Paper, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles(theme => ({
    loading: {
        display: "flex",
        justifyContent: "center",
        height: "400px",
        alignItems: "center",
    },
    padding: {
        padding: 10,
    },
}))

export const LoadingScreen = () => {
    const classes = useStyles()

    return (
        <Grid container justify="center" alignContent="center" spacing={0} style={{ height: "100%" }}>
            <Grid item xs={12} md={8} lg={5} xl={3}>
                <Paper className={classes.padding}>
                    <div className={classes.loading}>
                        <Roller />
                    </div>
                </Paper>
            </Grid>
        </Grid>
    )
}
