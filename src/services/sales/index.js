import axios from "axios";

import { routerLinks } from "utils";
import { Message } from "components";




export const SaleService = {

    customer: 'Customer',

    addNewCustomer : async (params) => {
        try {
            const { data } = await axios.post(`${routerLinks(SaleService.customer, 'api')}`, {
              ...params,
            });
            if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
            return data;
          } catch (e) {
            if (e.response.data.message)
              Message.error({ text: e.response.data.message, title: 'Thất bại', cancelButtonText: 'Đóng' });
            return false;
          }
    },

    searchCustomerInfo : async (params) => {
      try {
        const { data } = await axios.get(`${routerLinks(SaleService.customer, 'api')}/search?${params.type}=${params.value}`);
        return data;
      } catch (e) {
        return false;
      }
    }

}