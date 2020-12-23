import { makeStyles } from '@material-ui/core/styles';

const useMenuStyles = makeStyles((theme) => {
  return {
    root: {
      padding: theme.spacing(1, 5),
      minWidth: '184px',
    },
    popoverPaper: {
      overflowX: 'unset',
      overflowY: 'unset',
    },
    menuPaper: {
      marginTop: theme.spacing(1),
      '&::before': {
        content: '""',
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(-2),
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: theme.spacing(0, 2, 2, 2),
        borderColor: 'transparent transparent white transparent',
      },
    },
    menuOption: {
      display: 'flex',
      alignItems: 'center',
    },
    listItemIcon:{
      "min-width": theme.spacing(10)
    }
  };
});

export default useMenuStyles;
