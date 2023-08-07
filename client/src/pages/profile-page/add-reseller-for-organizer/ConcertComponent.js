import React from "react";

const ConcertComponent = ({ concertData }) => {
  return (
    <>
      {concertData ? (
        <div className="bottom-part">
          <h6>Ulaznice za slobodnu prodaju</h6>
          <p>Ukupno: {concertData.tickets.free_sale.total_amount}</p>
          <p>Zaduženo: {concertData.tickets.free_sale.total_loaned}</p>
          <p>
            Dostupno:{" "}
            {concertData.tickets.free_sale.total_amount -
              concertData.tickets.free_sale.total_loaned}
          </p>
          <div className="line"></div>
          {Object.keys(concertData.tickets.free_sale.type).map(
            (categoryKey) => {
              const category = concertData.tickets.free_sale.type[categoryKey];
              return (
                <div key={categoryKey} className="category">
                  <p>
                    {category.name} - {categoryKey}
                  </p>
                  <p>
                    Ukupno/Zaduženo: {category.amount}/{category.loaned ?? 0}
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
