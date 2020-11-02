import React from "react"
import { makeStyles, Grid, Container, Box} from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import expert from "../../images/experte.png"
import expertbg from "../../images/expertebg.png"
import zitat from "../../images/zitat.png"

const useStyles = makeStyles(theme => ({
  image:{
    backgroundImage: `url(${expertbg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100%"
  },
  avatar:{
    borderRadius:"50%"
  },
  text:{
    textTransform: "none",
    textAlign:"left"
  },
  quoteimg:{
    float: "right",
    transform: "rotate(180deg)"
  },
  quote:{
    whiteSpace: "pre-line",
    fontStyle: "italic"
  }
}))

export default function Experte() {
  const classes = useStyles()
  return(
  <Box className={classes.image}>
   <Container maxWidth="md">
    <h2><FormattedMessage id="experteintro"/></h2>
    <Box>
    <Grid container spacing={3}>
    <Grid xs={3}>
      <img className={classes.avatar} src={expert} alt="Christian Torres Reyes" />
    </Grid>
    <Grid xs={9}>
     <h3 className={classes.text}><FormattedMessage id="expertename"/></h3>
     <p><FormattedMessage id="expertetitel"/></p>
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
   </Box>
)
}
