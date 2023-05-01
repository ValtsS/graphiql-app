import { Button, TextField } from '@mui/material';
import React, { useCallback, useState } from 'react';

interface AddressBarProps {
  onChanged?: (newendpoint: string) => void;
  initialAddress: string;
}

export const AddressBar = (props: AddressBarProps) => {
  const [currentAddr, setAddr] = useState<string>(props.initialAddress);

  const change = useCallback(() => {
    if (props.onChanged) props.onChanged(currentAddr);
  }, [props, currentAddr]);

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
        defaultValue={currentAddr}
        fullWidth={true}
        onChange={onAddrChange}
        onKeyDown={handleKeyPress}
      />
      <Button variant="contained" size="medium" onClick={() => change()}>
        Apply
      </Button>
    </>
  );
};
