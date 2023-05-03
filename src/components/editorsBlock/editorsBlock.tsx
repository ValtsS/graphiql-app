import { QueryEditor, VariablesEditor, ResponseEditor } from '@/components/editors';
import { useEffect, useRef, useState } from 'react';
import styles from './editorsBlock.module.css';
import React from 'react';
import Resizer from './resizer';

const EditorsBlock = () => {
  const resizerRef = useRef(null);
  const resizerRefGoriz = useRef(null);
  const leftSideRef = useRef(null);
  const rightSideRef = useRef(null);
  const bottomSideRef = useRef(null);

  const [leftSideWidth, setleftSideWidth] = useState('60%');

  const updateCurrentLeftSide = () => {
    if (leftSideRef.current) {
      const leftSide = leftSideRef.current as HTMLElement;
      setleftSideWidth(leftSide.getBoundingClientRect().width.toString());
    }
  };

  let x = 0;
  let y = 0;
  let leftWidth = 0;

  const mouseDownHandler = (e, block) => {
    if (leftSideRef.current) {
      const leftSide = block.current as HTMLElement;

      x = e.clientX;
      y = e.clientY;
      leftWidth = leftSide.getBoundingClientRect().width;

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    }
  };

  const mouseUpHandler = function () {
    document.body.style.removeProperty('cursor');

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  const mouseMoveHandler = function (e) {
    if (leftSideRef.current && resizerRef.current && rightSideRef.current) {
      const resizer = resizerRef.current as HTMLElement;

      const dx = e.clientX - x;
      const dy = e.clientY - y;
      if (resizer.parentNode) {
        const parentResizer = resizer.parentNode as HTMLElement;

        setleftSideWidth(
          `${(((leftWidth + dx) * 100) / parentResizer.getBoundingClientRect().width).toString()}%`
        );
      }
      document.body.style.cursor = 'col-resize';
    }
  };

  return (
    <div className={styles.editorsContainer}>
      <div className={styles.editors}>
        <div ref={leftSideRef} className={styles.mainEditor} style={{ width: leftSideWidth }}>
          <div className={styles.query}>{/* <QueryEditor /> */}</div>
          <div
            ref={resizerRefGoriz}
            onMouseDown={(e) => mouseDownHandler(e, bottomSideRef)}
            className={styles.resizer}
            id="dragMe"
          ></div>
          <div ref={bottomSideRef} className={styles.variable}>
            {/* <VariablesEditor /> */}
          </div>
        </div>
        <div
          ref={resizerRef}
          onMouseDown={(e) => mouseDownHandler(e, leftSideRef)}
          className={styles.resizer}
          id="dragMe"
        ></div>
        {/* <Resizer
          leftSideWidth={leftSideWidth}
          setleftSideWidth={setleftSideWidth}
          updateCurrentLeftSide={updateCurrentLeftSide}
        /> */}
        <div ref={rightSideRef} className={styles.response}>
          {/* <ResponseEditor /> */}
        </div>
      </div>
    </div>
    /* <Grid container>
          <Grid item xs={12} md={6}>
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
        </Grid> */
  );
};

export default EditorsBlock;
