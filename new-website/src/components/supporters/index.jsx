import React from "react"
import { makeStyles, Container, Grid } from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import minds from "../../images/logos/5Minds.png"
import fuchs from "../../images/logos/fuchsundl.png"
import prototypefund from "../../images/logos/prototypefund.png"
import sdg from "../../images/logos/sdg.png"
import vodafone from "../../images/logos/vodafone.png"
import wvv from "../../images/logos/wvv.png"
import youknow from "../../images/logos/youknow.png"
import bmbf from "../../images/logos/bmbf.jpg"
import projecttogether from "../../images/logos/projecttogether.png"
import rapidusertests from "../../images/logos/rapidusertests.png"
import silberplus from "../../images/logos/silberpuls.png"

const useStyles = makeStyles(theme => ({
    image: {
        padding: "20px",
        maxHeight: "50px",
        margin: "auto",
        display: "flex"
    }
}))

const images = [
  { alt: `wirvsvirus`, link: `https://wirvsvirus.org/`, path: wvv},
  { alt: `Prototype Fund`, link: `https://prototypefund.de/project/immunhelden/`, path: prototypefund},
  { alt: `youknow`, link: `https://you-know.de/`, path: youknow},
  { alt: `Studio von Fuchs und Lommatzsch`, link: `http://www.vonfuchsundlommatzsch.com/`, path: fuchs},
  { alt: `Vodafone`, link: `https://www.vodafone-institut.de/events/immunhelden-everyday-life-heroes/`, path: vodafone},
  { alt: `sdg`, link: `https://www.datenschutz-kanzlei.info/`, path: sdg},
  { alt: `5Minds`, link: `https://www.5minds.de/`, path: minds},
  { alt: `Bundesministerium für Bildung und Forschung`, link: `https://www.bmbf.de/de/uebersicht-der-bmbf-gefoerderten-projekte-aus-dem-hackathon-11634.html`, path: bmbf},
  { alt: `Project Together`, link: `https://platform.projecttogether.org/public/project/jOr4TLzNn2QvVafrmU6WpoJZR5C3`, path: projecttogether},
  { alt: `Rapid User Tests`, link: `https://rapidusertests.com/?utm_source=referral&utm_campaign=immunhelden_sponsoring&utm_medium=link`, path: rapidusertests},
  { alt: `Silberplus`, link: `https://de.silberpuls.de/`, path: silberplus},
]

export default function Supporters() {
  const classes = useStyles()
  return(
  <Container maxWidth="lg">
  <h3><FormattedMessage id="supporters" /></h3>
    <Grid container>
            {images.map(({ alt, link, path }) => (
              <Grid xs={6} sm={4} md={2}>
                <a href={link} target="_blank" rel="noreferrer">
                  <img src={path} className={classes.image} alt={alt} />
                </a> 
               </Grid>
            ))}
    </Grid>
  </Container>
)
}
