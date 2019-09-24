import React, { useEffect, useReducer } from 'react';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import {
  Grid, Paper, Button, Slide, Collapse
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import LinearStepper from '../../components/NewCreates/LinearStepper';
import CreatePaper from './CreatePaper';
import ProrityPaper from './PriorityPaper';
import CreatorSelect from './CreatorSelect';
import CategorySelect from './CategorySelect';
import OptionPaper from './OptionPaper';

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});


const useStyles = makeStyles(_theme => ({
  paper: {
    maxWidth: '1200px',
    width: '1200px'
  },
  root: {
    width: '100%',
    height: 'auto',
    margin: '12px',
    marginTop: '0px',
    padding: theme.spacing(4),
    [_theme.breakpoints.down('sm')]: {
      margin: 0,
      padding: theme.spacing(1),
    },
  },
  button: {
    marginRight: theme.spacing(1),
  },
  end: {
    color: '#fff',
    marginRight: theme.spacing(1),
  }
}));

const steps = [{ label: '캠페인 기본정보 / 배너선택' }, { label: '광고 송출유형 선택' }, { label: '광고유형 선택' }];


// key ,value를 이용하여 state의 값에 접근
const step1Reducer = (state, action) => {
  switch (action.key) {
    case 'campaignName':
      return { ...state, campaignName: action.value };
    case 'bannerId':
      return { ...state, bannerId: action.value };
    default:
      return state;
  }
};

const step2Reducer = (state, action) => {
  switch (action.type) {
    case 'type1': {
      return { choose: 1, type: 1 };
    }
    case 'type2': {
      return { choose: 1, type: 2 };
    }
    case 'type3': {
      return { choose: 1, type: 3 };
    }
    case 'reset': {
      return { choose: 0, type: 0 };
    }
    default: {
      return state;
    }
  }
};

const step4Reducer = (state, action) => {
  switch (action.key) {
    case 'option1': {
      return { ...state, choose: 1, option: 1 };
    }
    case 'option2': {
      return { ...state, choose: 1, option: 2 };
    }
    case 'noBudget': {
      return { ...state, noBudget: !state.noBudget };
    }
    case 'budget': {
      return { ...state, budget: action.value };
    }
    case 'reset': {
      return {
        choose: 0, option: 0, noBudget: false, budget: ''
      };
    }
    default: {
      return state;
    }
  }
};

// 생성 버튼을 누를 때 axios 요청 후 props로 전달받음. (bannerList)
const CampaignCreateStepper = (props) => {
  const classes = useStyles();
  const { bannerList } = props;
  // 0번째 step에서 사용할 State.
  const [step1State, step1Dispatch] = useReducer(step1Reducer, { campaignName: '', bannerId: '' });

  // 1 번째 step에서 사용할 State.
  const [step2State, step2Dispatch] = useReducer(step2Reducer, { choose: 0, type: 0 });

  // 3 번째 step에서 사용할 State.(캠페인 카테고리)
  const [campaingCategory, setCategory] = React.useState([]);


  // 4번 쨰 step에서 사용할 State1
  const [step4State, step4Dispatch] = useReducer(step4Reducer, {
    choose: 0, option: 0, noBudget: false, budget: ''
  });

  const [submitCheck, handleSubmitCheck] = React.useState(false);

  const [stepComplete, setStepComplete] = React.useState(false);
  const [paperSwitch, setPaperSwitch] = React.useState(true);
  const [index, setIndex] = React.useState(0);
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    if (step1State.campaignName && step1State.bannerId) {
      setStepComplete(true);
    } else {
      setStepComplete(false);
    }
  }, [step1State.bannerId, step1State.campaignName, step1State.checkedBannerId]);
  // 둘중하나라도 변화가 발생할 때마다 호출된다.


  useEffect(() => {
    if (submitCheck) {
      console.log('제출가능');
      console.log(step4State);
    } else {
      console.log('제출불가');
    }
  }, [step4State, submitCheck]);

  const handleNext = (additional = false, go) => () => {
    setPaperSwitch(false);
    setStepComplete(false);
    if (!additional) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
    setTimeout(() => {
      if (go) {
        setIndex(go);
      } else {
        setIndex(preIndex => preIndex + 1);
      }
      setPaperSwitch(true);
    }, 500);
  };

  const handleBack = () => {
    setStepComplete(false);
    setPaperSwitch(false);
    // setCheckBannerId('');
    step1Dispatch({ key: 'bannerId', value: '' });
    if (index !== 2 && index !== 3) {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
    }
    setTimeout(() => {
      if (index === 2 || index === 3 || index === 4) {
        setIndex(1);
      } else {
        setIndex(preIndex => preIndex - 1);
      }
      setPaperSwitch(true);
    }, 500);
  };

  const setSteps = (_index) => {
    switch (_index) {
      case 0:
        return <CreatePaper campaignName={step1State.campaignName} bannerList={bannerList} dispatch={step1Dispatch} setStepComplete={setStepComplete} />;
      case 1:
        return <ProrityPaper handleNext={handleNext} state={step2State} dispatch={step2Dispatch} />;
      case 2:
        return <CreatorSelect setStepComplete={setStepComplete} />;
      case 3:
        return <CategorySelect setStepComplete={setStepComplete} setCategory={setCategory} />;
      case 4:
        return <OptionPaper setStepComplete={setStepComplete} handleSubmitCheck={handleSubmitCheck} state={step4State} dispatch={step4Dispatch} />;
      default:
        return <div />;
    }
  };

  return (
    <Paper className={classes.paper}>
      <Grid container direction="column" className={classes.root}>
        <Grid item>
          <LinearStepper activeStep={activeStep} steps={steps} />
        </Grid>
        <Slide direction="right" in={paperSwitch} mountOnEnter unmountOnExit timeout={{ exit: 500 }}>
          <Grid item>
            {setSteps(index)}
          </Grid>
        </Slide>
        <Grid item>
          <Grid container direction="row">
            <Grid item>
              <Button disabled={index === 0} onClick={handleBack} className={classes.button}>
              뒤로
              </Button>
            </Grid>

            {index === 4
              ? (
                <Grid item>
                  <ThemeProvider theme={theme}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext()}
                      className={classes.end}
                    >
                    완료
                    </Button>
                  </ThemeProvider>
                </Grid>
              )
              : (
                <Collapse in={stepComplete}>
                  <Grid item>
                    <ThemeProvider theme={theme}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext()}
                        className={classes.end}
                      >
                      다음
                      </Button>
                    </ThemeProvider>
                  </Grid>
                </Collapse>
              )
            }

          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};


export default CampaignCreateStepper;
