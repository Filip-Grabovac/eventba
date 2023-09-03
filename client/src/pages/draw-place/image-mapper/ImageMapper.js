import { editor } from "@overlapmedia/imagemapper";
import React from "react";

function ImageMapper({
  options = {},
  style = {},
  cb,
  mode,
  handleShapeClick,
  preDrawnShapes,
  handleZoneClick,
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

  function showTooltip(evt, data) {
    let tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = `<p>Zona: ${data.zoneName}</p><p>Cijena: ${data.price} BAM</p><p>Ukupan broj sjedala: ${data.total_amount}</p>`;
    tooltip.style.display = 'block';
    tooltip.style.left = evt.pageX + 'px';
    tooltip.style.top = evt.pageY - 40 + 'px';
  }

  function hideTooltip() {
    var tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
  }
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
        if (!preDrawnShapes) {
          handleShapeClick(e);
        }
      }}
    >
      {preDrawnShapes &&
        Object.entries(preDrawnShapes).map(([zoneName, zoneData], index) => {
          let totalSeats = 0;
          let totalRemainingSeats = 0;

          Object.entries(zoneData.rows).map(([key, value]) => {
            totalSeats += Number(value.total_seats);
            totalRemainingSeats += value.seats.length;
          });

          const containerStyle = `rgb(110, ${Math.floor(
            (totalRemainingSeats / totalSeats) * 255
          )}, 0)`;

          if (zoneData.location.shape === "rect") {
            return (
              <g key={`rect_${index}`}>
                <rect
                  fill={containerStyle}
                  stroke="rgb(51, 51, 51)"
                  cursor="pointer"
                  strokeWidth="1"
                  opacity="0.5"
                  strokeDasharray="none"
                  strokeLinejoin="miter"
                  id={zoneName}
                  width={zoneData.location.size.width}
                  x={zoneData.location.position.x}
                  height={zoneData.location.size.height}
                  y={zoneData.location.position.y}
                  onClick={(e) => {
                    handleZoneClick(e, [zoneName, zoneData]);
                  }}
                  onMouseMove={(e) => {
                    showTooltip(e, 'Test');
                  }}
                  onMouseOut={hideTooltip}
                ></rect>
              </g>
            );
          } else if (zoneData.location.shape === "polygon") {
            // Similar modification for polygons
            return (
              <g key={`pol_${index}`}>
                <polygon
                  points={zoneData.location.points}
                  fill={containerStyle}
                  stroke="rgb(21, 21, 21)"
                  cursor="pointer"
                  strokeWidth="5"
                  opacity="0.5"
                  strokeDasharray="none"
                  strokeLinejoin="miter"
                  id={zoneName}
                  onClick={(e) => {
                    handleZoneClick(e, [zoneName, zoneData]);
                  }}
                  onMouseMove={(e) => {
                    showTooltip(e, {
                      price: zoneData.price,
                      total_amount: zoneData.total_amount,
                      zoneName: zoneName,
                    });
                  }}
                  onMouseOut={hideTooltip}
                ></polygon>
              </g>
            );
          }
          return null;
        })}
    </svg>
  );
}

export const Mode = Object.freeze({
  RECT: "rect",
  POLYGON: "polygon",
  SELECT: "selectMode",
});

export default ImageMapper;
