import React, { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Typography } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import PropTypes from 'prop-types';
import IconButton from '../../uiComponent/IconButton';
import ChoroplethMapLayerConfig from './ChoroplethMapLayerConfigs';
import plusIcon from '../../assets/images/plus.svg';

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

function ChoroplethMultiMapLayerConfig({ control, configKey, errors, isEditMode, headers, watch }) {
  const classes = useStyles();
  const { fields, append, remove } = useFieldArray({
    control,
    name: configKey,
  });

  useEffect(() => {
    if (isEditMode) return;
    append({});
  }, []);

  return (
    <>
      {fields.map((field, index) => {
        const levelIndex = index + 1;
        return (
          <Box className={classes.configContainer} key={field.id}>
            <Box p={2} className={classes.configHeaderContainer}>
              <Typography variant="subtitle2">
                Drill Down - 
                {' '}
                {index === 0 ? 'Level 1 (Top Level)' : `Level ${levelIndex}`}
              </Typography>
              {fields.length > 1 && index === fields.length - 1 && (
                <IconButton
                  onClick={() => remove(index)}
                  size="small"
                  data-testid={`delete-level-${levelIndex}`}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
            <ChoroplethMapLayerConfig
              control={control}
              isEditMode={isEditMode}
              errors={errors[index]}
              configKey={`${configKey}.[${index}]`}
              headers={headers}
              watch={watch}
              shouldShowReferenceIdConfig={index !== 0}
              levelIndex={index}
              defaultValues={field}
            />
          </Box>
        );
      })}
      <Box className={classes.addLevelButtonContainer}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => {
            append({ mapLayer: '', mapLayerId: '', dataLayerId: '', referenceId: '' });
          }}
          startIcon={<img src={plusIcon} alt="icon" />}
        >
          Add Level
        </Button>
      </Box>
    </>
  );
}

ChoroplethMultiMapLayerConfig.defaultProps = {
  errors: [],
  isEditMode: false,
};

ChoroplethMultiMapLayerConfig.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  configKey: PropTypes.string.isRequired,
  errors: PropTypes.arrayOf(PropTypes.shape({})),
  control: PropTypes.shape({}).isRequired,
  isEditMode: PropTypes.bool,
  watch: PropTypes.func.isRequired,
};

export default ChoroplethMultiMapLayerConfig;
