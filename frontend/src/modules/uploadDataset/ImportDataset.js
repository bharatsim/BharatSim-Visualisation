import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import fileImportIcon from '../../assets/images/importFileIcon.svg';
import { createSchema, getFileExtension, parseCsv, parseJson } from '../../utils/fileUploadUtils';
import ErrorBar from '../../uiComponent/ErrorBar';
import { validateFile } from '../../utils/validators';
import { VALID_FILE_EXTENSIONS } from '../../constants/fileUpload';

const useStyles = makeStyles((theme) => {
  return {
    importDataContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px dashed',
      borderRadius: theme.spacing(1),
      borderColor: theme.colors.primaryColorScale['200'],
    },
    textContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing(5),
    },
  };
});

function ImportDataset({ setFile, handleNext, setPreviewData, setErrorStep, setSchema }) {
  const classes = useStyles();
  const [error, setError] = useState();
  const previewLimit = 100;
  const fileParsers = { csv: readCsv, json: readJson, geojson: readJson, topojson: readJson };

  function onJsonParse(jsonData) {
    const { data, errors } = jsonData;
    if (errors.length > 0) {
      setError(
        'Failed to Import file due to parsing error. Please review the file and ensure that its a valid JSON Data.',
      );
      setErrorStep(0);
      return;
    }
    setPreviewData(data);
    setSchema({});
    handleNext();
  }

  function onCsvParse(csvData) {
    const { data } = csvData;
    const validationError = validateCSVFile(csvData);
    if (validationError) {
      setError(validationError);
      setErrorStep(0);
      return;
    }
    setPreviewData(data);
    const schema = createSchema(data[0]);
    setSchema(schema);
    handleNext();
  }

  function validateCSVFile(csvData) {
    const {
      errors,
      meta: { fields },
    } = csvData;
    if (errors.length > 0) {
      return 'Failed to Import file due to parsing error. Please review the file and ensure that its a valid CSV file.';
    }
    if (fields.includes('_id')) {
      return 'Failed to Import file due to wrong column name. Please change _id column name';
    }
    return '';
  }

  function readCsv(file) {
    parseCsv(file, previewLimit, onCsvParse);
  }

  function readJson(file) {
    parseJson(file, onJsonParse);
  }

  function parsefile(file) {
    fileParsers[getFileExtension(file)](file);
  }

  function handleFileImport(event) {
    setErrorStep(null);
    const selectedFile = event.target.files[0];
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setErrorStep(0);
      return;
    }
    parsefile(selectedFile);
    setFile(selectedFile);
  }

  return (
    <Box mb={8} mx={14}>
      <ErrorBar visible={!!error} message={error} />
      <Box py={8} mt={6} className={classes.importDataContainer}>
        <img src={fileImportIcon} alt="Import File" />
        <Box className={classes.textContainer}>
          <Typography>Drag your file here or </Typography>
          <Box ml={3}>
            <Button variant="outlined" component="label" size="small">
              Browse
              <input
                data-testid="file-input"
                type="file"
                accept={`.${VALID_FILE_EXTENSIONS.join(',.')}`}
                style={{ display: 'none' }}
                onChange={handleFileImport}
              />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

ImportDataset.propTypes = {
  setFile: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  setPreviewData: PropTypes.func.isRequired,
  setErrorStep: PropTypes.func.isRequired,
  setSchema: PropTypes.func.isRequired,
};

export default ImportDataset;
