import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { parse } from 'mathjs';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import MuiDialogContent from '@material-ui/core/DialogContent';
import ErrorButton from './ErrorButton';
import { DialogActions, DialogTitle } from './Modal';

const dialogStyles = makeStyles((theme) => ({
  paper: {
    width: theme.spacing(142),
  },
}));
const DialogContent = withStyles((theme) => ({
  root: {
    margin: theme.spacing(0, 4),
    padding: theme.spacing(0, 0, 4, 0),
  },
}))(MuiDialogContent);

function UpdateDataModal({ open, handleClose, title, updateAction }) {
  const dialogClasses = dialogStyles();
  const { onUpdate, name, dataTestId } = updateAction;

  const [expression, setExpression] = useState('');
  const [columnName, setColumnName] = useState('');
  const [parsedExpression, setParsedExpression] = useState('');

  function parseExpression(node) {
    const result = {};
    const functionName = `$${node.fn}`;
    result[functionName] = [];
    if (!node.args) {
      return {};
    }
    node.args.forEach((arg) => {
      if (arg.type === 'ConstantNode') {
        result[functionName].push(arg.value);
      }
      if (arg.type === 'SymbolNode') {
        result[functionName].push(`$${arg.name}`);
      }
      if (arg.type === 'FunctionNode') {
        result[functionName].push(parseExpression(arg));
      }
      if (arg.type === 'OperatorNode') {
        result[functionName].push(parseExpression(arg));
      }
      if (arg.type === 'ParenthesisNode') {
        result[functionName].push(parseExpression(arg.content));
      }
    });
    setParsedExpression(result);
    return result;
  }
  function AddColumn() {
    onUpdate(columnName, parsedExpression);
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      classes={dialogClasses}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Box px={2}>
          Expression
          <input onChange={(e) => setExpression(e.target.value)} value={expression} />
          Name
          <input onChange={(e) => setColumnName(e.target.value)} value={columnName} />
        </Box>
      </DialogContent>
      <DialogActions>
        <ErrorButton
          data-testid={dataTestId}
          autoFocus
          onClick={() => {
            parseExpression(parse(expression));
          }}
          variant="contained"
        >
          Parse
        </ErrorButton>
        <ErrorButton
          data-testid={dataTestId}
          autoFocus
          onClick={() => {
            AddColumn();
          }}
          variant="contained"
        >
          {name}
        </ErrorButton>
      </DialogActions>
    </Dialog>
  );
}

UpdateDataModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  updateAction: PropTypes.shape({
    name: PropTypes.string.isRequired,
    dataTestId: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }).isRequired,
};

export default UpdateDataModal;
