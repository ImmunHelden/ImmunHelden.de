import React from "react";
import { Protected } from "../../components/protected";
import Layout from "../../components/layout";
import { UserInfo } from "../../components/account/user-info";
import { LocationOverview } from "../../components/location";
import { Invites } from "../../components/partner/invites";
import LayoutFancy from "../../components/layout2";

export const PartnerPage = () => {
    return (
        <Layout>
            <Protected loginUrl="/partner/login">
                <UserInfo />
                <Invites />
                <LocationOverview />
            </Protected>
        </Layout>
    );
};

export default PartnerPage;
