
import { CircularProgress, Typography } from '@material-ui/core';
import { Alert, AlertProps } from '@material-ui/lab';
import React, { useState } from 'react';
import CustomDialog from '../../../../../atoms/Dialog/Dialog';
import Snackbar from '../../../../../atoms/Snackbar/Snackbar';
import { useDialog, usePatchRequest, usePostRequest } from '../../../../../utils/hooks';
import { UseGetRequestObject } from '../../../../../utils/hooks/useGetRequest';
import { MarketerSettlement } from '../../office/interface';
import SettlementRegForm, { SettlementRegDTO } from './SettlementRegForm';

export interface SettlementRegDialogProps {
  open: boolean;
  onClose: () => void;
  settlementData?: UseGetRequestObject<MarketerSettlement>;
}
export default function SettlementRegDialog({
  open,
  onClose,
  settlementData,
}: SettlementRegDialogProps): JSX.Element {
  const settlementPost = usePostRequest('/marketer/settlement');
  const settlementPatch = usePatchRequest('/marketer/settlement');

  // **************************************************************
  // 스낵바
  const snackbar = useDialog();
  const [
    snackContents, setSnackContents
  ] = useState<{msg: string; color: AlertProps['color']}>({
    msg: '',
    color: 'info'
  });
  function handleSnackContents(
    content: string, color: 'info' | 'success' | 'error' | 'warning'
  ): void {
    setSnackContents({ msg: content, color });
    snackbar.handleOpen();
  }

  const [loading, setLoading] = useState<boolean>(false);
  function handleLoadingStart(): void {
    setLoading(true);
  }
  function handleLoadingEnd(): void {
    setLoading(false);
  }

  // eslint-disable-next-line consistent-return
  function handleSubmit(dto: Partial<SettlementRegDTO>, reqType?: 'post' | 'patch'): void | Promise<void> {
    // 제출 핸들링 작성 필요
    const isBusinessman = dto.businessmanFlag === 'true';
    const data = { ...dto, businessmanFlag: isBusinessman };

    if (isBusinessman) {
      if (!data.name) return handleSnackContents('회사명을 입력해주세요.', 'error');
      if (!data.identificationNumber) return handleSnackContents('사업자등록번호를 입력해주세요.', 'error');
      if (data.identificationNumber.length !== 10) return handleSnackContents('사업자등록번호 10자리를 입력해주세요.', 'error');
    } else {
      if (!data.name) return handleSnackContents('성명을 입력해주세요.', 'error');
      if (!data.identificationNumber) return handleSnackContents('주민등록번호를 입력해주세요.', 'error');
      if (data.identificationNumber.length !== 13) return handleSnackContents('주민등록번호를 13자리를 입력해주세요.', 'error');
    }

    if (!data.bankName) return handleSnackContents('은행을 선택해주세요.', 'error');
    if (!data.bankAccountOwner) return handleSnackContents('예금주를 입력해주세요.', 'error');
    if (data.bankAccountNumber && data.bankAccountNumber.includes('-')) return handleSnackContents('계좌번호에는 - 가 포함될 수 없습니다.', 'error');
    if (!data.bankAccountNumber) return handleSnackContents('계좌번호를 입력해주세요.', 'error');
    if (isBusinessman) {
      if (!data.identificationImgSrc) return handleSnackContents('사업자등록증을 업로드해주세요.', 'error');
    } else if (!data.identificationImgSrc) return handleSnackContents('신분증을 업로드해주세요.', 'error');
    if (!data.bankAccountImgSrc) return handleSnackContents('통장 사본을 업로드해주세요.', 'error');

    const onSuccess = (res: any): void => {
      handleLoadingEnd();
      if (res.data === 1) {
        handleSnackContents('정산 등록이 완료되었습니다.', 'success');
        if (settlementData) settlementData.doGetRequest();
        return onClose();
      }
      return handleSnackContents('정산 등록중 오류가 발생했습니다. 문제가 지속되는 경우 support@onad.io로 문의 바랍니다.', 'error');
    };

    const onFail = (err: any): void => {
      handleLoadingEnd();
      handleSnackContents('정산 등록중 오류가 발생했습니다. 문제가 지속되는 경우 support@onad.io로 문의 바랍니다.', 'error');
      console.error(err);
    };

    handleLoadingStart();
    if (reqType && reqType === 'patch') {
      return settlementPatch.doPatchRequest(data).then(onSuccess).catch(onFail);
    }
    return settlementPost.doPostRequest(data).then(onSuccess).catch(onFail);
  }

  return (
    <>
      <CustomDialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={onClose}
        title="정산 등록"
      >
        {settlementData?.data && (
          <Alert severity="error">
            <Typography variant="body2">
              * 정산 등록을 수정하면 다시 검수과정을 거치게 됩니다.
            </Typography>
            <Typography variant="body2">
              * 파일 등록을 변경하지 않으시는 경우, &quot;선택된 파일 없음&quot;으로 표시되는 것과 관계없이 파일을 다시 업로드하지 않으셔도 됩니다.
            </Typography>
          </Alert>
        )}
        <SettlementRegForm
          onSubmit={handleSubmit}
          onCancle={onClose}
          loading={loading}
          settlementData={settlementData}
        />

        {(settlementPatch.loading || settlementPost.loading) && (<CircularProgress />)}

      </CustomDialog>
      {/* 에러 처리 */}
      <Snackbar
        open={snackbar.open}
        onClose={snackbar.handleClose}
        message={snackContents.msg}
        color={snackContents.color}
      />
    </>
  );
}