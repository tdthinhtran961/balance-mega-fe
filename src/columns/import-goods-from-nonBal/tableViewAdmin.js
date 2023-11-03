import React from 'react';

const Column = ({ roleCode }) => {
  return [
    {
      title: 'Mã nhập hàng',
      name: 'code',
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
      title: 'Ngày đặt hàng',
      name: 'importGoodsNonBalDate',
      tableItem: {},
    },
    {
      title: 'Tổng tiền (VND)',
      name: 'totalMoney',
      tableItem: {},
    },

    // {
    //   title: 'Tổng tiền (VND)',
    //   name: 'totalPrice',
    //   tableItem: {
    //     render: (text) => formatCurrency(text, ' '),
    //   },
    // },
    {
      title: 'Trạng thái',
      name: 'importGoodsNonBalStatus',
      tableItem: {
        render: (value) => {
          if (value === 'WAITING_APPROVED') {
            return (
              <div className="bg-yellow-50 text-center border border-yellow-500 text-yellow-500 rounded-[4px] text-sm w-[105px] h-[36px] leading-[36px]">
                Đang xử lý
              </div>
            );
          } else if (value === 'COMPLETED') {
            return (
              <div className="bg-green-50 text-center border border-green-600 text-green-600 rounded-[4px] text-sm w-[105px] h-[36px] leading-[36px]">
                Đã hoàn tất
              </div>
            );
          }
        },
      },
    },
  ];
};
export default Column;
