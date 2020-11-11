import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Banner from "../components/banner/Banner"
import { ImmuneHeroContactFrom } from "../components/immune-hero/contact"


const IndexPage = () => {
    return (
        <Layout>
            <SEO title="Home" />
            <Banner>
                <p>Test</p>
                <ImmuneHeroContactFrom />
            </Banner>
            
        </Layout>
    )
}

export default IndexPage
