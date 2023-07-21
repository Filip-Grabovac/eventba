import React from "react";

export const ListPageCard = () => {
  return (
    <div className="list-page-card">
      <div className="list-page-overlay"></div>
      <img
        className="list-page-landscape"
        src={`${process.env.REACT_APP_API_URL}/static/event-images/1689675323691_381_landscape.jpg`}
        alt="Landscape"
      />
      <div className="list-page-type-wrapper">
        <div>
          <h5>Prljavo Kazaliste</h5>
          <p className="list-page-date">
            07.jun.2023 22:00 - Bitefartcafe, Beograd
          </p>
          <div className="list-page-line"></div>
          <p className="list-page-desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            semper nisi sit amet dolor fermentum, ut viverra libero consequat.
            Vivamus ac aliquam nunc. Curabitur libero elit, auctor sed nisl vel,
            egestas iaculis dolor. Aliquam vel consequat urna.
          </p>
        </div>
        <div>
          <img
            className="list-page-landscape2"
            src={`${process.env.REACT_APP_API_URL}/static/event-images/1689675323691_381_landscape.jpg`}
            alt="Portrait"
          />
        </div>
        <div>
          <div className="list-page-btns-wrapper">
            <a href="#">Kupi</a>
            <div className="list-page-btns-line"></div>
            <a href="#">Pogledaj</a>
          </div>
        </div>
      </div>
    </div>
  );
};
