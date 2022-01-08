import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Popconfirm, message, Space, DatePicker, Button, Modal, Rate, } from 'antd';
import moment from 'moment';
import service from '../http';

const ListingList = () => {
  // Get Listing part
  const [listings, setListings] = React.useState([]);
  const token = localStorage.getItem('token');
  const arr = [];

  React.useEffect(() => {
    service.get('http://localhost:5005/listings', token).then((res) => {
      const getListings = res.listings;
      getListings.forEach((item) => {
        const id = item.id;
        const params = { token, id };
        service.get(`listings/${id}`, params).then((res) => {
          if (res.listing.owner === localStorage.getItem('email')) {
            res.listing.id = id;
            arr.push(res.listing);
            setListings([...arr]);
          }
        })
      })
    })
  }, []);

  listings.forEach((value, index) => {
    value.key = index + 1;
  })

  // Delete Part
  const listingDelete = (id) => {
    fetch(`http://localhost:5005/listings/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        listingid: id
      },
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          message.error(data.error);
        } else {
          message.success('Successful delete!');
          setListings(listings.filter((item) => item.id !== id))
        }
      })
  }

  // Go live part
  const { RangePicker } = DatePicker;
  const [date1, setdate1] = React.useState('');
  const [date2, setdate2] = React.useState('');
  const [rowRecord, setRowRecord] = React.useState('');
  const setAvaliableDate = (startDate) => {
    if (Array.isArray(startDate) && startDate.length) {
      setdate1(moment(startDate[0]).format('YYYY-MM-DD'));
      setdate2(moment(startDate[1]).format('YYYY-MM-DD'));
    }
  }

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const showModal = (record) => {
    setIsModalVisible(true);
    setRowRecord(record);
  };
  const handleOk = (record) => {
    setIsModalVisible(false);
    listingGoLive(record.id);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const listingGoLive = (id) => {
    fetch(`http://localhost:5005/listings/publish/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        listingid: id
      },
      body: JSON.stringify({
        availability: [date1, date2]
      })
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          message.error(data.error);
        } else {
          message.success('Successful publish!');
        }
      })
  }

  // Listing Offline Part
  const listingOffline = (id) => {
    fetch(`http://localhost:5005/listings/unpublish/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        listingid: id
      },
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          message.error(data.error);
        } else {
          message.success('Successful offline!');
        }
      })
  }

  // Table columns
  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      width: 200,
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <img src={text[0]} alt='No Image' width="150px" />)
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: 200,
    },
    {
      title: 'Property',
      dataIndex: 'metadata',
      width: 200,
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <>{text.propertyType}</>
      )
    },
    {
      title: 'Bed num',
      dataIndex: 'metadata',
      width: 100,
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <>{text.numOfBed}</>
      )
    },
    {
      title: 'Bathroom num',
      dataIndex: 'metadata',
      width: 130,
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <>{text.numOfBathroom}</>
      )
    },
    {
      title: 'Reviews num',
      dataIndex: 'reviews',
      width: 130,
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <>{text.length}</>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      width: 150,
    },
    {
      title: 'SVG Rating',
      dataIndex: 'reviews',
      width: 200,
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <Rate disabled defaultValue={text[0]?.rating} />
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 250,
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <Space size="middle">

          {/* Edit Button */}
          <Link to={{ pathname: `/listing-edit/${record.id}` }}>Edit</Link>

          {/* Go live Button */}
          <Button type="link" onClick={() => showModal(record)}> Go live </Button>
          <Modal destroyOnClose title={rowRecord.title} visible={isModalVisible} onOk={() => handleOk(rowRecord)} onCancel={() => handleCancel()}>
            <h3> Avaliable Date:</h3>
            <RangePicker placeholder={['Date1', 'Date2']} style={{ margin: '0 auto', borderColor: '#c9d1d7' }} onChange={(value) => setAvaliableDate(value)} />
          </Modal>

          {/* Offline Button */}
          <Popconfirm
            title="Are you sure to offline this listing?"
            onConfirm={() => {
              listingOffline(record.id)
            }}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Offline</a>
          </Popconfirm>

          {/* Delete Button */}
          <Popconfirm
            title="Are you sure to delete this listing?"
            onConfirm={() => {
              listingDelete(record.id)
            }}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Delete</a>
          </Popconfirm>
        </Space>
      )
    }];
  return (
    <Table
      className="ListingListTable"
      pagination={{ pageSize: 10 }}
      columns={columns}
      dataSource={listings}
      scroll={{ x: 1500 }}
      summary={pageData => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2}>
            </Table.Summary.Cell>
          </Table.Summary.Row>
      )}
      sticky
    />
  );
}

export default ListingList
