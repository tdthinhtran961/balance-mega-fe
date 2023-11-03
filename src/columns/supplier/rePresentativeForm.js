const Column = ({ pageType = '', email, setManagerId, roleCode, pageTyper = '', isActived, site = '', view = '' }) => {
  return [
    // (pageType === 'detail' || pageType === 'edit' || pageType === 'info') && {
    //   title: 'Cột chèn ẩn UI',
    //   name: 'hiddenColumn',
    //   formItem: {
    //     col: '6',
    //     type: 'hidden',
    //   },
    // },
    site === 'NonBal'
      ? {
          title: 'Họ tên đại diện',
          name: 'manageName',
          formItem: {
            placeholder: pageType === 'detail' ? ' ' : 'Nhập họ tên đại diện',
            col: '4',
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
            placeholder: pageType === 'detail' ? ' ' : 'Nhập họ tên đại diện',
            col: '4',
            disabled: () =>
              pageType === 'detail' ||
              ((roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && pageType !== 'info') ||
              site === 'inBal' ||
              site === 'inBalAd' ||
              view === 'ad',
            rules: [
              {
                type:
                  pageType === 'create' ||
                  (pageType === 'edit' && view !== 'ad') ||
                  pageTyper === 'info' ||
                  pageType === 'info'
                    ? 'required'
                    : '',
                message: 'Xin vui lòng nhập họ và tên đại diện',
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
                      message: 'Xin vui lòng nhập số điện thoại quản lý',
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
            placeholder: pageType === 'detail' ? ' ' : 'Nhập số điện thoại đại diện',
            col: '4',
            rules:
              isActived === false
                ? ''
                : [
                    {
                      type:
                        pageType === 'create' ||
                        (pageType === 'edit' && view !== 'ad') ||
                        pageTyper === 'info' ||
                        pageType === 'info'
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
            disabled: () =>
              pageType === 'detail' ||
              ((roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && pageType !== 'info') ||
              site === 'inBal' ||
              site === 'inBalAd' ||
              view === 'ad',
          },
        },
    site === 'NonBal'
      ? {
          title: 'Email đại diện',
          name: 'email',
          formItem: {
            placeholder: pageType === 'detail' ? ' ' : 'Nhập email đại diện',
            col: '4',
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
            col: '4',
            // type: 'select',
            rules:
              isActived === false
                ? ''
                : [
                    {
                      type:
                        pageType === 'create' ||
                        ((roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && pageType === 'info')
                          ? 'required'
                          : '',
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
            //   (roleCode === 'OWNER_SUPPLIER' && pageType !== 'info') ||
            //   site === 'inBal' ||
            //   site === 'inBalAd' ||
            //   view === 'ad' ||
            //   (roleCode === 'OWNER_SUPPLIER' && pageType === 'info'),
            // list: email?.map((mail) => ({ label: mail.email, value: mail.email })),
            // onChange: (values, form) => {
            //   const infoManager = email.find((ele) => ele.email === values);
            //   form.setFieldsValue({ manageName: infoManager.name, managePhone: infoManager.phoneNumber });
            //   setManagerId(infoManager.id);
            // },
          },
        },
    (roleCode === 'ADMIN' ||
      site === 'inBal' ||
      site === 'NonBal' ||
      site === 'inBalAd' ||
      pageType === 'create' ||
      pageType === 'info') && {
      title: 'Ghi chú',
      name: 'note',
      formItem: {
        col: '12',
        type: 'textarea',
        placeholder: (pageType === 'edit' && site === 'inBal') || site === 'inBalAd' ? () => false : 'Nhập ghi chú',
        disabled: () => site === 'inBal' || site === 'inBalAd' || view === 'ad',
        rules: [{ type: 'max', value: 500, message: 'Chỉ được nhập tối đa 500 kí tự' }],
      },
    },
  ];
};
export default Column;
