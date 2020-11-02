import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Banner from "../components/banner/Banner"
import { ImmuneHeroContactFrom } from "../components/immune-hero/contact"
import { VideoLane } from "../components/video"
import Supporters from "../components/supporters"
import Weare from "../components/weare"
import Team from "../components/team"
import Infoform from "../components/infoform"
import Experte from "../components/experte"
import Kontakt from "../components/kontakt"
import Footer from "../components/footer"
import Karte from "../components/karte"

const IndexPage = () => {
    return (
        <Layout>
            <SEO title="Home" />
              <Supporters/>
              <Karte/>
              <Weare/>
              <Infoform/>
              <Experte/>
              <Team/>
              <Kontakt/>
              <Footer/>
        </Layout>
    )
}

export default IndexPage
