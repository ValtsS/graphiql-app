import React, { useRef, useState } from 'react';
import styles from './editorsBlock.module.css';
import Resizer from './resizer';
import CustomEditor from '../editor/editor';

const EditorsBlock = () => {
  const leftSideRef = useRef<HTMLDivElement>(null);
  const topSideRef = useRef<HTMLDivElement>(null);

  const [leftSideWidth, setleftSideWidth] = useState('60%');
  const [topSideHeight, setTopSideHeight] = useState('70%');

  return (
    <div className={styles.editorsContainer}>
      <div className={styles.editors}>
        <div ref={leftSideRef} className={styles.mainEditor} style={{ width: leftSideWidth }}>
          <div ref={topSideRef} className={styles.editor} style={{ height: topSideHeight }}>
            <CustomEditor />
          </div>
          <Resizer
            changeSideRef={topSideRef}
            setSideSize={setTopSideHeight}
            axisVector={'height'}
          />
          <div className={`${styles.editor} ${styles.variable}`}>
            <CustomEditor />
          </div>
        </div>
        <Resizer changeSideRef={leftSideRef} setSideSize={setleftSideWidth} axisVector={'width'} />
        <div className={`${styles.editor} ${styles.response}`}>
          <CustomEditor />
        </div>
      </div>
    </div>
  );
};

export default EditorsBlock;
