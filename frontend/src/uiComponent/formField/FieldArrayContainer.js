import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, fade, Typography } from '@material-ui/core';
import { FieldArray } from 'react-final-form-arrays';
import IconButton from '../IconButton';
import deleteIcon from '../../assets/images/delete.svg';
import FieldContainer from './FieldContainer';
import plusIcon from '../../assets/images/plus.svg';

const useStyles = makeStyles((theme) => ({
  fieldContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 0),
    borderColor: fade(theme.colors.primaryColorScale['500'], 0.24),
    border: '1px solid',
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(4),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  addMetricButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(4),
  },
  fieldArrayContainer: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  fallbackText: {
    textAlign: 'center',
  },
}));

function FieldArrayContainer({
  title,
  field,
  configKey,
  onAddClick,
  addButtonTitle,
  shouldRender,
  fallbackMessage,
  onDelete,
}) {
  const classes = useStyles();
  return (
    <FieldContainer title={title}>
      <Box className={classes.fieldArrayContainer}>
        {shouldRender ? (
          <FieldArray name={configKey}>
            {({ fields }) =>
              fields.map((name, index) => (
                <Box className={classes.fieldContainer} key={name}>
                  {field(name, index)}
                  {fields.length > 1 && addButtonTitle && (
                    <IconButton
                      onClick={() => {
                        if (onDelete) {
                          onDelete(index);
                          return;
                        }
                        fields.remove(index);
                      }}
                      data-testid={`delete-button-${index}`}
                    >
                      <img src={deleteIcon} alt="delete-icon" />
                    </IconButton>
                  )}
                </Box>
              ))
            }
          </FieldArray>
        ) : (
          <Box className={classes.fallbackText}>
            <Typography variant="subtitle2">{fallbackMessage}</Typography>
          </Box>
        )}
        {addButtonTitle && (
          <Box className={classes.addMetricButtonContainer}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={onAddClick}
              startIcon={<img src={plusIcon} alt="icon" />}
            >
              {addButtonTitle}
            </Button>
          </Box>
        )}
      </Box>
    </FieldContainer>
  );
}

FieldArrayContainer.defaultProps = {
  title: '',
  addButtonTitle: '',
  shouldRender: true,
  fallbackMessage: '',
  onAddClick: null,
  onDelete: null,
};

FieldArrayContainer.propTypes = {
  title: PropTypes.string,
  addButtonTitle: PropTypes.string,
  configKey: PropTypes.string.isRequired,
  shouldRender: PropTypes.bool,
  fallbackMessage: PropTypes.string,
  field: PropTypes.func.isRequired,
  onAddClick: PropTypes.func,
  onDelete: PropTypes.func,
};

export default FieldArrayContainer;
