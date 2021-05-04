import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, FormHelperText, Typography } from '@material-ui/core';
import { highlight, languages } from 'prismjs';
import Editor from 'react-simple-code-editor';
import 'prismjs/components/prism-javascript';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { parse } from 'mathjs';

import { useStyles } from './formulaBuilderStyles';
import List from '../List';
import './prismTheme.css';

const OperatorButton = withStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: theme.spacing(8),
    width: theme.spacing(8),
    boxShadow: 'unset',
    backgroundColor: theme.colors.grayScale[100],
    padding: 0,
    minWidth: 'unset',
    ...theme.typography.subtitle1,
  },
}))(Button);

const EDITOR_TEXTAREA = '.npm__react-simple-code-editor__textarea';

const typeOfCode = {
  OPERATOR: 'operator',
  FIELDS: 'fields',
};

function getCursorPosition(curCursorPos, stringToAdd) {
  return curCursorPos + stringToAdd.length;
}

function insertAtIndex(str, index, stringToAdd) {
  return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}

function setCursor(textArea, position) {
  setTimeout(() => {
    textArea.setSelectionRange(position, position);
  }, 1);
}

function parseError(error) {
  const errorType = error.name;
  let errorCharPosition = error.message.search(/\(char [0-9]*\)/g);
  errorCharPosition = errorCharPosition < 0 ? undefined : errorCharPosition;
  return `${errorType}: ${error.message.slice(0, errorCharPosition)}`;
}

function getFormattedCode(code, type) {
  return {
    [typeOfCode.FIELDS]: ` "${code}" `,
    [typeOfCode.OPERATOR]: ` ${code} `,
  }[type];
}

function FormulaBuilder({ fields, operators, buttonLabel, onClick, defaultExpression }) {
  const classes = useStyles();
  const [expression, setExpression] = useState(defaultExpression);
  const [error, setError] = useState('');

  const ref = useRef();
  useEffect(() => {
    ref.current = document.querySelector(EDITOR_TEXTAREA);
  }, []);

  function handleCalculateFormula() {
    try {
      if (!expression.trim()) {
        throw new Error('Expression can not be empty');
      }
      const parsedExpression = parse(expression);
      onClick(parsedExpression, expression);
    } catch (e) {
      setError(parseError(e));
    }
  }

  function handleChange(code) {
    if (error) setError('');
    setExpression(code);
  }

  function handleClick(code, type) {
    ref.current.focus();
    if (error) setError('');
    const cursorPos = ref.current.selectionStart;
    const codeToInsert = getFormattedCode(code, type);
    setExpression(insertAtIndex(expression, cursorPos, codeToInsert));
    const newCursorPosition = getCursorPosition(cursorPos, codeToInsert);
    setCursor(ref.current, newCursorPosition);
  }

  function digitAndOperatorOnly(evt) {
    const charCode = evt.which;
    const isNumber = charCode >= 48 && charCode <= 57;
    const isOperator = operators.includes(evt.key);
    const isSpace = charCode === 32;
    if (isOperator || isNumber || isSpace) {
      return;
    }
    evt.preventDefault();
  }

  return (
    <Box>
      <Box className={classes.mainContainer}>
        <Box className={clsx(classes.container, classes.containerEditor)}>
          <Typography variant="subtitle1">Formula</Typography>
          <Editor
            placeholder="Type your formula…"
            value={expression}
            onValueChange={handleChange}
            onKeyPress={digitAndOperatorOnly}
            highlight={(code) => highlight(code, languages.js)}
            padding={10}
            className={classes.editor}
            data-testid="textarea"
          />
          <Box className={classes.errorContainer}>
            {!!error && (
              <FormHelperText error classes={{ root: classes.helperText }}>
                {error}
              </FormHelperText>
            )}
          </Box>
        </Box>
        <Box className={clsx(classes.container, classes.containerFunctions)}>
          <Typography variant="subtitle1">Fields</Typography>
          <List listItem={fields} onClick={(field) => handleClick(field, typeOfCode.FIELDS)} />
        </Box>
      </Box>
      <Box className={classes.actionContainer}>
        <Box className={classes.operatorContainer}>
          {operators.map((operator) => (
            <OperatorButton
              onClick={() => handleClick(operator, typeOfCode.OPERATOR)}
              key={operator}
            >
              {operator}
            </OperatorButton>
          ))}
        </Box>
        <Button size="small" variant="contained" color="primary" onClick={handleCalculateFormula}>
          {buttonLabel}
        </Button>
      </Box>
    </Box>
  );
}

FormulaBuilder.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  operators: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonLabel: PropTypes.string,
  defaultExpression: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

FormulaBuilder.defaultProps = {
  buttonLabel: 'Calculate',
  defaultExpression: '',
};

export default FormulaBuilder;
