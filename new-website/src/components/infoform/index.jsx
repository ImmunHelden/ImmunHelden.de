import React from "react"
import { makeStyles, Container, Box} from "@material-ui/core"
import { FormattedMessage, Link } from "gatsby-plugin-intl"
import { useForm } from "react-hook-form"
import Buttonred from "../buttons/buttonred"

const useStyles = makeStyles(theme => ({
    image: {
      height:200
    }
}))

export default function Infoform() {
  const classes = useStyles();
  const { register, errors, handleSubmit } = useForm();
  return(
  <Box>
   <Container maxWidth="md">
    <h2><FormattedMessage id="introTitle"/></h2>
    <p><FormattedMessage id="introDescription"/></p>
      <form>
        <input type="text" name="firstName" />
        <input type="text" name="lastName" />
        <input type="checkbox" id="ds" name="ds" />
        <label for="ds"><FormattedMessage id="dpAgreementText" values={{
            a: (...chunks) => <Link to="/datenschutz">{chunks}</Link>,
        }}/></label>
          <Buttonred type="submit"><FormattedMessage id="letsGoButtonText" /></Buttonred>
      </form>

    <span><FormattedMessage id="forminfo"/></span>
   </Container>
   </Box>
)
}
