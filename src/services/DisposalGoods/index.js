import axios from 'axios';
import { Message } from 'components';
import moment from 'moment';
import { routerLinks } from 'utils';

// const convertAddress = (address) => {
//   if (!address) return '';
//   const street = address?.street ? address?.street + ', ' : '';
//   const ward = address?.ward && address?.ward?.name ? address?.ward?.name + ', ' : '';
//   const district = address?.district && address?.district?.name ? address?.district?.name + ', ' : '';
//   const province = address?.province && address?.province?.name ? address?.province?.name + ', ' : '';
//   const res = street + ward + district + province;
//   if (res[res.length - 2] === ',') {
//     return res.slice(0, -2);
//   }
//   return res;
// };

export const DisposalGoodsService = {
  nameLink: 'PromotionalGoods',
   getListSupplierNonBal: async (params) => {
    try {
      const { data } = await axios.get(`sub-organization/sub-org-in-store`, {
        params,
      });

      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  get: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryOrder', 'api')}`, {
        params,
      });
      const convertData = data?.data.map((item) => ({
        ...item,
        disposalDate: moment(item?.issuedAt).format('DD/MM/YYYY'),
        code: item?.code,
        disposalStatus: item?.status,
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
  getById: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryOrder', 'api')}/${id}`);
      const converData = {
        ...data?.data,
        // importedAddress: data?.data?.importedAddress?.street,
        // issuedAt: moment(data?.data?.issuedAt),
      };
      return {
        ...converData,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListProvince: async () => {
    try {
      const { data } = await axios.get(`/province`);
      return {
        data: data?.data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListDistrict: async (code) => {
    try {
      const { data } = await axios.get(`/district/${code}`);
      return {
        data: data?.data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListWard: async (code) => {
    try {
      const { data } = await axios.get(`/ward/${code}`);
      return {
        data: data?.data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  post: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks('InventoryOrder', 'api')}`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message)
        Message.error({ text: e.response.data.message, title: 'Thất bại', cancelButtonText: 'Đóng' });
      return false;
    }
  },
  exportBillCombineCreating: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks('InventoryOrder', 'api')}/export-bill-not-create`, values);
      if (data.mesage) Message.success({ text: data.mesage, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message)
        Message.error({ text: e.response.data.message, title: 'Thất bại', cancelButtonText: 'Đóng' });
      return false;
    }
  },
  put: async (id, values) => {
    try {
      const { data } = await axios.put(`${routerLinks('InventoryOrder', 'api')}/${id}`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  getDisposalGoodsList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryOrder', 'api')}`, {
        params,
      });
      const convertData = data?.data.map((item) => ({
        ...item,
        disposalDate: moment(item?.issuedAt).format('DD/MM/YYYY'),
        disposalCode: item?.code,
        disposalStatus: item?.status,
        storeName: item?.storeName,
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

  getStoreListWithOrder: async () => {
    try {
      const { data } = await axios.get(`${routerLinks('StoreSupplier', 'api')}/store-order`);
      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  exportBillDisposalWhenEdit: async (id) => {
    try {
      const { data } = await axios.post(`${routerLinks('Order', 'api')}/print-disposal-note/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      const disposalNoteKey = data?.data?.key;
      try {
        const { data } = await axios.get(`${routerLinks('Util', 'api')}/download?key=${disposalNoteKey}`, {
          responseType: 'blob',
        });
        return data;
      } catch (e) {
        console.log('error', e);
        if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
        return false;
      }
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  downloadBillDisposalWhenCreateWithKey: async (disposalNoteKey) => {
    try {
      const { data } = await axios.get(`${routerLinks('Util', 'api')}/download?key=${disposalNoteKey}`, {
        responseType: 'blob',
      });
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
      const { data } = await axios.delete(`${routerLinks('InventoryOrder', 'api')}/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  deleteDisposalItem: async (id) => {
    try {
      const { data } = await axios.delete(`${routerLinks('InventoryOrderLineItem', 'api')}/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  deleteLastDisposalItem: async (id) => {
    try {
      await axios.delete(`${routerLinks('InventoryOrderLineItem', 'api')}/${id}`);
      // if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  getListSupplier: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('StoreSupplier', 'api')}/list-supplier`, {params});
      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListProduct: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryProduct', 'api')}/product-good`, {
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
