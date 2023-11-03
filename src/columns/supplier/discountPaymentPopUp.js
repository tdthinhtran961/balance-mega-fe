const Column = ({ roleCode, idRequest, listReason, listMethod }) => {
  return [
    {
      title: 'Chiết khấu cần thanh toán:',
      name: 'discountToBePaid',
      formItem: {
        col: '6',
      },
    },
    {
      title: 'Phương thức thanh toán:',
      name: 'paymentMethod',
      formItem: {
        type: 'select',
        list: listMethod,
        col: 6,
      },
    },
    {
      title: 'Chiết khấu đã thanh toán:',
      name: 'paidDiscount',
      formItem: {},
    },
    {
      title: 'Chiết khấu còn lại:',
      name: 'restDiscount',
      formItem: {},
    },
    {
      title: 'Ghi chú:',
      name: 'restDiscount',
      formItem: {
        type: 'textarea',
      },
    },
  ];
};
export default Column;
