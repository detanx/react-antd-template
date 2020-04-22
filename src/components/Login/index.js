/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:31:22
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-22 15:12:58
 */
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import request, { AXIOS_SUCCESS_CODE } from '@/request/index';
import './index.less';

const layout = {
  labelCol: {
    span: 0
  },
  wrapperCol: {
    span: 24
  }
};
const rules = {
  username: [
    {
      required: true,
      message: '用户名不能为空！'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空！'
    }
  ]
};

function Login() {
  const history = useHistory();
  const [form] = Form.useForm();

  const onFinish = values => {
    request('/stockserver/user/login', 'PUT', values)
      .then(response => {
        const { status, data, statusText } = response;
        if (status === AXIOS_SUCCESS_CODE) {
          localStorage.setItem('limit', data.isAdmin);
          localStorage.setItem('user', data.username);
          history.push('/app');
        } else {
          message.error(statusText);
        }
      })
      .catch(error => {
        message.error('用户名或密码错误');
      });
  };

  return (
    <Form className="login" {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <h1>库存管理系统</h1>
      <Form.Item name="username" label="" rules={rules.username}>
        <Input
          size="large"
          style={{ backgroundColor: '#ffffff' }}
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="用户名"
        />
      </Form.Item>
      <Form.Item name="password" label="" rules={rules.password}>
        <Input
          size="large"
          type="password"
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="密码"
        />
      </Form.Item>
      <Form.Item className="login-button">
        <Button type="primary" size="large" htmlType="submit">
          登录
        </Button>
      </Form.Item>
      {/* <Form.Item className="register-forget-pwd">
        <span onClick={() => history.push('/register')}>去注册</span>
        <span>忘记密码？</span>
      </Form.Item> */}
    </Form>
  );
}
export default Login;
