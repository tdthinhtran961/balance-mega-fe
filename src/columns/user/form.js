const Column = ({ pageType = '', roleList, roleCode, status }) => {
  return [
    {
      title: 'Mã người dùng',
      name: 'code',
      tableItem: {
        filter: { type: 'search' },
        sorter: true,
      },
      formItem: {
        condition: (text) => pageType !== 'create',
        col: '6',
        disabled: () => true,
      },
    },
    {
      title: 'Họ và tên',
      name: 'name',
      tableItem: {
        filter: { type: 'search' },
        sorter: true,
        onCell: (data) => ({
          style: { paddingTop: '0.25rem', paddingBottom: 0 },
          onClick: async () => { },
        }),
      },
      formItem: {
        col: '6',
        placeholder: 'Nhập họ và tên',
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
        disabled: () => status === 'UNACTIVE' || status === 'DEACTIVE',
      },
    },

    {
      title: 'Email',
      name: 'email',
      tableItem: {
        filter: { type: 'search' },
        sorter: true,
      },
      formItem: {
        col: '6',
        placeholder: 'Nhập email',
        rules: [
          pageType === 'create' && { type: 'required', message: 'Xin vui lòng nhập email người dùng' },
          { type: 'email' },
        ],
        disabled: () => pageType !== 'create' || status === 'UNACTIVE' || status === 'DEACTIVE',
      },
    },

    {
      title: 'Số điện thoại',
      name: 'phoneNumber',
      tableItem: {
        filter: { type: 'search' },
        sorter: true,
      },
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
                if (!value || /^[0-9]+$/.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Xin vui lòng chỉ nhập số'));
              },
            }),
          },
          { type: 'min', value: 8, message: 'Xin vui lòng nhập tối thiểu 8 ký tự số' },
          { type: 'max', value: 12, message: 'Xin vui lòng nhập tối đa 12 ký tự số' },
        ],
        disabled: () => status === 'UNACTIVE' || status === 'DEACTIVE',
      },
    },
    pageType === 'create' ? "" :
      {
        title: 'Vai trò',
        name: 'roleCode',
        tableItem: {
          filter: { type: 'search' },
          sorter: true,
        },
        formItem: {
          col: pageType === 'create' ? '6' : '12',
          placeholder: 'Chọn vai trò',
          type: 'select',
          list: roleList,
          rules: [roleCode === 'Quản trị viên' && { type: 'required', message: 'Không được để trống trường này' }],
          disabled: () => {
            return (
              status === 'UNACTIVE' || status === 'DEACTIVE' || roleCode === 'Nhà cung cấp' || roleCode === 'Chủ cửa hàng' || pageType === 'edit'
            );
          },
        },
      },

    {
      title: 'Ghi chú',
      name: 'note',
      formItem: {
        col: '12',
        placeholder: 'Nhập ghi chú',
        type: 'textarea',
        rules: [{ type: 'max', value: 500, message: 'Chỉ được nhập tối đa 500 kí tự' }],
        disabled: () => status === 'UNACTIVE' || status === 'DEACTIVE',
      },
    },
    {
      title: 'Tình trạng hoạt động',
      name: 'status',
      formItem: {
        type: 'hidden',
      },
    },
    {
      title: 'User role Id',
      name: 'userRoleId',
      formItem: {
        type: 'hidden',
      },
    },
    {
      title: 'ID người dùng',
      name: 'id',
      formItem: {
        type: 'hidden',
      },
    },
  ];
};
export default Column;
