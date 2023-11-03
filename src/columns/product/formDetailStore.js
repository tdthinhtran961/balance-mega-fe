const Column = ({ pageType, listTax }) => {
  return [
    {
      title: "Mã sản phẩm",
      name: "code",
      formItem: {
        rules: pageType !== 'detail' ? [{ type: "required" }] : '',
        placeholder: "Nhập mã sản phẩm",
        col: '6',
        disabled: () => pageType === 'detail',
      },
    },
    {
      title: "Mã vạch",
      name: "barcode",
      formItem: {
        placeholder: "Nhập mã vạch",
        col: '6',
        rules: pageType !== 'detail' ? [{ type: "required" }] : '',
        disabled: () => pageType === 'detail',

      },
    },
    {
      title: "Thuế nhập",
      name: "importTaxId",
      formItem: {
        type: "select",
        col: '6',
        placeholder: "Chọn thuế nhập",
        rules: pageType !== 'detail' ? [{ type: "required" }] : '',
        list: listTax?.map((item) => ({ value: item.id, label: item.name })),
        disabled: () => pageType === 'detail',
      },
    },
    {
      title: "Thuế bán",
      name: "exportTaxId",
      formItem: {
        type: "select",
        col: '6',
        placeholder: "Chọn thuế bán",
        rules: pageType !== 'detail' ? [{ type: "required" }] : '',
        list: listTax?.map((item) => ({ value: item.id, label: item.name })),
        disabled: () => pageType === 'detail',
      },
    },
    {
      title: 'Mô tả sản phẩm',
      name: 'description',
      formItem: {
        placeholder: 'Nhập mô tả sản phẩm',
        col: '12',
        type: 'textarea',
        disabled: () => pageType === 'detail',
        rules: pageType !== 'detail' ? [{ type: 'max', value: 2000 }] : '',
      },
    },
  ];
};
export default Column;
