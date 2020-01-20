import React from 'react';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

export default function ReportLoading() {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={3}>
              <Skeleton variant="rect" height={180} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Skeleton variant="rect" height={180} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Skeleton variant="rect" height={180} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Skeleton variant="rect" height={180} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Skeleton variant="rect" height={100} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rect" height={200} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rect" height={200} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={9}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Skeleton variant="rect" height={500} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rect" height={400} />
            </Grid>

          </Grid>
        </Grid>


      </Grid>

    </div>
  );
}
