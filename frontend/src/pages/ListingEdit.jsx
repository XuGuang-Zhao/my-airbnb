import React from 'react';
import { message, Button, Input, InputNumber, Select, Checkbox, Row, Col, Upload, Form, Space } from 'antd';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const ListingEdit = () => {
  const [form] = Form.useForm();
  const [thumbnailList, setThumbnailList] = React.useState([]);
  const listId = useParams().listId;
  const history = useHistory();
  const jumpToListing = () => {
    history.push('/listing-list');
  };

  // Initial Form Value
  React.useEffect(() => {
    fetch(`http://localhost:5005/listings/${listId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        listingid: Number(listId)
      },
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          message.error(data.error);
        } else {
          const { listing } = data;
          const values = {
            title: listing.title,
            price: listing.price,
            address: listing.address,
            propertyType: listing.metadata.propertyType,
            bathroom: listing.metadata.numOfBathroom,
            amenties: listing.metadata.amenties,
            bedroom: listing.metadata.bedrooms
          };
          setThumbnailList(listing.thumbnail.map((data, index) => ({
            uid: index.toString(),
            name: `${index}.png`,
            url: data,
            status: 'done',
          })));
          // 使用 form 填充到表单里
          form.setFieldsValue(values);
        }
      })
  }, []);

  // Put Form Value
  const editListing = async (formData) => {
    const thumbnail = generateEditThumbnail(thumbnailList || formData.thumbnail);
    if (!thumbnail || thumbnail.length === 0) {
      message.warning('Please upload at least one thumbnail.');
      return;
    }
    let numOfBed = 0
    for (let j = 0; j < formData.bedroom?.length; j++) {
      numOfBed += formData.bedroom[j].bedNumber;
    }
    fetch(`http://localhost:5005/listings/${listId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        listingid: Number(listId)
      },
      body: JSON.stringify({
        title: formData.title,
        address: formData.address,
        price: formData.price,
        thumbnail: thumbnail,
        metadata: {
          propertyType: formData.propertyType,
          numOfBathroom: formData.bathroom,
          numOfBed: numOfBed,
          amenties: formData.amenties,
          bedrooms: formData.bedroom,
        }
      })
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          message.error(data.error);
        } else {
          message.success('Successful Edit!');
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

  function generateEditThumbnail (thumbnail) {
    if (thumbnail instanceof Array) {
      return thumbnail.map(item => item.url || item.thumbUrl);
    }
    return thumbnail.fileList.map(item => item.url || item.thumbUrl);
  }

  // Form Layout and vaildate Message
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
        <Form form={form} {...formItemLayout} onFinish={editListing} validateMessages={vaildateMessages}>
          <Form.Item name={'title'} label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={'address'} label="Address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={'price'} label="Price (Per Night)" rules={[{ required: true }, { type: 'number', min: 0, max: 99999, }]}>
            <InputNumber
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
             />
          </Form.Item>
          <Form.Item name={'propertyType'} label="Property Type" rules={[{ required: true }]}>
            <Select >
              <Select.Option value="Apartment">Apartment</Select.Option>
              <Select.Option value="House">House</Select.Option>
              <Select.Option value="Self-contained unit">Self-contained unit</Select.Option>
              <Select.Option value="Unique space">Unique space</Select.Option>
              <Select.Option value="Bed and breakfast">Bed and breakfast</Select.Option>
              <Select.Option value="Boutique hotel">Boutique hotel</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name={'bathroom'} label="Number of Bathroom" rules={[{ required: true }, { type: 'number', min: 0, max: 20, }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item name={'amenties'} label="Amenties">
            <Checkbox.Group style={{ width: '100%' }} >
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
          <Form.Item label="Thumbnail" name="thumbnail" valuePropName="thumbnailList" >
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
          <Form.Item wrapperCol={{ ...formItemLayout.wrapperCol, offset: 12 }}>
            <Button type="primary" className="create-button" htmlType="submit" > Post </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ListingEdit
