import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { context } from '../store/context';
import { Menu, Layout } from 'antd';
import { UserOutlined, UserAddOutlined, HomeOutlined, UserSwitchOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { SubMenu } = Menu;

const AppHeader = () => {
  const { state, dispatch } = useContext(context);
  const history = useHistory();
  const jumpToPage = (path) => {
    history.push(path);
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    dispatch({ type: 'token', token: '' });
    jumpToPage('/');
  }

  return (
    <Layout>
      <Header className="header" style={{ opacity: '0.8' }}>
        <div className="logo">Airbrb</div>
        <Menu theme="dark" mode="horizontal" style={{ justifyContent: 'end' }} >
          {!state.token && <>
            <Menu.Item key="1" onClick={() => jumpToPage('/login')}> <UserOutlined />  Login</Menu.Item>
            <Menu.Item key="2" onClick={() => jumpToPage('/register')}> <UserAddOutlined />  Register</Menu.Item>
          </>
          }
          <Menu.Item key="3" onClick={() => jumpToPage('/')}> <HomeOutlined />  Home</Menu.Item>
          {state.token && <SubMenu key="Host" title="Host">
            <Menu.Item key="5" onClick={() => jumpToPage('/listing-list')}> Hosted Listing</Menu.Item>
            <Menu.Item key="6" onClick={() => jumpToPage('/listing-create')}> Created Hosted Listing </Menu.Item>
            <Menu.Item key="8" onClick={() => jumpToPage('/booking-request-management')}> Booking Management </Menu.Item>
            <Menu.Item key="9" onClick={() => jumpToPage('/listing-file-upload')}> Upload Lisiting File </Menu.Item>
            <Menu.Item key="10" onClick={() => jumpToPage('/listing-profit-graph')}> Listing Profit Graph </Menu.Item>
          </SubMenu>}
          {state.token && <SubMenu key="User" title="User">
            <Menu.Item key="7" onClick={() => jumpToPage('/booking-request-check')}> My Booking </Menu.Item>
          </SubMenu>}
          {state.token && <Menu.Item key="4" onClick={logout}> <UserSwitchOutlined /> Logout</Menu.Item>}

        </Menu>
      </Header>
    </Layout>
  )
};

export default AppHeader;
