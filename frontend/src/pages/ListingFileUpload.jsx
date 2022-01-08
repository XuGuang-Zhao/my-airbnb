import React, { useState, useMemo, } from 'react';
import { Upload, Button, Input, message, } from 'antd';
import { UploadOutlined, } from '@ant-design/icons';
import { useHistory } from 'react-router';

const { TextArea, } = Input;

const LisitingFileUpload = () => {
  const [list, setList] = useState([]);
  const [results, setResults] = useState([]);

  const history = useHistory();
  const jumpToListing = () => {
    history.push('/listing-list');
  };

  const props = useMemo(() => ({
    beforeUpload (file) {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
          const roolList = JSON.parse(this.result);
          setList(roolList);
        };
      });
    },
  }), []);

  const textareaValue = useMemo(() => (
    list && list.length > 0 && JSON.stringify(list, null, 4)
  ), [list]);

  const reset = () => {
    setList([]);
  };

  const upload = () => {
    list.forEach(room => (
      fetch('http://localhost:5005/listings/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          title: room.title,
          address: room.address,
          price: room.price,
          thumbnail: room.thumbnail,
          metadata: {
            propertyType: room.metadata.propertyType,
            numOfBathroom: room.metadata.numOfBathroom,
            numOfBed: room.metadata.numOfBed,
            amenties: room.metadata.amenties,
            beds: room.metadata.beds,
          }
        })
      })
        .then(r => r.json())
        .then(data => {
          if (data.error) {
            message.error(data.error);
          } else {
            message.success('Successful Upload!');
            const newResults = [...results, { listingId: data?.listingId, ...room, }];
            setResults(newResults);
            jumpToListing();
          }
        })
    ));
  };

  return (
    <div style={{ margin: 20, }}>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Upload List File</Button>
      </Upload>
      <TextArea style={{ margin: '16px 0', }} value={textareaValue} readOnly autoSize={{ minRows: 26, maxRows: 32, }} />
      <Button style={{ marginRight: 10, }} onClick={reset}>Reset</Button>
      <Button type="primary" onClick={upload}>Upload</Button>
    </div>
  );
}

export default LisitingFileUpload
