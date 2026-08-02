import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { randomUUID } from "crypto";

// 密码加密
export const hashPassword = (rawPassword: string) => {
  return bcrypt.hashSync(rawPassword, 10);
};

// 密码对比
export const comparePassword = (raw: string, hashStr: string) => {
  return bcrypt.compareSync(raw, hashStr);
};

// 创建JWT
export async function createToken(userId: number, sessionKey: string) {
  const config = useRuntimeConfig();
  const secret = new TextEncoder().encode(config.JWT_SECRET);

  const jwt = await new SignJWT({
    sub: userId,
    sessionKey,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(config.JWT_EXPIRE)
    .sign(secret);
  return jwt;
}

// 校验JWT
export async function verifyToken(token: string) {
  const config = useRuntimeConfig();
  const secret = new TextEncoder().encode(config.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload as { sub: number; sessionKey: string };
}

// 生成会话唯一标识
export function genSessionKey() {
  return randomUUID();
}
