/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:25:56
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-23 15:17:38
 */
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';

const Authority = React.lazy(() => import(/* webpackChunkName: "Author" */ '@/views/Authority'));
const commodityManager = React.lazy(() => import('@/views/commodityManager'));
const AddAccount = React.lazy(() => import('@/views/AddAccount'));

export default function MyRouter() {
  return (
    <Suspense fallback={<div style={{ width: '100%', height: '100vh' }}>Loading...</div>}>
      <Route exact={true} path="/app" component={commodityManager} />
      <Route exact={true} path="/app/limit" component={Authority} />
      <Route exact={true} path="/app/limit/add-account" component={AddAccount} />
    </Suspense>
  );
}
