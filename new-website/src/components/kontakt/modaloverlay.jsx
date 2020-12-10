import React, {useState} from "react"
import { makeStyles, Container, Box, Grid, Button} from "@material-ui/core"
import { FormattedMessage, Link } from "gatsby-plugin-intl"
import Buttonred from "../buttons/buttonred"
import { useIntl } from 'react-intl';
import ds from "../../pages/datenschutzerklarung.pdf"
import { submitToSlack } from "../contact-form/helper"
import { useForm } from "react-hook-form"

const useStyles = makeStyles(theme => ({
    bg: {
      backgroundColor: "white",
      borderRadius: "30px",
      paddingBottom: "30px"
    },
    inputtext: {
      width: "100%",
      border: "none",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      height: 50,
      borderRadius: 15,
      paddingLeft: 15
    },
    textarea: {
      maxWidth: "97%",
      width: "97%",
      marginBottom: 10,
      border: "none",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      height: 170,
      borderRadius: 15,
      paddingLeft: 15,
      paddingTop: 15,
      fontFamily: "Raleway",
      fontSize: 18,
    },
    input: {
      maxWidth: "97%",
      width: "97%",
      marginBottom: 10,
      border: "none",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      height: 70,
      borderRadius: 15,
      paddingLeft: 15,
      fontFamily: "Raleway",
      fontSize: 18,
    },
    dslink: {
      color: "black",
      fontSize: 16
    },
    labelspace: {
      marginTop: 20
    },
    submitButton: {
      borderRadius: 90,
      backgroundColor: "#FC4141",
      color: "white",
      paddingLeft: 60,
      paddingRight: 60,
      paddingTop: 10,
      paddingBottom: 10,
      margin:"auto",
      fontSize: 18,
      fontWeight: 800,
      display: "flex",
      "&:hover":{
        backgroundColor: "#FC4141"
      }
    }
}));

export default function Modaloverlay() {
  const classes = useStyles()
  const intl = useIntl();
  const message = intl.formatMessage({ id: 'kontaktoverlayanfrage' })
  const contact = intl.formatMessage({ id: 'kontaktoverlaymail' })

  const { register, handleSubmit, formState } = useForm()
  const [error, setError] = useState(false)
  const { isSubmitted } = formState

  const onSubmit = async data => submitToSlack(setError, data)

  return(
  <Box>
   <Container className={classes.bg} >
    <h4><FormattedMessage id="kontaktoverlayhead"/></h4>
      <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container>
      <Grid xs={12} >
        <textarea 
          className={classes.textarea} 
          id="message" 
          required
          name="message" 
          ref={register({ required: true })}
          rows="8" 
          placeholder={message}></textarea>
      </Grid>
      <Grid xs={12} >
        <input 
          className={classes.input} 
          id="contact"
          type="text" 
          name="contact" 
          required
          ref={register({ required: true })}
          placeholder={contact} />   
      </Grid>
      </Grid>
        <input 
          type="checkbox" 
          id="ds" 
          name="ds"
          required />
        <label for="ds"><FormattedMessage id="kontaktAgreementText" values={{
            a: (...chunks) => <a className={classes.dslink} href={ds} target="_blank">{chunks}</a>,
        }}/></label>
        <Box className={classes.labelspace}>
          <Button
            className={classes.submitButton}
            type="submit"
            id="submit"
            value="Absenden"
            disabled={isSubmitted && !error}><FormattedMessage id="kontaktoverlaysend" /></Button>
        </Box>
      </form>
   </Container>
  </Box>
)
}

