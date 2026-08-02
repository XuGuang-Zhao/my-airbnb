/**
 * 成功响应
 */
export function resSuccess<T>(data?: T, message = "操作成功") {
  return {
    code: 200,
    message,
    data,
  };
}

/**
 * 业务失败响应
 */
export function resFail<T>(code: number, message: string, data?: T | null) {
  return {
    code,
    message,
    data: data ?? null,
  };
}
