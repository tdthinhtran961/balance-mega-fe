
import React from 'react';
const Column = () => {
  return [
    {
      title: 'Mã người dùng',
      name: 'code',
      tableItem: {
        width: 140,
        // filter: { type: 'search' },
        // sorter: true,
        //   width: '18%',
      },
    },
    {
      title: 'Họ và tên',
      name: 'userName',
      tableItem: {
        // filter: { type: 'search' },
        // sorter: true,
        onCell: (data) => ({
          style: { paddingTop: '0.25rem', paddingBottom: 0 },
          onClick: async () => { },
        }),
      },
    },
    {
      title: 'Email',
      name: 'email',
      tableItem: {
        // filter: { type: 'search' },
        // sorter: true,
      },
    },
    {
      title: 'Số điện thoại',
      name: 'phoneNumber',
      tableItem: {
        // filter: { type: 'search' },
        // sorter: true,
      },
    },
    {
      title: 'Hệ thống NCC',
      name: 'subOrgName',
      tableItem: {
        // filter: { type: 'search' },
        // sorter: true,
      },
    },

    {
      title: 'Ghi chú',
      name: 'note',
      formItem: {
        type: 'textarea',
      },
    },
    {
      title: 'Vai trò',
      name: 'userRole',
      tableItem: {
        // filter: { type: 'search' },
        // sorter: true,

        // render: (text) => {
        //   if (text.length > 0) {
        //     if (text[0].mtRole.code === 'ADMIN') return 'Quản trị viên';
        //     if (text[0].mtRole.code === 'OWNER_STORE') return 'Đại diện cửa hàng';
        //     if (text[0].mtRole.code === 'OWNER_SUPPLIER') return 'Đại diện NCC';
        //   } else return null;
        // },
        render: () => 'Quản trị viên'
      },
    },
    {
      title: "Tình trạng",
      name: "status",
      tableItem: {
        width: 180,
        render: (value) => {
          return value === 'ACTIVE' ? <div className="w-[144px] h-[28px] leading-[27px] rounded-[4px] text-sm font-normal text-green-600 bg-green-50 text-center border border-green-600">Đang Hoạt động</div> : value === 'UNACTIVE' ?
            <div className="w-[144px] h-[28px] leading-[27px] rounded-[4px] text-sm font-normal text-red-600  bg-red-50 text-center border border-red-600 ">Ngưng hoạt động</div>
            : null
        }
      },
    },

  ];
};
export default Column;
