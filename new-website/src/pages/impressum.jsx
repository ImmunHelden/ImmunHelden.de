import React from "react"
import { graphql } from "gatsby"
import { Paper, Grid, Box } from "@material-ui/core"
import Layout from "../components/layout"
import SEO from "../components/seo"

 const Imprint = ({ data }) => {
    const { frontmatter, html } = data?.markdownRemark
    const { title = "" } = frontmatter

    return (
        <Layout>
            <SEO title={title} />
            <section className="faq">
                <Grid container xs={12} justify="center">
                    <Grid item xs={10}>
                        <Paper elevation={2}>
                            <Box p={2}>
                                <h1>{title}</h1>
                                <div dangerouslySetInnerHTML={{ __html: html }} />
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </section>
        </Layout>
    )
}
export default Imprint

export const query = graphql`
    query {
        markdownRemark(frontmatter: {path: {eq: "/impressum"}}) {
            html
            frontmatter {
                title
            }
        }
    }
`
