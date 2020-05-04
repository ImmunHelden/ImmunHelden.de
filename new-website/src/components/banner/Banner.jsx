import React from "react"
import BannerImage from "./BannerImage"
import styled from "styled-components"
import { FormattedMessage } from "gatsby-plugin-intl"

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
    return (
        <Banner>
            <BannerImage className="banner" />
            <TextBox>
                <Title>
                    <FormattedMessage id="pageTitle" />
                </Title>
                <Description>
                    <FormattedMessage id="pageDescription" />
                </Description>
            </TextBox>
        </Banner>
    )
}
