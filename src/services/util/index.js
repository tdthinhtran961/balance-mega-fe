import axios from "axios";

import { routerLinks } from "utils";
import { Message } from "components";

export const UtilService = {
  nameLink: "Util",
  post: async (file,type) => {
    const bodyFormData = new FormData();
    bodyFormData.append('files', file);
    bodyFormData.append('type', type);
    try {
      const { data } = await axios.post(
        routerLinks(UtilService.nameLink, "api") +'/upload',
        bodyFormData
      );
      return data?.data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({text:e.response.data.message});
      return false;
    }
  },
}