import axios from "axios";

import { routerLinks } from "utils";
import { Message } from "components";

export const TaxService = {
  nameLink: "Tax",
  get: async (params) => {
    try {
      const { data } = await axios.get(routerLinks(TaxService.nameLink, "api"), {
        params,
      });
      return {
        data: data?.data || [],
        count: data?.pagination?.total
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }

  },
  getAllTax: async (params) => {
    try {
      const { data } = await axios.get(routerLinks(TaxService.nameLink, "api") + '/get-all-tax', {
        params,
      });
      return {
        data: data?.data || [],
        count: data?.pagination?.total
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }

  },
  getById: async (id) => {
    try {
      const { data } = await axios.get(
        `${routerLinks(TaxService.nameLink, "api")}/${id}`
      );
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
      const { data } = await axios.post(
        routerLinks(TaxService.nameLink, "api"),
        values
      );
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

      const { data } = await axios.put(
        `${routerLinks(TaxService.nameLink, "api")}/${id}`,
        values
      );
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
      const { data } = await axios.delete(
        `${routerLinks(TaxService.nameLink, "api")}/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },


};
