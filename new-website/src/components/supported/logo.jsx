import React from "react";
import Img from "gatsby-image";
import { Link } from "@material-ui/core";

const head = a => a[0];
const merge = (x, y) => ({ ...x, ...y });

const Supporter = x => ({
    emit: () => x,
    chain: f => f(x),
    map: fn => Supporter(fn(x)),
});

const partnerConfigFilter = (partnerConfig, { node }) => head(partnerConfig.filter(c => c.imageName === node.name));

const toImageLink = ({ node, url }) => (
    <Link key={node.id} href={url} target>
        <Img
            key={node.id}
            fluid={node.childImageSharp.fluid}
            imgStyle={{ objectFit: "contain" }}
            style={{ width: "154px", height: "109px" }}
        />
    </Link>
);

export const partnerEdgesToImage = (edges, partnerConfig = []) =>
    edges
        .flatMap(Supporter, p => p.node)
        .map(supporter => supporter.map(s => merge(s, partnerConfigFilter(partnerConfig, s))).chain(toImageLink));
