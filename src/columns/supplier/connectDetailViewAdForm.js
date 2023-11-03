const Column = ({ pageType = '', email, merge, setManagerId, roleCode, pageTyper = '', isActived, site = '' }) => {
  return [
    {
      title: 'Mã yêu cầu',
      name: 'requestCode',
      formItem: {
        col: '6',
        placeholder: () => false,
        disabled: () => true,
        //   condition: (text) => pageType !== 'create',
      },
    },
    {
      title: 'Tên sản phẩm',
      name: 'productName',
      formItem: {
        col: '6',
        placeholder: () => false,
        disabled: () => true,
        //   condition: (text) => pageType !== 'create',
      },
    },
    {
      title: 'Ngày yêu cầu',
      name: 'requestDate',
      formItem: {
        col: '6',
        placeholder: () => false,
        disabled: () => true,
        //   condition: (text) => pageType !== 'create',
      },
    },
    {
      title: 'Ngày phê duyệt',
      name: 'approvedDate',
      formItem: {
        col: '6',
        placeholder: () => false,
        disabled: () => true,
        //   condition: (text) => pageType !== 'create',
      },
    },
  ];
};
export default Column;
