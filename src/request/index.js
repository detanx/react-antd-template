/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:26:45
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-21 15:10:11
 */
import axios from 'axios';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { WARNING_DUATION_TIME } from '@/common/constant';

// 请求方法
export const AXIOS_METHOD_TYPET = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

export const AXIOS_TIME_OUT = 30000; // 请求超时时间
export const AXIOS_SUCCESS_CODE = 200; // 请求成功码

const { confirm } = Modal;

axios.defaults.timeout = AXIOS_TIME_OUT; // 请求超时时间
axios.defaults.withCredentials = true; // 请求携带cookie
axios.defaults.baseURL = '';

const pending = []; // 声明一个数组用于存储每个请求的取消函数和请求标识
const { CancelToken } = axios;
const removePending = config => {
  for (const p in pending) {
    if (pending[p].u === `${config.url}&${config.method}`) {
      // 当当前请求在数组中存在时执行函数体
      pending[p].f(); // 执行取消操作
      pending.splice(p, 1); // 把这条记录从数组中移除
    }
  }
};

// 添加发起拦截器
axios.interceptors.request.use(
  config => {
    config.data = JSON.stringify(config.data);
    removePending(config); // 在一个发送请求前执行一下取消操作
    config.cancelToken = new CancelToken(c => {
      // 这里的请求标识是用请求地址&请求方式拼接的字符串，你可以选择其他的一些方式
      pending.push({ u: `${config.url}&${config.method}`, f: c });
    });
    return config;
  },
  error => Promise.reject(error)
);

// 添加响应拦截器
axios.interceptors.response.use(
  // 处理响应数据
  response => {
    removePending(response.config); // 请求成功后，从pending中移除
    return response;
  },
  // 处理响应错误
  error => {
    if (error === undefined || error.code === 'ECONNABORTED') {
      message.warning('服务请求超时');
      return Promise.reject(error);
    }
    const {
      response: { status }
    } = error;
    const { response } = error;
    const info = response.data;
    if (status === 401 || info.status === 40101) {
      confirm({
        title: '已登出',
        icon: <ExclamationCircleOutlined />,
        content: '你已被登出，可以取消继续留在该页面，或者重新登录？',
        okText: '重新登录',
        cancelText: '取消',
        onOk() {
          window.open(`http://${window.location.host}`, '_self');
        },
        onCancel() {}
      });
    }
    if (status === 403) {
      message.warning({
        title: '禁止',
        message: info.message,
        type: 'error',
        duration: WARNING_DUATION_TIME
      });
    }
    return Promise.reject(error);
  }
);

const request = (api, method = AXIOS_METHOD_TYPET.GET, params = {}, config = {}) => {
  const data = method === 'GET' ? 'params' : 'data';
  let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  };
  if (config.headers) {
    headers = {
      ...headers,
      ...config.headers
    };
  }
  return axios({
    url: api,
    method,
    [data]: params,
    headers
  });
};

export default request;
