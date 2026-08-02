import { setCookie } from "h3";
import prisma from "#server/utils/prisma";
import {
  comparePassword,
  createToken,
  genSessionKey,
} from "#server/utils/auth";
import { resSuccess, resFail } from "#server/utils/response";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { email, password } = await readBody(event);

  if (!email || !password) {
    return resFail(500, "邮箱和密码不能为空");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !comparePassword(password, user.password)) {
    return resFail(500, "邮箱或密码错误");
  }

  const sessionKey = genSessionKey();
  // 从 config 读取，若未定义则使用默认 7
  const expireDays = Number(config.SESSION_MAX_DAYS) || 7;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expireDays);

  await prisma.userSession.create({
    data: {
      userId: user.id,
      tokenKey: sessionKey,
      expiresAt,
      ipAddress: getRequestIP(event, { xForwardedFor: true }) ?? undefined,
      userAgent: event.headers.get("user-agent") ?? undefined,
    },
  });

  const token = await createToken(user.id, sessionKey);
  setCookie(event, "airbnb_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: expireDays * 24 * 60 * 60,
  });

  const { password: _, ...safeUser } = user;
  return resSuccess(safeUser, "登录成功");
});
