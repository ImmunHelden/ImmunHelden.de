import React from "react"
import { graphql } from "gatsby"
import { Paper, Grid, Box } from "@material-ui/core"
import Layout from "../components/layout"
import ContactForm from "../components/contact-form"
import SEO from "../components/seo"

const FaqPage = ({
    data, // this prop will be injected by the GraphQL query below.
}) => {
    const { markdownRemark } = data // data.markdownRemark holds your post data
    const { frontmatter, html } = markdownRemark
    return (
        <Layout>
            <SEO title={frontmatter.title} />
            <section className="faq">
                <Grid container xs={12} justify="center">
                    <Grid item xs={10}>
                        <Paper elevation={2}>
                            <Box p={2}>
                                <h1>{frontmatter.title}</h1>
                                <div className="faq-content" dangerouslySetInnerHTML={{ __html: html }} />
                                <ContactForm />
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </section>
        </Layout>
    )
}

export default FaqPage

export const query = graphql`
    query {
        markdownRemark(frontmatter: { path: { eq: "/faq" } }) {
            html
            frontmatter {
                path
                title
            }
        }
    }
`
