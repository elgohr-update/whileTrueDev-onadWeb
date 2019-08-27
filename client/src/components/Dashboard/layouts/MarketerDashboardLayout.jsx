import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Switch, Route } from 'react-router-dom';
import Navbar from '../components/Navbars/Navbar';
import dashboardStyle from '../assets/jss/onad/layouts/dashboardStyle';
import Sidebar from '../components/Sidebar/Sidebar';
import allRoutes from '../routes';
import Footer from '../components/Footer/Footer';
import '../assets/css/onad.css';

const MarketerRoutes = ({ history, pannelRef }) => (
  <Switch>
    {allRoutes.marketer.map(prop => (
      <Route
        path={prop.layout + prop.path}
        component={() => <prop.component history={history} pannelRef={pannelRef} />}
        key={prop.name}
      />
    ))}
  </Switch>
);

const MarketerDashboard = ({
  classes, history, ...rest
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const mainPanel = useRef();

  useEffect(() => {
    document.title = '온애드 | 대시보드';
    mainPanel.current.scrollTop = 0;
    return (() => {
      if (history.location.pathname === window.location.pathname) {
        if (mobileOpen) {
          setMobileOpen(false);
        }
      }
    });
  }, [history.location, history.location.pathname, mobileOpen]);

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={allRoutes.marketer}
        logoText="OnAD"
        color="info"
        logo="/pngs/logo/onad_logo_vertical.png"
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        history={history}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        {/* ref="mainPanel" */}
        <Navbar
          routes={allRoutes.marketer}
          history={history}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            <MarketerRoutes history={history} pannelRef={mainPanel} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

MarketerRoutes.propTypes = {
  history: PropTypes.object,
};

MarketerRoutes.defaultProps = {
  history: {},
};

MarketerDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
};

MarketerDashboard.defaultProps = {
  history: {},
};

export default withStyles(dashboardStyle)(MarketerDashboard);
