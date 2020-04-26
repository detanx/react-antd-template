/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:31:53
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-26 10:08:10
 */
import { ShopOutlined, UsergroupAddOutlined } from '@ant-design/icons';

export const meunArray = [
  {
    // key: 'sub0',
    // title: '商品管理',
    // icon: UserOutlined,
    // link: '/app',
    // roles: ['true', 'false'],
    // child: [
    //   {
    key: '/app',
    title: '商品列表',
    icon: ShopOutlined,
    roles: ['true', 'false'],
    link: '/app'
    //   }
    // ]
  },
  {
    // key: 'sub1',
    // title: '权限管理',
    // icon: LockOutlined,
    // link: '/app/limit',
    // roles: ['true'],
    // child: [
    //   {
    key: '/app/limit',
    title: '用户管理',
    icon: UsergroupAddOutlined,
    roles: ['true', 'false'],
    link: '/app/limit'
    //   }
    // ]
  }
];

export const defaultOpenKeys = ['sub0', 'sub1'];
