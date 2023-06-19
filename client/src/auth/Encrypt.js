import { AES } from "crypto-js";

export const Encrypt = (text, secretKey) => {
  const encryptedText = AES.encrypt(text, secretKey).toString();
  return encryptedText;
};
