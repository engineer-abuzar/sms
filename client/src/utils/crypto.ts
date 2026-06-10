import CryptoJS from "crypto-js";

const FRONTEND_KEY =
  import.meta.env.VITE_FRONTEND_ENCRYPTION_KEY ||
  "frontend-secret-key-32-characters!";

export function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(data, FRONTEND_KEY).toString();
}

export function decryptData(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, FRONTEND_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
