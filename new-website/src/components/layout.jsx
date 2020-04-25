import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import "./layout.css"
import Header from "./header/index"
import styled from "styled-components"

const MainContent = styled.main`
    top: 3.25rem;
    position: relative;
`

const Layout = ({ children }) => {
    const data = useStaticQuery(graphql`
        query SiteTitleQuery {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `)
    return (
        <>
            <Header title={data.site.siteMetadata.title} />
            <div>
                <MainContent>{children}</MainContent>
                <footer></footer>
            </div>
        </>
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout
