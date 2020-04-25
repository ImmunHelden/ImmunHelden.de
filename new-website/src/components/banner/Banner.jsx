import React from "react"
import BannerImage from "./BannerImage"
import styled from "styled-components"
import { useStaticQuery, graphql } from "gatsby"

const Banner = styled.section`
    color: white;
    display: flex;
    display: flex;
    flex-direction: column;
    justify-content: center;
`
const TextBox = styled.div`
    position: absolute;
    z-index: 3;
    text-align: center;
    left: 0;
    right: 0;
`

const Title = styled.h1`
    color: white;
`
const Description = styled.h2`
    font-size: 1.25rem;
    text-shadow: 1px 1px #333;
    color: #fff;
`

export default function BannerComponent() {
    const { site } = useStaticQuery(
        graphql`
            query {
                site {
                    siteMetadata {
                        title
                        description
                    }
                }
            }
        `
    )
    return (
        <Banner>
            <BannerImage className="banner" />
            <TextBox>
                <Title>{site.siteMetadata.title}</Title>
                <Description>{site.siteMetadata.description}</Description>
            </TextBox>
        </Banner>
    )
}
