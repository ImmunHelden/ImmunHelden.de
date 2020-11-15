import React from "react"
import { makeStyles, Grid, Container } from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import hand from "../../images/icons/handherz.png"
import schloss from "../../images/icons/schloss.png"
import team from "../../images/icons/team.png"

const useStyles = makeStyles(theme => ({
    border: {
      border: 3 ,
      borderColor: "#FC4141",
      borderRadius: 15,
      borderStyle: "solid",
      marginTop: 40,
      marginBottom: 40,
      marginLeft:24,
      marginRight:24,
      width:"auto"
    },
    color:{
      color: "#FC4141",
      paddingBottom: 40,
      
    },
    inline: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.only('sm')]: {
        display: "grid",
      },
    },
    spacing: {
      paddingLeft:10,
      [theme.breakpoints.only('sm')]: {
        padding: "0px",
        margin: "0px"
      },      
    },
    img: {
      [theme.breakpoints.only('sm')]: {
        margin: "auto",
        },
      },

}))

export default function Weare() {
  const classes = useStyles()
  return(
  <Container maxWidth="lg" className={classes.border}>
   <Container maxWidth="md" className={classes.color}>
    <h3><FormattedMessage id="weare"/></h3>
    <Grid container spacing={3}>
    <Grid className={classes.inline} xs={12} sm={4}>
      <img className={classes.img} src={team} alt="Ehrenamtlich" />
      <p className={classes.spacing}><FormattedMessage id="honorary"/></p>
    </Grid>
    <Grid className={classes.inline} xs={12} sm={4}>
     <img className={classes.img} src={hand} alt="Uneigennützig" />
     <p className={classes.spacing}><FormattedMessage id="unselfish"/></p>
    </Grid>
    <Grid className={classes.inline} xs={12} sm={4}>
      <img className={classes.img} src={schloss} alt="Open Source" />
      <p className={classes.spacing}><FormattedMessage id="opensource"/></p>
    </Grid>
    </Grid>
   </Container>
  </Container>

)
}
