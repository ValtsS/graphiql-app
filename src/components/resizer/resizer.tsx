import React, { RefObject, useRef } from 'react';
import styles from './resizer.module.css';

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
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  const mouseMoveHandler = function (e: MouseEvent) {
    const resizer = resizerRef.current as HTMLElement;

    const currentSizeChanges = axisVector === 'height' ? e.clientY - y : e.clientX - x;

    const parentResizer = resizer.parentNode as HTMLElement;
    console.log(parentResizer);

    setSideSize(
      `${(
        ((leftWidth + currentSizeChanges) * 100) /
        +parentResizer.getBoundingClientRect()[axisVector]
      ).toString()}%`
    );
  };

  return (
    <div
      style={{
        [axisVector]: 30,
      }}
      className={`${styles.resizer} ${styles[axisVector]}`}
      ref={resizerRef}
      onMouseDown={mouseDownHandler}
    ></div>
  );
};

export default Resizer;
