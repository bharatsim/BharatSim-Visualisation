import withStyles from '@material-ui/core/styles/withStyles';
import MuiIconButton from '@material-ui/core/IconButton';

const IconButton = withStyles((theme) => ({
  root: {
    height: theme.spacing(5),
    width: theme.spacing(5),
    color: theme.palette.grey['800'],
  },
}))(MuiIconButton);

export default IconButton;
