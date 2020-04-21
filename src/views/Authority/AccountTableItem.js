/*
 * @Author: 刘玉田
 * @Date: 2020-04-21 15:48:31
 * @Last Modified by: 刘玉田
 * @Last Modified time: 2020-04-21 17:13:45
 */

import { useState } from 'react';
import { List, Row, Col, Checkbox, Button, message, Modal } from 'antd';
import request, { AXIOS_SUCCESS_CODE } from '@/request/index';

const AccountTableItem = ({ value, deleteAccount }) => {
  const [loading, setLoading] = useState(false);

  const { isAdmin, permissions } = value;
  // 超级管理员 可以操作自身以及子用户 管理员，不能操作超级管理员
  const isSuperAdmin = isAdmin && localStorage.getItem('user') === 'admin';
  const defaultChecked = permissions.length > 0;

  function onChange(e) {
    setLoading(true);
    const { checked } = e.target;
    const { username } = value;
    const id = 1;
    const url = `/stockserver/user/${username}/permission/${id}`;
    const method = checked ? 'PUT' : 'DELETE';

    request(url, method)
      .then(res => {
        if (res.status === AXIOS_SUCCESS_CODE) {
          message.info('操作成功');
        } else {
          message.error('操作失败');
        }
      })
      .catch(err => {
        console.log(err);
        message.error('操作失败');
      })
      .finally(() => setLoading(false));
  }

  // 重置密码
  function resetPassword() {
    Modal.confirm({
      title: `确定重置 ${value.username} 的密码`,
      content: '重置后密码为6个0',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        resetPasswordRequest(value);
      }
    });
  }

  function resetPasswordRequest() {
    const url = `/stockserver/user/${value.username}/password`;
    request(url, 'PUT')
      .then(response => {
        if (response.status === AXIOS_SUCCESS_CODE) {
          message.success('重置密码成功');
        } else {
          message.error('重置密码失败');
        }
      })
      .catch(error => {
        console.log(error);
        message.error('重置密码失败');
      });
  }

  function checkBoxDisabled() {
    if (isSuperAdmin) {
      return loading;
    }
    if (isAdmin && value.username === 'admin') {
      return true;
    }
    return loading;
  }

  return (
    <List.Item>
      <Row className="flex-1" justify="space-between" align="middle">
        <Col sm={8}>
          账号：
          {value.username}
        </Col>
        <Col sm={8}>
          权限：
          <Checkbox
            defaultChecked={defaultChecked}
            disabled={checkBoxDisabled()}
            onChange={e => onChange(e)}>
            商品管理
          </Checkbox>
        </Col>
        <Col sm={8}>
          {!isAdmin && (
            <Row align="middle" justify="end">
              操作：
              <Col>
                <Button disabled={isAdmin} type="link" size="small" onClick={resetPassword}>
                  重置密码
                </Button>
              </Col>
              <Col>
                <Button
                  disabled={isAdmin}
                  type="link"
                  size="small"
                  onClick={() => deleteAccount(value)}>
                  删除账号
                </Button>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </List.Item>
  );
};

export default AccountTableItem;