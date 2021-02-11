import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import DeleteConfirmationModal from '../../uiComponent/DeleteConfirmationModal';
import RadioLabel from '../../uiComponent/RadioLabel';

const useRadioStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  label: {
    marginLeft: theme.spacing(3),
  },
}));

function DeleteProjectConfirmationModal({
  closeDeleteModal,
  isDeleteModalOpen,
  handleDelete,
  shouldDeleteDatasources,
  handleRadioButtonChange,
}) {
  const radioClasses = useRadioStyle();
  return (
    <DeleteConfirmationModal
      handleClose={closeDeleteModal}
      open={isDeleteModalOpen}
      title="Delete Project"
      deleteAction={{
        onDelete: handleDelete,
        name: 'Delete Project',
        dataTestId: 'delete-project-confirmation-button',
      }}
    >
      <Box pb={4}>
        <Box pb={4}>
          <Typography variant="body1">
            You want to delete this project and all it’s configurations? This action can’t be
            undone.
          </Typography>
        </Box>
        <Typography variant="body1">
          However, you can decide what you want to do with the dataset that is linked to this
          project alone.
        </Typography>
      </Box>

      <FormControl component="fieldset">
        <RadioGroup value={shouldDeleteDatasources} onChange={handleRadioButtonChange}>
          <Box mb={3}>
            <FormControlLabel
              value="Yes"
              control={<Radio />}
              classes={radioClasses}
              data-testid="yes-radio-button"
              label={(
                <RadioLabel
                  header="Yes, delete all the dataset associated with this Project"
                  description="Any dataset that is not linked to another project
                    or dashboard will be permanently deleted from the dataset library."
                />
              )}
            />
          </Box>
          <FormControlLabel
            value="No"
            control={<Radio />}
            classes={radioClasses}
            data-testid="no-radio-button"
            label={(
              <RadioLabel
                header="No, keep the dataset in the dataset library"
                description="The dataset will be unlinked from the dashboards and the project and
                    will be available in the dataset library."
              />
            )}
          />
        </RadioGroup>
      </FormControl>
      <Box />
    </DeleteConfirmationModal>
  );
}

DeleteProjectConfirmationModal.propTypes = {
  closeDeleteModal: PropTypes.func.isRequired,
  isDeleteModalOpen: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
  shouldDeleteDatasources: PropTypes.string.isRequired,
  handleRadioButtonChange: PropTypes.func.isRequired,
};

export default DeleteProjectConfirmationModal;
