import React, { useEffect, useState } from "react";
import { sha512 } from "crypto-hash";

const MyComponent = ({
  totalAmount,
  profileData,
  orderNumber,
  performerName,
}) => {
  const [hashedCode, setHashCode] = useState();

  const key = "key-0875b47f397c1771411c78d10862a2d9";
  const amount = Math.round(totalAmount * 100);
  const fullName = profileData.full_name;
  const zip = profileData.zip;
  const phone = profileData.phone;
  const email = profileData.email;
  const address = profileData.address;
  const city = profileData.city;
  const country = profileData.country;

  const handleTextInput = async (value) => {
    setHashCode(await sha512(value));
  };

  useEffect(() => {
    handleTextInput(key + orderNumber.toString() + amount + "BAM");
    if (orderNumber && hashedCode) {
      const script1 = document.createElement("script");
      script1.src = "https://ipg.monri.com/dist/components.js";
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.src = "https://ipg.monri.com/dist/lightbox.js";
      script2.className = "lightbox-button";
      script2.setAttribute(
        "data-authenticity-token",
        "f9802e547e78db9b037e745e07eb1e35d0d34855"
      );
      script2.setAttribute("data-amount", amount);
      script2.setAttribute("data-currency", "BAM");
      script2.setAttribute("data-order-number", orderNumber);
      script2.setAttribute("data-order-info", performerName);
      script2.setAttribute("data-digest", hashedCode);
      script2.setAttribute("data-transaction-type", "purchase");
      script2.setAttribute("data-ch-full-name", fullName ? fullName : "");
      script2.setAttribute("data-ch-zip", zip ? zip : "");
      script2.setAttribute("data-ch-phone", phone ? phone : "");
      script2.setAttribute("data-ch-email", email ? email : "");
      script2.setAttribute("data-ch-address", address ? address : "");
      script2.setAttribute("data-ch-city", city ? city : "");
      script2.setAttribute("data-ch-country", country ? country : "");
      script2.setAttribute("data-language", "hr");
      document.body.appendChild(script2);

      return () => {
        document.head.removeChild(script1);
        document.body.removeChild(script2);
      };
    }
  }, [orderNumber, hashedCode]);

  return (
    orderNumber &&
    hashedCode && (
      <form
        className="payment-form"
        method="POST"
        action={`${process.env.REACT_APP_API_URL}/api/v1/payment/get_payment_info`}
      >
        <script
          src="https://ipg.monri.com/dist/lightbox.js"
          className="lightbox-button"
          data-authenticity-token="f9802e547e78db9b037e745e07eb1e35d0d34855"
          data-amount={amount}
          data-currency="BAM"
          data-order-number={orderNumber}
          data-order-info={performerName}
          data-digest={hashedCode}
          data-transaction-type="purchase"
          data-ch-full-name={fullName ? fullName : ""}
          data-ch-zip={zip ? zip : ""}
          data-ch-phone={phone ? phone : ""}
          data-ch-email={email ? email : ""}
          data-ch-address={address ? address : ""}
          data-ch-city={city ? city : ""}
          data-ch-country={country ? country : ""}
          data-language="hr"
        ></script>
      </form>
    )
  );
};

export default MyComponent;
