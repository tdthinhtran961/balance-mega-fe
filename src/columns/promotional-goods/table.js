import React from 'react';
import { formatCurrency } from 'utils';

const Column = ({ roleCode }) => {
  if (roleCode === 'OWNER_STORE') {
    return [
      {
        title: 'Mã nhập hàng',
        name: 'code',
        tableItem: {
          width: 200,
          render: (text) => (!text ? 'Đang xử lý' : text),
        },
      },
      {
        title: 'Tên nhà cung cấp',
        name: 'supplierName',
        tableItem: {},
      },
      {
        title: 'Tổng tiền (VND)',
        name: 'totalPrice',
        tableItem: {
          render: (text) => formatCurrency(text, ' '),
        },
      },
      {
        title: 'Ngày nhận',
        name: 'importedAt',
        tableItem: { width: 130 },
      },
      {
        title: 'Trạng thái',
        name: 'importedStatus',
        tableItem: {
          width: 160,
          render: (value) => {
            if (value === 'PROCESSING') {
              return (
                <div className="bg-yellow-50 text-center border border-yellow-500 text-yellow-500 rounded-[4px] text-sm w-[105px] h-[36px] leading-[36px]">
                  Đang xử lý
                </div>
              );
            } else if (value === 'DELIVERED' || value === 'COMPLETED') {
              return (
                <div className="bg-green-50 text-center border border-green-600 text-green-600 rounded-[4px] text-sm w-[105px] h-[36px] leading-[36px]">
                  Đã hoàn tất
                </div>
              );
            }
          },
        },
      },
      {
        title: 'Thanh toán',
        name: 'paymentSupplierStatus',
        tableItem: {
          width: 140,
          render: (value) => {
            return value === 'PAID' ? (
              <div className="bg-green-100 text-center p-1 border border-green-600 text-green-600 rounded-[4px]">
                Đã thanh toán
              </div>
            ) : value === 'PARTIAL_PAID' ? (
              <div className="bg-yellow-50 text-center p-1 border border-yellow-500 text-yellow-500 rounded-[4px]">
                Thanh toán một phần
              </div>
            ) : value === 'UNPAID' ? (
              <div className="bg-red-50 text-center p-1 border border-red-500 text-red-500 rounded-[4px]">
                Chưa thanh toán
              </div>
            ) : (
              ''
            );
          },
        },
      },
    ];
  }
  if (roleCode === 'ADMIN') {
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
  }
};
export default Column;
