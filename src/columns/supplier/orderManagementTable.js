import React from 'react';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
const Column = ({ navigateDetail, idSupplier }) => {
  const navigate = useNavigate()
  return [
    {
      title: 'Mã đơn hàng',
      name: 'orderCode',
      tableItem: {
        onCell: (record) => ({
          style: { paddingTop: '0.25rem', paddingBottom: 0 },
          onClick: async () => {
            navigate(routerLinks('OrderDetail') + `?id=${record.id}` + `&view=admin` + `&idSupplier=${idSupplier}`)
          },
        }),

      },
    },
    {
      title: 'Tên cửa hàng',
      name: 'storeName',
      tableItem: {
        width:150
      },
    },
    // {
    //   title: "Tổng tiền ĐH",
    //   name: "totalPrice",
    //   tableItem: {
    //     onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0, cursor: 'pointer'} }),
    //     render: (text, data) => <div onClick={() => navigateDetail && navigateDetail(data.id)}>{text}</div>
    //   },
    // },
    {
      title: 'Người nhận',
      name: 'reciever',
      tableItem: {
        width:150
      },
    },
    {
      title: 'Địa chỉ nhận hàng',
      name: 'deliveryAddress',
      tableItem: {
        width: 300
      },
    },
    {
      title: 'Tổng tiền (VND)',
      name: 'totalPrice',
      tableItem: {
        width:150
      },
    },
    // {
    //   title: "Số điện thoại",
    //   name: "phone",
    //   tableItem:{

    //   },
    // },
    // {
    //   title: "Mã cửa hàng",
    //   name: "shopCode",
    //   tableItem:{

    //   },
    // },
    {
      title: 'Ngày đặt',
      name: 'orderDate',
      tableItem: {},
    },
    {
      title: 'Tình trạng',
      name: 'status',
      tableItem: {
        width: 180,
        render: (value) => {
          return value === 'DELIVERED' ? (
            <div className="bg-green-100 text-center p-1 border border-green-500 text-green-600 rounded-[4px]">
              Đã giao
            </div>
          ) : value === 'CANCELLED' ? (
            <div className="bg-red-100 text-center p-1 border border-red-500 text-red-600 rounded-[4px]">Đã hủy</div>
          ) : (value === 'DELIVERY' || value === 'DELIVERY_RECEIVE' || value === 'DELIVERY_RECEIVING' || value === 'DELIVERY_RECEIVED') ? (
            <div className="bg-[#EFF6FF] text-center p-1 border border-[#3B82F6] text-blue-500 rounded-[4px]">
              Đang giao
            </div>
          ) : value === 'WAITING_PICKUP' ? (
            <div className="bg-[#FFF7ED] text-center p-1 border border-[#F97316] text-orange-500  rounded-[4px]">
              Chờ lấy hàng
            </div>
          ) : (
            <div className="bg-[#FEFCE8] text-center p-1 border  border-[#EAB308] text-yellow-500 rounded-[4px]">
              Chờ xác nhận
            </div>
          );
        },
      },
    },
  ];
};
export default Column;
