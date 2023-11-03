import { formatCurrency } from 'utils';
import React from 'react';

const Column = () => {
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
    {
      title: 'Nhà cung cấp',
      name: 'supplierNameStore',
      tableItem: {},
    },
    {
      title: 'Giá nhập (VND)',
      name: 'price',
      tableItem: {
        width: 160,
        render: (value) => formatCurrency(value, ''),
      },
    },
    {
      title: 'Giá bán của CH (VND)',
      name: 'sellingPrice',
      tableItem: {
        width: 160,
        render: (value) => value && formatCurrency(value, ''),
      },
    },
  ];
};
export default Column;
