import { Table } from 'antd';
import React from 'react';
import { formatCurrency } from 'utils';
import './index.less';

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
    align: 'center',
  },
  {
    title: 'Chủng loại giá',
    dataIndex: 'priceType',
    className:'priceType',
    key: 'priceType',
  },
  {
    title: 'Số lượng tối thiểu',
    dataIndex: 'minQuantity',
    className:'minQuantity',
    key: 'minQuantity',
  },
  {
    title: 'Giá bán (VND)',
    dataIndex: 'price',
    key: 'price',
    render: (value) => formatCurrency(value, '')

  },
];


const ProductPrice = ({ listPrice }) => <Table 
scroll={{ x: 500 }} 
columns={columns} 
dataSource={listPrice} pagination={false} 
size="small" 
className='table-list-price'
/>;


export default ProductPrice;
