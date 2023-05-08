import { AddressBar } from '@/components';
import { EditorQueryGraphQL } from '@/components/editor-query/editor-query';
import { EditorResponse } from '@/components/editor-response/editor-response';
import { useAppContext } from '@/provider';
import { useModalDialog } from '@/provider/modal-dialog';
import {
  StoreStatus,
  changeEndpoint,
  selectEditorsData,
  selectMainData,
  sendQueryGQL,
} from '@/slices';
import { useAppDispatch } from '@/store';
import { Button, CircularProgress, Container, Grid, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DocumentPageComponent } from '../document-page/document-page';

export const Main = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { hide, showDialog } = useModalDialog();

  const mainState = useSelector(selectMainData);
  const editorState = useSelector(selectEditorsData);
  const { apiClient } = useAppContext();
  const notifyError = (message: string) => toast(message, { type: 'error' });

  const onEndPointChange = (newendpoint: string) => {
    hide();
    dispatch(changeEndpoint({ endpoint: newendpoint }));
  };

  const changeEndpointClick = () => {
    showDialog(<AddressBar onChanged={onEndPointChange} initialAddress={mainState.endpoint} />, {});
  };

  async function sendQueryClick() {
    if (apiClient)
      dispatch(
        sendQueryGQL({
          client: apiClient,
          endpoint: mainState.endpoint,
          query: editorState.query,
          variables: editorState.parameters,
        })
      )
        .unwrap()
        .catch((rejectedValueOrSerializedError: string) => {
          notifyError(rejectedValueOrSerializedError);
        });
  }

  const processing = editorState.apiStatus == StoreStatus.loading;
  const errors = !(editorState?.queryError === undefined);

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
          <EditorQueryGraphQL />
        </Grid>
        <Grid item xs={12} md={4} borderColor={'red'} border={'1px solid'}>
          {processing && <CircularProgress size={'1.5rem'} />}
          <Typography variant="inherit">{editorState.queryError}</Typography>
          <Button
            variant="contained"
            size="medium"
            onClick={sendQueryClick}
            disabled={processing || errors}
          >
            Send query
          </Button>
        </Grid>
        <Grid item xs={12} md={4} borderColor={'red'} border={'1px solid'}>
          <EditorResponse />
        </Grid>
      </Grid>
    </Container>
  );
};
