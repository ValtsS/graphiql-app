import { changeEndpoint, selectMainData } from '@/slices/main/mainSlice';
import { useAppDispatch } from '@/store';
import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export const AddressBar = () => {
  const dispatch = useAppDispatch();
  const mainState = useSelector(selectMainData);

  const [currentAddr, setAddr] = useState<string>(mainState.endpoint);

  function change() {
    dispatch(changeEndpoint({ endpoint: currentAddr }));
  }

  const onAddrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddr(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      change();
    }
  };

  return (
    <>
      <TextField
        defaultValue={mainState.endpoint}
        fullWidth={true}
        onChange={onAddrChange}
        onKeyDown={handleKeyPress}
      />
      <Button variant="contained" size="medium" onClick={() => change()}>
        Load
      </Button>
    </>
  );
};
