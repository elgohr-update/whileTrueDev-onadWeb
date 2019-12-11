import React from 'react';
import { Grid, Slide } from '@material-ui/core';

import Dialog from '../../../../atoms/Dialog/Dialog';
import ReportLoading from './sub/campaignSub/ReportLoading';
import CampaignBannerClickAd from './sub/CampaignBannerClickAd';
import CampaignOnlyClickAd from './sub/CampaignOnlyClickAd';
import CampaignOnlyBannerAd from './sub/CampaignOnlyBannerAd';
// hooks
import useFetchData from '../../../../utils/lib/hooks/useFetchData';

const ONLY_BANNER_STATE = 0;
const BANNER_WITH_CLICK_STATE = 1;
const ONLY_CLICK_STATE = 2;

const Transition = React.forwardRef((props, ref) => (
  <Slide
    direction="up"
    ref={ref}
    {...props}
  />
));

export default function CampaignReportDialog(props) {
  const {
    SLIDE_TIMEOUT, selectedCampaign, open, handleClose
  } = props;

  const reportData = useFetchData(
    '/api/dashboard/marketer/report',
    { campaignId: selectedCampaign.campaignId }
  );

  const valueChartData = useFetchData(
    '/api/dashboard/marketer/report/totalSpendChart',
    { campaignId: selectedCampaign.campaignId }
  );
  const ipToGeoData = useFetchData(
    '/api/dashboard/marketer/geo/campaign',
    { campaignId: selectedCampaign.campaignId }
  );

  const creatorsData = useFetchData(
    '/api/dashboard/marketer/report/creators',
    { campaignId: selectedCampaign.campaignId }
  );

  const clickData = useFetchData(
    '/api/dashboard/marketer/report/clicks',
    { campaignId: selectedCampaign.campaignId }
  );

  return (
    <Dialog
      fullScreen
      title="캠페인 효과 분석"
      open={Boolean(open)}
      onClose={handleClose}
      TransitionComponent={Transition}
      TransitionProps={{
        timeout: { enter: SLIDE_TIMEOUT, exit: SLIDE_TIMEOUT }
      }}
    >
      <Grid container>
        <Grid item xl={3} />
        <Grid item xs={12} xl={6}>
          {/* 로딩중 화면 */}
          {reportData.loading && (<ReportLoading />)}

          {/* 로딩 이후 화면 */}

          {/* Only CPC (클릭 광고인 경우) */}
          {selectedCampaign.optionType === ONLY_CLICK_STATE && (
          <CampaignOnlyClickAd />
          )}


          {/* Only CPM (배너 광고인 경우) */}
          {selectedCampaign.optionType === ONLY_BANNER_STATE && (
          <CampaignOnlyBannerAd />
          )}

          {/* CPM + CPC (배너 광고 + 클릭 광고인 경우) */}
          {selectedCampaign.optionType === BANNER_WITH_CLICK_STATE && (
            <CampaignBannerClickAd
              reportData={reportData}
              valueChartData={valueChartData}
              ipToGeoData={ipToGeoData}
              creatorsData={creatorsData}
              clickData={clickData}
            />
          )}

        </Grid>
        <Grid item xl={3} />
      </Grid>
    </Dialog>
  );
}
