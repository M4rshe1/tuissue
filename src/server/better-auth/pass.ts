import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptPromise = promisify(scrypt);

export class Pass {
  static async hash(password: string) {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = await scryptPromise(password, salt, 64);
    return salt + ":" + (derivedKey as Buffer).toString("hex");
  }
  static async verify(hash: string, password: string) {
    const [salt, key] = hash.split(":");
    if (!salt || !key) {
      return false;
    }
    const keyBuffer = Buffer.from(key, "hex");
    if (!keyBuffer) {
      return false;
    }
    const derivedKey = await scryptPromise(password, salt, 64);
    return timingSafeEqual(keyBuffer, derivedKey as Buffer);
  }
}
