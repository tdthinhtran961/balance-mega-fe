// import React from 'react';
const Column = () => {
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
      title: 'Chủng loại giá',
      name: 'priceType',
      tableItem: {},
    },
    {
      title: 'Số lượng tối thiểu',
      name: 'minQuantity',
      tableItem: {},
    },
    // {
    //   title: 'Combo sản phẩm',
    //   name: 'combo',
    //   tableItem: {},
    // },
    // {
    //   title: 'Giá niêm yết (VNĐ)',
    //   name: 'listedPrice',
    //   tableItem: {},
    // },
    {
      title: 'Giá bán (VND)',
      name: 'price',
      tableItem: {},
    },
    // {
    //   title: 'Vận chuyển',
    //   name: 'transport',
    //   tableItem: {},
    // },
  ];
};
export default Column;
