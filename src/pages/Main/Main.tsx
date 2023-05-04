import { AddressBar } from '@/components/address-bar/address-bar';
import { useAppContext } from '@/provider/app-context-provider/app-context-provider';
import { selectMainData } from '@/slices/main/mainSlice';
import { fetchSchema } from '@/slices/schema/schema';
import { useAppDispatch } from '@/store';
import { Container } from '@mui/material';
import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DocumentPageComponent } from '../document-page/document-page';
import Grid from '@mui/material/Grid';
import EditorsBlock from '@/components/editorsBlock/editorsBlock';

export const Main = (): ReactElement => {
  const dispatch = useAppDispatch();

  const mainState = useSelector(selectMainData);
  const { apiClient } = useAppContext();

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
          console.error('caughtrejected=', rejectedValueOrSerializedError);
        });
  }, [mainState, dispatch, apiClient]);

  return (
    <Container>
      <Grid item xs={12}>
        <AddressBar />
      </Grid>
      <Grid item xs={12}>
        <Grid item xs={12} md={4} borderColor={'red'} border={'1px solid'}>
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
{
}
