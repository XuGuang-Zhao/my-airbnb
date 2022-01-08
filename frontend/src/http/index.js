/**
 * 网络请求配置
 */
import axios from 'axios';
import { message } from 'antd';

const service = axios.create({
  timeout: 100000,
  baseURL: 'http://localhost:5005/',
})

/**
  * http request 拦截器
  */
service.interceptors.request.use(
  (config) => {
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type': 'application/json',
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
  * http response 拦截器
  */
service.interceptors.response.use(
  (response) => {
    return response.data;
  }, (error) => {
    if (error.response) {
      message.error(error.response.data.error);
    }
  }
);

export default service;
