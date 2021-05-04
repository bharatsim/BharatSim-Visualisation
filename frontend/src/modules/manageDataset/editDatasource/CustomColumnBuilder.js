import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FormulaBuilder from '../../../uiComponent/formulaBuilder/FormulaBuilder';

const operators = ['+', '-', '*', '/', '%', '(', ')'];

const useStyles = makeStyles((theme) => ({
  input: {
    minWidth: theme.spacing(100),
  },
  helperText: {
    margin: theme.spacing(1, 0, 0, 0),
  },
  inputBox: {
    height: theme.spacing(19),
  },
}));

function validateColumnName(name, fields) {
  if (name === '') {
    return 'Column name is required.';
  }
  return fields.includes(name) ? 'Column Name should be unique.' : '';
}

function CustomColumnBuilder({
  fields,
  isEditMode,
  defaultExpression,
  defaultColumnName,
  onColumnCreate,
}) {
  const classes = useStyles();
  const [columnName, setColumnName] = useState(defaultColumnName);
  const [error, setError] = useState('');

  function handleColumnNameChange(event) {
    if (error) setError('');
    setColumnName(event.target.value);
  }

  function handleOnCreateColumn(expression) {
    const validationError = validateColumnName(columnName, fields);
    if (validationError && !isEditMode) {
      setError(validationError);
      return;
    }
    onColumnCreate({ expression, columnName });
  }

  return (
    <>
      <Box className={classes.inputBox}>
        <TextField
          label="Custom column name"
          variant="filled"
          helperText={error}
          error={!!error}
          value={columnName}
          inputProps={{ 'data-testid': 'custom-column' }}
          onChange={handleColumnNameChange}
          classes={{ root: classes.input }}
          FormHelperTextProps={{ classes: { root: classes.helperText } }}
          disabled={isEditMode}
        />
      </Box>
      <FormulaBuilder
        fields={fields}
        operators={operators}
        buttonLabel={isEditMode ? 'Apply changes' : 'Create column'}
        onClick={handleOnCreateColumn}
        defaultExpression={defaultExpression}
      />
    </>
  );
}

CustomColumnBuilder.defaultProps = {
  isEditMode: false,
  defaultExpression: '',
  defaultColumnName: '',
};

CustomColumnBuilder.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  isEditMode: PropTypes.bool,
  defaultExpression: PropTypes.string,
  defaultColumnName: PropTypes.string,
  onColumnCreate: PropTypes.func.isRequired,
};

export default CustomColumnBuilder;
