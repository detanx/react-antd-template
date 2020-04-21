import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';
import App from './App';

hot(App);
const render = Component => {
  ReactDOM.render(<Component />, document.getElementById('root'));
};

render(App);
