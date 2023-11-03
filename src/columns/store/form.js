import React from 'react';
import { Switch } from 'antd';

const Column = ({
  pageType = '',
  emailManager,
  setManagerId,
  data,
  roleCode,
  address,
  setAddress,
  isHidden,
  setIsHidden,
  setConnectKioViet,
  connectKioViet,
  listBranch,
  setIsCall,
  isLoading,
  setListBranch,handleConnectGetListBranches
}) => {
  return [
    pageType !== 'create' && {
      title: 'Mã cửa hàng',
      name: 'code',
      formItem: {
        placeholder: ' ',
        col: pageType !== 'create' ? '4' : null,
        disabled: () => true,
      },
    },
    {
      title: 'Tên cửa hàng',
      name: 'name',
      formItem: {
        placeholder: 'Nhập tên cửa hàng',
        col: pageType !== 'create' ? '4' : '6',
        rules: data?.isActive === false ? '' : [{ type: 'required', message: 'Xin vui lòng nhập tên cửa hàng' }],
        disabled: () => data?.isActive === false,
      },
    },
    {
      title: 'Số fax',
      name: 'fax',
      formItem: {
        placeholder: pageType === 'detail' ? ' ' : 'Nhập số fax',
        col: pageType !== 'create' ? '4' : '6',
        rules:
          data?.isActive === false
            ? ''
            : [
              // {
              //   type: pageType === 'create' || pageType === 'edit' || pageType === 'information' ? 'required' : '',
              //   message: 'Xin vui lòng nhập số fax của cửa hàng',
              // },
              {
                type: 'custom',
                validator: () => ({
                  validator(_, value) {
                    if (!value || /^[0-9]+$/.test(value.trim())) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Xin vui lòng chỉ nhập số'));
                  },
                }),
              },
              { type: 'min', value: 8, message: 'Xin vui lòng nhập tối thiểu 8 ký tự số' },
              { type: 'max', value: 12, message: 'Xin vui lòng nhập tối đa 12 ký tự số' },
            ],
        disabled: () => data?.isActive === false,
      },
    },
    {
      title: '',
      name: 'Địa chỉ cửa hàng',
      formItem: {
        render: () => {
          return (
            <div className="">
              <p className="text-base mb-2 text-black">
                Địa chỉ cửa hàng {data?.isActive === false ? '' : <span className="text-[#ff4d4f] text-sm">*</span>}
              </p>
            </div>
          );
        },
      },
    },
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
        disabled: () => data?.isActive === false,
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
          setAddress((prev) => ({ ...prev, districtCode: d?.code }));
          form.setFieldsValue({ ward: undefined });
        },
        disabled: () => data?.isActive === false,
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
        disabled: () => data?.isActive === false,
      },
    },
    {
      title: 'Địa chỉ cụ thể',
      name: 'street',
      formItem: {
        placeholder: 'Số nhà, tên đường',
        col: '3',
        rules: [{ type: 'required', message: 'Xin vui lòng nhập địa chỉ cụ thể' }],
        disabled: () => data?.isActive === false,
      },
    },
    {
      title: '',
      name: 'Thông tin người đại diện',
      formItem: {
        render: () => {
          return (
            <div className="">
              <p className="text-lg font-bold text-teal-900 mb-2">Thông tin người đại diện</p>
            </div>
          );
        },
      },
    },
    {
      title: 'Họ tên đại diện',
      name: 'nameContact',
      formItem: {
        rules: [{ type: 'required', message: 'Xin vui lòng nhập họ tên đại diện' }, {
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
        },],
        col: '4',
        placeholder: 'Nhập họ tên đại diện ',
        disabled: () => data?.isActive === false,
      },
    },
    {
      title: 'Số điện thoại đại diện',
      name: 'phoneNumber',
      formItem: {
        rules: [
          { type: 'required', message: 'Xin vui lòng nhập số điện thoại đại diện' },
          {
            type: 'custom',
            validator: () => ({
              validator(_, value) {
                if (!value || /^[0-9]+$/.test(value.trim())) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Xin vui lòng chỉ nhập số'));
              },
            }),
          },
          { type: 'min', value: 8, message: 'Xin vui lòng nhập tối thiểu 8 ký tự số' },
          { type: 'max', value: 12, message: 'Xin vui lòng nhập tối đa 12 ký tự số' },
        ],
        col: '4',
        placeholder: 'Nhập số điện thoại đại diện ',
        disabled: () => data?.isActive === false,
      },
    },
    {
      title: 'Email đại diện',
      name: 'emailContact',
      formItem: {
        // type: 'select',
        disabled: () => pageType === 'information' || pageType === 'edit',
        placeholder: 'Chọn hoặc nhập email đại diện',
        rules: [{ type: 'required', message: 'Xin vui lòng nhập email đại diện' }, { type: 'email' }],
        col: '4',
        // list: emailManager.map((item) => ({ value: item.email, label: item.email })),
        // onChange: (value, form) => {
        //   const infoManager = emailManager.find((ele) => ele.email === value);
        //   setManagerId(infoManager?.id);
        //   form.setFieldsValue({ manageName: infoManager.name, managePhone: infoManager.phoneNumber });
        // },
      },
    },
    {
      title: 'Ghi chú',
      name: 'note',
      formItem: {
        col: '12',
        placeholder: 'Nhập ghi chú',
        type: 'textarea',
        disabled: () => data?.isActive === false,
        rules: [{ type: 'max', value: 500, message: 'Chỉ được nhập tối đa 500 kí tự' }],
      },
    },
    {
      title: '',
      formItem: {
        render: () => (
          <div className='flex justify-between items-center'>
            <div className="flex items-center mb-4">
              <h3 className="font-bold text-teal-900 text-lg mr-6">Kết nối KiotViet</h3>
              <Switch onChange={() => setIsHidden(!isHidden)} checked={isHidden}/>
            </div>
            {isHidden && <div>
              <button
                type='button'
                className='w-[144px] h-[44px] text-white bg-teal-900 text-sm text-center rounded-[10px] disabled:bg-teal-700'
                onClick={async() => {
                  // setIsCall(true)
                  await handleConnectGetListBranches()
                }}
              >Lấy DS chi nhánh</button>
            </div>}
          </div>
        ),
      },
    },
    isHidden && {
      title: 'client_id',
      name: 'client_id',
      formItem: {
        placeholder: 'Nhập client_id',
        col: '6',
        rules: data?.isActive === false ? '' : [{ type: 'required', message: 'Xin vui lòng nhập client_id' }],
        disabled: () => data?.isActive === false,
        onChange: (e, form) => {
          setConnectKioViet((prev) => ({ ...prev, client_id: e.target.value }));
          form.setFieldsValue({ branchId: undefined })
          setListBranch([])
        },
      },
    },
    isHidden && {
      title: 'client_secret',
      name: 'client_secret',
      formItem: {
        placeholder: 'Nhập client_secret',
        col: '6',
        rules: data?.isActive === false ? '' : [{ type: 'required', message: 'Xin vui lòng nhập client_secret' }],
        disabled: () => data?.isActive === false,
        onChange: (e, form) => {
          setConnectKioViet((prev) => ({ ...prev, client_secret: e.target.value }));
          form.setFieldsValue({ branchId: undefined })
          setListBranch([])
        },
      },
    },
    isHidden && {
      title: 'retailer',
      name: 'retailer',
      formItem: {
        placeholder: 'Nhập retailer',
        col: '6',
        rules: data?.isActive === false ? '' : [{ type: 'required', message: 'Xin vui lòng nhập retailer' }],
        disabled: () => data?.isActive === false,
        onChange: (e, form) => {
          setConnectKioViet((prev) => ({ ...prev, retailer: e.target.value }));
          form.setFieldsValue({ branchId: undefined })
          setListBranch([])
        },
      },
    },
    isHidden && (
      {
        title: 'branchId',
        name: 'branchId',
        formItem: {
          type: 'select',
          placeholder: 'Chọn branchId',
          col: '6',
          rules: data?.isActive === false ? '' : [{ type: 'required', message: 'Xin vui lòng nhập tên cửa hàng' }],
          disabled: () => data?.isActive === false,
          list: listBranch?.map((item) => ({ label: item.branchName, value: item.id })),
        },
      }),

  ];
};
export default Column;
