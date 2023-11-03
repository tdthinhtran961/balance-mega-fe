import React from 'react';
import { formatCurrency } from 'utils';

const Column = ({ roleCode }) => {
  return [
    {
      title: 'Mã phiếu',
      name: 'billNumber',
      tableItem: {
        render: (text) => !text ? 'Đang xử lý' : text
        // width: '15%',
      },
    },
    {
      title: 'Loại phiếu',
      name: 'billType',
      tableItem: {
        render: (value) => {
          if (value === 'RECIEVED') {
            return <p>Nhập hàng</p>;
          } else if (value === 'RETURN') {
            return <p>Trả hàng</p>;
          } else if (value === 'DISPOSAL') {
            return <p>Hủy hàng</p>;
          } else if (value === 'TRANSFER_SEND') {
            return <p>Chuyển hàng (Xuất)</p>;
          } else if (value === 'TRANSFER_RECIEVED') {
            return <p>Chuyển Hàng (Nhập)</p>;
          }
        },
      },
    },
    {
      title: 'Ngày tạo',
      name: 'createdAt',
      tableItem: {},
    },
    {
      title: 'Tên nhà cung cấp',
      name: 'supplierName',
      tableItem: {},
    },
    {
      title: 'PO/RN',
      name: 'referenceCode',
      tableItem: {},
    },
    {
      title: 'CH Nhập/Xuất',
      name: 'referenceStoreName',
      tableItem: {},
    },
    {
      title: 'Tổng tiền',
      name: 'totalAmount',
      tableItem: {
        render: (text) => text && formatCurrency(text, ' '),
      },
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        width: 160,
        render: (value) => {
          if (value === 'INPROCESS') {
            return <div className="bg-yellow-50 text-center p-1 border border-yellow-500 text-yellow-500 rounded-[4px]">Đang xử lý</div>;
          } else if (value === 'DELIVERED' || value === 'COMPLETED') {
            return <div className="bg-green-100 text-center p-1 border border-green-600 text-green-600 rounded-[4px]">Đã hoàn thành</div>;
          }
        },
      },
    },
    {
      title: 'Người tạo',
      name: 'createdBy',
      tableItem: {},
    },
  ];
};
export default Column;