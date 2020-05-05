import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Banner from "../components/banner/Banner"
import { JoinLane } from "../components/join-lane"

const IndexPage = () => {
    return (
        <Layout>
            <SEO title="Home" />
            <Banner />
            <JoinLane />
        </Layout>
    )
}

export default IndexPage
