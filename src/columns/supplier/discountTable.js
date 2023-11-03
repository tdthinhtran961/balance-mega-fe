import React from 'react';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
const Column = ({ navigateDetail, handleShow, idSupplier,
  subOrgId }) => {
  const navigate = useNavigate()
  return [
    {
      title: 'Từ ngày',
      name: 'timeRange',
      tableItem: {
        width: 200,
        onCell: (record) => ({
          style: { paddingTop: '0.25rem', paddingBottom: 0 },
          onClick: async () => {
            navigate(routerLinks('DiscountDetail') + `?id=${record.id}` + `&idSupplier=${idSupplier || subOrgId}`);
          },
        }),
      },
    },
    {
      title: 'Chiết khấu (VND)',
      name: 'discountPrice',
      tableItem: {
        width: 160,
        // onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0, cursor: 'pointer' } }),
        // render: (text, data) => <div onClick={() => handleShow(data.id)}>{text}</div>,
      },
    },
    {
      title: 'Đã thanh toán (VND)',
      name: 'payedTotal',
      tableItem: {},
    },
    {
      title: 'Chưa thanh toán (VND)',
      name: 'unpaidTotal',
      tableItem: {},
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        width: 160,
        render: (value) => {
          return value === 'PAID' ? (
            <div className="bg-green-100 text-center p-1 border border-green-500 text-green-500 rounded-[4px]">Đã thanh toán</div>
          ) : value === 'NOT_PAID' ? (
            <div className="bg-red-100 text-center p-1 border border-red-500 text-red-500 rounded-[4px]">Chưa thanh toán</div>
          ) : value === 'NOT_COMPLETED_PAID' ? (
            <div className="bg-[#FEFCE8] text-center p-1 border border-[#EAB308] text-[#EAB308] rounded-[4px]">
              Chưa hoàn tất
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
