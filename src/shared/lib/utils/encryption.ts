import crypto from "crypto";

// It must be a 32-byte (256-bit) key. Generate one in the terminal using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new Error(
    "Invalid ENCRYPTION_KEY. Ensure it is set in environment variables and is a 64-character hex string (32 bytes).",
  );
}

const key = Buffer.from(ENCRYPTION_KEY, "hex");

export const encrypt = (text: string): string => {
  if (!text) return text;

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  // Prepend IV and authTag to the encrypted text for storage
  return iv.toString("hex") + authTag.toString("hex") + encrypted;
};

export const decrypt = (encryptedText: string): string => {
  if (!encryptedText) return encryptedText;

  // Optimization: Very short strings are unlikely to be our encrypted format.
  // Adjust length check based on IV_LENGTH + AUTH_TAG_LENGTH if needed.
  if (encryptedText.length < (IV_LENGTH + AUTH_TAG_LENGTH) * 2) {
    // Too short to contain IV + AuthTag + data in hex, assume plaintext.
    // console.warn(`Skipping decryption for potentially plaintext short string: ${encryptedText.substring(0, 10)}...`);
    return encryptedText;
  }

  try {
    const encryptedBuffer = Buffer.from(encryptedText, "hex");

    // Basic check: Ensure buffer is long enough for IV and AuthTag
    if (encryptedBuffer.length < IV_LENGTH + AUTH_TAG_LENGTH) {
      throw new Error("Invalid encrypted data format: too short");
    }

    const iv = encryptedBuffer.subarray(0, IV_LENGTH);
    const authTag = encryptedBuffer.subarray(
      IV_LENGTH,
      IV_LENGTH + AUTH_TAG_LENGTH,
    );
    const encryptedData = encryptedBuffer.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    // Ensure we actually have some data after IV and AuthTag
    if (encryptedData.length === 0) {
      throw new Error("Invalid encrypted data format: no data");
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString("utf8");
  } catch (error) {
    // If decryption fails, assume it's unencrypted plaintext from before implementation.
    // Log the error for monitoring purposes.
    console.warn(
      `Decryption failed for a tot, returning original content. Error: ${error instanceof Error ? error.message : error}. Content snippet: ${encryptedText.substring(0, 50)}...`,
    );
    // Return the original text assuming it was plaintext.
    return encryptedText;
  }
};
