import React from 'react';
import { Pie } from 'react-chartjs-2';
import CountUp from 'react-countup';
import { Grid, Divider } from '@material-ui/core';
import Assignment from '@material-ui/icons/Assignment';
import DonutSmall from '@material-ui/icons/DonutSmall';
import InsertChart from '@material-ui/icons/InsertChart';
import Typography from '@material-ui/core/Typography';
import Card from '../../../../atoms/Card/Card';
import ReportCard from './ReportCard';
import ReportStackedBar from '../../../../atoms/Chart/ReportStackedBar';


const makeContents = reportData => [
  {
    title: '광고 총 비용',
    value: Number(parseInt(reportData.totalCPM, 10) + parseInt(reportData.totalCPC, 10)),
    unit: '원'
  },
  {
    title: 'CPM 총 비용',
    value: Number(reportData.totalCPM),
    unit: '원'
  },
  {
    title: 'CPC 총 비용',
    value: Number(reportData.totalCPC),
    unit: '원'
  },
  {
    title: '배너 총 노출 수',
    value: Number(reportData.totalViewCount),
    unit: '회'
  },
  {
    title: '배너 총 클릭 수',
    value: Number(reportData.totalClick),
    unit: '회'
  },
  {
    title: '홈페이지 이동 수',
    value: Number(reportData.totalTransfer),
    unit: '회'
  },
];

export default function ContentsTotal(props) {
  const {
    period, reportData, valueChartData
  } = props;
  const contents = makeContents(reportData);

  return (
    <Grid container spacing={4}>

      {/* 윗 라인 */}
      <Grid item xs={12}>
        <ReportCard
          period={period}
          reportData={reportData}
        />
      </Grid>

      {/* 왼쪽 라인 */}
      <Grid item xs={12} sm={6}>
        <Card>
          <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Assignment fontSize="large" style={{ color: '#ff9800', marginRight: '5px' }} />
              <Typography gutterBottom variant="h5" align="center">
                개요
              </Typography>
            </div>
          </div>
          <Divider />

          {/* 광고 총 비용 */}
          {contents.map(content => (
            <div key={content.title}>
              <div style={{ padding: '16px 28px', display: 'flex', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6">
                  {content.title}
                </Typography>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography gutterBottom variant="h5" style={{ color: '#ff9800', fontWeight: 700 }}>
                    <CountUp
                      duration={1}
                      style={{ color: '#ff9800', fontWeight: 700 }}
                      end={content.value}
                    />
                  </Typography>
                  <Typography gutterBottom variant="body2">
                  &emsp;
                    {content.unit}
                  </Typography>
                </div>
              </div>
              <Divider />
            </div>
          ))}
        </Card>
      </Grid>

      {/* 오른쪽 라인 */}
      <Grid item xs={12} sm={6}>
        <Card>
          <div style={{ padding: '14px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <InsertChart fontSize="large" style={{ color: '#00acc1', marginRight: '5px' }} />
              <Typography variant="h5">
                광고 비용 그래프
              </Typography>
            </div>
          </div>
          <Divider />
          <div style={{ padding: '14px 20px' }}>
            <ReportStackedBar height={200} dataSet={valueChartData.payload[0]} />
          </div>
        </Card>

        <Card>
          <div style={{ padding: '14px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <DonutSmall fontSize="large" style={{ color: '#00acc1', marginRight: '5px' }} />
              <Typography variant="h5">
                광고 비용 비율
              </Typography>
            </div>
          </div>
          <Divider />
          <div style={{ padding: '14px 20px' }}>
            {!reportData.loading && (
            <Pie
              height={140}
              data={{
                labels: ['CPM', 'CPC'],
                datasets: [{
                  data: [reportData.totalCPM, reportData.totalCPC],
                  backgroundColor: ['#00acc1', '#ff9800']
                }]
              }}
            />
            )}
          </div>
        </Card>
      </Grid>

    </Grid>
  );
}
