import React from "react"
import styled from "styled-components"

const Ribbon = styled.div`
    width: 130px;
    height: 130px;
    overflow: hidden;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 10002;
`
const Bar = styled.div`
    font-weight: bold;
    text-align: center;
    transform: rotate(45deg);
    position: relative;
    padding: 7px 0;
    left: 0px;
    top: 11px;
    width: 200px;
    background-color: #ffea94;
    background-image: linear-gradient(to bottom, #ffea94, #ffea5e);
`
export default function BetaRibbon() {
    return (
        <Ribbon>
            <Bar>Beta</Bar>
        </Ribbon>
    )
}
