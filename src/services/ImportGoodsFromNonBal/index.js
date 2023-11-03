import axios from 'axios';
import { Message } from 'components';
import moment from 'moment';
import { formatCurrency, routerLinks } from 'utils';

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

export const ImportGoodsFromNonBalService = {
  get: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('Order', 'api')}/order-non-balance/get-list`, {
        params,
      });

      const convertData = data?.data.map((item) => ({
        ...item,
        importGoodsNonBalDate: moment(item?.importedAt).format('DD/MM/YYYY'),
        code: item?.code,
        importGoodsNonBalStatus: item?.importedStatus,
        totalMoney: formatCurrency(item?.totalPrice, ''),
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
      const { data } = await axios.get(`${routerLinks('Order', 'api')}/order-non-balance/${id}`);
      const converData = {
        ...data?.returnData,
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
      const { data } = await axios.post(`${routerLinks('Order', 'api')}/order-non-balance`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      if (e.response.data.message)
        Message.error({ text: e.response.data.message, title: 'Thất bại', cancelButtonText: 'Đóng' });
      return false;
    }
  },
  exportBillCombineCreating: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks('Order', 'api')}/export-bill-order-non-balance-no-order`, values);
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
      const { data } = await axios.put(`${routerLinks('Order', 'api')}/order-non-balance/update/${id}`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  getImportNonBalGoodsList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('Order', 'api')}/order-non-balance/get-list`, {
        params,
      });
      const convertData = data?.data.map((item) => ({
        ...item,
        importGoodsNonBalDate: moment(item?.importedAt).format('DD/MM/YYYY'),
        importGoodsNonBalCode: item?.code,
        importGoodsNonBalStatus: item?.importedStatus,
        storeName: item?.storeName,
        totalMoney: formatCurrency(item?.totalPrice, '')
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

  exportBillImportNonBalWhenEdit: async (id) => {
    try {
      const { data } = await axios.post(`${routerLinks('Order', 'api')}/export-bill-order-non-balance/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      const importGoodsNonBalNoteKey = data?.data?.key;
      try {
        const { data } = await axios.get(`${routerLinks('Util', 'api')}/download?key=${importGoodsNonBalNoteKey}`, {
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
  downloadBillImportNonBalWhenCreateWithKey: async (importGoodsNonBalNoteKey) => {
    try {
      const { data } = await axios.get(`${routerLinks('Util', 'api')}/download?key=${importGoodsNonBalNoteKey}`, {
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
      const { data } = await axios.delete(`${routerLinks('Order', 'api')}/order-non-balance/delete/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  deleteImportNonBalItem: async (id) => {
    try {
      const { data } = await axios.delete(`${routerLinks('OrderLineItem', 'api')}/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  deleteLastImportNonBalItem: async (id) => {

    try {
      await axios.delete(`${routerLinks('OrderLineItem', 'api')}/${id}`);
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
  getListProduct: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('Product', 'api')}`, {
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
