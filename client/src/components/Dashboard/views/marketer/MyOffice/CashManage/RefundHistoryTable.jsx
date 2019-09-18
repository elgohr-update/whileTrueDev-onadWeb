import React from 'react';
import PropTypes from 'prop-types';
// core
import withStyles from '@material-ui/core/styles/withStyles';
// own components
import Card from '../../../../components/Card/Card';
import CardHeader from '../../../../components/Card/CardHeader';
import CardBody from '../../../../components/Card/CardBody';
import Table from '../../../../components/Table/Table';
import DashboardStyle from '../../../../assets/jss/onad/views/dashboardStyle';
// hooks
import useFetchData from '../../../../lib/hooks/useFetchData';

const initialData = {
  columns: ['날짜', '환불금액', '진행상황'],
  data: [['-', '-', '-']],
};

function RefundHistory(props) {
  const { classes } = props;

  const { payload, loading } = useFetchData('/api/dashboard/marketer/cash/refund/list');
  // 충전 및 환불 페이지네이션
  const [page, setPage] = React.useState(0); // 테이블 페이지
  const [rowsPerPage, setRowsPerPage] = React.useState(5); // 테이블 페이지당 행
  const emptyRows = rowsPerPage - Math.min(
    rowsPerPage, initialData.data.length - page * rowsPerPage,
  );
  // page handler
  function handleChangeTablePage(event, newPage) {
    setPage(newPage);
  }
  // page per row handler
  function handleChangeTableRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
  }


  return (
    <Card>
      <CardHeader color="blueGray">
        <h4 className={classes.cardTitleWhite}>
          환불내역
        </h4>
      </CardHeader>
      <CardBody>
        <Table
          tableHeaderColor="danger"
          tableHead={initialData.columns}
          tableData={loading ? initialData.data : payload.data}
          pagination
          handleChangeTablePage={handleChangeTablePage}
          handleChangeTableRowsPerPage={handleChangeTableRowsPerPage}
          emptyRows={emptyRows}
          rowsPerPage={rowsPerPage}
          page={page}
        />
      </CardBody>


    </Card>
  );
}

RefundHistory.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(DashboardStyle)(RefundHistory);
