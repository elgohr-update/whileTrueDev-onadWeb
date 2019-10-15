import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import classnames from 'classnames';
// @material-ui/core components
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Table, TableHead, TableRow, TableBody, TableCell, Grid, Typography, Divider, Hidden
} from '@material-ui/core';
// custom table component
import DateRange from '@material-ui/icons/DateRange';
import CustomTableFooter from '../../../../atoms/Table/TableFooter';
// core components
import tableStyle from '../../../../assets/jss/onad/components/tableStyle';
import StyledItemText from '../../../../atoms/StyledItemText';

const useStyles = makeStyles(theme => ({
  stats: {
    color: '#999',
    display: 'inline-flex',
    fontSize: '14px',
    lineHeight: '22px',
    '& svg': {
      width: '20px',
      height: '20px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      top: '4px',
      fontSize: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  head: {
    fontWeight: '500',
    color: '#455a64',
  },
  unit: {
    fontWeight: '700',
    marginLeft: '3px'
  },
  level: {
    fontWeight: '700',
    marginLeft: '3px'
  },
  grid: {
    justifyContent: 'center',
    // alignItems: 'center'
  },
  textCell: {
    textAlign: 'left'
  },
  cash: {
    fontSize: '1.8rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.3rem'
    }
  }
}));

const stateDic = {
  1: '⏱ 진행중',
  0: '✔️ 완료',
};
function BannerTable({ ...props }) {
  const {
    classes, tableData, tableHeaderColor,
  } = props;
  const innerClasses = useStyles();
  const [page, setPage] = React.useState(0); // 테이블 페이지
  const [rowsPerPage, setRowsPerPage] = React.useState(5); // 테이블 페이지당 행
  const emptyRows = rowsPerPage - Math.min(
    rowsPerPage, tableData.length - page * rowsPerPage,
  );

  // page handler
  function handleChangeTablePage(event, newPage) {
    setPage(newPage);
  }
  // page per row handler
  function handleChangeTableRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
  }

  const tableHead = ['광고주 / 시작일', '배너이미지', '수익', '배너 및 광고주 설명', ''];
  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        <TableHead className={classes[`${tableHeaderColor}TableHeader`]}>
          <TableRow>
            <Hidden mdDown>
              {tableHead.map(value => (
                <TableCell
                  className={`${classes.tableCell} ${classes.tableHeadCell}`}
                  key={shortid.generate()}
                >
                  {value}
                </TableCell>
              ))}
            </Hidden>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(bannerData => (
            <TableRow hover key={shortid.generate()}>
              <Hidden mdDown>
                <TableCell className={classes.tableCell}>
                  <Grid container direction="column" justify="center">
                    <Grid item className={innerClasses.flex}>
                      <Typography gutterBottom variant="h6" style={{ fontWeight: 700 }}>{bannerData.marketerName}</Typography>
                    </Grid>
                    <Grid item>
                      <div className={classnames(innerClasses.stats, innerClasses.flex)}>
                        <DateRange />
                        <Typography gutterTop variant="body2" className={innerClasses.head}>
                          {bannerData.date}
                          {' '}
                        ~
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item className={innerClasses.flex} style={{ marginTop: '10px' }}>
                      <Typography variant="body2" style={{ fontWeight: 700 }}>{stateDic[bannerData.state]}</Typography>
                    </Grid>
                  </Grid>
                </TableCell>
              </Hidden>
              <TableCell className={classes.imgCell}>
                <div className={innerClasses.flex}>
                  <img src="/pngs/landing/background-whale.jpg" alt="banner" style={{ maxHeight: '200px', width: '100%' }} />
                </div>
              </TableCell>
              <TableCell className={classes.tableCell}>
                <div className={innerClasses.flex}>
                  <Typography gutterBottom variant="h7" className={innerClasses.head}>총 수익</Typography>
                </div>
                <div className={innerClasses.flex}>
                  <Typography gutterBottom className={innerClasses.cash}>
                    {`${bannerData.cash} `}
                  </Typography>
                  <Typography gutterBottom variant="body2" className={innerClasses.unit}>
                      원
                  </Typography>
                </div>
                <Hidden mdDown>
                  <Grid container direction="row" spacing={5} className={innerClasses.grid}>
                    <Grid item>
                      <div className={innerClasses.flex}>
                        <Typography gutterBottom variant="body1" className={innerClasses.head}>배너광고 수익</Typography>
                      </div>
                      <div className={innerClasses.flex}>
                        <Typography gutterBottom variant="h5">
                          {`${bannerData.CPM} `}
                        </Typography>
                        <Typography gutterBottom variant="body2" className={innerClasses.unit}>
                        원
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item>
                      <Divider component="hr" orientation="vertical" />
                    </Grid>
                    <Grid item>
                      <Grid container className={innerClasses.flex}>
                        <Grid item>
                          <Typography gutterBottom variant="body1" className={innerClasses.head}>랜딩페이지 수익</Typography>
                        </Grid>
                      </Grid>
                      <div className={innerClasses.flex}>
                        <Typography gutterBottom variant="h5">
                          {`${bannerData.CPC} `}
                        </Typography>
                        <Typography gutterBottom variant="body2" className={innerClasses.unit}>
                        원
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </Hidden>
              </TableCell>
              <Hidden mdDown>
                <TableCell className={classes.tableCell}>
                  <Grid container direction="column" spacing={1}>
                    <Grid item className={innerClasses.textCell}>
                      <StyledItemText primary="광고주 소개" fontSize="15px" />
                      {bannerData.companyDescription.split('\n').map(row => (
                        <Typography variant="body2" key={shortid.generate()}>
                          {row}
                        </Typography>
                      ))}
                    </Grid>
                    <Grid item>
                      <Divider component="hr" orientation="horizental" width="90%" />
                    </Grid>
                    <Grid item className={innerClasses.textCell}>
                      <StyledItemText primary="배너 소개" fontSize="15px" />
                      {bannerData.bannerDescription.split('\n').map(row => (
                        <Typography variant="body2" key={shortid.generate()}>
                          {row}
                        </Typography>
                      ))}
                    </Grid>
                  </Grid>
                </TableCell>
              </Hidden>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 48 * emptyRows }} key={shortid.generate()}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <CustomTableFooter
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangeTablePage={handleChangeTablePage}
          handleChangeTableRowsPerPage={handleChangeTableRowsPerPage}
        />
      </Table>
    </div>
  );
}

BannerTable.defaultProps = {
  tableHeaderColor: 'gray',
  pagination: false,
};

BannerTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    'warning',
    'primary',
    'danger',
    'success',
    'info',
    'rose',
    'gray',
    'blueGray',
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  )).isRequired,
  pagination: PropTypes.bool,
};


export default withStyles(tableStyle)(BannerTable);
