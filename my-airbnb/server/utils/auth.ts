import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { randomUUID } from "crypto";

// 密码加密
export function hashPassword(rawPassword: string) {
  return bcrypt.hashSync(rawPassword, 10);
}

// 密码校验
export function comparePassword(raw: string, hashStr: string) {
  return bcrypt.compareSync(raw, hashStr);
}

// 生成JWT
export async function createToken(userId: number, sessionKey: string) {
  const config = useRuntimeConfig();
  const secret = new TextEncoder().encode(config.JWT_SECRET as string);
  const token = await new SignJWT({ sub: String(userId), sessionKey })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(config.JWT_EXPIRE as string)
    .sign(secret);
  return token;
}

// 解析校验JWT
export async function verifyToken(token: string) {
  const config = useRuntimeConfig();
  const secret = new TextEncoder().encode(config.JWT_SECRET as string);
  const { payload } = await jwtVerify(token, secret);
  return {
    sub: Number(payload.sub),
    sessionKey: payload.sessionKey as string,
  };
}

// 生成会话标识
export function genSessionKey() {
  return randomUUID();
}
