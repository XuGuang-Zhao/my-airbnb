import React from 'react';
import { Form, Input, InputNumber, Button, message, Select, Checkbox, Row, Col, Upload, Space, } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';

const ListingCreate = () => {
  const [title, setTitle] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [thumbnailList, setThumbnailList] = React.useState([]);
  const [type, setType] = React.useState('');
  const [numOfBathroom, setNumOfBathroom] = React.useState('');
  const [amenties, setAmenties] = React.useState(['']);
  const history = useHistory();
  const jumpToListing = () => {
    history.push('/listing-list');
  };

  // Create Listing Part
  const createListing = async (formData) => {
    if (!title || !address || !price || !type || !numOfBathroom) {
      return;
    }
    if (price < 0 || price > 99999) {
      return;
    }
    if (numOfBathroom < 0 || numOfBathroom > 20) {
      return;
    }
    const thumbnail = await generateThumbnail(formData.thumbnail.fileList);
    let numOfBed = 0
    for (let j = 0; j < formData.bedroom?.length; j++) {
      numOfBed += formData.bedroom[j].bedNumber
    }
    fetch('http://localhost:5005/listings/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        title: title,
        address: address,
        price: price,
        thumbnail: thumbnail,
        metadata: {
          propertyType: type,
          numOfBathroom: numOfBathroom,
          numOfBed: numOfBed,
          amenties: amenties,
          bedrooms: formData.bedroom,
        }
      })
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          message.error(data.error);
        } else {
          message.success('Successful Create!');
          jumpToListing();
        }
      })
  }

  // Upload Image Part
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8, }}>Upload</div>
    </div>
  );

  const handleThumbnailChange = ({ fileList, }) => {
    setThumbnailList(fileList);
  };

  const handleThumbnailPreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
  };

  function getBase64 (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async function generateThumbnail (fileList) {
    return (
      Promise.all(
        fileList.map(async (file) => {
          return await getBase64(file.originFileObj);
        })
      )
    );
  }

  // Form Layout and validateMessages
  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 16 },
    },
  };

  /* eslint-disable no-template-curly-in-string */
  const vaildateMessages = {
    required: '${label} can not be empty!',
    number: {
      range: '${label} must between ${min} - ${max}',
    }
  };

  return (
    <div className='listing-create'>
      <p className='listing-create-title'>Post Your Listing</p>
      <div className="lisiting-create-wrapper">
        <Form {...formItemLayout} onFinish={createListing} validateMessages={vaildateMessages}>
          <Form.Item name={'title'} label="Title" rules={[{ required: true }]}>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </Form.Item>
          <Form.Item name={'address'} label="Address" rules={[{ required: true }]}>
            <Input value={address} onChange={e => setAddress(e.target.value)} />
          </Form.Item>
          <Form.Item name={'price'} label="Price (Per Night)" rules={[{ required: true }, { type: 'number', min: 0, max: 99999, }]}>
            <InputNumber
              value={price}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              onChange={e => setPrice(e)} />
          </Form.Item>
          <Form.Item name={'propertyType'} label="Property Type" rules={[{ required: true }]}>
            <Select onChange={e => setType(e)}>
              <Select.Option value="Apartment">Apartment</Select.Option>
              <Select.Option value="House">House</Select.Option>
              <Select.Option value="Self-contained unit">Self-contained unit</Select.Option>
              <Select.Option value="Unique space">Unique space</Select.Option>
              <Select.Option value="Bed and breakfast">Bed and breakfast</Select.Option>
              <Select.Option value="Boutique hotel">Boutique hotel</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name={'bathroom'} label="Number of Bathroom" rules={[{ required: true }, { type: 'number', min: 0, max: 20, }]}>
            <InputNumber value={numOfBathroom} onChange={e => setNumOfBathroom(e)} />
          </Form.Item>
          <Form.Item name="amenties" label="Amenties">
            <Checkbox.Group style={{ width: '100%' }} onChange={e => setAmenties(e)}>
              <Row>
                <Col span={8}>
                  <Checkbox value="Wifi" style={{ lineHeight: '32px' }}>
                    Wifi
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="TV" style={{ lineHeight: '32px' }}>
                    TV
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Kicthen" style={{ lineHeight: '32px' }}>
                    Kicthen
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Checkbox value="Washing Machine" style={{ lineHeight: '32px' }}>
                    Washing Machine
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Air conditioning" style={{ lineHeight: '32px' }}>
                    Air conditioning
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="Parking Space" style={{ lineHeight: '32px' }}>
                    Parking Space
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item label="Thumbnail" name="thumbnail" valuePropName="thumbnailList" rules={[{ required: true, }]}>
            <Upload
              listType="picture-card"
              fileList={thumbnailList}
              onPreview={handleThumbnailPreview}
              onChange={handleThumbnailChange}
            >
              {thumbnailList.length >= 6 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item name="bedrooms" label="Bedrooms">
            <Form.List name="bedroom">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'bedNumber']}
                        fieldKey={[fieldKey, 'bedNumber']}
                        rules={[{ required: true, message: 'Missing Bed Number' }]}
                      >
                        <InputNumber style={{ width: 150 }} placeholder="Bed Number" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'bedType']}
                        fieldKey={[fieldKey, 'bedType']}
                        rules={[{ required: true, message: 'Missing Bed Type' }]}
                      >
                        <Select
                          showSearch
                          style={{ width: 200 }}
                          placeholder="Bed Type"
                        >
                          <Select.Option value="Single">Single</Select.Option>
                          <Select.Option value="King Single">King Single</Select.Option>
                          <Select.Option value="Double">Double</Select.Option>
                          <Select.Option value="Queen">Queen</Select.Option>
                          <Select.Option value="King">King</Select.Option>
                        </Select>
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Bedroom
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item wrapperCol={{ ...formItemLayout.wrapperCol, offset: 12, }}>
            <Button type="primary" className="create-button" htmlType="submit" > Post </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ListingCreate
