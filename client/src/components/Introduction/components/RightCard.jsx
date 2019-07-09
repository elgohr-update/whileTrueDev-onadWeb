import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import Grow from '@material-ui/core/Grow';
import Typography from '../../Main/components/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  cardWrapper: {
    zIndex: 1,
  },
  card: {
    marginTop: theme.spacing(5),
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: theme.spacing(8, 3),
  },
  cardContent: {
    maxWidth: 400,
  },

  button: {
    marginTop: 25,
    width: '100%',
  },
  imagesWrapper: {
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: 400,
  },
}));


const RightCreator = (props) => {
  const {
    source, triggerThreshold, growCheck, growTime, slideTime,
  } = props;
  const classes = useStyles();

  // Value for image comming slide animation
  const [trigger, setTrigger] = React.useState(
    useScrollTrigger(
      { threshold: triggerThreshold, disableHysteresis: true },
    ),
  );

  React.useEffect(() => {
    function scrollTrigger() {
      if (window.scrollY > triggerThreshold) {
        setTrigger(true);
      } else {
        setTrigger(false);
      }
    }
    scrollTrigger();
  });

  return (
    <Grow
      in={growCheck}
      {...(growCheck ? { timeout: growTime } : { timeout: growTime })}
    >
      <Container className={classes.root} component="section">
        <Grid container>
          <Slide
            in={trigger}
            direction="right"
            {...(trigger ? { timeout: slideTime } : { timeout: slideTime })}
          >
            <Grid item xs={12} md={6} className={classes.imagesWrapper}>
              <Hidden smDown>
                <img
                  src={source.image}
                  alt="call to action"
                  className={classes.image}
                />
              </Hidden>
            </Grid>
          </Slide>
          <Grid item xs={12} md={6} className={classes.cardWrapper}>
            <div className={classes.card}>
              <div className={classes.cardContent}>
                <Typography variant="h4" marked="center" align="center" gutterBottom>
                  {source.head}
                </Typography>
                <Typography variant="body1" align="center">
                  {source.body}
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};


RightCreator.propTypes = {
  source: PropTypes.object, // text sources
  growCheck: PropTypes.bool.isRequired, // grow animation trigger
  growTime: PropTypes.number, // grow animation timeout time
  triggerThreshold: PropTypes.number, // slide animation trigger threshold
  slideTime: PropTypes.number, // slide animation timeout time
  linkTo: PropTypes.string, // button link prop
};

RightCreator.defaultProps = {
  source: '',
  triggerThreshold: 700,
  slideTime: 1000,
  growTime: 1000,
  linkTo: '/dashboard/main',
};


export default RightCreator;
