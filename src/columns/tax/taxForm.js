import React, { Fragment } from 'react';
import { Popconfirm } from 'antd';
import numberVietnam from 'utils/mask/numberVietnam';
const Column = ({ t, handleEdit, handleDelete }) => {
  return [
    {
      title: 'STT',
      name: 'stt',
      tableItem: {
        // filter: { type: "search" },
        // sorter: true,
        align: 'center',
        width: 60,
        onCell: (data) => ({
          // style: { paddingTop: '0.25rem', paddingBottom: 0 },
          onClick: async () => { },
        }),
        render: (text, record, index) => index + 1,
      },
    },
    {
      title: 'Loại thuế',
      name: 'name',
      tableItem: {
        width: 160,
      },
      formItem: {
        placeholder: 'Nhập loại thuế',
        rules: [
          {
            type: 'required',
          },
          {
            type: 'max',
            value: 255,
            message: 'Vui lòng không nhập quá 255 ký tự.'
          }
        ],
      },
    },
    {
      title: 'Thuế suất (%)',
      name: 'taxRate',
      tableItem: {
        width: 120,
      },
      formItem: {
        mask: numberVietnam,
        placeholder: 'Nhập thuế',
        rules: [
          {
            type: 'custom',
            validator: () => ({
              validator(_, value) {
                if (value === '' || value === undefined || value === null) {
                  return Promise.reject(new Error('Đây là trường bắt buộc!'));
                  // } else if (!/^[0-9]+$/.test(value)) {
                  //   return Promise.reject(new Error('Vui lòng chỉ nhập số'));
                } else if (value < 0 || value > 999) {
                  return Promise.reject(new Error('Chỉ chấp nhận giá trị từ 0 đến 999'));
                } else {
                  return Promise.resolve();
                }
              },
            }),
          },
        ],
      },
    },
    {
      title: 'Mô tả',
      name: 'descripton',
      tableItem: {
        render: (text, data) => (
          <Fragment>
            <span>
              {text}
            </span>

          </Fragment>
        ),
        onCell: (data) => ({
          onClick: async () => { },
        }),
        // render: (text, record, index) => index + 1
      },
      formItem: {
        type: 'textarea',
        placeholder: 'Nhập mô tả',
        rules: [{ type: 'max', value: 500, message: 'Chỉ được nhập tối đa 500 kí tự' }],
      },
    },
    {
      title: 'Hoạt động',
      tableItem: {
        width: 120,
        align: 'center',
        fixed: 'right',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <Fragment>
            <span>
              <button className="" onClick={() => handleEdit(data)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15.9297 0.976562C15.1445 0.976562 14.3594 1.28125 13.75 1.89062L1.89062 13.75L1.84375 13.9844L1.02344 18.1094L0.789062 19.2109L1.89062 18.9766L6.01562 18.1562L6.25 18.1094L18.1094 6.25C19.3281 5.03125 19.3281 3.10938 18.1094 1.89062C17.5 1.28125 16.7148 0.976562 15.9297 0.976562ZM15.9297 2.40625C16.3076 2.40625 16.6885 2.5791 17.0547 2.94531C17.7842 3.6748 17.7842 4.46582 17.0547 5.19531L16.5156 5.71094L14.2891 3.48438L14.8047 2.94531C15.1709 2.5791 15.5518 2.40625 15.9297 2.40625ZM13.2344 4.53906L15.4609 6.76562L6.39062 15.8359C5.89844 14.875 5.125 14.1016 4.16406 13.6094L13.2344 4.53906ZM3.20312 14.8281C4.10254 15.1914 4.80859 15.8975 5.17188 16.7969L2.71094 17.2891L3.20312 14.8281Z"
                    fill="#3B82F6"
                  />
                </svg>
              </button>
            </span>
            <span>
              <Popconfirm
                placement="left"
                title="Bạn có chắc muốn xóa thuế này ?"
                icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                onConfirm={() => handleDelete(data.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <button className="ml-4">
                  <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6.25 0C5.85742 0 5.45605 0.137695 5.17188 0.421875C4.8877 0.706055 4.75 1.10742 4.75 1.5V2.25H0.25V3.75H1V15.75C1 16.9834 2.0166 18 3.25 18H12.25C13.4834 18 14.5 16.9834 14.5 15.75V3.75H15.25V2.25H10.75V1.5C10.75 1.10742 10.6123 0.706055 10.3281 0.421875C10.0439 0.137695 9.64258 0 9.25 0H6.25ZM6.25 1.5H9.25V2.25H6.25V1.5ZM2.5 3.75H13V15.75C13 16.166 12.666 16.5 12.25 16.5H3.25C2.83398 16.5 2.5 16.166 2.5 15.75V3.75ZM4 6V14.25H5.5V6H4ZM7 6V14.25H8.5V6H7ZM10 6V14.25H11.5V6H10Z"
                      fill="#EF4444"
                    />
                  </svg>
                </button>
              </Popconfirm>
            </span>
          </Fragment>
        ),
      },
    },
  ];
};
export default Column;
