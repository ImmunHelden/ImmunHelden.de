import React, { useState } from "react"
import { Location } from '@reach/router'
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export const EditForm = ({ partnerId, partnerConfig, docId, doc }) => {
  const classes = useStyles();

  return (
    <form className={classes.root}>
      <TextField disabled fullWidth label="Anchor" defaultValue={"#" + docId} />
      <TextField disabled fullWidth label="Partner ID" defaultValue={partnerId} />
      <TextField fullWidth label="Title" defaultValue={doc.title || ""} />
      <TextField fullWidth label="Address" defaultValue={doc.address || ""} />
      <TextField fullWidth label="Phone" defaultValue={doc.phone || ""} />
      <TextField fullWidth label="Email" defaultValue={doc.email || ""} />
      <TextField fullWidth label="Contact" defaultValue={doc.contact || ""} />
      <Button variant="contained" color="primary" size="large" startIcon={<SaveIcon />}>
        Save
      </Button>
      <Button variant="outlined" color="primary" size="large">
        Cancel
      </Button>
    </form>
  )
}

export default EditForm
