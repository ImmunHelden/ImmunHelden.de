import React, { createRef, useEffect, useState } from "react"
import { makeStyles, Container, Box, Grid, IconButton} from "@material-ui/core"
import { FormattedMessage, Link } from "gatsby-plugin-intl"
import { useForm } from "react-hook-form"
import Buttonred from "../buttons/buttonred"
import ds from "../../pages/datenschutzerklarung.pdf"
import { StaticQuery } from "gatsby"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';

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
    
  let parameter = new URLSearchParams(typeof document !== `undefined` ? document.location.search.substring(1) : null);
  //let subscribeStatus = parameter.get("zipCode"); 
  let subscribeStatus = parameter.get("subscribe"); 
  
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  let params = {};
  let match;
     while(match = regex.exec(typeof window !== `undefined` ? window.location.href : null)) {
     params[match[1]] = match[2];
   }
  function checkParams(params){
    if (params == true) 
    { 
      switch(subscribeStatus) {
        case 'singleOptIn':
            alert("✓ ImmunHelden Updates erfolgreich abonniert. Wir haben Dir eine E-Mail gesendet. Bitte schau rein und bestätige Deine E-Mail Adresse.")
            return ;
        case 'doubleOptIn':
            alert("✓ Danke dass Du Deine E-Mail Adresse bestätigt hast. Bald werden die ersten ImmunHelden Updates in Deinem Posteingang landen.")
            return;
        case 'optOut':
            alert("✓ Dein Abonnement für die ImmunHelden Updates ist beendet. Deine Kontaktdaten wurden gelöscht.")
            return ;
        default:
            alert("Irgendwas ist schief gelaufen! Bitte <a href=\"#questions\">schreib uns</a> und erkläre kurz was passiert ist, sodass wir den Fehler schnell beheben können!")
            return ;          
      }
    }
  }
 

//<form action="/addImmuneHero" method="POST"> 
//<h3>{checkParams(params.hasOwnProperty('zipCode'))}</h3>
  return(
  <Box>
   <Container maxWidth="md" id="infoform" className={classes.topSpace} >
    <h2><FormattedMessage id="introTitle"/></h2>
    <p><FormattedMessage id="introDescription"/></p>
    <h3>{checkParams(params.hasOwnProperty('subscribe'))}</h3>
    <form action="/addImmuneHero" method="POST"> 
      <Grid container>
      <input type="hidden" name="countryCode" value=".de"/>
      <Grid xs={12} sm={4}>
       <input 
          className={classes.inputtext} 
          type="text" 
          id="zipCode"
          name="zipCode"
          required
          placeholder="PLZ" />
      </Grid>
      <Grid xs={12} sm={8}>
       <input 
          className={classes.inputtext} 
          type="email" 
          id="email"
          name="email"
          required
          placeholder="E-Mail" />
      </Grid>
      </Grid>
        <input 
          className={classes.inputcheck} 
          type="checkbox" 
          id="confirmedHero" 
          name="datenschutz"
           />
        <label for="datenschutz"><FormattedMessage id="dpAgreementText" values={{
            a: (...chunks) => <a className={classes.dslink} href={ds} target="_blank">{chunks}</a>,
        }}/></label>
        <Box className={classes.labelspace}>
          <button type="submit" id="submitHero"><FormattedMessage id="letsGoButtonText" /></button>
        </Box>
      </form>
    <span className={classes.info}><FormattedMessage id="forminfo"/></span>
   </Container>
   </Box>
)

}
