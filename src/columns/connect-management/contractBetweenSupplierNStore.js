import React from 'react';
const Column = ({ listProduct }) => {
  return [
    {
      title: 'Mã hợp đồng',
      name: 'code',
      tableItem: {},
      formItem: {
        condition: (text) => !!text,
      },
    },
    {
      title: 'Ngày phê duyệt yêu cầu',
      name: 'approvedDate',
      tableItem: {},
    },
    {
      title: 'Tên cửa hàng',
      name: 'storeName',
      tableItem: {},
    },
    {
      title: 'Tên nhà cung cấp',
      name: 'supplierName',
      tableItem: {},
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        render: (text) => {
          if (text === 'Ký thành công')
            return (
              <div className="bg-green-50 text-center p-1 border border-green-500 rounded-lg text-green-500 w-[144px]">
                {text}
              </div>
            );
          else if (text === 'Chờ ký')
            return (
              <div className="bg-yellow-50 text-center p-1 border border-yellow-500 rounded-lg text-yellow-500 w-[144px]">
                {text}
              </div>
            );
          else if (text === 'CH từ chối')
            return (
              <div className="bg-red-50 text-center p-1 border border-red-500 rounded-lg text-red-500 w-[144px]">
                {text}
              </div>
            );
        },
      },
    },
  ];
};
export default Column;