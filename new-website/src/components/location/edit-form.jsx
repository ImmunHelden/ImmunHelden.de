import React, { useState } from "react"
import { Location } from '@reach/router'
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import firebase from "gatsby-plugin-firebase"
import { navigate, useIntl } from "gatsby-plugin-intl"
import SaveIcon from '@material-ui/icons/Save';
import { LOCATION_COLLECTION } from "."
import { Editor, EditorState, RichUtils } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';

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
  editorRoot: {
    border: '1px solid gray',
    background: '#eee',
  },
  editorHead: {
    padding: '0 2px',
  },
  editorText: {
    fontFamily: 'monospace',
    padding: '15px',
    cursor: 'text',
    minHeight: '6em',
    background: '#fff',
    borderTop: '1px solid #ddd',
  },
  editorControls: {
    fontFamily: '"Helvetica", sans-serif',
    fontSize: '14px',
    color: '#333',
    userSelect: 'none',
    '& > *': {
      display: 'inline-block',
      cursor: 'pointer',
      margin: '4px 2px',
      padding: '8px',
    },
  },
  editorActiveButton: {
    background: '#ddd',
    borderRadius: '5px',
  },
}));

export const EditForm = ({ docId, doc, onError }) => {
  const classes = useStyles()
  const { formatMessage } = useIntl()

  function initEditorState() {
    if (doc.hasOwnProperty("description")) {
      return EditorState.createWithContent(stateFromHTML(doc.description))
    }
    return EditorState.createEmpty()
  }

  const editor = React.useRef(null)
  const [editorState, setEditorState] = useState(initEditorState())

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

      state.description = stateToHTML(editorState.getCurrentContent())

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

  React.useEffect(() => editor.current.focus(), [])

  class StyleButton extends React.Component {
    constructor() {
      super();
      this.onToggle = (e) => {
        e.preventDefault();
        this.props.onToggle(this.props.style);
      };
    }

    render() {
      return (
        <span className={this.props.active ? classes.editorActiveButton : null}
              onMouseDown={this.onToggle}>
          {this.props.label}
        </span>
      )
    }
  }

  const BLOCK_TYPES = [
    {label: formatMessage({ id: "partnerLocation_editorButton_H1" }), style: 'header-one'},
    {label: formatMessage({ id: "partnerLocation_editorButton_H2" }), style: 'header-two'},
    {label: formatMessage({ id: "partnerLocation_editorButton_H3" }), style: 'header-three'},
    {label: formatMessage({ id: "partnerLocation_editorButton_UL" }), style: 'unordered-list-item'},
    {label: formatMessage({ id: "partnerLocation_editorButton_OL" }), style: 'ordered-list-item'},
  ];

  const INLINE_STYLES = [
    {label: formatMessage({ id: "partnerLocation_editorButton_Bold" }), style: 'BOLD'},
    {label: formatMessage({ id: "partnerLocation_editorButton_Italic" }), style: 'ITALIC'},
    {label: formatMessage({ id: "partnerLocation_editorButton_Underline" }), style: 'UNDERLINE'},
  ];

  const BlockStyleControls = (props) => {
    const selection = editorState.getSelection()
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType()

    return (
      <span className={classes.editorControls}>
        {BLOCK_TYPES.map((t) =>
          <StyleButton
            key={t.label}
            active={t.style === blockType}
            label={t.label}
            onToggle={props.onToggle}
            style={t.style}
          />
        )}
      </span>
    )
  }

  const InlineStyleControls = (props) => {
    var currentStyle = editorState.getCurrentInlineStyle()
    return (
      <span className={classes.editorControls}>
        {INLINE_STYLES.map(t =>
          <StyleButton
            key={t.label}
            active={currentStyle.has(t.style)}
            label={t.label}
            onToggle={props.onToggle}
            style={t.style}
          />
        )}
      </span>
    )
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
        style={{ alignItems: 'normal', paddingTop: '15px' }}
        control={
          <div className={classes.editorRoot}>
            <div className={classes.editorHead}>
              <BlockStyleControls onToggle={ (t) => {
                setEditorState(RichUtils.toggleBlockType(editorState, t))
              }} />
              <InlineStyleControls onToggle={ (t) => {
                setEditorState(RichUtils.toggleInlineStyle(editorState, t))
              }} />
            </div>
            <div onClick={() => editor.current.focus()} className={classes.editorText}>
              <Editor
                ref={editor}
                editorState={editorState}
                onChange={editorState => setEditorState(editorState)}
                handleKeyCommand={cmd => {
                  const newState = RichUtils.handleKeyCommand(editorState, cmd);
                  if (newState) {
                    setEditorState(newState);
                    return true;
                  }
                  return false;
                }}
              />
            </div>
          </div>}
        labelPlacement="top"
        label={formatMessage({ id: "partnerLocation_Description" })}
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
