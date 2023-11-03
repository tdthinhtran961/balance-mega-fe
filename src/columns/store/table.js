
// import React from "react";
const Column = () => {
   return [
      {
         title: "Mã cửa hàng",
         name: "code",
         tableItem: {
          width: 145
         },
      },
      {
         title: "Tên cửa hàng",
         name: "name",
         tableItem: {
         },
      },
      {
         title: "Địa chỉ",
         name: "address",
         tableItem: {
            width: '40%', // Add by Thinh
         },
      },
      {
        title: "Loại cửa hàng",
         name: "isMain",
         tableItem: {
            render: (value) => value ? 'Cửa hàng chính' : 'Cửa hàng chi nhánh'
         },
      },
      {
        title: "Người đại diện",
         name: "manageName",
         tableItem: {
         },
      },
      {
         title: "Số điện thoại",
         name: "managePhone",
         tableItem: {
          width: 110
         },
      },
      // {
      //    title: "Tình trạng",
      //    name: "isActive",
      //    tableItem: {
      //       width: 180,
      //       render: (value) => {
      //          return value === true  ? <div className="w-[144px] h-[28px] leading-[27px] rounded-[4px] text-sm font-normal text-green-600 bg-green-50 text-center border border-green-600">Đang Hoạt động</div> :
      //            <div className="w-[144px] h-[28px] leading-[27px] rounded-[4px] text-sm font-normal text-red-600  bg-red-50 text-center border border-red-600 ">Ngừng hoạt động</div>
      //       }
      //    },
      // },

   ];
};
export default Column;
