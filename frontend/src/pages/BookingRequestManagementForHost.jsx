import React from 'react';
import service from '../http';
import { Table, Tag, Space, Popconfirm, message } from 'antd';

const BookingRequestManagementForHost = () => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  const [requests, setRequests] = React.useState([]);
  const arr = [];

  React.useEffect(() => {
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
              const user = item.owner;
              const title1 = res.listing.title;
              const dateRange1 = item.dateRange.start + ' ~ ' + item.dateRange.end;
              item.title = title1;
              item.dateRange = dateRange1;
              item.user = user;
              arr.push(item);
              setRequests([...arr]);
            }
          })
        })
      })
  }, [])
  requests.forEach((value, index) => {
    value.key = index + 1;
  })

  const acceptRequest = (id) => {
    fetch(`http://localhost:5005/bookings/accept/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        bookingid: id
      },
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          message.error(data.error);
        } else {
          message.success('Successful!');
          location.reload();
        }
      })
  }

  const declineRequest = (id) => {
    fetch(`http://localhost:5005/bookings/decline/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        bookingid: id
      },
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          message.error(data.error);
        } else {
          message.success('Successful!');
          location.reload();
        }
      })
  }

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      // eslint-disable-next-line react/display-name
      render: text => <a>{text}</a>,
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Date range',
      dataIndex: 'dateRange',
      key: 'dateRange',
    },
    {
      title: 'Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      // eslint-disable-next-line react/display-name
      render: status => {
        let color = 'geekblue';
        if (status === 'accepted') {
          color = 'green'
        }
        if (status === 'declined') {
          color = 'volcano'
        }
        return (
          <Tag color={color} key={status}>{status.toUpperCase()}</Tag>
        )
      },
    },
    {
      title: 'Action',
      key: 'action',
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to accept this booking?"
            onConfirm={() => {
              acceptRequest(record.id)
            }}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Accept</a>
          </Popconfirm>
          <Popconfirm
            title="Are you sure to decline this booking?"
            onConfirm={() => {
              declineRequest(record.id)
            }}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Decline</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <Table
    columns={columns}
    dataSource={requests}
    scroll={{ x: 1500 }}
    pagination={{ pageSize: 10 }}
    summary={pageData => (
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={2}>
          </Table.Summary.Cell>
        </Table.Summary.Row>
    )}
    sticky
  />
  )
}

export default BookingRequestManagementForHost;
