import React, { useState } from "react"
import { Location } from '@reach/router'
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import firebase from "gatsby-plugin-firebase"
import { navigate, useIntl } from "gatsby-plugin-intl"
import SaveIcon from '@material-ui/icons/Save';
import { LOCATION_COLLECTION } from "."

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export const EditForm = ({ docId, doc, onError }) => {
  const classes = useStyles()
  const { formatMessage } = useIntl()

  const [title, setTitle] = useState(doc.title || "")
  const [address, setAddress] = useState(doc.address || "")
  const [phone, setPhone] = useState(doc.phone || "")
  const [email, setEmail] = useState(doc.email || "")
  const [contact, setContact] = useState(doc.contact || "")

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      // Throws explicitly if the title is empty.
      if (!title || title.length === 0)
        throw new Error("requiredFieldMissing/title")

      // Blocks until the update operation is complete and throws if it failed.
      await firebase.firestore().collection(LOCATION_COLLECTION).doc(docId).update({
        title: title,
        address: address,
        phone: phone,
        email: email,
        contact: contact,
      })

      navigate("/partner/", {
        replace: true,
        state: { result: "saved" },
      })
    } catch (err) {
      // Block submit and prevent navigation, so the user can fix the issue.
      onError(err)
    }
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField disabled fullWidth label={formatMessage({ id: "partnerLocation_Anchor" })} value={"#" + docId} />
      <TextField disabled fullWidth label={formatMessage({ id: "partnerLocation_PartnerID" })} value={doc.partnerId} />
      <TextField fullWidth label={formatMessage({ id: "partnerLocation_Title" })} value={title} onChange={e => setTitle(e.target.value)} />
      <TextField fullWidth label={formatMessage({ id: "partnerLocation_Address" })} value={address} onChange={e => setAddress(e.target.value)} />
      <TextField fullWidth label={formatMessage({ id: "partnerLocation_Phone" })} value={phone} onChange={e => setPhone(e.target.value)} />
      <TextField fullWidth label={formatMessage({ id: "partnerLocation_Email" })} value={email} onChange={e => setEmail(e.target.value)} />
      <TextField fullWidth label={formatMessage({ id: "partnerLocation_Contact" })} value={contact} onChange={e => setContact(e.target.value)} />
      <Button type="submit" variant="contained" color="primary" size="large" startIcon={<SaveIcon />}>
        Save
      </Button>
      <Button variant="outlined" color="primary" size="large" onClick={() => navigate("/partner/")}>
        Back
      </Button>
    </form>
  )
}

export default EditForm
