import React from "react"
import { Protected } from "../../components/protected"
import Layout from "../../components/layout"
import { UserInfo } from "../../components/account/user-info"
import { LocationOverview } from "../../components/location"

export const Account = () => {
    return (
        <Layout>
            <Protected loginUrl="/partner/login">
                <UserInfo />
                <LocationOverview />
            </Protected>
        </Layout>
    )
}

export default Account
