const Column = ({ edit, province, setProvinceCode, setDistrictCode, ward, district }) => {
  return [
    // {
    //   title: 'Tỉnh/thành phố',
    //   name: 'province',
    //   formItem: {
    //     placeholder: 'Chọn tỉnh/thành phố',
    //     col: '4',
    //     type: 'select',
    //     // rules: [{ type: 'required', message: 'Xin vui lòng chọn tỉnh/thành phố' }],
    //     list: province?.map((item) => ({ value: item.id, label: item.name })),
    //     onChange: (value, form) => {
    //       const p = province.find((ele) => ele.id === value);
    //       setProvinceCode(p.code);
    //       // setProvinceCode(value);
    //       form.setFieldsValue({ district: null, ward: null });
    //       // form.setFieldValue('ward', null);
    //     },
    //     // disabled: () => !edit,
    //   },
    // },
    // {
    //   title: 'Quận/huyện',
    //   name: 'district',
    //   formItem: {
    //     placeholder: 'Chọn quận/huyện',
    //     col: '4',
    //     type: 'select',
    //     // rules: [{ type: 'required', message: 'Xin vui lòng chọn quận/huyện' }],
    //     list: district?.map((item) => ({ value: item.id, label: item.name })),
    //     onChange: (value, form) => {
    //       const d = district.find((ele) => ele.id === value);
    //       setDistrictCode(d.code);
    //       form.setFieldsValue({ ward: null });

    //       // setDistrictCode(value);
    //     },
    //     // disabled: () => !edit,
    //   },
    // },
    // {
    //   title: 'Phường/Xã',
    //   name: 'ward',
    //   formItem: {
    //     placeholder: 'Chọn phường/xã',
    //     col: '4',
    //     type: 'select',
    //     // rules: [{ type: 'required', message: 'Xin vui lòng chọn phường/xã' }],
    //     list: ward?.map((item) => ({ value: item.id, label: item.name })),
    //     // disabled: () => !edit,
    //   },
    // },
    // {
    //   title: 'Địa chỉ cụ thể',
    //   name: 'street',
    //   formItem: {
    //     placeholder: 'Nhập địa chỉ',
    //     col: '12',
    //     // rules: [{ type: 'required', message: 'Xin vui lòng nhập địa chỉ' }],
    //     // disabled: () => !edit,
    //   },
    // },
    {
      title: 'Ghi chú',
      name: 'note',
      formItem: {
        col: '12',
        type: 'textarea',
        // disabled: () => !edit,
        rules: [{ type: 'max', value: 500, message: 'Chỉ được nhập tối đa 500 kí tự' }],
      },
    },
  ];
};
export default Column;
