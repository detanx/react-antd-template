/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:30:53
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-21 14:56:45
 */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Layout, Menu, Dropdown, message } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import useWinSize, { maxIpadSize } from '@/hooks/useWinSize';
import request, { AXIOS_SUCCESS_CODE } from '@/request/index';
import admin from '@/imgs/admin.png';
import logo from '@/imgs/logo.svg';
import './index.less';

const { Header } = Layout;

const CommonHeader = props => {
  const history = useHistory();
  const { width } = useWinSize();
  const routerJump = address => {
    history.push(address);
  };
  const loginOut = () => {
    request('/stockserver/user/logout', 'DELETE')
      .then(response => {
        if (response.status === AXIOS_SUCCESS_CODE) {
          message.success('退出成功', 1);
          history.push('/');
        } else {
          message.error(response.statusText);
        }
      })
      .catch(error => {
        message.error(error);
      });
  };
  const menu = (
    <Menu style={{ textAlign: 'center' }}>
      <Menu.Item>
        <span className="common-header-right-changepwd" onClick={() => routerJump('/password')}>
          修改密码
        </span>
      </Menu.Item>
      <Menu.Item>
        <span className="common-header-right-out" onClick={loginOut}>
          登出
        </span>
      </Menu.Item>
    </Menu>
  );
  return (
    <Header className="common-header" style={{ padding: 0 }}>
      <div className="common-header-left">
        {width < maxIpadSize && (
          <img
            className="common-header-logo"
            onClick={() => routerJump('/app')}
            src={logo}
            alt="logo"
          />
        )}
        {width < maxIpadSize
          ? React.createElement(props.collapsed ? MenuFoldOutlined : MenuUnfoldOutlined, {
              className: 'trigger',
              onClick: props.toggle
            })
          : React.createElement(props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: props.toggle
            })}
      </div>
      <div className="common-header-right">
        <Dropdown className="common-header-right-drop" overlay={menu} placement="bottomRight">
          <div className="common-header-right-user">
            <img src={admin} alt="user-img" />
            <span>{localStorage.getItem('user')}</span>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};
export default CommonHeader;
