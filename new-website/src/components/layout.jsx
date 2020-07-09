import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import "./layout.css";
import Header from "./header/index";
import { ErrorBoundary } from "./error/error-boundary";
import { ThemeProvider } from "@material-ui/core";
import theme from "../theme";

const Layout = ({ children }) => {
    const data = useStaticQuery(graphql`
        query SiteTitleQuery {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `);
    return (
        <ThemeProvider theme={theme}>
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <ErrorBoundary>
                    <Header title={data.site.siteMetadata.title} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <main style={{ flexGrow: 1, marginTop: "90px" }}>{children}</main>
                </ErrorBoundary>
                <ErrorBoundary>
                    <footer></footer>
                </ErrorBoundary>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            </div>
        </ThemeProvider>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
