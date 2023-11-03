import React from 'react';
const Columns = () => {
  return [
    {
      title: 'Mã chuyển hàng',
      name: 'code',
      tableItem: {
        width: 195,
      },
    },
    {
      title: 'Cửa hàng nhận',
      name: 'receivedStoreName',
      tableItem: {},
    },
    {
      title: 'Cửa hàng chuyển',
      name: 'storeName',
      tableItem: {},
    },
    {
      title: 'Ngày chuyển hàng',
      name: 'transferDate',
      tableItem: { width: 150 },
    },
    {
      title: 'Trạng thái',
      name: 'transferStatus',
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
};
export default Columns;
