import { useAppContext } from '@/provider/app-context-provider/app-context-provider';
import { useModalDialog } from '@/provider/modal-dialog';
import { selectMainData } from '@/slices/main/mainSlice';
import { fetchSchema } from '@/slices/schema/schema';
import { useAppDispatch } from '@/store';
import { Button, Container, Grid, Typography } from '@mui/material';
import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DocumentPageComponent } from '../document-page/document-page';
import { AddressBar } from '@/components';
import { toast } from 'react-toastify';

export const Main = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { hide, showDialog } = useModalDialog();

  const mainState = useSelector(selectMainData);
  const { apiClient } = useAppContext();

  const notifyError = (message: string) => toast(message, { type: 'error' });

  useEffect(() => {
    if (mainState.endpoint.length > 0 && apiClient)
      dispatch(
        fetchSchema({
          client: apiClient,
          endpoint: mainState.endpoint,
        })
      )
        .unwrap()
        .catch((rejectedValueOrSerializedError) => {
          notifyError(rejectedValueOrSerializedError);
        });
  }, [mainState, dispatch, apiClient]);

  const changeEndpoint = () => {
    showDialog(<AddressBar onChanged={hide} />, {});
  };

  return (
    <Container>
      <Grid item xs={12}>
        <Button variant="contained" size="medium" onClick={changeEndpoint}>
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
    </Container>
  );
};
