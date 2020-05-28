import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import styled from "styled-components"

const StyledImg = styled(Img)`
    height: 42rem;
    z-index: 1;
    transform: rotateY(180deg);
`

const Gradient = styled.div`
    background-image: linear-gradient(90deg, transparent, #ffffff80);
    height: 42rem;
    width: 100%;
    z-index: 2;
    position: absolute;
`

const BannerImage = () => {
    const data = useStaticQuery(graphql`
        query {
            placeholderImage: file(relativePath: { eq: "banner.jpg" }) {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
        }
    `)

    return [<Gradient></Gradient>, <StyledImg fluid={data.placeholderImage.childImageSharp.fluid} />]
}

export default BannerImage
