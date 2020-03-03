import express from 'express';
import responseHelper from '../middlewares/responseHelper';
import dataProcessing from '../lib/dataProcessing';
import doQuery from '../model/doQuery';

const router = express.Router();

// router.route('/')
//   .get(
//     responseHelper.middleware.checkSessionExists, // session 확인이 필요한 경우.
//     responseHelper.middleware.withErrorCatch(async (req, res, next) => {
//       const session = responseHelper.getSessionData(req);
//       console.log(session.creatorId);
//       const [creatorId] = responseHelper.getParam(['creatorId'], 'get', req);
//       if (responseHelper.paramValidationCheck(creatorId, 'creatorId', req)) {
//         const row = await doQuery('SELECT * from creatorInfo where creatorId = ?', [creatorId]);
//         // const someResult = await dataProcessing.someDataProcessingFunction(row); // 에러핸들링 포함 함수
//         // responseHelper.send(someResult, 'get', res);
//       }
//     }),
//   )
//   .post(responseHelper.middleware.unusedMethod)
//   .put(responseHelper.middleware.unusedMethod)
//   .patch(responseHelper.middleware.unusedMethod)
//   .delete(responseHelper.middleware.unusedMethod);

// export default router;
