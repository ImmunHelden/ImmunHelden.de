import React, { useState } from "react"
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import firebase from "gatsby-plugin-firebase"
import { navigate, useIntl } from "gatsby-plugin-intl"
import SaveIcon from '@material-ui/icons/Save';
import { LOCATION_COLLECTION } from "."
import { RichTextEditor, initFromSnapshot, makeSnapshot } from './edit-rich-text'

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
    margin: '0',
    '& > *': {
      margin: theme.spacing(1),
      flex: 'auto',
    },
  },
  editorLabel: {
    alignItems: 'normal',
    paddingTop: '15px',
  },
}))

export const EditForm = ({ docId, doc, onError }) => {
  const classes = useStyles()
  const { formatMessage } = useIntl()

  const [editorState, setEditorState] = useState(
    initFromSnapshot(doc.description)
  )

  const [state, setState] = useState({
    title: doc.title || "",
    address: doc.address || "",
    phone: doc.phone || "",
    email: doc.email || "",
    published: doc.published || false,
  })

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      // Throws explicitly if the title is empty.
      if (!state.title || state.title.length === 0)
        throw new Error("requiredFieldMissing/title")

      state.description = makeSnapshot(editorState)

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

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormGroup className={classes.row}>
        <TextField disabled label={formatMessage({ id: "partnerLocation_Anchor" })} value={"#" + docId} />
        <TextField disabled label={formatMessage({ id: "partnerLocation_PartnerID" })} value={doc.partnerId} />
      </FormGroup>
      <FormGroup className={classes.row}>
        <TextField name="title" label={formatMessage({ id: "partnerLocation_Title" })} defaultValue={state.title} onChange={handleChange} />
        <TextField name="address" label={formatMessage({ id: "partnerLocation_Address" })} defaultValue={state.address} onChange={handleChange} />
      </FormGroup>
      <FormGroup className={classes.row}>
        <TextField name="phone" label={formatMessage({ id: "partnerLocation_Phone" })} defaultValue={state.phone} onChange={handleChange} />
        <TextField name="email" label={formatMessage({ id: "partnerLocation_Email" })} defaultValue={state.email} onChange={handleChange} />
      </FormGroup>
      <FormControlLabel
        className={classes.editorLabel}
        label={formatMessage({ id: "partnerLocation_Description" })}
        labelPlacement="top"
        control={
          <RichTextEditor editorState={editorState} setEditorState={setEditorState} />
        }
      />
      <FormControlLabel
        control={
          <Checkbox
            name="published"
            color="primary"
            checked={state.published}
            onChange={handleChecked}
            style={{ paddingLeft: "0" }}
          />}
        label={formatMessage({ id: "partnerLocation_Published" })}
      />
      <FormGroup className={classes.row}>
        <Button variant="contained" color="primary" size="large"
                type="submit" startIcon={<SaveIcon />}>
          { formatMessage({ id: "partnerLocation_Submit" }) }
        </Button>
        <Button variant="outlined" color="primary" size="large"
                onClick={() => navigate("/partner/")}>
          { formatMessage({ id: "partnerLocation_Discard" }) }
        </Button>
      </FormGroup>
    </form>
  )
}

export default EditForm
