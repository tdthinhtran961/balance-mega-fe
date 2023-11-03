import React from 'react';
import { formatCurrency } from 'utils';
const Column = (filterSupplier) => {
  return [
    {
      title: 'STT',
      name: 'index',
      tableItem: {
        width: 70,
        sorter: true,
      },
    },
    {
      title: 'Mã đơn hàng',
      name: 'invoiceCode',
      tableItem: {
        // width: 130,
      },
    },
    {
      title: 'Tên cửa hàng',
      name: 'storeName',
      tableItem: {
        // width: 160,
      },
    },
    {
      title: 'Ngày đặt',
      name: 'pickUpDate',
      tableItem: {},
    },
    {
      title: 'Ngày nhận',
      name: 'completedDate',
      tableItem: {},
    },
    {
      title: 'Trước thuế',
      name: 'subTotal',
      tableItem: {
      
        render: (subTotal) => subTotal && formatCurrency(subTotal, ' '),
      },
    },
    {
      title: 'Sau thuế',
      name: 'total',
      tableItem: { render: (total) => total && formatCurrency(total, ' ') },
    },
    {
      title: 'Khuyến mãi',
      name: 'voucherAmount',
      tableItem: {  render: (voucherAmount) => voucherAmount && formatCurrency(voucherAmount, ' ') },
    },
    {
      title: 'Thành tiền',
      name: 'money',
      tableItem: {  render: (money) => money && formatCurrency(money, ' ') },
    },
    {
      title: 'Loại đơn',
      name: 'billType',
      tableItem: {
        width: 100,
        render: (value) => {
          if (value === 'RETURN') {
            return (
              <div className="bg-red-50 text-center border border-red-500 text-red-500 rounded-[4px] text-sm w-[105px] h-[36px] leading-[36px]">
                Trả hàng
              </div>
            );
          } else if (value === 'RECIEVED') {
            return (
              <div className="bg-green-50 text-center border border-green-600 text-green-600 rounded-[4px] text-sm w-[105px] h-[36px] leading-[36px]">
                Bán hàng
              </div>
            );
          }
        },
      },
    },
  ];
};
export default Column;
