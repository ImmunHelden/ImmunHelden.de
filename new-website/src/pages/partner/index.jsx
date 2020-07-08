import React from "react"
import { Protected } from "../../components/protected"
import Layout from "../../components/layout"
import { UserInfo } from "../../components/account/user-info"
import { LocationOverview } from "../../components/location"
import { Invites } from "../../components/partner/invites"

export const PartnerPage = ({ location }) => {
    const result = { editResult: location?.state?.result }
    return (
        <Layout>
            <Protected loginUrl="/partner/login">
                <UserInfo />
                <Invites />
                <LocationOverview state={ result } />
            </Protected>
        </Layout>
    )
}

export default PartnerPage
