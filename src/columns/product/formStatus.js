import formatNumber from 'utils/mask/formatNumber';

const Column = ({ pageType = '', roleCode, productType }) => {
  return [
    {
      title: 'Đơn vị cơ bản',
      name: 'basicUnit',
      formItem: {
        placeholder: 'Nhập đơn vị',
        disabled: () => pageType === 'detail',
        col: 12,
        rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
      },
    },

    (roleCode === 'OWNER_STORE' || roleCode === 'ADMIN') &&
      productType === 'NON_BALANCE' && {
        title: 'Giá nhập (VND)',
        name: 'price',
        formItem: {
          placeholder: 'Nhập giá nhập',
          mask: formatNumber || 'Nhập giá nhập',
          type: 'number',
          col: 12,
          rules:
            pageType === 'create'
              ? [{ type: 'required' }]
              : pageType === 'edit'
              ? [
                  {
                    type: 'custom',
                    validator: () => ({
                      validator(_, value) {
                        if (value === '' || value === undefined || value === null) {
                          return Promise.reject(new Error('Đây là trường bắt buộc!'));
                        } else return Promise.resolve();
                      },
                    }),
                  },
                ]
              : '',
          disabled: () => pageType === 'detail',
        },
      },
    // (roleCode === 'OWNER_STORE' || roleCode === 'ADMIN') &&
    //   productType === 'NON_BALANCE' && {
    //     title: 'Số lượng',
    //     name: 'stockQuantity',
    //     type: 'number',
    //     formItem: {
    //       mask: formatNumber,
    //       type: 'number',
    //       placeholder: 'Nhập  số lượng',
    //       col: 12,
    //       rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
    //       disabled: () => pageType === 'detail',
    //     },
    //   },
  ];
};
export default Column;
