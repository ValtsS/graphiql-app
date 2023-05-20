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
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { QUERY_EDITOR_UUID, VARIABLE_EDITOR_UUID } from '@/core/consts';
import { useTranslation } from 'react-i18next';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DocumentPageComponent } from '../document-page/document-page';

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
      {/* panel */}
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
        >
          <PlayCircleFilledWhiteOutlinedIcon fontSize="large" />
        </IconButton>
      </Box>

      <Accordion
        sx={{
          mb: '5px',
          borderRadius: '8px',
          '&:before': {
            display: 'none',
          },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('Documentation')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography></Typography>
          <DocumentPageComponent />
        </AccordionDetails>
      </Accordion>
      {/* panel end */}
      <Grid
        container
        spacing={1}
        sx={{ width: { xs: '230px', sm: '500px', md: 'auto' }, m: '0 auto' }}
      >
        <Grid item xs={12} md={6}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <EditorQueryGraphQL uuid={QUERY_EDITOR_UUID} />
            </Grid>
            <Grid item xs={12}>
              <EditorVariables uuid={VARIABLE_EDITOR_UUID} />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <EditorResponse />
          {processing && <CircularProgress size={'1.5rem'} />}
          <Typography variant="inherit" mb={'10%'}>
            {editorState.queryError}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
