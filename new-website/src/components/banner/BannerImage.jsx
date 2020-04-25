import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import styled from "styled-components"

const StyledImg = styled(Img)`
    height: 35rem;
    z-index: 1;
`

const Gradient = styled.div`
    background-image: linear-gradient(rgba(27, 69, 206, 0.25), rgba(206, 27, 40, 0.25));
    height: 35rem;
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
