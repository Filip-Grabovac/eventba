var CryptoJS = require("crypto-js");
// Function for decrypting password
const Decrypt = (encryptedText, secretKey) => {
  var bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = Decrypt;
