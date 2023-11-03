// import React from 'react';
const Column = ({ roleCode, idRequest, listReason }) => {
  return [
    {
      title: 'Lý do',
      name: 'reason',
      formItem: {
        // condition: (text) => !!text,
        type: 'select',
        list: listReason,
        rules: [{ type: 'required', message: 'Xin vui lòng nhập lý do' }],
      },
    },
    {
      title: 'Chi tiết',
      name: 'note',
      formItem: {
        // condition: (text) => {
        //     return reason;
        // }
        type: 'textarea',
        rules: [{ type: 'max', value: 500, message: 'Chỉ được nhập tối đa 500 kí tự' }],
      },
    },
    roleCode === 'OWNER_STORE' && {
      title: 'ID yêu cầu',
      name: 'storeRequestId',
      formItem: {
        // condition: (text) => {
        //     return reason;
        // }
        type: 'hidden',
        condition: (text, form) => {
          form.setFieldsValue({ storeRequestId: idRequest });
          return true;
        },
      },
    },
  ];
};
export default Column;
