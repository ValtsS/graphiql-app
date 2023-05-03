import React, { useRef } from 'react';

const Resizer = (props) => {
  const resizerRef = useRef(null);
  const { changeSideRef, setSideSize, axisVector } = props;

  let x = 0;
  let y = 0;
  let leftWidth = 0;

  const mouseDownHandler = (e) => {
    if (changeSideRef.current) {
      const leftSide = changeSideRef.current as HTMLElement;

      x = e.clientX;
      y = e.clientY;
      leftWidth = leftSide.getBoundingClientRect()[axisVector];

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
    if (changeSideRef.current && resizerRef.current) {
      const resizer = resizerRef.current as HTMLElement;

      const currentSizeChanges = axisVector === 'height' ? e.clientY - y : e.clientX - x;
      if (resizer.parentNode) {
        const parentResizer = resizer.parentNode as HTMLElement;

        setSideSize(
          `${(
            ((leftWidth + currentSizeChanges) * 100) /
            parentResizer.getBoundingClientRect()[axisVector]
          ).toString()}%`
        );
      }
      document.body.style.cursor = axisVector === 'height' ? 'row-resize' : 'col-resize';
    }
  };

  return (
    <div
      style={{ [axisVector]: 10, backgroundColor: '#D3D3D3' }}
      ref={resizerRef}
      id="dragMe"
      onMouseDown={mouseDownHandler}
    ></div>
  );
};

export default Resizer;
