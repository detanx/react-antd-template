/*
 * @Author: 刘玉田
 * @Date: 2020-04-17 18:24:16
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-21 14:56:15
 */
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, Row, Col, message, Card, Space } from 'antd';

import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import request, { AXIOS_SUCCESS_CODE } from '@/request/index';
import AccountTabele from './AccountTable';
import './index.less';

const Authority = () => {
  const [searchLoading, setSearchLoading] = useState(false);
  const [queryData, setQueryData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputNode = useRef();

  function doQuery(username) {
    const url = username ? `/stockserver/user?username=${username}` : '/stockserver/user';
    request(url, 'GET')
      .then(res => {
        if (res.status === AXIOS_SUCCESS_CODE) {
          setIsSearching(true);
          setQueryData(res.data);
          // inputNode.current.setState({ value: '' });
        } else {
          message.error('请求失败');
        }
      })
      .catch(err => {
        console.log(err);
        message.error('请求失败');
      })
      .finally(() => setSearchLoading(false));
  }

  // 搜索
  function searchAccount() {
    const inputValue = inputNode.current.state.value;
    if (inputValue && inputValue.trim().length) {
      setSearchLoading(true);
      doQuery(inputValue);
    } else {
      setSearchLoading(true);
      doQuery();
      // message.info('请输入你要搜索的内容');
    }
  }

  return (
    <section className="authority-control">
      <Card title="权限管理">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} xl={10} lg={10}>
            <Input
              placeholder="可通过账号搜索（不输入搜索全部）"
              className="search-input"
              ref={inputNode}
              onPressEnter={searchAccount}
              prefix="账号："
              allowClear
            />
          </Col>
          <Col xs={24} sm={24} xl={14} lg={14}>
            <div style={{ textAlign: 'right' }}>
              <Space size={16}>
                <Button
                  onClick={searchAccount}
                  disabled={searchLoading}
                  loading={searchLoading}
                  icon={<SearchOutlined />}>
                  查询
                </Button>
                <Link to="/app/limit/add-account">
                  <Button type="primary" icon={<PlusOutlined />}>
                    添加账号
                  </Button>
                </Link>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      <br />
      {/* 账号列表 */}
      <Card className="account-list">
        <AccountTabele queryData={queryData} isSearching={isSearching} />
      </Card>
    </section>
  );
};

export default Authority;
