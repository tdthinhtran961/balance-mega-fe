const Column = ({pageType = ''}) => { 
  return [
    (pageType === 'edit' && {
      title: "Mã danh mục",
      name: "code",
      formItem: {
        placeholder: "Nhập mã danh mục",
        col: '4',
        disabled: () => true
      },
    }),
    {
      title: "Tên danh mục",
      name: "name",
      formItem: {
        placeholder: "Nhập tên danh mục",
        col: pageType === 'edit' ? '4' : '6',
        rules: [{ type: "required" }],
        disabled: () => pageType === 'detail' 
      },
    },
    {
      title: "Trạng thái",
      name: "isActive",
      formItem: {
        placeholder: "Trạng thái",
        col: pageType === 'edit' ? '4' : '6',
        type: "select",
        rules: [{ type: "required" }],
        disabled: () => pageType === 'detail' ,
        list: [
          { value: 1, label: 'Hoạt động' },
          { value: 2, label: 'Ngừng hoạt động' },
        ]
      },
    },
    {
      title: "Mô tả danh mục",
      name: "description",
      formItem: {
        placeholder: "Nhập mô tả danh mục",
        col: '12',
        type: "textarea",
        rules: [
        { type: "max", value: 500 }
        ],
        disabled: () => pageType === 'detail'
      },
    },
  ];
};
export default Column;
