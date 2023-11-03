const Column = () => {
  return [
    {
      title: 'Họ và tên',
      name: 'name',
      formItem: {
        rules: [{ type: 'required',message: 'Xin vui lòng nhập chọn Họ và tên' }],
      },
    },
    {
      title: 'Số điện thoại liên hệ ',
      name: 'phoneNumber',
      formItem: {
        rules: [
          { type: 'required', message: 'Xin vui lòng nhập số điện thoại của người dùng' },
          { type: 'min', value: 8, message: 'Xin vui lòng nhập tối thiểu 8 ký tự số' },
          { type: 'max', value: 12, message: 'Xin vui lòng nhập tối đa 12 ký tự số' },
        ],
      },
    },
    {
      title: 'Tỉnh/ Thành phố',
      name: 'province',
      formItem: {
        type: 'select',
        rules: [{ type: 'required', message: 'Xin vui lòng chọn tỉnh/ thành phố.' }],
        list: [
          { value: 'HCM', label: 'HCM' },
          { value: 'Hà Nội', label: 'Hà Nội' },
        ],
      },
    },
    {
      title: 'Quận/ Huyện',
      name: 'district',
      formItem: {
        type: 'select',
        rules: [{ type: 'required', message: 'Xin vui lòng chọn Quận/ Huyện.' }],
        list: [
          { value: 'Tân Bình', label: 'Tân Bình' },
          { value: 'Tân Phú', label: 'Tân Phú' },
        ],
      },
    },
    {
      title: 'Phường/ Xã',
      name: 'ward',
      formItem: {
        type: 'select',
        rules: [{ type: 'required',message: 'Xin vui lòng chọn Phường/ Xã' }],
        list: [
          { value: 'Phường 1', label: 'Phường 1' },
          { value: 'Phường 2', label: 'Phường 2' },
        ],
      },
    },
    {
      title: 'Địa chỉ',
      name: 'address',
      formItem: {
        rules: [{ type: 'required' ,message: 'Xin vui lòng nhập địa chỉ. '}],
      },
    },
  ];
};
export default Column;
