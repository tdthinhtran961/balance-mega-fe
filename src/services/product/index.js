import axios from 'axios';

import { formatCurrency, routerLinks } from 'utils';
import { Message } from 'components';

export const ProductService = {
  nameLink: 'Product',
  getListSupplierForFilterProd: async (params, roleCode) => {
    try {
      const { data } = await axios.get(
        `${routerLinks('StoreSupplier', 'api')}/${
          roleCode === 'ADMIN'
            ? 'admin/all-supplier'
            : roleCode === 'OWNER_STORE' 
            ? 'store/all-supplier-store'
            : ''
        }`,
        { params },
      );
      return [...(data.data || [])];
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListSupplierWaitingApproved: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('Product', 'api')}/list/supplier-waiting-appprove`, { params });
      return [...(data.data || [])];
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  get: async (params) => {
    try {
      const { data } = await axios.get(routerLinks(ProductService.nameLink, 'api'), {
        params,
      });

      const convertData = data?.data?.map((item, index) => ({
        ...item,
        retailPrice: item?.productPrice?.filter((item) => item?.defaultPrice === true)?.[0]?.price,
        supplierNameStore: item?.subOrg?.name,
        index: index + 1,
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
      const { data } = await axios.get(`${routerLinks(ProductService.nameLink, 'api')}/${id}`);

      return {
        ...data?.data,
        retailPriceString: formatCurrency(data?.data?.productPrice?.[0]?.price, ' ').toString(),
        storeCodeProduct: data?.data?.product?.code ?? '',
        supplierBarcode: data?.data?.product?.barcode ?? '',
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  post: async (values) => {
    try {
      const { data } = await axios.post(routerLinks(ProductService.nameLink, 'api'), values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  put: async (values, id) => {
    try {
      const { data } = await axios.put(`${routerLinks(ProductService.nameLink, 'api')}/${id}`, values);
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
      const { data } = await axios.delete(`${routerLinks(ProductService.nameLink, 'api')}`, {
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

  getProductApproval: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(ProductService.nameLink, 'api')}/list/not-approved`, {
        params,
      });
      return {
        data: data?.data,
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  approveProduct: async (id) => {
    try {
      const { data } = await axios.put(`${routerLinks(ProductService.nameLink, 'api')}/approve/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  rejectProduct: async (id, values) => {
    try {
      const { data } = await axios.put(`${routerLinks(ProductService.nameLink, 'api')}/reject/${id}`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListApproveProduct: async (params) => {
    try {
      const { data } = await axios.get(routerLinks(ProductService.nameLink, 'api'), {
        params,
      });
      return {
        data: data?.data,
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  createProductNonBalance: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(ProductService.nameLink, 'api')}/non-bal`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  editProductNonBalance: async (values, id) => {
    try {
      const { data } = await axios.put(`${routerLinks(ProductService.nameLink, 'api')}/non-bal/${id}`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListSupplierOfStore: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('StoreSupplier', 'api')}/sub-org-in-store`, {
        params,
      });
      return {
        data: data?.data,
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getFileTemplate: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('file', 'api')}`, {
        params,
        responseType: 'blob',
      });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  readFileExcelProduct: async (values) => {
    try {
      const { data } = await axios.post(
        `${routerLinks(ProductService.nameLink, 'api')}/supplier/read/product-excel`,
        values,
      );
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  storereadFileExcelProduct: async (values) => {
    try {
      const { data } = await axios.post(
        `${routerLinks(ProductService.nameLink, 'api')}/store/read/product-excel`,
        values,
      );
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  createFileExcelProduct: async (values) => {
    try {
      const { data } = await axios.post(
        `${routerLinks(ProductService.nameLink, 'api')}/supplier/create/product-excel`,
        values,
      );
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  storecreateFileExcelProduct: async (values) => {
    try {
      const { data } = await axios.post(
        `${routerLinks(ProductService.nameLink, 'api')}/store/create/product-excel`,
        values,
      );
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
