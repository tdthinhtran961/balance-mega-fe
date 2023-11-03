import { Popconfirm, Tooltip } from 'antd';
import React, { Fragment } from 'react';
const Column = ({ navigateEdit, handDelete }) => {
  return [
    {
      title: 'Mã danh mục',
      name: 'code',
      tableItem: {},
    },
    {
      title: 'Danh mục',
      name: 'name',
      tableItem: {
        render: (value) => <div className="font-medium">{value}</div>,
      },
    },
    {
      title: 'Trạng thái',
      name: 'isActive',
      tableItem: {
        // width: 160,
        render: (value) => {
          return value ? (
            <div className="bg-green-100 text-center p-1 border border-green-500 text-green-700 rounded-[4px] w-[145px]">
              Hoạt động
            </div>
          ) : (
            <div className="bg-red-100 text-center p-1 border border-red-500 text-red-500 rounded-[4px] w-[145px]">
              Ngừng hoạt động
            </div>
          );
        },
      },
    },
    // {
    //   title: "Mô tả danh mục",
    //   name: "description",
    // },
    {
      title: 'Thao tác',
      tableItem: {
        // width: 80,
        align: 'center',
        // fixed: "right",
        // onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <Fragment>
            <Tooltip title={'Sửa'}>
              <button
                className="text-teal-900 mr-2 text-2xl editBtn"
                onClick={() => navigateEdit && navigateEdit(data.id)}
              >
                <i className="las la-pencil-alt"></i>
              </button>
            </Tooltip>
            <Tooltip title={'Xóa'}>
              <Popconfirm
                placement="left"
                title={'Bạn có muốn xóa Danh mục này ?'}
                icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                onConfirm={() => handDelete([data.id])}
                okText={'Xóa'}
                cancelText={'Hủy'}
              >
                <button className="text-2xl mr-2 text-red-500 removeBtn">
                  <i className="las la-trash-alt"></i>
                </button>
              </Popconfirm>
            </Tooltip>
          </Fragment>
        ),
      },
    },
  ];
};
export default Column;
