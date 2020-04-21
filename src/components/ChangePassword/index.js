/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:30:38
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-21 14:53:55
 */
import './index.less';
import { useState } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { Input, Button, message, PageHeader } from 'antd';
import { useHistory } from 'react-router-dom';
import request, { AXIOS_SUCCESS_CODE } from '@/request/index';
import { isEmpty, checkRule } from '@/common/util';

const ChangePassword = () => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordSure, setNewPasswordSure] = useState('');

  const handleSubmit = () => {
    if (isEmpty(password)) {
      message.error('请输入当前密码');
      return;
    }

    if (isEmpty(newPassword)) {
      message.error('请输入新密码');
      return;
    }

    if (isEmpty(newPasswordSure)) {
      message.error('请输入确认密码');
      return;
    }

    if (checkRule(newPassword) || checkRule(newPasswordSure)) {
      message.error('密码不符合规则。');
      return;
    }

    if (newPassword !== newPasswordSure) {
      message.error('两次输入密码不一致。');
      return;
    }

    resetPassword();
  };

  const resetPassword = () => {
    request('/stockserver/user/password', 'PUT', {
      newPassword,
      password
    })
      .then(response => {
        const { status, statusText } = response;
        if (status === AXIOS_SUCCESS_CODE) {
          message.success('修改密码成功');
          history.push('/');
        } else {
          message.error(statusText);
        }
      })
      .catch(error => {
        message.error(error);
      });
  };

  return (
    <section className="change-password">
      <div className="change-password-top">
        <LeftOutlined className="change-password-top-icon" onClick={() => history.push('/app')} />
        <PageHeader title="修改密码" className="module-header" />
      </div>
      <div className="change-password-cover">
        <div className="change-password-old-password">
          <Input.Password
            size="large"
            prefix="当前密码"
            placeholder="请输入当前登录密码"
            allowClear
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="change-password-new-password ml-20">
          <Input.Password
            size="large"
            prefix="新密码"
            placeholder="请输入新密码"
            allowClear
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>
        <div className="change-password-new-password-sure">
          <Input.Password
            size="large"
            prefix="确认新密码"
            placeholder="请确认新密码"
            allowClear
            onChange={e => setNewPasswordSure(e.target.value)}
          />
        </div>
        <p className="change-password-tip">6-20个以字母开头、可带数字、“_”、“.”</p>
        <div className="change-password-submit-container">
          <Button type="primary" size="large" onClick={handleSubmit}>
            确认
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
