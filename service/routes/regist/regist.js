require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.

const express = require('express');
const axios = require('axios');
const encrypto = require('../../encryption');
const doQuery = require('../../model/doQuery');
const setTemporaryPassword = require('../../middlewares/setTemporyPassword');
const sendEmailAuth = require('../../middlewares/sendEmailAuth');

const HOST = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_REACT_HOSTNAME
  : process.env.DEV_REACT_HOSTNAME;

const router = express.Router();

/* 2019-07-06 박찬우

- 회원가입시 초기화되어야하는 table
  1. marketerInfo
  2. marketerCash
  3. marketerCost

*/
router.post('/marketer', (req, res, next) => {
  const {
    marketerId, marketerName,
    marketerMail, marketerPhoneNum,
    marketerBusinessRegNum, marketerUserType,
    marketerRawPasswd
  } = req.body;
  const [key, salt] = encrypto.make(marketerRawPasswd);

  const infoQuery = `
  INSERT INTO marketerInfo 
  (marketerId, marketerPasswd, marketerSalt, marketerName, marketerMail, 
  marketerPhoneNum, marketerBusinessRegNum, marketerUserType) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?) `;
  const infoQueryArray = [marketerId, key, salt, marketerName, marketerMail,
    marketerPhoneNum, marketerBusinessRegNum, marketerUserType];

  const cashQuery = `
  INSERT INTO marketerDebit
  (marketerId, cashAmount)
  VALUES (?, ?)`;

  Promise.all([
    doQuery(infoQuery, infoQueryArray),
    doQuery(cashQuery, [marketerId, 0]),
  ])
    .then(() => {
      // res.send([true, null]);
      next();
    })
    .catch((error) => {
      res.send([false, error]);
    });
}, sendEmailAuth);


router.post('/marketer/platform', (req, res) => {
  const {
    marketerId, marketerName,
    marketerMail, marketerPhoneNum,
    marketerBusinessRegNum, marketerUserType,
    platformType
  } = req.body;

  const infoQuery = `
  INSERT INTO marketerInfo 
  (marketerId, marketerName, marketerMail, 
  marketerPhoneNum, marketerBusinessRegNum, marketerUserType, platformType, marketerEmailAuth) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?) `;

  const infoQueryArray = [marketerId, marketerName, marketerMail,
    marketerPhoneNum, marketerBusinessRegNum, marketerUserType, platformType, 1];

  const cashQuery = `
  INSERT INTO marketerDebit
  (marketerId, cashAmount)
  VALUES (?, ?)`;

  Promise.all([
    doQuery(infoQuery, infoQueryArray),
    doQuery(cashQuery, [marketerId, 0])
  ])
    .then(() => {
      res.send({ error: false });
    })
    .catch((error) => {
      console.log(error);
      res.send({ error });
    });
});


// 쿼리관련 에러 핸들링 완료.
router.post('/checkId', (req, res) => {
  console.log('checkId로 중복확인 합니다.');
  doQuery('SELECT marketerId FROM marketerInfo WHERE marketerId = ? ', [req.body.id])
    .then((row) => {
      const { result } = row;
      if (result[0]) {
      // ID가 존재한다.
        res.send(true);
      } else {
        res.send(false);
      }
    })
    .catch(() => {
      res.send(false);
    });
});

// 쿼리관련 에러 핸들링 완료.
router.post('/findId', (req, res) => {
  let json = {
    error: true,
    message: ''
  };
  doQuery('SELECT marketerId, marketerName FROM marketerInfo WHERE marketerMail = ? ', [req.body.marketerMail])
    .then((data) => {
      const { result } = data;
      if (result[0]) {
        if (result[0].marketerName === req.body.marketerName) {
          json = {
            error: false,
            message: result[0].marketerId
          };
        } else {
          json.message = 'NAME과 EMAIL이 일치하지 않습니다.';
        }
      } else {
        json.message = '입력하신 EMAIL의 회원이 존재하지 않습니다.';
      }
      res.send(JSON.stringify(json));
    })
    .catch(() => {
      json.message = 'DB 관련 오류입니다. 잠시 후 다시 시도해주세요..';
      res.send(JSON.stringify(json));
    });
});

// 쿼리관련 에러 핸들링 완료.
router.post('/findPw', (req, res, next) => {
  const json = {
    error: true,
    message: ''
  };
  doQuery('SELECT marketerMail FROM marketerInfo WHERE marketerId = ? ', [req.body.marketerId])
    .then((data) => {
      const { result } = data;
      if (result[0]) {
        if (result[0].marketerMail === req.body.marketerMail) {
          next();
        } else {
          json.message = 'ID와 EMAIL이 일치하지 않습니다.';
          res.send(JSON.stringify(json));
        }
      } else {
        json.message = '해당 ID의 회원이 존재하지 않습니다.';
        res.send(JSON.stringify(json));
      }
    })
    .catch(() => {
      json.message = 'DB 관련 오류입니다. 잠시 후 다시 시도해주세요..';
      res.send(JSON.stringify(json));
    });
}, setTemporaryPassword);

// 쿼리관련 에러 핸들링 완료.
router.get('/auth/:id', (req, res) => {
  console.log('본인인증에 대한 접근입니다.');
  doQuery(`
  UPDATE marketerInfo
  SET marketerEmailAuth = 1
  WHERE marketerId = ?`, [req.params.id])
    .then(() => {
      res.redirect(HOST);
    })
    .catch(() => {
      res.redirect(HOST);
    });
});

// 크리에이터 마케터 계좌 정보 입력
router.post('/accountNum', (req, res, next) => {
  const { userType } = req.session.passport.user;
  let userId;
  let query;
  if (userType === 'creator') {
    userId = req.session.passport.user.creatorId;
    query = 'UPDATE creatorInfo SET creatorAccountNumber = ?, realName = ?  WHERE creatorId = ?';
  } else {
    userId = req.session.passport.user.userid;
    query = 'UPDATE marketerInfo SET marketerAccountNumber = ?, accountHolder = ? WHERE marketerId = ?';
  }

  const { bankName, bankRealName, bankAccount } = req.body;
  const AccountNumber = `${bankName}_${bankAccount}`;
  // 계좌정보 변경시 암호화하여 저장한다.
  const enciphedAccountNum = encrypto.encipher(AccountNumber);
  doQuery(query, [enciphedAccountNum, bankRealName, userId])
    .then((data) => {
      res.send(data);
    })
    .catch((data) => {
      res.send(data);
    });
});


router.get('/account', (req, res) => {
  axios.get('https://testapi.open-platform.or.kr/oauth/2.0/authorize',
    {
      params: {
        response_type: 'code',
        client_id: 'ONAD',
        redirect_uri: 'http://localhost:3000/api/regist/account/callback',
        scope: 'login transfer inquiry',
        client_info: 'OVGY8ObRgN6Glqqc9A0T1nAcQ4CXgBaEKKUCGx8c',
        auth_type: 0
      }
    })
    .then((row) => {
      console.log(row);
      console.log('요청완료');
    })
    .catch((errorData) => {
      console.log(errorData);
    });
});

router.get('/account/callback', (req, res) => {
  console.log('콜백');
  console.log(req.body);
  res.send('');
});

router.post('/certifications', async (req, res) => {
  const { imp_uid } = req.body; // request의 body에서 imp_uid 추출
  try {
    // 인증 토큰 발급 받기
    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post', // POST method
      headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
      data: {
        imp_key: process.env.IMP_KEY, // REST API키
        imp_secret: process.env.IMP_SECRET // REST API Secret
      }
    });

    const { access_token } = getToken.data.response; // 인증 토큰
    // imp_uid로 인증 정보 조회
    const getCertifications = await axios({
      url: `https://api.iamport.kr/certifications/${imp_uid}`, // imp_uid 전달
      method: 'get', // GET method
      headers: { Authorization: access_token } // 인증 토큰 Authorization header에 추가
    });
    const certificationsInfo = getCertifications.data.response; // 조회한 인증 정보
    // 인증정보에 대한 데이터를 저장하거나 사용한다.

    const {
      birth
    } = certificationsInfo;

    const date = new Date(birth);
    const now = new Date();
    now.setFullYear(now.getFullYear() - 19);

    const minor = now < date;
    res.send({ error: false, data: { minor } });
  } catch (e) {
    console.error(e);
    res.send({ error: true, data: { msg: '서버오류입니다. 잠시후 다시 진행해주세요.' } });
  }
});


module.exports = router;