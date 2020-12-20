import React, { createRef } from "react"
import { makeStyles, Container, Box, Grid} from "@material-ui/core"
import { FormattedMessage, Link } from "gatsby-plugin-intl"
import { useForm } from "react-hook-form"
import Buttonred from "../buttons/buttonred"
import ds from "../../pages/datenschutzerklarung.pdf"
import { StaticQuery } from "gatsby"

const useStyles = makeStyles(theme => ({
    image: {
      height:200
    },
    topSpace: {
      paddingTop:"80px"
    },
    info: {
      color: "gray",
      textAlign: "center",
      width: "50%",
      margin: "auto",
      display: "inherit",
      paddingTop: 30,
      fontSize: 12
    },
    inputtext: {
      width: "90%",
      border: "none",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      height: 70,
      borderRadius: 15,
      paddingLeft: 15,
      [theme.breakpoints.down('xs')]: {
        marginTop: 10,
        width: "97%"
      },
    },
    dslink: {
      color: "black",
      fontSize: 16
    },
    inputcheck: {
      marginTop: 20
    },
    labelspace: {
      marginTop: 20
    }
}))

export default function Infoform() {
  const classes = useStyles();
  const { register} = useForm();
  let plzref = createRef();
  let mailref = createRef();

  const handleSubmit = (event) => {
    event.preventDefault ()
    console.log("SUBMIT!", plzref.current.value, mailref.current.value );
    fetch('/addImmuneHeroAsJSON')
      .then(response => console.log(response))
  }



  return(
  <Box>
   <Container maxWidth="md" id="infoform" className={classes.topSpace} >
    <h2><FormattedMessage id="introTitle"/></h2>
    <p><FormattedMessage id="introDescription"/></p>
      <form onSubmit={(event)=>handleSubmit(event)} action="#">
      <Grid container>
      <Grid xs={12} sm={4}>
       <input 
          className={classes.inputtext} 
          type="text" 
          id="postcode"
          name="postcode"
          ref={plzref}
          
          placeholder="PLZ" />
      </Grid>
      <Grid xs={12} sm={8}>
       <input 
          className={classes.inputtext} 
          type="email" 
          id="email"
          name="email"
          ref={mailref}
          
          placeholder="E-Mail" />
      </Grid>
      </Grid>
        <input 
          className={classes.inputcheck} 
          type="checkbox" 
          id="ds" 
          name="ds"
           />
        <label for="ds"><FormattedMessage id="dpAgreementText" values={{
            a: (...chunks) => <a className={classes.dslink} href={ds} target="_blank">{chunks}</a>,
        }}/></label>
        <Box className={classes.labelspace}>
          <Buttonred type="submit"><FormattedMessage id="letsGoButtonText" /></Buttonred>
        </Box>
      </form>
    <span className={classes.info}><FormattedMessage id="forminfo"/></span>
   </Container>
   </Box>
)
}
