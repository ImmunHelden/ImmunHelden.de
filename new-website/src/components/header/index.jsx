import { Link } from "gatsby-plugin-intl"
import React from "react"
import BetaRibbon from "./beta-ribbon"
import PropTypes from "prop-types"
import { AppBar, Toolbar, makeStyles } from "@material-ui/core"
import { ImmunHeldenLogo } from "../logo"
import wirVsVirusSolutionEnablerLogo from "../../images/wirvsvirusSE.png"
import firebase from "gatsby-plugin-firebase"
import { useAuth } from "../../hooks/use-auth"

const useStyles = makeStyles(theme => ({
    appBar: {
        backgroundColor: "white",
        boxShadow: "inset 0 4px 10px - 23px gray",
    },
    link: {
        textDecoration: "none",
    },
    wirVsVirusLogo: {},
}))

const HeaderComponent = ({ title }) => {
    const classes = useStyles()
    const { user } = useAuth(firebase)

    const logout = () => firebase.auth().signOut()

    return (
        <AppBar position="sticky" className={classes.appBar}>
            <Toolbar>
                <Link to="/" className={classes.link}>
                    <ImmunHeldenLogo />
                </Link>
                <a href="//twitter.com/WirvsVirusHack" target="_blank" rel="noopener noreferrer">
                    <img alt="WirVsVirus Solution Enabler Logo" src={wirVsVirusSolutionEnablerLogo} width="120" />
                </a>
                {user && <button onClick={logout}>Logout</button>}
                <BetaRibbon />
            </Toolbar>
        </AppBar>
    )
}

HeaderComponent.propTypes = {
    title: PropTypes.string.isRequired,
}

export default HeaderComponent
