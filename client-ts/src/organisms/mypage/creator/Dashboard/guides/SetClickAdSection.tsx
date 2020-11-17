import React from 'react';
import {
  CircularProgress,
  Input, Paper, Typography
} from '@material-ui/core';
import { InsertLinkOutlined } from '@material-ui/icons';
import Button from '../../../../../atoms/CustomButtons/Button';
import copyToClipboard from '../../../../../utils/copyToClipboard';
import { useGetRequest } from '../../../../../utils/hooks';

export interface SetClickAdSectionnProps {
  handleSnackOpen: () => void;
}
export default function SetClickAdSection({
  handleSnackOpen,
}: SetClickAdSectionnProps): JSX.Element {
  // Landing url
  const landingUrlGet = useGetRequest('/creator/landing-url');

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <Typography>클릭광고는 온애드의 두번째 광고 수익 창출 방법입니다.</Typography>
        <Typography>클릭광고의 수익은 시청자의 클릭 및 실제 구매 수에 비례합니다.</Typography>

        <br />
        <Typography>클릭광고는 클릭할 수 있는 패널의 형태입니다.</Typography>
        <Typography style={{ fontWeight: 'bold' }}>아프리카TV의 경우 방송국 내에, 트위치의 경우 방송화면 하단 패널에 설정합니다.</Typography>

        <br />
        <Typography>방송국/채널에 패널을 생성한 뒤,</Typography>
        <Typography>아래의 링크를 복사하여 해당 패널에 링크해 주세요.</Typography>

        <div style={{ margin: 32 }}>
          <Paper style={{
            padding: 16, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}
          >
            <Typography style={{ marginRight: 8, fontWeight: 'bold' }}>클릭광고 URL</Typography>
            {landingUrlGet.loading && (<CircularProgress />)}
            {!landingUrlGet.loading && landingUrlGet.data && (
            <Input
              style={{ maxWidth: 300, marginRight: 16 }}
              id="ad-page-url"
              value={landingUrlGet.data.url}
              readOnly
              fullWidth
            />
            )}
            <div>
              <Button
                color="primary"
                onClick={(e): void => {
                  copyToClipboard(e, 'ad-page-url', () => {
                    handleSnackOpen();
                  });
                }}
                size="small"
              >
                <InsertLinkOutlined />
                주소 복사
              </Button>
            </div>
          </Paper>
        </div>

        <Typography>온애드에서는 기본으로 다음과 같은 패널 이미지를 제공해 드립니다.</Typography>
        <Typography variant="body2" color="textSecondary">*이미지는 클릭시 곧바로 다운로드됩니다.</Typography>
        <div style={{ margin: 32 }}>
          <a href="/pngs/landing/온애드패널바로가기.png" download="onad_panel_banner_default">
            <img src="/pngs/landing/온애드패널바로가기.png" alt="패널기본배너1" style={{ width: '100%', maxWidth: 320 }} />
          </a>
        </div>
        <Typography>제공받은 기본 이미지를 사용하지 않으셔도 됩니다.</Typography>
        <Typography>광고임을 나타내는 이미지라면 어떤것이든 괜찮습니다.</Typography>

        <br />
        <Typography>완료하셨다면 [다음] 버튼을 눌러, 클릭광고를 설정해보세요!</Typography>

      </div>
    </div>
  );
}
