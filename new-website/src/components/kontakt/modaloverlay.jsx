import React from "react"
import { makeStyles, Container, Box, Grid, TextField} from "@material-ui/core"
import { FormattedMessage, Link } from "gatsby-plugin-intl"
import Buttonred from "../buttons/buttonred"
import { useIntl } from 'react-intl';

const useStyles = makeStyles(theme => ({
    bg: {
      backgroundColor: "white",
      borderRadius: "30px",
      padding: "30px"
    },
    inputtext: {
      width: "100%",
      border: "none",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      height: 50,
      borderRadius: 15,
      paddingLeft: 15
    },
    width: {
      width: "100%",
      marginBottom: 10,
      borderColor: "gray !imppotant"
    },
    dslink: {
      color: "black",
      fontSize: 16
    },
    labelspace: {
      marginTop: 20
    }
}));

export default function Modaloverlay() {
  const classes = useStyles()
  const intl = useIntl();
  const message = intl.formatMessage({ id: 'kontaktoverlayanfrage' })
  const contact = intl.formatMessage({ id: 'kontaktoverlaymail' })

  return(
  <Box>
   <Container className={classes.bg}>
    <h4><FormattedMessage id="kontaktoverlayhead"/></h4>
      <form>
      <Grid container>
      <Grid xs={12} >
        <textarea className={classes.width} id="" name="message" rows="4" placeholder={message}></textarea>
      </Grid>
      <Grid xs={12} >
        <input className={classes.width} type="text" name="mailphone" placeholder={contact} />   
      </Grid>
      </Grid>
        <input className={classes.inputcheck} type="checkbox" id="ds" name="ds" />
        <label for="ds"><FormattedMessage id="dpAgreementText" values={{
            a: (...chunks) => <Link className={classes.dslink} to="/datenschutz">{chunks}</Link>,
        }}/></label>
        <Box className={classes.labelspace}>
          <Buttonred type="submit"><FormattedMessage id="kontaktoverlaysend" /></Buttonred>
        </Box>
      </form>
   </Container>
  </Box>
)
}

