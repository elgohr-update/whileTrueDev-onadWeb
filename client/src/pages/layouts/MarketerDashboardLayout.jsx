import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Switch, Route } from 'react-router-dom';
import Navbar from '../../atoms/Navbars/Navbar';
import dashboardStyle from '../../assets/jss/onad/layouts/dashboardStyle';
import Sidebar from '../../atoms/Sidebar/Sidebar';
import allRoutes from '../routes';
import Footer from '../../atoms/Footer/Footer';
import '../../assets/css/onad.css';
import history from '../../history';

const MarketerRoutes = ({ pannelRef, ...rest }) => (
  <Switch>
    {allRoutes.marketer.map((prop) => (
      <Route
        path={prop.layout + prop.path}
        component={() => (
          <prop.component
            history={history}
            pannelRef={pannelRef}
            {...rest}
          />
        )}
        key={prop.name}
      />
    ))}
  </Switch>
);

const MarketerDashboard = ({ classes, match, ...rest }) => {
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
  }, [mobileOpen]);

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={allRoutes.marketer.filter((r) => !r.noTab)}
        logoText="OnAD"
        logo="/pngs/logo/onad_logo_vertical_white.png"
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        {...rest}
      />

      <div className={classes.mainPanel} ref={mainPanel}>
        {/* ref="mainPanel" */}
        <Navbar
          routes={allRoutes.marketer}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            <MarketerRoutes history={history} pannelRef={mainPanel} {...rest} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
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