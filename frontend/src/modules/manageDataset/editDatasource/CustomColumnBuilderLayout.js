import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Typography } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';
import NavTab from './NavTab';
import { useTabsStyles } from '../../layout/projectLayout/sideDashboardNavbar/sideDashboardNavbarCSS';
import CustomColumnBuilder from './CustomColumnBuilder';

const useStyles = makeStyles((theme) => ({
  layoutContainer: {
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.colors.tableBorder}`,
    background: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'row',
    height: theme.spacing(76),
  },
  navContainer: {
    flex: 0.2,
    padding: theme.spacing(2),
    overflowY: 'scroll',
  },
  formulaBuilderContainer: {
    flex: 0.8,
    padding: theme.spacing(2),
  },
  messageContainer: {
    display: 'flex',
    width: theme.spacing(100),
    margin: 'auto',
    textAlign: 'center',
    alignItems: 'center',
  },
}));

const HEIGHT_OF_TAB = 40;

function CustomColumnBuilderLayout({
  customColumns,
  fields,
  selectedTab,
  onColumnCreate,
  onDeleteColumn,
  onAddNewColumn,
  onTabChange,
}) {
  const classes = useStyles();
  const tabsClasses = useTabsStyles();

  const containerRef = React.useRef();

  function setScrollToBottom() {
    setTimeout(() => {
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight + HEIGHT_OF_TAB);
    }, 0);
  }

  function handleAddNewColumn() {
    onAddNewColumn();
    setScrollToBottom();
  }

  function handleDelete(event) {
    event.stopPropagation();
    onDeleteColumn(selectedTab);
  }

  return (
    <Box>
      <Box py={4}>
        <Button variant="contained" color="secondary" size="small" onClick={handleAddNewColumn}>
          Add column
        </Button>
      </Box>
      <Box className={classes.layoutContainer}>
        {customColumns && customColumns.length === 0 ? (
          <Box className={classes.messageContainer}>
            <Typography variant="subtitle2">
              You do not have any custom column, to add custom column click on Add column button.
            </Typography>
          </Box>
        ) : (
          <>
            <Box className={classes.navContainer} ref={containerRef}>
              <Tabs
                orientation="vertical"
                variant="fullWidth"
                classes={tabsClasses}
                value={selectedTab}
                onChange={onTabChange}
              >
                {customColumns.map(({ name }, index) => {
                  const key = `${name}-${index}`;
                  return (
                    <Tab
                      name={name}
                      onDelete={handleDelete}
                      component={NavTab}
                      dataTestId={name}
                      key={key}
                    />
                  );
                })}
              </Tabs>
            </Box>
            <Divider orientation="vertical" />
            <Box
              className={classes.formulaBuilderContainer}
              key={`${customColumns.length}-${selectedTab}`}
            >
              <CustomColumnBuilder
                fields={fields}
                defaultColumnName={customColumns[selectedTab]?.name}
                defaultExpression={customColumns[selectedTab]?.expression}
                isEditMode={customColumns[selectedTab]?.isEditMode}
                onColumnCreate={onColumnCreate}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

CustomColumnBuilderLayout.propTypes = {
  customColumns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      expression: PropTypes.string,
      isEditMode: PropTypes.bool,
    }),
  ).isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedTab: PropTypes.number.isRequired,
  onColumnCreate: PropTypes.func.isRequired,
  onDeleteColumn: PropTypes.func.isRequired,
  onAddNewColumn: PropTypes.func.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default CustomColumnBuilderLayout;
