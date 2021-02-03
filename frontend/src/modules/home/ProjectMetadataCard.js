import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DeleteOutline, MoreVert } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import DropdownMenu from '../../uiComponent/DropdownMenu/DropdownMenu';
import DeleteProjectConfirmationModal from './DeleteProjectConfirmationModal';
import useModal from '../../hook/useModal';
import { api } from '../../utils/api';
import { errors, errorTypes } from '../../constants/loaderAndErrorMessages';
import { overlayLoaderOrErrorContext } from '../../contexts/overlayLoaderOrErrorContext';
import snackbarVariant from '../../constants/snackbarVariant';
import IconButton from '../../uiComponent/IconButton';

const styles = makeStyles((theme) => ({
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContainer: {
    padding: theme.spacing(4, 2, 4, 6),
    height: theme.spacing(32),
    textTransform: 'capitalize',
    boxShadow:
      '0px 1px 5px rgba(0, 0, 0, 0.2), 0px 3px 4px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.14)',
    borderRadius: theme.spacing(1),
    '&:hover': {
      boxShadow:
        '0px 3px 5px rgba(0, 0, 0, 0.2), 0px 1px 18px rgba(0, 0, 0, 0.12), 0px 6px 10px rgba(0, 0, 0, 0.14)',
      cursor: 'pointer',
    },
  },
}));

function ProjectMetadataCard({ project, onProjectClick, deleteProject }) {
  const { name: projectName, _id: projectId } = project;
  const { enqueueSnackbar } = useSnackbar();
  const classes = styles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { showError } = useContext(overlayLoaderOrErrorContext);
  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const [shouldDeleteDatasources, setShouldDeleteDatasources] = useState('Yes');

  const openMenu = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  function onOpenDeleteModal(event) {
    event.stopPropagation();
    setShouldDeleteDatasources('Yes');
    openDeleteModal();
    closeMenu();
  }

  function handleRadioButtonChange(event) {
    setShouldDeleteDatasources(event.target.value);
  }

  function getUniqueDatasourceIds(allDatasourceIds) {
    return [...new Set(allDatasourceIds)];
  }

  async function deleteDatasourcesForProject(dataSources) {
    const datasourceIds = dataSources.map(({ _id: datasourceId }) => datasourceId);
    if (datasourceIds.length > 0) {
      api
        .deleteDatasource(getUniqueDatasourceIds(datasourceIds))
        .then(() => {
          enqueueSnackbar(`Datasource files for Project ${projectName} Deleted successfully`, {
            variant: snackbarVariant.SUCCESS,
          });
        })
        .catch(() => {
          showError(errors[errorTypes.PROJECT_DATASOURCE_DELETE_FAILED](projectName));
        });
    }
  }

  async function deleteProjectFromDb() {
    api
      .deleteProject(projectId)
      .then(() => {
        enqueueSnackbar(`Project ${projectName} deleted successfully`, {
          variant: snackbarVariant.SUCCESS,
        });
        deleteProject(projectId);
      })
      .catch(() => {
        showError(errors[errorTypes.PROJECT_DELETE_FAILED](projectName));
      });
  }

  async function handleDelete() {
    closeDeleteModal();
    if (shouldDeleteDatasources === 'Yes') {
      const { dataSources } = await api.getDatasourcesForProject(projectId);
      await deleteDatasourcesForProject(dataSources);
    }
    await deleteProjectFromDb();
  }

  return (
    <Box>
      <Box onClick={() => onProjectClick(projectId)} className={classes.cardContainer}>
        <Box className={classes.titleContainer}>
          <Typography variant="subtitle2">{projectName}</Typography>
          <IconButton data-testid="project-menu" disableRipple onClick={openMenu}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>
      <DropdownMenu
        anchorEl={anchorEl}
        closeMenu={closeMenu}
        menuItems={[
          {
            label: 'Delete Project',
            dataTestId: `delete-project-${projectId}`,
            onClick: onOpenDeleteModal,
            icon: <DeleteOutline />,
          },
        ]}
      />
      {isDeleteModalOpen && (
        <DeleteProjectConfirmationModal
          isDeleteModalOpen={isDeleteModalOpen}
          handleRadioButtonChange={handleRadioButtonChange}
          handleDelete={handleDelete}
          closeDeleteModal={closeDeleteModal}
          shouldDeleteDatasources={shouldDeleteDatasources}
        />
      )}
    </Box>
  );
}

ProjectMetadataCard.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  onProjectClick: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
};

export default ProjectMetadataCard;
