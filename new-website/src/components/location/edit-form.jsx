import React, { useState } from "react"
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Checkbox, Switch, FormControlLabel, FormGroup } from '@material-ui/core';
import firebase from "gatsby-plugin-firebase"
import { navigate, useIntl } from "gatsby-plugin-intl"
import SaveIcon from '@material-ui/icons/Save';
import { LOCATION_COLLECTION } from "."
import { RichTextEditor, initFromSnapshot, makeSnapshot } from './edit-rich-text'
import * as Sentry from "@sentry/browser"

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

function sentryInfo(msg) {
  Sentry.withScope(scope => {
    scope.setLevel("info")
    Sentry.captureEvent({ message: msg })
  })
}

function sentryWarn(msg) {
  Sentry.withScope(scope => {
    scope.setLevel("warning")
    Sentry.captureEvent({ message: msg })
  })
}

function sentryFatal(err) {
  Sentry.withScope(scope => {
    scope.setLevel("fatal")
    Sentry.captureException(err)
  })
}

// Resolve coordinates for given address with LocationIQ
async function requestLatLng(address) {
  const sleep = async (ms) => {
    await new Promise((wakeup, _) => setTimeout(wakeup, ms));
  };
  const tryResolve = async (address, retries) => {
    const STATUS_CODE_RATE_LIMIT_EXCEEDED = 429
    for (let i = 0; i < retries; i++) {
      // TODO: Easy way to hide our key? (not urgent, it's a free account)
      const baseUrl = "https://eu1.locationiq.com/v1/search.php"
      const queryBase = "key=pk.861b8037ac48a2b23d05c90e89658064&format=json&q="

      try {
        const response = await fetch(baseUrl + "?" + queryBase + address)
        if (response.ok) {
          // Success
          return await response.json()
        } else if (response.status === STATUS_CODE_RATE_LIMIT_EXCEEDED) {
          // Rate limit reached: report warning, wait 500ms and try again
          sentryWarn("Rate limit reached resolving address " +
                      `'${address}': ${response.statusText}`)
          await sleep(500);
        } else {
          // Unknown error
          throw response
        }
      } catch (err) {
        sentryFatal(err)
        throw err
      }
    }
    throw new Error("resolutionFailure/timeout")
  }

  const matches = await tryResolve(address, 3)
  const haveAtLeastOneResult =
      matches.hasOwnProperty("length") && matches.length > 0 &&
      matches[0].hasOwnProperty("lat") && matches[0].hasOwnProperty("lon")

  if (!haveAtLeastOneResult)
    throw new Error("resolutionFailure/notFound")

  // Success
  return [parseFloat(matches[0].lat), parseFloat(matches[0].lon)]
}

export const EditForm = ({ docId, doc, onError }) => {
  const classes = useStyles()
  const { formatMessage } = useIntl()

  const [editorState, setEditorState] = useState(
    initFromSnapshot(doc.description)
  )

  const [state, setState] = useState({
    title: doc.title || "",
    website: doc.website || "",
    address: doc.address || "",
    phone: doc.phone || "",
    email: doc.email || "",
    published: doc.published || false,
    latlngExplicit: doc.latlngExplicit || false,
    latlng: doc.latlng || { latitude: 0, longitude: 0 },
  })

  const [explLat, setExplLat] = useState(state.latlng.latitude)
  const [explLng, setExplLng] = useState(state.latlng.longitude)

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      let coord = [0, 0]
      if (state.latlngExplicit) {
        // Make sure we have numbers in both fields.
        if (!explLat || isNaN(explLat))
          throw new Error("requiredFieldMissing/lat")
        if (!explLng || isNaN(explLng))
          throw new Error("requiredFieldMissing/lng")
        coord = [parseFloat(explLat), parseFloat(explLng)]
      } else if (state.address.length > 0) {
        // Resolve location for given address (or throw if we don't get one).
        coord = await requestLatLng(state.address)
        sentryInfo("Resolved coordinates for address " +
                   `${state.address} to [${coord[0]}, ${coord[1]}]`)
      }

      state.latlng = new firebase.firestore.GeoPoint(coord[0], coord[1])
      state.description = makeSnapshot(editorState)

      // Throws explicitly if the title is empty.
      if (state.published) {
        if (state.title.length === 0)
          throw new Error("requiredFieldMissing/title")
        if (coord === [0, 0])
          throw new Error("requiredFieldMissing/address")
      }

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
  const handleExplLatLng = async (event) => {
    handleChecked(event)

    // We are done here, if we (1) switched of, (2) have stored values for
    // latlng, (3) have unsaved values for latlng, or (4) have no address.
    if (!event.target.checked)
      return
    if (state.latlng.latitude !== 0 && state.latlng.longitude !== 0)
      return
    if (explLat !== 0 && explLng !== 0)
      return
    if (state.address.length === 0)
      return

    // Otherwise try to resolve and fill in location of current address.
    try {
      const [lat, lng] = await requestLatLng(state.address)
      sentryInfo("Resolved coordinates for address " +
                 `${state.address} to [${lat}, ${lng}]`)
      setExplLat(lat)
      setExplLng(lng)
    } catch (err) {
      onError(err)
    }
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormGroup className={classes.row}>
        <TextField disabled label={formatMessage({ id: "partnerLocation_Anchor" })} value={"#" + docId} />
        <TextField disabled label={formatMessage({ id: "partnerLocation_PartnerID" })} value={doc.partnerId} />
      </FormGroup>
      <FormGroup className={classes.row}>
        <TextField name="title" label={formatMessage({ id: "partnerLocation_Title" })} value={state.title} onChange={handleChange} />
        <TextField name="website" label={formatMessage({ id: "partnerLocation_Website" })} value={state.website} onChange={handleChange} />
      </FormGroup>
      <FormGroup className={classes.row}>
        <TextField name="phone" label={formatMessage({ id: "partnerLocation_Phone" })} value={state.phone} onChange={handleChange} />
        <TextField name="email" label={formatMessage({ id: "partnerLocation_Email" })} value={state.email} onChange={handleChange} />
      </FormGroup>
      <FormGroup className={classes.row}>
        <TextField name="address" label={formatMessage({ id: "partnerLocation_Address" })} value={state.address} onChange={handleChange} />
      </FormGroup>
      <FormGroup className={classes.row}>
        <FormControlLabel
          control={
            <Switch
              name="latlngExplicit"
              color="primary"
              checked={state.latlngExplicit}
              onChange={handleExplLatLng}
            />
          }
          label={formatMessage({ id: "partnerLocation_ExplicitPinPosition" })}
        />
        {state.latlngExplicit && (
          <>
            <TextField
              value={explLat}
              onChange={e => setExplLat(e.target.value)}
              label={formatMessage({ id: "partnerLocation_Latitude" })}
            />
            <TextField
              value={explLng}
              onChange={e => setExplLng(e.target.value)}
              label={formatMessage({ id: "partnerLocation_Longitude" })}
            />
          </>
        )}
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
