import React, { useState, useEffect, useRef, lazy } from 'react';
import {
  Button,
  Input,
  Select,
  List,
  Modal,
  Pagination,
  Tag,
  message,
  Spin,
  Card,
  Form,
  Row,
  Col
} from 'antd';
import moment from 'dayjs';
import { DeleteOutlined, LogoutOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import request, { AXIOS_SUCCESS_CODE } from '@/request/index';
import { OPTION_ITEMS_LIST } from '@/common/constant';
import './index.less';

const { Option } = Select;
const RegisterModal = lazy(() => import('./RegisterModal'));

function CommodityManager() {
  const hasAddClass = useRef(false);
  const groupClassnameIndex = useRef(0);
  const [userInfo, setUserInfo] = useState({
    hasPermissions: false,
    username: ''
  });
  const [visible, setVisible] = useState(false);
  const [listSpinning, setListSpinning] = useState(false);
  const [handleSpinning, setHandleSpinning] = useState(false);
  const [responseData, setResponseData] = useState({});
  const { data = [] } = responseData;
  const [values, setValues] = useState({
    page: 1,
    code: '',
    isRepeated: false,
    size: 10,
    status: '',
    typeId: 1
  });
  useEffect(() => {
    groupClassnameIndex.current = 0;
    hasAddClass.current = false;
  });
  useEffect(() => {
    request('/stockserver/user/login-user', 'GET')
      .then(response => {
        if (response.status === AXIOS_SUCCESS_CODE) {
          if (response.data) {
            const { permissions = [] } = response.data;
            setUserInfo({
              hasPermissions: response.data.isAdmin || permissions.includes(1),
              username: response.data.username
            });
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    getList();
  }, [values.size, values.page]);
  const getList = () => {
    setListSpinning(true);
    request('/stockserver/stock', 'GET', values)
      .then(response => {
        if (response.status === AXIOS_SUCCESS_CODE) {
          setListSpinning(false);
          setResponseData(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleChange = value => {
    if (value === 3) {
      setValues({
        ...values,
        ...{
          status: '',
          isRepeated: true
        }
      });
    } else {
      setValues({
        ...values,
        ...{
          status: value,
          isRepeated: false
        }
      });
    }
  };
  const itemHandle = (item, text) => {
    const url =
      text === '删除' ? `/stockserver/stock/${item.id}` : `/stockserver/stock/${item.id}/_consume`;
    const method = text === '删除' ? 'DELETE' : 'PUT';
    Modal.confirm({
      content: `请确认${text}${item.code}商品`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        request(url, method, { id: item.id })
          .then(response => {
            if (response.status === AXIOS_SUCCESS_CODE) {
              message.success(`${text}成功`);
              getList();
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  };
  const addCommodity = (sendValueObj, setCommodityNums, resetFields, setExistData) => {
    setHandleSpinning(true);
    request('/stockserver/stock', 'POST', sendValueObj)
      .then(response => {
        if (response.status === AXIOS_SUCCESS_CODE) {
          message.success('添加成功');
          getList();
          setCommodityNums([1]);
          resetFields();
          setExistData([]);
          setHandleSpinning(false);
          setVisible(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleSearch = () => {
    if (values.page !== 1) {
      setValues({ ...values, ...{ page: 1 } });
    } else {
      getList();
    }
  };
  const compareItem = (item = {}, nextItem = {}) =>
    item.code === nextItem.code && item.typeId === nextItem.typeId;
  const renderItem = (item, index) => {
    if (index === 0 && compareItem(item, data[index + 1])) {
      hasAddClass.current = true;
      item.clazz = `same-group-${groupClassnameIndex.current}`;
    }
    if (index === data.length - 1) {
      return (
        <List.Item className={item.clazz}>
          <Row style={{ width: '100%' }}>
            <Col xxl={4} xl={8} lg={12} md={12} sm={24} xs={24} className={'com-list-col'}>
              <span>商品编号：</span>
              <span>{item.code}</span>
            </Col>
            <Col xxl={4} xl={8} lg={12} md={12} sm={24} xs={24} className={'com-list-col'}>
              <span>商品类型：</span>
              <span>{OPTION_ITEMS_LIST[item.typeId - 1].text}</span>
            </Col>
            <Col
              xxl={4}
              xl={8}
              lg={12}
              md={12}
              sm={24}
              xs={24}
              className={'com-list-col com-list-status'}>
              <span>状态：</span>
              <Tag color={item.status === 1 ? 'green' : 'yellow'}>
                {['已入库', '已消耗'][item.status - 1]}
              </Tag>
            </Col>
            <Col xxl={4} xl={8} lg={12} md={12} sm={24} xs={24} className={'com-list-col'}>
              <span>操作人：</span>
              <span>{item.lastOperator}</span>
            </Col>
            <Col xxl={4} xl={8} lg={12} md={12} sm={24} xs={24} className={'com-list-col'}>
              <span>创建时间：</span>
              <span>{moment(item.lastOperationTime).format('YYYY/MM/DD HH:mm')}</span>
            </Col>
            <Col
              xxl={4}
              xl={8}
              style={{
                textAlign: 'right',
                visibility:
                  userInfo.hasPermissions &&
                  (userInfo.username === item.lastOperator || userInfo.username === 'admin')
                    ? 'visible'
                    : 'hidden'
              }}>
              <span>操作：</span>
              <span>
                {item.status === 2 ? null : (
                  <a
                    style={{ marginRight: 10, cursor: 'pointer' }}
                    onClick={() => itemHandle(item, '消耗')}>
                    <LogoutOutlined />
                    <span>消耗</span>
                  </a>
                )}
                <a style={{ cursor: 'pointer' }} onClick={() => itemHandle(item, '删除')}>
                  <DeleteOutlined />
                  <span>删除</span>
                </a>
              </span>
            </Col>
          </Row>
        </List.Item>
      );
    }
    if (compareItem(item, data[index + 1])) {
      data[index + 1].clazz = item.clazz;
    }
    if (!compareItem(item, data[index + 1])) {
      if (compareItem(data[index + 1], data[index + 2])) {
        if (hasAddClass.current) {
          groupClassnameIndex.current += 1;
        } else {
          hasAddClass.current = true;
        }
        data[index + 1].clazz = `same-group-${groupClassnameIndex.current}`;
      }
    }

    return (
      <List.Item className={item.clazz}>
        <Row style={{ width: '100%' }}>
          <Col xxl={4} xl={8} className={'com-list-col'}>
            <span>商品编号：</span>
            <span>{item.code}</span>
          </Col>
          <Col xxl={4} xl={8} className={'com-list-col'}>
            <span>商品类型：</span>
            <span>{OPTION_ITEMS_LIST[item.typeId - 1].text}</span>
          </Col>
          <Col xxl={4} xl={8} className={'com-list-col'}>
            <span>状态：</span>
            <Tag color={item.status === 1 ? 'green' : 'yellow'}>
              {['已入库', '已消耗'][item.status - 1]}
            </Tag>
          </Col>
          <Col xxl={4} xl={8} className={'com-list-col'}>
            <span>操作人：</span>
            <span>{item.lastOperator}</span>
          </Col>
          <Col xxl={4} xl={8} className={'com-list-col'}>
            <span>创建时间：</span>
            <span>{moment(item.lastOperationTime).format('YYYY/MM/DD HH:mm')}</span>
          </Col>
          <Col
            xxl={4}
            xl={8}
            style={{
              textAlign: 'right',
              visibility:
                userInfo.hasPermissions &&
                (userInfo.username === item.lastOperator || userInfo.username === 'admin')
                  ? 'visible'
                  : 'hidden'
            }}>
            <span>操作：</span>
            <span>
              {item.status === 2 ? null : (
                <a
                  style={{ marginRight: 10, cursor: 'pointer' }}
                  onClick={() => itemHandle(item, '消耗')}>
                  <LogoutOutlined />
                  <span>消耗</span>
                </a>
              )}
              <a style={{ cursor: 'pointer' }} onClick={() => itemHandle(item, '删除')}>
                <DeleteOutlined />
                <span>删除</span>
              </a>
            </span>
          </Col>
        </Row>
      </List.Item>
    );
  };
  return (
    <Spin size="large" spinning={listSpinning}>
      <div className="com-mana-container">
        <Card
          title="商品管理"
          extra={
            userInfo.hasPermissions ? (
              <Button type={'primary'} onClick={() => setVisible(true)}>
                <PlusOutlined />
                <span>入库</span>
              </Button>
            ) : null
          }>
          <Form>
            <Row>
              <Col xxl={5} xl={6} lg={24} sm={24} xs={24}>
                <Form.Item label="商品类型">
                  <Select
                    defaultValue={1}
                    onChange={value => setValues({ ...values, ...{ typeId: value } })}>
                    {OPTION_ITEMS_LIST.map(value => (
                      <Option key={value.value} value={value.value}>
                        {value.text}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={{ span: 5, offset: 1 }} lg={24} sm={24} xs={24}>
                <Form.Item label="商品状态">
                  <Select defaultValue={''} onChange={handleChange}>
                    <Option value={''}>全部</Option>
                    <Option value={1}>已入库</Option>
                    <Option value={2}>已消耗</Option>
                    <Option value={3}>重复商品</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={{ span: 5, offset: 1 }} lg={24} sm={24} xs={24}>
                <Form.Item label="商品编号">
                  <Input
                    placeholder="请输入商品编号"
                    onChange={e => setValues({ ...values, ...{ code: e.target.value } })}
                  />
                </Form.Item>
              </Col>
              <Col xxl={7} xl={6} lg={24} sm={24} xs={24}>
                <Form.Item style={{ textAlign: 'right' }}>
                  <Button onClick={handleSearch}>
                    <SearchOutlined />
                    <span>查询</span>
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card style={{ background: '#fff', marginTop: 25, border: 'none' }}>
          <List bordered dataSource={data} renderItem={renderItem} />
        </Card>

        <Pagination
          total={responseData.total || 0}
          showTotal={total => `共 ${total} 条`}
          current={values.page}
          pageSize={values.size}
          showSizeChanger={false}
          showQuickJumper={true}
          pageSizeOptions={['10', '30']}
          onChange={page => setValues({ ...values, ...{ page } })}
          onShowSizeChange={(current, size) => setValues({ ...values, ...{ page: 1, size } })}
          style={{ background: 'white', textAlign: 'right', padding: '15px 1% 15px 0' }}
        />
        <RegisterModal
          visible={visible}
          setVisible={setVisible}
          spin={handleSpinning}
          onOk={addCommodity}
        />
      </div>
    </Spin>
  );
}

export default CommodityManager;
