import { PrismaClient } from "@prisma/client";
import {
  comparePassword,
  createToken,
  genSessionKey,
} from "~/server/utils/auth";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { email, password } = await readBody(event);

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: "邮箱和密码不能为空" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !comparePassword(password, user.password)) {
    throw createError({ statusCode: 401, statusMessage: "账号或密码错误" });
  }

  // 创建会话
  const sessionKey = genSessionKey();
  const expireDay = Number(config.SESSION_MAX_DAYS);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expireDay);

  await prisma.userSession.create({
    data: {
      userId: user.id,
      tokenKey: sessionKey,
      expiresAt,
      ipAddress: getRequestIP(event, { xForwardedFor: true }),
      userAgent: event.headers.get("user-agent"),
    },
  });

  // 生成令牌
  const token = await createToken(user.id, sessionKey);

  // 设置HttpOnly Cookie
  setCookie(event, "airbnb_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: expireDay * 24 * 60 * 60,
  });

  return {
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    },
  };
});
