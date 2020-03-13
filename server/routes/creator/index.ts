import express from 'express';
import createHttpError from 'http-errors';
import responseHelper from '../../middlewares/responseHelper';
import doQuery from '../../model/doQuery';
import encrypto from '../../middlewares/encryption';
import incomeRouter from './income';
import bannerRouter from './banner';
import notificationRouter from './notification';

const router = express.Router();
router.use('/income', incomeRouter);
router.use('/banner', bannerRouter);
router.use('/notification', notificationRouter);


router.route('/')
  // 크리에이터 유저정보(계좌암호화 해제하여 전송) 조회
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId, creatorLogo } = responseHelper.getSessionData(req);
      const NowIp: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      const query = `
      SELECT creatorId, creatorName, creatorIp, creatorMail, 
      creatorAccountNumber, creatorContractionAgreement, creatorTwitchId, realName
      FROM creatorInfo
      WHERE creatorId = ?
      `;

      doQuery(query, [creatorId])
        .then((row) => {
          const userData = row.result[0];
          const rawAccount: string = row.result[0].creatorAccountNumber || '';
          const deciphedAccountNum: string = encrypto.decipher(rawAccount);
          userData.creatorLogo = creatorLogo;
          userData.creatorAccountNumber = deciphedAccountNum;
          const result = {
            ...userData,
            NowIp
          };
          responseHelper.send(result, 'get', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .patch(
    // 크리에이터 계약 OR IP 업데이트
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId, creatorName } = responseHelper.getSessionData(req);
      const [newIp, type] = responseHelper.getOptionalParam(['newIp', 'type'], 'patch', req);

      if (typeof newIp === 'string') {
        // IP update
        const ipQuery = 'UPDATE creatorInfo SET creatorIp = ? WHERE creatorId = ?';
        doQuery(ipQuery, [newIp, creatorId])
          .then(() => {
            responseHelper.send(`${creatorId}님 IP변경완료`, 'PATCH', res);
          }).catch((error) => {
            responseHelper.promiseError(error, next);
          });
      } else if (type === 'contraction') {
        // 크리에이터 계약
        const contractionUpdateQuery = `
          UPDATE creatorInfo
          SET creatorContractionAgreement = ?
          WHERE creatorInfo.creatorId = ?`;
        // 계약시 생성되는 creatorCampaign 기본값
        const campaignList = JSON.stringify({ campaignList: [] });
        const campaignQuery = `
          INSERT INTO creatorCampaign
          (creatorId, campaignList, banList)
          VALUES (?, ?, ?)
        `;
        // 계약시 생성되는 creatorLanding 기본값
        const landingQuery = `
          INSERT INTO creatorLanding
          (creatorId, creatorTwitchId)
          VALUES (?, ?)`;

        Promise.all([
          doQuery(contractionUpdateQuery, [1, creatorId]),
          doQuery(campaignQuery, [creatorId, campaignList, campaignList]),
          doQuery(landingQuery, [creatorId, creatorName])
        ])
          .then(() => {
            responseHelper.send([true], 'PATCH', res);
          })
          .catch((error) => {
            responseHelper.promiseError(error, next);
          });
      } else { // newIP, type 모두 없는 경우 = 400 BadRequest
        throw new createHttpError[400]();
      }
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


router.route('/account')
  .post( // 크리에이터 정산에 필요한 계좌 등록 / 변경
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const [bankName, bankRealName, bankAccount]: string[] = responseHelper.getParam(['bankName', 'bankRealName', 'bankAccount'], 'post', req);
      const AccountNumber = `${bankName}_${bankAccount}`;
      const enciphedAccountNum: string = encrypto.encipher(AccountNumber);
      const accountNumberQuery = `
      UPDATE creatorInfo 
      SET creatorAccountNumber = ?, realName = ?  WHERE creatorId = ?
      `;

      doQuery(accountNumberQuery, [enciphedAccountNum, bankRealName, creatorId])
        .then((row) => {
          responseHelper.send([true], 'POST', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next);
        });
    })
  );

router.route('/ad-page')
  .get(
    // 크리에이터 광고 페이지 정보
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);

      const query = `
      SELECT
        CL.creatorTwitchId, CL.creatorDesc,
        CL.creatorBackgroundImage, CL.creatorTheme, CR.visitCount, CR.level, CR.exp
      FROM creatorLanding as CL
      JOIN creatorRoyaltyLevel as CR
        ON CL.creatorId = CR.creatorId
      WHERE CL.creatorId = ?
      LIMIT 1`;
      interface CreatorAdPageResult {
        creatorTwitchId: string;
        creatorDesc: string;
        creatorBackgroundImage: string;
        creatorTheme: 'dark' | 'light';
        exp: number;
        level: number;
        visitCount: number;
      }

      const clickAndTransferQuery = `         
      SELECT 
        SUM(clickCount) as clickCount, SUM(transferCount) as transferCount
      FROM landingClick  WHERE creatorId = ?`;
      interface ClickAndTransferResult {
        clickCount: number;
        transferCount: number;
        date: string;
      }

      Promise.all([
        doQuery<CreatorAdPageResult[]>(query, [creatorId]),
        doQuery<ClickAndTransferResult[]>(clickAndTransferQuery, [creatorId])
      ])
        .then((row) => {
          const [creatorAdPageResult, clickAndTransferResult] = row;
          if (creatorAdPageResult.result && clickAndTransferResult.result) {
            const result = Object.assign(
              creatorAdPageResult.result[0], clickAndTransferResult.result[0]
            );
            responseHelper.send(result, 'get', res);
          }
        }).catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .patch(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);
      const { imageUrl, description, creatorTheme } = req.body;

      if (typeof imageUrl !== 'string') {
        // 소개글 관리 변경
        const query = `
          UPDATE creatorLanding
          SET creatorDesc = ?, creatorTheme = ?
          WHERE creatorId = ?
          `;
        const queryArray = [description, creatorTheme, creatorId];
        doQuery(query, queryArray)
          .then((row) => {
            if (!row.error && row.result) {
              responseHelper.send([true], 'PATCH', res);
            }
          })
          .catch((err) => {
            responseHelper.promiseError(err, next);
          });
      } else {
        // 이미지 변경
        const backgroundImageQuery = `
          UPDATE creatorLanding
          SET creatorBackgroundImage = ?
          WHERE creatorId = ?`;
        const backgroundImageArray = [imageUrl, creatorId];
        doQuery(backgroundImageQuery, backgroundImageArray)
          .then((row) => {
            if (!row.error) {
              responseHelper.send([true, '등록되었습니다.'], 'PATCH', res);
            }
          })
          .catch((err) => {
            responseHelper.promiseError(err, next);
          });
      }
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

router.route('/landing-url')
  // 크리에이터 광고 페이지 URL
  .get(
    responseHelper.middleware.checkSessionExists,
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { creatorId } = responseHelper.getSessionData(req);

      const query = `
      SELECT 
      creatorTwitchId 
      FROM creatorInfo
      WHERE creatorId = ?
      `;

      doQuery(query, [creatorId])
        .then((row) => {
          const { creatorTwitchId } = row.result[0];
          const result = `http://l.onad.io/${creatorTwitchId}`;
          responseHelper.send(result, 'get', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

export default router;
