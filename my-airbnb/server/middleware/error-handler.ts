export default defineEventHandler(async (event) => {
  try {
    // 等待后续接口执行
    await event._handler(event);
  } catch (err: any) {
    // 捕获所有接口异常，标准化返回格式
    const statusCode = err.statusCode || 500;
    const message = err.statusMessage || "服务器内部错误";

    setResponseStatus(event, statusCode);
    return {
      success: false,
      code: statusCode,
      message,
    };
  }
});
