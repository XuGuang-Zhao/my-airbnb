import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { context } from '../store/context';
import { Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import service from '../http';

const Login = () => {
  const { dispatch } = useContext(context);
  const history = useHistory();
  const jumpToHome = () => {
    history.push('/');
  }
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const Verification = () => {
    const params = {
      email: email,
      password: password,
    }

    service.post('user/auth/login', params).then((res) => {
      if (res) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', email);
        dispatch({ type: 'token', token: res.token });
        message.success('Successfully');
        jumpToHome();
      }
    })
  }

  return (
    <div className="login">
      <p className='login-title'>Login</p>
      <div className='login-wrapper'>
        <Input id='email' prefix={<UserOutlined className="site-form-item-icon" />} value={email} onChange={(value) => setEmail(value.target.value)} placeholder='Email' className='login-input'/>
        <Input id='password' prefix={<LockOutlined className="site-form-item-icon" />} value={password} onChange={(value) => setPassword(value.target.value)} type='password' placeholder='Password' className='login-input'/>
        <Button onClick={ Verification } className='login-button'>Submit</Button>
      </div>
    </div>
  )
};

export default Login;
