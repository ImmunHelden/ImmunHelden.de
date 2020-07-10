import React from "react"
import { useIntl } from "gatsby-plugin-intl"
import { makeStyles } from '@material-ui/core/styles';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';

const useStyles = makeStyles(() => ({
  frame: {
    border: '1px solid gray',
    background: '#eee',
  },
  head: {
    padding: '0 2px',
  },
  text: {
    fontFamily: 'monospace',
    padding: '15px',
    cursor: 'text',
    minHeight: '6em',
    background: '#fff',
    borderTop: '1px solid #ddd',
  },
  controlsPanel: {
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
  activeButton: {
    background: '#ddd',
    borderRadius: '5px',
  },
}))

export const RichTextEditor = ({ editorState, setEditorState }) => {
  const { formatMessage } = useIntl()
  const classes = useStyles()
  const editor = React.useRef(null)
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
        <span className={this.props.active ? classes.activeButton : null}
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
      <span className={classes.controlsPanel}>
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
      <span className={classes.controlsPanel}>
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
    <div className={classes.frame}>
      <div className={classes.head}>
        <BlockStyleControls onToggle={ (t) => {
          setEditorState(RichUtils.toggleBlockType(editorState, t))
        }} />
        <InlineStyleControls onToggle={ (t) => {
          setEditorState(RichUtils.toggleInlineStyle(editorState, t))
        }} />
      </div>
      <div onClick={() => editor.current.focus()} className={classes.text}>
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
    </div>
  )
}

export const makeSnapshot = (editorState) => {
  return stateToHTML(editorState.getCurrentContent())
}

export const initFromSnapshot = (html) => {
  if (html) {
    return EditorState.createWithContent(stateFromHTML(html))
  }
  return EditorState.createEmpty()
}
