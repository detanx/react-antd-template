import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Input,
  Select,
  List,
  Modal,
  Pagination,
  Tag,
  message,
  ConfigProvider,
  Spin,
  Card
} from 'antd';
import moment from 'moment';
import { DeleteOutlined, LogoutOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';
import request, { AXIOS_SUCCESS_CODE } from '@/request/index';
import RegisterModal from './RegisterModal';
import './index.less';

const { Option } = Select;

function CommodityManager() {
  const hasPermissions = useRef(false);
  const username = useRef('');
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
    request('/stockserver/user/login-user', 'GET')
      .then(response => {
        if (response.status === AXIOS_SUCCESS_CODE) {
          if (response.data) {
            const { permissions = [] } = response.data;
            hasPermissions.current = response.data.isAdmin || permissions.includes(1);
            username.current = response.data.username;
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
  return (
    <Spin size="large" spinning={listSpinning}>
      <ConfigProvider locale={zhCN}>
        <div className="com-mana-container">
          <h2 className="com-mana-header">商品管理</h2>
          <div className="com-mana-search">
            <div className="com-numbers">
              <span style={{ minWidth: 70 }}>商品编号：</span>
              <Input
                placeholder="请输入商品编号"
                onChange={e => setValues({ ...values, ...{ code: e.target.value } })}
              />
            </div>
            <div className="com-choose">
              <span style={{ minWidth: 70 }}>商品选择：</span>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: 'calc(100% - 70px)'
                }}>
                <Select
                  defaultValue={1}
                  onChange={value => setValues({ ...values, ...{ typeId: value } })}>
                  <Option value={1}>A商品</Option>
                  <Option value={2}>B商品</Option>
                </Select>
                <Select defaultValue={''} onChange={handleChange}>
                  <Option value={''}>全部</Option>
                  <Option value={1}>已入库</Option>
                  <Option value={2}>已消耗</Option>
                  <Option value={3}>重复商品</Option>
                </Select>
              </div>
            </div>
            <div className="search-btn">
              <Button onClick={handleSearch} style={{ marginRight: 16 }}>
                <SearchOutlined />
                <span>查询</span>
              </Button>
              {hasPermissions.current ? (
                <Button type={'primary'} onClick={() => setVisible(true)}>
                  <PlusOutlined />
                  <span>入库</span>
                </Button>
              ) : null}
            </div>
          </div>
          <Card style={{ background: '#fff', marginTop: 25, border: 'none' }}>
            <List
              bordered
              renderItem={item => (
                <List.Item>
                  <div className="com-mana-list-content">
                    <span className="com-mana-list-item com-mana-list-item-number">
                      <span style={{ display: 'inline-block', textAlign: 'right', width: 75 }}>
                        商品编号：
                      </span>
                      <span>{item.code}</span>
                    </span>
                    <span className="com-mana-list-item com-mana-list-item-number">
                      <span style={{ display: 'inline-block', textAlign: 'right', width: 75 }}>
                        商品类型：
                      </span>
                      <span>{['A商品', 'B商品'][item.typeId - 1]}</span>
                    </span>
                    <span className="com-mana-list-item com-mana-list-item-status">
                      <span style={{ display: 'inline-block', textAlign: 'right', width: 75 }}>
                        状态：
                      </span>
                      <Tag color={item.status === 1 ? 'green' : 'yellow'}>
                        {['已入库', '已消耗'][item.status - 1]}
                      </Tag>
                    </span>
                    <span className="com-mana-list-item com-mana-list-item-operator">
                      <span style={{ display: 'inline-block', textAlign: 'right', width: 75 }}>
                        操作人：
                      </span>
                      <span>{item.lastOperator}</span>
                    </span>
                    <span className="com-mana-list-item com-mana-list-item-time">
                      <span style={{ display: 'inline-block', textAlign: 'right', width: 75 }}>
                        创建时间：
                      </span>
                      <span>{moment(item.lastOperationTime).format('YYYY/MM/DD HH:mm')}</span>
                    </span>
                    <span
                      className="com-mana-list-item com-mana-list-item-handle"
                      style={{
                        visibility:
                          hasPermissions.current &&
                          (username.current === item.lastOperator || username.current === 'admin')
                            ? 'visible'
                            : 'hidden'
                      }}>
                      <span style={{ display: 'inline-block', textAlign: 'right', width: 75 }}>
                        操作：
                      </span>
                      <span style={{ display: 'inline-block', width: 95, textAlign: 'left' }}>
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
                    </span>
                  </div>
                </List.Item>
              )}
              dataSource={data}
            />
          </Card>

          <Pagination
            total={responseData.total || 0}
            showTotal={total => `共 ${total} 条`}
            current={values.page}
            pageSize={values.size}
            showSizeChanger={true}
            showQuickJumper={true}
            pageSizeOptions={['10', '20', '30']}
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
      </ConfigProvider>
    </Spin>
  );
}

export default CommodityManager;