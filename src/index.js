import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';
import App from './App';

hot(App);
const render = Component => {
  ReactDOM.render(
    <ConfigProvider locale={zhCN}>
      <Component />
    </ConfigProvider>,
    document.getElementById('root')
  );
};

render(App);
