import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../theme/theme';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    height: '100%',
  },
  editor: {
    background: theme.palette.background.paper,
    padding: theme.spacing(0, 4),
  },
}));

function serializeRichText(editorState) {
  const contentState = editorState.getCurrentContent();
  return JSON.stringify(convertToRaw(contentState));
}

function deserializeRichText(editorState) {
  if (!editorState) {
    return EditorState.createEmpty();
  }
  const parsedState = convertFromRaw(JSON.parse(editorState));
  return EditorState.createWithContent(parsedState);
}

function Notes({ toolbar, closeToolbar, openToolBar, text, onBlur }) {
  const classes = useStyles();
  const [editorState, setEditorState] = useState(() => deserializeRichText(text));

  function handleChange(updatedEditorState) {
    setEditorState(updatedEditorState);
  }

  function handleBlur() {
    onBlur(serializeRichText(editorState));
    closeToolbar();
  }

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={handleChange}
      toolbarHidden={!toolbar}
      wrapperClassName={classes.container}
      editorClassName={classes.editor}
      onFocus={openToolBar}
      onBlur={handleBlur}
      placeholder="Click to add insights/notes"
    />
  );
}

Notes.defaultProps = {
  toolbar: false,
  text: '',
};

Notes.propTypes = {
  toolbar: PropTypes.bool,
  text: PropTypes.string,
  openToolBar: PropTypes.func.isRequired,
  closeToolbar: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default Notes;
