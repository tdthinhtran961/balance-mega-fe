import axios from 'axios';

import { routerLinks } from 'utils';
import { Message } from 'components';

export const InventoryCheckService = {
  nameLink: 'InventoryCheck',
  get: async (params) => {
    try {
      const { data } = await axios.get(routerLinks(InventoryCheckService.nameLink, 'api'), {
        params,
      });
      return {
        data: data?.data ?? [],
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListProduct: async (params) => {
    try {
      const { data } = await axios.get(routerLinks(InventoryCheckService.nameLink, 'api') + '/product-list', {
        params,
      });
      return {
        data: data?.data ?? [],
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getById: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(InventoryCheckService.nameLink, 'api')}/detail/${id}`);

      return {
        ...data?.data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  post: async (values, noti = true) => {
    try {
      const { data } = await axios.post(routerLinks(InventoryCheckService.nameLink, 'api'), values);
      if (noti) {
        if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      }
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  put: async (values, id) => {
    try {
      const { data } = await axios.put(`${routerLinks(InventoryCheckService.nameLink, 'api')}/${id}?name=${values}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  delete: async (id) => {
    try {
      const { data } = await axios.delete(`${routerLinks(InventoryCheckService.nameLink, 'api')}/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  cancel: async (id, params) => {
    try {
      const { data } = await axios.put(`${routerLinks(InventoryCheckService.nameLink, 'api')}/cancel/${id}`, { params });
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
