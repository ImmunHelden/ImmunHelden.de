import * as React from "react"
import { Link } from "gatsby"
import { AppBar, Toolbar, Hidden, IconButton, List, ListItem, ListItemText, Container } from "@material-ui/core"
import { Home } from "@material-ui/icons"
import { makeStyles } from "@material-ui/core/styles"
import SideDrawer from "./sideDrawer"
import { FormattedMessage } from "gatsby-plugin-intl"

const useStyles = makeStyles({
    navDisplayFlex: {
      display: `flex`,
      justifyContent: `space-between`
    },
    linkText: {
      textDecoration: `none`,
      textTransform: `uppercase`,
      color: `white`,
      fontWeight: "800 !important"
    },
    navbarDisplayFlex: {
        display: `flex`,
        justifyContent: `space-between`
      }
  });

const navLinks = [
    { title: <FormattedMessage id="menue_video"/>, path: `/` },
    { title: <FormattedMessage id="menue_help"/>, path: `/` },
    { title: <FormattedMessage id="menue_expert"/>, path: `/` },
    { title: <FormattedMessage id="menue_team"/>, path: `/` },
    { title: <FormattedMessage id="menue_faq"/>, path: `/` },
  ]

const Navigation = () => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
       <Container maxWidth="md" className={classes.navbarDisplayFlex}>   
        <Hidden smDown>
          <List component="nav" aria-labelledby="main navigation" className={classes.navDisplayFlex}>
            {navLinks.map(({ title, path }) => (
             <Link to={path} key={title} >
            <ListItem button>
             <ListItemText primary={title} className={classes.linkText} />
            </ListItem>
             </Link>
              ))}
          </List>
          </Hidden>
          <Hidden mdUp>
          <SideDrawer navLinks={navLinks} />
          </Hidden>
          </Container>
      </Toolbar>
    </AppBar>
  )
}
export default Navigation