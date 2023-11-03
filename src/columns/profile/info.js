const Column = ({ edit }) => {
  return [
    {
      title: 'Họ và tên',
      name: 'name',
      formItem: {
        col: '12',
        placeholder: 'Nhập họ và tên',
        // disabled: () => !edit,
        rules: [
          { type: 'required', message: 'Xin vui lòng nhập tên người dùng' },
          // { type: 'only_text_space', message: 'Xin vui lòng chỉ nhập chữ' },
          {
            type: 'custom',
            validator: () => ({
              validator(_, value) {
                if (!value || (/^[^0-9]+$/.test(value) && /^[\p{L} ]+$/u.test(value))) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Xin vui lòng chỉ nhập chữ'));
              },
            }),
          },
        ],
      },
    },

    // {
    //   title: 'Ngày sinh',
    //   name: 'birthday',
    //   formItem: {
    //     col: '6',
    //     placeholder: 'Nhập ngày sinh',
    //     type: 'date',
    //     //   rules: [{ type: 'required', message: 'Xin vui lòng nhập email người dùng' }, { type: 'email' }],
    //     disabled: () => !edit,
    //   },
    // },

    {
      title: 'Email',
      name: 'email',
      formItem: {
        col: '6',
        placeholder: 'Nhập email',
        rules: [
          { type: 'email' },
          {
            type: 'required',
            message: 'Xin vui lòng nhập email',
          },

      ],
        // disabled: () => true,

      },
    },

    {
      title: 'Số điện thoại',
      name: 'phoneNumber',
      formItem: {
        col: '6',
        placeholder: 'Nhập số điện thoại',
        // type: 'only_number',
        rules: [
          { type: 'required', message: 'Xin vui lòng nhập số điện thoại người dùng' },
          {
            type: 'custom',
            validator: () => ({
              validator(_, value) {
                if (!value || /^[0-9]+$/.test(value.trim())) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Xin vui lòng chỉ nhập số'));
              },
            }),
          },
          { type: 'min', value: 8, message: 'Xin vui lòng nhập tối thiểu 8 ký tự số' },
          { type: 'max', value: 12, message: 'Xin vui lòng nhập tối đa 12 ký tự số' },
        ],
        // disabled: () => !edit,
      },
    },

    {
      title: 'ID người dùng',
      name: 'uuid',
      formItem: {
        type: 'hidden',
      },
    },
  ];
};
export default Column;
