import React from "react"
import { makeStyles, Container, Box, Grid} from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import karte from "../../images/karte.png"
import Buttonred from "../buttons/buttonred"

const useStyles = makeStyles(theme => ({
    display: {
      background: "#F8F8F8"
    },
    text: {
      padding: "20px 12% 10px 12%"
    }
}))

export default function Karte() {
  const classes = useStyles()
  return(
  <Box className={classes.display}>
   <Grid container>
    <Grid xs={12} sm={7}>
     <Box className={classes.text}>
      <h2><FormattedMessage id="karteintro"/></h2>
      <p><FormattedMessage id="kartetext"/></p>
      <Buttonred href="https://immunhelden.de/maps/all/"><FormattedMessage id="kartebutton"/></Buttonred>
     </Box>
    </Grid>
    <Grid xs={12} sm={5}>
      <a href="https://immunhelden.de/maps/all/"><img src={karte} alt="Karte" /></a>
    </Grid>
   </Grid>
   </Box>
)
}
