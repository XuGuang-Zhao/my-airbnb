import { PrismaClient } from "@prisma/client";
import { verifyToken } from "~/server/utils/auth";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "airbnb_token");
  if (token) {
    try {
      const payload = await verifyToken(token);
      // 删除当前会话
      await prisma.userSession.deleteMany({
        where: { tokenKey: payload.sessionKey },
      });
    } catch {
      // token无效直接忽略
    }
  }

  deleteCookie(event, "airbnb_token", { path: "/" });

  return {
    success: true,
    message: "已成功登出",
  };
});
