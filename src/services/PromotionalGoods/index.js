import axios from 'axios';
import { Message } from 'components';
import moment from 'moment';
import { formatCurrency, routerLinks } from 'utils';

export const PromotionalGoodsService = {
  nameLink: 'PromotionalGoods',
  util: 'Util',
  get: async (params, id) => {
    try {
      const { data } = await axios.get(`${routerLinks('Order', 'api')}/promotion/get-list`, {
        params,
      });
      const converData = data?.data.map((item) => ({
        ...item,
        importedAt: moment(item?.importedAt).format('DD/MM/YYYY'),
      }));
      return {
        data: converData || [],
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
      const { data } = await axios.get(`${routerLinks('Order', 'api')}/promotion/${id}`);
      const converData = {
        ...data?.returnData,
        importedAddress: data?.returnData?.importedAddress?.street,
        importedAt: moment(data?.returnData?.importedAt),
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
  post: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks('Order', 'api')}/promotion`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message)
        Message.error({ text: e.response.data.message, title: 'Thất bại', cancelButtonText: 'Đóng' });
      return false;
    }
  },
  exportBillPromotionByCreate: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks('Order', 'api')}/export-bill-promotion`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      const purchaseOrderKey = data?.data?.key;
      try {
        const { data } = await axios.get(
          `${routerLinks(PromotionalGoodsService.util, 'api')}/download?key=${purchaseOrderKey}`,
          {
            responseType: 'blob',
          },
        );
        return data;
      } catch (e) {
        console.log('error', e);
        if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
        return false;
      }
    } catch (e) {
      console.log(e);
      if (e.response.data.message)
        Message.error({ text: e.response.data.message, title: 'Thất bại', cancelButtonText: 'Đóng' });
      return false;
    }
  },
  put: async (id, values) => {
        try {
      const { data } = await axios.put(`${routerLinks('Order', 'api')}/promotion/update/${id}`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getAllBarcode: async () => {
    try {
      const { data } = await axios.get(`${routerLinks('Product', 'api')}/store/barcode`);
      return {
        data: data?.data,
        // count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  exportBillPromotion: async (id) => {
    try {
      const { data } = await axios.put(`${routerLinks('Order', 'api')}/export-bill/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  printOrderPromotion: async (id, paymentSupplier) => {
    try {
      const payment = {
        paymentSupplier,
      };
      const { data } = await axios.post(`${routerLinks('Order', 'api')}/print-receiving-note-promotion/${id}`, payment);
      const purchaseOrderKey = data?.data?.key;
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      try {
        const { data } = await axios.get(
          `${routerLinks(PromotionalGoodsService.util, 'api')}/download?key=${purchaseOrderKey}`,
          {
            responseType: 'blob',
          },
        );
        if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
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
  delete: async (id) => {
    try {
      const { data } = await axios.delete(`${routerLinks('Order', 'api')}/promotion/delete/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
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
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListProduct: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('StoreSupplier', 'api')}/import/list-products`, {
        params,
      });
      const convertData = data?.data?.map((i) => ({ ...i, priceUnit: i?.productPrice[0]?.price ?? 0 }));
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
  getPromotionOrderList: async (values) => {
    try {
      const { data } = await axios.get(`${routerLinks('Order', 'api')}/promotion/get-list`, {
        params: values,
      });
      const listResult = data?.data?.map((orderItem) => {
        return {
          ...orderItem,
          orderCode: orderItem?.code,
          storeName: orderItem?.storeName,
          // reciever: orderItem?.storeAdmin?.name,
          deliveryAddress: orderItem?.importedAddress?.street,
          totalPrice: formatCurrency(orderItem?.totalPrice, ''),
          orderDate: moment(orderItem?.importedAt).format('DD/MM/YYYY'),
          status: orderItem?.importedStatus,
          supplierName: orderItem?.supplierName,
          // pickUpAddress: convertAddress(orderItem?.store?.address),
        };
      });
      return {
        data: listResult,
        count: data?.pagination?.total,
      };
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.log(error);
    }
  },
  getSupplierListWithOrder: async () => {
    try {
      const { data } = await axios.get(`${routerLinks('StoreSupplier', 'api')}/supplier-order`);
      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getSupplierListWithOrderParams: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('StoreSupplier', 'api')}/supplier-order`, { params });
      return {
        data: data?.data || [],
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
  downloadWhenCreateWithKey: async (disposalNoteKey) => {
    try {
      const { data } = await axios.get(
        `${routerLinks(PromotionalGoodsService.util, 'api')}/download?key=${disposalNoteKey}`,
        {
          responseType: 'blob',
        },
      );
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log('error', e);
      if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
      return false;
    }
  },
  editOrder: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks('Order', 'api')}`, params);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return {
        data: data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
