import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import "./layout.css"
import Header from "./header/index"
import styled from "styled-components"

const MainContent = styled.main`
    top: 3.25rem;
    position: relative;
    flex-grow: 1;
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
        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Header title={data.site.siteMetadata.title} />
            <main style={{ flexGrow: 1 }}>{children}</main>
            <footer></footer>
        </div>
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout
