import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';
import ReChartBar from '../../../atoms/Chart/ReChartBar';
import useFetchData from '../../../utils/lib/hooks/useFetchData';

export default function TimeChart(props) {
  const { creatorId } = props;
  const data = useFetchData('/api/dashboard/marketer/creatordetail/hours', { creatorId });

  return (
    <div>
      {data.loading && (
        <Skeleton height={400} />
      )}
      {!data.loading && data.payload && (
      <ReChartBar
        containerHeight={400} // 차트를 둘러싼 컴포넌트의 높이
        chartWidth={400} // 차트 넓이
        chartHeight={350} // 차트 높이
        data={data.payload.timeGraphData.data} // hours 기반오름차순 정렬된 데이터셋
        nopreprocessing // 전처리함수 사용하지 않을 때.
        dataKey="sumtime" // 막대로 보여질 데이터의 키값
        xAxisDataKey="hours" // x축 키값
        yAxisDataKey="sumtime" // y축 키값
        tooltipFormatter={value => [value, '비율']} // 툴팁 포맷
        tooltipLabelFormatter={value => [value, ' 시']} // 툴팁 라벨 포맷
        legend={false} // 범례 있냐 없냐
      />
      )}
    </div>
  );
}

TimeChart.propTypes = {
  creatorId: PropTypes.string.isRequired
};