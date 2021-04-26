import React from 'react';
import PropTypes from 'prop-types';
import { Box, List as MuiList, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    border: `1px solid ${theme.colors.tableBorder}`,
    borderRadius: theme.spacing(1),
    background: theme.palette.background.paper,
    height: theme.spacing(32),
    paddingBottom: theme.spacing(1),
    maxWidth: theme.spacing(60),
    width: '100%',
  },
}));

const useListItemStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.caption,
    lineHeight: 1,
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: `${theme.colors.primaryColorScale['50']} !important`,
    },
  },
}));

const useListStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1, 0),
    height: '100%',
    overflow: 'auto',
  },
}));

// const Input = withStyles((theme) => ({
//   root: {
//     position: 'relative',
//     height: theme.spacing(7),
//     borderBottom: `1px solid ${theme.colors.grayScale['200']}`,
//     borderRadius: 0,
//     '&:hover $notchedOutline': {
//       border: 0,
//     },
//     '@media (hover: none)': {
//       '&:hover $notchedOutline': {
//         border: 0,
//       },
//     },
//     '&$focused $notchedOutline': {
//       border: 0,
//     },
//     ...theme.typography.body1,
//   },
//   notchedOutline: {
//     border: 0,
//   },
//   input: {
//     paddingTop: theme.spacing(1),
//     paddingBottom: theme.spacing(1),
//   },
//   adornedStart: {
//     paddingLeft: theme.spacing(1),
//   },
// }))(OutlinedInput);

function List({ listItem, onClick, listItemProps }) {
  const classes = useStyles();
  const listItemClasses = useListItemStyles();
  const listClasses = useListStyles();
  return (
    <Box className={classes.mainContainer}>
      <MuiList classes={listClasses}>
        {listItem.map((item, index) => {
          const key = `index-${index}`;
          return (
            <ListItem
              {...listItemProps}
              classes={listItemClasses}
              onClick={() => onClick(item)}
              key={key}
            >
              {item}
            </ListItem>
          );
        })}
      </MuiList>
    </Box>
  );
}

List.defaultProps = {
  listItemProps: {},
};

List.propTypes = {
  listItem: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
  listItemProps: PropTypes.shape({}),
};

export default List;
