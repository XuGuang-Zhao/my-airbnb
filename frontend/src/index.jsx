import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import 'antd/dist/antd.css';
import AppRouter from './router.js';

ReactDOM.render(
  <AppRouter/>,
  document.getElementById('root'),
);
