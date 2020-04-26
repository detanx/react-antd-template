/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:25:56
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-26 10:08:33
 */
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';

const Test = React.lazy(() => import(/* webpackChunkName: "Author" */ '@/views/Test'));

export default function MyRouter() {
  return (
    <Suspense fallback={<div style={{ width: '100%', height: '100vh' }}>Loading...</div>}>
      <Route exact path="/app" component={Test} />
      <Route exact path="/app/limit" component={Test} />
    </Suspense>
  );
}
