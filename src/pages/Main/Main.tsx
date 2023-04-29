import { AddressBar } from '@/components/address-bar/address-bar';
import { DefaultApiClient } from '@/core/api/api-client';
import { selectMainData } from '@/slices/main/mainSlice';
import { fetchSchema } from '@/slices/schema/schema';
import { useAppDispatch } from '@/store';
import { Container, Grid } from '@mui/material';
import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DocumentPage } from '../document-page/document-page';

export const Main = (): ReactElement => {
  const dispatch = useAppDispatch();

  const mainState = useSelector(selectMainData);

  useEffect(() => {
    if (mainState.endpoint.length > 0)
      dispatch(
        fetchSchema({
          client: new DefaultApiClient(),
          endpoint: mainState.endpoint,
        })
      )
        .unwrap()
        .catch((rejectedValueOrSerializedError) => {
          console.error('caughtrejected=', rejectedValueOrSerializedError);
        });
  }, [mainState, dispatch]);

  return (
    <Container>
      <Grid item xs={12}>
        <AddressBar />
      </Grid>
      <Grid item xs={12}>
        <Grid item xs={12} md={4} borderColor={'red'} border={'1px solid'}>
          <DocumentPage />
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
