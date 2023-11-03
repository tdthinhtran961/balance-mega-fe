import React from 'react';
import { formatCurrency } from 'utils';

const Column = () => {
  return [
    {
      title: 'STT',
      name: 'index',
      tableItem: {
        width: '5%',
      },
    },
    {
      title: 'Mã đơn hàng',
      name: 'invoiceCode',
      tableItem: {
        width: '10%',
      },
    },
    {
      title: 'Ngày bán',
      name: 'completedDate',
      tableItem: {
        width: '10%',
      },
    },
    {
      title: 'Giá trị (VND)',
      name: 'revenue',
      tableItem: {
        width: '15%',
        render: (value) => formatCurrency(value, ' '),
      },
    },
    {
      title: 'Khuyến mãi (VND)',
      name: 'discount',
      tableItem: {
        width: '15%',
        render: (value) => formatCurrency(value, ' '),
      },
    },
    {
      title: 'Thành tiền (VND)',
      name: 'total',
      tableItem: {
        width: '15%',
        render: (value) => formatCurrency(value, ' '),
      },
    },
    {
      title: 'Loại đơn',
      name: 'type',
      tableItem: {
        width: '10%',
        render: (value) => {
          if (value === 'REFUND') {
            return (
              <div className="bg-yellow-50 text-center border border-yellow-500 text-yellow-500 rounded-[4px] text-sm w-[105px] h-[36px] leading-[36px]">
                Trả hàng
              </div>
            );
          } else if (value === 'DELEVERED') {
            return (
              <div className="bg-green-50 text-center border border-green-600 text-green-600 rounded-[4px] text-sm w-[105px] h-[36px] leading-[36px]">
                Bán hàng
              </div>
            );
          } else if (value === 'CANCEL') {
            return (
              <div className="bg-red-50 text-center border border-red-600 text-red-600 rounded-[4px] text-sm w-[105px] h-[36px] leading-[36px]">
                Đã hủy
              </div>
            );
          }
        },
      },
    },
  ];
};
export default Column;
