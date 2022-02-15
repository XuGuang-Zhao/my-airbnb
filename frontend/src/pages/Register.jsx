import React, { useState } from 'react';
import { Input, Button, message, Form } from 'antd';
import { useHistory } from 'react-router-dom';

/* 表单样式配置 */
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const Register = () => {
  const history = useHistory();
  const jumpToLogin = () => {
    history.push('/login');
  };
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const sendRequest = () => {
    const params = {
      email: email,
      password: password,
      name: name,
    }
    /* 数据校验 */
    if (!password) {
      message.error('password cannot be blank');
      return;
    }

    if (password !== passwordConfirm) {
      message.error('two passwords do not match');
      return;
    }

    fetch('http://localhost:5005/user/auth/register', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          message.error(json.error);
        } else {
          message.success('Successfully')
          jumpToLogin();
        }
      });
  }

  return (
    <div className='register'>
      <p className='register-title'>Register</p>
      <div className='register-wrapper'>
        <Form {...formItemLayout}>
          <Form.Item name="email" label="E-mail" rules={[{ type: 'email', message: 'The input is not valid E-mail!', }, { required: true, message: 'Please input your E-mail!' }]}>
            <Input value={email} onChange={(value) => setEmail(value.target.value)} className='register-input'/>
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input value={name} onChange={(value) => setName(value.target.value)} className='register-input'/>
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password value={password} onChange={(value) => setPassword(value.target.value)} className='register-input'/>
          </Form.Item>
          <Form.Item name="confirm" label="Confirm password" rules={[{ required: true, message: 'Please confirm your password!' }]}>
            <Input.Password value={passwordConfirm} onChange={(value) => setPasswordConfirm(value.target.value)} type='password' className='register-input'/>
          </Form.Item>
          <Button onClick={ sendRequest } className='register-button'>Submit</Button>
        </Form>
      </div>
    </div>
  )
};

export default Register;
