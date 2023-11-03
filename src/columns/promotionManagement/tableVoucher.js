import { Switch } from 'antd';
import React from 'react';
import { copyToClipboard, formatDate, formatPercent, formatPrice } from 'utils/fucntion';
import moment from 'moment';
moment.locale('vi')


const Column = ({ handleActive }) => {
  return [
    {
      title: 'Mã voucher',
      name: 'code',
      tableItem: {
        width: 120,
        render: (value) => copyToClipboard(value)
      },
    },
    {
      title: 'Mô tả',
      name: 'description',
      tableItem: {
        width: 300,
      },
    },
    {
      title: 'Hình thức KM',
      name: 'voucherType',
      tableItem: {
        width: 180,
        render: (value) => value === 'CASH' ? 'Giảm tiền mặt' : 'Giảm phần trăm'
      },
    },
    {
      title: 'Giá trị',
      name: 'voucherValue',
      tableItem: {
        width: 150,
        render: (value, record) => record.voucherType === 'CASH' ? formatPrice(value) : formatPercent(value)
      },
    },
    {
      title: 'Ngày bắt đầu',
      name: 'startDate',
      tableItem: {
        width: 150,
        render: (value) => formatDate(value, 'DD/MM/YYYY'),
      },
    },
    {
      title: 'Ngày kết thúc',
      name: 'endDate',
      tableItem: {
        width: 150,
        render: (value) => formatDate(value, 'DD/MM/YYYY'),
      },
    },
    {
      title: 'Điều kiện áp dụng',
      name: 'conditionApplyAmount',
      tableItem: {
        width: 200,
        render: (value) => formatPrice(value, ' '),

      },
    },
    {
      title: 'Tổng số phát hành',
      name: 'releaseQuantity',
      tableItem: {
        width: 200,
        render: (value) => formatPrice(value, ' '),
      },
    },
    {
      title: 'Số lượng còn lại',
      name: 'balanceQuantity',
      tableItem: {
        width: 200,
        render: (value) => formatPrice(value, ' '),
      },
    },
    {
      title: 'Trạng thái',
      name: 'isActive',
      tableItem: {
        width: 160,
        render: (value) => value ? 'Đang hiệu lực' : 'Hết hiệu lực'
      },
    },
    {
      title: 'Hành động',
      name: 'action',
      tableItem: {
        align: 'center',
        // fixed: 'right',
        width: 180,
        render: (value, record) => {
          return <div className='w-full flex justify-center'>
            <Switch checked={record.isActive} onChange={(value) => {
              handleActive(record.uuid)
            }} />
          </div>
        }
      },
    },
  ];
};
export default Column;
