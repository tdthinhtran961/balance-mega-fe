
const Column = ({ t, handleEdit, handleDelete }) => {
  return [
    {
      title: 'Lý do',
      name: 'reason',
      formItem: {
        type: 'textarea',
        placeholder: 'Nhập lý do',
        rules: [{ type: 'required', message: 'Xin vui lòng nhập lý do' },{ type: 'max', value: 500, message: 'Chỉ được nhập tối đa 500 kí tự' }],
      },
    },

  ];
};
export default Column;