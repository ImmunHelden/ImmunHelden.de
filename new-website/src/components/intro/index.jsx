import React from "react"
import { makeStyles, Container, Box, Grid} from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import introbg from "../../images/introbg.png"
import Buttonwhite from "../buttons/buttonwhite"
import Buttonred from "../buttons/buttonred"

const useStyles = makeStyles(theme => ({
    background: {
      backgroundImage: `url(${introbg})`,
      boxShadow: "inset 2000px 0 0 0 rgba(0, 0, 0, 0.5)",
      borderColor: "rgba(0, 0, 0, 1)",  
      color: "white",  
      textAlign: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    padding: {
      paddingTop: "6rem",
      paddingBottom: "6rem"
    }
  }))


export default function Intro() {
  const classes = useStyles()

  return(
  <Box className={classes.background}>
   <Container maxWidth="lg"  className={classes.padding}>
     <Container maxWidth="md">
      <h2><FormattedMessage id="headerintro"/></h2> 
      <p><FormattedMessage id="headertext"/></p>
    </Container>
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid xs={6}>
          <Buttonwhite><FormattedMessage id="headerbuttonheld"/></Buttonwhite>
        </Grid>
        <Grid xs={6}>
          <Buttonred><FormattedMessage id="headerbuttonintitut"/></Buttonred>
        </Grid>
     </Grid>
    </Container>
   </Container>
   </Box>
)
}
