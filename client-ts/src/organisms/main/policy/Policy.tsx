import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TabBar from '../Introduction/TabBar';
import PolicyMarketer from './PolicyMarketer';
import PolicyCreator from './PolicyCreator';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 70,
  },
}));

function Policy(): JSX.Element {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleTabChange(event: React.ChangeEvent<{}>, newValue: number): void {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <TabBar
        tabValue={value}
        handleTabChange={handleTabChange}
      />

      {value === 0 ? (
        // 마케터
        <PolicyMarketer />
      )
        : (
          <PolicyCreator />
        )}


    </div>
  );
}

export default Policy;
