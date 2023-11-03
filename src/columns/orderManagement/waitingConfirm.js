import React from 'react';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
const Column = ({ formatCurrency, roleCode, tabKey }) => {
  const navigate = useNavigate();
  return [
    roleCode === 'ADMIN'
      ? {
          title: 'Mã đơn hàng',
          name: 'orderCode',
          tableItem: {
            width: 110,
            onCell: (record) => ({
              style: { paddingTop: '0.25rem', paddingBottom: 0 },
              onClick: async () => {
                navigate(routerLinks('OrderDetail') + `?id=${record.id}` + `&tabKey=${tabKey}`);
              },
            }),
            // fixed: window.innerWidth > 1023,
          },
        }
      : {
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
    (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && {
      title: 'Tên cửa hàng',
      name: 'storeName',
      tableItem: { with: 200 },
    },
    roleCode === 'ADMIN' && {
      title: 'Cửa hàng',
      name: 'storeName',
      tableItem: {},
    },
    roleCode === 'OWNER_STORE' && {
      title: 'Tên nhà cung cấp',
      name: 'supplierName',
      tableItem: {},
    },
    roleCode === 'ADMIN' && {
      title: 'Nhà cung cấp',
      name: 'supplierName',
      tableItem: {
        width: 140,
      },
    },

    roleCode === 'ADMIN' && {
      title: 'Địa chỉ giao hàng',
      name: 'pickUpAddress',
      tableItem: {},
    },
    roleCode === 'ADMIN'
      ? {
          title: 'Ngày đặt hàng',
          name: 'orderDate',
          tableItem: {
            width: 130,
          },
        }
      : {
          title: 'Ngày đặt',
          name: 'orderDate',
          tableItem: {
            width: 130,
          },
        },
    {
      title: 'Tổng tiền (VND)',
      name: 'totalPrice',
      tableItem: {},
    },
    roleCode === 'ADMIN' && {
      title: 'Tình trạng',
      name: 'status',
      tableItem: {
        width: 160,
        render: (value) => {
          return value === 'DELIVERED' ? (
            <div className="bg-green-100 text-center p-1 border border-green-600 text-green-600 rounded-[4px]">
              Đã giao
            </div>
          ) : value === 'CANCELLED' ? (
            <div className="bg-red-100 text-center p-1 border border-red-500 text-red-500 rounded-[4px]">Đã hủy</div>
          ) : value === 'DELIVERY_RECEIVING' || value === 'DELIVERY_RECEIVED' || value === 'DELIVERY_RECEIVE' ? (
            <div className="bg-[#EFF6FF] text-center p-1 border border-blue-500 text-blue-500 rounded-[4px]">
              Đang giao
            </div>
          ) : value === 'WAITING_APPROVED' ? (
            <div className="bg-[#fff7ed] text-center p-1 border border-yellow-500 text-yellow-500 rounded-[4px]">
              Chờ xác nhận
            </div>
          ) : value === 'WAITING_PICKUP' ? (
            <div className="bg-orange-100 text-center p-1 border border-orange-500 text-orange-500 rounded-[4px]">
              Chờ lấy hàng
            </div>
          ) : (
            ''
          );
        },
      },
    },
  ];
};

export default Column;
