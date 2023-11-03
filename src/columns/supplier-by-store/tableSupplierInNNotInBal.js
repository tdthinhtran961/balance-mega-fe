import { routerLinks } from "utils";
import { useNavigate } from "react-router";
const Column = () => {
  const navigate = useNavigate()
  return [
    {
      title: 'Mã NCC',
      name: 'supplierCode',
      tableItem: {
        onCell: (record) => ({
          style: { paddingTop: '0.25rem', paddingBottom: 0 },
          onClick: async () => {
            navigate(routerLinks('SupplierEdit') + `?id=${record.id}&site=NonBal`)
          }
        }),
      },
    },
    {
      title: 'Tên nhà cung cấp',
      name: 'supplierName',
      tableItem: {},
    },
    {
      title: 'Địa chỉ',
      name: 'address',
      tableItem: {},
    },
    {
      title: 'Tên quản lý',
      name: 'managerName',
      tableItem: {

      },
    },
    {
      title: 'Số điện thoại',
      name: 'phoneNumber',
      tableItem: {

      },
    },
  ];
};
export default Column;
