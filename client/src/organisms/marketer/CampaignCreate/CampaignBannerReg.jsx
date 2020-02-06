import React from 'react';
import {
  Grid, Divider, CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import StyledItemText from '../../../atoms/StyledItemText';
import BannerCarousel from '../../../atoms/BannerCarousel';
import Button from '../../../atoms/CustomButtons/Button';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: '0px',
    alignItem: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  item: {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
      marginBottom: '30px',
      padding: 0,
    },
  },
  input: {
    width: '300px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      fontSize: '12px',
      margin: 0,
    },
  },
  label: {
    color: '#455a64',
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      marginBottom: '8px',
    },
  },
}));


const CampaignBannerReg = (props) => {
  const { dispatch, handleDialogOpen, bannerData } = props;
  const classes = useStyles();

  const handleBannerId = (bannerId) => {
    dispatch({ key: 'bannerId', value: bannerId });
  };

  return (
    <Grid item>
      <Grid container direction="column" className={classes.item} spacing={1}>
        <Grid item>
          <StyledItemText primary="배너 선택하기" secondary="해당 광고 캠페인에 사용할 배너를 선택해주세요." className={classes.label} />
          <Divider component="hr" style={{ marginBottom: '10px', width: '300px' }} />
        </Grid>
        <Grid item>
          {bannerData.loading && (
            <div style={{ padding: 72 }}>
              <CircularProgress size={100} disableShrink />
            </div>
          )}
          {!bannerData.loading && bannerData.payload.length > 0 ? (
            <BannerCarousel steps={bannerData.payload} handleBannerId={handleBannerId} />
          ) : (null)}
        </Grid>
      </Grid>
      <StyledItemText>새로운 배너를 등록하고 싶으신가요?</StyledItemText>

      <Button
        onClick={() => { handleDialogOpen(); }}
      >
          + 배너 등록하기
      </Button>
    </Grid>
  );
};

export default CampaignBannerReg;
