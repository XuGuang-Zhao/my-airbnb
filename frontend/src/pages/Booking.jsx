import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Layout, Breadcrumb, Carousel, Typography, Divider, DatePicker, Button, notification, Tooltip, message, Image, Comment, List } from 'antd';
import { EnvironmentOutlined, CheckCircleTwoTone, StarFilled } from '@ant-design/icons';
import service from '../http';
import moment from 'moment';

const { Content, Footer } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const Booking = () => {
  const history = useHistory();
  const listingID = localStorage.getItem('listingID');
  const token = localStorage.getItem('token');
  const [listing, setListing] = useState({
    metadata: { amenties: [] },
  });
  const params = { token, listingID };
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [bookDays, setBookDays] = useState(0);
  const [avgRate, setAvgRate] = useState(0);

  const jumpToCheckRequest = () => {
    history.push('/booking-request-check');
  }

  const openNotification = (bookingId) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Button type="primary" size="small" style={{ background: '#426796', border: '0' }} onClick={() => notification.close(key)}>
        Confirm
      </Button>
    );
    notification.open({
      message: 'You booking request has been sent!',
      description:
        `Your booking ID is ${bookingId}. Please wait for the confirmation by host :)`,
      btn,
      key,
      onClose: () => { },
    });
  };

  const disabledDate = (current) => {
    return current <= moment().startOf('day');
  }

  const sendResrveRequest = () => {
    const userTotalPrice = computeTotalPrice;
    const reserveParams = { dateRange: { start: checkIn, end: checkOut }, totalPrice: userTotalPrice }
    if (bookDays !== 0) {
      fetch(`http://localhost:5005/bookings/new/${listingID}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        listingid: listingID,
        body: JSON.stringify(reserveParams),
      })
        .then(res => res.json())
        .then(json => {
          if (json.error) {
            message.error(json.error);
          } else {
            openNotification(json.bookingId);
          }
        });
    } else {
      message.warning('Please select your travel date :)')
    }
  }

  const chooseDate = (date, dateString) => {
    setCheckIn(dateString[0]);
    setCheckOut(dateString[1]);
    setDateRange(dateString);
  }

  const computeTotalPrice = useMemo(() => {
    const dateArr = [moment(dateRange[1]), moment(dateRange[0])];
    const days = dateArr[0].diff(dateArr[1], 'days');
    setBookDays(days);
    const price = listing.price * days;
    return price;
  }, [dateRange, listing.price])

  useEffect(() => {
    service.get(`listings/${listingID}`, params).then((res) => {
      const getListings = res.listing;
      setListing(getListings);
      let totalRating = 0;
      for (let j = 0; j < getListings.reviews.length; j++) {
        totalRating += getListings.reviews[j].rating;
      }
      if (totalRating === 0) {
        setAvgRate(0);
      } else {
        setAvgRate((totalRating / getListings.reviews.length).toFixed(1));
      }
    })
  }, [])

  return (
    <Layout>
      <Content className="site-layout" style={{ padding: '0 50px', marginTop: 30 }}>
        <Breadcrumb style={{ margin: '5px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Booking</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
          <div className='booking-wapper'>
            <Carousel className="image-wrapper">
              {
                (listing.thumbnail || []).map((src, index) => (
                  <Image className="thumbnail-img" key={index} src={src} />
                ))
              }
            </Carousel>
            <div className='booking-wapper-details'>
              <Title level={2} style={{ fontFamily: 'Gill Sans', marginBottom: '8px' }}>{listing.title}</Title>
              <div className='details-title-and-subtitle'>
                {listing.metadata.propertyType}
                <Divider type="vertical" />
                {listing.metadata.numOfBathroom} bathrooms
                <Divider type="vertical" />
                {listing.metadata.bedrooms?.length} bedrooms
                <Divider type="vertical" />
                {listing.metadata.numOfBed} beds
                <Divider type="vertical" />
                <EnvironmentOutlined style={{ marginRight: '6px' }} />{listing.address}
              </div>
              <Divider style={{ marginTop: '5px' }} />
              <div className='details-amenties'>
                <Title level={3} style={{ fontFamily: 'Gill Sans', marginBottom: '5px' }}>What this place offers</Title>
                {listing.metadata.amenties.map((item, idx) => {
                  return (
                    <div key={idx}>
                      <CheckCircleTwoTone twoToneColor='#426796' style={{ marginRight: '10px' }} />
                      <span>{item}</span>
                    </div>
                  )
                })}
              </div>
              <div className='booking-form'>
                <div className='booking-form-title'>
                  <div className='booking-form-title-left'>
                    <span className='booking-form-title-price'>${listing.price}</span>
                    <span style={{ fontFamily: 'Gill Sans', fontSize: '18px' }}>/ night</span>
                  </div>
                  <div className='booking-form-title-right'>
                    <StarFilled style={{ color: '#e94259', marginRight: '5px' }} />
                    <span className='booking-form-score'>{avgRate}</span>
                    <span className='booking-form-reviews'>({listing.reviews?.length} Reviews)</span>
                  </div>
                </div>
                <div className='date-picker'>
                  <RangePicker placeholder={['Check in', 'Check out']}
                    style={{ borderColor: '#c9d1d7' }}
                    block
                    disabledDate={disabledDate}
                    onChange={chooseDate} />
                </div>
                <Tooltip placement="right" title={`Total price: ${computeTotalPrice}`}>
                  <Button type="primary"
                    shape="round"
                    style={{ background: '#426796', border: '#426796', marginTop: '20px' }}
                    block
                    onClick={sendResrveRequest}>Reserve</Button>
                </Tooltip>
                <Button type='link' style={{ color: '#426796', marginLeft: '100px' }} onClick={jumpToCheckRequest}>Check booking request</Button>
              </div>
            </div>
          </div>
          <List
            className="comment-list"
            header={
              <div>
              <StarFilled style={{ color: '#e94259', marginRight: '5px' }} />
              <span className='booking-form-score'>{avgRate}</span>
              <span className='booking-form-reviews'>({listing.reviews?.length} Reviews)</span>
              </div>
            }
            itemLayout="horizontal"
            dataSource={listing.reviews}
            renderItem={item => (
              <li>
                <Comment
                  author={item.owner}
                  avatar={item.avatar}
                  content={item.review}
                />
              </li>
            )}
          />,
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Airbrb ©2018</Footer>
    </Layout>
  )
};

export default Booking;
