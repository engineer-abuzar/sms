import CryptoJS from "crypto-js";

const BACKEND_KEY =
  process.env.BACKEND_ENCRYPTION_KEY || "backend-secret-key-32-characters!";

export function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(data, BACKEND_KEY).toString();
}

export function decryptData(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, BACKEND_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
