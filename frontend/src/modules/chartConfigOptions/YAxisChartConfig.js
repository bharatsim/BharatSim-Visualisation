import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, fade, makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import plusIcon from '../../assets/images/plus.svg';
import deleteIcon from '../../assets/images/delete.svg';
import Dropdown from '../../uiComponent/Dropdown';
import { convertObjectArrayToOptionStructure } from '../../utils/helper';

const useStyles = makeStyles((theme) => {
  return {
    fieldContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(2),
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
  };
});

function YAxisChartConfig({ headers, updateConfigState, configKey, error }) {
  const [selectedValues, setSelectedValues] = useState({ 'dropdown-y-0': '' });
  const [axisCount, setAxisCount] = useState(1);
  const classes = useStyles();

  function handleYChange(id, selectedValue) {
    setSelectedValues((prevState) => {
      const newState = { ...prevState, [id]: selectedValue };
      updateConfigState(configKey, Object.values(newState));
      return newState;
    });
  }

  function addAxisField() {
    setSelectedValues((prevState) => ({ ...prevState, [`dropdown-y-${axisCount}`]: '' }));
    setAxisCount((prevCount) => prevCount + 1);
  }
  function deleteAxisField(fieldId) {
    setSelectedValues((prevState) => {
      const newState = { ...prevState };
      delete newState[fieldId];
      updateConfigState(configKey, Object.values(newState));
      return newState;
    });
  }

  return (
    <>
      <Box mb={1} pl={2}>
        <Typography variant="subtitle2"> Y-axis</Typography>
      </Box>
      {Object.keys(selectedValues).map((key) => (
        <Box className={classes.fieldContainer} key={key}>
          <Dropdown
            options={convertObjectArrayToOptionStructure(headers, 'name')}
            onChange={(selectedValue) => handleYChange(key, selectedValue)}
            id={key}
            label="select y axis"
            error={error}
            value={selectedValues[key] || ''}
          />
          <IconButton onClick={() => deleteAxisField(key)} data-testid={`delete-button-${key}`}>
            <img src={deleteIcon} alt="icon" />
          </IconButton>
        </Box>
      ))}
      <Box className={classes.addMetricButtonContainer}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={addAxisField}
          startIcon={<img src={plusIcon} alt="icon" />}
        >
          Add Metric
        </Button>
      </Box>
    </>
  );
}

YAxisChartConfig.defaultProps = {
  error: '',
};

YAxisChartConfig.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
  updateConfigState: PropTypes.func.isRequired,
  configKey: PropTypes.string.isRequired,
  error: PropTypes.string,
};

export default YAxisChartConfig;
