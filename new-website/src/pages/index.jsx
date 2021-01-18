import React from "react"
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
import Navigation from "../components/navigation"
import Faq from "../components/faq"

const IndexPage = () => {
    return (
            <div id="pageImmunhelden">
              <SEO title="Home" />
              <Navigation/>
              <Intro/>
              <Supporters/>
              <Video/>
              <Karte/>
              <Weare/>
              <Infoform/>
              <Experte/>
              <Team/>
              <Faq/>
              <Kontakt/>
              <Footer/>
            </div>
    )
}

export default IndexPage
