import { QueryEditor, VariablesEditor, ResponseEditor } from '@/components/editors';
import { useRef } from 'react';
import styles from './editorsBlock.module.css';
import React from 'react';

const EditorsBlock = () => {
  const resizerRef = useRef(null);
  const leftSideRef = useRef(null);
  const rightSideRef = useRef(null);

  let x = 0;
  let y = 0;

  let leftWidth = 0;
  const mouseDownHandler = (e) => {
    if (leftSideRef.current) {
      const leftSide = leftSideRef.current as HTMLElement;

      // Get the current mouse position
      x = e.clientX;
      y = e.clientY;
      leftWidth = leftSide.getBoundingClientRect().width;

      const mouseMoveHandler = function (e) {
        if (leftSideRef.current && resizerRef.current && rightSideRef.current) {
          const leftSide = leftSideRef.current as HTMLElement;
          const rightSide = rightSideRef.current as HTMLElement;
          const resizer = resizerRef.current as HTMLElement;
          // How far the mouse has been moved
          const dx = e.clientX - x;
          const dy = e.clientY - y;
          if (resizer.parentNode) {
            const parentResizer = resizer.parentNode as HTMLElement;
            const newLeftWidth =
              ((leftWidth + dx) * 100) / parentResizer.getBoundingClientRect().width;
            leftSide.style.width = `${newLeftWidth}%`;
          }
          document.body.style.cursor = 'col-resize';
          leftSide.style.userSelect = 'none';
          leftSide.style.pointerEvents = 'none';

          rightSide.style.userSelect = 'none';
          rightSide.style.pointerEvents = 'none';
        }
      };

      const mouseUpHandler = function () {
        if (leftSideRef.current && resizerRef.current && rightSideRef.current) {
          const leftSide = leftSideRef.current as HTMLElement;
          const rightSide = rightSideRef.current as HTMLElement;
          const resizer = resizerRef.current as HTMLElement;

          resizer.style.removeProperty('cursor');
          document.body.style.removeProperty('cursor');

          leftSide.style.removeProperty('user-select');
          leftSide.style.removeProperty('pointer-events');

          rightSide.style.removeProperty('user-select');
          rightSide.style.removeProperty('pointer-events');

          // Remove the handlers of `mousemove` and `mouseup`
          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
        }
      };

      // Attach the listeners to `document`
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    }
  };

  return (
    <div className={styles.editorsContainer}>
      <div className={styles.editors}>
        <div ref={leftSideRef} className={styles.mainEditor}>
          <div className={styles.query}>{/* <QueryEditor /> */}</div>
          <div className={styles.variable}>{/* <VariablesEditor /> */}</div>
        </div>
        <div
          ref={resizerRef}
          onMouseDown={mouseDownHandler}
          className={styles.resizer}
          id="dragMe"
        ></div>
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
