import React from 'react';
const Column = ({ navigateDetail, handleShow }) => {
  return [
    {
      title: 'Mã thanh toán',
      name: 'paymentCode',
      tableItem: {},
    },
    {
      title: 'Ngày thanh toán',
      name: 'paymentDate',
      tableItem: {
        // onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0, cursor: 'pointer' } }),
        // render: (text, data) => <div onClick={() => handleShow(data.id)}>{text}</div>,
      },
    },
    {
      title: 'Đã thanh toán (VND)',
      name: 'payedTotal',
      tableItem: {},
    },
    {
      title: 'Phương thức',
      name: 'method',
      tableItem: {
        render: (value) => {
          return value === 'BANK_TRANSFER' ? <p>Chuyển khoản</p> : value === 'CASH' ? <p>Tiền mặt</p> : '';
        },
      },
    },
    {
      title: 'Trạng thái thanh toán',
      name: 'status',
      tableItem: {
        width: 180,
        render: (value) => {
          return value === 'RECIVED' ? (
            <div className="bg-green-100 text-center p-1 border border-green-500 text-green-500 rounded-[4px]">Đã nhận</div>
          ) : value === 'DELIVERED' ? (
            <div className="bg-blue-100 text-center p-1 border border-blue-500 text-blue-500 rounded-[4px]">Đã chuyển</div>
          ) : '';
        },
      },
    },
  ];
};
export default Column;
