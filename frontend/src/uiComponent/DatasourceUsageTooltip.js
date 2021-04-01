import React from 'react';
import PropTypes from 'prop-types';
import { Box, Tooltip, Typography, withStyles } from '@material-ui/core';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 11,
    maxWidth: 500,
    border: `1px solid ${theme.colors.primaryColorScale['400']}`,
  },
  arrow: {
    color: theme.colors.primaryColorScale['400'],
  },
}))(Tooltip);

function DatasourceUsageTooltip({ usage, dashboardUsage }) {
  const lastIndex = usage.length - 1;
  return (
    <LightTooltip
      arrow
      title={usage.map(({ project: { name: projectName, id }, dashboards }, index) => {
        return (
          <div key={id}>
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle2">Project:&nbsp;</Typography>
              <Typography variant="body2">{projectName}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle2">Dashboard:&nbsp;</Typography>
              <Typography variant="body2">{dashboards.join(', ')}</Typography>
            </Box>
            {index !== lastIndex && <br />}
          </div>
        );
      })}
    >
      <span>{dashboardUsage}</span>
    </LightTooltip>
  );
}

DatasourceUsageTooltip.propTypes = {
  usage: PropTypes.arrayOf(
    PropTypes.shape({
      project: PropTypes.shape({}),
      dashboards: PropTypes.arrayOf(PropTypes.string),
    }),
  ).isRequired,
  dashboardUsage: PropTypes.number.isRequired,
};

export default DatasourceUsageTooltip;
