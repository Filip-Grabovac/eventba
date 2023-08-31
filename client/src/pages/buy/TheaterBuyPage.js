import React, { useEffect, useState } from 'react';
import ImageMapper, { Mode } from '../draw-place/image-mapper/ImageMapper';

export const TheaterBuyPage = ({
  concertData,
  setModal,
  setSelectedZoneData,
}) => {
  const [groundPlanImg, setImg] = useState(null);

  // Load ground image
  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/static/ground-plans/${concertData.place.ground_plan}`
        );

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        // Create an image element to calculate its dimensions
        const imgElement = new Image();

        // Set up the onload event handler
        imgElement.onload = () => {
          setImg({
            src: imageUrl,
            width: imgElement.width,
            height: imgElement.height,
          });
        };

        // Set the src AFTER defining the onload handler
        imgElement.src = imageUrl;
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    loadImage();
  }, [concertData]);

  // Hanlde zone click (select seat)
  function handleZoneClick(e, data) {
    setModal(true);
    setSelectedZoneData(data);
  }

  return (
    <div className="buy-plan-wrapper">
      {groundPlanImg && (
        <ImageMapper
          mode={Mode.SELECT}
          cb={(editor) => {
            editor.loadImage(groundPlanImg.src); // Load the URL directly
            editor.polygon();
          }}
          options={{
            width: groundPlanImg.width,
            height: groundPlanImg.height,
          }}
          handleZoneClick={handleZoneClick}
          preDrawnShapes={concertData.tickets.online_sale.zones}
        />
      )}
    </div>
  );
};
