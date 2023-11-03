

const Column = () => {
  return [
    {
      name: 'properties',
      formItem: {
        type: 'radio',
        rules: [{ type: 'required', message: 'Xin vui lòng chọn thuộc tính.' }],
        list: [
          { value: 'Thuộc tính 1', label: 'Thuộc tính 1' },
          { value: 'Thuộc tính 2', label: 'Thuộc tính 2' },
          { value: 'Thuộc tính 3', label: 'Thuộc tính 3' },
        ],
      },
    },
  ];
};
export default Column;
