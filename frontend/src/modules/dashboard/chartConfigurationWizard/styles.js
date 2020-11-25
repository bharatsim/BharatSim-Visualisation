import { makeStyles } from '@material-ui/core/styles';

const useFooterStyles = makeStyles((theme) => ({
  footer: {
    position: 'fixed',
    bottom: theme.spacing(6),
    width: 'calc(45vw - 48px)',
  },
}));

export { useFooterStyles };
