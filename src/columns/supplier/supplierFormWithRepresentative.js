const Column = ({ pageType = '', roleCode, pageTyper = '', isActived, site = '', view = '' }) => {
  return [
    {
      title: 'Mã nhà cung cấp',
      name: 'code',
      formItem: {
        placeholder: pageType === 'detail' ? ' ' : 'Nhập mã nhà cung cấp',
        col: '4',

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
    pageType === 'create'
      ? {
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
        }
      : {
          title: 'Tên nhà cung cấp',
          name: 'name',
          formItem: {
            placeholder: pageType === 'detail' ? ' ' : 'Nhập tên nhà cung cấp',
            col: '4',
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
    pageType === 'create'
      ? {
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
        }
      : {
          title: 'Số fax',
          name: 'fax',
          formItem: {
            placeholder: pageType === 'detail' ? ' ' : 'Nhập số fax',
            col: '4',

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
