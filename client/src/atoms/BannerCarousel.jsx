import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import ButtonBase from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import Check from '@material-ui/icons/Check';
import Success from './Typography/Success';


const tutorialSteps = [
  {
    bannerId: 'San Francisco – Oakland Bay Bridge, United States',
    bannerSrc:
      'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    bannerId: 'Bird',
    bannerSrc:
      'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    bannerId: 'Bali, Indonesia',
    bannerSrc:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80',
  },
  {
    bannerId: 'NeONBRAND Digital Marketing, Las Vegas, United States',
    bannerSrc:
      'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    bannerId: 'Goč, Serbia',
    bannerSrc:
      'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60',
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: '600px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    height: 'auto',
  },
  image: {
    position: 'relative',
    display: 'block',
    overflow: 'hidden',
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.35,
      },
      '& $imageMarked': {
        opacity: 0,
      },
      '& $imageTitle': {
        opacity: 1.0,
      },
    },
  },
  focusVisible: {},
  imageSrc: {
    position: 'relative',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    width: '100%',
    height: 'auto',
    maxHeight: 300
    // backgroundPosition: 'center 40%',
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.1,
    transition: theme.transitions.create('appear'),
  },
  imageTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
  },
}));

const BannerCarousel = (props) => {
  const { steps, handleBannerId, registStep } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [checkImage, setCheckImage] = useState({ step: 0, check: 0 });
  const maxSteps = steps.length;

  useEffect(() => {
    setCheckImage({ step: 0, check: 0 });
    setActiveStep(0);
  }, [registStep]);

  function handleNext() {
    setCheckImage({});
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  function handleBack() {
    setCheckImage(0);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  function handleStepChange(step) {
    setActiveStep(step);
  }

  // check가 안될
  const handleActiveStep = (step) => () => {
    // check가 되어있었던 상태였다면.
    if (checkImage.check) {
      setCheckImage({ step: -1, check: 0 });
      handleBannerId('');
    } else {
      setCheckImage({ step: activeStep, check: 1 });
      handleBannerId(step.bannerId);
    }
  };

  return (
    <div className={classes.root}>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {steps.map((step) => (
          <ButtonBase
            key={step.bannerId}
            className={classes.image}
            focusvisibleclassname={classes.focusVisible}
            onClick={handleActiveStep(step)}
          >
            <img className={classes.imageSrc} src={step.bannerSrc} alt={step.bannerId} />
            <span
              className={classes.imageBackdrop}
              style={checkImage.check ? { opacity: 0.5 } : {}}
            />
            <span className={classes.imageTitle} style={checkImage.check ? { opacity: 1 } : {}}>
              <Success>
                <Check fontSize="large" />
              </Success>
            </span>
          </ButtonBase>
        ))}
      </SwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="dots"
        activeStep={activeStep}
        nextButton={(
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
)}
        backButton={(
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Back
          </Button>
)}
      />
    </div>
  );
};


/**
 * @description
 해당 캠페인의 배너를 저장하기 위해 배너를 보여주고 체크하는 컴포넌트

 * @param {*} steps ? 배너 list가 저장된 array
 * @param {*} handleBannerId ? 배너를 등록하는 Dialog를 띄우는 state
 * @param {*} registStep ? 현재의 회원가입 진행상태, 다음 step으로 진행될 때, 선택된 옵션에 대한 렌더링을 위함.
 *
 * @author 박찬우
 */
BannerCarousel.propTypes = {
  steps: PropTypes.array,
  handleBannerId: PropTypes.func.isRequired,
  registStep: PropTypes.number.isRequired
};

// steps는 bannerId, bannerSrc 라는 col이 존재해야한다.
BannerCarousel.defaultProps = {
  steps: tutorialSteps,
};

export default BannerCarousel;