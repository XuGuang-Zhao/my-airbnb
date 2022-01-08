import React, { useState, useEffect } from 'react';
import { Table, Space, Popconfirm, message, Tag, Button, Modal, Rate, Input } from 'antd';
import service from '../http';

const BookingRequestCheckForUser = () => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  const [bookings, setBookings] = useState([]);
  const [rowRecord, setRowRecord] = useState('');
  const [rating, setRating] = useState(2.5);
  const [review, setReview] = useState('');
  const { TextArea } = Input;
  const arr = [];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = (record) => {
    setIsModalVisible(true);
    setRowRecord(record);
  };
  const handleOk = (record) => {
    setIsModalVisible(false);
    leaveReview(record.id, record.listingId, record.owner);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetch('http://localhost:5005/bookings', {
      method: 'get',
      headers: { Authorization: 'Bearer ' + token }
    }).then(res => res.json())
      .then(json => {
        const allBookings = json.bookings;
        allBookings.forEach((item, idx) => {
          if (item.owner === email) {
            const dateRange1 = item.dateRange.start + ' ~ ' + item.dateRange.end;
            item.dateRange = dateRange1;
            const listingId = item.listingId;
            const params = { token, listingId };
            service.get(`listings/${listingId}`, params).then((res) => {
              const title1 = res.listing.title;
              item.title = title1;
              arr.push(item);
              setBookings([...arr]);
            })
          }
        })
      })
  }, [])

  bookings.forEach((value, index) => {
    value.key = index + 1;
  })

  const deleteRequest = (id) => {
    fetch(`http://localhost:5005/bookings/${id}`, {
      method: 'DELETE',
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
          message.success('Successful delete!');
          setBookings(bookings.filter((item) => item.id !== id))
        }
      })
  }

  const leaveReview = (bookingId, listingId, owner) => {
    fetch(`http://localhost:5005/listings/${listingId}/review/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        listingid: listingId,
        bookingid: bookingId,
      },
      body: JSON.stringify({
        review: {
          rating: rating,
          review: review,
          owner: owner,
          avatar: 'https://joeschmoe.io/api/v1/random',
        }
      })
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          message.error(data.error);
        } else {
          message.success('Successful review!');
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
            title="Are you sure to delete this booking?"
            onConfirm={() => {
              deleteRequest(record.id)
            }}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Delete</a>
          </Popconfirm>

          {/* Review Button */}
          <Button type="link" onClick={() => showModal(record)}> Review </Button>
          <Modal destroyOnClose title={rowRecord.title} visible={isModalVisible} onOk={() => handleOk(rowRecord)} onCancel={() => handleCancel()}>
            <h3> Rating: </h3>
            <Rate allowHalf defaultValue={2.5} onChange={(value) => setRating(value)} />
            <h3> Message: </h3>
            <TextArea rows={6} showCount maxLength={250} onChange={(e) => setReview(e.target.value)} />
          </Modal>

        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={bookings}
      scroll={{ x: 1500 }}
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

export default BookingRequestCheckForUser;
