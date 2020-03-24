import React from 'react';
import AppAppBar from '../../organisms/main/layout/AppAppBar';
import AppFooter from '../../organisms/main/layout/AppFooter';
import ProductHero from '../../organisms/main/Main/views/Hero/ProductHero';
import ProductHowItWorks from '../../organisms/main/Main/views/HowItWorks/ProductHowItWorks';
import RePasswordDialog from '../../organisms/main/Main/views/Login/RePassword';
import withRoot from '../../organisms/main/Main/withRoot';
import sources from '../../organisms/main/Main/source/sources';
import useLoginValue from '../../utils/lib/hooks/useLoginValue';
import Inqurie from '../../organisms/main/Main/views/Inquire/Inqurie';
import Indicator from '../../organisms/main/Main/views/Indicators/Indicator';
import HowToUse from '../../organisms/main/Main/views/HowToUse/HowToUse';
import Advantage from '../../organisms/main/Main/views/Advantage/Advantage';
import IntroService from '../../organisms/main/Main/views/IntroService/IntroService';

export default withRoot((props) => {
  // if located here, set the scroll to top of the page
  const { history, location } = props;
  const {
    isLogin, repasswordOpen, logout, setRepassword
  } = useLoginValue(history, location);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const MainUserType = history.location.pathname;

  return (
    <div>
      { MainUserType === '/marketer' ? (
        <div>
          <AppAppBar isLogin={isLogin} logout={logout} MainUserType="marketer" />
          <ProductHero
            source={sources.hero}
            MainUserType="marketer"
          />
          <Indicator />
          <HowToUse
            source={sources.howTo}
            slideTime={1000}
            MainUserType="marketer"
          />
          <Advantage source={sources.advantage} MainUserType="marketer" />
          <IntroService />
          <ProductHowItWorks source={sources.howitworks} MainUserType="marketer" />
          <Inqurie />
          <AppFooter />
          <RePasswordDialog
            repasswordOpen={repasswordOpen}
            setRepassword={setRepassword}
            logout={logout}
          />
        </div>
      ) : (
        <div>
          <AppAppBar isLogin={isLogin} logout={logout} MainUserType="creator" />
          <ProductHero
            source={sources.hero}
            MainUserType="creator"
          />
          <Indicator />
          <HowToUse
            source={sources.howTo}
            slideTime={1000}
            MainUserType="creator"
          />
          <Advantage source={sources.advantage} MainUserType="creator" />
          <ProductHowItWorks source={sources.howitworks} MainUserType="creator" />
          <AppFooter />
          <RePasswordDialog
            repasswordOpen={repasswordOpen}
            setRepassword={setRepassword}
            logout={logout}
          />
        </div>
      )}
    </div>
  );
});