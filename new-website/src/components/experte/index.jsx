import React from "react"
import { makeStyles, Grid, Container, Box} from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import expert from "../../images/experte.jpg"
import zitat from "../../images/zitat.png"

const useStyles = makeStyles(theme => ({
  spaceing:{
    paddingTop: "80px",
    marginBottom: "200px"
  },
  
  avatar:{
    borderRadius:"50%"
  },
  text:{
    textTransform: "none",
    textAlign:"left",
    marginBottom: "0px",
  },
  experttitle:{
    marginTop: "0px",
  },
  quoteimg:{
    float: "right",
    transform: "rotate(180deg)"
  },
  quote:{
    whiteSpace: "pre-line",
    fontStyle: "italic"
  },
  dot1: {
    height: 400,
    width: 400,
    backgroundColor: "#FC4141",
    borderRadius: "50%",
    position: "absolute",
    zIndex: "-1",
    right: "80%",
    marginTop: "-115px",
    position: "absolute",
    zIndex: "-1",
    right: "80%",
    marginTop: "-115px",
  },
  dot2: {
    height: 550,
    width: 550,
    backgroundColor: "#FC4141",
    borderRadius: "50%",
    position: "absolute",
    zIndex: "-1",
    left: "80%",
    marginTop: "-275px",
    overflow: "hidden",
  },

  dot3: {
    height: 370,
    width: 370,
    backgroundColor: "#FC4141",
    borderRadius: "50%",
    position: "absolute",
    zIndex: "-1",
    left: "80%",
    marginTop: "-210px",
},
  relative: {
    position: "relative",
  }
}))

export default function Experte() {
  const classes = useStyles()
  return(
  <Box className={classes.spaceing} id="expert">
    <div className={classes.relative}>
      <span className={classes.dot1}></span>
    </div>
    <div className={classes.relative}>
      <span className={classes.dot2}></span>
    </div>  
   <Container maxWidth="md">
    <h2><FormattedMessage id="experteintro"/></h2>
    <Box>
    <Grid container spacing={3}>
    <Grid sm={3} xs={12}>
      <img className={classes.avatar} src={expert} alt="Christian Torres Reyes" />
    </Grid>
    <Grid sm={9} xs={12}>
     <h3 className={classes.text}><FormattedMessage id="expertename"/></h3>
     <p className={classes.experttitle}><FormattedMessage id="expertetitel"/></p>
    </Grid>
    </Grid>
    <Grid container>
    <Grid xs={12}>
    <img src={zitat} alt="Zitat Anführungszeichen" />
     <p className={classes.quote}><FormattedMessage id="expertezitat"/></p>
    <img className={classes.quoteimg} src={zitat} alt="Zitat Anführungszeichen" />
    </Grid>
    </Grid>
    </Box>
   </Container>
   <div className={classes.relative}>
    <span className={classes.dot3}></span>
   </div>
   </Box>
)
}
