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
import { Box, Button, CircularProgress, Grid, IconButton, Typography } from '@mui/material';
import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { QUERY_EDITOR_UUID, VARIABLE_EDITOR_UUID } from '@/core/consts';
import { useTranslation } from 'react-i18next';
import useAuth from '@/custom-hooks/useAuth';
import { useNavigate } from 'react-router';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import { LeftDrawer } from '../../components/leftDrawer/leftDrawer';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';

export const Main = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { hide, showDialog } = useModalDialog();
  const { t } = useTranslation();

  const mainState = useSelector(selectMainData);
  const editorState = useSelector(selectEditorsData);
  const { apiClient } = useAppContext();
  const notifyError = (message: string) => toast(message, { type: 'error' });

  const { auth } = useAppContext();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) return;
    if (!currentUser) navigate('/');
  }, [auth, navigate, currentUser]);

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

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ padding: '8px', background: '#00999924', borderRadius: '8px', mb: 5 }}>
      {/* panel */}
      <Grid container>
        <Grid item md={0.5}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <LibraryBooksOutlinedIcon />
          </IconButton>
        </Grid>
        <Grid item md={11}>
          <LeftDrawer open={open} setOpen={setOpen} />
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

          <Grid item xs={4} sx={{ display: 'flex' }}></Grid>
          {/* panel end */}
          <Grid container spacing={1}>
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
            <Grid item xs={12} md={6}>
              {processing && <CircularProgress size={'1.5rem'} />}
              <Typography variant="inherit">{editorState.queryError}</Typography>
              <EditorResponse />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
