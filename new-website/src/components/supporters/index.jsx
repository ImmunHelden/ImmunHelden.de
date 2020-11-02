import React from "react"
import { makeStyles, Container, Grid } from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import minds from "../../images/logos/5Minds.png"
import fuchs from "../../images/logos/fuchsundl.png"
import prototypefund from "../../images/logos/prototypefund.png"
import sdg from "../../images/logos/sdg.png"
import vodafone from "../../images/logos/vodafone.png"
import wvv from "../../images/logos/wvv.png"
import youknow from "../../images/logos/youknow.png"
import bmbf from "../../images/logos/bmbf.jpg"
import projecttogether from "../../images/logos/projecttogether.png"
import rapidusertests from "../../images/logos/rapidusertests.png"
import silberplus from "../../images/logos/silberpuls.png"

const useStyles = makeStyles(theme => ({
    image: {
        padding: "20px",
        maxHeight: "50px",
        margin: "auto",
        display: "flex"
    }
}))

export default function Supporters() {
  const classes = useStyles()
  return(
  <Container maxWidth="lg">
  <h3><FormattedMessage id="supporters" /></h3>
  <Grid container>
   <Grid xs={4} sm={2}>
    <img src={wvv} className={classes.image} alt="wirvsvirus" />
   </Grid>
   <Grid xs={4} sm={2}>
    <img src={prototypefund} className={classes.image} alt="Prototype Fund" />
   </Grid>
   <Grid xs={4} sm={2}>
    <img src={youknow} className={classes.image} alt="youknow" />
   </Grid>
   <Grid xs={4} sm={2}>
    <img src={fuchs} className={classes.image} alt="Studio von Fuchs und Lommatzsch" />
   </Grid>
   <Grid xs={4} sm={2}>
    <img src={vodafone} className={classes.image} alt="Vodafone" />
   </Grid>
   <Grid xs={4} sm={2}>
    <img src={sdg} className={classes.image} alt="sdg" />
   </Grid>
   <Grid xs={4} sm={2}>
    <img src={minds} className={classes.image} alt="5Minds" />
   </Grid>
   <Grid xs={4} sm={2}>
    <img src={bmbf} className={classes.image} alt="5Minds" />
   </Grid>
   <Grid xs={4} sm={2}>
    <img src={projecttogether} className={classes.image} alt="5Minds" />
   </Grid>
   <Grid xs={4} sm={2}>
    <img src={rapidusertests} className={classes.image} alt="5Minds" />
   </Grid>
   <Grid xs={4} sm={2}>
    <img src={silberplus} className={classes.image} alt="5Minds" />
   </Grid>
   <Grid xs={4} sm={2}>
   </Grid>
  </Grid>








  </Container>
)
}
