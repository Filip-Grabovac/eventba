import React from "react";

const ConcertComponent = ({ concertData }) => {
  return (
    <>
      {concertData ? (
        <div className="bottom-part">
          <h6>Ulaznice za slobodnu prodaju</h6>
          <p>
            Ukupno:{" "}
            {concertData.tickets.free_sale.total_amount_left +
              concertData.tickets.free_sale.sold_amount}
          </p>
          <p>Zaduženo: {concertData.tickets.free_sale.total_loaned}</p>
          <p>
            Dostupno:{" "}
            {concertData.tickets.free_sale.total_amount_left +
              concertData.tickets.free_sale.sold_amount -
              concertData.tickets.free_sale.total_loaned}
          </p>
          <div className="line"></div>
          {concertData.tickets.free_sale.zones &&
            Object.keys(concertData.tickets.free_sale.zones).map(
              (categoryKey) => {
                const category =
                  concertData.tickets.free_sale.zones[categoryKey];
                return (
                  <div key={categoryKey} className="category">
                    <p>
                      {categoryKey}{" "}
                      {categoryKey !== "" && category.name !== "" ? "-" : ""}{" "}
                      {category.name}
                    </p>
                    <p>
                      Ukupno/Zaduženo: {category.max_amount}/
                      {category.loaned ?? 0}
                    </p>
                  </div>
                );
              }
            )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ConcertComponent;
