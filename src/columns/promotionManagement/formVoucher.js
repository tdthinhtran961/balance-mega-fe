import moment from 'moment';
import unorm from 'unorm';

const Column = ({ pageType = '', setMethod, form, data }) => {
  return [
    {
      title: 'Mã Voucher',
      name: 'code',
      tooltip: 'Vui lòng chỉ nhập kí tự từ A-Z, số từ 0-9, không quá 10 ký tự',
      formItem: {
        disabled: () => (pageType === 'edit' && data?.balanceQuantity !== data?.releaseQuantity),
        placeholder: 'Nhập mã voucher',
        col: '6',
        maxLength: 10,
        rules: [
          {
            type: 'required',
            message: 'Vui lòng điền vào trường này!',
          },
          {
            type: 'custom',
            validator: (form) => ({
              validator: (rule, value) => {
                const regex = /^[a-zA-Z0-9]*$/;
                if (!regex.test(value)) {
                  return Promise.reject(new Error('Vui lòng chỉ nhập chữ cái không dấu và số!'));
                }
                return Promise.resolve();
              },
            }),
          },
        ],
        onKeyDown: (e) => {
          const value = unorm.nfkd(e.key).replace(/[\u0300-\u036F]/g, '');
          const regex = /\S/g;
          if (!regex.test(value)) {
            e.preventDefault();
          }
        },
        onChange: (e, form) => {
          const value = unorm.nfkd(e.target.value).replace(/[\u0300-\u036F]/g, '');
          form.setFieldsValue({
            code: value,
          });
        },
      },
    },
    {
      title: 'Hình thức khuyến mãi',
      name: 'voucherType',
      formItem: {
        disabled: () => (pageType === 'edit' && data?.balanceQuantity !== data?.releaseQuantity),
        placeholder: 'Nhập hình thức KM',
        col: '6',
        type: 'select',
        rules: [
          {
            type: 'required',
            message: 'Vui lòng chọn hình thức khuyến mãi!',
          },
        ],
        list: [
          {
            label: 'Giảm tiền mặt',
            value: 'CASH',
          },
          {
            label: 'Giảm phần trăm',
            value: 'PERCENT',
          },
        ],
        onChange: (e, f) => {
          setMethod(e);
          const value = e;
          f.setFieldsValue({
            voucherType: value,
          });
        },
      },
    },
    {
      title: 'Giá trị',
      name: 'voucherValue',
      tooltip: 'Nhập giá trị khuyễn mãi, vui lòng chỉ nhập số!',
      formItem: {
        disabled: () =>(pageType === 'edit' && data?.balanceQuantity !== data?.releaseQuantity),
        formatter: (value) => {
          if (!value) {
            return;
          }
          if (form.getFieldValue('voucherType') === 'CASH') {
            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
          } else {
            return `${value}%`;
          }
        },
        parser: (value) => {
          if (!value) {
            return;
          }
          if (form.getFieldValue('voucherType') === 'CASH') {
            return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
          } else {
            return value.replace('%', '');
          }
        },
        placeholder: 'Nhập giá trị KM',
        col: '6',
        type: 'input_number',
        rules: [
          {
            type: 'required',
            message: 'Vui lòng điền vào trường này!',
          },
          {
            type: 'custom',
            validator: (form) => ({
              validator: (rule, value) => {
                if (value && !/^[0-9]+$/.test(value)) {
                  return Promise.reject(new Error('Vui lòng chỉ nhập số!'));
                }
                if (form.getFieldValue('voucherType') === 'PERCENT') {
                  const percentage = parseInt(value, 10);
                  if (isNaN(percentage) || percentage < 1 || percentage >= 100) {
                    return Promise.reject(new Error('Vui lòng nhập giá trị từ lớn hơn 0 và nhỏ hơn 100%!'));
                  }
                  return Promise.resolve();
                }
                if (form.getFieldValue('voucherType') === 'CASH') {
                  const valueCash = parseInt(value, 10);
                  if (valueCash <= 0) {
                    return Promise.reject(new Error('Vui lòng nhập số lớn hơn 0!'));
                  }
                  return Promise.resolve();
                }
                return Promise.resolve();
              },
            }),
          },
        ],
        min: 0,
        onKeyDown: (e) => {
          const condition =
            (e.key === 'c' && e.ctrlKey) ||
            (e.key === 'v' && e.ctrlKey) ||
            (e.key === 'x' && e.ctrlKey) ||
            (e.key === 'a' && e.ctrlKey);
          if (
            condition ||
            [
              '0',
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              'Backspace',
              'Delete',
              'ArrowRight',
              'ArrowLeft',
              'Enter',
              'Tab',
            ].includes(e.key)
          ) {
            // Cho phep
          } else {
            e.preventDefault();
          }
        },
      },
    },

    {
      title: 'Tổng số phát hành',
      name: 'releaseQuantity',
      tooltip: 'Vui lòng chỉ nhập số!',
      formItem: {
        disabled: () => (pageType === 'edit' && data?.balanceQuantity !== data?.releaseQuantity),
        formatter: (value) => {
          if (!value) {
            return;
          }
          return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        },
        parser: (value) => {
          if (!value) {
            return;
          }
          return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
        },
        col: '6',
        placeholder: 'Nhập tổng số phát hành',
        type: 'input_number',
        onKeyDown: (e) => {
          const condition =
            (e.key === 'c' && e.ctrlKey) ||
            (e.key === 'v' && e.ctrlKey) ||
            (e.key === 'x' && e.ctrlKey) ||
            (e.key === 'a' && e.ctrlKey);
          if (
            condition ||
            [
              '0',
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              'Backspace',
              'Delete',
              'ArrowRight',
              'ArrowLeft',
              'Enter',
              'Tab',
            ].includes(e.key)
          ) {
            // Cho phep
          } else {
            e.preventDefault();
          }
        },
        rules: [
          {
            type: 'required',
            message: 'Vui lòng điền vào trường này!',
          },
          {
            type: 'custom',
            validator: (form) => ({
              validator: (rule, value) => {
                if (value && !/^[0-9]+$/.test(value)) {
                  return Promise.reject(new Error('Vui lòng chỉ nhập số!'));
                }
                if (+value <= 0) {
                  return Promise.reject(new Error('Vui lòng nhập số lớn hơn 0!'));
                }
                return Promise.resolve();
              },
            }),
          },
        ],
      },
    },
    {
      title: 'Ngày bắt đầu',
      name: 'startDate',
      formItem: {
        disabled: () => (pageType === 'edit' && data?.balanceQuantity !== data?.releaseQuantity),
        col: '6',
        type: 'date',
        picker: 'date',
        placeholder: 'Chọn ngày bắt đầu',
        formatDate: 'DD/MM/YYYY',
        disabledDate: (current, form) => {
          const value = form.getFieldValue('endDate');
          const today = moment();
          if (!value) return current.isBefore(today, 'day');
          // return current && current.valueOf() > value && value.valueOf();
          return current && (current.isBefore(today, 'day') || current.isAfter(value, 'day'));
        },
        rules: [
          {
            type: 'required',
            message: 'Vui lòng chọn ngày bắt đầu!',
          },
        ],
      },
    },
    {
      title: 'Ngày kết thúc',
      name: 'endDate',
      formItem: {
        disabled: () => (pageType === 'edit' && data?.balanceQuantity !== data?.releaseQuantity),
        picker: 'date',
        col: '6',
        type: 'date',
        placeholder: 'Chọn ngày kết thúc',
        formatDate: 'DD/MM/YYYY',
        disabledDate: (current, form) => {
          const value = form.getFieldValue('startDate') ?? moment();
          const today = moment();
          if (!value) return current.isBefore(today, 'day');
          return current.isBefore(value, 'day');
        },
        rules: [{ type: 'required', message: 'Vui lòng chọn ngày kết thúc!' }],
      },
    },
    {
      title: 'Điều kiện áp dụng',
      name: 'conditionApplyAmount',
      tooltip: 'Giá trị đơn hàng tối thiểu để có thể áp dụng voucher. Vui lòng chỉ nhập số',
      formItem: {
        disabled: () => (pageType === 'edit' && data?.balanceQuantity !== data?.releaseQuantity),
        formatter: (value) => {
          if (!value) {
            return;
          }
          return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        },
        parser: (value) => {
          if (!value) {
            return;
          }
          return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
        },
        placeholder: 'Nhập điều kiện',
        col: '6',
        type: 'input_number',
        rules: [
          {
            type: 'required',
            message: 'Vui lòng điền vào trường này!',
          },
          {
            type: 'custom',
            validator: (form) => ({
              validator: (rule, value) => {
                const voucherValue = form.getFieldValue('voucherValue') ?? 0;
                if (value && !/^[0-9]+$/.test(value)) {
                  return Promise.reject(new Error('Vui lòng chỉ nhập số!'));
                }
                if (form.getFieldValue('voucherType') === 'CASH') {
                  if (+value < +voucherValue) {
                    return Promise.reject(new Error('Điều kiện áp dụng phải lớn hơn hoặc bằng giá trị!'));
                  }
                  return Promise.resolve();
                }
                return Promise.resolve();
              },
            }),
          },
        ],
        min: 0,
        onKeyDown: (e) => {
          const condition =
            (e.key === 'c' && e.ctrlKey) ||
            (e.key === 'v' && e.ctrlKey) ||
            (e.key === 'x' && e.ctrlKey) ||
            (e.key === 'a' && e.ctrlKey);
          if (
            condition ||
            [
              '0',
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              'Backspace',
              'Delete',
              'ArrowRight',
              'ArrowLeft',
              'Enter',
              'Tab',
            ].includes(e.key)
          ) {
            // Cho phep
          } else {
            e.preventDefault();
          }
        },
      },
    },
    {
      title: 'Col',
      name: 'hidden',
      formItem: {
        col: '6',
        type: 'hidden',
      },
    },
    // {
    //   title: 'Số lần sử dụng tối đa',
    //   name: '',
    //   tooltip: 'Số lần tối đa mỗi khách hàng có thể sử dụng voucher. Vui lòng chỉ nhập số!',
    //   formItem: {
    //     disabled: () => pageType === 'edit' || (pageType === 'edit' && data?.balanceQuantity !== data?.releaseQuantity),
    //     formatter: (value) => {
    //       if (!value) {
    //         return;
    //       }
    //       return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    //     },
    //     parser: (value) => {
    //       if (!value) {
    //         return;
    //       }
    //       return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
    //     },
    //     col: '6',
    //     placeholder: 'Nhập số lần sử dụng tối đa',
    //     type: 'input_number',
    //     onKeyDown: (e) => {
    //       const condition =
    //         (e.key === 'c' && e.ctrlKey) ||
    //         (e.key === 'v' && e.ctrlKey) ||
    //         (e.key === 'x' && e.ctrlKey) ||
    //         (e.key === 'a' && e.ctrlKey);
    //       if (
    //         condition ||
    //         [
    //           '0',
    //           '1',
    //           '2',
    //           '3',
    //           '4',
    //           '5',
    //           '6',
    //           '7',
    //           '8',
    //           '9',
    //           'Backspace',
    //           'Delete',
    //           'ArrowRight',
    //           'ArrowLeft',
    //           'Enter',
    //           'Tab',
    //         ].includes(e.key)
    //       ) {
    //         // Cho phep
    //       } else {
    //         e.preventDefault();
    //       }
    //     },
    //     rules: [
    //       {
    //         type: 'required',
    //         message: 'Vui lòng điền vào trường này!',
    //       },
    //       {
    //         type: 'custom',
    //         validator: (form) => ({
    //           validator: (rule, value) => {
    //             if (value && !/^[0-9]+$/.test(value)) {
    //               return Promise.reject(new Error('Vui lòng chỉ nhập số!'));
    //             }
    //             if (+value <= 0) {
    //               return Promise.reject(new Error('Vui lòng nhập số lớn hơn 0!'));
    //             }
    //             return Promise.resolve();
    //           },
    //         }),
    //       },
    //     ],
    //   },
    // },
    {
      title: 'Mô tả',
      name: 'description',
      formItem: {
        disabled: () => (pageType === 'edit' && data?.balanceQuantity !== data?.releaseQuantity),
        col: '12',
        placeholder: 'Nhập mô tả',
        type: 'textarea',
        rules: [
          { type: 'max', value: 255, message: 'Vui lòng không nhập quá 255 ký tự!' },
          { type: 'required', message: 'Vui lòng điền vào trường này!' },
        ],
      },
    },
  ];
};
export default Column;
