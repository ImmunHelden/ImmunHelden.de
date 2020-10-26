import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Banner from "../components/banner/Banner"
import { ImmuneHeroContactFrom } from "../components/immune-hero/contact"
import { VideoLane } from "../components/video"
import Supporters from "../components/supporters"
import Weare from "../components/weare"
import Team from "../components/team"
import Experte from "../components/experte"
import Kontakt from "../components/kontakt"

const IndexPage = () => {
    return (
        <Layout>
            <SEO title="Home" />
              <Supporters/>
              <Weare/>
              <Experte/>
              <Team/>
              <Kontakt/>
        </Layout>
    )
}

export default IndexPage
