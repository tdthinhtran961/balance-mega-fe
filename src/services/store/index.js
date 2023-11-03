import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
import moment from 'moment';
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

const convertAddress = (street, ward, district, province) => {
  if (street === undefined || street === null) {
    street = '';
  }

  if (ward === undefined || ward === null) {
    ward = '';
  } else {
    ward = ', ' + ward;
  }

  if (district === undefined || district === null) {
    district = '';
  } else {
    district = ', ' + district;
  }

  if (province === undefined || province === null) {
    province = '';
  } else {
    province = ', ' + province;
  }

  return street + ward + district + province;
};

const convertAddressNonBal = (address) => {
  if (!address) return '';
  const street = address?.street ? address?.street + ', ' : '';
  const ward = address?.wardName ? address?.wardName + ', ' : '';
  const district = address?.districtName ? address?.districtName + ', ' : '';
  const province = address?.provinceName ? address?.provinceName + ', ' : '';
  const res = street + ward + district + province;
  if (res[res.length - 2] === ',') {
    return res.slice(0, -2);
  }
  return res;
};
const convertAddressInBal = (address) => {
  if (!address) return '';
  const street = address?.street ? address?.street + ', ' : '';
  const ward = address?.ward?.name ? address?.ward?.name + ', ' : '';
  const district = address?.district?.name ? address?.district?.name + ', ' : '';
  const province = address?.province?.name ? address?.province?.name + ', ' : '';
  const res = street + ward + district + province;
  if (res[res.length - 2] === ',') {
    return res.slice(0, -2);
  }
  return res;
};

export const StoreService = {
  nameLink: 'StoreSupplier',
  getListSupplierForFilterProd: async (params, query) => {
    try {
      const { data } = await axios.get(`${routerLinks('StoreSupplier', 'api')}/${query}`, { params });
      return [...(data.data || [])];
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  get: async (params) => {
    try {
      const { data } = await axios.get(routerLinks(StoreService.nameLink, 'api'), {
        params,
      });

      const convertData = data?.data?.map((item) => ({
        ...item,
        address: convertAddress(
          item?.address?.street,
          item?.address?.ward?.name,
          item?.address?.district?.name,
          item?.address?.province?.name,
        ),
        manageName: item?.userRole?.[0]?.userAdmin?.name,
        managePhone: item?.userRole?.[0]?.userAdmin?.phoneNumber,
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
  getListSupplierNotInBal: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(StoreService.nameLink, 'api')}/sub-org-in-store`, { params });
      const listResult = data?.data?.map((supplier) => {
        return {
          ...supplier,
          supplierCode: supplier?.code,
          address: convertAddressNonBal(supplier?.address),
          supplierName: supplier?.name,
          managerName: supplier?.peopleContact?.name,
          phoneNumber: supplier?.peopleContact?.phoneNumber,
        };
      });
      return {
        data: listResult,
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListBrandBal: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(StoreService.nameLink, 'api')}/sub-org-in-store`, { params });
      const listResult = data?.data?.map((supplier) => {
        return {
          ...supplier,
          supplierCode: supplier?.code,
          address: convertAddressNonBal(supplier?.address),
          supplierName: supplier?.name,
          managerName: supplier?.peopleContact?.name,
          phoneNumber: supplier?.peopleContact?.phoneNumber,
        };
      });
      return {
        isBranch: data?.isBranch,
        data: listResult,
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListSupplier: async (params) => {
    try {
      const { data } = await axios.get(routerLinks(StoreService.nameLink, 'api'), {
        params,
      });

      const convertData = data?.data?.map((item) => ({
        ...item,
        manageName: item?.userRole?.[0]?.userAdmin?.name,
        managePhone: item?.userRole?.[0]?.userAdmin?.phoneNumber,
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
      const { data } = await axios.get(`${routerLinks(StoreService.nameLink, 'api')}/detail/${id}`);
      return {
        ...data,
        street: data?.address?.street,
        ward: data?.address?.ward?.id,
        district: data?.address?.district?.id,
        province: data?.address?.province?.id,
        // wardId: data?.address?.ward?.id,
        // districtId: data?.address?.district?.id,
        // provinceId: data?.address?.province?.id,
        provinceCode: data?.address?.province?.code,
        districtCode: data?.address?.district?.code,
        idManager: data?.userRole?.[0]?.userAdmin?.id,
        emailContact: data?.userRole?.[0]?.userAdmin?.email,
        nameContact: data?.userRole?.[0]?.userAdmin?.name,
        phoneNumber: data?.userRole?.[0]?.userAdmin?.phoneNumber,

        client_id: data?.informationConnect?.clientId,
        client_secret: data?.informationConnect?.clientSecret,
        retailer: data?.informationConnect?.retailer,
        branchId: data?.informationConnect?.branchId,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  post: async (values) => {
    try {
      const { data } = await axios.post(routerLinks(StoreService.nameLink, 'api'), values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message)
        Message.error({ text: e.response.data.message, title: 'Thất bại', cancelButtonText: 'Đóng' });
      return false;
    }
  },

  put: async (id, values) => {
    try {
      const { data } = await axios.put(`${routerLinks(StoreService.nameLink, 'api')}/${id}`, values);
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
      const { data } = await axios.delete(`${routerLinks(StoreService.nameLink, 'api')}`, { data: { listId: values } });
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  activeStore: async (id, values) => {
    try {
      const { data } = await axios.put(`${routerLinks(StoreService.nameLink, 'api')}/${id}/active-status`, values);

      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getConnectSupplier: async (params) => {
    const values = { ...params };
    try {
      const { data } = await axios.get(`${routerLinks('ConnectStoreSupplier', 'api')}/store-list/${values?.id}`, {
        params: values,
      });

      const convertData = data?.data?.map((item) => ({
        ...item,
        product: item?.product?.name,
        supplier: item?.supplier?.name,
      }));

      return {
        data: convertData || [],
        count: data?.pagination?.total || 0,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  getConnectSupplierById: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks('ConnectStoreSupplier', 'api')}/${id}`);
      const convertData = {
        ...data?.data,
        supplierId: data?.data?.supplier?.id,
        product: data?.data?.product?.name,
        supplier: data?.data?.supplier?.name,
      };
      return {
        data: convertData,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  deleteConnectSupplierById: async (id) => {
    try {
      const { data } = await axios.put(`${routerLinks('ConnectStoreSupplier', 'api')}/cancel/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  updateConnectSupplier: async (values, id) => {
    delete values.product;
    delete values.supplier;
    try {
      const { data } = await axios.put(`${routerLinks('ConnectStoreSupplier', 'api')}/admin-approve/${id}`, values);

      return {
        data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListManager: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('User', 'api')}/list-manager`, {
        params,
      });
      return {
        data: data?.data,
      };
    } catch (e) {
      console.log(e);
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
  getDetailListProduct: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('Product', 'api')}`, {
        params,
      });

      const convertData = data?.data?.map((item, index) => ({
        ...item,
        index: index + 1,
        retailPrice: params.type === 'BALANCE' ? item?.productPrice?.[0]?.price : item?.price,
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
  getDetailListConnectSupplier: async (params, idStore) => {
    try {
      const { data } = await axios.get(`${routerLinks('StoreConnectSupplier', 'api')}/supplier`, {
        params,
      });
      const convertData = data?.data?.map((item) => ({
        ...item,
        supplierCode: item?.supplier?.code,
        supplierName: item?.supplier?.name,
        address: convertAddressInBal(item?.supplier?.address),
        managerName: item?.supplier?.userRole[0]?.userAdmin.name,
        phoneNumber: item?.supplier?.userRole[0]?.userAdmin.phoneNumber,
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
  getListRevenueByProduct: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InvoiceKiotViet', 'api')}`, {
        params,
      });
      const convertData = data?.data?.list.map((item, index) => ({
        ...item,
        index: params?.page > 1 ? (params?.page - 1) * 10 + index + 1 : index + 1,
      }));
      return {
        data: convertData,
        count: data?.pagination?.total,
        total: data?.total
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  activeStoreHaveOrder: async (values, id) => {
    try {
      const { data } = await axios.put(
        `${routerLinks(StoreService.nameLink, 'api')}/${id}/active-order-status`,
        values,
      );
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (error) {
      console.log('Lỗi:', error);
      if (error.response.data.message) Message.error({ text: error.response.data.message });
      return false;
    }
  },
  getListInventoryManagement: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryProduct', 'api')}`, {
        params,
      });
      const converntData = data?.data?.inventory
      return {
        data: converntData || [],
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListRevenueByOrder: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InvoiceKiotViet', 'api')}/invoice`, {
        params,
      });
      console.log('data?.data?.list', data?.data?.list);
      const convertData = data?.data?.list?.map((item, index) => ({
        ...item,
        index: params?.page > 1 ? (params?.page - 1) * 10 + index + 1 : index + 1,
        completedDate: formatTime(item?.completedDate, false),
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
  getListRevenueByOrderAdmin: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InvoiceKiotViet', 'api')}/invoice`, {
        params,
      });
      const convertData = data?.data?.list?.map((item, index) => ({
        ...item,
        index: params?.page > 1 ? (params?.page - 1) * 10 + index + 1 : index + 1,
        completedDate: moment(item?.completedDate).utc().format('L'),
      }));
      return {
        data: convertData || [],
        count: data?.pagination?.total,
        total: data?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getRevenueAllowedOrder: async (params) => {
    try {
      // const { data } = await axios.get(routerLinks(StoreService.nameLink, 'api'), {
      //   params,
      // });

      return {
        data: [{ code: 'ĐH000000001', sellDate: '11/08/2022', value: '20.000.000' }],
        // count: data?.pagination?.total,
      };
      // eslint-disable-next-line no-unreachable
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getOrderDetailList: async (params) => {
    try {
      // const { data } = await axios.get(routerLinks(StoreService.nameLink, 'api'), {
      //   params,
      // });

      return {
        data: [{ index: '1', itemType: 'Thịt', amount: '2000', singlePrice: '1000', totalPrice: '2000000' }],
        // count: data?.pagination?.total,
      };
      // eslint-disable-next-line no-unreachable
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getDetailRevenueByOrder: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks('InvoiceKiotViet', 'api')}/${id}`);

      const convertData = { ...data.data, completedDate: formatTime(data?.data?.completedDate, false) };

      return { data: convertData };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  asyncWithKioViet: async (id) => {
    try {
      const { data } = await axios.put(`${routerLinks('InventoryProduct', 'api')}/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListBranch: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InformationConnect', 'api')}/branch-list`, {
        params,
      });
      const converntData = data?.data?.map((i) => ({ ...i, id: String(i.id) }));
      if (data.mesage) Message.success({ text: data.mesage, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return {
        data: converntData,
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListBranchNoNotice: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InformationConnect', 'api')}/branch-list`, {
        params,
      });
      const converntData = data?.data?.map((i) => ({ ...i, id: String(i.id) }));
      return {
        data: converntData,
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getCategory: async (params) => {
    try {
      const { data } = await axios.get(routerLinks('Category', 'api'), {
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
  activeBranch: async (id, params) => {
    try {
      const { data } = await axios.put(`${routerLinks('StoreSupplier', 'api')}/active-organizaion/${id}`, params);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
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
};
