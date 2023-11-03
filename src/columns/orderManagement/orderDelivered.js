import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { React } from 'react';

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
      tableItem: { width: 200 },
    },
    {
      title: 'Ngày đặt',
      name: 'orderDate',
      tableItem: { width: 140 },
    },
    {
      title: 'Ngày nhận hàng',
      name: 'deliveredAt',
      tableItem: { width: 140 },
    },
    {
      title: 'Thanh toán',
      name: 'paymentSupplierStatus',
      tableItem: {
        width: 140,
        render: (value) => {
          return value === 'PAID' ? (
            <div className="bg-green-100 text-center p-1 border border-green-600 text-green-600 rounded-[4px]">
              Đã thanh toán
            </div>
          ) : value === 'PARTIAL_PAID' ? (
            <div className="bg-yellow-50 text-center p-1 border border-yellow-500 text-yellow-500 rounded-[4px]">
              Thanh toán một phần
            </div>
          ) : value === 'UNPAID' ? (
            <div className="bg-red-50 text-center p-1 border border-red-500 text-red-500 rounded-[4px]">
              Chưa thanh toán
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
