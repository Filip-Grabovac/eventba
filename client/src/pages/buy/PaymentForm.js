import React, { useEffect, useState } from "react";
import { sha512 } from "crypto-hash";

const MyComponent = (props) => {
  const [hashedCode, setHashCode] = useState();
  const [isNumberGenerated, setIsNumberGenerated] = useState(false);
  const [randomNumber, setRandomNumber] = useState(null);
  const key = "key-7db98c681752b62dc6fac2ec4daa93c1";
  const amount = props.totalAmount * 100;
  const fullName = props.profileData.name + " " + props.profileData.lname;
  const zip = props.profileData.zip;
  const phone = props.profileData.phone;
  const email = props.profileData.email;
  const address = props.profileData.address;
  const city = props.profileData.city;
  const country = props.profileData.country;

  if (!isNumberGenerated) {
    const generatedNumber = Math.floor(Math.random() * 100000000000000) + 1;
    setRandomNumber(generatedNumber);
    setIsNumberGenerated(true);
  }
  const handleTextInput = async (value) => {
    setHashCode(await sha512(value));
  };

  useEffect(() => {
    handleTextInput(key + randomNumber.toString() + amount + "EUR");
    if (randomNumber && hashedCode) {
      const script1 = document.createElement("script");
      script1.src = "https://ipgtest.monri.com/dist/components.js";
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.src = "https://ipgtest.monri.com/dist/lightbox.js";
      script2.className = "lightbox-button";
      script2.setAttribute("data-authenticity-token", "000d6675b8e33b0eb0c6b");
      script2.setAttribute("data-amount", amount);
      script2.setAttribute("data-currency", "EUR");
      script2.setAttribute("data-order-number", randomNumber);
      script2.setAttribute("data-order-info", "Lightbox example");
      script2.setAttribute("data-digest", hashedCode);
      script2.setAttribute("data-transaction-type", "purchase");
      script2.setAttribute("data-ch-full-name", fullName);
      script2.setAttribute("data-ch-zip", zip);
      script2.setAttribute("data-ch-phone", phone);
      script2.setAttribute("data-ch-email", email);
      script2.setAttribute("data-ch-address", address);
      script2.setAttribute("data-ch-city", city);
      script2.setAttribute("data-ch-country", country);
      script2.setAttribute("data-language", "en");
      document.body.appendChild(script2);

      return () => {
        document.head.removeChild(script1);
        document.body.removeChild(script2);
      };
    }
  }, [randomNumber, hashedCode]);

  if (randomNumber && hashedCode) {
    return (
      <form className="payment-form" method="POST" action="/payment">
        <script
          src="https://ipgtest.monri.com/dist/lightbox.js"
          className="lightbox-button"
          data-authenticity-token="000d667d189f7255a6737ccc025b8e33b0eb0c6b"
          data-amount={amount}
          data-currency="EUR"
          data-order-number={randomNumber}
          data-order-info="Lightbox example"
          data-digest={hashedCode}
          data-transaction-type="purchase"
          data-ch-full-name={fullName}
          data-ch-zip={zip}
          data-ch-phone={phone}
          data-ch-email={email}
          data-ch-address={address}
          data-ch-city={city}
          data-ch-country={country}
          data-language="en"
        ></script>
      </form>
    );
  }
};

export default MyComponent;
