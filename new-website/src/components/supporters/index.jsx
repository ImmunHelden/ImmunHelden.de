import React from "react"
import { makeStyles, Container } from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import minds from "../../images/logos/5Minds.png"
import fuchs from "../../images/logos/fuchsundl.png"
import prototypefund from "../../images/logos/prototypefund.png"
import sdg from "../../images/logos/sdg.png"
import vodafone from "../../images/logos/vodafone.png"
import wvv from "../../images/logos/wvv.png"
import youknow from "../../images/logos/youknow.png"

const useStyles = makeStyles(theme => ({
    image: {
        padding: "20px",
    }
}))

export default function Supporters() {
  const classes = useStyles()
  return(
  <Container maxWidth="lg">
    <h3><FormattedMessage id="supporters" /></h3>
    <img src={minds} className={classes.image} alt="5Minds" />
    <img src={fuchs} className={classes.image} alt="Studio von Fuchs und Lommatzsch" />
    <img src={prototypefund} className={classes.image} alt="Prototype Fund" />
    <img src={sdg} className={classes.image} alt="sdg" />
    <img src={vodafone} className={classes.image} alt="Vodafone" />
    <img src={wvv} className={classes.image} alt="wirvsvirus" />
    <img src={youknow} className={classes.image} alt="youknow" />
  </Container>
)
}
