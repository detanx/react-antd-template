/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:31:22
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-23 14:59:57
 */
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { USERNAME_REGEXP, PASSWORDE_REGEXP } from '@/common/constant';
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
    },
    {
      pattern: USERNAME_REGEXP,
      message: '只含字母、数字、下划线，2-16个字符！',
      validateTrigger: 'onChange'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空！'
    },
    {
      pattern: PASSWORDE_REGEXP,
      message: '以字母开头,可带数字、“_”、“.”,6-20个字符！',
      validateTrigger: 'onChange'
    }
  ]
};

const Register = () => {
  const history = useHistory();
  const [form] = Form.useForm();

  const onFinish = values => {
    request('/stockserver/user', 'POST', values)
      .then(response => {
        if (response.status === AXIOS_SUCCESS_CODE) {
          message.success('注册成功', 1);
          history.push('/');
        } else {
          message.error(response.statusText);
        }
      })
      .catch(() => {
        message.error('用户已存在', 1);
      });
  };

  return (
    <Form className="login" {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <h1>注册</h1>
      <Form.Item name="username" label="" hasFeedback rules={rules.username}>
        <Input
          type="text"
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="用户名"
        />
      </Form.Item>
      <Form.Item name="password" label="" hasFeedback rules={rules.password}>
        <Input
          type="password"
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="密码"
        />
      </Form.Item>
      <Form.Item className="login-button">
        <Button type="primary" htmlType="submit">
          注册
        </Button>
      </Form.Item>
      <Form.Item className="register-forget-pwd">
        <span onClick={() => history.push('/')}>去登录</span>
      </Form.Item>
    </Form>
  );
};
export default Register;
