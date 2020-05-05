import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Paper, Grid, Box } from "@material-ui/core"
import Layout from "../components/layout"
import ContactForm from "../components/contact-form"
import SEO from "../components/seo"
import { useIntl } from "gatsby-plugin-intl"

const FaqPage = () => {
    const { locale } = useIntl()
    console.log(locale)

    const queryDe = graphql`
        query {
            markdownRemark(frontmatter: { path: { eq: "/faq" } }) {
                html
                frontmatter {
                    path
                    title
                    lang
                }
            }
        }
    `
    const queryEn = graphql`
        query {
            markdownRemark(frontmatter: { path: { eq: "/faq" }, lang: { eq: "en" } }) {
                html
                frontmatter {
                    path
                    title
                    lang
                }
            }
        }
    `

    const data = useStaticQuery(locale === "de" ? queryDe : queryEn)
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

// export const query = graphql`
//     query {
//         markdownRemark(frontmatter: { path: { eq: "/faq" } }) {
//             html
//             frontmatter {
//                 path
//                 title
//                 lang
//             }
//         }
//     }
// `
