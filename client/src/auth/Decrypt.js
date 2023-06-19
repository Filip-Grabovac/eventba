import { AES, enc } from "crypto-js";

export const Decrypt = (encryptedText, secretKey) => {
  const decryptedText = AES.decrypt(encryptedText, secretKey).toString(
    enc.Utf8
  );
  return decryptedText;
};
