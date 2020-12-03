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
      padding: "20px 12% 40px 12%",
      float: "right",
      maxWidth: "600px"
    },
    img: {
      backgroundImage: `url(${karte})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      height: "100%",
      display: "flex",
      [theme.breakpoints.down('sm')]: {
        height:"400px"
      },  
    }
}))

export default function Karte() {
  const classes = useStyles()
  return(
  <Box className={classes.display}>
   <Grid container>
    <Grid xs={12} md={7}>
     <Box className={classes.text}>
      <h2><FormattedMessage id="karteintro"/></h2>
      <p><FormattedMessage id="kartetext"/></p>
      <a href="https://immunhelden.de/maps/all/">
      <Buttonred><FormattedMessage id="kartebutton"/></Buttonred>
      </a>
     </Box>
    </Grid>
    
    <Grid xs={12} md={5}>
      <a className={classes.img}  href="https://immunhelden.de/maps/all/"></a>
    </Grid>
   </Grid>
   </Box>
)
}
