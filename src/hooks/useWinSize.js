/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:30:20
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-21 11:18:42
 */
import { useState, useCallback, useEffect } from 'react';

export const maxIpadSize = 1024;
export const maxMobileSize = 768;
// 获取窗口大小
function useWinSize() {
  const [size, setSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  });

  const onResize = useCallback(() => {
    setSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    });
  }, []);
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);
  const { width } = size;
  const rootDom = document.getElementById('root');
  if (width <= maxIpadSize && width >= maxMobileSize) {
    rootDom.className = 'ipad';
  } else if (width < maxMobileSize) {
    rootDom.className = 'mobile';
  }
  return size;
}
export default useWinSize;
