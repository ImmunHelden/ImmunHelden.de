import React from "react"
import { Paper } from "@material-ui/core"
import styled from "styled-components"

const Item = styled(Paper)`
    color: rgba(0, 0, 0, 0.54);
    padding: 24px;
    text-align: center;
    margin-left: 16px;
    margin-right: 16px;
    text-decoration: none;
    min-height: 13rem;
    padding-top: 3rem;
`

export const Box = ({ image, text }) => {
    return (
        <Item elevation={2}>
            <img src={image} alt={text} width="100" />
            <h3 className="label">{text}</h3>
        </Item>
    )
}
