import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Typography } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { FieldArray } from 'react-final-form-arrays';
import { useForm } from 'react-final-form';

import PropTypes from 'prop-types';
import IconButton from '../../uiComponent/IconButton';
import ChoroplethMapLayerConfig from './ChoroplethMapLayerConfigs';
import plusIcon from '../../assets/images/plus.svg';
import { useFormContext } from '../../contexts/FormContext';

const useStyles = makeStyles((theme) => ({
  configContainer: {
    border: `1px solid ${theme.colors.primaryColorScale['500']}3D`,
    borderRadius: theme.spacing(1),
    marginLeft: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    '& + &': {
      marginTop: theme.spacing(2),
    },
  },
  configHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.colors.primaryColorScale['500']}3D`,
  },
  addLevelButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(4),
  },
}));

function ChoroplethMultiMapLayerConfig({ configKey, headers }) {
  const classes = useStyles();
  const { unRegisterDatasource } = useFormContext();

  const {
    mutators: { push, remove },
  } = useForm();

  function removeMapConfig(index) {
    remove(configKey, index);
    unRegisterDatasource(`${configKey}.[${index}].mapLayer`);
  }

  return (
    <>
      <FieldArray name={configKey}>
        {({ fields }) =>
          fields.map((name, index) => {
            const levelIndex = index + 1;
            return (
              <Box className={classes.configContainer} key={name}>
                <Box p={2} className={classes.configHeaderContainer}>
                  <Typography variant="subtitle2">
                    Drill Down - 
                    {' '}
                    {index === 0 ? 'Level 1 (Top Level)' : `Level ${levelIndex}`}
                  </Typography>
                  {fields.length > 1 && index === fields.length - 1 && (
                    <IconButton
                      onClick={() => removeMapConfig(index)}
                      size="small"
                      data-testid={`delete-level-${levelIndex}`}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
                <ChoroplethMapLayerConfig
                  configKey={name}
                  headers={headers}
                  shouldShowReferenceIdConfig={index !== 0}
                  levelIndex={index}
                />
              </Box>
            );
          })}
      </FieldArray>
      <Box className={classes.addLevelButtonContainer}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => {
            push(configKey);
          }}
          startIcon={<img src={plusIcon} alt="icon" />}
        >
          Add Level
        </Button>
      </Box>
    </>
  );
}

ChoroplethMultiMapLayerConfig.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
};

export default ChoroplethMultiMapLayerConfig;
