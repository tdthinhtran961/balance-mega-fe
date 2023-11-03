import React from 'react';
import { ERole } from 'variable';
const Column = ({ roleCode, statusCheck }) => {
  return [
    {
      title: 'STT',
      // name: 'id',
      key: 'index',
      tableItem: {
        render: (text, record, index) => index + 1,
      },
    },
    {
      title: 'Tên nhà cung cấp',
      name: 'supplierName',
      tableItem: {},
    },
    roleCode === 'ADMIN' &&
      statusCheck === 'WAITING_APPROVE' && {
        title: 'Tên chủ cung ứng',
        name: 'owner',
        tableItem: {},
      },
    roleCode === 'ADMIN' &&
      statusCheck === 'WAITING_APPROVE' && {
        title: 'Số điện thoại',
        name: 'pNumber',
        tableItem: {},
      },
    {
      title: 'Địa chỉ',
      name: 'address',
      tableItem: {},
    },
    {
      title: 'Tên sản phẩm',
      name: 'productName',
      tableItem: {},
    },
    // {
    //   title: 'Giá chiết khấu (VNĐ)',
    //   name: 'discountPrice',
    //   tableItem: {
    //     // onCell: () => ({ style: { width: '300px' } }),
    //   },
    // },
    {
      title: 'Giá bán lẻ (VND)',
      name: 'listedPrice',
      tableItem: {
        // onCell: () => ({ style: { width: '300px' } }),
      },
    },
    statusCheck === 'WAITING_STORE' &&
      roleCode !== 'ADMIN' && {
        title: 'Hành động',
        name: 'status',
        tableItem: {
          render: (text) => {
            if ((roleCode === 'OWNER_STORE' || roleCode === ERole.sales)) {
              return (
                <button className="bg-teal-900 text-white px-2 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center connectBtn">
                  {'Đồng ý kết nối'}
                </button>
              );
            }
          },
        },
      },
    (statusCheck === 'WAITING_ADMIN' || statusCheck === 'WAITING_STORE') &&
      roleCode === 'ADMIN' && {
        title: 'Bảng giá',
        name: 'priceTable',
        tableItem: {
          render: (text) => {
            return (
              <button
                className="bg-white-500 border-teal-900 hover:border-teal-600 border-solid border
                text-base rounded-xl text-teal-900 hover:text-teal-600 p-2 priceBtn min-w-[83px]"
              >
                {'Xem giá'}
              </button>
            );
          },
        },
      },
    statusCheck === 'WAITING_ADMIN' &&
      roleCode === 'ADMIN' && {
        title: 'Thao tác',
        name: 'delete',
        tableItem: {
          render: (text) => {
            return (
              <button
                className="bg-white-500 border-red-500 hover:border-red-400 border-solid border
                text-base rounded-xl text-red-400 hover:text-red-300 p-2 hover:cursor-pointer deleteBtn"
                // onClick={() => {}}
              >
                {'Xóa'}
              </button>
            );
          },
        },
      },
    {
      title: 'Mô tả sản phẩm',
      name: 'description',
      formItem: {
        type: 'textarea',
        col: '12',
        disabled: () => true,
      },
    },
    {
      title: 'Mã sản phẩm',
      name: 'productCode',
      formItem: {
        col: '6',
        disabled: () => true,
      },
    },
    {
      title: 'Mã vạch',
      name: 'brandCode',
      formItem: {
        col: '6',
        disabled: () => true,
      },
    },
    {
      title: 'Thương hiệu',
      name: 'brand',
      formItem: {
        col: '6',
        disabled: () => true,
      },
    },
    {
      title: 'Danh mục',
      name: 'category',
      formItem: {
        col: '6',
        disabled: () => true,
      },
    },
  ];
};
export default Column;
