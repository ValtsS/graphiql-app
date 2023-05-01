import { selectMainData } from '@/slices/main/mainSlice';
import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export const AddressBar = ({ onChanged }: { onChanged?: (newendpoint: string) => void }) => {
  const mainState = useSelector(selectMainData);

  const [currentAddr, setAddr] = useState<string>(mainState.endpoint);

  function change() {
    if (onChanged) onChanged(currentAddr);
  }

  const onAddrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddr(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
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
        Change
      </Button>
    </>
  );
};
