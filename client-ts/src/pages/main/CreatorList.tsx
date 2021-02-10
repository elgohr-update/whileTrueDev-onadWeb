import React, { useEffect } from 'react';
import { Grow, Grid, Typography, TablePagination } from '@material-ui/core';
import shortid from 'shortid';
import useStyles from './style/CreatorList.style';
import NavTop from '../../organisms/main/layouts/NavTop';
import AppFooter from '../../organisms/main/layouts/AppFooter';
import RePasswordDialog from '../../organisms/main/main/login/RePassword';
import useLoginValue from '../../utils/hooks/useLoginValue';
import useGetRequest from '../../utils/hooks/useGetRequest';
import textSource from '../../organisms/main/Introduction/source/textSource';
import Card from '../../atoms/Card/Card';
import CardAvatar from '../../atoms/Card/CardAvatar';
import CardBody from '../../atoms/Card/CardBody';
import CircularProgress from '../../atoms/Progress/CircularProgress';
import withRoot from './withRoot';
import Table from '../../atoms/Table/MaterialTable'


export interface ContractedCreatorListData<T> {
  creatorId: T;
  creatorName: T;
  creatorLogo: T;
  followers: number
  content: T;
  openHour: T
}

const COLORS = [
  ['#00b9fd', '#4459fc', '#0f7cfc'],
  ['#00ddcc', '#00ad93', '#00d57b'],
  ['#ffe34a', '#ff7f00', '#fcaa0f'],
  ['#e000fd', '#4459fc', '#8f0ffc']
]


export default withRoot(() => {
  const {
    isLogin, repasswordOpen, logout, setRepassword
  } = useLoginValue();
  const classes = useStyles();
  const [LiveCreator, setLiveCreator] = React.useState<null | ContractedCreatorListData<string>[]>();
  const ContractedCreatorList = useGetRequest<null, ContractedCreatorListData<string>[]>('/creators');
  const LiveCreatorList = useGetRequest<null, string[]>('/creators/live');
  console.log(ContractedCreatorList.data)

  function getRandomColors(array: any): string { 
    let RandomColor = array[Math.floor(Math.random() * array.length)]
    return `linear-gradient(to bottom, ${RandomColor[0]},${RandomColor[1]}, ${RandomColor[2]}`
  }
  
  useEffect(() => {
    if (!ContractedCreatorList.loading && ContractedCreatorList.data && !LiveCreatorList.loading && LiveCreatorList.data) {
      setLiveCreator(ContractedCreatorList.data!.filter((row) => LiveCreatorList.data!.includes(row.creatorId)))
    }
  }, [ContractedCreatorList.data, LiveCreatorList.data])

  return (
    <div>
      <NavTop isLogin={isLogin} logout={logout} MainUserType />
      <div className={classes.root}>
        <div className={classes.containerWrap}>
          <img src="/creatorList/creatorList.svg" className={classes.mainImage} />
        </div>
        <div className={classes.wrapper}>
          <Typography variant="h3" className={classes.title}>LIVE STREAMING</Typography>
          {/* 라이브 스트리밍 리스트 */}
          <div className={classes.liveContainer}>
            { !ContractedCreatorList.loading && ContractedCreatorList.data && !LiveCreatorList.loading && LiveCreatorList.data && (
              LiveCreator?.map((row) => (
                <div className={classes.liveCreatorWrapper} key={shortid.generate()} style={{backgroundImage: `${getRandomColors(COLORS)}`}}>
                  <a href={`https://www.twitch.tv/${row}`} className={classes.liveCreator}>
                    <img
                      src={row.creatorLogo}
                      alt="creatorLogo"
                      className={classes.liveCreator}
                      onError={(e) => { e.currentTarget.src = '/pngs/logo/onad_logo_vertical_small.png'; }}
                    >
                    </img>
                  </a>
                </div>
              ))
            )}
            <div>
            </div>
          </div>

          {/* 전체 크리에이터 리스트 */}
          <div>
            <Table
              columns={[
                { 
                  title: '크리에이터명',
                  field: 'creatorName',
                  render: (rowData): JSX.Element => (
                    <div className={classes.columnWrapper}>
                      <div className={classes.creatorLogoWrapper} key={shortid.generate()} style={{backgroundImage: `${getRandomColors(COLORS)}`}}>
                        <img
                          src={rowData.creatorLogo}
                          alt="creatorLogo"
                          className={classes.creatorLogo}
                          onError={(e) => { e.currentTarget.src = '/pngs/logo/onad_logo_vertical_small.png'; }}
                        />
                      </div>
                      <Typography variant="subtitle1" className={classes.columnText}>{rowData.creatorName}</Typography>
                    </div>
                  )
                },
                {
                  title: '팔로워수',
                  field: 'followers',
                  render: (rowData): JSX.Element => (
                    <Typography variant="subtitle1" align="center" className={classes.columnText}>
                      {rowData.followers}
                    </Typography>),
                },
                {
                  title: '컨텐츠',
                  field: 'content',
                  render: (rowData): JSX.Element => (
                    <Typography variant="subtitle1" align="center" className={classes.columnText}>
                      {rowData.content}
                    </Typography>
                  )
                },
                {
                  title: '주방송시간',
                  field: 'openHour',
                  render: (rowData): JSX.Element => (
                    <Typography variant="subtitle1" align="center" className={classes.columnText}>
                      {rowData.openHour}
                    </Typography>
                  )
                },
              ]}
              data={ContractedCreatorList.data || []}
              isLoading={ContractedCreatorList.loading || false}
              components={{
                Pagination: (props) => (
                  <TablePagination
                    {...props}
                  />
                )
              }}
              options={{
                search: true,
                pageSize: 7,
                pageSizeOptions: [],
                searchFieldAlignment: 'right',
                headerStyle: { textAlign: 'center', fontWeight: 700, fontSize: 25 },
                draggable: false,
                paginationType: 'stepped',
                showTitle: false,
                toolbar: true,
                loadingType: 'linear',
                searchFieldStyle: {borderRadius: 8, backgroundColor:'#f4f4f4'}
              }}
              style={{
                boxShadow: 'none'
              }}
            />
          </div>
        </div>
        <AppFooter />
      </div>
      <RePasswordDialog
        repasswordOpen={repasswordOpen}
        setRepassword={setRepassword}
        logout={logout}
      />
    </div>
  );
});
