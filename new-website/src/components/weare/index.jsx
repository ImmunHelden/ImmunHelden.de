import React from "react"
import { makeStyles, Grid, Container } from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import hand from "../../images/icons/handherz.png"
import schloss from "../../images/icons/schloss.png"
import team from "../../images/icons/team.png"

const useStyles = makeStyles(theme => ({
    color: {
        color: "#FC4141"
    },
    border: {
      border: 3 ,
      borderColor: "#FC4141",
      borderRadius: 15,
      borderStyle: "solid"
    }

}))

export default function Weare() {
  const classes = useStyles()
  return(
  <Container maxWidth="lg" className={classes.border}>
   <Container maxWidth="md" className={classes.color}>
    <h3><FormattedMessage id="weare"/></h3>
    <Grid container spacing={3}>
    <Grid xs={4}>
      <img src={team} alt="Ehrenamtlich" />
      <p><FormattedMessage id="honorary"/></p>
    </Grid>
    <Grid xs={4}>
     <img src={hand} alt="Uneigennützig" />
     <p><FormattedMessage id="unselfish"/></p>
    </Grid>
    <Grid xs={4}>
      <img src={schloss} alt="Open Source" />
      <p><FormattedMessage id="opensource"/></p>
    </Grid>
    </Grid>
   </Container>
  </Container>

)
}
