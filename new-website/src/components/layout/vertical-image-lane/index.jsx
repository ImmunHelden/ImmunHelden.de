import React from "react"
import styled from "styled-components"

const ParallaxBackgroundImage = styled.div`
    background-image: linear-gradient(rgba(0, 174, 214, 0.25), rgba(0, 0, 0, 0.25)), url(../../images/cta01.jpg);
`

export const VerticalImageLane = () => {
    return (
        <ParallaxBackgroundImage>
            <span>TITLE</span>
        </ParallaxBackgroundImage>
    )
}
