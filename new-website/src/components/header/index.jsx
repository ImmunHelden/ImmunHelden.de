import { Link } from "gatsby-plugin-intl"
import React from "react"
import styled from "styled-components"
import BetaRibbon from "./beta-ribbon"
import PropTypes from "prop-types"
import { AppBar, Toolbar } from "@material-ui/core"

const HeaderBar = styled(AppBar)`
    background-color: #000;
}`

const Logo = styled(Link)`
    color: #ffffff;
    font-size: 1rem;
    font-weight: 600;
    height: inherit;
    padding: 0 1.25rem;
    text-decoration: none;
    line-height: 3.25rem;
`

const HeaderComponent = ({ title }) => {
    return (
        <HeaderBar position="fixed">
            <Toolbar color="black">
                <BetaRibbon />
                <Logo to="/">{title}</Logo>
            </Toolbar>
        </HeaderBar>
    )
}

HeaderComponent.propTypes = {
    title: PropTypes.string.isRequired,
}

export default HeaderComponent
