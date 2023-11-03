import axios from 'axios';

import { routerLinks } from 'utils';
import { Message } from 'components';

export const StoreUserManagementService = {
  nameLink: 'User',
  get: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(StoreUserManagementService.nameLink, 'api')}/store/staff`, { params });
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
  getListStoreOrBranch: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('StoreSupplier', 'api')}/store/list-branch`, { params });
      const convertData = data?.data?.map(i => ({ ...i, id: +i.id }))
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
  getById: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(StoreUserManagementService.nameLink, 'api')}/store/staff/detail/${id}`);
      return {
        ...data?.data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  post: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(StoreUserManagementService.nameLink, 'api')}/store/staff`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành công', cancelButtonText: 'Đóng' });
      return {
        ...data?.data
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  put: async (values, id) => {
    try {
      const { data } = await axios.put(`${routerLinks(StoreUserManagementService.nameLink, 'api')}/store/staff`, values);
      if (data.message) Message.success(data.message);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },



};
