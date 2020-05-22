import React from "react"
import { Protected } from "../../components/protected"
import Layout from "../../components/layout"

export const Account = () => {
    return (
        <Layout>
            <Protected loginUrl="/partner/login">
                <div>YES</div>
            </Protected>
        </Layout>
    )
}

export default Account
