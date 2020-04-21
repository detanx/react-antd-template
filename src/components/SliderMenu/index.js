/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:31:41
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-21 14:54:45
 */
import React, { useState, useEffect } from 'react';
import { Menu, Layout, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { withRouter } from 'react-router';
import useWinSize, { maxIpadSize } from '@/hooks/useWinSize';
import request, { AXIOS_SUCCESS_CODE } from '@/request/index';
import logo from '@/imgs/logo.svg';
import { defaultOpenKeys, meunArray } from './meunConfig';
import './index.less';

const { SubMenu } = Menu;
const { Sider } = Layout;

function SliderMenu(props) {
  const [user, setUser] = useState({ isAdmin: false });
  const history = useHistory();
  const { width } = useWinSize();

  const { pathname } = history.location;
  const [activeMenu, setActiveMenu] = useState(pathname);

  const routerJump = link => {
    history.push(link);
    setActiveMenu('/app');
    if (width < maxIpadSize) {
      props.toggle(false);
    }
  };

  useEffect(() => {
    request('/stockserver/user/login-user', 'GET')
      .then(res => {
        const { status, data, statusText } = res;
        if (status === AXIOS_SUCCESS_CODE) {
          setUser(data);
        } else {
          message.error(statusText);
        }
      })
      .catch(error => {
        message.error(error);
      });
  }, []);

  const getMenu = meun =>
    meun.map(item => {
      const limit = String(user.isAdmin);
      if (!item.child) {
        return item.roles.includes(limit) ? (
          <Menu.Item key={item.key} onClick={() => routerJump(item.link)}>
            {React.createElement(item.icon)}
            <span>{item.title}</span>
          </Menu.Item>
        ) : null;
      }
      return item.roles.includes(limit) ? (
        <SubMenu
          key={item.key}
          title={
            <span onClick={() => routerJump(item.link)}>
              {React.createElement(item.icon)}
              <span>{item.title}</span>
            </span>
          }>
          {getMenu(item.child)}
        </SubMenu>
      ) : null;
    });

  const meunClick = e => {
    setActiveMenu(e.key);
  };

  return (
    <Sider trigger={null} className="slider-menu" collapsible collapsed={props.collapsed}>
      <div className="slider-menu-logo" onClick={() => routerJump('/app')}>
        <img src={logo} alt="logo" />
        {props.collapsed ? null : <h1>商品管理</h1>}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        onClick={meunClick}
        defaultSelectedKeys={['/app/in']}
        defaultOpenKeys={defaultOpenKeys}
        selectedKeys={[activeMenu]}>
        {getMenu(meunArray)}
      </Menu>
    </Sider>
  );
}

export default withRouter(SliderMenu);
