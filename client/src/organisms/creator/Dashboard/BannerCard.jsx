import React from 'react';
import shortid from 'shortid';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BrandingWatermark from '@material-ui/icons/BrandingWatermark';
import Button from '../../../atoms/CustomButtons/Button';
import CustomCard from '../../../atoms/CustomCard';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import CircularProgress from '../../../atoms/Progress/CircularProgress';
import StyledItemText from '../../../atoms/StyledItemText';
import history from '../../../history';

const useStyles = makeStyles((theme) => ({
  area: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  head: {
    fontWeight: '700',
    color: '#455a64',
  }
}));


const BannerManageButton = () => (
  <Button
    color="primary"
    onClick={() => {
      history.push('/dashboard/creator/banner');
    }}
  >
    배너내역
  </Button>
);


const BannerCard = () => {
  const classes = useStyles();
  const currentBannerData = useFetchData('/api/dashboard/creator/banner/current');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [descIndex, setDescIndex] = React.useState(0); // popover의 내용 Index

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handlePopoverOpen = (index) => (event) => {
    if (index !== descIndex) {
      handlePopoverClose();
    }
    setDescIndex(index);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClick = (index) => (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setDescIndex(index);
      setAnchorEl(event.currentTarget);
    }
  };

  return (
    <CustomCard iconComponent={<BrandingWatermark />} buttonComponent={<BannerManageButton />}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <StyledItemText primary="현재 송출중인 배너" secondary="배너 관리로 이동하면 상세정보를 확인할 수 있습니다." />
        </Grid>
        <Grid container direction="row" spacing={1} justify="center">
          {currentBannerData.loading && (<CircularProgress small />)}
          {!currentBannerData.loading && !currentBannerData.error && (
            currentBannerData.payload.map((bannerData, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                onClick={handlePopoverClick(index)}
                key={shortid.generate()}
              >
                <img
                  src={bannerData.bannerSrc}
                  onMouseEnter={handlePopoverOpen(index)}
                  onMouseLeave={handlePopoverClose}
                  alt="bannerArea"
                  width="100%"
                  height="100%"
                  style={{ maxHeight: '160px', maxWidth: '320px' }}
                />
              </Grid>
            ))
          )}
          {!currentBannerData.loading && currentBannerData.payload.length === 0 && (
          <div className={classes.area}>
            <Typography variant="h6" className={classes.head}>
              <span role="img" aria-label="caution">🚫</span>
              {' '}
              현재 송출 중인 배너가 없습니다.
            </Typography>
          </div>
          )}
        </Grid>
        <Grid item />
      </Grid>

      {/* {!currentBannerData.loading && (
      <BannerDescPopover
        currentBannerData={currentBannerData}
        open={open}
        anchorEl={anchorEl}
        handlePopoverClose={handlePopoverClose}
        descIndex={descIndex}
      />
      )} */}

    </CustomCard>
  );
};

export default BannerCard;
