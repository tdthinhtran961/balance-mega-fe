import React from 'react';
const Column = ({ listProduct, roleCode }) => {
  return [
    {
      title: 'Mã yêu cầu',
      name: 'code',
      tableItem: {
        width: '12%',
      },
      formItem: {
        condition: (text) => !!text,
      },
    },
    (roleCode === 'ADMIN' || roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && {
      title: 'Tên cửa hàng',
      name: 'storeName',
      tableItem: {
        width: '22%',
      },
    },
    roleCode === 'OWNER_STORE' && {
      title: 'Tên NCC',
      name: 'supplierName',
      tableItem: {
        width: '22%',
        render: (text, record) => {
          if (record.status === 'APPROVED') return text;
        },
      },
    },
    {
      title: 'Tên sản phẩm',
      name: 'productName',
      tableItem: {
        width: '22%',
      },
      formItem: {
        rules: [{ type: 'required', message: 'Xin vui lòng nhập tên sản phẩm' }],
      },
    },
    {
      title: 'Yêu cầu chi tiết về sản phẩm',
      name: 'description',
      formItem: {
        type: 'textarea',
        rules: [{ type: 'max', value: 500, message: 'Chỉ được nhập tối đa 500 kí tự' }],
      },
    },
    {
      title: 'Ghi chú',
      name: 'note',
      formItem: {
        type: 'hidden',
      },
    },
    // {
    //   name: 'product',
    //   title: 'Chọn sản phẩm',
    //   formItem: {
    //     type: 'select',
    //     rules: [{ type: 'required' }],
    //     list: listProduct,
    //     condition: (text, form) => {
    //       return !form.getFieldValue('code');
    //     },
    //   },
    // },
    {
      title: 'Ngày yêu cầu',
      name: 'requestDate',
      tableItem: {
        width: '20%',
      },
    },
    {
      title: 'Ngày phản hồi',
      name: 'approveDate',
      tableItem: {
        width: '20%',
        // onCell: () => ({ style: { width: '300px' } }),
      },
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        width: '15%',
        render: (text) => {
          if (text === 'APPROVED')
            return (
              <div className="bg-green-50 text-center p-1 border border-green-500 rounded-lg text-green-500 w-[144px]">
                Đã phê duyệt
              </div>
            );
          else if (text === 'WAITING_ADMIN')
            return (
              <div className="bg-yellow-50 text-center p-1 border border-yellow-500 rounded-lg text-yellow-500 w-[144px]">
                Chờ phê duyệt
              </div>
            );
          else if (text === 'WAITING_STORE')
            return (
              <div className="bg-blue-50 text-center p-1 border border-blue-500 rounded-lg text-blue-500 w-[144px]">
                Chờ kết nối
              </div>
            );
          else if (text === 'REJECT_BY_ADMIN' || text === 'REJECT_BY_STORE')
            return (
              <div className="bg-red-50 text-center p-1 border border-red-500 rounded-lg text-red-500 w-[144px]">
                Từ chối
              </div>
            );
          // else if (text === 'WAITING_ADMIN')
          //   return (
          //     <div className="bg-purple-50 text-center p-1 border border-purple-500 rounded-lg text-purple-500 w-[144px]">
          //       Chọn nhà cung cấp
          //     </div>
          //   );
        },
      },
    },
  ];
};
export default Column;
