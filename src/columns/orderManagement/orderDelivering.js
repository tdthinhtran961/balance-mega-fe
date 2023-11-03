import React from 'react';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
const Column = ({ formatCurrency, roleCode, tabKey }) => {
  const navigate = useNavigate();
  return [
    {
      title: 'Mã đơn hàng',
      name: 'orderCode',
      tableItem: {
        width: 200,
        onCell: (record) => ({
          style: { paddingTop: '0.25rem', paddingBottom: 0 },
          onClick: async () => {
            navigate(routerLinks('OrderDetail') + `?id=${record.id}` + `&tabKey=${tabKey}`);
          },
        }),
      },
    },
    (roleCode === 'OWNER_SUPPLIER' || roleCode === 'ADMIN' || roleCode === 'DISTRIBUTOR') && {
      title: 'Tên cửa hàng',
      name: 'storeName',
      tableItem: {},
    },
    (roleCode === 'OWNER_STORE' || roleCode === 'ADMIN') && {
      title: 'Tên nhà cung cấp',
      name: 'supplierName',
      tableItem: {},
    },
    roleCode === 'ADMIN' && {
      title: 'Địa chỉ giao hàng',
      name: 'pickUpAddress',
      tableItem: {},
    },
    {
      title: 'Tổng tiền (VND)',
      name: 'totalPrice',
      tableItem: {},
    },
    {
      title: 'Ngày đặt',
      name: 'orderDate',
      tableItem: { width: 140 },
    },
    {
      title: 'Ngày lấy hàng',
      name: 'pickupAt',
      tableItem: { width: 140 },
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        // width: window.innerWidth > 1023 ? 180 : 180,
        width: 140,
        // fixed: window.innerWidth > 1023 ? 'right' : false,
        render: (value, record) => {
          return value === 'DELIVERY_RECEIVE' ? (
            <div className="bg-red-100 text-center sm:w-48 p-1 w-[150px] border border-red-600 text-red-600 rounded-[4px]">
              Chưa nhận hàng
            </div>
          ) : value === 'DELIVERY_RECEIVED' ? (
            <div className="bg-green-100 text-center sm:w-48 w-[150px] p-1 border border-green-500 text-green-500 rounded-[4px]">
              Đã nhận đủ
            </div>
          ) : (
            <div className="bg-[#FFF7ED] text-center sm:w-48 w-[150px] p-1 border border-yellow-500 text-yellow-500 rounded-[4px]">
              Đã nhận một phần
            </div>
          );
        },
      },
    },
  ];
};

export default Column;
