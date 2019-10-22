import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Paper, Divider, Button
} from '@material-ui/core';
import Help from '@material-ui/icons/Help';
import shortid from 'shortid';
import StyledItemText from '../../../atoms/StyledItemText';
import GreenCheckBox from '../../../atoms/GreenCheckBox';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: '0px',
    alignItem: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
    marginBottom: theme.spacing(2),
  },
  choice: {
    width: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  button: {
    width: '100%',
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const CategorySelect = (props) => {
  const {
    setStepComplete, categoryList, checkedCategories, checkedCategoriesDispatch
  } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    if (checkedCategories.length >= 3) {
      setStepComplete(true);
    } else {
      setStepComplete(false);
    }
  }, [checkedCategories, setStepComplete]);

  const handlePopoverOpen = () => (event) => {
    setAnchorEl(event.currentTarget);
  };

  const getChecked = categoryName => checkedCategories.includes(categoryName);

  const handleChecked = (event) => {
    const categoryName = event.target.name;
    if (getChecked(categoryName)) {
      checkedCategoriesDispatch({ type: 'delete', value: categoryName });
    } else {
      checkedCategoriesDispatch({ type: 'push', value: categoryName });
    }
  };


  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <Grid container direction="column" spacing={2}>
          <Grid item className={classes.item}>
            <StyledItemText primary="넷째,&nbsp;&nbsp; 카테고리 선택" secondary="해당 캠페인의 배너가 송출될 배너를 3개 이상 선택하세요." className={classes.label} />
            <Divider component="hr" style={{ height: '2px' }} />
          </Grid>
          <Grid item>
            <Grid container direction="row" spacing={2}>
              {categoryList.map((category, i) => (
                <Grid item xs={12} sm={3} key={shortid.generate()}>
                  <Button className={classes.button}>
                    <Paper className={classes.choice}>
                      <Grid container direction="row" justify="space-between" spacing={2}>
                        <Grid item>
                          <GreenCheckBox
                            checked={getChecked(category.categoryName)}
                            fontSize="large"
                            style={{ padding: '3px' }}
                            onClick={handleChecked}
                            name={category.categoryName}
                          />
                        </Grid>
                        <Grid item>
                          <Grid container direction="row" spacing={1}>
                            <Grid item>
                              <StyledItemText primary={category.categoryName} />
                            </Grid>
                            <Grid
                              item
                              className={classes.icon}
                            >
                              <Help
                                fontSize="small"
                                onMouseEnter={handlePopoverOpen(i)}
                                onMouseLeave={handlePopoverClose}
                                aria-owns={anchorEl ? 'send-desc-popover' : undefined}
                                aria-haspopup="true"
                                color="disabled"
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Button>
                </Grid>

              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CategorySelect;
