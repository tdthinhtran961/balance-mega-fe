import React from 'react';

const Column = ({ pageType, roleCode }) => {
  return [
    {
      title: 'Mã sản phẩm',
      name: 'productCode',
      tableItem: {
        width: 170,
        sorter: true,
        filter: { type: 'search' },
        render: (value, record, index) => record?.code,
      },
    },
    {
      title: 'Tên sản phẩm',
      name: 'productName',
      tableItem: {
        sorter: true,
        filter: { type: 'search' },
        render: (value, record, index) => record?.name,
      },
    },
    {
      title: 'Danh mục sản phẩm',
      name: 'productCategory',
      tableItem: {
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
    roleCode !== 'OWNER_SUPPLIER' &&
      roleCode !== 'DISTRIBUTOR' && {
        title: 'Nhà cung cấp',
        name: 'supplierName',
        tableItem: {},
      },
    {
      title: 'Trạng thái',
      name: 'approveStatus',
      tableItem: {
        width: 160,
        render: (value) => {
          if (value === 'WAITING_APPROVE') {
            return (
              <div className="bg-yellow-50 text-center border border-yellow-500 text-yellow-500 rounded-[4px] text-sm w-[123px] h-[28px] leading-[28px]">
                Chờ phê duyệt
              </div>
            );
          } else if (value === 'REJECTED') {
            return (
              <div className="bg-blue-50 text-center border border-blue-500 text-blue-500 rounded-[4px] text-sm w-[123px] h-[28px] leading-[28px]">
                Từ chối
              </div>
            );
          }
          // return (
          //   <div className="bg-red-100 text-center p-1 border border-red-500 rounded-xl mr-4">Hết hàng</div>
          // );
        },
      },
    },
  ];
};
export default Column;
