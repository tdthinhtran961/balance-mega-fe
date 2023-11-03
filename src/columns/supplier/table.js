import React from 'react';
const Column = ({ navigateEdit, handDelete, navigateDetail }) => {
  return [
    {
      title: 'Mã NCC',
      name: 'code',
      tableItem: {
        width: 140,
      },
    },
    {
      title: 'Tên nhà cung cấp',
      name: 'supplierName',
      tableItem: {
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0, cursor: 'pointer' } }),
        render: (text, data) => <div onClick={() => navigateEdit && navigateEdit(data.id)}>{text}</div>,
      },
    },
    {
      title: 'Địa chỉ',
      name: 'address',
      tableItem: {},
    },
    {
      title: 'Người đại diện',
      name: 'managerName',
      tableItem: {},
    },
    {
      title: 'Số điện thoại',
      name: 'phoneNumber',
      tableItem: {
        width: 115,
      },
    },
    {
      title: 'Trạng thái',
      name: 'contract',
      tableItem: {
        width: 100,
        render: (text, record) => {
          return record?.contract[0]?.status === 'SIGNED_CONTRACT' ? (
            <div className="bg-green-100 text-center p-1 border border-green-500 text-green-600 rounded-[4px]">
              Đã ký
            </div>
          ) : (
            <div className="bg-red-100 text-center p-1 border border-red-500 text-red-600 rounded-[4px]">
              Chờ ký
            </div>
          );
        },
      },
    },
    // {
    //   title: 'Tình trạng',
    //   name: 'isActive',
    //   tableItem: {
    //     width: 160,
    //     render: (value) => {
    //       return value ? (
    //         <div className="bg-green-100 text-center p-1 border border-green-500 text-green-600 rounded-[4px]">
    //           Đang hoạt động
    //         </div>
    //       ) : (
    //         <div className="bg-red-100 text-center p-1 border border-red-500 text-red-600 rounded-[4px]">
    //           Ngưng hoạt động
    //         </div>
    //       );
    //     },
    //   },
    // },
  ];
};
export default Column;
