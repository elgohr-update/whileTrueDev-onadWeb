import React from 'react';

// core ../../../components
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import GridContainer from '../../../components/Grid/GridContainer';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardFooter from '../../../components/Card/CardFooter';
// material-ui

//
import broadCastingIcon from '../../../assets/img/broadcasting.svg';

const stepperStyles = makeStyles(theme => ({
  root: {
    float: 'right',
  },
  img: {
    height: 255,
    display: 'block',
    maxWidth: 400,
    overflow: 'hidden',
    width: '100%',
    float: 'right',
  },
}));
const ContractManual = (props) => {
  const { classes } = props;
  const StepperClasses = stepperStyles();

  return (
    <GridContainer>
      <Card>
        <CardHeader color="blueGray" stats>
          <h6 className={classes.cardTitleWhite}>
            {'OnAD 플랫폼과 계약하고 싶어요.'}
          </h6>
          <p className={classes.cardCategoryWhite}>
            {'OnAD 플랫폼과 계약할 수 있습니다. 서비스 이용약관과 개인정보 수집에 동의 해주십시오.'}
          </p>
        </CardHeader>

        <Stepper orientation="vertical">
          <Step active="true">
            <StepLabel>대쉬보드에서 계약하러 가기 알림창을 클릭합니다.</StepLabel>
            <StepContent>
              <a>
                <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
              </a>
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              {'계정 관리에 있는 서비스 이용 및 출금 계약하기의'}
              <br />
              <strong>서비스 이용약관</strong>
              {'과'}
              <strong>개인 정보 수집 및 동의</strong>
              {'약관보기를 클릭합니다.'}
              <br />
              <b>+</b>
              {'내용을 읽고'}
              <strong>모두 동의</strong>
              {'를 클릭합니다.'}
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              {'모두 동의가 되면 체크박스가 2개 생겨요.'}
              <br />
              {'마지막으로'}
              <strong>확인</strong>
              {'버튼을 클릭해 주세요.'}
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              {'완료된 계약서는 계정관리 -> 크리에이터님의 정보란의'}
              <br />
              <strong>계약완료</strong>
              {'를 눌러 확인 가능합니다.'}
            </StepLabel>
            <StepContent>
              <img src={broadCastingIcon} alt="" className={StepperClasses.img} />
            </StepContent>
          </Step>
          <Step active="true">
            <StepLabel>
              {'OnAD 플랫폼과 크리에이터님의 이용계약이 완료되었습니다.'}
              <br />
              {'매칭된 광고를 통해 수익을 창출해보세요. :)'}
            </StepLabel>
          </Step>
        </Stepper>
        <CardFooter>
          {'이해가 잘 안되시거나, 문의사항이 있으시면 고객센터로 문의해주세요.'}
        </CardFooter>
      </Card>
    </GridContainer>
  );
};

export default withStyles(stepperStyles)(ContractManual);