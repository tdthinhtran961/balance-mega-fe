import React from 'react';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
const Column = ({ navigateDetail, formatCurrency, idSupplier, subOrgId }) => {
  const navigate = useNavigate();
  return [
    {
      title: 'Mã trả hàng',
      name: 'returnCode',
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
      title: 'Cửa hàng',
      name: 'storeName',
      tableItem: {},
    },
    {
      title: 'Ngày trả',
      name: 'returnDate',
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
      title: 'Phiếu nhập hàng',
      name: 'billCode',
      tableItem: {
        render: (text) => {
          if (text === "") {
            return (
              <p>
                Không
              </p>
            );
          } else {
            return text
          }
        },
      },
    },

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
          if (text === 'COMPLETED') {
            return (
              <div className="bg-blue-50 text-center p-1 border border-blue-500 rounded-[4px] text-blue-500 w-[120px]">
                Đã hoàn tất
              </div>
            );
          } else {
            return (
              <div className="bg-red-50 text-center p-1 border border-red-500 rounded-[4px] text-red-500 w-[120px]">
                Chưa hoàn tất
              </div>
            );
          }
        },
      },
    },
  ];
};
export default Column;
