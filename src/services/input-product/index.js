import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const InputProductService = {
  nameLink: 'StoreSupplier',

  getListProduct: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(InputProductService.nameLink, 'api')}/import/list-products`, {
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
  getListSupplier: async () => {
    try {
      const { data } = await axios.get(`${routerLinks(InputProductService.nameLink, 'api')}/list-supplier`);
      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListCategory: async () => {
    try {
      const { data } = await axios.get(`${routerLinks(InputProductService.nameLink, 'api')}/list-category`);
      return {
        data: data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getProductDetailById: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(InputProductService.nameLink, 'api')}/import/${id}`);
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
      const { data } = await axios.post(routerLinks(InputProductService.nameLink, 'api'), values);
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
      const { data } = await axios.put(`${routerLinks(InputProductService.nameLink, 'api')}/${id}`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  delete: async (values) => {
    try {
      const { data } = await axios.delete(`${routerLinks(InputProductService.nameLink, 'api')}`, {
        data: { listId: values },
      });
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  GetOrder: async (params) => {
    try {
      const { data } = await axios.get(routerLinks('OrderManagement', 'api'), { params });
      const listResult = data?.data?.map((order) => {
        return {
          ...order,
          id: order?.id,
          storeName: order?.store?.name,
          orderCode: order?.code,
          totalPrice: order?.total,
          orderDate: new Date(order?.createdAt).toLocaleDateString(),
          confirmAt: new Date(order?.confirmAt).toLocaleDateString(),
          pickupAt: new Date(order?.pickupAt).toLocaleDateString(),
          deliveredAt: new Date(order?.deliveredAt).toLocaleDateString(),
          cancelledAt: new Date(order?.cancelledAt).toLocaleDateString(),
        };
      });
      return {
        data: listResult,
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};
