import React from 'react';
import shortid from 'shortid';
// core ../../../atoms
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
// material-ui icons

import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import Card from '../../../atoms/Card/Card';
import CardHeader from '../../../atoms/Card/CardHeader';
import CardBody from '../../../atoms/Card/CardBody';


const useButtonStyle = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
    borderRadius: 3,
    border: 0,
    padding: '0 30px',
    boxShadow: theme.shadows[3],
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  label: {
    flexDirection: 'column',
  },
}));

const Select = (props) => {
  const {
    classes, handleButton, activeStep, sources,
  } = props;
  const buttonClasses = useButtonStyle();
  const doneIndex = activeStep - 1;

  return (
    <Card>
      <CardHeader>
        <h4 className={classes.cardTitleWhite}>이용 안내</h4>
        <p className={classes.cardCategoryWhite}>처음이시라면, 순서대로 진행해주세요.</p>
      </CardHeader>

      <CardBody>
        <Stepper orientation="vertical" activeStep={doneIndex}>
          { sources.map((source, index) => (
            <Step key={shortid.generate()}>
              <StepLabel>
                <Button
                  onClick={() => handleButton(index + 1)}
                  variant="outlined"
                  classes={{
                    root: buttonClasses.root, // class name, e.g. `classes-nesting-root-x`
                    label: buttonClasses.label, // class name, e.g. `classes-nesting-label-x`
                  }}
                >
                  <source.icon style={{ marginTop: 10 }} />
                  <p>{source.label}</p>
                </Button>
              </StepLabel>
            </Step>
          ))}

        </Stepper>
      </CardBody>

    </Card>
  );
};

export default withStyles(dashboardStyle)(Select);