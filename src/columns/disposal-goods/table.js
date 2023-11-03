import React from 'react';

const Column = ({ roleCode }) => {
  if (roleCode === 'OWNER_STORE') {
    return [
      {
        title: 'Mã hủy hàng',
        name: 'code',
        tableItem: {
          width: window.innerWidth > 821 ? 'calc(50% - 80px)' : 200,
        },
      },
      {
        title: 'Ngày hủy',
        name: 'disposalDate',
        tableItem: {
          width: window.innerWidth > 821 ? 'calc(50% - 80px)' : 100,
          // width: '33%',
        },
      },
      // {
      //   title: 'Tổng tiền (VND)',
      //   name: 'totalPrice',
      //   tableItem: {
      //     render: (text) => formatCurrency(text, ' '),
      //   },
      // },
      {
        title: 'Trạng thái',
        name: 'disposalStatus',
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
    ];
  } else if (roleCode === 'ADMIN') {
    return [
      {
        title: 'Mã hủy hàng',
        name: 'disposalCode',
        tableItem: {
          width: '30%',
        },
      },
      {
        title: 'Tên cửa hàng',
        name: 'storeName',
        tableItem: { width: '30%' },
      },
      // {
      //   title: 'Địa chỉ hủy hàng',
      //   name: 'disposalAddress',
      //   tableItem: {},
      // },
      {
        title: 'Ngày hủy hàng',
        name: 'disposalDate',
        tableItem: {
          width: '25%',
          // width: 170
        },
      },
      // {
      //   title: 'Tổng tiền (VND)',
      //   name: 'totalPrice',
      //   tableItem: {},
      // },
      {
        title: 'Tình trạng',
        name: 'disposalStatus',
        tableItem: {
          width: 160,
          render: (value) => {
            return value === 'COMPLETED' ? (
              <div className="bg-green-100 text-center p-1 border border-green-600 text-green-600 rounded-[4px]">
                Đã hoàn tất
              </div>
            ) : value === 'INPROCESS' ? (
              <div className="bg-yellow-50 text-center p-1 border border-yellow-500 text-yellow-500 rounded-[4px]">
                Đang xử lý
              </div>
            ) : (
              ''
            );
          },
        },
      },
    ];
  }
};
export default Column;
