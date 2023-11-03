import { Button } from 'components';
import moment from 'moment';
import React from 'react';

const Column = ({ handleCopy, indexParams }) => {
  return [
    {
      title: 'STT',
      name: 'code',
      tableItem: {
        width: 50,
        align: 'center',
        render: (text, record, index) => (indexParams?.page - 1) * indexParams?.perPage + index + 1,
      },
    },
    {
      title: 'Mã kiểm kê',
      name: 'code',
      tableItem: {
        width: 200,
        // render: (text, record, index) => index + 1
      },
    },
    {
      title: 'Mô tả',
      name: 'description',
      tableItem: {},
    },
    {
      title: 'Ngày kiểm kê',
      name: 'checkDate',
      tableItem: {
        render: (text) => (text ? moment(text).format('DD/MM/YYYY') : null),
      },
    },
    {
      title: 'Ngày duyệt',
      name: 'approvalDate',
      tableItem: {
        render: (text) => (text ? moment(text).format('DD/MM/YYYY') : null),
      },
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
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
          } else {
            return (
              <div className="bg-red-50 text-center border border-red-600 text-red-600 rounded-[4px] text-sm w-[105px] h-[36px] leading-[36px]">
                Đã hủy
              </div>
            );
          }
        },
      },
    },
    {
      title: 'Hoạt động',
      name: 'importedStatus',
      tableItem: {
        width: 100,
        render: (value, record) => {
          return (
            <Button
              text="Copy"
              buttonStyle="primary"
              className="!w-[82px] disabled:hover:border-teal-900 disabled:hover:text-teal-900"
              disabled={record?.status === 'INPROCESS'}
              onClick={() => {
                if (!record.uuid) return null;
                handleCopy(record.uuid);
              }}
            />
          );
        },
      },
    },
  ];
};
export default Column;
