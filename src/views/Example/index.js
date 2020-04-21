import { useEffect } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Table, Input, Row, Col, Button, Space } from 'antd';

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  }
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address'
  }
];
export default function ExamplePage() {
  useEffect(() => {
    const contentEl = document.querySelector('.site-layout-background');
    if (contentEl) contentEl.style.background = 'transparent';
  });
  return (
    <>
      <Card title="页面标题">
        <Row gutter={[16, 16]}>
          <Col sm={24} lg={7} xl={4}>
            <Input placeholder="keyword1" />
          </Col>
          <Col sm={24} lg={7} xl={4}>
            <Input placeholder="keyword2" />
          </Col>
          <Col sm={24} lg={7} xl={4}>
            <Input placeholder="keyword3" />
          </Col>
          <Col sm={24} lg={3} xl={12}>
            <div style={{ textAlign: 'right' }}>
              <Space size={16}>
                <Button icon={<SearchOutlined />}>查询</Button>
                <Button icon={<PlusOutlined />} type="primary">
                  添加
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>
      <br />
      <Card>
        <Table dataSource={dataSource} columns={columns} />
      </Card>
    </>
  );
}
