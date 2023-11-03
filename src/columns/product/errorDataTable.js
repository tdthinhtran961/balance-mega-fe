// import React from 'react';
// import { formatCurrency } from 'utils';
const Column = ({ roleCode }) => {

  return [
    {
      title: 'Dòng',
      name: 'index',
      tableItem: {
        width: '25%',
      },
    },
    {
      title: 'Lỗi',
      name: 'error',
      tableItem: {
        // sorter: true,
      },
    },
]
};
export default Column;
