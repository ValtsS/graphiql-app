import { DocumentPageComponent } from '@/pages/document-page/document-page';
import { selectSchemaData, StoreStatus } from '@/slices';
import {
  Accordion,
  AccordionSummary,
  Typography,
  CircularProgress,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export const DocAccordeon = () => {
  const { t } = useTranslation();
  const schemaState = useSelector(selectSchemaData);

  const schemaLoading = schemaState.status == StoreStatus.loading;
  const schemaReady = schemaState.status == StoreStatus.succeeded;
  const schemaError = schemaState.status == StoreStatus.failed ? schemaState.error : undefined;

  return (
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
        <Typography color={schemaError ? 'red' : 'inherited'}>
          {t('Documentation')}
          {schemaError ? '...' : ''}
          {schemaLoading && <CircularProgress size={'small'} />}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {schemaError && (
          <Typography fontStyle={'italic'} color={'red'}>
            {' (' + schemaError + ')'}
          </Typography>
        )}
        {schemaReady && <DocumentPageComponent />}
      </AccordionDetails>
    </Accordion>
  );
};
