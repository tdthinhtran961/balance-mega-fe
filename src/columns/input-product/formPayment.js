
const Column = ({ listPaymentMethods }) => {
  return [
    {
      name: 'payment',
      formItem: {
        type: 'radio',
        rules: [{ type: 'required', message: 'Xin vui lòng chọn phương thức thanh toán.' }],
        list: listPaymentMethods,
      },
    },
    {
      name: 'policy',
      formItem: {
        type: 'checkbox',
        rules: [{ type: 'required', }],
        list: [{ value: true, label: 'Tôi đã đọc và đồng ý với các điều khoản, điều kiện và chính sách bảo mật' }],
      },
    },
  ];
};
export default Column;
