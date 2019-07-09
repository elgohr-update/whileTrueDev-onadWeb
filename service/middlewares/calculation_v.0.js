// 1. Table 중, twitchStreamDetail, twitchGame, twitchStream
//2. CreatorId를 twitchStreamDetail에 확인하기 위해서
//3. 현재시각 10분전부터 끌어모아 Listup
//4. StreamerName 으로 조회하여 존재하는지 여부 확인. => 방송중이라는 의미
const schedule = require('node-schedule'); 
const pool = require('../model/connectionPool');
const doQuery = require('../model/calculatorQuery');
const logger = require('./calculatorLogger');

/* 2019-07-06

doQuery 모듈을 사용한 Error handling 및 동기식 수행.
Creator 및 Marketer에 대해 계산시 필요한 table 고려후 초기값 삽입.

1. Creator 관련 table

  - creatorInfo
  > 최초 로그인시 Data 삽입.

  - creatorIncome
  > 최초 로그인시 (Total, Will) => (0,0)으로 삽입.

  - creatorPrice
  > 최초 로그인시 (grade, viewCount, unitPrice) => (1,0,1)으로 삽입.

  - creatorWithdrawal
  > 환급 신청시에 기입하므로 초기값은 필요하지 않음.

2. Marketer 관련 table

  - marketerCost
  > 최초 로그인시 (marketerDebit)=>(0)으로 삽입.

  - marketerCash
  > 최초 로그인시 (chargeCash, withdrawCash) => (0,0)으로 삽입.

3. 수정사항

- error handling을 위한 doQuery 사용
> 현재 Promise 객체를 return하는 함수를 Promise 객체를 return하는 doQuery를 사용하여 어떻게 대체할 것인가?

- query 객체를 통해 전달되는 error 객체
{
  cause : 'query', 'connction'
  error : '에러에 대한 내용'
}
*/

const getStreamerList = () => {
  const currentTimeQuery = `
  SELECT time 
  FROM twitchStreamDetail 
  ORDER BY time DESC 
  LIMIT 1`;

  const streamerQuery = `
  SELECT B.streamerId
  FROM (SELECT * FROM twitchStreamDetail WHERE time > ?) AS A 
  LEFT JOIN twitchStream AS B 
  ON A.streamId = B.streamId `;

  return new Promise((resolve, reject)=>{
    doQuery(currentTimeQuery)
    .then((row)=>{
      let time = row.result[0].time;
      time.setMinutes(time.getMinutes()-5);
      return time;
    })
    .then((time)=>{
        doQuery(streamerQuery, [time])
        .then((inrow)=>{
          let streamers = [];
          inrow.result.map((ininrow)=>{
            streamers.push(ininrow.streamerId);
          })
          resolve(streamers);
        })
        .catch((errorData)=>{
          errorData['point'] = 'getStreamerList()';
          errorData['description'] = `최신 streamerId을 구하는 과정`;
          reject(errorData);
        })
      }
    )
    .catch((errorData)=>{
      errorData['point'] = 'getStreamerList()';
      errorData['description'] = `twitchStreamDetail의 최신 time을 구하는 과정`;
      reject(errorData);
    }) 
  })
}


const getCreatorList = (streamerList) =>{
  console.log('현재 방송 중인 모든 creator의 list 계산 시작');

  const listQuery = `
  SELECT creatorId 
  FROM creatorInfo`;

  return new Promise((resolve, reject)=>{
    doQuery(listQuery)
    .then((row)=>{
      let creators = [];
      row.result.map((creator)=>{
        if(streamerList.includes(creator.creatorId)){
          creators.push(creator.creatorId);
        }
      })
      console.log(`현재 방송중인 creator는 ${creators} 입니다.`);
      resolve(creators);
    })
    .catch((errorData)=>{
      errorData['point'] = 'getCreatorList()';
      errorData['description'] = '현재 방송 중인 creator 구하는 과정';
      reject( errorData );
    })
  })
}


/* 2019-07-08 박찬우
  contracionTimestamp table에서 가장 최신의 data를 가져오는 함수

  1. contractionTimestamp table의 역할.
  - 현재 계약이 집행중인 contraction의 list를 가져온다.
  - 이 contracion list와 현재 방송이 진행 중인 creator list를 통해 계산을 해야하는 실제 banner list를 추출한다.

 */
const getContractionList = () =>{
  console.log('현재 광고가 집행중인 contracionId List를 계산합니다.');
  const dateQuery = `
  SELECT date 
  FROM contractionTimestamp 
  ORDER BY date DESC 
  LIMIT 1`;

  const contractionQuery = `
  SELECT contractionId 
  FROM contractionTimestamp 
  WHERE date > ?`;

  return new Promise((resolve, reject)=>{
    doQuery(dateQuery)
    .then((row)=>{
      let date = row.result[0].date;
      date.setMinutes(date.getMinutes()-5);
      return date;
    })
    .then((date=>{
        doQuery(contractionQuery, [date])
        .then((inrow)=>{
          let contractions = [];
          inrow.result.map((ininrow)=>{
            contractions.push(ininrow.contractionId);
          })
          resolve(contractions);
        })
        .catch((errorData)=>{
          errorData['point'] = 'getBannerList()';
          errorData['description'] = 'contractionTimestamp table에서 최신 contractionId 가져오는 과정.'
          reject(errorData);
        })
      }
    ))
    .catch((errorData)=>{
      errorData['point'] = 'getBannerList()';
      errorData['description'] = 'contractionTimestamp table에서 최신 date를 가져오는 과정.'
      reject(errorData);
    }) 
  })
}



/* 2019-07-08 박찬우
  1. streamIdQuery의 역할
  
  - creatorId를 통하여 현재 방송을 진행하는 streamId를 가져온다. 
  > 시청자 수는 streamId를 사용하여 조회할 수 있다.
  > 한명의 creator가 하루에 여러개의 stream을 방송할 수 있기 때문에

  2. viewerQuery의 역할
  
  - creator가 현재 방송중인 streamId를 통하여 실시간 viewer를 가져온다
  
 */
const getViewer = ({creatorId})=>{
  console.log(`${creatorId}의 시청자수를 계산합니다.`);

  const streamIdQuery = `
  SELECT streamId 
  FROM twitchStream 
  WHERE streamerId = ? 
  ORDER BY startedAt DESC 
  LIMIT 1`;

  const viewerQuery = `
  SELECT viewer 
  FROM twitchStreamDetail 
  WHERE streamId = ? 
  ORDER BY time DESC 
  LIMIT 1`;

  return new Promise((resolve, reject)=>{
    doQuery(streamIdQuery,[creatorId])
    .then((row)=>{
      const streamId = row.result[0].streamId;
      return streamId;
    })
    .then((streamId)=>{
        doQuery(viewerQuery, [streamId])
        .then((inrow)=>{
          const viewer = inrow.result[0].viewer;
          resolve(viewer);
        })
        .catch((errorData)=>{
          errorData['point'] = 'getViewer()';
          errorData['description'] = `${creatorId}의 viewer를 계산하는 과정.`;
          reject(errorData);
        })
      }
    )
    .catch((errorData)=>{
      errorData['point'] = 'getViewer()';
      errorData['description'] = `${creatorId}의 streamId를 구하는 과정`;
      reject(errorData);
    }) 
  })
}

const getPrice = ({creatorId}) => {
  console.log(`${creatorId}의 단위 가격을 계산합니다.`);
  const priceQuery = `
  SELECT unitPrice 
  FROM creatorPrice 
  WHERE creatorId = ?`;

  return new Promise((resolve, reject)=>{
    doQuery(priceQuery, [creatorId])
    .then((row)=>{
      const price = row.result[0].unitPrice;
      resolve(price);
    })
    .catch((errorData)=>{
      errorData['point'] = 'getPrice()';
      errorData['description'] = `${creatorId}의 단위 가격을 계산하는 과정.`;
      reject( errorData );
    })
  })
}


const getPriceList = ([creatorList, contractionList]) => {
  console.log('각 creator 마다 단가를 계산합니다');
  const creators = contractionList.reduce(( result, contractionId )=>
  {
    // format : (marketerId)_(contractionOrder)/(creatorId)
    const creatorId = contractionId.split('/')[1];
    // 현재 방송중인 creator 중에서 banner를 게시하고 있다면?
    if(creatorList.includes(creatorId)){
      const creatorData = {
        creatorId : creatorId,
        contractionId : contractionId
      }
      result.push(creatorData);
    }
    return result;
  }, []);

  return Promise.all(
    creators.map( async (creatorData)=>{
      const [ viewer, price ] = await Promise.all([getViewer(creatorData), getPrice(creatorData)]);
      creatorData['price'] = viewer * price;
      return creatorData;
    })
  )
}

const creatorCalcuate = ({price, creatorId}) =>{
  
  const calculateQuery = `
  INSERT INTO creatorIncome 
  (creatorId, creatorTotalIncome, creatorReceivable)  
  SELECT creatorId, creatorTotalIncome + ? , creatorReceivable + ? 
  FROM creatorIncome 
  WHERE creatorId = ? 
  ORDER BY date DESC 
  LIMIT 1`;

  return new Promise((resolve, reject)=>{
    console.log(`${creatorId}에 대해 정산을 시작합니다.`);
    doQuery(calculateQuery, [price, price, creatorId])
    .then(()=>{
      console.log(`${price} 원을 ${creatorId} 에게 입금하였습니다`);
      resolve();
    })
    .catch((errorData)=>{
      errorData['point'] = 'creatorCalcuate()';
      errorData['description'] = `${price} 원을 ${creatorId} 에게 입금하는 과정.`;
      reject( errorData );
    })
  })
}


const marketerCalculate = ({contractionId, price}) => {
  const marketerId = contractionId.split('/')[0].split('_')[0];
  console.log(`${marketerId}에 대한 정산을 시작합니다.`);
  const marketerDebitQuery = `
  SELECT marketerDebit 
  FROM marketerCost 
  WHERE marketerId = ? `;

  const emptyQuery = `
  UPDATE marketerCost 
  SET marketerDebit = 0 
  WHERE marketerId = ? `;

  const bannerSetQuery = `
  UPDATE bannerMatched 
  SET contractionState = 1 
  WHERE contractionId = ? `;

  const countQuery = `
  UPDATE marketerCost 
  SET marketerDebit = marketerDebit - ? 
  WHERE marketerId = ? `;

  return new Promise((resolve, reject)=>{
    doQuery(marketerDebitQuery, [marketerId])
    .then((row)=>{
      const debit = row.result[0].marketerDebit;
      return debit;
    })
    .then((debit)=>{
      // 현재의 잔액보다 계산되어야하는 가격이 크다면.
      if(debit <= price){
        Promise.all([
          doQuery(emptyQuery, [marketerId]), 
          doQuery(bannerSetQuery, [contractionId])
        ])
        .then(()=>{
          logger.info(`원 금액 ${price} 를 채우지 못하고 ${debit}원을 ${marketerId}에게서 지급받았습니다.`);
          resolve();          
        })
        .catch((errorData)=>{
          errorData['point'] = 'marketerCalculate()';
          errorData['description'] = `원 금액 ${price} 를 채우지 못하고 ${debit}원을 ${marketerId}에게서 지급받는 과정`;
          reject(errorData);
        })
      }else{
        doQuery(countQuery, [price, marketerId])
        .then(()=>{
          logger.info(`${price}원을 ${marketerId} 에게서 지급받았습니다.`);
          resolve();          
        })
        .catch((errorData)=>{
          errorData['point'] = 'marketerCalculate()';
          errorData['description'] = `${price}원을 ${marketerId} 에게서 지급받는 과정.`;
          reject(errorData);
        })
      }
    })
    .catch((errorData)=>{
      errorData['point'] = 'getStreamerList()';
      errorData['description'] = `${marketerId}의 markerDebit을 구하는 과정`;
      reject(errorData);
    }) 
  })
}

const contractionCalculate = ({contractionId, price}) => {
  console.log(`${contractionId}에 대한 정산을 시작합니다.`);
  const contractionValueQuery = `
    INSERT INTO contractionValue
    (contractionId, contractionTotalValue) 
    VALUES (?, ?)`;

  return new Promise((resolve, reject)=>{
    
    doQuery(contractionValueQuery, [contractionId, price])
    .then(()=>{
      logger.info(`${price} 원을 ${contractionId} 에 등록하였습니다.`);
      resolve();          
    })
    .catch((errorData)=>{
      errorData['point'] = 'contractionCalculate()';
      errorData['description'] = `${price} 원을 ${contractionId} 에 등록하는 과정`;
      reject(errorData);
    })
  
  })
}


async function getList(){
  try{
    logger.info(`탐색을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);
    console.log(`탐색을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);
    const [streamerList, contractionList] = await Promise.all([getStreamerList(), getContractionList()]);
    const creatorList  = await getCreatorList(streamerList);
    
    if(creatorList.length === 0){ 
      logger.info(`탐색을 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
      console.log(`탐색을 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
      return []; 
    }
    
    const priceList = await getPriceList([creatorList, contractionList]);
    logger.info(`탐색을 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
    console.log(`탐색을 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
    return priceList;
  }
  catch(errorData){6
    console.log(errorData);
    console.log("--------위의 사유로 인하여 계산이 종료됩니다.-------------");
    logger.error(errorData);
  }
};

async function calculation(){
  const priceList = await getList();
  
  if(priceList.length === 0){
    logger.info(`계산 항목이 존재하지 않으므로 계산 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
    console.log(`계산 항목이 존재하지 않으므로 계산 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
    return
  };

  logger.info(`계산을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);
  console.log(`계산을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);

  priceList.map( async ({creatorId, contractionId, price})=>{
    try{
      await Promise.all([creatorCalcuate({creatorId, price}), marketerCalculate({contractionId, price})]);
      logger.info(`계산을 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
      console.log(`계산을 종료합니다. 종료 시각 : ${new Date().toLocaleString()}`);
    }
    catch(errorData){
      console.log(errorData);
      console.log("--------위의 사유로 인하여 계산이 종료됩니다.-------------");
      logger.error(errorData);
    }
  })
} 

calculation();

// var scheduler = schedule.scheduleJob('5,15,25,35,45,55 * * * *', ()=>{
//   calculation();
// })

// module.exports = scheduler;
