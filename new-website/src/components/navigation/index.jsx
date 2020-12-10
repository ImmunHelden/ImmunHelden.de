import React, { useState, useLayoutEffect} from "react";
import { Link} from "gatsby"
import { AppBar, Toolbar, Hidden, List, Container } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import SideDrawer from "./sideDrawer"
import { FormattedMessage } from "gatsby-plugin-intl"
import immunhelden from "../../images/logos/immunhelden.png"

export default function Navigation() {
const useStyles = makeStyles({
  height: {
      height: "60px",
      transition: "background-color 300ms"
    },  
  navDisplayFlex: {
      display: `unset`,
      justifyContent: `space-between`
    },
    linkText: {
      textDecoration: `none`,
      textTransform: `uppercase`,
      fontWeight: "800",
      fontFamily: "Raleway",
      paddingLeft: "20px",
      paddingRight: "20px",
      fontSize: "16px"
    },
    navbarDisplayFlex: {
        display: `unset`,
        justifyContent: `space-between`
      },
    logo: {
      backgroundColor: "white",
      padding: "15px",
      borderRadius: "0px 0px 20px 20px",
      height: "70px",
      marginTop: "30px",
      boxShadow: "0px 2px 1px rgba(0,0,0,0.2)"
    }  
  });

  
const navLinks = [
    { title: <FormattedMessage id="menue_video"/>, path: `#video` },
    { title: <FormattedMessage id="menue_help"/>, path: `#infoform` },
    { title: <FormattedMessage id="menue_expert"/>, path: `#expert` },
    { title: <FormattedMessage id="menue_team"/>, path: `#team` },
    { title: <FormattedMessage id="menue_faq"/>, path: `faq` },
  ];

  const classes = useStyles();
  const [menue, setMenue] = useState(true);

  useLayoutEffect(() => {
    window.addEventListener('scroll', (event) => {
      if (window.scrollY > 1) {
        setMenue(false)
      } else {
        setMenue(true)
      }
    }); 
  }, [])

  return (
    <AppBar position="fixed" className={classes.height} color={menue ?  'transparent' : 'white'} elevation={menue ?  '0' : '1'}>
      <Toolbar>
      <Link to="/">
        <img src={immunhelden} alt="Immunhelden Logo" className={classes.logo}/>
      </Link>
       <Container maxWidth="md" className={classes.navbarDisplayFlex}>   
        <Hidden smDown>
          <List component="nav" aria-labelledby="main navigation" className={classes.navDisplayFlex}>
            {navLinks.map(({ title, path }) => (
             <Link to={path} key={title} className={classes.linkText} style={{color: (menue ?  'white' : 'black')}}>{title}</Link>
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