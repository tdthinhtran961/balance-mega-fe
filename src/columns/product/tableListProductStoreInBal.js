import { formatCurrency } from "utils";
import React from "react";

const Column = () => {
  return [
    {
      title: 'Mã sản phẩm',
      name: 'productCode',
      tableItem: {
        width: 170,
        filter: { type: 'search' },
        sorter: true,
        render: (value, record, index) => record?.code
      },
    },
    {
      title: 'Mã vạch (CH)',
      name: 'storeBarcode',
      tableItem: {
        filter: { type: 'search' }
      },
    },
    {
      title: 'Mã vạch (NCC)',
      name: 'supplierBarcode',
      tableItem: {
        filter: { type: 'search' },
        render: (value, record, index) => record?.barcode
      },
    },
    {
      title: 'Tên sản phẩm',
      name: 'productName',
      tableItem: {
        sorter: true,
        filter: { type: 'search' },
        render: (value, record, index) => record?.name
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
      name: 'supplierName',
      tableItem: {},
    },
    {
      title: 'Giá bán lẻ của NCC (VND)',
      name: 'retailPrice',
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
