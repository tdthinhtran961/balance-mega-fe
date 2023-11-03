import axios from 'axios';
import { Message } from 'components';
import { routerLinks } from 'utils';

export const Unit = {
  nameLink: 'Unit',
  getUnitChild: async () => {
    try {
      const { data } = await axios.get(`${routerLinks(Unit.nameLink, "api")}/get-unit-child`);
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getUnitParentByChild: async (parentId) => {
    try {
      const { data } = await axios.get(`${routerLinks(Unit.nameLink, "api")}/get-parent?parentId=${parentId}`);
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
