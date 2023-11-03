import React from 'react';
const Column = ({ formatCurrency, roleCode }) => {
  return [
    {
      title: 'Mã NH',
      name: 'orderCode',
      tableItem: {},
    },
    {
      title: 'Cửa hàng',
      name: 'storeName',
      tableItem: {},
    },
    {
      title: 'Nhà cung cấp',
      name: 'supplierName',
      tableItem: {},
    },
    {
      title: 'Địa chỉ giao hàng',
      name: 'deliveryAddress',
      tableItem: {},
    },
    {
      title: 'Ngày đặt hàng',
      name: 'orderDate',
      tableItem: {},
    },
    {
      title: 'Tổng tiền (VND)',
      name: 'totalPrice',
      tableItem: {},
    },
    {
      title: 'Tình trạng',
      name: 'status',
      tableItem: {
        width: 160,
        render: (value) => {
          return value === 'DELIVERED' ? (
            <div className="bg-green-100 text-center p-1 border border-green-600 text-green-600 rounded-[4px]">
              Đã hoàn tất
            </div>
          ) : value === 'PROCESSING' ? (
            <div className="bg-[#FFF7ED] text-center p-1 border border-orange-500 text-orange-500 rounded-[4px]">
              Đang xử lý
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
