import { AddressBar, DocAccordeon, EditorQueryGraphQL, EditorResponse } from '@/components';
import { VariableAccordeon } from '@/components/var-accordeon/var-acoordeon';
import { QUERY_EDITOR_UUID } from '@/core/consts';
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
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import { Box, Button, CircularProgress, Grid, IconButton, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

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
    <Box sx={{ padding: '8px', background: '#00999924', borderRadius: '8px', mb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', m: '10px 0 20px 0' }}>
        <Typography
          variant="h6"
          sx={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            background: '#00999929',
            width: 'fit-content',
            padding: '5px',
            borderRadius: '5px 0px 0px 5px',
            fontSize: '14px',
          }}
        >
          {mainState.endpoint}
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={changeEndpointClick}
          sx={{ borderRadius: '0px 5px 5px 0px' }}
        >
          {t('Change')}
        </Button>
        <IconButton
          onClick={sendQueryClick}
          disabled={processing || errors}
          color="inherit"
          sx={{ p: 0, ml: '15px' }}
          data-testid="send-query-button"
        >
          <PlayCircleFilledWhiteOutlinedIcon fontSize="large" />
        </IconButton>
      </Box>

      <DocAccordeon />

      <Grid
        container
        spacing={1}
        sx={{ width: { xs: '100%', sm: '100%', md: 'auto' }, m: '0 auto' }}
      >
        <Grid item xs={12} md={6}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <EditorQueryGraphQL
                uuid={QUERY_EDITOR_UUID}
                sx={{ minHeight: { xs: '10vh', sm: '20vh', md: '50vh' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <VariableAccordeon sx={{ minHeight: { xs: '10vh', sm: '20vh', md: '50vh' } }} />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          {processing && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '40%',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            >
              <CircularProgress size={'5rem'} />
            </div>
          )}
          <EditorResponse sx={{ minHeight: { xs: '10vh', sm: '20vh', md: '50vh' } }} />
          <Box>
            <Typography variant="inherit" marginBottom={'4%'} marginTop={'1%'}>
              {editorState.queryError}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
