import prisma from "#server/utils/prisma";
import { hashPassword } from "#server/utils/auth";
import { resSuccess, resFail } from "#server/utils/response";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    email: string;
    password: string;
  }>(event);
  const { email, password } = body;
  // 基础参数校验
  if (!email?.trim() || !password) {
    return resFail(500, "邮箱和密码不能为空");
  }
  const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailReg.test(email.trim())) {
    return resFail(500, "邮箱格式不正确");
  }
  if (password.length < 6) {
    return resFail(500, "密码至少6位字符");
  }
  // 先校验邮箱是否已注册（邮箱冲突必须提前拦截，不需要重试）
  const trimEmail = email.trim();
  const existsEmail = await prisma.user.findUnique({
    where: { email: trimEmail },
  });
  if (existsEmail) {
    return resFail(500, "邮箱已注册，请直接登录");
  }
  const passwordHash = hashPassword(password);
  const newUser = await prisma.user.create({
    data: {
      email: trimEmail,
      name: trimEmail,
      password: passwordHash,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      createdAt: true,
    },
  });
  // 重试耗尽仍然创建失败
  if (!newUser) {
    return resFail(500, "账号创建失败，请稍后重试");
  }
  return resSuccess(newUser, "账号创建成功");
});
