import axios from 'axios';
import { Message } from 'components';
import moment from 'moment';
import { routerLinks } from 'utils';

export const GoodsReturnService = {
  nameLink: 'GoodReturn',
  exportBillCombineCreating: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks('InventoryOrder', 'api')}/export-bill-not-create`, values);
      if (data.mesage) Message.success({ text: data.mesage, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message)
        Message.error({ text: e.response.data.message, title: 'Thất bại', cancelButtonText: 'Đóng' });
      return false;
    }
  },
  getListSupplierWhenChoose: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('StoreConnectSupplier', 'api')}/supplier`, { params });
      return {
        data: data.data || []
      }
    } catch (e) {
      if (e.response.data.message)
        Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListSupplierWhenChooseNonBal: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('StoreSupplier', 'api')}/sub-org-in-store`, { params });
      return {
        data: data.data || []
      }
    } catch (e) {
      if (e.response.data.message)
        Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListSupplierBalandNonBal: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('StoreSupplier', 'api')}/sub-org-in-store`, { params });
      return {
        data: data.data || []
      }
    } catch (e) {
      if (e.response.data.message)
        Message.error({ text: e.response.data.message });
      return false;
    }
  },
  exportBillDisposalWhenEdit: async (id, billCode) => {
    try {
      const { data } = await axios.post(`${routerLinks('Order', 'api')}/print-return-goods-note/${id}/${billCode !== undefined ? 'true' : false}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      const disposalNoteKey = data?.data?.key;
      try {
        const { data } = await axios.get(`${routerLinks('Util', 'api')}/download?key=${disposalNoteKey}`, {
          responseType: 'blob',
        });
        return data;
      } catch (e) {
        if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
        return false;
      }
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  getByCode: async (code) => {
    // catch (response) {
    //   Message.error({ text: response?.data?.message });
    //   return {
    //     data: [],
    //     count: 0,
    //   };
    // }
    try {
      const { data } = await axios.get(`${routerLinks('OrderInvoice', 'api')}/${code}`);
      return {
        data: data.data || [],
      };
    } catch (e) {
      Message.error({ text: e.response.data.message });
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
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  get: async (params, id) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryOrder', 'api')}`, {
        params
      });
      const converData = data?.data.map((item) => ({
        ...item,
        importedAt: moment(item?.issuedAt).format('DD/MM/YYYY'),
      }));
      return {
        data: converData || [],
        count: data?.pagination?.total,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getById: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryOrder', 'api')}/${id}`);
      // const converData = {
      //     ...data?.returnData,
      //     importedAddress: data?.returnData?.importedAddress?.street,
      //     importedAt: moment(data?.returnData?.importedAt),
      // };
      return {
        data: data.data || []
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  post: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks('InventoryOrder', 'api')}`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return {
        data: data.data || []
      };
    } catch (e) {
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
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  exportBillPromotion: async (id) => {
    try {
      const { data } = await axios.put(
        `${routerLinks('Order', 'api')}/export-bill/${id}`,
      );
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  // inventory-order-line-item
  deleteAll: async (id) => {
    try {
      const { data } = await axios.delete(`${routerLinks('InventoryOrder', 'api')}/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  deleteOneProduct: async (id) => {
    try {
      const { data } = await axios.delete(`${routerLinks('InventoryOrderLineItem', 'api')}/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListSupplier: async () => {
    try {
      const { data } = await axios.get(`${routerLinks('StoreSupplier', 'api')}/list-supplier`);
      return {
        data: data?.data || [],
      };
    } catch (e) {
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
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListProductOrder: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryProduct', 'api')}/order-return-good-v2`, {
        params,
      });
      return {
        data: data?.data || [],
        count: data?.pagination?.total,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  postListProductReturnGood: async (data, listId, pageType) => {
    const arrayId = listId?.map((ele) => pageType === 'create' ? +ele.id : +ele?.idProduct || +ele?.productId)
    const value = {
      orderId: +data?.orderId || +data?.id,
      listProductId: arrayId
    }
    try {
      const { data } = await axios.post(`${routerLinks('InventoryProduct', 'api')}/order-return-good`, value);
      return {
        data: data?.data || [],
        count: data?.pagination?.total,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListStoreForFilter: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('StoreSupplier', 'api')}/list-store`, {
        params,
      });
      return {
        data: data?.data || [],
        count: data?.pagination?.total,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
