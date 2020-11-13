import React from 'react';
import PropTypes from 'prop-types';

import { IconButton, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Close } from '@material-ui/icons';

function ChartConfigurationHeader({ closeModal, chart }) {
  return (
    <Box pl={2} display="flex" alignItems="center" justifyContent="space-between">
      <Typography variant="h6">Chart Configuration Wizard</Typography>
      {chart && (
        <Typography variant="body2" color="secondary">
          {chart}
        </Typography>
      )}
      <IconButton onClick={closeModal} data-testid="close-wizard">
        <Close />
      </IconButton>
    </Box>
  );
}

ChartConfigurationHeader.defaultProps = {
  chart: '',
};

ChartConfigurationHeader.propTypes = {
  closeModal: PropTypes.func.isRequired,
  chart: PropTypes.string,
};

export default ChartConfigurationHeader;
