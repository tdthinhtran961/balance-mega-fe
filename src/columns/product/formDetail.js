import { routerLinks } from 'utils';
import React from 'react';

const Column = ({ roleCode, pageType, listTax }) => {
  if (roleCode !== 'OWNER_STORE') {
    return [
      {
        title: 'Mã vạch',
        name: 'barcode',
        formItem: {
          placeholder: 'Nhập mã vạch',
          col: '6',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
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
      // {
      //   title: "Mã sản phẩm",
      //   name: "code",
      //   formItem: {
      //     rules: pageType !== 'detail' ? [{ type: "required" }] : '',
      //     placeholder: "Nhập mã sản phẩm",
      //     col: '6',
      //     condition: (values, form) => pageType === 'detail',
      //     disabled: () => pageType === 'detail',
      //   },
      // },
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
            link: (form) => routerLinks('Tax', 'api'),
            params: (form, fullTextSearch, value) => ({
              page: 1,
              perPage: 99,
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
            link: (form) => routerLinks('Tax', 'api'),
            params: (form, fullTextSearch, value) => ({
              page: 1,
              perPage: 99,
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
          placeholder: 'Nhập mô tả sản phẩm',
          col: '12',
          type: 'textarea',
          disabled: () => pageType === 'detail',
          rules: pageType !== 'detail' ? [{ type: 'max', value: 500 }] : '',
        },
      },
    ];
  } else {
    return [
      {
        title: 'Mã sản phẩm',
        name: 'code',
        formItem: {
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
          placeholder: 'Nhập mã sản phẩm',
          col: '6',
          disabled: () => pageType === 'detail',
        },
      },
      {
        title: 'Mã vạch',
        name: 'barcode',
        formItem: {
          placeholder: 'Nhập mã vạch',
          col: '6',
          rules: pageType !== 'detail' ? [{ type: 'required' }] : '',
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
            link: (form) => routerLinks('Tax', 'api'),
            params: (form, fullTextSearch, value) => ({
              page: 1,
              perPage: 99,
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
            link: (form) => routerLinks('Tax', 'api'),
            params: (form, fullTextSearch, value) => ({
              page: 1,
              perPage: 99,
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
          placeholder: 'Nhập mô tả sản phẩm',
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
