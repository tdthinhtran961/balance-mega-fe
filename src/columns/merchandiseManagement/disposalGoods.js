import React from 'react';
const Column = ({ formatCurrency, roleCode }) => {
  return [
    {
      title: 'Mã hủy hàng',
      name: 'disposalCode',
      tableItem: {},
    },
    {
      title: 'Tên cửa hàng',
      name: 'storeName',
      tableItem: {},
    },
    // {
    //   title: 'Địa chỉ hủy hàng',
    //   name: 'disposalAddress',
    //   tableItem: {},
    // },
    {
      title: 'Ngày hủy hàng',
      name: 'disposalDate',
      tableItem: {},
    },
    // {
    //   title: 'Tổng tiền (VND)',
    //   name: 'totalPrice',
    //   tableItem: {},
    // },
    {
      title: 'Tình trạng',
      name: 'disposalStatus',
      tableItem: {
        width: 160,
        render: (value) => {
          return value === 'COMPLETED' ? (
            <div className="bg-green-100 text-center p-1 border border-green-600 text-green-600 rounded-[4px]">
              Đã hoàn tất
            </div>
          ) : value === 'INPROCESS' ? (
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
