import React from 'react';
// @material-ui/core
import Hidden from '@material-ui/core/Hidden';
// core ../../../atoms
import GridContainer from '../../atoms/Grid/GridContainer';
import GridItem from '../../atoms/Grid/GridItem';
import ValueChart from '../../organisms/marketer/Dashboard/ValueChart';
import CashCard from '../../organisms/marketer/Dashboard/CashCard';
import StatusBar from '../../organisms/marketer/Dashboard/CampaignOnOffSwitch';
import CampaignCreate from '../../organisms/marketer/Dashboard/CampaignCreate';
import CampaignList from '../../organisms/marketer/Dashboard/CampaignList';

import useFetchData from '../../utils/lib/hooks/useFetchData';
import useToggle from '../../utils/lib/hooks/useToggle';
import history from '../../history';

const Dashboard = () => {
  const campaignCreateMode = useToggle();
  const marketerOnOffData = useFetchData('/api/dashboard/marketer/onoff');
  const marketerProfileData = useFetchData('/api/dashboard/marketer/profile');
  const campaignData = useFetchData('/api/dashboard/marketer/campaign/list');
  const bannerData = useFetchData('/api/dashboard/marketer/banner');

  return (
    <div>
      {campaignCreateMode.toggle && (
        <GridContainer>
          <GridItem xs={12} xl={12}>
            <CampaignCreate handleCampaignCreateMode={campaignCreateMode.handleToggle} />
          </GridItem>
        </GridContainer>
      )}

      {!campaignCreateMode.toggle && (
        <div>
          <GridContainer>
            <GridItem xs={12} md={12} xl={12}>
              <StatusBar onOffData={marketerOnOffData} />
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem xs={12} xl={3}>
              <CashCard
                marketerProfileData={marketerProfileData}
                campaignData={campaignData}
                bannerData={bannerData}
                history={history}
              />
            </GridItem>
            <Hidden xsDown>
              <GridItem sm={12} xl={9}>
                <ValueChart />
              </GridItem>
            </Hidden>
          </GridContainer>

          <GridContainer>
            <GridItem xs={12} xl={12}>
              <CampaignList
                campaignData={campaignData}
                handleCampaignCreateMode={campaignCreateMode.handleToggle}
                bannerData={bannerData}
              />
            </GridItem>
          </GridContainer>

        </div>
      )}

    </div>
  );
};

export default Dashboard;
