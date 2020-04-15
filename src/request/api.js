import axios from 'axios';
import { message } from 'antd';

// 取消请求
const { CancelToken } = axios;
axios.create({
  timeout: 6000, // 请求超时时间
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// 请求方法
export const MethodType = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

// 开始请求设置，发起拦截处理
axios.interceptors.request.use((config) => {
  // 得到参数中的requestname字段，用于决定下次发起请求，取消相应的  相同字段的请求
  // post和get请求方式的不同，使用三木运算处理
  const requestName = config.method === 'post' ? config.data.requestName : config.params.requestName;
  // 判断，如果这里拿到上一次的requestName，就取消上一次的请求
  const newConfig = Object.assign({}, ...config);
  if (requestName) {
    if (axios[requestName] && axios[requestName].cancel) {
      axios[requestName].cancel();
    }
    newConfig.cancelToken = new CancelToken((c) => {
      axios[requestName] = {};
      axios[requestName].cancel = c;
    });
  }
  return newConfig;
}, (error) => Promise.reject(error));

// respone拦截器
axios.interceptors.response.use((response) => {
  const res = response.data;
  // 这里根据后台返回来设置
  if (response.status !== 200 && res.status !== 200) {
    message.error(response.data.message);
    // notification.error({
    //     message: res.status,
    //     description: res.message,
    // })
  } else {
    return response.data;
  }
  return Promise.reject(response);
},
(error) => {
  if (error === undefined || error.code === 'ECONNABORTED') {
    message.warning('服务请求超时');
    return Promise.reject(error);
  }
  const { response: { status } } = error;
  const { response } = error;

  if (status === 400) {
    message.warning('账户或密码错误！');
  }
  const info = response.data;
  if (status === 401 || info.status === 40101) {
    message.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning',
    });
  }
  if (status === 403) {
    message.warning({
      title: '禁止',
      message: info.message,
      type: 'error',
      duration: 2 * 1000,
    });
  }
  return Promise.reject(error);
});

// 通过token请求
export const request = (api, method = MethodType.GET, params = {}, config = {}) => {
  const apiToken = '************';
  const data = (method === 'GET') ? 'params' : 'data';
  let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiToken}`,
  };
  if (config.headers) {
    headers = {
      ...headers,
      ...config.headers,
    };
  }
  return new Promise((resolve, reject) => {
    axios({
      url: api,
      method,
      [data]: params,
      headers,
    }).then(resolve)
      .catch((error) => {
        message.error(typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data));
        reject(error);
      });
  });
};
