import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Banner from "../components/banner/Banner"
import superhero from "../images/superhero.png"
import { ThreeBoxesRow } from "../components/layout/ThreeBoxesRow"

const joinBoxes = [
    {
        image: superhero,
        text: "ICH MÖCHTE IMMUNHELD:IN WERDEN",
        link: null,
    },
    {
        image: superhero,
        text: "ICH BRAUCHE EINE IMMUNHELD:IN",
        link: null,
    },
    {
        image: superhero,
        text: "HÄUFIGE FRAGEN UND KONTAKT",
        link: "/faq",
    },
]

const IndexPage = () => {
    return (
        <Layout>
            <SEO title="Home" />
            <Banner />
            <ThreeBoxesRow title="Mitmachen" items={joinBoxes} />
        </Layout>
    )
}

export default IndexPage
