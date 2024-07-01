import KEYUTIL from "jsrsasign";
import KJUR from "jsrsasign";
import cryptoJs from "crypto-js";

const gwAesKey = "2222@!11113333#*";
const gwAesIv = "1111@!22223333#*";
/*
RSA 公钥 私钥的格式都必须是pem的 -----BEGIN PUBLIC KEY-----\n xxxxxx\n-----END PUBLIC KEY-----
AES 的 key 和iv都必须是16位的
 */
let RSA = {
  /**
   * Encrypts a message using publicKey. string -> hex(result) -> string(for show)
   *
   * @param {string} src The message to encrypt.
   * @param {string} pubk The publicKey using for encrypting.
   *
   * @return {string} rsa ciphered result is a hex, transform to base64string.
   */
  rsaEncode(src, pubk) {
    let publicKey = KEYUTIL.KEYUTIL.getKey(pubk);
    let enc = KJUR.crypto.Cipher.encrypt(src, publicKey);
    return KEYUTIL.hex2b64(enc);
  },
  /**
   * Decrypts a message using privateKey. string(for show) -> hex(for decipher) -> string(result)
   *
   * @param {string} src The message to be decrypted. cuz the encode result is hex2b64, the src should transform to hex
   * @param {string} prik The privateKey using for decrypting.
   *
   * @return {string} rsa ciphered result is a hex, transform to base64string.
   */
  rsaDecode(src, prik) {
    let privateKey = KEYUTIL.KEYUTIL.getKey(prik);
    let h = KEYUTIL.b64tohex(src);
    let enc = KJUR.crypto.Cipher.decrypt(h, privateKey);
    return enc;
  },
  /**
   * encode with aes.
   *
   * @param {string} src The string to be encoded
   * @param {string} key The key of aes.
   * @param {string} iv The iv of aes.
   *
   * @return {string}
   */
  aesEncode(src, key, iv) {
    let aesKey = cryptoJs.enc.Utf8.parse(key);
    let aesIv = cryptoJs.enc.Utf8.parse(iv);
    let aesSrc = cryptoJs.enc.Utf8.parse(src);
    let encrypted = cryptoJs.AES.encrypt(aesSrc, aesKey, {
      iv: aesIv,
      mode: cryptoJs.mode.CBC,
      padding: cryptoJs.pad.Pkcs7,
    });
    return encrypted.toString();
  },
  /**
   * decode with aes.
   *
   * @param {string} src The string to be decoded
   * @param {string} key The key of aes.
   * @param {string} iv The iv of aes.
   *
   * @return {string}
   */
  aesDecode(src, key, iv, enc = "Utf8") {
    const message = src;
    const aesKey = cryptoJs.enc.Utf8.parse(key);
    const aesIv = cryptoJs.enc.Utf8.parse(iv);
    const decrypted = cryptoJs.AES.decrypt(message, aesKey, {
      iv: aesIv,
      mode: cryptoJs.mode.CBC,
      padding: cryptoJs.pad.Pkcs7,
    });
    return decrypted.toString(cryptoJs.enc[enc]);
  },
  rsaAesDecode(src, cipherText, prik) {
    // decode privateKey
    prik = this.aesDecode(prik, gwAesKey, gwAesIv);
    prik =
      "-----BEGIN PRIVATE KEY-----\n" +
      KEYUTIL.hex2b64(prik) +
      "\n-----END PRIVATE KEY-----";

    // decode request aes info
    let dec = this.rsaDecode(cipherText, prik);
    console.log("cipherText is: " + dec);
    let aesKey = cryptoJs.enc.Utf8.parse(dec.slice(0, 16));
    let aesIv = cryptoJs.enc.Utf8.parse(dec.slice(16));

    let decrypt = cryptoJs.AES.decrypt(src, aesKey, {
      iv: aesIv,
      mode: cryptoJs.mode.CBC,
      padding: cryptoJs.pad.Pkcs7,
    });
    return decrypt.toString(cryptoJs.enc.Utf8);
  },
};
export default RSA;
