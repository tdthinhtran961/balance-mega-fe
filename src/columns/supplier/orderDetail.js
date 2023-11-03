import React from 'react';
const Column = ({ navigateDetail, handleShow }) => {
  return [
    {
      title: 'STT',
      name: 'index',
      tableItem: {},
    },
    {
      title: 'Mã sản phẩm',
      name: 'productCode',
      tableItem: {
        // onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0, cursor: 'pointer' } }),
        // render: (text, data) => <div onClick={() => handleShow(data.id)}>{text}</div>,
      },
    },
    {
      title: 'Tên sản phẩm',
      name: 'productName',
      tableItem: {},
    },
    {
      title: 'Số lượng',
      name: 'amount',
      tableItem: {},
    },
    {
      title: 'Đơn vị',
      name: 'unit',
      tableItem: {},
    },
    {
      title: 'Doanh thu (VND)',
      name: 'revenue',
      tableItem: {},
    },
    {
      title: 'Loại chiết khấu',
      name: 'discountType',
      tableItem: {
        render: (value) => {
          return value === 'FIXED_COMMISSION' ? (
            <p>Chiết khấu cố định</p>
          ) : value === 'PERCENT_COMMISSION' ? (
            <p>Chiết khấu phần trăm</p>
          ) : value === 'AMOUNT_COMMISSION' ? (
            <p>Chiết khấu theo số tiền</p>
          ) : (
            ''
          );
        },
      },
    },
    {
      title: 'Chiết khấu (VND)',
      name: 'discountTotal',
      tableItem: {},
    },
  ];
};
export default Column;
