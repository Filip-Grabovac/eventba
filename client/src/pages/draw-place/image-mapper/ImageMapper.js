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
  page,
  freeSale,
  tickets,
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
    let x = page === "buyPage" ? 0 : 0;
    let y = page === "buyPage" ? 180 : 40;

    let tooltip = document.getElementById("tooltip");
    tooltip.innerHTML = `<p>Zona: ${data.zoneName} - ${
      data.ticket_name || "Nije na prodaju"
    }</p><p>Cijena: ${
      data.price || "0,00"
    } <small>BAM<small/></p><p>Ukupan broj slobodnih sjedala: ${
      data.available_seats
    } / ${data.total_amount || 0}</p>`;

    // Buy page tooltip
    if (page === "buyPage") {
      const containerRect = document
        .querySelector(".buy-container")
        .getBoundingClientRect();
      tooltip.style.left = evt.pageX - containerRect.left + "px";
      if (data.ticket_name) {
        tooltip.innerHTML = `<p>Zona: ${data.zoneName} - ${
          data.ticket_name || "Nije na prodaju"
        }</p><p>Cijena: ${
          data.price
        } <small>BAM<small/></p><p>Ukupan broj slobodnih sjedala: ${
          data.available_seats
        } / ${data.total_amount || 0}</p>`;
      } else tooltip.innerHTML = `<p>Nije u ponudi</p>`;
    } else {
      tooltip.style.left = evt.pageX + "px";
    }
    tooltip.style.top = evt.pageY - y + "px";

    tooltip.style.display = "block";
  }

  function hideTooltip() {
    var tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";
  }

  function showZoneTooltip(zoneData, zoneName, e) {
    const seatsLength =
      Object.values(zoneData.rows).find((row) => row.seats.length > 0)?.seats
        .length || 0;

    let tooltipData;

    if (freeSale && freeSale.zones && freeSale.zones.hasOwnProperty(zoneName)) {
      const zoneInfo = freeSale.zones[zoneName];
      tooltipData = {
        price: zoneInfo.price,
        total_amount: zoneInfo.max_amount,
        available_seats: zoneInfo.amount,
        zoneName: zoneName,
        ticket_name: zoneInfo.name,
      };
    } else {
      tooltipData = {
        price: zoneData.price,
        total_amount: zoneData.max_amount,
        available_seats: seatsLength,
        zoneName: zoneName,
        ticket_name: zoneData.name,
      };
    }

    showTooltip(e, tooltipData);
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
      onTouchStart={(e) => {
        if (!preDrawnShapes) {
          handleShapeClick(e);
        }
      }}
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

          let containerStyle;
          if (
            page === "ticketGen" &&
            zoneData.name &&
            tickets.online_sale.zones[zoneName].name
          ) {
            containerStyle = "rgb(150, 0, 0)";
          } else if (
            freeSale &&
            freeSale.zones &&
            page === "ticketGen" &&
            freeSale.zones.hasOwnProperty(zoneName) &&
            (!zoneData.name || zoneData.name === "")
          ) {
            containerStyle = "rgb(10, 20, 255)";
          } else if (page === "ticketGen" && freeSale) {
            containerStyle = "gray";
          } else {
            containerStyle = `rgb(110, ${Math.floor(
              (totalRemainingSeats / totalSeats) * 255
            )}, 0)`;
          }

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
                  onTouchStart={(e) => {
                    handleZoneClick(e, [zoneName, zoneData]);
                  }}
                  onClick={(e) => {
                    handleZoneClick(e, [zoneName, zoneData]);
                  }}
                  onMouseMove={(e) => {
                    showZoneTooltip(zoneData, zoneName, e);
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
                  strokeWidth="8"
                  opacity="0.5"
                  strokeDasharray="none"
                  strokeLinejoin="miter"
                  id={zoneName}
                  onTouchStart={(e) => {
                    handleZoneClick(e, [zoneName, zoneData]);
                  }}
                  onClick={(e) => {
                    handleZoneClick(e, [zoneName, zoneData]);
                  }}
                  onMouseMove={(e) => {
                    showZoneTooltip(zoneData, zoneName, e);
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
