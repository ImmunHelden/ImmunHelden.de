import React from "react"
import { makeStyles, Container, Box, IconButton} from "@material-ui/core"
import { FormattedMessage } from "gatsby-plugin-intl"
import Buttonwhite from "../buttons/buttonwhite"
import Modaloverlay from "./modaloverlay"

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';

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
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return(
  <Box className={classes.bg}>
   <Container maxWidth="md" className={classes.spacing} >
    <h2 className={classes.headline}><FormattedMessage id="kontaktintro"/></h2>
    <Buttonwhite onClick={handleClickOpen}><FormattedMessage id="kontaktbutton"/></Buttonwhite>
   </Container>

   <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">   
        <DialogActions>
         <IconButton onClick={handleClose}>
          <CloseIcon/>
        </IconButton>
        </DialogActions>
        <Modaloverlay></Modaloverlay>
      </Dialog>
  </Box>
)
}
