import React, { useEffect, useState } from 'react';
// for Link tag component
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import Button from '../../../components/CustomButtons/Button';
// core ../../../components
import dashboardStyle from '../../../assets/jss/onad/views/dashboardStyle';
import PasswordForm from './PasswordForm';
import UserDataForm from './UserDataForm';

// 마케터 유저 프로필 및 개인정보 수정 페이지
const UserProfile = (props) => {
  const { classes } = props;

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <UserDataForm />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <PasswordForm />
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>
                추가할 수정사항
                  </h4>
                  <p className={classes.cardCategoryWhite}>변경할 비밀번호를 입력하세요.</p>
                </CardHeader>
                <CardBody />
                <CardFooter>
                  <Button type="submit" value="Submit" color="primary">확인</Button>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>

        </GridItem>
      </GridContainer>
    </div>
  );
};

export default withStyles(dashboardStyle)(UserProfile);