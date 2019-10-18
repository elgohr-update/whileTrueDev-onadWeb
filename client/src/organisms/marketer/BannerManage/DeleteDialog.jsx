import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography, Tooltip, Grid } from '@material-ui/core';
import CustomButton from '../../../atoms/CustomButtons/Button';
import StyledItemText from '../../../atoms/StyledItemText';
import Dialog from '../../../atoms/Dialog/Dialog';
import useFetchData from '../../../utils/lib/hooks/useFetchData';
import useUpdateData from '../../../utils/lib/hooks/useUpdateData';
import history from '../../../history';

const useStyles = makeStyles(theme => ({
  img: {
    maxHeight: 320,
    // maxWidth: 540
    width: '100%'
  },
  reasonText: {
    marginLeft: theme.spacing(2),
    color: 'red'
  },
  typo: {
    marginBottom: theme.spacing(1),
  }
}));

const DeleteDialog = (props) => {
  const classes = useStyles();
  const {
    open, selectedBanner, handleClose
  } = props;
  const deleteRequest = useUpdateData('/api/dashboard/marketer/banner/delete');
  const connectedCampaign = useFetchData('/api/dashboard/marketer/banner/connectedcampaign', {
    bannerId: selectedBanner.bannerId
  });
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="해당 배너를 삭제하시겠습니까?"
      fullWidth
      maxWidth="sm"
      buttons={(
        <div style={{ display: 'flex' }}>
          {!connectedCampaign.loading && connectedCampaign.payload.length > 0 ? (
            <Tooltip title={<Typography>배너가 캠페인에 할당되어 있어 삭제가 불가능합니다.</Typography>}>
              <div>
                <CustomButton
                  color="info"
                  disabled
                >
                  {'확인'}
                </CustomButton>
              </div>
            </Tooltip>
          ) : (
            <CustomButton
              color="info"
              onClick={() => {
                deleteRequest.handleUpdateRequest({ bannerId: selectedBanner.bannerId });
                setTimeout(() => {
                  handleClose();
                  history.push(window.location.pathname);
                }, 1000);
              }}
            >
              {'확인'}
            </CustomButton>
          )}
          <CustomButton onClick={handleClose}>취소</CustomButton>
        </div>
      )}
    >
      <Grid container direction="column" spacing={2}>
        <Grid item className={classes.img}>
          <img
            src={selectedBanner.bannerSrc}
            alt={selectedBanner.bannerId}
            width="100%"
          />
        </Grid>
        <Grid item>
          {selectedBanner.bannerDenialReason && (
          <div>
            <StyledItemText primary="거절 사유:" fontSize="18px" />
            <Typography variant="body1" className={classes.reasonText}>{selectedBanner.bannerDenialReason}</Typography>
          </div>
          )}
        </Grid>
        <Grid item>
          <Typography variant="body2" className={classes.typo}>
            <span role="img" aria-label="warning">⚠️</span>
            {' '}
            배너가 현재 ON 상태인 캠페인에 할당되어 있는 경우 삭제가 불가능합니다.
          </Typography>
          <Typography variant="body2">
            <span role="img" aria-label="calling">📞</span>
            {' '}
            배너 등록 관련 도움은 support@onad.io 로 메일을 보내주시거나, onad 카카오톡 채널에서 상담가능합니다.
          </Typography>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default DeleteDialog;

DeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  selectedBanner: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  handleClose: PropTypes.func.isRequired,
};
