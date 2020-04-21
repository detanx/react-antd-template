/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:26:45
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-21 14:53:04
 */

export const USERNAME_REGEXP = /^[a-zA-Z0-9_]{2,16}$/; // 用户名正则，2到16位（字母，数字，下划线）
export const PASSWORDE_REGEXP = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){5,19}$/; // 6-20个以字母开头、可带数字、“_”、“.”

export const WARNING_DUATION_TIME = 2; // 错误提示弹窗显示时间
