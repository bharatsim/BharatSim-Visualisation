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
    height: theme.spacing(60),
    width: '100%',
  },
  editor: {
    background: theme.palette.background.paper,
    padding: theme.spacing(0, 4),
  },
  toolbar: {
    background: theme.colors.primaryColorScale['50'],
    '& > * > .rdw-option-wrapper': {
      background: theme.colors.primaryColorScale['50'],
    },
    '& > * > .rdw-option-wrapper:hover': {
      boxShadow: `1px 1px 0px ${theme.colors.primaryColorScale['200']}`,
    },
    '& > * > .rdw-option-active:hover': {
      background: theme.colors.primaryColorScale['50'],
      boxShadow: `1px 1px 0px ${theme.colors.primaryColorScale['200']} inset`,
    },
    '& > * > .rdw-option-active': {
      background: theme.colors.primaryColorScale['100'],
      boxShadow: `1px 1px 0px ${theme.colors.primaryColorScale['200']} inset`,
    },
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

function Notes({ text, onBlur }) {
  const classes = useStyles();
  const [editorState, setEditorState] = useState(() => deserializeRichText(text));

  function handleChange(updatedEditorState) {
    setEditorState(updatedEditorState);
  }

  function handleBlur() {
    onBlur(serializeRichText(editorState));
  }

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={handleChange}
      wrapperClassName={classes.container}
      editorClassName={classes.editor}
      toolbarClassName={classes.toolbar}
      onBlur={handleBlur}
      placeholder="Click to add insights/notes"
      toolbar={{
        options: [
          'inline',
          'blockType',
          'fontSize',
          'fontFamily',
          'list',
          'textAlign',
          'colorPicker',
          'link',
          'history',
        ],
      }}
    />
  );
}

Notes.defaultProps = {
  text: '',
};

Notes.propTypes = {
  text: PropTypes.string,
  onBlur: PropTypes.func.isRequired,
};

export default Notes;
