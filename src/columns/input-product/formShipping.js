const Column = () => {
  return [
    {
      name: 'shipping',
      formItem: {
        type: 'radio',
        rules: [{ type: 'required',message: 'Xin vui lòng chọn phương thức vận chuyển' }],
        list: [
          { value: 'GHN', label: 'GHN' },
          { value: 'Viettelpost', label: 'Viettelpost' },
          { value: 'Giao hàng tiết kiệm', label: 'Giao hàng tiết kiệm' },
        ],
      },
    },
  ];
};
export default Column;
