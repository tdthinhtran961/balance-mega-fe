import { formatCurrency } from "utils";
import React from "react";

const Column = () => {
  return [
    {
      title: 'STT',
      name: 'stt',
      tableItem: {
        width: 145,
        render: (_, _, index) => index + 1
      },
    },
    {
      title: 'Mã vạch',
      name: 'barCode',
      tableItem: {

      },
    },
    {
      title: 'Tên sản phẩm',
      name: 'name',
      tableItem: {
        render: (value) => value
      },
    },
    {
      title: 'Ảnh',
      name: 'photos',
      tableItem: {
        render: (value) => value
      },
    },
    {
      title: 'Nội dung',
      name: 'content',
      tableItem: {
        width: 260,
        render: (value) => {
          return <Input placeholder="Nhập nội dung" />
        }
      },
    },
  ];
};
export default Column;
