import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
import moment from 'moment';

export const ReportService = {
  nameLink: 'Report',
  get: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(ReportService.nameLink, 'api')}`, {
        params,
      });
      const converntData = data?.data;
      return {
        data: converntData ?? [],
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  post: async (values) => {
    try {
      const { data } = await axios.post(routerLinks(ReportService.nameLink, 'api'), values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message)
        Message.error({ text: e.response.data.message, title: 'Thất bại', cancelButtonText: 'Đóng' });
      return false;
    }
  },

  put: async (id, values) => {
    try {
      const { data } = await axios.put(`${routerLinks(ReportService.nameLink, 'api')}/${id}`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  // API lấy danh sách phiếu kho
  getInventoryItemList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryOrder', 'api')}/inventory-bill-list`, {
        params,
      });
      const convertData = data?.data.map((item) => ({
        ...item,
        createdAt: moment(new Date(item?.createdAt)).format('DD/MM/YYYY'),
        orderId: Number(item?.orderId),
        inventoryOrderId: Number(item?.inventoryOrderId),
      }));
      return {
        data: convertData || [],
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
