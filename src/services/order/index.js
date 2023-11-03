import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';


export const OrdersService = {
  nameLink: 'OrderManagement',
  get: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(OrdersService.nameLink, 'api')}/count-orders`, {
        params,
      });

      return {
        data: data?.data || [],
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },





};
