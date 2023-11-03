import React from 'react';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
const Column = ({ navigateDetail, formatCurrency, idSupplier, subOrgId }) => {
  const navigate = useNavigate()
  return [
    {
      title: 'Mã ĐH',
      name: 'orderCode',
      tableItem: {
        onCell: (record) => ({
          style: { paddingTop: '0.25rem', paddingBottom: 0 },
          onClick: async () => {
            navigate(routerLinks('RevenueDetail') + `?id=${record.id}` + `&idSupplier=${idSupplier || subOrgId}`);
          },
        }),
      },
    },
    {
      title: 'Tên cửa hàng',
      name: 'storeName',
      tableItem: {},
    },
    {
      title: 'Ngày đặt',
      name: 'orderDate',
      tableItem: {
        // onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0, cursor: 'pointer'} }),
        // render: (text, data) => <div onClick={() => navigateDetail && navigateDetail(data.id)}>{text}</div>
      },
    },
    // {
    //   title: 'Ngày lấy hàng',
    //   name: 'pickupDate',
    //   tableItem: {},
    // },
    {
      title: 'Ngày nhận hàng',
      name: 'deliveredDate',
      tableItem: {},
    },
    // {
    //   title: 'Trạng thái ĐH',
    //   name: 'status',
    //   tableItem: {},
    // },
    // {
    //   title: 'Phí cố định (VND)',
    //   name: 'fixedFee',
    //   tableItem: {},
    // },
    // {
    //   title: 'Thành tiền (VND)',
    //   name: 'realPrice',
    //   tableItem: {},
    // },
    {
      title: 'Tổng tiền trước thuế (VND)',
      name: 'totalPrice',
      tableItem: {},
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        // sorter: true,
        render: (text) => {
          if (text === 'DELIVERED') {
            return (
              <div className="bg-green-50 text-center p-1 border border-green-500 rounded-[4px] text-green-500 w-[120px]">
                Đã giao
              </div>
            );
          } else if (text === 'CANCELLED') {
            return (
              <div className="bg-red-50 text-center p-1 border border-red-500 rounded-[4px] text-red-500 w-[120px]">
                Đã hủy
              </div>
            );
          }
        },
      },
    },
  ];
};
export default Column;
