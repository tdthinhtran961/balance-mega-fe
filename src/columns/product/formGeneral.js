import React from 'react';
import { routerLinks } from 'utils';
import formatNumber from 'utils/mask/formatNumber';

const Column = ({
  roleCode,
  pageType,
  categoryArr,
  navigate,
  setStep,
  idProduct,
  listSupplierOfStore,
  productType,
  data,
  setPurchaseUnit,
}) => {
  if (roleCode !== 'OWNER_STORE' && productType !== 'NON_BALANCE') {
    return [
      {
        title: 'Tên sản phẩm',
        name: 'name',
        formItem: {
          col: '6',
          placeholder: 'Nhập tên sản phẩm',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          disabled: () => pageType === 'detail',
        },
      },
      // {
      //   title: 'Danh mục sản phẩm',
      //   name: 'categoryListId',
      //   formItem: {
      //     type: 'tag',
      //     rules: pageType !== 'detail' ? [{ type: "required" }] : '',
      //     disabled: () => pageType === 'detail',
      //     convert: (data) => {
      //       return pageType === 'detail' ? (data?.map ? data.map((_item) => _item?.label || _item) : data) : (data?.map ? data.map((_item) => _item?.id || _item) : data);
      //     },
      //     tag: {
      //       api: routerLinks('Category', 'api'),
      //       params: (form, fullTextSearch, value) => ({
      //         page: 1,
      //         perPage: 10,
      //         fullTextSearch,
      //       }),
      //       label: 'name',
      //       value: 'id',
      //       maxTagCount: 'responsive',
      //     },
      //     placeholder: 'Chọn danh mục',
      //     col: '6',
      //   },
      // },
      {
        title: 'Thương hiệu',
        name: 'brand',
        formItem: {
          placeholder: pageType !== 'detail' ? 'Nhập thương hiệu' : ' ',
          col: '6',
          // rules: pageType !== 'detail' ? [{ type: "required" }] : '',
          disabled: () => pageType === 'detail',
        },
      },
      {
        title: 'Nhà cung cấp',
        name: 'supplierName',
        formItem: {
          placeholder: 'Nhập nhà cung cấp',
          col: '6',
          disabled: () => true,
        },
      },
      {
        title: 'Xuất xứ',
        name: 'origin',
        formItem: {
          placeholder: 'Nhập xuất xứ',
          col: '6',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          disabled: () => pageType === 'detail',
        },
      },
      {
        title: 'Danh mục sản phẩm',
        name: 'categoryProduct',
        formItem: {
          type: 'only_text',
          col: '12',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          render: () => {
            return (
              <div className="mb-4">
                <div className="flex items-center">
                  <span className="text-base font-normal text-black mr-3">Danh mục sản phẩm</span>{' '}
                  {pageType !== 'detail' && (
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        setStep(1);
                        if (pageType === 'create') {
                          window.scrollTo(0, 0);
                          return navigate(`${routerLinks('ProductCreate')}?step=1`);
                        }
                        if (pageType === 'edit') {
                          window.scrollTo(0, 0);
                          return navigate(`${routerLinks('ProductEdit')}?id=${idProduct}&step=1`);
                        }
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M15.9297 0.976562C15.1445 0.976562 14.3594 1.28125 13.75 1.89062L1.89062 13.75L1.84375 13.9844L1.02344 18.1094L0.789062 19.2109L1.89062 18.9766L6.01562 18.1562L6.25 18.1094L18.1094 6.25C19.3281 5.03125 19.3281 3.10938 18.1094 1.89062C17.5 1.28125 16.7148 0.976562 15.9297 0.976562ZM15.9297 2.40625C16.3076 2.40625 16.6885 2.5791 17.0547 2.94531C17.7842 3.6748 17.7842 4.46582 17.0547 5.19531L16.5156 5.71094L14.2891 3.48438L14.8047 2.94531C15.1709 2.5791 15.5518 2.40625 15.9297 2.40625ZM13.2344 4.53906L15.4609 6.76562L6.39062 15.8359C5.89844 14.875 5.125 14.1016 4.16406 13.6094L13.2344 4.53906ZM3.20312 14.8281C4.10254 15.1914 4.80859 15.8975 5.17188 16.7969L2.71094 17.2891L3.20312 14.8281Z"
                          fill="#3B82F6"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="px-4 py-3 bg-gray-100 rounded-[10px] mt-2 text-gray-700">
                  {categoryArr?.map((item, index) => {
                    if (item !== null && item !== undefined && item !== '') {
                      return <span key={index}>{index === 0 ? item.name : ' > ' + item.name} </span>;
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          },
        },
      },
      {
        title: 'Mã vạch',
        name: 'barcode',
        formItem: {
          placeholder: 'Nhập mã vạch',
          col: '6',
          type: 'number',
          rules:
            pageType !== 'detail'
              ? [
                  {
                    type: 'custom',
                    validator: (form) => ({
                      validator: async (rule, value) => {
                        if (value?.toString()?.length > 13) {
                          return Promise.reject(new Error('Vui lòng nhập tối đa 13 ký tự.'));
                        } else return Promise.resolve();
                      },
                    }),
                  },
                  // { type: 'required' },
                ]
              : '',
          disabled: () => pageType === 'detail',
        },
      },
      {
        title: 'Cửa hàng cung cấp',
        name: 'storeName',
        formItem: {
          type: 'hidden',
          placeholder: 'Nhập cửa hàng cung cấp',
          col: '6',
          disabled: () => pageType === 'detail',
        },
      },
      {
        name: 'shipmentAndExpirationDate',
        formItem: {
          type: 'hidden',
          label: 'Lô hàng và Ngày hết hạn',
          disabled: () => pageType === 'detail',
        },
      },
      {
        title: 'Thuế nhập',
        name: 'importTaxId',
        formItem: {
          type: 'select',
          col: '6',
          placeholder: 'Chọn thuế nhập',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          // list: listTax?.map((item) => ({ value: item.id, label: item.name })),
          disabled: () => pageType === 'detail',
          api: {
            condition: false,
            link: (form) => routerLinks('Tax', 'api') + '/get-all-tax',
            params: (form, fullTextSearch, value) => ({
              fullTextSearch,
            }),
            format: (item) => ({ value: item.id, label: item.name + ' - ' + item.taxRate + '%' }),
            maxTagCount: 'responsive',
          },
        },
      },
      {
        title: 'Thuế bán',
        name: 'exportTaxId',
        formItem: {
          type: 'select',
          col: '6',
          placeholder: 'Chọn thuế bán',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          // list: listTax?.map((item) => ({ value: item.id, label: item.name })),
          disabled: () => pageType === 'detail',
          api: {
            condition: false,
            link: (form) => routerLinks('Tax', 'api') + '/get-all-tax',
            params: (form, fullTextSearch, value) => ({
              fullTextSearch,
            }),
            format: (item) => ({ value: item.id, label: item.name + ' - ' + item.taxRate + '%' }),
            maxTagCount: 'responsive',
          },
        },
      },
      {
        title: 'Khả năng cung ứng',
        name: 'canAbility',
        formItem: {
          type: 'only_text',
          col: '12',
          // rules: pageType !== 'detail' ? [{ type: "required" }] : '',
          disabled: () => pageType === 'detail',
          render: () => <div className="text-base mb-4">Khả năng cung ứng</div>,
        },
      },
      {
        title: 'Theo tháng',
        name: 'month',
        formItem: {
          col: '4',
          // rules: pageType !== 'detail' ? [{ type: "required" }] : '',
          disabled: () => pageType === 'detail',
        },
      },
      {
        title: 'Theo quý',
        name: 'quarter',
        formItem: {
          col: '4',
          // rules: pageType !== 'detail' ? [{ type: "required" }] : '',
          disabled: () => pageType === 'detail',
        },
      },
      {
        title: 'Theo năm',
        name: 'year',
        formItem: {
          col: '4',
          // rules: pageType !== 'detail' ? [{ type: "required" }] : '',
          disabled: () => pageType === 'detail',
        },
      },
      {
        title: 'Thị trường xuất khẩu',
        name: 'exportMarket',
        formItem: {
          col: '6',
          // rules: pageType !== 'detail' ? [{ type: "required" }] : '',
          disabled: () => pageType === 'detail',
        },
      },
      {
        title: 'Mô tả sản phẩm',
        name: 'description',
        formItem: {
          placeholder: pageType !== 'detail' ? 'Nhập mô tả sản phẩm' : ' ',
          col: '12',
          type: 'textarea',
          disabled: () => pageType === 'detail',
          rules: pageType !== 'detail' ? [{ type: 'max', value: 2000 }] : '',
        },
      },
    ];
  } else if (roleCode === 'ADMIN' && productType === 'NON_BALANCE') {
    return [
      {
        title: 'Tên sản phẩm',
        name: 'name',
        formItem: {
          col: '6',
          placeholder: 'Nhập tên sản phẩm',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          disabled: () => pageType === 'detail',
        },
      },
      // {
      //   title: 'Danh mục sản phẩm',
      //   name: 'categoryListId',
      //   formItem: {
      //     type: 'tag',
      //     rules: pageType !== 'detail' ? [{ type: "required" }] : '',
      //     disabled: () => pageType === 'detail',
      //     convert: (data) => {
      //       return pageType === 'detail' ? (data?.map ? data.map((_item) => _item?.label || _item) : data) : (data?.map ? data.map((_item) => _item?.id || _item) : data);
      //     },
      //     tag: {
      //       api: routerLinks('Category', 'api'),
      //       params: (form, fullTextSearch, value) => ({
      //         page: 1,
      //         perPage: 10,
      //         fullTextSearch,
      //       }),
      //       label: 'name',
      //       value: 'id',
      //       maxTagCount: 'responsive',
      //     },
      //     placeholder: 'Chọn danh mục',
      //     col: '6',
      //   },
      // },
      {
        title: 'Thương hiệu',
        name: 'brand',
        formItem: {
          placeholder: pageType !== 'detail' ? 'Nhập thương hiệu' : ' ',
          col: '6',
          // rules: pageType !== 'detail' ? [{ type: "required" }] : '',
          disabled: () => pageType === 'detail',
        },
      },
      productType === 'NON_BALANCE'
        ? {
            title: 'Nhà cung cấp',
            name: 'supplierId',
            formItem: {
              type: 'select',
              col: '6',
              placeholder: 'Chọn nhà cung cấp',
              rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
              disabled: () => pageType === 'detail',
              list: listSupplierOfStore?.map((i) => ({ label: i.name, value: i.id })),
            },
          }
        : {
            title: 'Nhà cung cấp',
            name: 'supplierName',
            formItem: {
              placeholder: 'Nhập nhà cung cấp',
              col: '6',
              disabled: () => true,
            },
          },

      {
        title: 'Xuất xứ',
        name: 'origin',
        formItem: {
          placeholder: 'Nhập xuất xứ',
          col: '6',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          disabled: () => pageType === 'detail',
        },
      },
      {
        title: 'Danh mục sản phẩm',
        name: 'categoryProduct',
        formItem: {
          type: 'only_text',
          col: '12',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          render: () => {
            return (
              <div className="mb-4">
                <div className="flex items-center">
                  <span className="text-base font-normal text-black mr-3">Danh mục sản phẩm</span>{' '}
                  {pageType !== 'detail' && (
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        setStep(1);
                        if (productType === 'NON_BALANCE') {
                          if (pageType === 'create') {
                            window.scrollTo(0, 0);
                            return navigate(`${routerLinks('ProductCreate')}?step=1&type=NON_BALANCE`);
                          }
                          if (pageType === 'edit') {
                            window.scrollTo(0, 0);
                            return navigate(`${routerLinks('ProductEdit')}?id=${idProduct}&step=1&type=NON_BALANCE`);
                          }
                        } else {
                          if (pageType === 'create') {
                            window.scrollTo(0, 0);
                            return navigate(`${routerLinks('ProductCreate')}?step=1`);
                          }
                          if (pageType === 'edit') {
                            window.scrollTo(0, 0);
                            return navigate(`${routerLinks('ProductEdit')}?id=${idProduct}&step=1`);
                          }
                        }
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M15.9297 0.976562C15.1445 0.976562 14.3594 1.28125 13.75 1.89062L1.89062 13.75L1.84375 13.9844L1.02344 18.1094L0.789062 19.2109L1.89062 18.9766L6.01562 18.1562L6.25 18.1094L18.1094 6.25C19.3281 5.03125 19.3281 3.10938 18.1094 1.89062C17.5 1.28125 16.7148 0.976562 15.9297 0.976562ZM15.9297 2.40625C16.3076 2.40625 16.6885 2.5791 17.0547 2.94531C17.7842 3.6748 17.7842 4.46582 17.0547 5.19531L16.5156 5.71094L14.2891 3.48438L14.8047 2.94531C15.1709 2.5791 15.5518 2.40625 15.9297 2.40625ZM13.2344 4.53906L15.4609 6.76562L6.39062 15.8359C5.89844 14.875 5.125 14.1016 4.16406 13.6094L13.2344 4.53906ZM3.20312 14.8281C4.10254 15.1914 4.80859 15.8975 5.17188 16.7969L2.71094 17.2891L3.20312 14.8281Z"
                          fill="#3B82F6"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="px-4 py-3 bg-gray-100 rounded-[10px] mt-2 text-gray-700">
                  {categoryArr?.map((item, index) => {
                    if (item !== null && item !== undefined && item !== '') {
                      return <span key={index}>{index === 0 ? item.name : ' > ' + item.name} </span>;
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          },
        },
      },
      productType === 'NON_BALANCE'
        ? {
            title: 'Mã vạch (CH)',
            name: 'storeBarcode',
            formItem: {
              placeholder: pageType !== 'detail' ? 'Nhập mã vạch (CH)' : '',
              // type: 'number',
              col: '6',
              // rules:
              //   pageType !== 'detail'
              //     ? [
              //       {
              //         type: 'custom',
              //         validator: (form) => ({
              //           validator: async (rule, value) => {
              //             if (value?.toString()?.length > 13) {
              //               return Promise.reject(new Error('Vui lòng nhập tối đa 13 ký tự.'));
              //             } else return Promise.resolve();
              //           },
              //         }),
              //       },
              //       { type: 'required' },
              //     ]
              //     : '',
              onChange: (e) => {
                setPurchaseUnit((prev) => {
                  const result = [...prev];
                  if (prev.length > 0) {
                    const indexBasicUnit = prev.findIndex(
                      (f) => f?.unit?.trim().toLowerCase() === data?.basicUnit?.trim().toLowerCase(),
                    );
                    result[indexBasicUnit].barcode = e.target.value;
                  }
                  return result;
                });
              },
              disabled: () => pageType === 'detail',
            },
          }
        : null,
      productType === 'NON_BALANCE'
        ? {
            title: 'ColHidden',
            name: 'ColHidden',
            formItem: {
              type: 'hidden',
            },
          }
        : null,
      productType !== 'NON_BALANCE'
        ? {
            title: 'Mã sản phẩm',
            name: 'code',
            formItem: {
              placeholder: pageType !== 'detail' ? 'Nhập mã sản phẩm' : ' ',
              col: '6',
              disabled: () => pageType === 'detail',
            },
          }
        : null,
      productType !== 'NON_BALANCE'
        ? {
            title: 'Mã vạch (CH)',
            name: 'storeBarcode',
            formItem: {
              placeholder: pageType !== 'detail' ? 'Nhập mã vạch (CH)' : '',
              type: 'number',
              col: '6',
              rules:
                pageType !== 'detail'
                  ? [
                      {
                        type: 'custom',
                        validator: (form) => ({
                          validator: async (rule, value) => {
                            if (value?.toString()?.length > 13) {
                              return Promise.reject(new Error('Vui lòng nhập tối đa 13 ký tự.'));
                            } else return Promise.resolve();
                          },
                        }),
                      },
                      { type: 'required' },
                    ]
                  : '',
              onChange: (e) => {
                setPurchaseUnit((prev) => {
                  const result = [...prev];
                  if (prev.length > 0) {
                    const indexBasicUnit = prev.findIndex(
                      (f) => f?.unit?.trim().toLowerCase() === data?.basicUnit?.trim().toLowerCase(),
                    );
                    result[indexBasicUnit].barcode = e.target.value;
                  }
                  return result;
                });
              },
              disabled: () => pageType === 'detail',
            },
          }
        : null,
      productType !== 'NON_BALANCE'
        ? {
            title: 'Mã vạch (NCC)',
            name: 'barcode',
            formItem: {
              placeholder: pageType !== 'detail' ? 'Nhập mã vạch (NCC)' : ' ',
              type: 'number',
              col: '6',
              rules:
                pageType !== 'detail'
                  ? [
                      {
                        type: 'custom',
                        validator: (form) => ({
                          validator: async (rule, value) => {
                            if (value?.toString()?.length > 13) {
                              return Promise.reject(new Error('Vui lòng nhập tối đa 13 ký tự.'));
                            } else return Promise.resolve();
                          },
                        }),
                      },
                      { type: 'required' },
                    ]
                  : '',
              disabled: () => pageType === 'detail',
            },
          }
        : null,
      productType !== 'NON_BALANCE'
        ? {
            title: 'ColHidden',
            name: 'ColHidden',
            formItem: {
              type: 'hidden',
            },
          }
        : null,

      {
        title: 'Thuế nhập',
        name: 'importTaxId',
        formItem: {
          type: 'select',
          col: '6',
          placeholder: 'Chọn thuế nhập',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          disabled: () => pageType === 'detail',
          api: {
            condition: false,
            link: (form) => routerLinks('Tax', 'api') + '/get-all-tax',
            params: (form, fullTextSearch, value) => ({
              fullTextSearch,
            }),
            format: (item) => ({ value: item.id, label: item.name + ' - ' + item.taxRate + '%' }),
            maxTagCount: 'responsive',
          },
        },
      },
      {
        title: 'Thuế bán',
        name: 'exportTaxId',
        formItem: {
          type: 'select',
          col: '6',
          placeholder: 'Chọn thuế bán',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          disabled: () => pageType === 'detail',
          api: {
            condition: false,
            link: (form) => routerLinks('Tax', 'api') + '/get-all-tax',
            params: (form, fullTextSearch, value) => ({
              fullTextSearch,
            }),
            format: (item) => ({ value: item.id, label: item.name + ' - ' + item.taxRate + '%' }),
            maxTagCount: 'responsive',
          },
        },
      },
      {
        title: 'Mô tả sản phẩm',
        name: 'description',
        formItem: {
          placeholder: pageType !== 'detail' ? 'Nhập mô tả sản phẩm' : ' ',
          col: '12',
          type: 'textarea',
          disabled: () => pageType === 'detail',
          rules: pageType !== 'detail' ? [{ type: 'max', value: 2000 }] : '',
        },
      },
    ];
  } else {
    return [
      {
        title: 'Tên sản phẩm',
        name: 'name',
        formItem: {
          col: '6',
          placeholder: 'Nhập tên sản phẩm',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          disabled: () => pageType === 'detail',
        },
      },
      // {
      //   title: 'Danh mục sản phẩm',
      //   name: 'categoryListId',
      //   formItem: {
      //     type: 'tag',
      //     rules: pageType !== 'detail' ? [{ type: "required" }] : '',
      //     disabled: () => pageType === 'detail',
      //     convert: (data) => {
      //       return pageType === 'detail' ? (data?.map ? data.map((_item) => _item?.label || _item) : data) : (data?.map ? data.map((_item) => _item?.id || _item) : data);
      //     },
      //     tag: {
      //       api: routerLinks('Category', 'api'),
      //       params: (form, fullTextSearch, value) => ({
      //         page: 1,
      //         perPage: 10,
      //         fullTextSearch,
      //       }),
      //       label: 'name',
      //       value: 'id',
      //       maxTagCount: 'responsive',
      //     },
      //     placeholder: 'Chọn danh mục',
      //     col: '6',
      //   },
      // },
      {
        title: 'Thương hiệu',
        name: 'brand',
        formItem: {
          placeholder: pageType !== 'detail' ? 'Nhập thương hiệu' : ' ',
          col: '6',
          // rules: pageType !== 'detail' ? [{ type: "required" }] : '',
          disabled: () => pageType === 'detail',
        },
      },
      productType === 'NON_BALANCE'
        ? {
            title: 'Nhà cung cấp',
            name: 'supplierId',
            formItem: {
              type: 'select',
              col: '6',
              placeholder: 'Chọn nhà cung cấp',
              rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
              disabled: () => pageType === 'detail',
              list: listSupplierOfStore?.map((i) => ({ label: i.name, value: i.id })),
            },
          }
        : {
            title: 'Nhà cung cấp',
            name: 'supplierName',
            formItem: {
              placeholder: 'Nhập nhà cung cấp',
              col: '6',
              disabled: () => true,
            },
          },

      {
        title: 'Xuất xứ',
        name: 'origin',
        formItem: {
          placeholder: 'Nhập xuất xứ',
          col: '6',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          disabled: () => pageType === 'detail',
        },
      },
      {
        title: 'Danh mục sản phẩm',
        name: 'categoryProduct',
        formItem: {
          type: 'only_text',
          col: '12',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          render: () => {
            return (
              <div className="mb-4">
                <div className="flex items-center">
                  <span className="text-base font-normal text-black mr-3">Danh mục sản phẩm</span>{' '}
                  {pageType !== 'detail' && (
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        setStep(1);
                        if (productType === 'NON_BALANCE') {
                          if (pageType === 'create') {
                            window.scrollTo(0, 0);
                            return navigate(`${routerLinks('ProductCreate')}?step=1&type=NON_BALANCE`);
                          }
                          if (pageType === 'edit') {
                            window.scrollTo(0, 0);
                            return navigate(`${routerLinks('ProductEdit')}?id=${idProduct}&step=1&type=NON_BALANCE`);
                          }
                        } else {
                          if (pageType === 'create') {
                            window.scrollTo(0, 0);
                            return navigate(`${routerLinks('ProductCreate')}?step=1`);
                          }
                          if (pageType === 'edit') {
                            window.scrollTo(0, 0);
                            return navigate(`${routerLinks('ProductEdit')}?id=${idProduct}&step=1`);
                          }
                        }
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M15.9297 0.976562C15.1445 0.976562 14.3594 1.28125 13.75 1.89062L1.89062 13.75L1.84375 13.9844L1.02344 18.1094L0.789062 19.2109L1.89062 18.9766L6.01562 18.1562L6.25 18.1094L18.1094 6.25C19.3281 5.03125 19.3281 3.10938 18.1094 1.89062C17.5 1.28125 16.7148 0.976562 15.9297 0.976562ZM15.9297 2.40625C16.3076 2.40625 16.6885 2.5791 17.0547 2.94531C17.7842 3.6748 17.7842 4.46582 17.0547 5.19531L16.5156 5.71094L14.2891 3.48438L14.8047 2.94531C15.1709 2.5791 15.5518 2.40625 15.9297 2.40625ZM13.2344 4.53906L15.4609 6.76562L6.39062 15.8359C5.89844 14.875 5.125 14.1016 4.16406 13.6094L13.2344 4.53906ZM3.20312 14.8281C4.10254 15.1914 4.80859 15.8975 5.17188 16.7969L2.71094 17.2891L3.20312 14.8281Z"
                          fill="#3B82F6"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="px-4 py-3 bg-gray-100 rounded-[10px] mt-2 text-gray-700">
                  {categoryArr?.map((item, index) => {
                    if (item !== null && item !== undefined && item !== '') {
                      return <span key={index}>{index === 0 ? item.name : ' > ' + item.name} </span>;
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          },
        },
      },
      productType === 'NON_BALANCE'
        ? {
            title: 'Mã vạch (CH)',
            name: 'storeBarcode',
            formItem: {
              placeholder: pageType !== 'detail' ? 'Nhập mã vạch (CH)' : '',
              col: '6',
              type: 'number',
              rules:
                pageType !== 'detail'
                  ? [
                      {
                        type: 'custom',
                        validator: (form) => ({
                          validator: async (rule, value) => {
                            if (value?.toString()?.length > 13) {
                              return Promise.reject(new Error('Vui lòng nhập tối đa 13 ký tự.'));
                            } else return Promise.resolve();
                          },
                        }),
                      },
                    ]
                  : '',
              onChange: (e) => {
                setPurchaseUnit((prev) => {
                  console.log(prev);
                  const result = [...prev];
                  if (prev.length > 0) {
                    const indexBasicUnit = prev.findIndex(
                      (f) => f?.unit?.trim().toLowerCase() === data?.basicUnit?.trim().toLowerCase(),
                    );
                    result[indexBasicUnit].barcode = e.target.value;
                  }
                  return result;
                });
              },
              disabled: () => pageType === 'detail',
            },
          }
        : null,
      productType === 'NON_BALANCE'
        ? {
            title: 'ColHidden',
            name: 'ColHidden',
            formItem: {
              type: 'hidden',
            },
          }
        : null,
      productType !== 'NON_BALANCE'
        ? {
            title: 'Mã sản phẩm',
            name: 'code',
            // name: 'storeCodeProduct',
            formItem: {
              placeholder: pageType !== 'detail' ? 'Nhập mã sản phẩm' : ' ',
              col: '6',
              disabled: () => pageType === 'detail',
            },
          }
        : null,
      productType !== 'NON_BALANCE'
        ? {
            title: 'Mã vạch (CH)',
            name: 'storeBarcode',
            formItem: {
              placeholder: pageType !== 'detail' ? 'Nhập mã vạch (CH)' : '',
              // type: 'number',
              col: '6',
              rules:
                pageType !== 'detail'
                  ? [
                      {
                        type: 'custom',
                        validator: (form) => ({
                          validator: async (rule, value) => {
                            if (value?.toString()?.length > 13) {
                              return Promise.reject(new Error('Vui lòng nhập tối đa 13 ký tự.'));
                            } else return Promise.resolve();
                          },
                        }),
                      },
                      { type: 'required' },
                    ]
                  : '',
              onChange: (e) => {
                setPurchaseUnit((prev) => {
                  const result = [...prev];
                  if (prev.length > 0) {
                    const indexBasicUnit = prev.findIndex(
                      (f) => f?.unit?.trim().toLowerCase() === data?.basicUnit?.trim().toLowerCase(),
                    );
                    result[indexBasicUnit].barcode = e.target.value;
                  }
                  return result;
                });
              },
              disabled: () => pageType === 'detail',
            },
          }
        : null,
      productType !== 'NON_BALANCE'
        ? {
            title: 'Mã vạch (NCC)',
            name: 'supplierBarcode',
            formItem: {
              placeholder: pageType !== 'detail' ? 'Nhập mã vạch (NCC)' : ' ',
              type: 'number',
              col: '6',
              rules:
                pageType !== 'detail'
                  ? [
                      {
                        type: 'custom',
                        validator: (form) => ({
                          validator: async (rule, value) => {
                            if (value?.toString()?.length > 13) {
                              return Promise.reject(new Error('Vui lòng nhập tối đa 13 ký tự.'));
                            } else return Promise.resolve();
                          },
                        }),
                      },
                      { type: 'required' },
                    ]
                  : '',
              disabled: () => pageType === 'detail' || pageType === 'edit',
            },
          }
        : null,
      productType !== 'NON_BALANCE'
        ? {
            title: 'Giá nhập (VND)',
            name: 'price',
            formItem: {
              mask: formatNumber || 'Nhập giá nhập',
              col: 6,
              placeholder: pageType !== 'detail' ? 'Nhập giá nhập' : ' ',
              disabled: () => pageType === 'detail',
              onChange: (e) => {
                setPurchaseUnit((prev) => {
                  const indexBasicUnit = prev.findIndex(
                    (f) => f?.unit?.trim().toLowerCase() === data?.basicUnit?.trim().toLowerCase(),
                  );
                  return prev.map((item, index) => {
                    return {
                      ...item,
                      basePrice:
                        index === indexBasicUnit
                          ? +e.target.value
                          : (+e.target.value / prev[indexBasicUnit].coefficient) * item.coefficient,
                    };
                  });
                });
              },
            },
          }
        : null,
      {
        title: 'Thuế nhập',
        name: 'importTaxId',
        formItem: {
          type: 'select',
          col: '6',
          placeholder: 'Chọn thuế nhập',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          disabled: () => pageType === 'detail',
          api: {
            condition: false,
            link: (form) => routerLinks('Tax', 'api') + '/get-all-tax',

            params: (form, fullTextSearch, value) => ({
              fullTextSearch,
            }),
            format: (item) => ({ value: item.id, label: item.name + ' - ' + item.taxRate + '%' }),
            maxTagCount: 'responsive',
          },
        },
      },
      {
        title: 'Thuế bán',
        name: 'exportTaxId',
        formItem: {
          type: 'select',
          col: '6',
          placeholder: 'Chọn thuế bán',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          disabled: () => pageType === 'detail',
          api: {
            condition: false,
            link: (form) => routerLinks('Tax', 'api') + '/get-all-tax',
            params: (form, fullTextSearch, value) => ({
              fullTextSearch,
            }),
            format: (item) => ({ value: item.id, label: item.name + ' - ' + item.taxRate + '%' }),
            maxTagCount: 'responsive',
          },
        },
      },
      {
        title: 'Mô tả sản phẩm',
        name: 'description',
        formItem: {
          placeholder: pageType !== 'detail' ? 'Nhập mô tả sản phẩm' : ' ',
          col: '12',
          type: 'textarea',
          disabled: () => pageType === 'detail',
          rules: pageType !== 'detail' ? [{ type: 'max', value: 2000 }] : '',
        },
      },
    ];
  }
};
export default Column;
