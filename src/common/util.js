/*
 * @Author: 刘玉田
 * @Date: 2020-04-17 18:32:18
 * @Last Modified by: 刘玉田
 * @Last Modified time: 2020-04-21 15:42:53
 */
// 工具函数

import { PASSWORDE_REGEXP, USERNAME_REGEXP } from './constant';

// 检测输入为空
export function isEmpty(str) {
  return str.toString().trim().length === 0;
}
// 检测用户名格式
export function checkUsernameRule(str) {
  const reg = USERNAME_REGEXP;
  return !reg.test(str);
}
// 检测密码格式
export function checkRule(str) {
  const reg = PASSWORDE_REGEXP;
  return !reg.test(str);
}
// 获取数据类型
export const getDataType = data => Object.prototype.toString.call(data).slice(8, -1);
