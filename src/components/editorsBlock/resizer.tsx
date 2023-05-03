import React from 'react';
import { useRef } from 'react';

const Resizer = (props) => {
  const resizerRef = useRef(null);
  const { leftSideWidth, setleftSideWidth, updateCurrentLeftSide } = props;

  let x = 0;
  let y = 0;

  // const mouseDownHandler = (e) => {
  //   updateCurrentLeftSide();

  //   document.addEventListener('mousemove', mouseMoveHandler);
  //   document.addEventListener('mouseup', mouseUpHandler);
  // };

  // const mouseUpHandler = function () {
  //   document.body.style.removeProperty('cursor');

  //   document.removeEventListener('mousemove', mouseMoveHandler);
  //   document.removeEventListener('mouseup', mouseUpHandler);
  // };

  // const mouseMoveHandler = function (e) {
  //   if (resizerRef.current) {
  //     const resizer = resizerRef.current as HTMLElement;

  //     const dx = e.clientX - x;
  //     const dy = e.clientY - y;
  //     if (resizer.parentNode) {
  //       const parentResizer = resizer.parentNode as HTMLElement;
  //       console.log(leftSideWidth);

  //       setleftSideWidth(
  //         `${(
  //           ((leftSideWidth + dx) * 100) /
  //           parentResizer.getBoundingClientRect().width
  //         ).toString()}%`
  //       );
  //     }
  //     document.body.style.cursor = 'col-resize';
  //   }
  // };

  return (
    <div
      style={{ width: 10, backgroundColor: 'red' }}
      ref={resizerRef}
      onMouseDown={mouseDownHandler}
      id="dragMe"
    ></div>
  );
};

export default Resizer;
