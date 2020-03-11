import React from 'react';
import shortid from 'shortid';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import BrandingWatermark from '@material-ui/icons/BrandingWatermark';
import Button from '../../../../atoms/CustomButtons/Button';
import CustomCard from '../../../../atoms/CustomCard';
import useGetRequest from '../../../../utils/hooks/useGetRequest';
import CircularProgress from '../../../../atoms/Progress/CircularProgress';
import StyledItemText from '../../../../atoms/StyledItemText';
import history from '../../../../history';

const useStyles = makeStyles((theme: Theme) => ({
  area: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  head: { fontWeight: 700 }
}));

interface CurrentBannerRes {
  marketerName: string; bannerSrc: string; bannerDescription: string;
}

const BannerCard = (): JSX.Element => {
  const classes = useStyles();
  const currentBannerGet = useGetRequest<null, CurrentBannerRes[]>('/creator/banner/active');
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [descIndex, setDescIndex] = React.useState(0); // popover의 내용 Index

  const handlePopoverClose = (): void => {
    setAnchorEl(null);
  };

  const handlePopoverOpen = (index: number) => (
    event: React.MouseEvent<HTMLElement>
  ): void => {
    if (index !== descIndex) {
      handlePopoverClose();
    }
    setDescIndex(index);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClick = (index: number) => (
    event: React.MouseEvent<HTMLElement>
  ): void => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setDescIndex(index);
      setAnchorEl(event.currentTarget);
    }
  };

  return (
    <CustomCard
      iconComponent={<BrandingWatermark />}
      buttonComponent={(
        <Button
          color="primary"
          onClick={(): void => { history.push('/dashboard/creator/banner'); }}
        >
          배너내역
        </Button>
      )}
    >
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <StyledItemText primary="현재 송출중인 배너" secondary="배너 관리로 이동하면 상세정보를 확인할 수 있습니다." />
        </Grid>
        <Grid container direction="row" spacing={1} justify="center">
          {currentBannerGet.loading && (<CircularProgress small />)}
          {!currentBannerGet.loading && !currentBannerGet.error
          && currentBannerGet.data && (
            currentBannerGet.data.map((bannerData, index) => (
              <Grid
                item
                xs={12}
                lg={6}
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
          {!currentBannerGet.loading && currentBannerGet.data
          && currentBannerGet.data.length <= 0 && (
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
    </CustomCard>
  );
};

export default BannerCard;
