/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:25:21
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-22 16:42:27
 */
import React, { useState } from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import useWinSize, { maxIpadSize } from './hooks/useWinSize';
import SliderMenu from './components/SliderMenu';
import DrawerMenu from './components/DrawerMenu';
import ChangePassword from './components/ChangePassword';
import MyRouter from './router';
import CommonHeader from './components/CommonHeader';
import Login from './components/Login';
// import Register from './components/Register';

import './components/AntdGolbalConfig';
import './App.less';

const { Content } = Layout;
function App() {
  const [collapsed, setCollapsed] = useState(false);
  const { width } = useWinSize();
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Router>
      <Route exact path="/" render={() => <Login />} />
      {/* <Route exact path="/register" component={Register} /> */}
      <Route exact path="/password" component={ChangePassword} />
      <Route
        path="/app"
        render={() => (
          <Layout className="frame-layout">
            {width < maxIpadSize ? (
              <DrawerMenu toggle={toggle} collapsed={collapsed} />
            ) : (
              <SliderMenu toggle={toggle} collapsed={collapsed} />
            )}
            <Layout className="site-layout">
              <CommonHeader toggle={toggle} collapsed={collapsed} />
              <Content
                className={`site-layout-background ${
                  width < maxIpadSize && 'max1024-site-layout-background'
                }`}>
                <MyRouter />
              </Content>
            </Layout>
          </Layout>
        )}
      />
    </Router>
  );
}

export default App;
