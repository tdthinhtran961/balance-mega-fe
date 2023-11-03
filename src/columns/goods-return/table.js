import React from 'react';
import { formatCurrency } from 'utils';

const Column = ({ roleCode }) => {
  return [
    {
      title: 'Mã trả hàng',
      name: 'code',
      tableItem: {
        width: 145,
      },
    },
    {
      title: 'Tên cửa hàng',
      name: 'storeName',
      hidden: 'OWNER_STORE',
      tableItem: {},
    },
    {
      title: 'Nhà cung cấp',
      name: 'supplierName',
      // with: 100,
      tableItem: {},
    },
    {
      title: 'Phiếu Nhập',
      name: 'billCode',
      tableItem: {
        render: (text, record) => {
          if (text) {
            return text;
          } else return 'Không';
        },
      },
    },
    {
      title: 'Tổng tiền (VND)',
      name: 'totalPrice',
      tableItem: {
        render: (text) => text && formatCurrency(text, ' '),
      },
    },
    {
      title: 'Ngày trả hàng',
      name: 'importedAt',
      tableItem: {},
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        width: 160,
        render: (value) => {
          if (value === 'INPROCESS') {
            return (
              <div className="bg-yellow-50 text-center border border-yellow-500 text-yellow-500 rounded-[4px] text-sm w-[105px] h-[36px] leading-[36px]">
                Đang xử lý
              </div>
            );
          } else if (value === 'COMPLETED') {
            return (
              <div className="bg-green-50 text-center border border-green-600 text-green-600 rounded-[4px] text-sm w-[105px] h-[36px] leading-[36px]">
                Đã hoàn tất
              </div>
            );
          }
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
  ].filter((item) => item.hidden !== roleCode);
};
export default Column;
//
