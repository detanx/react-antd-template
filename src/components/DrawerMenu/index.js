/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:31:09
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-21 11:00:09
 */
import React from 'react';
import { Drawer } from 'antd';
import SliderMenu from '../SliderMenu/index';
import './index.less';

function DrawerMenu(props) {
  return (
    <Drawer
      title=""
      className="drawer-menu"
      placement="left"
      closable={false}
      onClose={props.toggle}
      visible={props.collapsed}>
      <SliderMenu toggle={props.toggle} collapsed={false} />
    </Drawer>
  );
}

export default DrawerMenu;
