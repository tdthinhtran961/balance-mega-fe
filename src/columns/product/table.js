import React, { useRef } from 'react';
import { approveStatus } from 'constants/index';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from 'utils';
const Column = ({ roleCode }) => {
  const { t } = useTranslation();
  const statusButtons = useRef({
    [approveStatus.WAITING_APPROVE]: {
      borderColor: 'border-[#EAB308]',
      textColor: 'text-[#EAB308]',
      bgColor: 'bg-yellow-100',
    },
    [approveStatus.APPROVED]: { borderColor: 'border-[#16A34A]', textColor: 'text-[#16A34A]', bgColor: 'bg-green-100' },
    [approveStatus.REJECTED]: { borderColor: 'border-[#333fe9]', textColor: 'text-[#333fe9]', bgColor: 'bg-blue-100' },
    [approveStatus.OUT_OF_STOCK]: { borderColor: 'border-red-500', textColor: 'text-[#EF4444]', bgColor: 'bg-red-100' },
    [approveStatus.STOP_SELLING]: { borderColor: 'border-black', textColor: 'text-black', bgColor: 'bg-gray-100' },
    [approveStatus.CANCELLED]: { borderColor: 'border-black', textColor: 'text-black', bgColor: 'bg-gray-100' },
  });

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
    (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && {
      title: 'Mã vạch',
      name: 'supplierBarcode',
      tableItem: {
        width: 170,
        sorter: true,
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
        render: (value, record, index) => record?.name,
      },
    },
    {
      title: 'Danh mục',
      name: 'productCategory',
      tableItem: {
        render: (text, record) => (
          <span className="">
            {record.productCategory?.length > 1
              ? record?.productCategory?.reduce(
                  (previousValue, currentValue) =>
                    (previousValue?.category?.name ? previousValue?.category?.name : previousValue) +
                    ', ' +
                    currentValue?.category?.name,
                )
              : record.productCategory[0]?.category.name}
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
      title: 'Giá bán lẻ của NCC (VND)',
      name: 'retailPrice',
      tableItem: {
        width: 170,
        render: (value) => formatCurrency(value, ''),
      },
    },

    {
      title: 'Trạng thái',
      name: 'approveStatus',
      tableItem: {
        width: 160,
        render: (value) => {
          const btn = statusButtons.current[value];
          return (
            <div className={`${btn.bgColor} text-center p-1 border ${btn.borderColor} rounded-xl ${btn.textColor}`}>
              {t(`constants.approveStatus.${value}`)}
            </div>
          );
        },
      },
    },
    // {
    //   title: 'Số lượng',
    //   name: 'stockQuantity',
    //   tableItem: {
    //     width: 100,
    //   },
    // },
    // {
    //   title: 'Hoạt động',
    //   tableItem: {
    //     width: 180,
    //     align: 'center',
    //     fixed: 'right',
    //     onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
    //     render: (text, data) => (
    //       <Fragment>
    //         <Tooltip title={'Sửa'}>
    //           <button
    //             className="text-teal-900 mr-2 text-2xl editBtn"
    //             onClick={() => navigateEdit && navigateEdit(data.id)}
    //           >
    //             <i className="las la-pencil-alt"></i>
    //           </button>
    //         </Tooltip>
    //         <Tooltip title={'Xóa'}>
    //           <Popconfirm
    //             placement="left"
    //             title={'Bạn có muốn xóa Danh mục này ?'}
    //             icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
    //             onConfirm={() => handDelete([data.id])}
    //             okText={'Xóa'}
    //             cancelText={'Hủy'}
    //           >
    //             <button className="text-2xl mr-2 text-red-500 removeBtn">
    //               <i className="las la-trash-alt"></i>
    //             </button>
    //           </Popconfirm>
    //         </Tooltip>
    //       </Fragment>
    //     ),
    //   },
    // },
  ];
};
export default Column;
