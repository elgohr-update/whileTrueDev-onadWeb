import express from 'express';
import responseHelper from '../../../middlewares/responseHelper';
import doQuery from '../../../model/doQuery';
import analysisRouter from './analysis';
import marketerActionLogging from '../../../middlewares/marketerActionLog';

const router = express.Router();

router.use('/analysis', analysisRouter);

// 대시보드 - 마케터의 보유 캐시량, 총 소진 비용
// marketer/marketer =>/normal
// test 완료
router.route('/')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);

      const query = `SELECT cashAmount, spendAll FROM
      (
          SELECT cashAmount
          FROM marketerDebit
          WHERE marketerId = ?) AS cashAmount,
      (
          SELECT IFNULL(sum(cashFromMarketer), 0) AS spendAll
          FROM campaignLog
          WHERE SUBSTRING_INDEX(campaignId, "_" , 1) = ?) AS spendAll
            `;
      doQuery(query, [marketerId, marketerId])
        .then((row) => {
          responseHelper.send(row.result[0], 'get', res);
        }).catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);

// 캠페인 ONOFF
// marketer/marketer =>/onoff
// test 완료
router.route('/on-off')
  .get(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const query = `
            SELECT marketerContraction
            FROM marketerInfo
            WHERE marketerId = ?
            `;
      doQuery(query, [marketerId])
        .then((row) => {
          const onOffState = row.result[0].marketerContraction === 1;
          responseHelper.send({ onOffState }, 'get', res);
        }).catch((error) => {
          console.log(error);
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .post(
    responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
    responseHelper.middleware.withErrorCatch(async (req, res, next) => {
      const { marketerId } = responseHelper.getSessionData(req);
      const onOffState = responseHelper.getParam('onOffState', 'POST', req);
      const contractionState = onOffState === false ? 0 : 1;

      const infoQuery = 'UPDATE marketerInfo SET marketerContraction = ? WHERE marketerId = ?';

      // 마케터 활동내역 테이블 적재: 마케터 onoff를 위한 상태값
      const MARKETER_ACTION_LOG_TYPE = 7;

      doQuery(infoQuery, [contractionState, marketerId])
        .then(() => {
          // 마케터 활동내역 테이블 적재
          marketerActionLogging([marketerId, MARKETER_ACTION_LOG_TYPE,
            JSON.stringify({
              onoffState: contractionState // on: 1, off : 0
            })]);
          responseHelper.send([true], 'POST', res);
        })
        .catch((error) => {
          responseHelper.promiseError(error, next);
        });
    }),
  )
  .all(responseHelper.middleware.unusedMethod);


export default router;
