import {
  Button,
  CircularProgress,
  darken,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { Check, HowToReg, Lock, Visibility, VisibilityOff } from '@material-ui/icons';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Alert } from '@material-ui/lab';
import classnames from 'classnames';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HOST from '../../../config';
import history from '../../../history';
import { OnadTheme } from '../../../theme';
import axiosInstance from '../../../utils/axios';
import { useCreatorSignUpMutation } from '../../../utils/hooks/mutation/useCreatorSignUpMutation';
import { useCreatorSignupPreCreatorMutation } from '../../../utils/hooks/mutation/useCreatorSignupPreCreatorMutation';
import passwordRegex from '../../../utils/inputs/regex/password.regex';
import userIdRegex from '../../../utils/inputs/regex/userId.regex';
import IndentityVerificationDialog from './IdentityVerification';

const useStyles = makeStyles((theme: OnadTheme) => ({
  socialLoginButton: {
    borderRadius: '0px',
    width: '100%',
    height: 60,
    margin: `${theme.spacing(1)}px 0px`,
    boxShadow: theme.shadows[0],
  },
  twitch: {
    color: theme.palette.getContrastText(theme.palette.platform.twitch),
    backgroundColor: theme.palette.platform.twitch,
    '&:hover': {
      backgroundColor: darken(theme.palette.platform.twitch, 0.07),
    },
  },
  success: {
    cursor: 'default',
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: theme.palette.success.main,
      boxShadow: theme.shadows[0],
    },
  },
  successIcon: { color: theme.palette.success.main },
  socialLogo: {
    width: 35,
    height: 35,
    position: 'absolute',
    left: theme.spacing(2),
  },
  finished: {
    minWidth: 280,
    padding: theme.spacing(2),
  },
}));

export interface CreatorSignupInfo {
  userid: string;
  passwd: string;
  repasswd: string;
  pwdVisibility: boolean;
  repwdVisibility: boolean;
  referralCode: string;
}
export default function SignupCreator(): JSX.Element {
  const classes = useStyles();
  const location = useLocation();
  // 회원가입 정보
  const [signupInfo, setSignupInfo] = useState<CreatorSignupInfo>({
    userid: '',
    passwd: '',
    repasswd: '',
    pwdVisibility: false,
    repwdVisibility: false,
    referralCode: '',
  });

  // 에러 정보
  const defaultHelperText = '영문자로 시작하는 영문(소문자) 또는 숫자 6-15자';
  const [useridHelperText, setUseridHelperText] = useState(defaultHelperText);
  const [useridError, setUseridError] = useState<boolean>(false);
  const [pwdError, setPwdError] = useState<boolean>(false);
  const [repwdError, setRePwdError] = useState<boolean>(false);

  // input icon 색상
  const [useridIconColor, setUseridIconColor] = useState<'primary' | 'disabled'>('disabled');
  const [pwIconColor, setPwIconColor] = useState<'primary' | 'disabled'>('disabled');
  const [rePwIconColor, setRePwIconColor] = useState<'primary' | 'disabled'>('disabled');
  const [referralCodeColor, setReferralCodeColor] = useState<'primary' | 'disabled'>('disabled');

  // 단계 정보
  const [activeStep, setStep] = useState(0);
  function handleNext(target?: number): void {
    if (target) {
      setStep(target);
    }
    setStep(activeStep + 1);
  }

  function handleBack(): void {
    setStep(activeStep - 1);
  }

  // 스낵바
  const { enqueueSnackbar } = useSnackbar();

  // Parse search parpameter
  function parseParams(params: string) {
    const result: {
      accessToken?: string;
      creatorId?: string;
      creatorName?: string;
      error?: string;
    } = {};
    params
      .substr(1)
      .split('&')
      .map(splited => {
        const [key, value] = splited.split('=');
        return Object.assign(result, {
          [key]: decodeURI(value),
        });
      });
    return result;
  }

  // 본인인증 완료 이후 -> 회원가입 요청
  const signUpMutation = useCreatorSignUpMutation();
  function handleSignup(): void {
    signUpMutation
      .mutateAsync({
        userid: signupInfo.userid,
        passwd: signupInfo.passwd,
        referralCode: signupInfo.referralCode,
      })
      .then(() => {
        history.push(`/creator/signup/complete?userId=${signupInfo.userid}`);
      })
      .catch(() => {
        enqueueSnackbar('회원가입 과정에서 오류가 발생했습니다. 잠시후 다시 시도해주세요.', {
          variant: 'error',
        });
      });
  }

  /**
   * 기존 유저 새로운 로그인 방식으로 회원가입 및 기존 onad 계정과 연동 핸들러
   * */
  const preUserSignUpMutation = useCreatorSignupPreCreatorMutation();
  function handleSignupPreCreator(): void {
    preUserSignUpMutation
      .mutateAsync({
        userid: signupInfo.userid,
        passwd: signupInfo.passwd,
        creatorId: parseParams(location.search).creatorId,
        accessToken: parseParams(location.search).accessToken,
      })
      .then(() => {
        history.push(`/creator/signup/complete?userId=${signupInfo.userid}`);
      })
      .catch(() => {
        enqueueSnackbar('회원가입 과정에서 오류가 발생했습니다. 잠시후 다시 시도해주세요.', {
          variant: 'error',
        });
      });
  }

  // *************************************************************
  // 추천인 이름 정보
  // 2021. 03. 02 by hwasurr
  const [loadingCheckReferralCode, setLoadingCheckReferralCode] = useState(false);
  const [referredCreator, setReferredCreator] = useState('');
  const [referredCreatorError, setReferredCreatorError] = useState('');

  // 추천인 확인 함수
  function checkReferralCode(): void {
    const errorMsg =
      '입력하신 추천인 코드에 해당하는 방송인이 없습니다. 추천인 코드를 사용하지 않는 경우, 추천인 코드를 꼭 비워주세요.';
    setLoadingCheckReferralCode(true);
    axiosInstance
      .get(`${HOST}/creator/referral-code`, { params: { referralCode: signupInfo.referralCode } })
      .then(res => {
        setLoadingCheckReferralCode(false);
        if (res.data) {
          const { creatorName, afreecaName, loginId, calculateState } = res.data;
          if (calculateState === null) setReferredCreator(creatorName || afreecaName || loginId);
          else setReferredCreatorError('이미 다른 방송인에 의해 사용된 추천인 코드입니다.');
        } else {
          setReferredCreatorError(errorMsg);
        }
      })
      .catch(() => {
        setReferredCreatorError(errorMsg);
        setLoadingCheckReferralCode(false);
      });
  }
  // *************************************************************

  // 회원가입 정보 변경 핸들러
  const handleChange =
    (prop: keyof CreatorSignupInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setSignupInfo({ ...signupInfo, [prop]: event.target.value });
      setUseridHelperText(defaultHelperText);
      setUseridError(false);
      setPwdError(false);
      if (prop === 'referralCode') {
        setReferredCreator('');
        setReferredCreatorError('');
      }
    };

  // 비밀번호 보기 / 보지않기 버튼 핸들러
  const handleClickShowPassword = (): void => {
    setSignupInfo({ ...signupInfo, pwdVisibility: !signupInfo.pwdVisibility });
  };
  const handleClickShowRePassword = (): void => {
    setSignupInfo({ ...signupInfo, repwdVisibility: !signupInfo.repwdVisibility });
  };
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
  };

  // 아이디 에러 체크 ( 중복 체크 제외 )
  const useridErrorCheck = useCallback((): boolean => {
    if (!signupInfo.userid) {
      setUseridHelperText('아이디를 입력해주세요.');
      setUseridError(true);
      return false;
    }
    if (!userIdRegex.test(signupInfo.userid)) {
      setUseridHelperText(`${defaultHelperText}`);
      setUseridError(true);
      return false;
    }
    return true;
  }, [signupInfo.userid]);
  // 아이디 중복 체크
  const [duplicateCheckLoading, setLoading] = useState<boolean>(false);
  async function duplicateCheck(): Promise<boolean> {
    setLoading(true);
    const result = await axiosInstance
      .get<'duplicate' | 'allow'>(`${HOST}/creator/check-id`, {
        params: { userid: signupInfo.userid },
      })
      .then(res => {
        setLoading(false);
        if (res.data === 'duplicate') {
          setUseridHelperText('중복되는 아이디가 존재합니다.');
          setUseridError(true);
          return false;
        }
        if (res.data === 'allow') return true;
        return false;
      })
      .catch(() => {
        setLoading(false);
        setUseridHelperText(
          '아이디 중복확인 도중에 오류가 발생했습니다. support@onad.io로 문의바랍니다.',
        );
        setUseridError(true);
        return false;
      });
    return result;
  }

  // 비밀번호 에러 체크
  function passwdErrorCheck(): boolean {
    const isValid = passwordRegex.test(signupInfo.passwd);
    if (!isValid) {
      setPwdError(true);
      return false;
    }
    // 비번 + 비번 확인 동일한지 체크
    if (signupInfo.passwd !== signupInfo.repasswd) {
      setRePwdError(true);
      return false;
    }
    return true;
  }

  // 기존 계정 로그인 성공 여부
  const isLogedIn = !!(
    location.search &&
    parseParams(location.search).accessToken &&
    parseParams(location.search).creatorId &&
    parseParams(location.search).creatorName
  );

  // form 작성 오류 검사 -> 통과시 본인인증 다이얼로그 오픈
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const result = useridErrorCheck();
    if (result) {
      const allow = await duplicateCheck();
      if (allow) {
        if (passwdErrorCheck()) {
          if (location.pathname === '/creator/signup/pre-user') {
            // 기존 회원 트위치로 로그인
            handleSignupPreCreator();
          } else if (signupInfo.referralCode) {
            if (!referredCreator || !!referredCreatorError) {
              // 추천인 확인 필요하다는 문구 처리
              enqueueSnackbar('추천인 확인이 올바르게 끝나지 않았어요!', { variant: 'error' });
            } else handleNext();
          } else {
            handleNext();
          }
        }
      }
    }
  }

  // 트위치 인증 진행 이후, 이미 새로운 로그인 방식 처리를 진행한 유저인 경우
  // 이미 등록함 처리
  const [alreadySigned, setAlreadySigned] = useState(false);
  const [alreadySignedId, setAlreadySignedId] = useState('');
  useEffect(() => {
    if (isLogedIn) {
      const { creatorId } = parseParams(location.search);
      axiosInstance
        .get(`${HOST}/creator`, { params: { creatorId } })
        .then(res => {
          if (res.data.loginId) {
            setAlreadySigned(true);
            setAlreadySignedId(res.data.loginId);
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  });

  // 회원가입 입력 폼
  const signupForm = (
    <form onSubmit={handleSubmit} style={{ marginTop: 16, marginBottom: 16, minWidth: 270 }}>
      {/* 아이디 */}
      <TextField
        style={{ marginBottom: 16 }}
        fullWidth
        variant="outlined"
        disabled={duplicateCheckLoading}
        placeholder="아이디"
        onChange={handleChange('userid')}
        value={signupInfo.userid}
        error={useridError}
        helperText={useridHelperText}
        onFocus={(): void => setUseridIconColor('primary')}
        onBlur={(): void => setUseridIconColor('disabled')}
        inputProps={{ maxLength: 15 }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircleIcon color={useridIconColor} />
            </InputAdornment>
          ),
        }}
      />
      {/* 비밀번호 */}
      <TextField
        style={{ marginBottom: 16 }}
        fullWidth
        variant="outlined"
        placeholder="비밀번호"
        disabled={duplicateCheckLoading}
        type={signupInfo.pwdVisibility ? 'text' : 'password'}
        error={pwdError}
        helperText="특수문자 !@#$%^*+=- 를 포함한 8-20자 영문 또는 숫자"
        value={signupInfo.passwd}
        onChange={handleChange('passwd')}
        onFocus={(): void => setPwIconColor('primary')}
        onBlur={(): void => setPwIconColor('disabled')}
        inputProps={{ maxLength: 20, minLength: 8 }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color={pwIconColor} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {signupInfo.pwdVisibility ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {/* 비밀번호 확인 */}
      <TextField
        style={{ marginBottom: 16 }}
        fullWidth
        variant="outlined"
        placeholder="비밀번호확인"
        disabled={duplicateCheckLoading}
        type={signupInfo.repwdVisibility ? 'text' : 'password'}
        error={repwdError}
        helperText={repwdError ? '비밀번호와 동일하지 않습니다.' : ''}
        value={signupInfo.repasswd}
        onChange={handleChange('repasswd')}
        onFocus={(): void => setRePwIconColor('primary')}
        onBlur={(): void => setRePwIconColor('disabled')}
        inputProps={{ maxLength: 20, minLength: 8 }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color={rePwIconColor} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowRePassword}
                onMouseDown={handleMouseDownPassword}
              >
                {signupInfo.repwdVisibility ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {location.pathname !== '/creator/signup/pre-user' && (
        <TextField
          style={{ marginBottom: 16 }}
          variant="outlined"
          fullWidth
          placeholder="추천인 코드 (선택 사항)"
          value={signupInfo.referralCode}
          onChange={handleChange('referralCode')}
          helperText="추천인이 있는 경우, 추천인코드 입력 후 추천인 확인을 진행해주세요."
          onFocus={(): void => setReferralCodeColor('primary')}
          onBlur={(): void => setReferralCodeColor('disabled')}
          inputProps={{ maxLength: 30 }}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <HowToReg color={referralCodeColor} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {referredCreator ? (
                  <IconButton disabled>
                    <Check className={classes.successIcon} />
                  </IconButton>
                ) : (
                  <Button
                    disabled={!signupInfo.referralCode || loadingCheckReferralCode}
                    size="small"
                    onClick={checkReferralCode}
                  >
                    추천인 확인
                  </Button>
                )}
              </InputAdornment>
            ),
          }}
        />
      )}

      {loadingCheckReferralCode && (
        <div style={{ marginBottom: 16 }}>
          <CircularProgress size={24} />
        </div>
      )}
      {/* 올바른 추천인이 있는 경우 */}
      {!loadingCheckReferralCode && referredCreator && (
        <Alert severity="success" style={{ marginBottom: 16 }}>
          {`추천인: ${referredCreator}`}
        </Alert>
      )}
      {/* 추천인 코드가 만료되었거나, 없는 코드인 경우 */}
      {!loadingCheckReferralCode && !referredCreator && referredCreatorError && (
        <Alert severity="error" style={{ marginBottom: 16 }}>
          {referredCreatorError}
        </Alert>
      )}

      {location.pathname === '/creator/signup/pre-user' ? (
        <Button
          type="submit"
          color="primary"
          size="large"
          variant="contained"
          style={{ width: '100%' }}
          disabled={!signupInfo.userid || !signupInfo.passwd || !signupInfo.repasswd || !isLogedIn}
        >
          연결진행
        </Button>
      ) : (
        <Button
          type="submit"
          color="primary"
          size="large"
          variant="contained"
          style={{ width: '100%' }}
          disabled={
            !signupInfo.userid ||
            !signupInfo.passwd ||
            !signupInfo.repasswd ||
            duplicateCheckLoading
          }
        >
          가입하기
        </Button>
      )}
    </form>
  );

  const completeButtonSet = (
    <div>
      <Button
        component={Link}
        className={classes.socialLoginButton}
        to="/mypage/creator/main"
        color="primary"
        variant="contained"
        fullWidth
      >
        마이페이지로 이동
      </Button>
    </div>
  );

  return (
    <Grid container alignItems="center" direction="column">
      <Grid item xs={12} md={6} style={{ maxWidth: 500 }}>
        <Paper style={{ padding: 24, textAlign: 'center' }}>
          <Typography variant="h4" style={{ fontWeight: 'bold' }}>
            회원가입
          </Typography>

          {/* 이미 새로운 방식의 회원가입을 완료한 경우 */}
          {isLogedIn && alreadySigned ? (
            <div className={classes.finished}>
              <Typography>이미 새로운 방식의 회원가입을 완료하였습니다.</Typography>
              <Alert severity="info" style={{ textAlign: 'left', marginTop: 16, paddingTop: 16 }}>
                <Typography>가입하신 아이디는 다음과 같습니다.</Typography>
                <Typography>
                  {alreadySignedId.slice(0, alreadySignedId.length - 3).concat('***')}
                </Typography>
              </Alert>
              <br />
              {completeButtonSet}
            </div>
          ) : (
            <>
              {/* 기존 유저 회원 가입 안내 */}
              {location.pathname === '/creator/signup/pre-user' && (
                <>
                  <Alert
                    severity="info"
                    style={{ textAlign: 'left', marginTop: 16, paddingTop: 16 }}
                  >
                    <Typography>
                      기존 &quot;트위치로 로그인&quot;기능으로 온애드를 이용한 유저는 다음 방법으로
                      로그인할 수 있습니다.
                    </Typography>

                    <div style={{ marginTop: 8 }}>
                      <Typography variant="body2">
                        1. &quot;기존 트위치 계정 인증&quot; 버튼을 통해 사용하던 트위치 계정으로
                        로그인해주세요.
                      </Typography>
                      <Typography variant="body2">
                        2. 로그인 시 사용할 ID/PW를 입력해주세요.
                      </Typography>
                      <Typography variant="body2">
                        3. 이후 로그인부터는 입력한 ID/PW로 로그인할 수 있습니다.
                      </Typography>
                    </div>
                  </Alert>

                  {/* 기존 유저가 아닌 경우 */}
                  {parseParams(location.search).error === 'no-pre-creator' ? (
                    <div style={{ marginTop: 16 }}>
                      <Typography variant="body1">기존 유저가 아닙니다.</Typography>
                      <Typography variant="body1">
                        온애드는 더이상 새로운 회원가입이 불가능합니다.
                      </Typography>
                      <Typography variant="body1">이용해 주셔서 감사합니다.</Typography>
                      {/* <Typography variant="body1" style={{ marginBottom: 16 }}>
                        온애드 회원가입을 진행해주세요.
                      </Typography>
                      <Button
                        component={Link}
                        className={classes.socialLoginButton}
                        to="/creator/signup"
                        color="primary"
                        variant="contained"
                        fullWidth
                      >
                        회원가입하기
                      </Button> */}
                      <Button
                        component={Link}
                        className={classes.socialLoginButton}
                        to="/creator"
                        color="default"
                        variant="contained"
                        fullWidth
                      >
                        메인화면으로
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={(e): void => {
                        e.preventDefault();
                        if (!isLogedIn) window.location.href = `${HOST}/login/twitch/pre-creator`;
                      }}
                      className={classnames(classes.socialLoginButton, classes.twitch, {
                        [classes.success]: !!isLogedIn,
                      })}
                      variant="contained"
                    >
                      {isLogedIn ? (
                        <>
                          <Check />
                          <Typography variant="body1">
                            {`${parseParams(location.search).creatorName} 기존계정인증 완료`}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <img
                            src="/pngs/logo/twitch/TwitchGlitchWhite.png"
                            alt=""
                            className={classes.socialLogo}
                          />
                          <Typography variant="body1">기존 트위치 계정 인증</Typography>
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}

              {isLogedIn && (
                <Alert severity="success" style={{ textAlign: 'left' }}>
                  <Typography variant="body2">
                    아이디와 비밀번호를 입력이후 연결을 진행해주세요.
                  </Typography>
                  <Typography variant="body2">
                    이후 작성하신 ID/PW로 온애드 로그인이 가능합니다.
                  </Typography>
                </Alert>
              )}

              {/* 회원정보 받기 */}
              {/* 완료화면이 아니며, no-pre-creator에러가 아닌 경우 */}
              {!(location.pathname === '/creator/signup/complete') &&
                activeStep === 0 &&
                !(parseParams(location.search).error === 'no-pre-creator') && (
                  <div>{signupForm}</div>
                )}
            </>
          )}

          {/* 본인인증 진행 */}
          {!(location.pathname === '/creator/signup/pre-user') &&
            !(location.pathname === '/creator/signup/complete') &&
            activeStep === 1 && (
              <IndentityVerificationDialog onSuccess={handleSignup} onBackClick={handleBack} />
            )}

          {/* 회원가입 완료 페이지 */}
          {location.pathname === '/creator/signup/complete' && (
            <div className={classes.finished}>
              <Typography>회원가입이 성공적으로 완료되었습니다.</Typography>
              {completeButtonSet}
            </div>
          )}

          {location.pathname === '/creator/signup' && (
            <>
              <Divider />
              <div style={{ margin: 16 }}>
                <Typography
                  variant="body2"
                  onClick={() => history.push('/creator/signup/pre-user')}
                >
                  트위치 계정 로그인 방식으로 온애드를 사용했었나요?&nbsp;
                  <span style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}>
                    기존계정로그인
                  </span>
                </Typography>
              </div>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
