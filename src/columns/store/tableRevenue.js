
import React from "react";
import { formatCurrency } from "utils";
const Column = () => {
   return [
      {
         title: "Mã đơn hàng",
         name: "code",
         tableItem: {
         },
      },
      {
         title: "Danh mục sản phẩm",
         name: "category",
         tableItem: {
         },
      },
      {
         title: "Mã nhà cung cấp",
         name: "codeSupplier",
         tableItem: {
         },
      },
      {
         title: "Tổng tiền đơn hàng",
         name: "totalOrder",
         tableItem: {
            render: (value) => formatCurrency(value)
         },
      },
      {
         title: "Ngày đặt hàng",
         name: "dateOrder",
         tableItem: {
         },
      },
      {
         title: "Trạng thái đơn hàng",
         name: "status",
         tableItem: {
            width: 160,
            render: (value) => {
               return value ? <div className="bg-green-100 text-center p-1 border border-green-500 rounded-xl">Đang bán</div> :
                  <div className="bg-red-100 text-center p-1 border border-red-500 rounded-xl">Hết hàng</div>
            }
         },
      },


   ];
};
export default Column;
