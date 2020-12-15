import React from "react"
import { makeStyles, Container, Box} from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import team from "../../images/team-all.jpg"
import Buttonred from "../buttons/buttonred"

const useStyles = makeStyles(theme => ({
    spaceTop: {
      paddingTop: "80px"
    },
    overflow: {
      overflow: "hidden",
      width: "100%",
      position: "relative"
    },
    image1: {
      height:"auto",
      animation: `$myEffect1 50000ms linear infinite`,
      maxWidth: "100%",
      display: "block"
    },
    image2: {
      height:"100%",
      animation: `$myEffect2 50000ms linear infinite`,
      right: "100%",
      width: "100%",
      top: "0",
      position: "absolute",
      maxWidth:"100%",
      display: "block"


    },
    "@keyframes myEffect1": {
      "0%": {
        transform: "translateX(0)"
      },
      "100%": {
        transform: "translateX(100%)"
      }
    },
    "@keyframes myEffect2": {
      "0%": {
        transform: "translateX(0)"
      },
      "100%": {
        transform: "translateX(100%)"
      }
    },
}))

export default function Team() {
  const classes = useStyles()
  return(
  <Box id="team" className={classes.spaceTop}>
   <Container maxWidth="md">
    <h2><FormattedMessage id="teamintro"/></h2>
   </Container>
      <Box className={classes.overflow}>
      <img className={classes.image1} src={team} alt="Team" />
      <img className={classes.image2} src={team} alt="Team" />
      </Box>
   </Box>
)
}
