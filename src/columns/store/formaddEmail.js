const Column = ({ pageType = '', emailManager }) => {
   return [
      {
         title: "Email quản lý",
         name: "email",
         formItem: {
            type: 'select',
            placeholder: "Chọn hoặc nhập email quản lý",
            rules: [{ type: 'email', message: 'Xin vui lòng nhập email quản lý cửa hàng' }],
            col: '6',
            list: emailManager.map(item => ({value: item.email, label: item.email})),
         },
      },
      {
         title: "Họ và tên quản lý",
         name: "manageName",
         formItem: {
            col: '6',
          
         },
      },
      {
         title: "Số điện thoại quản lý",
         name: "managePhone",
         formItem: {
            col: '6',
         },
      },
      
     
   ];
};
export default Column;
