import { AddressBar } from '@/components';
import { EditorQueryGraphQL } from '@/components/editor-query/editor-query';
import { useModalDialog } from '@/provider/modal-dialog';
import { changeEndpoint, selectEditorsData, selectMainData, setResponse } from '@/slices';
import { useAppDispatch } from '@/store';
import { Button, Container, Grid, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { DocumentPageComponent } from '../document-page/document-page';
import { EditorResponse } from '@/components/editor-response/editor-response';
import { DefaultApiClient } from '@/core/api/api-client';
import { sendQuery } from '@/core/api/api';

export const Main = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { hide, showDialog } = useModalDialog();

  const mainState = useSelector(selectMainData);
  const editorState = useSelector(selectEditorsData);

  const onEndPointChange = (newendpoint: string) => {
    hide();
    dispatch(changeEndpoint({ endpoint: newendpoint }));
  };

  const changeEndpointClick = () => {
    showDialog(<AddressBar onChanged={onEndPointChange} initialAddress={mainState.endpoint} />, {});
  };

  async function sendQueryClick() {
    const dummy = await sendQuery(
      new DefaultApiClient(),
      mainState.endpoint,
      editorState.query,
      JSON.parse(editorState.parameters)
    ).catch(console.error);

    dispatch(setResponse({  responseText : dummy  ?? ''}));

    console.log(dummy);


  }

  return (
    <Container>
      <Grid item xs={12}>
        <Button variant="contained" size="medium" onClick={changeEndpointClick}>
          Change Endpoint
        </Button>
        <Button variant="contained" size="medium" onClick={sendQueryClick}>
          Send query
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
          <EditorResponse />
        </Grid>
      </Grid>
    </Container>
  );
};
