import { QUERY_EDITOR_UUID, VARIABLE_EDITOR_UUID } from "@/core/consts";
import { selectEditorsData, queryErrorKind } from "@/slices";
import { Grid, Accordion, AccordionSummary, Typography, AccordionDetails } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { EditorQueryGraphQL } from "../editor-query";
import { EditorVariables } from "../editor-variables";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const QueryAndVariableEditors = () => {
    const { t } = useTranslation();
    const editorState = useSelector(selectEditorsData);
    const [varsVisible, setVarsVisible] = useState<boolean>(false);
    const variableError = editorState.queryErrorKind === queryErrorKind.variableError;
    const variableOpacity = varsVisible ? '1.0' : '0';

    return (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <EditorQueryGraphQL
            uuid={QUERY_EDITOR_UUID}
            sx={{ minHeight: { xs: '10vh', sm: '20vh', md: '50vh' } }}
          />
        </Grid>
        <Grid item xs={12}>
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
                }}
              />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    );
  };
