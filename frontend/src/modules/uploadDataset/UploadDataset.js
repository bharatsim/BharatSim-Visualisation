import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import {
  Box,
  Button,
  fade,
  makeStyles,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core';

import ProjectHeader from '../../uiComponent/ProjectHeader';
import ButtonGroup from '../../uiComponent/ButtonGroup';

import ConfigureDatatype from './ConfigureDatatype';
import ImportDataset from './ImportDataset';
import { projectLayoutContext } from '../../contexts/projectLayoutContext';
import { api } from '../../utils/api';
import { errors } from '../../constants/loaderAndErrorMessages';
import { overlayLoaderOrErrorContext } from '../../contexts/overlayLoaderOrErrorContext';

const useStyles = makeStyles((theme) => {
  return {
    uploadHeader: {
      width: '100%',
      height: theme.spacing(12),
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: fade(theme.colors.grayScale['100'], 0.5),
      alignItems: 'center',
      padding: theme.spacing(3, 8),
    },
    contentWrapper: {
      backgroundColor: '#FFFFFF',
      border: '1px solid',
      borderColor: `${theme.colors.primaryColorScale['500']}3d`,
      borderRadius: theme.spacing(1),
      margin: theme.spacing(8),
      padding: theme.spacing(8, 10),
    },
  };
});

function getStepContent(
  stepIndex,
  setFile,
  setSchema,
  file,
  schema,
  handleNext,
  setPreviewData,
  setErrorStep,
  previewData,
) {
  if (stepIndex === 0) {
    return (
      <ImportDataset
        setFile={setFile}
        handleNext={handleNext}
        setPreviewData={setPreviewData}
        setErrorStep={setErrorStep}
        setSchema={setSchema}
      />
    );
  }

  if (stepIndex === 1) {
    return (
      <ConfigureDatatype
        schema={schema}
        selectedFile={file}
        handleNext={handleNext}
        previewData={previewData}
      />
    );
  }

  return (
    <ConfigureDatatype
      schema={schema}
      selectedFile={file}
      handleNext={handleNext}
      previewData={previewData}
    />
  );
}

function UploadDataset() {
  const classes = useStyles();
  const history = useHistory();
  const steps = ['Import Data', 'Configure Datatype', 'Upload to Dashboard'];

  const {
    selectedDashboardMetadata: { _id: selectedDashboardId, name: selectedDashboardName },
  } = useContext(projectLayoutContext);

  const { showError } = useContext(overlayLoaderOrErrorContext);
  const [previewData, setPreviewData] = useState();
  const [activeStep, setActiveStep] = useState(0);
  const [errorStep, setErrorStep] = useState(undefined);
  const [file, setFile] = useState();
  const [schema, setSchema] = useState();

  const { enqueueSnackbar } = useSnackbar();

  function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  function resetAllState() {
    setPreviewData();
    setActiveStep(0);
    setErrorStep(undefined);
    setFile();
    setSchema();
  }

  async function onClickUploadAndSave() {
    handleNext();
    await api
      .uploadFileAndSchema({ file, schema, dashboardId: selectedDashboardId })
      .then(() => {
        history.push(`configure-dataset`);
        enqueueSnackbar(`uploaded ${file.name} to dashboard ${selectedDashboardName}`, {
          variant: 'success',
        });
      })
      .catch((error) => {
        const errorConfigs = errors[error.errorCode](file.name, resetAllState);
        showError(errorConfigs);
      });
  }

  function onCancel() {
    history.push(`configure-dataset`);
  }

  return (
    <Box>
      <ProjectHeader />
      <Box className={classes.uploadHeader}>
        <Typography variant="h6"> Configure Dashboard Data :: Upload Dataset</Typography>
        <ButtonGroup>
          <Button variant="text" onClick={onCancel} size="small">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={activeStep !== 1}
            onClick={onClickUploadAndSave}
          >
            Upload
          </Button>
        </ButtonGroup>
      </Box>
      <Box className={classes.contentWrapper}>
        <Box px={8} pb={4}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel error={errorStep === index}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box>
          {getStepContent(
            activeStep,
            setFile,
            setSchema,
            file,
            schema,
            handleNext,
            setPreviewData,
            setErrorStep,
            previewData,
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default UploadDataset;
