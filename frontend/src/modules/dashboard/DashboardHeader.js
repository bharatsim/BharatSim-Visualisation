import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { fade, makeStyles, Typography } from '@material-ui/core';

import Alert from '@material-ui/lab/Alert';
import DashboardHeaderBar from '../../uiComponent/DashboardHeaderBar';
import ButtonGroup from '../../uiComponent/ButtonGroup';

import addChartIcon from '../../assets/images/addchart.svg';
import manageDataIcon from '../../assets/images/manageData.svg';

import { projectLayoutContext } from '../../contexts/projectLayoutContext';
import { formatDate } from '../../utils/dateUtils';
import { AUTOSAVE_ERROR_MESSAGE } from './constants';

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
    autoSaveError: {
      padding: theme.spacing(0, 4),
      alignItems: 'center',
      border: '1px solid',
      borderColor: theme.palette.warning.light,
    },
    autoSaveErrorMessage: {
      padding: theme.spacing(0, 0),
    },
    autoSaveStatus: {
      padding: theme.spacing(0, 4),
      'padding-top': theme.spacing(1),
    },
    RetryButton: {
      margin: theme.spacing(-2, -2),
      'text-decoration': 'underline',
      color: 'inherit',
      '&:hover': {
        background: 'inherit',
        'text-decoration': 'underline',
      },
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
    },
  };
});

function AutoSaveStatus({ saving, error, lastSaved, onRetry }) {
  const classes = useStyles();
  const errorMessage = (
    <Alert
      className={classes.autoSaveError}
      classes={{ message: classes.autoSaveErrorMessage }}
      color="warning"
      icon={false}
      action={
        <Button className={classes.RetryButton} onClick={onRetry}>
          Retry
        </Button>
      }
    >
      {AUTOSAVE_ERROR_MESSAGE}
    </Alert>
  );
  return (
    <Typography className={classes.autoSaveStatus} variant="caption" m={1}>
      {saving && 'Saving...'}
      {lastSaved && `Last Saved: ${formatDate(lastSaved.toString())}`}
      {error && errorMessage}
    </Typography>
  );
}

AutoSaveStatus.propTypes = {
  saving: PropTypes.bool,
  lastSaved: PropTypes.instanceOf(Date),
  error: PropTypes.bool,
  onRetry: PropTypes.func.isRequired,
};
AutoSaveStatus.defaultProps = {
  saving: false,
  lastSaved: null,
  error: false,
};

function DashboardHeader({ onAddChartClick, autoSaveConfig, dashboardName }) {
  const classes = useStyles();
  const history = useHistory();
  const { projectMetadata } = useContext(projectLayoutContext);

  function navigateToConfigureData() {
    history.push(`/projects/${projectMetadata.id}/configure-dataset`);
  }

  return (
    <DashboardHeaderBar>
      <Box className={classes.dashboardHeader}>
        <Box className={classes.headerLeft}>
          <Typography variant="h6">{dashboardName}</Typography>
          <AutoSaveStatus {...autoSaveConfig} />
        </Box>
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
        </ButtonGroup>
      </Box>
    </DashboardHeaderBar>
  );
}

DashboardHeader.propTypes = {
  onAddChartClick: PropTypes.func.isRequired,
  autoSaveConfig: PropTypes.shape(AutoSaveStatus.propTypes).isRequired,
  dashboardName: PropTypes.string.isRequired,
};

export default DashboardHeader;
