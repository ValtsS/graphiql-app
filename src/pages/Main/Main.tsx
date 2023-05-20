import { AddressBar } from '@/components';
import { EditorQueryGraphQL } from '@/components/editor-query/editor-query';
import { EditorResponse } from '@/components/editor-response/editor-response';
import { EditorVariables } from '@/components/editor-variables/editor-variables';
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
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DocumentPageComponent } from '../document-page/document-page';
import { QUERY_EDITOR_UUID, VARIABLE_EDITOR_UUID } from '@/core/consts';
import { useTranslation } from 'react-i18next';

export const Main = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { hide, showDialog } = useModalDialog();
  const { t } = useTranslation();

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
          variables: editorState.variables,
        })
      )
        .unwrap()
        .catch((rejectedValueOrSerializedError: string) => {
          notifyError(rejectedValueOrSerializedError);
        });
  }

  const processing = editorState.apiStatus == StoreStatus.loading;
  const errors = editorState?.queryError !== undefined;

  return (
    <Grid container>
      <Grid item xs={12} md={4} borderColor={'red'} border={'1px solid'}>
        <EditorVariables uuid={VARIABLE_EDITOR_UUID} />
      </Grid>
      <Grid item xs={12} md={4} borderColor={'red'} border={'1px solid'}>
        <EditorQueryGraphQL uuid={QUERY_EDITOR_UUID} />
      </Grid>
      <Grid item xs={12} md={4} borderColor={'red'} border={'1px solid'}>
        <Typography variant="h6" sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {mainState.endpoint}
        </Typography>
        <Grid container sx={{ justifyContent: 'space-around' }}>
          <Grid item xs={4} sx={{ display: 'flex' }}>
            <Button
              variant="contained"
              size="small"
              onClick={sendQueryClick}
              disabled={processing || errors}
            >
              {t('Query')}
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" size="small" onClick={changeEndpointClick}>
              {t('Change')}
            </Button>
          </Grid>

          <Grid item xs={12} mt={2}>
            <Box sx={{ pl: '1rem', background: 'white' }}>
              <DocumentPageComponent />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} borderColor={'red'} border={'1px solid'}>
        {processing && <CircularProgress size={'1.5rem'} />}
        <Typography variant="inherit">{editorState.queryError}</Typography>
      </Grid>
      <Grid item xs={12} borderColor={'red'} border={'1px solid'}>
        <EditorResponse />
      </Grid>
    </Grid>
  );
};
