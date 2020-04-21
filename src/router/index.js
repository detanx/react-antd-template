/*
 * @Author: tangxudong
 * @Date: 2020-04-17 18:25:56
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-21 15:11:07
 */
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import Authority from '@/views/Authority';
import commodityManager from '@/views/commodityManager';
import AddAccount from '@/views/AddAccount';
import ExampleRoute from '@/views/Example';

export default function MyRouter() {
  return (
    <Suspense fallback={<div style={{ width: '100%', height: '100vh' }}>Loading...</div>}>
      <Route exact={true} path="/app" component={commodityManager} />
      <Route exact={true} path="/app/limit" component={Authority} />
      <Route exact={true} path="/app/limit/add-account" component={AddAccount} />
      <Route exact={true} path="/app/in" component={commodityManager} />
      <Route exact={true} path="/app/example" component={ExampleRoute} />
    </Suspense>
  );
}
