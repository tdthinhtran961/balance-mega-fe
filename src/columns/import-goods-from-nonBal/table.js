import React from 'react';

const Column = ({ roleCode }) => {
  if (roleCode === 'OWNER_STORE') {
    return [
      {
        title: 'Mã nhập hàng',
        name: 'code',
        tableItem: { width: 200 },
      },
      {
        title: 'Tên nhà cung cấp',
        name: 'supplierName',
        tableItem: {},
      },
      {
        title: 'Ngày nhập',
        name: 'importGoodsNonBalDate',
        tableItem: { width: 140 },
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
          width: 160,
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
  } else if (roleCode === 'ADMIN') {
    return [
      {
        title: 'Mã nhập hàng',
        name: 'importGoodsNonBalCode',
        tableItem: {},
      },
      {
        title: 'Tên nhà cung cấp',
        name: 'supplierName',
        tableItem: {},
      },
      {
        title: 'Tổng tiền (VND)',
        name: 'totalMoney',
        tableItem: {},
      },
      {
        title: 'Ngày nhập',
        name: 'importGoodsNonBalDate',
        tableItem: {},
      },
      // {
      //   title: 'Tổng tiền (VND)',
      //   name: 'totalPrice',
      //   tableItem: {},
      // },
      {
        title: 'Trạng thái',
        name: 'importGoodsNonBalStatus',
        tableItem: {
          width: 160,
          render: (value) => {
            return value === 'COMPLETED' ? (
              <div className="bg-green-100 text-center p-1 border border-green-600 text-green-600 rounded-[4px]">
                Đã hoàn tất
              </div>
            ) : value === 'INPROCESS' ? (
              <div className="bg-yellow-50 text-center p-1 border border-yellow-500 text-yellow-500 rounded-[4px]">
                Đang xử lý
              </div>
            ) : (
              ''
            );
          },
        },
      },
    ];
  }
};
export default Column;
