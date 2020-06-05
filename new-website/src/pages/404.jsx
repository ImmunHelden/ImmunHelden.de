import React, { useState, useEffect } from "react"
import * as Sentry from "@sentry/browser"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { FormattedMessage } from "gatsby-plugin-intl"
import { Grid, Paper, makeStyles } from "@material-ui/core"
import NotFoundSVG from "../images/svg/undraw_page_not_found_su7k.svg"

const useStyles = makeStyles(theme => ({
    padding: {
        padding: 10,
        textAlign: "center",
    },
}))

const NotFoundPage = () => {
    const [errorEventId, setErrorEventId] = useState("")
    const classes = useStyles()

    useEffect(() => {
        Sentry.withScope(scope => {
            scope.setLevel("warning")
            const eventId = Sentry.captureEvent({ message: "404: Not found" })
            setErrorEventId(eventId)
        })
    }, [])

    return (
        <Layout>
            <SEO title="404: Not found" />
            <Grid container justify="center" alignContent="center" spacing={0} style={{ height: "100%" }}>
                <Grid item xs={12} md={8} lg={5} xl={3}>
                    <Paper className={classes.padding}>
                        <h1>
                            <FormattedMessage id="404" />
                        </h1>
                        <NotFoundSVG width="300" height="auto" />
                        <p>
                            <FormattedMessage id="404_body" />
                        </p>
                        <p style={{ fontSize: "0.7rem", fontStyle: "italic" }}>
                            ({Date.now()} - {errorEventId})
                        </p>
                    </Paper>
                </Grid>
            </Grid>
        </Layout>
    )
}

export default NotFoundPage
