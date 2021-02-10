import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
    marginLeft: theme.spacing(1.5),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  Selected: {
    marginRight: theme.spacing(2),
    width: 175,
    '&:hover': {
      cursor: 'pointer'
    },
    borderBottom: '1px solid black'
  },
  notSelected: {
    marginRight: theme.spacing(2),
    width: 175,
    '&:hover': {
      cursor: 'pointer'
    },
  },
}));

export default useStyles;
