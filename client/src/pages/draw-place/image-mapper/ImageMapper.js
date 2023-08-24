import { editor } from '@overlapmedia/imagemapper';
import React from 'react';

function ImageMapper({
  options = {},
  style = {},
  cb,
  mode,
  handleShapeClick,
  preDrawnShapes,
}) {
  const elementRef = React.useRef(null);
  const editorRef = React.useRef(null);

  React.useEffect(() => {
    if (!editorRef.current) {
      const editorInstance = editor(elementRef.current, options, style);
      editorRef.current = editorInstance;
      cb && cb(editorInstance);
    }
  }, [options, style, cb]);

  // Listening to property "mode"
  React.useEffect(() => {
    if (mode) {
      switch (mode) {
        case Mode.RECT:
          editorRef.current.rect();
          break;
        case Mode.CIRCLE:
          editorRef.current.circle();
          break;
        case Mode.ELLIPSE:
          editorRef.current.ellipse();
          break;
        case Mode.POLYGON:
          editorRef.current.polygon();
          break;
        case Mode.SELECT:
          editorRef.current.selectMode();
          break;
        default:
      }
    }
  }, [mode]);

  return (
    <svg
      className="image-map-svg"
      ref={elementRef}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={options.width}
      height={options.height}
      viewBox={`0, 0, ${options.width}, ${options.height}`}
      preserveAspectRatio="xMinYMin"
      onClick={(e) => {
        handleShapeClick(e);
      }}
    >
      {/* {preDrawnShapes &&
        preDrawnShapes.map((shape, index) => {
          if (shape.type === 'circle') {
            return (
              <circle
                key={`circle_${index}`}
                cx={shape.data.x}
                cy={shape.data.y}
                r={shape.data.width / 2} // Assuming width is the diameter
                fill="rgb(102, 102, 102)"
                stroke="rgb(51, 51, 51)"
                strokeWidth="1"
                cursor="pointer"
                opacity="0.5"
                strokeLinejoin="miter"
              />
            );
          } else if (shape.type === 'polygon') {
            const points = shape.data.points.join(' ');
            return (
              <polygon
                key={`polygon_${index}`}
                points={points}
                fill="none"
                stroke="red"
                strokeWidth="2"
              />
            );
          }
          return null;
        })} */}
    </svg>
  );
}

export const Mode = Object.freeze({
  RECT: 'rect',
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
  POLYGON: 'polygon',
  SELECT: 'selectMode',
});

export default ImageMapper;
