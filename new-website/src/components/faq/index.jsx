import React from "react"
import { makeStyles, Container, Box} from "@material-ui/core"
import { FormattedMessage, FormattedHTMLMessage } from "gatsby-plugin-intl"
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const faq_categories = [
  "faq_blutplasma",
  "faq_imm"
]

const faq_imm = [
  { question: <FormattedMessage id="faq_imm_1q"/>, answer: <FormattedHTMLMessage id="faq_imm_1a"/>, panelid: 'faq_imm_1' },
  { question: <FormattedMessage id="faq_imm_2q"/>, answer: <FormattedHTMLMessage id="faq_imm_2a"/>, panelid: 'faq_imm_2' },
  { question: <FormattedMessage id="faq_imm_3q"/>, answer: <FormattedHTMLMessage id="faq_imm_3a"/>, panelid: 'faq_imm_3' },
  { question: <FormattedMessage id="faq_imm_4q"/>, answer: <FormattedHTMLMessage id="faq_imm_4a"/>, panelid: 'faq_imm_4' },
  { question: <FormattedMessage id="faq_imm_5q"/>, answer: <FormattedHTMLMessage id="faq_imm_5a"/>, panelid: 'faq_imm_5' },
  { question: <FormattedMessage id="faq_imm_6q"/>, answer: <FormattedHTMLMessage id="faq_imm_6a"/>, panelid: 'faq_imm_6' },
];

const faq_corona = [
  { question: <FormattedMessage id="faq_corona_1q"/>, answer: <FormattedHTMLMessage id="faq_corona_1a"/>, panelid: 'faq_corona_1' },
  { question: <FormattedMessage id="faq_corona_2q"/>, answer: <FormattedHTMLMessage id="faq_corona_2a"/>, panelid: 'faq_corona_2' },
  { question: <FormattedMessage id="faq_corona_3q"/>, answer: <FormattedHTMLMessage id="faq_corona_3a"/>, panelid: 'faq_corona_3' },
  { question: <FormattedMessage id="faq_corona_4q"/>, answer: <FormattedHTMLMessage id="faq_corona_4a"/>, panelid: 'faq_corona_4' },
  { question: <FormattedMessage id="faq_corona_5q"/>, answer: <FormattedHTMLMessage id="faq_corona_5a"/>, panelid: 'faq_corona_5' },
  { question: <FormattedMessage id="faq_corona_6q"/>, answer: <FormattedHTMLMessage id="faq_corona_6a"/>, panelid: 'faq_corona_6' },
  { question: <FormattedMessage id="faq_corona_7q"/>, answer: <FormattedHTMLMessage id="faq_corona_7a"/>, panelid: 'faq_corona_7' },


];

export default function Faq() {
  const useStyles = makeStyles({
    spaceTop: {
      paddingTop: "80px"
    },
    question: {
      fontFamily: "Raleway",
      fontWeight: "800",
      fontStyle: "italic"
    },   
    answer: {
      fontFamily: "Open Sans",
      fontWeight: "300",
      fontSize: "18px"
    } ,
    head: {
      textAlign: "left"
    },
    padding: {
      padding: "0px"
    }
  
  })

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  return (
    <Box id="faq" className={classes.spaceTop}>
      <Container maxWidth="md">
        <h2><FormattedMessage id="faq_head"/></h2>
        <h3 className={classes.head}><FormattedMessage id="faq_imm_head"/></h3>
          {faq_imm.map(({ question, answer, panelid }) => (
             <Accordion  elevation = "0" expanded={expanded === panelid} onChange={handleChange(panelid)}>
             <AccordionSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls={panelid}
               id={panelid}
               className={classes.padding}>
               <Typography className={classes.question} >{question}</Typography>
             </AccordionSummary>
             <AccordionDetails className={classes.padding}>
               <div className={classes.answer}>
                 {answer}
               </div>
             </AccordionDetails>
           </Accordion>
        ))}
        <h3 className={classes.head}><FormattedMessage id="faq_corona_head"/></h3>
          {faq_corona.map(({ question, answer, panelid }) => (
             <Accordion  elevation = "0" expanded={expanded === panelid} onChange={handleChange(panelid)}>
             <AccordionSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls={panelid}
               id={panelid}
               className={classes.padding}>
               <Typography className={classes.question} >{question}</Typography>
             </AccordionSummary>
             <AccordionDetails className={classes.padding}>
               <div className={classes.answer}>
                 {answer}
               </div>
             </AccordionDetails>
           </Accordion>
        ))}
      </Container>
    </Box>
  )
}

