var CryptoJS = require("crypto-js");
// Function for encrypting password
const Encrypt = (encryptedText, secretKey) => {
  return CryptoJS.AES.encrypt(encryptedText.toString(), secretKey).toString();
};

module.exports = Encrypt;
