const Column = ({ pageType = '', address, setAddress, roleCode, isActived, site = '', view = '' }) => {
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
          setAddress((prev) => ({ ...prev, provinceCode: p?.code }));
          form.setFieldsValue({ district: undefined, ward: undefined });
        },
        disabled: () => isActived === false || site === 'inBal' || site === 'inBalAd' || view === 'ad',
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
          const d = address?.district?.find((ele) => ele.id === value);
          // setDistrictCode(d.code);
          setAddress((prev) => ({ ...prev, districtCode: d?.code }));
          form.setFieldsValue({ ward: undefined });
        },
        disabled: () => isActived === false || site === 'inBal' || site === 'inBalAd' || view === 'ad',
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
        disabled: () => isActived === false || site === 'inBal' || site === 'inBalAd' || view === 'ad',
      },
    },
    {
      title: 'Địa chỉ cụ thể',
      name: 'address',
      formItem: {
        placeholder: 'Nhập địa chỉ',
        col: '3',
        rules: [{ type: 'required', message: 'Xin vui lòng nhập địa chỉ cụ thể' }],
        disabled: () => isActived === false || site === 'inBal' || site === 'inBalAd' || view === 'ad',
      },
    },
    (roleCode === 'ADMIN' || site === 'inBal' || site === 'NonBal' || site === 'inBalAd') && {
      title: 'Ghi chú',
      name: 'note',
      formItem: {
        col: '12',
        type: 'textarea',
        placeholder: (pageType === 'edit' && site === 'inBal') || site === 'inBalAd' ? () => false : 'Nhập ghi chú',
        disabled: () => isActived === false || site === 'inBal' || site === 'inBalAd' || view === 'ad',
        rules: [{ type: 'max', value: 500, message: 'Chỉ được nhập tối đa 500 kí tự' }],
      },
    },
  ];
};
export default Column;
