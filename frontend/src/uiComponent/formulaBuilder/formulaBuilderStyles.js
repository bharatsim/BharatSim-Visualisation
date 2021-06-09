import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  container: {
    width: '100%',
    '& + &': {
      paddingLeft: theme.spacing(5),
    },
  },
  containerEditor: {
    flex: 0.8,
  },
  editor: {
    height: theme.spacing(32),
    backgroundColor: '#343a40',
    borderRadius: theme.spacing(1),
    color: 'white',
    '& > textarea': {
      outline: 'none',
    },
    fontFamily: "Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    fontSize: '1rem',
  },
  operatorContainer: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  containerFunctions: {
    flex: 0.2,
  },
  containerFields: {
    flex: 0.2,
  },
  errorContainer: {
    height: theme.spacing(5),
  },
  helperText: {
    marginLeft: 0,
    marginTop: 0,
  },
  actionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export { useStyles };
