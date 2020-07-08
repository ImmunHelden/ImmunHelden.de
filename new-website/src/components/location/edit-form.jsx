import React, { useState } from "react"
import { Location } from '@reach/router'
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import firebase from "gatsby-plugin-firebase"
import { navigate, useIntl } from "gatsby-plugin-intl"
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export const EditForm = ({ partnerId, collection, docId, doc, onError }) => {
  const classes = useStyles()
  const { formatMessage } = useIntl()

  const [title, setTitle] = useState(doc.title || "")
  const [address, setAddress] = useState(doc.address || "")
  const [phone, setPhone] = useState(doc.phone || "")
  const [email, setEmail] = useState(doc.email || "")
  const [contact, setContact] = useState(doc.contact || "")

  function handleSubmit(event) {
    event.preventDefault()
    try {
      if (!title || title.length < 0) {
        onError({ code: "requiredFieldMissing/title" })
        return
      }
      firebase.firestore().collection(collection).doc(docId).update({
          title: title,
          address: address,
          phone: phone,
          email: email,
          contact: contact,
        })
        .catch(onError)
      navigate("/partner/", {
        replace: true,
        state: { result: "saved" },
      })
    } catch (err) {
      console.log(err)
      onError({ code: err.message })
    }
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField disabled fullWidth label={formatMessage({ id: "partnerLocation_Anchor" })} value={"#" + docId} />
      <TextField disabled fullWidth label={formatMessage({ id: "partnerLocation_PartnerID" })} value={partnerId} />
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
