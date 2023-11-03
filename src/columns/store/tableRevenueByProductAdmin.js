import React from 'react';
import { formatCurrency } from 'utils';
const Column = () => {
  return [
    {
      title: 'STT',
      name: 'index',
      tableItem: {
        width: 80,
        sorter: true,
      },
    },
    {
      title: 'Mã sản phẩm',
      name: 'productCode',
      tableItem: {
        sorter: true,
        width: 130,
      },
    },
    {
      title: 'Tên sản phẩm',
      name: 'productName',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Mã vạch',
      name: 'barcode',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Doanh thu trước thuế',
      name: 'subTotal',
      tableItem: { width: 170, render: (subTotal) => subTotal && formatCurrency(subTotal, ' ') },
    },

    {
      title: 'Sau thuế',
      name: 'total',
      tableItem: {  width: 170, render: (total) => total && formatCurrency(total, ' ') },
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        render: (value) => {
          if (value === 'STOP_SELLING') {
            return (
              <div className="bg-red-50 text-center border border-red-500 text-red-500 rounded-[4px] text-sm w-[105px] h-[36px] leading-[36px]">
                Ngưng bán
              </div>
            );
          } else if (value === 'APPROVED') {
            return (
              <div className="bg-green-50 text-center border border-green-600 text-green-600 rounded-[4px] text-sm w-[105px] h-[36px] leading-[36px]">
                Đang bán
              </div>
            );
          }
        },
      },
    },
  ];
};
export default Column;
