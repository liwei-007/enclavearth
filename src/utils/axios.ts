import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const baseURL =
  "https://dashscope.aliyuncs.com/api/v1/apps/d7045172f58049279283515fa53f98bd/completion";

// 创建 axios 实例
const service = axios.create({
  baseURL,
  timeout: 60000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer sk-a617d9a5934742f692defb0d8d7b6782`,
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    // 在发送请求之前做些什么，例如添加 token
    config.headers = {
      ...config.headers,
    };
    console.log("header", config.headers);
    return config;
  },
  (error: AxiosError) => {
    // 处理请求错误
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    const { data } = response;
    return data;
  },
  (error: AxiosError) => {
    // 处理响应错误
    console.error("响应错误:", error);
    if (error.response) {
      // 请求已发送，服务器返回了非 2xx 状态码
      switch (error.response.status) {
        case 401:
          // 处理未授权的情况，例如跳转到登录页
          console.log("未授权，请登录");
          break;
        case 404:
          console.log("请求的资源不存在");
          break;
        case 500:
          console.log("服务器内部错误");
          break;
        default:
          console.log(`请求错误，状态码: ${error.response.status}`);
      }
    } else if (error.request) {
      // 请求已发送，但没有收到响应
      console.log("没有收到服务器响应");
    } else {
      // 在设置请求时发生错误
      console.log("请求设置错误:", error.message);
    }
    return Promise.reject(error);
  }
);

// 封装请求方法
const request = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config);
  },
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config);
  },
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config);
  },
};

export default request;
