import React from "react";
import LayoutFancy from "../components/layout2";
import Hero from "../components/hero";
import HeroButton from "../components/hero/HeroButton";
import SupportedByLane from "../components/supported/SupportedByLane";
import { Typography, Grid } from "@material-ui/core";
import { graphql } from "gatsby";

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
            </div>
        </LayoutFancy>
    );
};

export default IndexPage;

export const pageQuery = graphql`
    query {
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
