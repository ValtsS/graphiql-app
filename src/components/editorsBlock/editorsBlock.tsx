import React from 'react';
import { useRef, useState } from 'react';
import { QueryEditor, VariablesEditor, ResponseEditor } from '@/components/editors';
import styles from './editorsBlock.module.css';
import Resizer from './resizer';

const EditorsBlock = () => {
  const leftSideRef = useRef(null);
  const topSideRef = useRef(null);

  const [leftSideWidth, setleftSideWidth] = useState('60%');
  const [topSideHeight, setTopSideHeight] = useState('70%');

  return (
    <div className={styles.editorsContainer}>
      <div className={styles.editors}>
        <div ref={leftSideRef} className={styles.mainEditor} style={{ width: leftSideWidth }}>
          <div ref={topSideRef} className={styles.editor} style={{ height: topSideHeight }}>
            <QueryEditor />
          </div>
          <Resizer
            changeSideRef={topSideRef}
            setSideSize={setTopSideHeight}
            axisVector={'height'}
          />
          <div className={`${styles.editor} ${styles.variable}`}>
            <VariablesEditor />
          </div>
        </div>
        <Resizer changeSideRef={leftSideRef} setSideSize={setleftSideWidth} axisVector={'width'} />
        <div className={`${styles.editor} ${styles.response}`}>
          <ResponseEditor />
        </div>
      </div>
    </div>
  );
};

export default EditorsBlock;
