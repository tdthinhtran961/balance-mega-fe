import axios from 'axios';
import { Message } from 'components';
import { linkApi } from 'variable';
export const KiotViet = {
  sync: async () => {
    console.log('routerLinks', linkApi);
    const cronjob =
      linkApi === 'http://api.stag.balance.ari.com.vn/api/v1/supermarket/'
        ? 'http://api.stag.balance.ari.com.vn/api/v1/cronjob/'
        : linkApi === 'http://api.uat.balance.ari.com.vn/api/v1/supermarket/'
        ? 'http://api.uat.balance.ari.com.vn/api/v1/cronjob/'
        : 'https://api.balance.ari.com.vn/api/v1/cronjob/';

    try {
      const { data } = await axios.get(`${cronjob}cron-job/import-category-for-kiot`);
      return data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) {
        Message.error({ text: e.response.data.message, title: 'Thất bại', cancelButtonText: 'Đóng' });
      } else {
        Message.error('Có lỗi xảy ra trong quá trình đăng nhập');
      }
      return false;
    }
  },
};
