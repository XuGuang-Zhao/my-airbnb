import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Layout, Typography, Form, Input, DatePicker, InputNumber, Card, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import service from '../http';
import qs from 'query-string';
import moment from 'moment';

const { Title } = Typography;
const { Content, Footer } = Layout;
const { RangePicker } = DatePicker;
const { Meta } = Card;

const Home = () => {
  const arr = [];
  const token = localStorage.getItem('token');
  const [listings, setListings] = useState([]);
  const history = useHistory();
  const location = useLocation();

  const jumpToBooking = (ID) => {
    localStorage.setItem('listingID', ID)
    history.push(`/booking/${ID}`);
  }

  useEffect(() => {
    service.get('http://localhost:5005/listings', token).then((res) => {
      const getListings = res.listings;
      getListings.forEach((item, idx) => {
        const id = item.id;
        const params = { token, id };
        service.get(`listings/${id}`, params).then((res) => {
          if (res.listing.published === true) {
            res.listing.id = id;
            arr.push(res.listing);
            setListings([...arr]);
          }
        })
      })
    })
  }, []);

  function filterList (list, search) {
    const query = qs.parse(search);
    let res = list;
    if (query.beds) {
      res = list.filter(item => item.metadata?.numOfBed === +query.beds);
    }
    if (query.location) {
      res = list.filter(item => item.title.includes(query.location) || item.address.includes(query.location));
    }
    if (query.minPrice && query.maxPrice) {
      res = list.filter(item => item.price >= query.minPrice && item.price <= query.maxPrice);
    }
    if (query.date) {
      const date1 = moment(query.date[0]).format('YYYY-MM-DD');
      const date2 = moment(query.date[1]).format('YYYY-MM-DD');
      res = list.filter(item => item.availability[0] >= date1 && item.availability[1] <= date2);
    }
    return res;
  }

  function sortByTitle (a, b) {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  }

  const renderList = useMemo(() => {
    if (location.search) {
      return filterList(listings, location.search);
    }
    return listings.sort(sortByTitle);
  }, [listings, location]);

  const onFinish = (values) => {
    values.tags && (values.tags = values.tags.join(','));
    const queryStr = qs.stringify(values);
    const url = `/?${queryStr}`;
    history.push(url);
  };

  return (
    <Layout>
      {/* 机票查询页 */}
      <div className='backgroundImg'>
        <div className='search-form'>
          <Form layout='inline' labelCol={{ span: 12 }} onFinish={onFinish}>
            <Form.Item name={'location'} label='location'><Input placeholder="Where are you going? " /></Form.Item>
            <Form.Item name={'date'} label='date'><RangePicker placeholder={['Check in', 'Check out']} /></Form.Item>
            <Form.Item name={'beds'} label='beds:'><InputNumber placeholder="beds" min={0} /></Form.Item>
            <Form.Item name={'minPrice'} label='minPrice'>
              <InputNumber style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
            </Form.Item>
            <Form.Item name={'maxPrice'} label='maxPrice'>
              <InputNumber
                className="site-input-right"
                style={{
                  width: 100,
                  textAlign: 'center',
                }}
                placeholder="Maximum"
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" onClick={() => console.log('Hello')}>
              {/* Icon */}
              <SearchOutlined />
            </Button>
          </Form>
        </div>
      </div>

      <Content style={{ padding: '0 50px' }}>
        <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <Title level={1} style={{ fontFamily: 'Gill Sans', marginBottom: '50px' }}>Explore nearby</Title>
            <div className='content-row'>
              {renderList.map((item, idx) => {
                return (
                  <Card key={idx}
                    hoverable
                    className="home-card"
                    cover={<img src={item.thumbnail[0]} />}
                    onClick={() => jumpToBooking(item.id)}>
                    <Meta title={item.title} description={item.address} />
                  </Card>
                )
              })}
            </div>
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  )
};

export default Home;
