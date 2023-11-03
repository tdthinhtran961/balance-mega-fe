// import React from 'react';
// import { formatCurrency } from 'utils';
// const Column = ({type}) => {
//   return [
//     {
//       title: 'Mã sản phẩm',
//       name: 'productCode',
//       tableItem: {
//         width: 170,
//         sorter: true,
//         filter: { type: 'search' },
//         render: (text, record, index) => record?.code
//       },
//     },
//     {
//       title: 'Tên sản phẩm',
//       name: 'productName',
//       tableItem: {
//         sorter: true,
//         filter: { type: 'search' },
//         render: (text, record, index) => record?.name
//       },
//     },
//     {
//       title: 'Danh mục',
//       name: 'productCategory',
//       tableItem: {
//         width: 300,
//         render: (text, record) => (
//           <span className="cursor-pointer hover:border-b-2">
//             {record?.productCategory?.length > 1
//               ? record?.productCategory?.reduce((previousValue, currentValue) =>
//                   previousValue.category !== null
//                     ? (previousValue?.category?.name ? previousValue?.category?.name : previousValue) +
//                       ', ' +
//                       currentValue?.category?.name
//                     : '',
//                 )
//               : record?.productCategory[0]?.category?.name}
//           </span>
//         ),
//       },
//     },
//    type === 'NonBal' ?
//    {
//     title: 'Giá nhập (VND)',
//     name: 'retailPrice',
//     tableItem: {
//       render: (value) => formatCurrency(value, ' '),
//     },
//   }
//    : {
//       title: 'Giá bán lẻ (VND)',
//       name: 'retailPrice',
//       tableItem: {
//         render: (value) => formatCurrency(value, ' '),
//       },
//     },
//   ];
// };
// export default Column;

import { formatCurrency } from 'utils';
import React from 'react';

const Column = ({ type }) => {
  return [
    {
      title: 'Mã sản phẩm',
      name: 'productCode',
      tableItem: {
        width: 170,
        sorter: true,
        filter: { type: 'search' },
        render: (text, record) => record?.code,
      },
    },
    {
      title: 'Mã vạch (CH)',
      name: 'storeBarcode',
      tableItem: {
        filter: { type: 'search' },
      },
    },
    type === 'NonBal'
      ? null
      : {
          title: 'Mã vạch (NCC)',
          name: 'supplierBarcode',
          tableItem: {
            filter: { type: 'search' },
            render: (value, record, index) => record?.barcode,
          },
        },
    {
      title: 'Tên sản phẩm',
      name: 'productName',
      tableItem: {
        sorter: true,
        filter: { type: 'search' },
        render: (text, record) => record?.name,
      },
    },
    {
      title: 'Danh mục',
      name: 'productCategory',
      tableItem: {
        width: 'auto',
        render: (text, record) => (
          <span className="">
            {record?.productCategory?.length > 1
              ? record?.productCategory?.reduce(
                  (previousValue, currentValue) =>
                    (previousValue?.category?.name ? previousValue?.category?.name : previousValue) +
                    ', ' +
                    currentValue?.category?.name,
                )
              : record?.productCategory[0]?.category?.name}
          </span>
        ),
      },
    },
    type === 'NonBal'
      ? {
          title: 'Nhà cung cấp',
          name: 'supplierName',
          tableItem: {
            render: (value, record, index) => record?.subOrg?.name,
          },
        }
      : {
          title: 'Nhà cung cấp',
          name: 'supplierName',
          tableItem: {},
        },
    {
      title: 'Đơn vị nhập',
      name: 'basicUnit',
      tableItem: {},
    },
    type === 'NonBal'
      ? {
          title: 'Giá nhập (VND)',
          name: 'retailPrice',
          tableItem: {
            width: 160,
            render: (value) => formatCurrency(value, ' '),
          },
        }
      : {
          title: 'Giá bán lẻ của NCC (VND)',
          name: 'retailPrice',
          tableItem: {
            width: 160,
            render: (value) => formatCurrency(value, ' '),
          },
        },
    {
      title: 'Giá bán lẻ của CH (VND)',
      name: 'sellingPrice',
      tableItem: {
        width: 160,
        render: (value) => value && formatCurrency(value, ' '),
      },
    },
    // {
    //   title: 'Giá nhập (VND)',
    //   name: 'price',
    //   tableItem: {
    //     width: 160,
    //     render: (value) => formatCurrency(value, ''),
    //   },
    // },
  ];
};
export default Column;
