import React, { useState } from 'react';
import { Modal, Form, Select, Input, Button, Divider } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import request, { AXIOS_SUCCESS_CODE } from '@/request/index';
import './index.less';

const { Option } = Select;
function RegisterModal({ visible, setVisible, spin, onOk }) {
  const [form] = Form.useForm();
  const [commodityNums, setCommodityNums] = useState([1]);
  const [existData, setExistData] = useState([]);
  const formItemLayout = {
    labelCol: {
      xs: { span: 10 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };
  const onCheck = async () => {
    try {
      const values = await form.validateFields();
      const { resetFields } = form;
      const arr = Object.keys(values.commodity)
        .filter(value => value.includes('code'))
        .map(value => value.slice(4))
        .sort((a, b) => a - b);
      const sendValueObj = arr.reduce((pre, cur) => {
        const obj = {
          code: values.commodity[`code${cur}`],
          typeId: values.commodity[`typeId${cur}`]
        };
        pre.push(obj);
        return pre;
      }, []);
      onOk(sendValueObj, setCommodityNums, resetFields, setExistData);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  const searchIsExist = async (value, num, type) => {
    try {
      const values = await form.validateFields();
      let params;
      if (type === 1) {
        params = {
          code: values.commodity[`code${num}`],
          typeId: value
        };
      } else {
        params = {
          code: value,
          typeId: values.commodity[`typeId${num}`]
        };
      }
      request('/stockserver/stock/first', 'GET', params)
        .then(response => {
          if (response.status === AXIOS_SUCCESS_CODE) {
            const data = [...existData];
            data[num] = response.data;
            setExistData(data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  const subtractNums = index => {
    const arr = [...commodityNums];
    arr.splice(index, 1);
    setCommodityNums(arr);
  };
  return (
    <Modal
      title="登记入库"
      visible={visible}
      onOk={onCheck}
      maskClosable={false}
      confirmLoading={spin}
      okText={'确定'}
      destroyOnClose={true}
      cancelText={'取消'}
      onCancel={() => {
        setVisible(false);
        form.resetFields();
        setExistData([]);
      }}>
      <Form {...formItemLayout} form={form}>
        {commodityNums.map((value, index) => (
          <div key={value} style={{ position: 'relative' }}>
            <Form.Item
              name={['commodity', `typeId${value}`]}
              label="商品类型"
              rules={[
                {
                  required: true,
                  message: '商品类型不能为空'
                }
              ]}>
              <Select onChange={selectValue => searchIsExist(selectValue, value, 1)}>
                <Option value={1}>A商品</Option>
                <Option value={2}>B商品</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={['commodity', `code${value}`]}
              label="商品编号"
              rules={[
                {
                  required: true,
                  message: '商品编号不能为空'
                }
              ]}>
              <Input
                placeholder={'请输入商品编号'}
                onBlur={event => searchIsExist(event.target.value, value, 2)}
              />
            </Form.Item>
            {existData[value] ? (
              <p className="repeat-hint">
                {existData[value].lastOperator}于
                {moment(existData[value].lastOperationTime).format('YYYY年MM月DD日 HH:mm:ss')}
                入库了相同编号产品
              </p>
            ) : null}
            {commodityNums.length <= 1 ? null : (
              <MinusCircleOutlined
                onClick={() => subtractNums(index)}
                style={{
                  position: 'absolute',
                  color: 'red',
                  fontSize: 20,
                  right: 10,
                  top: 30,
                  cursor: 'pointer'
                }}
              />
            )}
            {index === commodityNums.length - 1 ? null : <Divider />}
          </div>
        ))}
        {commodityNums.length >= 3 ? null : (
          <Form.Item
            style={{ marginBottom: 0 }}
            wrapperCol={{
              xs: { span: 24, offset: 2 },
              sm: { span: 16, offset: 4 }
            }}>
            <Button
              type="primary"
              style={{ marginRight: 20 }}
              onClick={() =>
                setCommodityNums([...commodityNums, commodityNums[commodityNums.length - 1] + 1])
              }>
              添加商品+
            </Button>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

export default RegisterModal;
