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
        width: 170,
        sorter: true,
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
      title: 'Nhà cung cấp',
      name: 'supplierName',
      tableItem: {},
    },
    // {
    //   title: 'Đã bán',
    //   name: 'quantity',
    //   tableItem: {},
    // },
    // {
    //   title: 'Giá bán (VND)',
    //   name: 'priceSale',
    //   tableItem: {
    //     render: (value) => formatCurrency(value, ' '),
    //   },
    // },
    // {
    //   title: 'Giá nhập (VND)',
    //   name: 'priceImport',
    //   tableItem: {
    //     render: (value) => formatCurrency(value, ' '),
    //   },
    // },
    {
      title: 'Doanh thu',
      name: 'revenue',
      tableItem: {
        render: (value) => formatCurrency(value, ' '),
      },
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
