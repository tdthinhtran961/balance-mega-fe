import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';


export const VoucherService = {
  nameLink: 'Voucher',
  get: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(VoucherService.nameLink, 'api')}`, {
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
  getInfo: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(VoucherService.nameLink, 'api')}/get-info`, {
        params,
      });
      // if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return {
        data: data?.data
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  post: async (values) => {
    try {
      const { data } = await axios.post(routerLinks(VoucherService.nameLink, 'api'), values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message)
        Message.error({ text: e.response.data.message, title: 'Thất bại', cancelButtonText: 'Đóng' });
      return false;
    }
  },

  put: async (values) => {
    try {
      const { data } = await axios.put(`${routerLinks(VoucherService.nameLink, 'api')}`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  active: async (id, parmas) => {
    try {
      const { data } = await axios.put(`${routerLinks(VoucherService.nameLink, 'api')}/active/${id}`, { parmas });
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getById: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(VoucherService.nameLink, 'api')}/detail/${id}`);
      return {
        ...data?.data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },


};
