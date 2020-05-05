import React from "react"
import { Link } from "gatsby-plugin-intl"
import styled from "styled-components"

const ItemLink = styled(Link)`
    text-decoration: none;
    padding: 0;
`

export function renderWithLink(link, children) {
    return <ItemLink to={link}>{children}</ItemLink>
}
