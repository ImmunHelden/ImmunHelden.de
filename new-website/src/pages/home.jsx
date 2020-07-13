import React from "react";
import LayoutFancy from "../components/layout2";
import Hero from "../components/hero";
import HeroButton from "../components/hero/HeroButton";
import SupportedByLane from "../components/supported/SupportedByLane";
import { Typography, Grid } from "@material-ui/core";
import { graphql } from "gatsby";
import Img from "gatsby-image";

const IndexPage = ({ data }) => {
    return (
        <LayoutFancy>
            <div>
                <Hero fluid={data.hero.edges[0].node.fluid}>
                    <div>
                        <Typography variant="h2">
                            Du hast die COVID-19-Erkrankung schon hinter dir und möchtest dich nun gesellschaftlich
                            engagieren?
                        </Typography>
                        <Typography variant="h6" style={{ fontWeight: "300" }}>
                            Dann mach mit und werde Immunheld:in! Wir informieren Dich, wenn es in Deiner Region
                            Möglichkeiten gibt zu helfen.
                        </Typography>
                        <HeroButton>Los Gehts!</HeroButton>
                    </div>
                </Hero>
                <SupportedByLane />
                <div
                    style={{
                        backgroundColor: "#FC4141",
                        height: "70vh",
                        margin: "10px 55px",
                        borderRadius: "20px",
                        color: "white",
                        textAlign: "center",
                    }}
                >
                    <Img
                        fluid={data.videoTeaserImage.edges[0].node.fluid}
                        style={{ width: "calc(100% / 2)", left: 0, right: 0, margin: "auto" }}
                    />
                    <Typography variant="h2">mit heldentaten durch die corona pandemie</Typography>
                    <Typography variant="h6">
                        Wir erklären dir kurz und verständlich, warum genesene Patient:innen eine echte Chance für
                        unsere Gesellschaft in der aktuelle Situation darstellen.
                    </Typography>
                    <HeroButton color="default">⌲ Erklärvideo ansehen</HeroButton>
                </div>
                <div
                    style={{
                        backgroundColor: "lightblue",
                        height: "70vh",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            width: "calc(100% / 2)",
                            backgroundColor: "white",
                            borderRadius: "13px",
                            textAlign: "left",
                            position: "relative",
                            top: "calc(50% - 8rem)",
                            height: "16rem",
                            margin: "0 55px",

                            padding: "1rem",
                        }}
                    >
                        <Typography variant="h2">Blutplasmaspende</Typography>
                        <Typography variant="h6">
                            Während deines Kampfes gegen COVID-19 hat dein Immunsystem Antikörper gegen das Virus
                            gebildet. Sie haben dir geholfen, das Virus zu besiegen und finden sich nun in deinem
                            Blutplasma. Wenn du alle gesundheitlichen Kriterien erfüllst, kannst du mit deiner Spende
                            schwer Erkrankten im Kampf gegen COVID-19 helfen. Oder einen Beitrag zur Forschung über
                            Antikörper leisten. Eine passende Spendeeinrichtung in Deiner Nähe findest du auf unserer
                            ImmunHelden Map.
                        </Typography>
                    </div>
                    <HeroButton>Standort in meiner Nähe finden</HeroButton>
                </div>
            </div>
        </LayoutFancy>
    );
};

export default IndexPage;

export const pageQuery = graphql`
    query {
        videoTeaserImage: allImageSharp(filter: { original: { src: { regex: "/video/" } } }) {
            edges {
                node {
                    id
                    fluid(quality: 100) {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
        hero: allImageSharp(filter: { original: { src: { regex: "/banner-image/" } } }) {
            edges {
                node {
                    id
                    fluid(quality: 100) {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
    }
`;
