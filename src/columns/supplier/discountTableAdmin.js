import React from 'react';
import { formatCurrency } from 'utils';
const Column = (filterSupplier) => {
  return [
    {
      title: 'STT',
      name: 'index',
      tableItem: {
        width: 70,
        onCell: (record) => ({
          style: { paddingTop: '0.25rem', paddingBottom: 0 },
          // onClick: () => {
          //   navigate(routerLinks('DiscountDetail') + `?id=${record.id}` + `&idSupplier=${filterSupplier}`);
          // },
        }),
      },
    },
    {
      title: 'Thời gian',
      name: 'timeRange',
      tableItem: {
        width: 200,
        onCell: (record) => ({
          style: { paddingTop: '0.25rem', paddingBottom: 0 },
          // onClick: () => {
          //   navigate(routerLinks('DiscountDetail') + `?id=${record.id}` + `&idSupplier=${filterSupplier}`);
          // },
        }),
      },
    },
    {
      title: 'Chiết khấu (VND)',
      name: 'discountPrice',
      tableItem: {
        width: 160,
        render: (discountPrice) => discountPrice && formatCurrency(discountPrice, ' '),
        onCell: (record) => ({
          // onClick: () => {
          //   navigate(routerLinks('DiscountDetail') + `?id=${record.id}` + `&idSupplier=${filterSupplier}`);
          // },
        }),
      },
    },
    {
      title: 'Đã thanh toán (VND)',
      name: 'payedTotal',
      tableItem: { render: (payedTotal) => payedTotal && formatCurrency(payedTotal, ' '),  width: 160, },
      onCell: (record) => ({
        // onClick: () => {
        //   navigate(routerLinks('DiscountDetail') + `?id=${record.id}` + `&idSupplier=${filterSupplier}`);
        // },
      }),
    },
    {
      title: 'Chưa thanh toán (VND)',
      name: 'unpaidTotal',
      tableItem: { render: (unpaidTotal) => unpaidTotal && formatCurrency(unpaidTotal, ' '),  width: 160, },
      onCell: (record) => ({
        // onClick: () => {
        //   navigate(routerLinks('DiscountDetail') + `?id=${record.id}` + `&idSupplier=${filterSupplier}`);
        // },
      }),
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        width: 160,
        render: (value) => {
          return value === 'PAID' ? (
            <div className="bg-green-100 text-center p-1 border border-green-500 text-green-500 rounded-[4px]">
              Đã thanh toán
            </div>
          ) : value === 'NOT_PAID' ? (
            <div className="bg-red-100 text-center p-1 border border-red-500 text-red-500 rounded-[4px]">
              Chưa thanh toán
            </div>
          ) : value === 'NOT_COMPLETED_PAID' ? (
            <div className="bg-[#FEFCE8] text-center p-1 border border-[#EAB308] text-[#EAB308] rounded-[4px]">
              Chưa hoàn tất
            </div>
          ) : (
            ''
          );
        },
      },
    },
  ];
};
export default Column;
