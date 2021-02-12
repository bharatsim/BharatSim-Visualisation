import * as React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core';

const styles = (theme) => ({
  label: {
    color: theme.colors.primaryColorScale[500],
    zIndex: 1,
    ...theme.typography.subtitle2,
    lineHeight: 1.2,
    top: -18,
    position: 'absolute',
    height: 32,
    width: 'max-content',
    textTransform: 'capitalize',
  },
});

function ValueLabel(props) {
  const { children, classes, open, value } = props;
  return React.cloneElement(
    children,
    {
      className: clsx(
        children.props.className,
        {
          [classes.open]: open,
        },
        classes.thumb,
      ),
    },
    <span className={classes.label}>{value}</span>,
  );
}

export default withStyles(styles)(ValueLabel);
