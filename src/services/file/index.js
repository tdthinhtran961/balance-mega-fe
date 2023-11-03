import axios from "axios";

import { routerLinks } from "utils";
import { Message } from "components";
import { linkApi } from "variable";

export const FileService = {
  nameLink: "file",

  // Edit by Thinh - Start
  /**
   * 
   * @param {*} fileType : Type of file
   * @returns : Url default image
   */
  getDefaultImage: async (fileType) => {
    try {
      const { data } = await axios.get(routerLinks(FileService.nameLink, 'api') + `/get-image-default?type=${fileType}`);
      return (linkApi + 'util/download/?key=' + data?.url);
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({text:e.response.data.message});
      return false;
    }
  }
  // Edit by Thinh - End
}