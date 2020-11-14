import * as React from "react"
import { Link } from "gatsby"
import { AppBar, Toolbar, Hidden, IconButton, List, ListItem, ListItemText, Container } from "@material-ui/core"
import { Home } from "@material-ui/icons"
import { makeStyles } from "@material-ui/core/styles"
import SideDrawer from "./sideDrawer"

const useStyles = makeStyles({
    navDisplayFlex: {
      display: `flex`,
      justifyContent: `space-between`
    },
    linkText: {
      textDecoration: `none`,
      textTransform: `uppercase`,
      color: `white`
    },
    navbarDisplayFlex: {
        display: `flex`,
        justifyContent: `space-between`
      }
  });

const navLinks = [
    { title: `video`, path: `/` },
    { title: `jetzt helfen`, path: `/` },
    { title: `expertenmeinung`, path: `/` },
    { title: `das team`, path: `/` },
    { title: `faq`, path: `/` },
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
             <Link to={path} key={title} className={classes.linkText}>
            <ListItem button>
             <ListItemText primary={title} />
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