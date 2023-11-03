import React from 'react';
const Column = ({ formatCurrency, roleCode }) => {
  return [
    {
      title: 'Mã trả hàng',
      name: 'ReturnCode',
      width: 100,
      tableItem: {},
    },
    {
      title: 'Tên cửa hàng',
      name: 'storeName',
      width: 150,
      tableItem: {},
    },
    {
      title: 'Ngày trả hàng',
      name: 'ReturnDate',
      tableItem: {},
    },
    {
      title: 'Phiếu nhập hàng',
      name: 'billCode',
      tableItem: {
        render: (text, value) => {
          if (text) {
            return text
          }
          else {
            return 'Không'
          }
        }
      },
    }, {
      title: 'Tổng tiền (VND)',
      name: 'totalPrice',
      tableItem: {
        render: (text) => {
          return formatCurrency(text, '')
        }
      },
    },
    {
      title: 'Tình trạng',
      name: 'ReturnStatus',
      tableItem: {
        width: 160,
        render: (value) => {
          return value === 'COMPLETED' ? (
            <div className="bg-green-100 text-center p-1 border border-green-600 text-green-600 rounded-[4px]">
              Đã hoàn tất
            </div>
          ) : value === 'INPROCESS' ? (
            <div className="bg-[#FEFCE8] text-center p-1 border border-[#EAB308] text-[#EAB308] rounded-[4px]">
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
