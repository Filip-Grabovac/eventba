import React, { useEffect, useState } from "react";
import { sha512 } from "crypto-hash";

const MyComponent = () => {
  const [hashedCode, setHashCode] = useState();
  const [isNumberGenerated, setIsNumberGenerated] = useState(false);
  const [randomNumber, setRandomNumber] = useState(null);
  const price = "100";
  const key = "key-7db98c681752b62dc6fac2ec4daa93c1";

  if (!isNumberGenerated) {
    const generatedNumber = Math.floor(Math.random() * 100000000000000) + 1;
    setRandomNumber(generatedNumber);
    setIsNumberGenerated(true);
  }
  const handleTextInput = async (value) => {
    setHashCode(await sha512(value));
  };

  useEffect(() => {
    handleTextInput(key + randomNumber.toString() + price + "EUR");
    if (randomNumber && hashedCode) {
      const script1 = document.createElement("script");
      script1.src = "https://ipgtest.monri.com/dist/components.js";
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.src = "https://ipgtest.monri.com/dist/lightbox.js";
      script2.className = "lightbox-button";
      script2.setAttribute("data-authenticity-token", "000d6675b8e33b0eb0c6b");
      script2.setAttribute("data-amount", price);
      script2.setAttribute("data-currency", "EUR");
      script2.setAttribute("data-order-number", randomNumber);
      script2.setAttribute("data-order-info", "Lightbox example");
      script2.setAttribute("data-digest", hashedCode);
      script2.setAttribute("data-transaction-type", "purchase");
      script2.setAttribute("data-ch-full-name", "Test");
      script2.setAttribute("data-ch-zip", "Test");
      script2.setAttribute("data-ch-phone", "Test");
      script2.setAttribute("data-ch-email", "test@test.com");
      script2.setAttribute("data-ch-address", "Adresa");
      script2.setAttribute("data-ch-city", "Grad");
      script2.setAttribute("data-ch-country", "Croatia");
      script2.setAttribute("data-language", "en");
      document.body.appendChild(script2);

      return () => {
        document.head.removeChild(script1);
        document.body.removeChild(script2);
      };
    }

    // Get the button element
    const button = document.querySelector(".monri-lightbox-button-el");
  }, [randomNumber, hashedCode]);

  if (randomNumber && hashedCode) {
    return (
      <form className="payment-form" method="POST" action="/payment">
        <script
          src="https://ipgtest.monri.com/dist/lightbox.js"
          className="lightbox-button"
          data-authenticity-token="000d667d189f7255a6737ccc025b8e33b0eb0c6b"
          data-amount={price}
          data-currency="EUR"
          data-order-number={randomNumber}
          data-order-info="Lightbox example"
          data-digest={hashedCode}
          data-transaction-type="purchase"
          data-ch-full-name="Test"
          data-ch-zip="Test"
          data-ch-phone="Test"
          data-ch-email="test@test.com"
          data-ch-address="Adresa"
          data-ch-city="Grad"
          data-ch-country="Croatia"
          data-language="en"
        ></script>
      </form>
    );
  }
};

export default MyComponent;
