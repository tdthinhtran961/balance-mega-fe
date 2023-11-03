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
      tableItem: { width: 200 },
    },
    {
      title: 'Ngày đặt',
      name: 'orderDate',
      tableItem: { width: 140 },
    },
    {
      title: 'Ngày xác nhận',
      name: 'confirmAt',
      tableItem: { width: 140 },
    },
  ];
};

export default Column;
