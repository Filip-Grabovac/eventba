import React, { useEffect, useState } from "react";
import { sha512 } from "crypto-hash";

const AdminPayment = ({
  totalAmount,
  profileData,
  orderNumber,
  performerName,
}) => {
  const [hashedCode, setHashCode] = useState();

  const key = "key-7db98c681752b62dc6fac2ec4daa93c1";
  const amount = totalAmount * 100;
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
      script1.src = "https://ipgtest.monri.com/dist/components.js";
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.src = "https://ipgtest.monri.com/dist/lightbox.js";
      script2.className = "lightbox-button";
      script2.setAttribute(
        "data-authenticity-token",
        "000d667d189f7255a6737ccc025b8e33b0eb0c6b"
      );
      script2.setAttribute("data-amount", amount);
      script2.setAttribute("data-currency", "BAM");
      script2.setAttribute("data-order-number", orderNumber);
      script2.setAttribute("data-order-info", "SUPER-ADMIN-4058400000000005");
      script2.setAttribute("data-digest", hashedCode);
      script2.setAttribute("data-transaction-type", "purchase");
      script2.setAttribute("data-ch-full-name", fullName ? fullName : "");
      script2.setAttribute("data-ch-zip", zip ? zip : "");
      script2.setAttribute("data-ch-phone", phone ? phone : "");
      script2.setAttribute("data-ch-email", email ? email : "");
      script2.setAttribute("data-ch-address", address ? address : "");
      script2.setAttribute("data-ch-city", city ? city : "");
      script2.setAttribute("data-ch-country", country ? country : "");
      script2.setAttribute("data-language", "en");
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
          src="https://ipgtest.monri.com/dist/lightbox.js"
          className="lightbox-button"
          data-authenticity-token="000d667d189f7255a6737ccc025b8e33b0eb0c6b"
          data-amount={amount}
          data-currency="BAM"
          data-order-number={orderNumber}
          data-order-info={"SUPER-ADMIN-4058400000000005"}
          data-digest={hashedCode}
          data-transaction-type="purchase"
          data-ch-full-name={fullName ? fullName : ""}
          data-ch-zip={zip ? zip : ""}
          data-ch-phone={phone ? phone : ""}
          data-ch-email={email ? email : ""}
          data-ch-address={address ? address : ""}
          data-ch-city={city ? city : ""}
          data-ch-country={country ? country : ""}
          data-language="en"
        ></script>
      </form>
    )
  );
};

export default AdminPayment;
