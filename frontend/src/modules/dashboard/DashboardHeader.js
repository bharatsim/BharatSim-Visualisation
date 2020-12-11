import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { fade, makeStyles, Typography } from '@material-ui/core';

import DashboardHeaderBar from '../../uiComponent/DashboardHeaderBar';
import ButtonGroup from '../../uiComponent/ButtonGroup';

import addChartIcon from '../../assets/images/addchart.svg';
import manageDataIcon from '../../assets/images/manageData.svg';

import { projectLayoutContext } from '../../contexts/projectLayoutContext';

const useStyles = makeStyles((theme) => {
  return {
    dashboardHeader: {
      width: '100%',
      display: 'flex',
      height: theme.spacing(12),
      justifyContent: 'space-between',
      backgroundColor: fade(theme.colors.grayScale['100'], 0.5),
      alignItems: 'center',
      padding: theme.spacing(3, 8),
    },
  };
});

function DashboardHeader({ onAddChartClick, onSaveClick, isSaveDisable, dashboardName }) {
  const classes = useStyles();
  const history = useHistory();
  const { projectMetadata } = useContext(projectLayoutContext);

  function navigateToConfigureData() {
    history.push(`/projects/${projectMetadata.id}/configure-dataset`);
  }

  return (
    <DashboardHeaderBar>
      <Box className={classes.dashboardHeader}>
        <Typography variant="h6">{dashboardName}</Typography>
        <ButtonGroup>
          <Button
            variant="text"
            startIcon={<img src={addChartIcon} alt="add-chart" />}
            size="small"
            onClick={onAddChartClick}
            data-testid="button-add-chart-header"
          >
            Add Chart
          </Button>
          <Button
            variant="text"
            startIcon={<img src={manageDataIcon} alt="add-chart" />}
            size="small"
            onClick={navigateToConfigureData}
            data-testid="button-manage-data"
          >
            Manage Data
          </Button>
          <Button variant="outlined" onClick={onSaveClick} size="small" disabled={isSaveDisable}>
            Save
          </Button>
        </ButtonGroup>
      </Box>
    </DashboardHeaderBar>
  );
}

DashboardHeader.propTypes = {
  onAddChartClick: PropTypes.func.isRequired,
  onSaveClick: PropTypes.func.isRequired,
  isSaveDisable: PropTypes.bool.isRequired,
  dashboardName: PropTypes.string.isRequired,
};

export default DashboardHeader;
