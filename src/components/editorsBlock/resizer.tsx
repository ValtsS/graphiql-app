import React, { RefObject, useRef } from 'react';

interface Props {
  changeSideRef: RefObject<HTMLDivElement>;
  setSideSize: React.Dispatch<React.SetStateAction<string>>;
  axisVector: keyof DOMRect;
}

const Resizer = (props: Props) => {
  const resizerRef = useRef<HTMLDivElement>(null);
  const { changeSideRef, setSideSize, axisVector } = props;

  let x = 0;
  let y = 0;
  let leftWidth = 0;

  const mouseDownHandler = (e: React.MouseEvent) => {
    const leftSide = changeSideRef.current as HTMLElement;

    x = e.clientX;
    y = e.clientY;
    leftWidth = +leftSide.getBoundingClientRect()[axisVector];

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const mouseUpHandler = function () {
    document.body.style.removeProperty('cursor');

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  const mouseMoveHandler = function (e: MouseEvent) {
    const resizer = resizerRef.current as HTMLElement;

    const currentSizeChanges = axisVector === 'height' ? e.clientY - y : e.clientX - x;

    const parentResizer = resizer.parentNode as HTMLElement;

    setSideSize(
      `${(
        ((leftWidth + currentSizeChanges) * 100) /
        +parentResizer.getBoundingClientRect()[axisVector]
      ).toString()}%`
    );
    document.body.style.cursor = axisVector === 'height' ? 'row-resize' : 'col-resize';
  };

  return (
    <div
      style={{
        [axisVector]: 30,
        cursor: axisVector === 'height' ? 'row-resize' : 'col-resize',
        backgroundColor: '#fff',
      }}
      ref={resizerRef}
      onMouseDown={mouseDownHandler}
    ></div>
  );
};

export default Resizer;
