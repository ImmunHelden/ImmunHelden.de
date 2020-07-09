import React from "react";

import { graphql, useStaticQuery } from "gatsby";
import { partnerEdgesToImage } from "./logo";
import { makeStyles, Typography, Grid } from "@material-ui/core";
import { partners } from "../../../config/partners";

const useStyle = makeStyles(theme => ({
    headline: {
        textAlign: "center",
    },
}));

const SupportedByLane = () => {
    const data = useStaticQuery(graphql`
        query {
            allFile(filter: { relativeDirectory: { eq: "partner" } }) {
                edges {
                    node {
                        id
                        name
                        childImageSharp {
                            fluid(maxWidth: 300) {
                                base64
                                tracedSVG
                                srcWebp
                                srcSetWebp
                                originalImg
                                originalName
                            }
                        }
                    }
                }
            }
        }
    `);

    const classes = useStyle();

    return (
        <div>
            <Typography className={classes.headline} variant="h2">
                mit Unterstützung von STARKEN PARTNERN
            </Typography>
            <Grid justify="space-evenly" container>
                {partnerEdgesToImage(data.allFile.edges, partners)}
            </Grid>
        </div>
    );
};

export default SupportedByLane;
