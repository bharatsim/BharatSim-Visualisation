import { makeStyles } from '@material-ui/core/styles';

const useTabStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    padding: theme.spacing(3, 0, 3, 7),
    height: theme.spacing(10),
    borderRadius: theme.spacing(1),
    minHeight: 'unset',
    minWidth: 'unset',
    boxSizing: 'border-box',
    cursor: 'pointer',
    ...theme.typography.subtitle2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconLabelWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  optionIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
  },
  selected: {
    background: theme.colors.primaryColorScale['500'],
  },
  textColorInherit: {
    border: 'none',
    color: theme.colors.textLight.primary,
    textTransform: 'capitalize',
    opacity: 'unset',
    '&$selected': {
      border: 'none',
      opacity: 'unset',
      color: theme.colors.textLight.primary,
    },
  },
}));

const useTabsStyles = makeStyles(() => ({
  indicator: {
    background: 'transparent',
  },
}));

export { useTabStyles, useTabsStyles };
