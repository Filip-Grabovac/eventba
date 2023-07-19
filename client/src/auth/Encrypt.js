import { AES } from "crypto-js";

// Function for encrypting password
export const Encrypt = (text, secretKey) => {
  const encryptedText = AES.encrypt(text, secretKey).toString();
  return encryptedText;
};
