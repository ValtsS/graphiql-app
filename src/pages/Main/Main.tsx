import { AddressBar, EditorsBlock } from '@/components';
import { useModalDialog } from '@/provider/modal-dialog';
import { changeEndpoint, selectMainData } from '@/slices';
import { useAppDispatch } from '@/store';
import { Button, Container, Grid, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { DocumentPageComponent } from '../document-page/document-page';

export const Main = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { hide, showDialog } = useModalDialog();

  const mainState = useSelector(selectMainData);

  const onEndPointChange = (newendpoint: string) => {
    hide();
    dispatch(changeEndpoint({ endpoint: newendpoint }));
  };

  const changeEndpointClick = () => {
    showDialog(<AddressBar onChanged={onEndPointChange} initialAddress={mainState.endpoint} />, {});
  };

  return (
    <Container>
      <Grid item xs={12}>
        <Button variant="contained" size="medium" onClick={changeEndpointClick}>
          Change Endpoint
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Grid item xs={12} md={4} borderColor={'red'} border={'1px solid'}>
          <Typography variant="h6">{mainState.endpoint}</Typography>
          <DocumentPageComponent />
        </Grid>
        <Grid item xs={12} md={4} borderColor={'red'} border={'1px solid'}>
          Query
        </Grid>
        <Grid item xs={12} md={4} borderColor={'red'} border={'1px solid'}>
          result
        </Grid>
      </Grid>
      <EditorsBlock />
    </Container>
  );
};
