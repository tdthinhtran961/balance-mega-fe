const Column = ({ pageType = '' }) => {
  return [
    {
      title: "",
      name: "approveStatus",
      formItem: {
        placeholder: "Nhập tình trạng sản phẩm",
        type: "select",
        disabled: () => pageType === 'detail',
        rules: pageType !== 'detail' ? [{ type: "required" }] : '',
        list: [
          { value: 'APPROVED', label: 'Đang bán' },
          { value: 'STOP_SELLING', label: 'Ngưng bán' },
          // { value: 'OUT_OF_STOCK', label: 'Hết hàng' },
        ]
      },
    },
  ];
};
export default Column;
