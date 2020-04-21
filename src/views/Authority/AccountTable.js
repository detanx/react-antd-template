/*
 * @Author: 刘玉田
 * @Date: 2020-04-17 18:26:55
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-21 14:57:09
 */
import { useEffect, useState } from 'react';
import { List, Button, Checkbox, message, Modal, Row, Col } from 'antd';
import request, { AXIOS_SUCCESS_CODE } from '@/request/index';

const AccountTable = ({ queryData, isSearching }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);

  // 获取用户列表
  useEffect(() => {
    const url = '/stockserver/user';
    request(url, 'GET')
      .then(response => {
        if (response.status === AXIOS_SUCCESS_CODE) {
          setDataSource(response.data);
        } else {
          message.error('获取用户列表失败');
        }
      })
      .catch(error => {
        console.log(error);
        message.error('获取用户列表失败');
      })
      .finally(() => setLoading(false));
  }, []);

  function onChange(e, value) {
    message.info(`checked ${value.username} = ${e.target.checked}`);
  }

  // 重置密码
  function resetPassword(value) {
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

  function resetPasswordRequest(value) {
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

  // 删除账户
  function deleteAccount(value) {
    Modal.confirm({
      content: (
        <div>
          请确认删除账号：
          <span style={{ color: '#1890ff' }}>{value.username}</span>
        </div>
      ),
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        deleteAccountRequest(value);
      }
    });
  }

  function deleteAccountRequest(value) {
    const url = `/stockserver/user/${value.username}`;

    function filterDataSource() {
      const newDataSource = [].concat(dataSource);
      const deleteIndex = newDataSource.findIndex(v => v.username === value.username);
      newDataSource.splice(deleteIndex, 1);
      setDataSource(newDataSource);
    }

    request(url, 'DELETE')
      .then(response => {
        if (response.status === AXIOS_SUCCESS_CODE) {
          message.success('删除账号成功');
          filterDataSource();
        } else {
          message.error('删除账号失败');
        }
      })
      .catch(error => {
        console.log(error);
        message.error('删除账号失败');
      });
  }

  function renderItem(value) {
    const isAdmin = value.username.toLowerCase() === 'admin';

    return (
      <List.Item key={value.username}>
        <Row className="flex-1" justify="space-between" align="middle">
          <Col sm={8}>
            账号：
            {value.username}
          </Col>
          <Col sm={8}>
            权限：
            <Checkbox defaultChecked={true}>商品管理</Checkbox>
          </Col>
          <Col sm={8}>
            <Row align="middle" justify="end">
              操作：
              <Col>
                <Button
                  disabled={isAdmin}
                  type="link"
                  size="small"
                  onClick={() => resetPassword(value)}>
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
          </Col>
        </Row>
      </List.Item>
    );
  }

  return (
    <section className="account-table">
      <List
        bordered
        loading={loading}
        dataSource={isSearching ? queryData : dataSource}
        renderItem={value => renderItem(value)}></List>
    </section>
  );
};

export default AccountTable;
