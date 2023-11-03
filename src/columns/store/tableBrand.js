import React from "react";
const Column = () => {
  return [
    {
      title: 'Mã cửa hàng',
      name: 'code',
      tableItem: {
      },
    },
    {
      title: 'Tên cửa hàng',
      name: 'name',
      tableItem: {}
    },
    {
      title: 'Địa chỉ',
      name: 'address',
      tableItem: {}
    },
    {
      title: 'Người đại diện',
      name: 'peopleContact',
      tableItem: {
        render: (value) => value && value?.name
      }
    },
    {
      title: 'Số điện thoại',
      name: 'phoneNumber',
      tableItem: {
        width: '10%'
      }
    },
    {
      title: 'Trạng thái',
      name: 'isActive',
      tableItem: {
        width: '150',
        render: (value) => {
          return value ? (
            <div className="bg-green-100 text-center border border-green-500 text-green-600 rounded-[4px] h-9 leading-8 w-[135px]">
              Đang hoạt động
            </div>
          ) : (
            <div className="bg-red-100 text-center border border-red-500 text-red-600 rounded-[4px] h-9 leading-8 w-[135px]">
              Ngưng hoạt động
            </div>
          );
        }
      }
    }
  ]
}
export default Column
