import React, { useMemo, useEffect } from 'react';
import { Chart, Path, } from 'bizcharts';
import { DatePicker, } from 'antd';
import service from '../http';

const { RangePicker, } = DatePicker;
const scale = {
  price: {
    min: 0,
    max: 1000,
  },
  date: {
    range: [0.05, 0.95],
    tickCount: 10,
  },
};

export default function ProfileGraph () {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  const data = useMemo(() => ([
    { price: 0, date: '2021-11-01', },
    { price: 0, date: '2021-11-02', },
    { price: 0, date: '2021-11-03', },
    { price: 0, date: '2021-11-04', },
    { price: 0, date: '2021-11-05', },
    { price: 0, date: '2021-11-06', },
    { price: 0, date: '2021-11-07', },
    { price: 0, date: '2021-11-08', },
    { price: 0, date: '2021-11-09', },
    { price: 0, date: '2021-11-10', },
    { price: 0, date: '2021-11-11', },
    { price: 0, date: '2021-11-12', },
    { price: 0, date: '2021-11-13', },
    { price: 0, date: '2021-11-14', },
    { price: 0, date: '2021-11-15', },
    { price: 0, date: '2021-11-16', },
    { price: 0, date: '2021-11-17', },
    { price: 0, date: '2021-11-18', },
    { price: 0, date: '2021-11-19', },
    { price: 0, date: '2021-11-20', },
    { price: 0, date: '2021-11-21', },
    { price: 0, date: '2021-11-22', },
    { price: 0, date: '2021-11-23', },
    { price: 0, date: '2021-11-24', },
    { price: 0, date: '2021-11-25', },
    { price: 0, date: '2021-11-26', },
    { price: 0, date: '2021-11-27', },
    { price: 0, date: '2021-11-28', },
    { price: 0, date: '2021-11-29', },
    { price: 0, date: '2021-11-30', }
  ]), []);

  useEffect(() => {
    fetch('http://localhost:5005/bookings', {
      method: 'get',
      headers: { Authorization: 'Bearer ' + token }
    }).then(res => res.json())
      .then(json => {
        const allBookings = json.bookings;
        allBookings.forEach((item, idx) => {
          const listingId = item.listingId;
          const params = { token, listingId };
          service.get(`listings/${listingId}`, params).then((res) => {
            if (res.listing.owner === email) {
              const startDate = new Date(item.dateRange.start);
              const endDate = new Date(item.dateRange.end);
              const day = Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24;
              const price = item.totalPrice / day;
              console.log(price);
            }
          })
        })
      })
  }, [])

  return (
    <div className="profile-container">
      <div style={{ margin: '20px 0', }}>
        <RangePicker />
      </div>
      <Chart height={400} autoFit data={data} scale={scale}>
        <Path
          animate={{
            appear: {
              animation: 'path-in',
              duration: 1000,
              easing: 'easeLinear',
            },
          }}
          shape="smooth"
          position="date*price"
        />
      </Chart>
    </div>
  );
}
