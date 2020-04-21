/*
 * @Author: 刘玉田
 * @Date: 2020-04-17 18:32:18
 * @Last Modified by: 刘玉田
 * @Last Modified time: 2020-04-20 18:30:38
 */
// 工具函数

import { PASSWORDE_REGEXP, USERNAME_REGEXP } from './constant';

export function isEmpty(str) {
  return str.toString().trim().length === 0;
}
export function checkUsernameRule(str) {
  const reg = USERNAME_REGEXP;
  return !reg.test(str);
}
export function checkRule(str) {
  const reg = PASSWORDE_REGEXP;
  return !reg.test(str);
}
// 获取数据类型
export const getDataType = data => Object.prototype.toString.call(data).slice(8, -1);
