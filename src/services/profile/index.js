import axios from 'axios';

import { routerLinks } from 'utils';
import { Message } from 'components';

export const ProfileService = {
  nameLink: 'User',

  get: async () => {
    try {
      const { data } = await axios.get(`${routerLinks(ProfileService.nameLink, 'api')}/get-my-info`);
      return {
        ...data?.data,
        street: data?.data?.address?.street,
        ward: data?.data?.address?.ward?.name,
        district: data?.data?.address?.district?.name,
        province: data?.data?.address?.province?.name,
        wardId: data?.data?.address?.ward?.id,
        districtId: data?.data?.address?.district?.id,
        provinceId: data?.data?.address?.province?.id,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  put: async (values) => {
    try {
      const { data } = await axios.put(`${routerLinks(ProfileService.nameLink, 'api')}`, values);
      if (data.message) Message.success(data.message);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  changePassword: async (values) => {
    try {
      const { data } = await axios.put(`${routerLinks(ProfileService.nameLink, 'api')}/update-password-my-acc`, values);
      if (data.message) Message.success(data.message);
      return data;
    } catch (e) {
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
  post: async (file, type) => {
    const bodyFormData = new FormData();
    bodyFormData.append('files', file);
    bodyFormData.append('type', type);
    try {
      const { data } = await axios.post('/util/upload', bodyFormData);
      return data?.data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
