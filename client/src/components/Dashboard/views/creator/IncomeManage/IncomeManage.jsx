
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
// react plugin for creating charts
import { Line } from 'react-chartjs-2';
// @material-ui/icons
import AccessTime from '@material-ui/icons/AccessTime';
import DateRange from '@material-ui/icons/DateRange';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Check from '@material-ui/icons/Check';
import Money from '@material-ui/icons/Money';
import Warning from '@material-ui/icons/Warning';
import Payment from '@material-ui/icons/Payment';
import CircularProgress from '@material-ui/core/CircularProgress';

// core components
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
// custum cores

import GridItem from '../../../components/Grid/GridItem';
import GridContainer from '../../../components/Grid/GridContainer';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import CardIcon from '../../../components/Card/CardIcon';
import CardAvatar from '../../../components/Card/CardAvatar';
import Snackbar from '../../../components/Snackbar/Snackbar';
import Button from '../../../components/CustomButtons/Button';
import WarningTypo from '../../../components/Typography/Warning';
import SuccessTypo from '../../../components/Typography/Success';
import WithdrawlModal from './WithdrawModal';
import AccountDialog from './AccountDialog';

// data
import setChartjsData from '../../../variables/charts';
// styles
import DashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';

DashboardStyle.select = {
  marginTop: 5,
  // float: 'right',
};

DashboardStyle.buttonWrapper = {
  textAlign: 'center',
  marginTop: 35,
  marginBottom: 30,
};
// data Fetch hooks
function useFetchData(url, dateRange) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accountDialogOpen, setDialogOpen] = useState(false);

  // get data function
  const callUrl = useCallback(async () => {
    try {
      const res = await axios.get(url, {
        params: { dateRange },
      });
      if (res.data.length !== 0) {
        setDialogOpen(res.data.creatorAccountNumber === null);
        setPayload(res.data);
      } else {
        setDialogOpen(res.data.creatorAccountNumber === null);
        throw new Error('데이터가 존재하지 않습니다');
      }
    } catch {
      setError('데이터가 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [url, dateRange]);

  useEffect(() => {
    callUrl();
  }, [callUrl]);

  return {
 payload, loading, error, accountDialogOpen, setDialogOpen 
};
}

function useInputWidth() {
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return { inputLabel, labelWidth };
}

function useSelectValue() {
  const [value, setValue] = React.useState(7);

  function handleChange(event) {
    setValue(event.target.value);
  }
  return { value, handleChange };
}

function useWithdrawModal() {
  const [modalOpen, setModalOpen] = useState(false);

  function handleWithdrawModalOpen() {
    setModalOpen(true);
  }

  function handleWithdrawModalClose() {
    setModalOpen(false);
  }

  return { modalOpen, handleWithdrawModalOpen, handleWithdrawModalClose };
}

function useWithdrawalSnack() {
  const [withdrawalSnack, setWithdrawalSnack] = React.useState(false);

  function handleClose() {
    setWithdrawalSnack(false);
  }

  function handleSnackOpen() {
    setWithdrawalSnack(true);
  }

  return { withdrawalSnack, handleClose, handleSnackOpen };
}

function Income(props) {
  const { classes, session, history } = props;
  // 날짜 범위 데이터
  const { value, handleChange } = useSelectValue();
  // data 요청
  const {
 payload, loading, error, accountDialogOpen, setDialogOpen 
} = useFetchData('/dashboard/creator/chartdata', value);
  // 날짜 범위 칸의 크기를 동적으로 하기위한 훅
  const { inputLabel, labelWidth } = useInputWidth();
  // 수익금 데이터
  const incomeData = useFetchData('/dashboard/creator/income');
  // 수익금 출금 모달창
  const {
    modalOpen,
    handleWithdrawModalOpen,
    handleWithdrawModalClose,
  } = useWithdrawModal();
  // 출금신청 스낵바
  const { withdrawalSnack, handleClose, handleSnackOpen } = useWithdrawalSnack();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            {incomeData.loading && <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
            {!incomeData.loading && incomeData.error && <span>오류에요.. 침착하시고.. 다시 시도해보세요</span>}
            {!incomeData.loading && incomeData.payload
                && (
                  <CardHeader color="primary" stats icon>
                    <CardIcon color="primary">
                      <AttachMoney />
                    </CardIcon>
                    <p className={classes.cardCategory}>지금껏 총 수익금</p>
                    <h3 className={classes.cardTitle}>
                      {`${incomeData.payload.creatorTotalIncome} `}
                      <small>원</small>
                    </h3>
                  </CardHeader>
                )}
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                {!incomeData.loading && incomeData.payload
                && <span>{`Updated : ${incomeData.payload.date}`}</span>
                }
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            {incomeData.loading && <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
            {!incomeData.loading && incomeData.error && <span>오류에요.. 침착하시고.. 다시 시도해보세요</span>}
            {!incomeData.loading && incomeData.payload
                && (
                  <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                      <Check />
                    </CardIcon>
                    <p className={classes.cardCategory}>출금가능한 수익금</p>
                    <h3 className={classes.cardTitle}>
                      {`${incomeData.payload.creatorReceivable} `}
                      <small>원</small>
                    </h3>
                  </CardHeader>
                )}
            <CardFooter stats>
              <div className={classes.stats}>
                <Money />
                <SuccessTypo>출금 신청 버튼</SuccessTypo>
                {' 으로 출금신청하세요!'}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#avatar" onClick={e => e.preventDefault()}>
                <img src={session.creatorLogo} alt="creator" />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h5 className={classes.cardCategory}>크리에이터</h5>
              <h4 className={classes.cardTitle}>{session.creatorDisplayName}</h4>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8} style={{ position: 'relative', top: -70 }}>
          <Card chart>
            <CardHeader color="success">
              <FormControl variant="outlined" className={classes.select}>
                <InputLabel ref={inputLabel} htmlFor="selectDateRange">
                  범위
                </InputLabel>
                <Select
                  onChange={handleChange}
                  input={(
                    <OutlinedInput
                      labelWidth={labelWidth}
                      name="dateRange"
                      id="selectDateRange"
                      value={value}
                    />
                  )}
                >
                  <MenuItem value={7}>최근 7 일</MenuItem>
                  <MenuItem value={14}>최근 14 일</MenuItem>
                  <MenuItem value={30}>최근 30 일</MenuItem>
                </Select>
              </FormControl>
              {loading && <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
              {!loading && error && <span>오류에요.. 침착하시고.. 다시 시도해보세요</span>}
              {!loading && payload
                && (
                <Line
                  data={setChartjsData(payload.labels, payload.totalIncomeData)}
                  options={{ tooltips: { mode: 'index', intersect: false } }}
                />
                )}
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle} style={{ textAlign: 'left' }}>나의 총 수익금</h4>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime />
                {`updated: ${Date()}`}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                출금 신청하시겠어요?
              </h4>
              <p className={classes.cardCategoryWhite}>
                간단하게 진행해보세요!
              </p>
            </CardHeader>
            <CardBody>
              <div className={classes.buttonWrapper}>
                <Button
                  color="success"
                  round
                  onClick={handleWithdrawModalOpen}
                >
                  <Payment />
                  {'출금신청'}
                </Button>
              </div>
            </CardBody>
            <CardFooter stats>
              <Tooltip title="계정관리로 이동해요!">
                <div className={classes.stats}>
                  <WarningTypo><Warning /></WarningTypo>
                  <span className={classes.dangerText}>계좌정보를 정확히 입력하셨나요?</span>
                </div>
              </Tooltip>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer style={{ position: 'relative', top: -70 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>
                출금 신청 내역
              </h4>
              <p className={classes.cardCategoryWhite}>
                지금껏의 출금 신청 내역을 확인하세요.
              </p>
            </CardHeader>

          </Card>
        </GridItem>
      </GridContainer>

      {/* 출금 신청 팝업 */}
      {!incomeData.loading && incomeData.payload
      && (
      <WithdrawlModal
        open={modalOpen}
        handleOpen={handleWithdrawModalOpen}
        handleClose={handleWithdrawModalClose}
        accountNumber={incomeData.payload.creatorAccountNumber}
        receivable={incomeData.payload.creatorReceivable}
        handleSnackOpen={handleSnackOpen}
      />
      )}

      {/* 계좌 입력 안했을 시 링크 문구 notification창 */}
      {!incomeData.loading && incomeData.payload
      && (
      <Snackbar
        place="bl"
        color="danger"
        icon={Warning}
        message="아직 계좌정보를 입력하지 않았어요.. 계좌정보 입력 이후 출금신청하세요!"
        open={!incomeData.payload.creatorAccountNumber}
        Link={
          // 계좌정보 입력 팝업
          <Button color="warning" component={Link} to="/dashboard/user">계좌입력하기</Button>
        }
      />
      )}

      {/* 출금 신청 완료 시의 notification */}
      <Snackbar
        place="bc"
        color="success"
        message="출금신청이 완료되었어요!! 입금에는 1일 ~ 2일정도 걸려요."
        open={withdrawalSnack}
        close
        closeNotification={handleClose}
      />
      <AccountDialog open={accountDialogOpen} history={history} setDialogOpen={setDialogOpen} />
    </div>
  );
}

Income.propTypes = {
  classes: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withStyles(DashboardStyle)(Income);