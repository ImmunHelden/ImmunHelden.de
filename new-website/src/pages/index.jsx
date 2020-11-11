import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Supporters from "../components/supporters"
import Weare from "../components/weare"
import Team from "../components/team"
import Infoform from "../components/infoform"
import Experte from "../components/experte"
import Kontakt from "../components/kontakt"
import Footer from "../components/footer"
import Karte from "../components/karte"
import Video from "../components/video"
import Intro from "../components/intro"

const IndexPage = () => {
    return (
        <Layout>
            <SEO title="Home" />
              <Intro/>
              <Supporters/>
              <Video/>
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
