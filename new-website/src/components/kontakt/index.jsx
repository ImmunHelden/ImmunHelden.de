import React from "react"
import { makeStyles, Container, Box, Modal} from "@material-ui/core"
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
}));

export default function Kontakt() {
  const classes = useStyles()
  const body = (
    <div>
      <h2 id="simple-modal-title">Text in a modal</h2>
      <p id="simple-modal-description">
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </p>
    </div>
  );

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return(
  <Box className={classes.bg}>
   <Container maxWidth="md" className={classes.spacing} >
    <h2 className={classes.headline}><FormattedMessage id="kontaktintro"/></h2>
    <Buttonwhite onClick={handleOpen}><FormattedMessage id="kontaktbutton"/></Buttonwhite>
   </Container>

  { open &&
   <Modal
    open={open}
    onClose={handleClose}
    closeAfterTransition
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description">
    {body}
  </Modal>
  }
  </Box>
)
}
