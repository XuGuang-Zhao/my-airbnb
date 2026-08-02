import prisma from "#server/utils/prisma";
import { verifyToken } from "#server/utils/auth";
import { resSuccess } from "#server/utils/response";
import { getCookie, deleteCookie } from "h3";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "airbnb_token");

  // 如果有 token，尝试删除数据库会话（失败不影响登出）
  if (token) {
    const { sessionKey } = await verifyToken(token);
    await prisma.userSession.deleteMany({ where: { tokenKey: sessionKey } });
  }

  // 无论如何，清除客户端 cookie
  deleteCookie(event, "airbnb_token", { path: "/" });

  return resSuccess(null, "退出登录成功");
});
