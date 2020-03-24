// 라우터 아이콘 @material-ui/icons
import Dashboard from '@material-ui/icons/DashboardOutlined';
import Person from '@material-ui/icons/PersonOutline';
import BrandingWatermark from '@material-ui/icons/BrandingWatermarkOutlined';
import Reorder from '@material-ui/icons/Reorder';
import Work from '@material-ui/icons/Work';
import Public from '@material-ui/icons/Public';
// import Public from '@material-ui/icons/Public'; // 지구본 아이콘

// 크리에이터 라우터
import CreatorBannerManage from './creator/BannerManage';
import CreatorLandingManage from './creator/LandingManage';
import CreatorDashboard from './creator/Dashboard';
// 수정필요함.
import CreatorMyPage from './creator/Mypage';
import CreatorManual from './creator/Manual';

// 마케터 라우터
import MarketerDashboard from './marketer/Dashboard';
import MarketerInventory from './marketer/Inventory';
import MarketerManual from './marketer/Manual';
import MarketerMyOffice from './marketer/MyOffice';
import CampaignCreateStepper from './marketer/CampaignCreation';

const dashboardRoutes = {
  creator: [
    {
      path: '/main',
      name: '대시보드',
      icon: Dashboard,
      component: CreatorDashboard,
      layout: '/dashboard/creator',
    },
    {
      path: '/banner',
      name: '내 배너',
      icon: BrandingWatermark,
      component: CreatorBannerManage, // 마케터 대시보드 컴포넌트로 수정
      layout: '/dashboard/creator',
    },
    {
      path: '/landing',
      name: '내 광고페이지',
      icon: Public,
      component: CreatorLandingManage,
      layout: '/dashboard/creator',
    },
    {
      path: '/manual',
      name: '사용 방법',
      icon: Reorder,
      component: CreatorManual,
      layout: '/dashboard/creator',
    },
    {
      path: '/user',
      name: '내 계정',
      icon: Person,
      component: CreatorMyPage,
      layout: '/dashboard/creator',
    },
  ],
  marketer: [
    {
      path: '/main',
      name: '대시보드',
      icon: Dashboard,
      component: MarketerDashboard, // 마케터 대시보드 컴포넌트로 수정
      layout: '/dashboard/marketer',
    },
    {
      path: '/inventory',
      name: '내 배너',
      icon: BrandingWatermark,
      component: MarketerInventory, // 마케터 대시보드 컴포넌트로 수정
      layout: '/dashboard/marketer',
    },
    {
      path: '/manual',
      name: '사용 방법',
      icon: Reorder,
      component: MarketerManual, // 마케터 대시보드 컴포넌트로 수정
      layout: '/dashboard/marketer',
    },
    {
      path: '/myoffice',
      name: '내 오피스',
      icon: Work,
      component: MarketerMyOffice,
      layout: '/dashboard/marketer'
    },
    {
      path: '/campaigncreate',
      name: '캠페인생성',
      icon: Work,
      component: CampaignCreateStepper,
      layout: '/dashboard/marketer',
      noTab: true
    },
  ],
};

export default dashboardRoutes;