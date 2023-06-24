import React from "react";
import CoverImg from "../../../assets/images/test.png";

const MainCard = (props) => {
  const performerName = props.concertData[0].performer_name;
  const timeOfEvent = new Date(props.concertData[0].time_of_event);
  const formattedDate = timeOfEvent.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="container-fluid single-main-card">
      <div className="row sinkle-page-row">
        <div className="col-lg-6">
          <h3>{performerName}</h3>
          <p className="card-main-info">
            {formattedDate} - Bitefartcafe, Beograd
          </p>
          <div className="line"></div>
          <p className="card-other-info">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            semper nisi sit amet dolor fermentum, ut viverra libero consequat.
            Vivamus ac aliquam nunc. Curabitur libero elit, auctor sed nisl vel,
            egestas iaculis dolor. Aliquam vel consequat urna. <br />
            <br /> Donec eget velit nec libero cursus ullamcorper in ut nisl.
            Cras congue lacus quis libero fermentum efficitur. Aliquam a
            tincidunt nisi. Duis metus diam, dapibus vel libero in, congue
            mollis leo. Cras venenatis eget leo at fermentum. Maecenas feugiat,
            arcu ac hendrerit aliquet, mi arcu aliquet mi, at sagittis sem mi
            eget velit.
          </p>
        </div>
        <div className="col-lg-6 single-page-wrapper">
          <img className="single-page-cover" src={CoverImg} alt="Cover Image" />
        </div>
      </div>
    </div>
  );
};

export default MainCard;
