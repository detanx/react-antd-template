/*
 * @Author: 刘玉田
 * @Date: 2020-04-17 18:24:10
 * @Last Modified by: 刘玉田
 * @Last Modified time: 2020-04-22 17:20:10
 */
import { useState } from 'react';
import { Input, Button, message, Form, Card } from 'antd';
import { checkRule, checkUsernameRule } from '@/common/util';
import request, { AXIOS_SUCCESS_CODE } from '@/request/index';

const layout = {
  labelCol: {
    span: 2
  },
  wrapperCol: {
    span: 10
  }
};

const tailLayout = {
  wrapperCol: { span: 12 }
};

const AddAccount = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = values => {
    const { username } = values;
    const { password } = values;
    const { passwordSure } = values;

    if (checkUsernameRule(username) || checkRule(password) || checkRule(passwordSure)) {
      message.error('账号/密码不符合规则');
      return;
    }

    if (password !== passwordSure) {
      message.error('两次输入密码有误');
      return;
    }

    setLoading(true);
    const url = '/stockserver/user';
    const params = { username, password };
    request(url, 'POST', params)
      .then(res => {
        if (res.status === AXIOS_SUCCESS_CODE) {
          form.resetFields();
          message.success('添加账号成功');
        } else {
          message.success('添加账号失败');
        }
      })
      .catch(err => {
        const { data } = err.response;
        const { error } = data;
        const info = `添加账号失败。${error || data}`;
        message.error(info);
      })
      .finally(() => setLoading(false));
  };

  const validateMessages = {
    required: '请输入${label}!'
  };

  return (
    <section className="add-account">
      <Card title="添加账号">
        <Form
          form={form}
          {...layout}
          validateMessages={validateMessages}
          name="add-account"
          onFinish={onFinish}>
          <Form.Item
            name="username"
            label="用户名"
            extra="必须是2-20个英文字母、数字或符号"
            rules={[
              {
                required: true
              }
            ]}>
            <Input placeholder="用户名" allowClear />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true
              }
            ]}>
            <Input type="password" placeholder="密码" allowClear />
          </Form.Item>
          <Form.Item
            name="passwordSure"
            label="确认密码"
            extra="必须是6-20个英文字母、数字或符号"
            rules={[
              {
                required: true
              }
            ]}>
            <Input type="password" placeholder="确认密码" allowClear />
          </Form.Item>
          <Form.Item {...tailLayout} style={{ textAlign: 'center' }}>
            <Button loading={loading} type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </section>
  );
};

export default AddAccount;
