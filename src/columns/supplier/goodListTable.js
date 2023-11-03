import React, { useRef } from 'react';
import { approveStatus } from 'constants/index';
import { useTranslation } from 'react-i18next';

const Column = ({ navigateDetail, handleShow }) => {

  const { t } = useTranslation();
  const statusButtons = useRef({
    [approveStatus.WAITING_APPROVE]: { borderColor: 'border-[#EAB308]', textColor: 'text-[#EAB308]', bgColor: 'bg-yellow-100' },
    [approveStatus.APPROVED]: { borderColor: 'border-[#16A34A]', textColor: 'text-[#16A34A]', bgColor: 'bg-green-100' },
    [approveStatus.REJECTED]: { borderColor: 'border-[#333fe9]', textColor: 'text-[#333fe9]', bgColor: 'bg-blue-100' },
    [approveStatus.OUT_OF_STOCK]: { borderColor: 'border-red-500', textColor: 'text-[#EF4444]', bgColor: 'bg-red-100' },
    [approveStatus.STOP_SELLING]: { borderColor: 'border-black', textColor: 'text-black', bgColor: 'bg-gray-100' },
    [approveStatus.CANCELLED]: { borderColor: 'border-black', textColor: 'text-black', bgColor: 'bg-gray-100' },
  });

  return [
    {
      title: 'Mã sản phẩm',
      name: 'productCode',
      tableItem: {
        width: 170,
        sorter: true,
        filter: { type: 'search' },
        render: (value, record, index) => record?.code
      },
    },
    {
      title: 'Tên sản phẩm',
      name: 'productName',
      tableItem: {
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0, cursor: 'pointer' } }),
        // render: (text, data) => <div onClick={() => handleShow(data.id)}>{text}</div>,
        sorter: true,
        filter: { type: 'search' },
        render: (value, record, index) => record?.name
      },
    },
    {
      title: 'Danh mục',
      name: 'category',
      tableItem: {},
    },
    {
      title: 'Giá bán lẻ (VND)',
      name: 'retailPrice',
      tableItem: {},
    },
    // {
    //   title: 'Số lượng',
    //   name: 'amount',
    //   tableItem: {},
    // },
    {
      title: 'Tình trạng',
      name: 'status',
      tableItem: {
        width: 160,
        render: (value) => {
          const btn = statusButtons.current[value];
          return <div className={`${btn.bgColor} text-center p-1 border ${btn.borderColor} rounded-xl ${btn.textColor}`}>{t(`constants.approveStatus.${value}`)}</div>
        },
      },
    },
  ];
};
export default Column;
