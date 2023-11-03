const Column = ({ pageType = '', email, setManagerId, roleCode, pageTyper = '', isActived, site = '', view = '' }) => {
  return [
    {
      title: 'Mã nhà cung cấp',
      name: 'code',
      formItem: {
        placeholder: pageType === 'detail' ? ' ' : 'Nhập mã nhà cung cấp',
        col: '6',
        // rules:
        // isActived === false
        //   ? ''
        //   : [
        //     {
        //       type: pageType === 'create' ? 'required' : '',
        //       message: 'Xin vui lòng nhập tên nhà cung cấp',
        //     },
        //   ],
        disabled: () =>
          pageType === 'detail' ||
          pageType === 'edit' ||
          roleCode === 'OWNER_SUPPLIER' ||
          roleCode === 'DISTRIBUTOR' ||
          site === 'inBal' ||
          site === 'inBalAd' ||
          view === 'ad',
        condition: (text) => pageType !== 'create',
      },
    },
    {
      title: 'Tên nhà cung cấp',
      name: 'name',
      formItem: {
        placeholder: pageType === 'detail' ? ' ' : 'Nhập tên nhà cung cấp',
        col: '6',
        rules:
          isActived === false
            ? ''
            : [
                {
                  type:
                    pageType === 'create' ||
                    (pageType === 'edit' && site !== 'inBal' && site !== 'inBalAd' && view !== 'ad') ||
                    pageTyper === 'info'
                      ? 'required'
                      : '',
                  message: 'Xin vui lòng nhập tên nhà cung cấp',
                },
                // {
                //   type: 'custom',
                //   validator: () => ({
                //     validator(_, value) {
                //       if (
                //         !value ||
                //         /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/.test(
                //           value,
                //         )
                //       ) {
                //         return Promise.resolve();
                //       }
                //       return Promise.reject(new Error('Vui lòng chỉ nhập chữ'));
                //     },
                //   }),
                // },
              ],
        disabled: () => isActived === false || site === 'inBal' || site === 'inBalAd' || view === 'ad',
      },
    },
    site === 'NonBal'
      ? {
          title: 'Email đại diện',
          name: 'email',
          formItem: {
            placeholder: pageType === 'detail' ? ' ' : 'Nhập email đại diện',
            col: '6',
            rules:
              isActived === false
                ? ''
                : [
                    {
                      type:
                        pageType === 'create' || (pageType === 'edit' && view !== 'ad') || pageTyper === 'info'
                          ? 'required'
                          : '',
                      message: 'Xin vui lòng nhập email',
                    },
                    { type: 'email' },
                    // {
                    //   type: 'custom',
                    //   validator: () => ({
                    //     validator(_, value) {
                    //       const regexmail =
                    //         /^(([^<>()[\]\\.,;:$%^&*\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    //       if (!value || regexmail.test(value)) {
                    //         return Promise.resolve();
                    //       }
                    //       return Promise.reject(new Error('Vui lòng nhập đúng định dạng email'));
                    //     },
                    //   }),
                    // },
                  ],
            disabled: () => isActived === false || pageType === 'detail' || view === 'ad',
          },
        }
      : {
          title: 'Email đại diện',
          name: 'email',
          formItem: {
            placeholder: pageType === 'detail' ? ' ' : 'Nhập email đại diện',
            col: '6',
            // type: 'select',
            rules:
              isActived === false
                ? ''
                : [
                    {
                      type: pageType === 'create' ? 'required' : '',
                      message: 'Xin vui lòng nhập email đại diện',
                    },
                    { type: 'email' },
                    // {
                    //   type: 'custom',
                    //   validator: () => ({
                    //     validator(_, value) {
                    //       const regexmail =
                    //         /^(([^<>()[\]\\.,;:$%^&*\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    //       if (!value || regexmail.test(value)) {
                    //         return Promise.resolve();
                    //       }
                    //       return Promise.reject(new Error('Vui lòng nhập đúng định dạng email'));
                    //     },
                    //   }),
                    // },
                  ],
            // disabled: () =>
            //   pageType === 'detail' ||
            //   pageType === 'edit' ||
            //   roleCode === 'OWNER_SUPPLIER' ||
            //   site === 'inBal' ||
            //   site === 'inBalAd' ||
            //   view === 'ad',
            // list: email?.map((mail) => ({ label: mail.email, value: mail.email })),
            // onChange: (values, form) => {
            //   const infoManager = email.find((ele) => ele.email === values);
            //   form.setFieldsValue({ manageName: infoManager.name, managePhone: infoManager.phoneNumber });
            //   setManagerId(infoManager.id);
            // },
            disabled: () => isActived === false || site === 'inBalAd',
          },
        },
    site === 'NonBal'
      ? {
          title: 'Họ tên đại diện',
          name: 'manageName',
          formItem: {
            placeholder: pageType === 'detail' ? ' ' : 'Nhập họ và tên đại diện',
            col: '6',
            rules:
              isActived === false
                ? ''
                : [
                    {
                      type:
                        pageType === 'create' || (pageType === 'edit' && view !== 'ad') || pageTyper === 'info'
                          ? 'required'
                          : '',
                      message: 'Xin vui lòng nhập họ và tên quản lý',
                    },
                    {
                      type: 'custom',
                      validator: () => ({
                        validator(_, value) {
                          if (
                            !value ||
                            /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý\s]+$/.test(
                              value,
                            )
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Vui lòng chỉ nhập chữ'));
                        },
                      }),
                    },
                  ],
            disabled: () => isActived === false || view === 'ad',
          },
        }
      : {
          title: 'Họ tên đại diện',
          name: 'manageName',
          formItem: {
            placeholder: pageType === 'create' || pageType === 'detail' || pageType === 'edit' ? ' ' : '',
            col: '6',
            disabled: () =>
              pageType === 'detail' ||
              pageType === 'create' ||
              pageType === 'edit' ||
              roleCode === 'OWNER_SUPPLIER' ||
              roleCode === 'DISTRIBUTOR' ||
              site === 'inBal' ||
              site === 'inBalAd' ||
              view === 'ad',
            rules: [
              {
                type: 'custom',
                validator: () => ({
                  validator(_, value) {
                    if (
                      !value ||
                      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý\s]+$/.test(
                        value,
                      )
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Vui lòng chỉ nhập chữ'));
                  },
                }),
              },
            ],
          },
        },
    site === 'NonBal'
      ? {
          title: 'Số điện thoại đại diện',
          name: 'managePhone',
          formItem: {
            placeholder: pageType === 'detail' ? ' ' : 'Nhập số điện thoại đại diện',
            col: '6',
            rules:
              isActived === false
                ? ''
                : [
                    {
                      type:
                        pageType === 'create' || (pageType === 'edit' && view !== 'ad') || pageTyper === 'info'
                          ? 'required'
                          : '',
                      message: 'Xin vui lòng nhập số điện thoại đại diện',
                    },
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
            disabled: () => isActived === false || view === 'ad',
          },
        }
      : {
          title: 'Số điện thoại đại diện',
          name: 'managePhone',
          formItem: {
            placeholder: pageType === 'create' || pageType === 'detail' || pageType === 'edit' ? ' ' : '',
            col: '6',
            disabled: () =>
              pageType === 'detail' ||
              pageType === 'create' ||
              pageType === 'edit' ||
              roleCode === 'OWNER_SUPPLIER' ||
              roleCode === 'DISTRIBUTOR' ||
              site === 'inBal' ||
              site === 'inBalAd' ||
              view === 'ad',
          },
        },
    {
      title: 'Số fax',
      name: 'fax',
      formItem: {
        placeholder: pageType === 'detail' ? ' ' : 'Nhập số fax',
        col: '6',

        rules:
          isActived === false
            ? ''
            : [
                // {
                //   type:
                //     pageType === 'create' ||
                //     (pageType === 'edit' && site !== 'inBal' && site !== 'inBalAd' && view !== 'ad') ||
                //     pageTyper === 'info'
                //       ? 'required'
                //       : '',
                //   message: 'Xin vui lòng nhập số fax của nhà cung cấp',
                // },
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
        disabled: () => isActived === false || site === 'inBal' || site === 'inBalAd' || view === 'ad',
      },
    },
  ];
};
export default Column;
