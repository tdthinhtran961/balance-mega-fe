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
    ];
  };
  export default Column;