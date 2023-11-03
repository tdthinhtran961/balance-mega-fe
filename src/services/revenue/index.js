import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const formatTime = (time, hour = true) => {
  const timer = new Date(time);
  const yyyy = timer.getFullYear();
  let mm = timer.getMonth() + 1; // Months start at 0!
  let dd = timer.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = dd + '/' + mm + '/' + yyyy;
  if (hour)
    return (
      new Date(time).getHours() +
      ':' +
      (new Date(time).getMinutes() < 10 ? '0' : '') +
      new Date(time).getMinutes() +
      ' - ' +
      formattedToday
    );

  return formattedToday;
};

export const RevenueService = {
  // nameLink: 'StoreSupplier',
  getStoreBySupplier: async (suppierId) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryOrder', 'api')}/store-by-suppier/${suppierId}`);
      return {
        data: data.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getRevenueOrder: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryOrder', 'api')}/revenue-list`, { params });
      const convertData = data?.data?.map((item, index) => ({
        ...item,
        index: params?.page > 1 ? (params?.page - 1) * 10 + index + 1 : index + 1,
        pickUpDate: item?.pickUpDate && formatTime(item?.pickUpDate, false),
        completedDate: item?.completedDate && formatTime(item?.completedDate, false),
        money: item?.total - item?.voucherAmount,
      }));
      // sumSubTotal: trước thuế
      // sumTotal: sau thuế
      // sumVoucherAmount: khuyến mãi
      //  sumMoney: thành tiền
      // const total = {
      //   sumSubTotal: 0,
      //   sumTotal: 0,
      //   sumVoucherAmount: 0,
      //   sumMoney: 0,
      // };
      return {
        data: convertData || [],
        statistical: data?.statistical,
        count: data?.pagination?.total,
        total: data?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getRevenueProduct: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryOrder', 'api')}/revenue-list-product`, { params });
      const convertData = data?.data?.map((item, index) => ({
        ...item,
        index: params?.page > 1 ? (params?.page - 1) * 10 + index + 1 : index + 1,
        pickUpDate: item?.pickUpDate && formatTime(item?.pickUpDate, false),
        completedDate: item?.completedDate && formatTime(item?.completedDate, false),
        money: item?.total - item?.voucherAmount,
      }));
      // sumSubTotal: trước thuế
      // sumTotal: sau thuế
      const total = {
        sumSubTotal: data?.total?.subTotal,
        sumTotal: data?.total?.total,
      };
      return {
        data: convertData || [],
        count: data?.pagination?.total,
        total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
