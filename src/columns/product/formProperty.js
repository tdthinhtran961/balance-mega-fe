const Column = ({ pageType = '' }) => {
  return [
    {
      title: 'Thuộc tính sản phẩm',
      name: 'attrs',
      formItem: {
        name: 'attrs',
        type: 'addable',
        text_add: 'Thêm thuộc tính',
        rules: [{ type: 'required' }],
        column: [
          {
            name: 'name',
            formItem: {
              placeholder: 'Tên thuộc tính',
              disabled: () => pageType === 'detail',
              rules: [{ type: 'required', message: 'Không được để trống trường này' }],
            },
          },
          {
            name: 'values',
            formItem: {
              type: 'chips',
              placeholder: 'Nhập giá trị và enter',
              disabled: () => pageType === 'detail',
              rules: [{ type: 'required', message: 'Không được để trống trường này' }],
            },
          },
        ],
      },
    },
  ];
};
export default Column;
