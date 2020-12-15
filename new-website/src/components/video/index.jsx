import React, { useState } from "react"
import { makeStyles, Container, Box} from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import videobg from "../../images/videobg.png"
import Buttonwhite from "../buttons/buttonwhite"
import { ArrowRight } from "@material-ui/icons"

const useStyles = makeStyles(theme => ({
    background: {
      backgroundImage: `url(${videobg})`,
      boxShadow: "inset 2000px 0 0 0 rgba(0, 0, 0, 0.5)",
      borderColor: "rgba(0, 0, 0, 1)",  
      color: "white",  
      textAlign: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundPosition: "center",
      borderRadius: 30
    },
    padding: {
      paddingTop: "6rem",
      paddingBottom: "6rem"
    },
    video: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    videocontainer: {
      position: "relative",
      paddingBottom: "50%",
      paddingTop: 0,
      height: 0,
      overflow: "hidden"
    },
    space: {
      paddingBottom: "80px",
      paddingTop: "80px",
      [theme.breakpoints.down('md')]: {
        marginLeft:24,
        marginRight:24,
      },
    }
  }))


export default function Video() {
  const classes = useStyles()
  const [overlay, setOverlay] = useState(true);

  return(
  <Box className={classes.space} id="video">
  { overlay &&
   <Container maxWidth="lg" className={classes.background}>
     <Container maxWidth="md" className={classes.padding}>
    <h2><FormattedMessage id="videointro"/></h2> 
    <p><FormattedMessage id="videotext"/></p>
    <Buttonwhite aria-label="home" onClick={() => setOverlay(false)}><ArrowRight fontSize="large" /><FormattedMessage id="videobutton"/></Buttonwhite>
    </Container>
   </Container>
  }
  { overlay ||
   <Container maxWidth="lg" className={classes.videocontainer}>
    <iframe className={classes.video} src="https://www.youtube.com/embed/fyPF3RUv00A" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
   </Container>
  }
   </Box>
)
}
