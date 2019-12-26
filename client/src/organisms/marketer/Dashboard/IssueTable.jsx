import React from 'react';
import shortid from 'shortid';
import {
  Paper, Grid, Typography, Divider,
  List, ListItem, ListItemText, IconButton, CircularProgress,
  Slide
} from '@material-ui/core';
import Refresh from '@material-ui/icons/Refresh';

function makeContents(typeNumber, detail) {
  const details = JSON.parse(detail);
  // 0 - 이벤트 캐시충전 (온애드에서 제공되는)
  // 1 - 자가 캐시충전  v-191226 X : 무통장입급 캐시충전 기능 x이기 떄문.
  // 2 - 배너 업로드(생성) v-191226 ㅁ
  // 3 - 배너 승인 v-191226 ㅇ
  // 4 - 배너 거절 v-191226 ㅇ
  // 5 - 캠페인 생성 v-191226 ㅇ
  // 6 - 캠페인 on / off v-191226 ㅇ
  // 7 - 마케터 광고 on / off v-191226 ㅇ
  // 8 - 세금계산서 발행 / 미발행
  // 9 - 환불요청  v-191226
  // 10 - 환불요청결과
  let content = '';
  switch (typeNumber) {
    case 0:
      content = '이벤트 캐시충전';
      return content;
    case 1:
      content = `${details.chargeCash} 원 캐시충전`;
      return content;
    case 2:
      content = `${details.bannerId} 배너 업로드, 심사 진행`;
      return content;
    case 3:
      content = `${details.bannerId} 배너 심사 승인됨`;
      return content;
    case 4:
      content = `${details.bannerId} 배너 심사 거절됨`;
      return content;
    case 5:
      content = `${details.campaignId} 캠페인 생성`;
      return content;
    case 6:
      content = `${details.campaignId} 캠페인 ${details.onoffState ? 'ON' : 'OFF'}`;
      return content;
    case 7:
      content = `광고 스위치 ${details.onoffState ? 'ON' : 'OFF'}`;
      return content;
    case 8:
      content = '세금계산서 발행';
      return content;
    case 9:
      content = `${details.refundCash} 원 환불요청`;
      return content;
    case 10:
      content = ' 환불요청결과';
      return content;
    default:
      throw Error('typeNumber must be need');
  }
}

export default function issueTable(props) {
  const { actionLogData } = props;

  return (
    <Paper style={{ height: 400 }}>
      <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          활동
        </Typography>

        <IconButton
          size="small"
          onClick={() => { actionLogData.callUrl(); }}
        >
          <Refresh />
        </IconButton>
      </div>

      <Divider />

      <Grid container style={{ height: 330, overflow: 'auto' }}>
        {/* 데이터 있는 경우 */}
        {actionLogData.loading && (<CircularProgress />)}
        {actionLogData.payload.length > 0 ? (
          <List component="nav" style={{ width: '100%' }} aria-label="mailbox folders">
            {actionLogData.payload
              .sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0))
              .map((r, index) => (
                <div key={shortid.generate()}>
                  <Slide direction="up" in={!actionLogData.loading}>
                    <ListItem button style={{ justifyContent: 'space-between' }}>
                      <ListItemText
                        primary={makeContents(r.type, r.detail)}
                        secondary={new Date(r.date).toLocaleString()}
                      />
                    </ListItem>
                  </Slide>
                  {index !== actionLogData.length - 1 && (<Divider light />)}
                </div>
              ))}
          </List>
        ) : (
          // 데이터 없는 경우
          <div
            style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'
            }}
          >
            <Typography variant="body1">아직 활동내역이 없습니다.</Typography>
          </div>
        )}
      </Grid>

      {/* 데이터 없는 경우 */}

    </Paper>
  );
}
