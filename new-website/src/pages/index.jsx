import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Banner from "../components/banner/Banner"
import { ImmuneHeroContactFrom } from "../components/immune-hero/contact"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles(theme => ({
    topBannerArea: {
        position: "absolute",
    },
}))

const IndexPage = () => {
    const classes = useStyles()
    return (
        <Layout>
            <SEO title="Home" />
            <Banner>
                <ImmuneHeroContactFrom />
            </Banner>
        </Layout>
    )
}

export default IndexPage
