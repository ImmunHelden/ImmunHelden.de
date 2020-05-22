import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Banner from "../components/banner/Banner"
import { ImmuneHeroContactFrom } from "../components/immune-hero/contact"
import { makeStyles } from "@material-ui/styles"

import { VideoLane } from "../components/video"

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
            <VideoLane url="https://www.youtube.com/watch?v=fyPF3RUv00A" />
        </Layout>
    )
}

export default IndexPage
