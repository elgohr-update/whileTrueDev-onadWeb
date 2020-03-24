import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
  Grid,
} from '@material-ui/core';
import shortid from 'shortid';
import sources from '../../source/sources';
import Dialog from '../../../../../atoms/Dialog/Dialog';

const useStyles = makeStyles(theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  warning: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderLeft: '0.25rem solid #d0021b',
    wordBreak: 'keep-all'
  },
  title: {
    marginBottom: 0,
    paddingLeft: 5,
    color: 'red',
    fontFamily: 'Noto Sans KR',
  },
  content: {
    marginBottom: theme.spacing(4),
    paddingLeft: 5,
    marginTop: 3,
    fontSize: 15,
    fontStyle: 'inherit',
    fontFamily: 'Noto Sans KR',
  },
  checked: {},
  checkboxRoot: {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  divider: {
    width: 2,
    height: 28,
    margin: 10,
  },
  container: {
    ...theme.mixins.gutters(),
    width: '78%',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    margin: '0 auto',
    display: 'flex',
    backgroundColor: '#f2f2f2',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  inDialogContent: {
    outline: 'none',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2),
    },
  },
  names: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
      fontWeight: 500,
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '12px',
      fontWeight: 700,
    },
  },

}));

const TestChargeAgreement = (props) => {
  const classes = useStyles();
  const terms = sources.agreement;
  const {
    setStepComplete
  } = props;
  const [checkedA, setA] = useState(false);
  const [checkedB, setB] = useState(false);
  const [checkedC, setC] = useState(false);
  const [checkedD, setD] = useState(false);


  const [selectTerm, setTerm] = useState({
    text: '',
  });
  const [open, setOpen] = useState(false);

  const handleChange = name => () => {
    if (name === 'checkedA') {
      setA(!checkedA);
      if (!checkedA === true) {
        setB(true);
        setC(true);
        setD(true);
        setStepComplete(true);
      } else {
        setB(false);
        setC(false);
        setD(false);
        setStepComplete(false);
      }
    } else if (name === 'checkedB') {
      setB(!checkedB);
      if (!checkedB === false) {
        setA(false);
        setStepComplete(false);
      }
      if (!checkedB && checkedC && checkedD) {
        setA(true);
        setStepComplete(true);
      }
    } else if (name === 'checkedC') {
      setC(!checkedC);
      if (!checkedC === false) {
        setA(false);
        setStepComplete(false);
      }
      if (checkedB && !checkedC && checkedD) {
        setA(true);
        setStepComplete(true);
      }
    } else {
      setD(!checkedD);
      if (!checkedD === false) {
        setA(false);
        setStepComplete(false);
      }
      if (checkedB && checkedC && !checkedD) {
        setA(true);
        setStepComplete(true);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = term => () => {
    setTerm(term);
    setOpen(true);
  };

  // const checkAgreement = () => {
  //   if (checkedB && checkedC && checkedD) {
  //     setLoading(1);
  //     handleUserSubmit();
  //   } else {
  //     alert('모든 약관에 동의하지 않으면 캐시충전이 되지 않습니다.')
  //   }
  // }

  const checked = (term) => {
    if (term.state === 'checkedB') {
      return checkedB;
    } if (term.state === 'checkedC') {
      return checkedC;
    } if (term.state === 'checkedD') {
      return checkedD;
    }
    return checkedA;
  };

  useEffect(() => {
    setStepComplete(false);
  }, [setStepComplete]);


  return (
    <div>
      <blockquote className={classes.warning}>
        <h4 className={classes.title}>&raquo; 주의사항</h4>
        <p className={classes.content}>{sources.content.warning}</p>
      </blockquote>
      <div>
        {terms.map(term => (
          <Paper className={classes.container} elevation={1} key={term.state}>
            <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
              <Grid item>
                <Typography component="p" style={{ flex: 8, fontSize: 13 }}>
                  {term.title}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container direction="row" alignItems="center">
                  <Grid item>
                    { term.state === 'checkedA' ? (null) : (
                      <Button
                        style={{
                          flex: 1, backgroundColor: '#d6d6d6', height: '70%', fontSize: 13,
                        }}
                        onClick={handleOpen(term)}
                      >
                  전문보기
                      </Button>
                    )}
                  </Grid>
                  <Grid item>
                    <Divider className={classes.divider} />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          onChange={handleChange(term.state)}
                          checked={checked(term)}
                          value={term.state}
                          classes={{
                            root: classes.checkboxRoot,
                            checked: classes.checked,
                          }}
                        />
                  )}
                      label="동의"
                      style={{ flex: 2, marginRight: 0 }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        ))}
        <Dialog
          open={open}
          onClose={handleClose}
          title={selectTerm.title}
          maxWidth="md"
          buttons={(
            <div>
              <Button onClick={handleClose}>
              취소
              </Button>
            </div>
            )}
        >
          {/* 계약 내용 */}
          <div className={classes.inDialogContent}>
            {selectTerm.text.split('\n').map(sentence => (
              <p key={shortid.generate()} className={classes.names}>{sentence}</p>
            ))}
          </div>
        </Dialog>

      </div>
    </div>
  );
};

export default TestChargeAgreement;