/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:25:21
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-26 10:07:06
 */
import { Layout } from 'antd';
import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.less';
import './components/AntdGolbalConfig';
import useWinSize, { maxIpadSize } from './hooks/useWinSize';

const MyRouter = React.lazy(() => import('./router'));
const SliderMenu = React.lazy(() => import('./components/SliderMenu'));
const DrawerMenu = React.lazy(() => import('./components/DrawerMenu'));
const ChangePassword = React.lazy(() => import('./components/ChangePassword'));
const CommonHeader = React.lazy(() => import('./components/CommonHeader'));
const Login = React.lazy(() => import('./components/Login'));
// import Register from './components/Register';

const { Content } = Layout;
function App() {
  const [collapsed, setCollapsed] = useState(false);
  const { width } = useWinSize();
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Suspense fallback={<div style={{ width: '100%', height: '100vh' }}>Loading...</div>}>
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
    </Suspense>
  );
}

export default App;
