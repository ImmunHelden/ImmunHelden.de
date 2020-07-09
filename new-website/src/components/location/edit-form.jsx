import React, { useState } from "react"
import { Location } from '@reach/router'
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import firebase from "gatsby-plugin-firebase"
import { navigate, useIntl } from "gatsby-plugin-intl"
import SaveIcon from '@material-ui/icons/Save';
import { LOCATION_COLLECTION } from "."

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    '& > *': {
      margin: theme.spacing(1),
    },
  }
}));

export const EditForm = ({ docId, doc, onError }) => {
  const [state, setState] = React.useState({
    title: doc.title || "",
    address: doc.address || "",
    phone: doc.phone || "",
    email: doc.email || "",
    contact: doc.contact || "",
    published: doc.published || false,
  })

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      // Throws explicitly if the title is empty.
      if (!state.title || state.title.length === 0)
        throw new Error("requiredFieldMissing/title")

      // Blocks until the update operation is complete and throws if it failed.
      await firebase.firestore().collection(LOCATION_COLLECTION).doc(docId).update(state)

      navigate("/partner/", {
        replace: true,
        state: { result: "saved" },
      })
    } catch (err) {
      // Block submit and prevent navigation, so the user can fix the issue.
      onError(err)
    }
  }

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value })
  }
  const handleChecked = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked })
  }

  const classes = useStyles()
  const { formatMessage } = useIntl()

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField disabled label={formatMessage({ id: "partnerLocation_Anchor" })} value={"#" + docId} />
      <TextField disabled label={formatMessage({ id: "partnerLocation_PartnerID" })} value={doc.partnerId} />
      <TextField name="title" label={formatMessage({ id: "partnerLocation_Title" })} defaultValue={state.title} onChange={handleChange} />
      <TextField name="address" label={formatMessage({ id: "partnerLocation_Address" })} defaultValue={state.address} onChange={handleChange} />
      <TextField name="phone" label={formatMessage({ id: "partnerLocation_Phone" })} defaultValue={state.phone} onChange={handleChange} />
      <TextField name="email" label={formatMessage({ id: "partnerLocation_Email" })} defaultValue={state.email} onChange={handleChange} />
      <TextField name="contact" label={formatMessage({ id: "partnerLocation_Contact" })} defaultValue={state.contact} onChange={handleChange} />
      <FormControlLabel
        control={<Checkbox name="published" checked={state.published} onChange={handleChecked} />}
        label={formatMessage({ id: "partnerLocation_Published" })}
      />
      <FormGroup className={classes.row}>
        <Button type="submit" variant="contained" color="primary" size="large" startIcon={<SaveIcon />}>
          Save
        </Button>
        <Button variant="outlined" color="primary" size="large" onClick={() => navigate("/partner/")}>
          Back
        </Button>
      </FormGroup>
    </form>
  )
}

export default EditForm
