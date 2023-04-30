import { useNotifications } from '@/provider/notifications-provider';
import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { QueryEditor, VariablesEditor, ResponseEditor } from '@/components/editors';
import styles from './graphql-page.module.css';

export const GraphqlPage = () => {
  const { setMessage } = useNotifications();

  useEffect(() => {
    setMessage('Test notification message', false);
  }, [setMessage]);

  return (
    <Grid container>
      <Grid container>
        <Grid item xs={12} md={6}>
          <QueryEditor />
        </Grid>
        <Grid item xs={12} md={6}>
          <QueryEditor />
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <QueryEditor />
      </Grid>
    </Grid>
    // <div className={styles.container}>
    //   <div className={styles.editors}>
    //     <div className={styles.mainEditor}>
    //       <div className={styles.query}>
    //         <QueryEditor />
    //       </div>
    //       <div className={styles.variable}>
    //         <QueryEditor />
    //       </div>
    //     </div>
    //     <div className={styles.response}>
    //       <QueryEditor />
    //     </div>
    //   </div>
    // </div>
  );
};
