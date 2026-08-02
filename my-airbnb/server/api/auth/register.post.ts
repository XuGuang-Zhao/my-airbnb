export default defineEventHandler((event) => {
  // 处理 `api/foo/bar` 端点的 GET 请求
  console.log("event", event);
});
