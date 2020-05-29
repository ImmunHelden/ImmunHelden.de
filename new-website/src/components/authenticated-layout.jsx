import React from "react"
import { Protected } from "../../components/protected"
import Layout from "../../components/layout"

export const ProtectedLayout = ({ children }) => {
    return (
        <Layout>
            <Protected loginUrl="/partner/login">{children}</Protected>
        </Layout>
    )
}

export default ProtectedLayout
