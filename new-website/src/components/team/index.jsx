import React from "react"
import { makeStyles, Container, Box} from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import team from "../../images/team-all.jpg"
import Buttonred from "../buttons/buttonred"

const useStyles = makeStyles(theme => ({
    image: {
      height:200
    }
}))

export default function Team() {
  const classes = useStyles()
  return(
  <Box>
   <Container maxWidth="md">
    <h2><FormattedMessage id="teamintro"/></h2>
   </Container>
   <img className={classes.image} src={team} alt="Teammitglieder der Immunhelden" />
   <Container maxWidth="md">
    <Buttonred><FormattedMessage id="teambutton"/></Buttonred>
   </Container>
   </Box>
)
}
