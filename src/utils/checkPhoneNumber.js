const Util = () => {
  return [
    { type: 'required', message: 'Xin vui lòng nhập số điện thoại của người dùng' },
    { type: 'min', value: 8, message: 'Xin vui lòng nhập tối thiểu 8 ký tự số' },
    { type: 'max', value: 12, message: 'Xin vui lòng nhập tối đa 12 ký tự số' },
    {
      type: 'custom',
      validator: () => ({
        validator(_, value) {
          if (!value || /^\+?\d+[-\s]?[0-9]+[-\s]?[0-9]+$/.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject(new Error('Xin vui lòng nhập đúng định dạng số điện thoại'));
        },
      }),
    },
  ];
};

export default Util;
