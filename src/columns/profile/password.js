const Column = () => {
  return [
    {
      name: 'password',
      title: 'Mật khẩu hiện tại',
      formItem: {
        placeholder: 'Nhập mật khẩu',
        type: 'password',
        rules: [{ type: 'required' }],
      },
    },
    {
      name: 'passwordNew',
      title: 'Mật khẩu mới',
      formItem: {
        placeholder: 'Nhập mật khẩu',
        type: 'password',
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: (form) => ({
              validator: async (rule, value) => {
                if (value?.toString()?.length < 8) {
                  return Promise.reject(new Error('Mật khẩu yêu cầu có 8 ký tự trở lên'));
                }
                // if (form.getFieldValue('passwordComfirm') && value !== form.getFieldValue('passwordComfirm')) {
                //   return Promise.reject(new Error('Xác nhận mật khẩu không chính xác'));
                // }
                if (!!value && value.trim() !== '' && value.length >= 8) {
                  let countvalidator = 0;
                  if (/\s/.test(value)) return Promise.reject(new Error('Mật khẩu không được có khoảng trắng'));
                  else countvalidator++;
                  if (!/^(?=.*?[0-9])(?=.*?[A-Z])(?=.*[a-z])(?=.*[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]).*$/.test(value))
                    return Promise.reject(
                      new Error(
                        'Mật khẩu yêu cầu có 8 ký tự trở lên, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 kí tự đặc biệt',
                      ),
                    );
                  else countvalidator++;
                  if (countvalidator === 2) return Promise.resolve();
                } else return Promise.resolve();
              },
            }),
          },

          { type: 'password' },
        ],
      },
    },
    {
      name: 'passwordComfirm',
      title: 'Xác nhận mật khẩu',
      formItem: {
        placeholder: 'Xác nhận mật khẩu',
        type: 'password',
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: (form) => ({
              validator: async (rule, value) => {
                if (form.getFieldValue('passwordNew') && value !== form.getFieldValue('passwordNew')) {
                  return Promise.reject(new Error('Xác nhận mật khẩu không chính xác'));
                }
                if (!!value && value.trim() !== '' && value.length >= 8) {
                  let countvalidator = 0;
                  if (/\s/.test(value)) return Promise.reject(new Error('Mật khẩu không được có khoảng trắng'));
                  else countvalidator++;
                  if (!/^(?=.*?[0-9])(?=.*?[A-Z])(?=.*[a-z])(?=.*[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]).*$/.test(value))
                    return Promise.reject(
                      new Error(
                        'Mật khẩu yêu cầu có 8 ký tự trở lên, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 kí tự đặc biệt',
                      ),
                    );
                  else countvalidator++;
                  if (countvalidator === 2) return Promise.resolve();
                } else return Promise.resolve();
              },
            }),
          },
        ],
      },
    },
  ];
};

export default Column;
