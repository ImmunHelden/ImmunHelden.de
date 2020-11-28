import React from "react"
import { Link } from "gatsby"
import { makeStyles, Container, Box, Grid} from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import introbg from "../../images/introbg.png"
import Buttontransparent from "../buttons/buttontransparent"
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
    },
    buttonspace: {
      [theme.breakpoints.down('md')]: {
        marginTop: "20px"
      }, 
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
      <Grid container>
        <Grid xs={12} md={6} className={classes.buttonspace}>
          <Link to="#infoform">
          <Buttonred><FormattedMessage id="headerbuttonheld"/></Buttonred>
          </Link>
        </Grid>
        <Grid xs={12} md={6} className={classes.buttonspace}>
          <Link to="/partner/login">
          <Buttontransparent><FormattedMessage id="headerbuttoninstitut"/></Buttontransparent>
          </Link>
        </Grid>
     </Grid>
    </Container>
   </Container>
   </Box>
)
}
