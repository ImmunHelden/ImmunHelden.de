import React from "react"
import { Paper, Grid } from "@material-ui/core"
import { Link } from "gatsby-plugin-intl"
import styled from "styled-components"

const Item = styled(Paper)`
    color: rgba(0, 0, 0, 0.54);
    padding: 24px;
    text-align: center;
    margin-left: 16px;
    margin-right: 16px;
    text-decoration: none;
`

const ItemLink = styled(Link)`
    text-decoration: none;
    padding: 0;
`

function renderWithLink(link, children) {
    return <ItemLink to={link}>{children}</ItemLink>
}

function renderItem(image, text) {
    return (
        <Item elevation={2}>
            <img src={image} alt={text} width="100" />
            <h3 className="label">{text}</h3>
        </Item>
    )
}

export const ThreeBoxes = ({ items }) => {
    return (
        <Grid container xs={12} justify="center">
            {items.map(({ image, text, link }, i) => (
                <Grid item xs={12} lg={3} xl={2}>
                    {link ? renderWithLink(link, renderItem(image, text)) : renderItem(image, text)}
                </Grid>
            ))}
        </Grid>
    )
}
