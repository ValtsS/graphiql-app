import { VARIABLE_EDITOR_UUID } from '@/core/consts';
import { queryErrorKind, selectEditorsData } from '@/slices';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, SxProps, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { EditorVariables } from '../editor-variables';

export const VariableAccordeon = ({ sx }: { sx?: SxProps }) => {
  const { t } = useTranslation();
  const editorState = useSelector(selectEditorsData);
  const [varsVisible, setVarsVisible] = useState<boolean>(false);
  const variableError = editorState.queryErrorKind === queryErrorKind.variableError;
  const variableOpacity = varsVisible ? '1.0' : '0';

  return (
    <Accordion onChange={(_, expanded) => setVarsVisible(expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color={variableError ? 'red' : 'inherited'}>
          {t('Variables')}
          {variableError ? '...' : ''}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <EditorVariables
          uuid={VARIABLE_EDITOR_UUID}
          sx={{
            minHeight: `10vh`,
            transition: 'opacity 0.3s ease',
            opacity: `${variableOpacity}`,
            ...sx,
          }}
        />
      </AccordionDetails>
    </Accordion>
  );
};
