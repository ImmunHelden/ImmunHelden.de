import React from "react"
import { makeStyles, Container, Box} from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import Buttonwhite from "../buttons/buttonwhite"

const useStyles = makeStyles(theme => ({
    bg: {
      backgroundColor: "#FC4141"
    },
    headline: {
      color: "white",
      textAlign: "center"
    },
    spacing: {
      paddingTop: 25,
      paddingBottom: 60,
      marginTop: 50,
    }
}))

export default function Kontakt() {
  const classes = useStyles()
  return(
  <Box className={classes.bg}>
   <Container maxWidth="md" className={classes.spacing} >
    <h2 className={classes.headline}><FormattedMessage id="kontaktintro"/></h2>
    <Buttonwhite><FormattedMessage id="kontaktbutton"/></Buttonwhite>
   </Container>
  </Box>
)
}
