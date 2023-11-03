import React, { Fragment } from 'react';
import { formatCurrency } from 'utils';
const Column = ({ handDelete, handleDelete, handleChange }) => {
  return [
    {
      title: 'STT',
      name: 'index',
      tableItem: {
        align: 'center',
        width: 70,
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        // render: (i, u, index) => index + 1,
      },
    },
    {
      title: 'Mã vạch',
      name: 'barcode',
      tableItem: {},
    },
    {
      title: 'Tên sản phẩm',
      name: 'name',
      tableItem: {},
    },
    {
      title: 'Danh mục',
      name: 'category',
      tableItem: {
        render: (text, record) => (
          <span className="">
            {/* {record.category?.length > 1
              ? record?.category?.reduce(
                (previousValue, currentValue) =>
                  (previousValue?.level1?.name ? previousValue?.category?.name : previousValue) +
                  ', ' +
                  currentValue?.category?.name,
              )
              : record.productCategory[0]?.category.name} */}
            {record.category.level3 ?? record.category.level2 ?? record.category.level1}
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
      title: 'Giá bán lẻ',
      name: 'price',
      tableItem: {
        render: (value) => formatCurrency(value, ''),
      },
    },

    // {
    //   title: 'Trạng thái',
    //   name: 'approveStatus',
    //   tableItem: {
    //     width: 145,
    //     render: (value) => {
    //       if (value === 'APPROVED') {
    //         return (
    //           <div className="bg-green-100 text-center border border-green-500 text-green-500 rounded-[4px] text-sm w-[123px] h-[28px] leading-[28px]">Đang bán</div>
    //         );
    //       } else if (value === 'STOP_SELLING') {
    //         return (
    //           <div className="bg-red-50 text-center border border-red-600 text-red-500 rounded-[4px] text-sm w-[123px] h-[28px] leading-[28px]">Ngưng bán</div>
    //         );
    //       }

    //     },
    //   },
    // },
    // {
    //   title: 'Số lượng',
    //   name: 'stockQuantity',
    //   tableItem: {
    //     width: 100,
    //   },
    // },
    {
      title: '',
      tableItem: {
        width: 100,
        align: 'center',
        fixed: 'right',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <Fragment>
            <button
              className="text-2xl mr-2 text-red-500 removeBtn"
              onClick={() => {
                handleDelete(data.index);
              }}
            >
              <i className="las la-trash-alt"></i>
            </button>
          </Fragment>
        ),
      },
    },
  ];
};
export default Column;
