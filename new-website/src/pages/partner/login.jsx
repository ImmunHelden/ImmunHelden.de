import React from "react"
import { Grid } from "@material-ui/core"
import Layout from "../../components/layout"
import { LoginRegisterForm } from "../../components/login-register-form"

export const Login = () => {
    return (
        <Layout>
            <Grid container justify="center" alignContent="center" spacing={0} style={{ height: "100%" }}>
                <Grid item xs={12} md={8} lg={5} xl={3}>
                    <LoginRegisterForm loginSuccessUrl="/partner/account" />
                </Grid>
            </Grid>
        </Layout>
    )
}

export default Login
