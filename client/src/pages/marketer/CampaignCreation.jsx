import React, { useReducer } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  Grid, Paper, Collapse, Button
} from '@material-ui/core';
import ProrityPaper from '../../organisms/marketer/CampaignCreate/PriorityPaper';
import OptionPaper from '../../organisms/marketer/CampaignCreate/OptionPaper';
import CampaignCreateTable from '../../organisms/marketer/CampaignCreate/CampaignCreateTable';
import HOST from '../../utils/config';
import axios from '../../utils/axios';
import history from '../../history';

const useStyles = makeStyles(_theme => ({
  root: {
    width: '100%',
    height: '100%',
    margin: '12px',
    marginTop: '0px',
    padding: _theme.spacing(4),
    [_theme.breakpoints.down('sm')]: {
      margin: 0,
      padding: _theme.spacing(1),
    },
  },
  button: {
    marginRight: _theme.spacing(1),
  },
  end: {
    color: '#fff',
    marginRight: _theme.spacing(1),
  }
}));

// key ,value를 이용하여 state의 값에 접근
const step1Reducer = (state, action) => {
  switch (action.key) {
    case 'option0':
      return { ...state, option: 'option0' };
    case 'option1':
      return { ...state, option: 'option1' };
    case 'option2':
      return { ...state, option: 'option2' };
    case 'reset':
      return { option: '' };
    default:
      return state;
  }
};

const step2Reducer = (state, action) => {
  switch (action.type) {
    case 'type0':
      return { priorityType: 'type0' };
    case 'type1':
      return { priorityType: 'type1' };
    case 'type2':
      return { priorityType: 'type2' };
    case 'reset':
      return { priorityType: '' };
    default:
      return state;
  }
};

// array State를 사용하는 Reducer
const step2InnerReducer = (state, action) => {
  switch (action.type) {
    case 'push':
      if (action.value instanceof Array) {
        // 기존 state와 중복되지 않은 value만 선택
        const values = action.value.filter(v => !state.includes(v));
        return [...state, ...values];
      }
      return [...state, action.value];
    case 'delete':
      return state.filter(item => item !== action.value);
    case 'reset':
      return [];
    default:
      return state;
  }
};

const step3Reducer = (state, action) => {
  switch (action.key) {
    case 'campaignName':
      return { ...state, campaignName: action.value };
    case 'bannerId':
      return { ...state, bannerId: action.value };
    case 'budget':
      return { ...state, budget: action.value };
    case 'startDate':
      return { ...state, startDate: action.value };
    case 'finDate':
      return { ...state, finDate: action.value };
    case 'keyword0':
      return { ...state, keyword0: action.value };
    case 'keyword1':
      return { ...state, keyword1: action.value };
    case 'keyword2':
      return { ...state, keyword2: action.value };
    case 'mainLandingUrlName':
      return { ...state, mainLandingUrlName: action.value };
    case 'sub1LandingUrlName':
      return { ...state, sub1LandingUrlName: action.value };
    case 'sub2LandingUrlName':
      return { ...state, sub2LandingUrlName: action.value };
    case 'mainLandingUrl':
      return { ...state, mainLandingUrl: action.value };
    case 'sub1LandingUrl':
      return { ...state, sub1LandingUrl: action.value };
    case 'sub2LandingUrl':
      return { ...state, sub2LandingUrl: action.value };
    case 'time':
      return { ...state, time: action.value };
    case 'budgetReset':
      return { ...state, budget: '' };
    case 'dateReset':
      return { ...state, finDate: '' };
    case 'reset': {
      return {
        campaignName: '',
        bannerId: '',
        budget: '',
        startDate: new Date(),
        finDate: '',
        mainLandingUrl: '',
        sub1LandingUrl: '',
        sub2LandingUrl: '',
        mainLandingUrlName: '',
        sub1LandingUrlName: '',
        sub2LandingUrlName: '',
        time: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      };
    }
    default:
      return state;
  }
};

// 생성 버튼을 누를 때 axios 요청 후 props로 전달받음. (bannerList)
const CampaignCreateStepper = () => {
  const classes = useStyles();
  // 0번째 step에서 사용할 State.
  const [step1State, step1Dispatch] = useReducer(step1Reducer, { option: 'option1' });

  // 1 번째 step에서 사용할 State.
  const [step2State, step2Dispatch] = useReducer(step2Reducer, { priorityType: 'option2' });

  // 2 번째 prioritystep에서 사용할 State.
  const [checkedCreators, checkedCreatorsDispatch] = useReducer(step2InnerReducer, []);
  const [checkedGames, checkedGamesDispatch] = useReducer(step2InnerReducer, []);

  // 3 번째 캠페인 기본정보에서 사용할 State
  const [step3State, step3Dispatch] = useReducer(step3Reducer, {
    campaignName: '',
    bannerId: '',
    budget: '',
    startDate: new Date(),
    finDate: '',
    keyword0: '',
    keyword1: '',
    keyword2: '',
    mainLandingUrlName: '',
    sub1LandingUrlName: '',
    sub2LandingUrlName: '',
    mainLandingUrl: '',
    sub1LandingUrl: '',
    sub2LandingUrl: '',
    time: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  });
  // 최종 step에서 handleSubmit을 하기위한 signal
  const [step2PaperOpen, setStep2PaperOpen] = React.useState(false); // step2를 열거나 닫는 state
  const [step3PaperOpen, setStep3PaperOpen] = React.useState(false); // step3를 열거나 닫는 state
  const [stepComplete, setStepComplete] = React.useState(true); // 현재 step에서 다음 step으로 넘어가기위한 state
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [dateOpen, setDateOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [checkName, setCheckName] = React.useState(false);
  const [budgetError, setBudgetError] = React.useState(false);
  const times = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const defaultList = times.map(() => true);
  const [checkList, setCheckList] = React.useState(defaultList);

  const checkEmpty = (input) => {
    if (input.option.length === 0) {
      alert('광고 유형이 입력되지 않았습니다.');
      return false;
    }
    if (input.type.length === 0) {
      alert('우선형 유형이 입력되지 않았습니다.');
      return false;
    }
    if (checkName === false) {
      alert('캠페인 이름이 입력되지 않았습니다.');
      return false;
    }
    if (input.bannerId.length === 0) {
      alert('배너가 선택되지 않았습니다.');
      return false;
    }
    if (input.option !== 'type0' && (input.mainLandingUrl.replace(/ /gi, '').length === 0)) {
      alert('랜딩페이지 URL이 입력되지 않았습니다.');
      return false;
    }
    if (budgetError) {
      alert('일예산이 입력되지 않았습니다.');
      return false;
    }
    return true;
  };
  const getIndexArray = array => (array.reduce((acc, ele, index) => {
    if (ele) { acc.push(index); }
    return acc;
  }, []));

  const handleSubmit = (event) => {
    event.preventDefault();

    function typeToNum(type) {
      const NUM = type.replace(/[^0-9]/g, '');
      return NUM;
    }
    const priorityNum = typeToNum(step2State.priorityType);
    const optionNumType = typeToNum(step1State.option);

    const priorityList = ((priorityType) => {
      switch (priorityType) {
        case 'type0':
          return checkedCreators; // 선택된 크리에이터
        case 'type1':
          return checkedGames; // 선택된 게임
        case 'type2':
        default:
          return ['무관']; // 카테고리 무관인 카테고리 ID
      }
    })(step2State.priorityType);

    const validateObject = {
      option: step1State.option,
      type: priorityNum,
      ...step3State,
      priority: priorityList,

    };
    getIndexArray(checkList);
    if (checkEmpty(validateObject)) {
      axios.post(`${HOST}/api/dashboard/marketer/campaign/push`, {
        optionType: optionNumType,
        priorityType: priorityNum,
        ...step3State,
        priorityList,
        selectedTime: getIndexArray(checkList)
      })
        .then((res) => {
          alert(res.data[1]);
          history.push('/dashboard/marketer/main');
        });
    }
  };

  const handleDatePickerOpen = () => {
    step3Dispatch({ key: 'dateReset' });
    setDatePickerOpen(!datePickerOpen);
  };

  const handleNext = _step => (event) => {
    event.preventDefault();
    switch (_step) {
      case 0: {
        setStep2PaperOpen(true);
        setStep(1); // step 넘기기
        setStepComplete(false); // '다음' 버튼 없애기 (올바른 입력 전까지)
        return false;
      }
      case 1: {
        setStep3PaperOpen(true);
        setStep(2); // step 넘기기
        setStepComplete(false); // '완료' 버튼 없애기 (올바른 입력 전까지)
        return false;
      }
      default: {
        return false;
      }
    }
  };

  const handleDetailOpen = () => {
    step3Dispatch({ key: 'budgetReset' });
    setDetailOpen(!detailOpen);
  };

  const handleDateOpen = () => {
    setDateOpen(!dateOpen);
  };

  // '뒤로' 버튼 핸들러
  const handleBack = (event) => {
    event.preventDefault();
    setStepComplete(true);
    switch (step) {
      case 0: {
        history.push('/dashboard/marketer/main');
        return false;
      }
      case 1: {
        setStep(step - 1);
        setStep2PaperOpen(false);
        return false;
      }
      case 2: {
        setStep(step - 1);
        setStep2PaperOpen(true);
        setStep3PaperOpen(false);
        return false;
      }
      default: return false;
    }
  };

  // '다음' 또는 '완료' 버튼 핸들러
  const nextButton = (_step) => {
    switch (_step) {
      case 2:
        return (
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className={classes.end}
            >
              완료
            </Button>
          </Grid>
        );
      case 0:
      case 1:
      default:
        return (
          <Collapse in={stepComplete}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext(_step)}
                className={classes.end}
              >
                다음
              </Button>
            </Grid>
          </Collapse>
        );
    }
  };

  const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));

  return (
    <Grid container direction="row" spacing={2} wrap="wrap">
      {isDesktop ? (
        <React.Fragment>
          <Grid item xs={12} lg={10} xl={8}>
            <Paper>
              <Grid container direction="column" className={classes.root}>
                <Grid item xs={12}>
                  <OptionPaper
                    setStepComplete={setStepComplete}
                    state={step1State}
                    dispatch={step1Dispatch}
                    step={step}
                  />
                  {step2PaperOpen && (
                  <ProrityPaper
                    state={step2State}
                    dispatch={step2Dispatch}
                    setStepComplete={setStepComplete}
                    checkedCreators={checkedCreators}
                    checkedCreatorsDispatch={checkedCreatorsDispatch}
                    checkedGames={checkedGames}
                    checkedGamesDispatch={checkedGamesDispatch}
                    step3PaperOpen={step3PaperOpen}
                  />
                  )}
                  {step3PaperOpen && (
                  <CampaignCreateTable
                    checkName={checkName}
                    setCheckName={setCheckName}
                    dispatch={step3Dispatch}
                    state={step3State}
                    setDetailOpen={setDetailOpen}
                    budgetError={budgetError}
                    setBudgetError={setBudgetError}
                    detailOpen={detailOpen}
                    step1State={step1State}
                    handleDetailOpen={handleDetailOpen}
                    dateOpen={dateOpen}
                    handleDateOpen={handleDateOpen}
                    handleDatePickerOpen={handleDatePickerOpen}
                    datePickerOpen={datePickerOpen}
                    checkState={checkList}
                    setCheckState={setCheckList}
                  />
                  )}
                </Grid>
                <Grid item>
                  <Grid container direction="row-reverse">
                    {nextButton(step)}
                    <Grid item>
                      <Button onClick={handleBack} className={classes.button}>
                        뒤로
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </React.Fragment>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          width: '100%'
        }}
        >
          <h4>캠페인 생성은 데스크탑에서 진행해주세요.</h4>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/dashboard/marketer/main"
          >
          대시보드로 이동
          </Button>
        </div>
      )}
    </Grid>
  );
};

export default CampaignCreateStepper;
