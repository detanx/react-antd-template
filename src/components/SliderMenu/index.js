/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:31:41
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-23 11:42:13
 */
import useWinSize, { maxIpadSize } from '@/hooks/useWinSize';
import logo from '@/imgs/logo.svg';
import request, { AXIOS_SUCCESS_CODE } from '@/request/index';
import { Layout, Menu, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import './index.less';
import { defaultOpenKeys, meunArray } from './meunConfig';

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
      .then(response => {
        const { status, data, statusText } = response;
        if (status === AXIOS_SUCCESS_CODE) {
          setUser(data);
        } else {
          message.error(statusText);
        }
      })
      .catch(error => {
        message.error(error.message);
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
    <Sider
      trigger={null}
      className={`slider-menu ${width < maxIpadSize && 'max1024-slider-menu'}`}
      collapsible
      collapsed={props.collapsed}>
      <div className="slider-menu-logo" onClick={() => routerJump('/app')}>
        <img src={logo} alt="logo" />
        {props.collapsed ? null : <h1>商品管理</h1>}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        onClick={meunClick}
        defaultSelectedKeys={['/app']}
        defaultOpenKeys={defaultOpenKeys}
        selectedKeys={[activeMenu]}>
        {getMenu(meunArray)}
      </Menu>
    </Sider>
  );
}

export default withRouter(SliderMenu);
