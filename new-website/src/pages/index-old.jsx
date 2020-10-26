import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Banner from "../components/banner/Banner"
import { ImmuneHeroContactFrom } from "../components/immune-hero/contact"
import { VideoLane } from "../components/video"

const IndexPage = () => {
    return (
        <Layout>
            <SEO title="Home" />
            <Banner>
                <p>Test</p>
                <ImmuneHeroContactFrom />
            </Banner>
            <VideoLane url="https://www.youtube.com/watch?v=fyPF3RUv00A" />
        </Layout>
    )
}

export default IndexPage
