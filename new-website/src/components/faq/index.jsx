import React from "react"
import { useStaticQuery, graphql } from "gatsby"

export default function Faq() {
  const data = useStaticQuery(graphql`
  query {
    allMarkdownRemark(filter: {frontmatter: {path: {eq: "/faq"}}}) {
        edges {
            node {
                html
                frontmatter {
                    lang
                    path
                    title
                }
            }
        }
    }
}`)
  return (
    <div>    
      <div  dangerouslySetInnerHTML={{ __html: data.allMarkdownRemark.edges[1].node.html }}></div>
    </div>
  )
}

