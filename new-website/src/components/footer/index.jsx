import React from "react"
import { makeStyles, Container, Box, Grid} from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import Buttonwhite from "../buttons/buttonwhite"
import facebook from "../../images/icons/facebook.png"
import github from "../../images/icons/github.png"
import instagram from "../../images/icons/instagram.png"
import twitter from "../../images/icons/twitter.png"
import immunhelden from "../../images/logos/immunhelden.png"

const useStyles = makeStyles(theme => ({
    bg: {
      backgroundColor: "black",
      color: "white"
    },
    inline: {
      display: "flex",
      alignItems: "center"
    },
    logoimg: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: "0px 0px 20px 20px"
    },
    headline: {
      textAlign: "left",
      textTransform: "unset"
    },
    link: {
      display: "block"
    },
    spacing: {
      lineHeight:"35px",
      paddingBottom: 20,
    },
    spacinggrid: {
      paddingTop: 48,
    },
    spacingimg: {
      paddingRight:10,
    }

}))


export default function Footer() {
  const classes = useStyles()
  return(
  <Box className={classes.bg}>
   <Container maxWidth="md" className={classes.spacing}>
   <Grid container spacing={3}>
    <Grid md={4} sm={5} xs={12}>
     <img className={classes.logoimg} src={immunhelden} alt="Immunhelden Logo" />
     <a className={classes.link} href="#"><FormattedMessage id="footer_impressum"/></a>
     <a className={classes.link} href="#"><FormattedMessage id="footer_ds"/></a>
    </Grid>
    <Grid md={4} sm={4} xs={12} className={classes.spacinggrid}>
     <h3 className={classes.headline}>#WirVsVirus</h3>
     <a className={classes.link} href="https://wirvsvirus.org/"><FormattedMessage id="footer_website"/></a>
     <a className={classes.link} href="https://www.bundesregierung.de/"><FormattedMessage id="footer_br"/></a>
    </Grid>
    <Grid md={4} sm={3} xs={12} className={classes.spacinggrid}>
     <h3 className={classes.headline}>Follow us</h3>
     <a className={classes.inline} href="https://github.com/ImmunHelden/">
      <img className={classes.spacingimg} src={github} alt="Github" />
      Github
     </a>
     <a className={classes.inline} href="https://twitter.com/immunhelden">
      <img className={classes.spacingimg} src={twitter} alt="Twitter" />
      Twitter
     </a>
     <a className={classes.inline} href="https://m.facebook.com/ImmunHelden">
      <img className={classes.spacingimg} src={facebook} alt="Facebook" />
      Facebook
     </a>
     <a className={classes.inline} href="https://www.instagram.com/immuneheroes/">
      <img className={classes.spacingimg} src={instagram} alt="Instagram" />
      Instagram
     </a>
    </Grid>
   </Grid>
   </Container>
  </Box>
)
}
