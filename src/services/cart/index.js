import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const CartService = {
  nameLink: 'Cart',
  getListCart: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(CartService.nameLink, 'api')}/get-cart`, {
        params,
      });
      return {
        data: data?.data || [],
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  addToCart: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(CartService.nameLink, 'api')}/add-to-cart`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  deleteCartItem: async (id) => {
    try {
      const { data } = await axios.delete(`${routerLinks(CartService.nameLink, 'api')}/delete/cart-line-item/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  increaseQuantityCart: async (id) => {
    try {
      const { data } = await axios.put(`${routerLinks(CartService.nameLink, 'api')}/increase-quantity/${id}`);
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  updateQuantityCart: async (values) => {
    try {
      const { data } = await axios.put(`${routerLinks(CartService.nameLink, 'api')}/update-quantity`, values);
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  decreaseQuantityCart: async (id) => {
    try {
      const { data } = await axios.put(`${routerLinks(CartService.nameLink, 'api')}/decrease-quantity/${id}`);
      // if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  postOrder: async (values, voucherUuid, tax, customerId) => {
    const cart = {
      list: values.map((item) => {
        return {
          productId: item?.productId,
          storeBarcode: item?.storeBarcode ? item?.storeBarcode : item?.StoreBarcode || item?.product?.barcode,
        };
      }),
      voucherUuid,
      isApplyTax: !!tax,
      customer_id: customerId
    };
    try {
      const { data } = await axios.post(`${routerLinks('OrderManagement', 'api')}`, cart);
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  deleteNotApproveProduct: async () => {
    try {
      const { data } = await axios.delete(`${routerLinks(CartService.nameLink, 'api')}/remove-not-approve-product`);
      // if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
