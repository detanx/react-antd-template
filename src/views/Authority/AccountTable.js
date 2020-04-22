/*
 * @Author: 刘玉田
 * @Date: 2020-04-17 18:26:55
 * @Last Modified by: 刘玉田
 * @Last Modified time: 2020-04-22 17:21:01
 */
import { useEffect, useState } from 'react';
import { List, message, Modal } from 'antd';
import request, { AXIOS_SUCCESS_CODE } from '@/request/index';
import AccountTableItem from './AccountTableItem';

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
      .catch(() => {
        message.error('获取用户列表失败');
      })
      .finally(() => setLoading(false));
  }, []);

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
      .catch(() => {
        message.error('删除账号失败');
      });
  }

  function renderItem(value) {
    return <AccountTableItem key={value.username} value={value} deleteAccount={deleteAccount} />;
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
