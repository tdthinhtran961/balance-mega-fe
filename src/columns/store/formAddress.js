
const Column = ({ pageType = '', roleCode, address, setAddress , data}) => {
  return [
    {
      title: 'Tỉnh/Thành phố',
      name: 'province',
      formItem: {
        placeholder: 'Chọn tỉnh/thành phố',
        col: '3',
        type: 'select',
        rules: [{ type: 'required', message: 'Xin vui lòng chọn tỉnh/thành phố' }],
        list: address?.province?.map((item) => ({ value: item.id, label: item.name })),
        onChange: (value, form) => {
          const p = address?.province?.find((ele) => ele.id === value);
          setAddress(prev => ({ ...prev, provinceCode: p?.code }));
          form.setFieldsValue({ district: undefined, ward: undefined});
        },
        disabled: () => pageType === 'detail',
      },
    },
    {
      title: 'Quận/Huyện',
      name: 'district',
      formItem: {
        placeholder: 'Chọn quận/huyện',
        col: '3',
        type: 'select',
        rules: [{ type: 'required', message: 'Xin vui lòng chọn quận/huyện' }],
        list: address?.district?.map((item) => ({ value: item.id, label: item.name })),
        onChange: (value, form) => {
          const d = address?.district.find((ele) => ele.id === value);
          setAddress(prev => ({ ...prev, districtCode: d?.code }));
          form.setFieldsValue({ ward: undefined });
        },
        disabled: () => pageType === 'detail',
      },
    },
    {
      title: 'Phường/Xã',
      name: 'ward',
      formItem: {
        placeholder: 'Chọn phường/xã',
        col: '3',
        type: 'select',
        rules: [{ type: 'required', message: 'Xin vui lòng chọn phường/xã' }],
        list: address?.ward?.map((item) => ({ value: item.id, label: item.name })),
        disabled: () => pageType === 'detail',
      },
    },
    {
      title: 'Địa chỉ cụ thể',
      name: 'street',
      formItem: {
        placeholder: 'Số nhà, tên đường',
        col: '3',
        rules: [{ type: 'required', message: 'Xin vui lòng nhập địa chỉ cụ thể' }],
        disabled: () => pageType === 'detail',
      },
    },
    roleCode === 'ADMIN' && (
      {
        title: 'Ghi chú',
        name: 'note',
        formItem: {
          col: '12',
          placeholder: 'Nhập ghi chú ',
          type: 'textarea',
          disabled: () => pageType === 'detail',
          rules: [{ type: 'max', value: 500, message: 'Chỉ được nhập tối đa 500 kí tự' }],
        },
      }
    )
  ];
};
export default Column;
