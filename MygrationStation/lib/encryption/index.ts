import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Returns the 256-bit encryption key from the environment.
 * Key must be a 64-character hex string (32 bytes).
 */
function getEncryptionKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }
  if (keyHex.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY must be a 64-character hex string (256 bits)"
    );
  }
  return Buffer.from(keyHex, "hex");
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 *
 * Returns a string in the format: iv:authTag:ciphertext (all hex-encoded).
 * This format is stored directly in the database.
 *
 * @param plaintext - The value to encrypt (e.g., an EIN or ITIN)
 * @returns Encrypted string in iv:authTag:ciphertext format
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypt a string that was encrypted with the encrypt() function.
 *
 * @param encryptedValue - String in iv:authTag:ciphertext format
 * @returns The original plaintext
 * @throws Error if decryption fails (wrong key, tampered data, etc.)
 */
export function decrypt(encryptedValue: string): string {
  const key = getEncryptionKey();
  const parts = encryptedValue.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted value format. Expected iv:authTag:ciphertext");
  }

  const [ivHex, authTagHex, ciphertext] = parts;

  if (!ivHex || !authTagHex || !ciphertext) {
    throw new Error("Invalid encrypted value: missing components");
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Encrypt an EIN value. Validates format before encryption.
 * EIN format: XX-XXXXXXX (9 digits with hyphen)
 */
export function encryptEin(ein: string): string {
  const cleaned = ein.replace(/\D/g, "");
  if (cleaned.length !== 9) {
    throw new Error("EIN must be exactly 9 digits");
  }
  return encrypt(cleaned);
}

/**
 * Encrypt an ITIN value. Validates format before encryption.
 * ITIN format: 9XX-XX-XXXX (starts with 9)
 */
export function encryptItin(itin: string): string {
  const cleaned = itin.replace(/\D/g, "");
  if (cleaned.length !== 9 || !cleaned.startsWith("9")) {
    throw new Error("ITIN must be 9 digits starting with 9");
  }
  return encrypt(cleaned);
}
