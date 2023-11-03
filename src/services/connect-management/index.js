import axios from 'axios';
import { routerLinks, formatCurrency, formatTime } from 'utils';
import { Message } from 'components';

const convertAddress = (address) => {
  if (!address) return '';
  const street = address?.street ? address?.street + ', ' : '';
  const ward = address?.ward && address?.ward?.name ? address?.ward?.name + ', ' : '';
  const district = address?.district && address?.district?.name ? address?.district?.name + ', ' : '';
  const province = address?.province && address?.province?.name ? address?.province?.name + ', ' : '';
  const res = street + ward + district + province;
  if (res[res.length - 2] === ',') {
    return res.slice(0, -2);
  }
  return res;
};
// const priceSale = (item) => {
//   const indexPrice = item.productPrice.findIndex((ele) => ele.priceType === 'Giá bán lẻ');
//   if (indexPrice !== -1) {
//     return item.productPrice[indexPrice].price;
//   }
//   return 0;
// };
export const ConnectManagementService = {
  nameLink: 'ConnectManagement',
  storeRequest: 'StoreRequest',
  storeRequestSupplier: 'StoreRequestSupplier',
  storeConnectSupplier: 'StoreConnectSupplier',
  get: async (params) => {
    try {
      const { data } = await axios.get(routerLinks(ConnectManagementService.storeRequest, 'api'), { params });
      const listResult = data?.data?.map((request) => {
        return {
          ...request,
          detail: request?.description,
          requestDate: request?.requestedAt && formatTime(request?.requestedAt, true),
          approveDate: request?.approvedAt && formatTime(request?.approvedAt, true),
          storeName: request?.store.name,
        };
      });
      return {
        data: listResult,
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  getById: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(ConnectManagementService.storeRequest, 'api')}/${id}`);
      return {
        ...data.data,
        id,
        storeAddress: convertAddress(data.data?.store?.address),
        storeId: data.data?.store?.id,
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
        routerLinks(ConnectManagementService.storeRequest, 'api'),
        values.description ? values : { ...values, description: ' ' },
      );
      if (data.message)
        Message.success({
          text: 'Yêu cầu sản phẩm thành công. \nQuản trị viên sẽ xem xét yêu cầu của cửa hàng',
          title: 'Thành công',
          cancelButtonText: 'Đóng',
        });
      return true;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
      return false;
    }
  },

  getSupplier: async (param, id) => {
    try {
      if (id) {
        const { data } = await axios.get(`${routerLinks(ConnectManagementService.storeRequest, 'api')}/${id}`);
        return {
          data: data.data?.storeRequestSupplier.map((request) => {
            return {
              ...request,
              address: convertAddress(request?.supplier?.address),
              // idSupplier: request?.supplier?.id,
              idProduct: request?.product?.id,
              supplierName: request?.supplier?.name,
              userRole: request?.supplier?.userRole,
              pNumber: request?.supplier?.userRole[0]?.phoneNumber,
              // discountPrice: formatCurrency(request?.product?.capitalCost, ''),
              productName: request?.product?.name,
              // listedPrice: formatCurrency(request?.product?.price || 0, ''),
              listedPrice:
                request?.product &&
                request?.product?.productPrice &&
                request?.product?.productPrice.length > 0 &&
                formatCurrency(request?.product?.productPrice[0]?.price, ''),
              status: data.data?.status,
            };
          }),
        };
      }
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getByIdSupplier: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(ConnectManagementService.storeRequestSupplier, 'api')}/${id}`);
      return {
        data: data.data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getSupplierWithProduct: async (values, params, storeId) => {
    try {
      const { data } = await axios.get('product/list/list-for-connect', {
        params: {
          page: 1,
          perPage: params || 8,
          fullTextSearch: values && values.length > 0 ? values.trim() : '',
          storeId: parseInt(storeId),
        },
      });
      return {
        data: data.data,
        total: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  addRecommendSuppliers: async (values) => {
    try {
      const { data } = await axios.post(routerLinks(ConnectManagementService.storeRequestSupplier, 'api'), values);
      if (data.message)
        Message.success({
          text: 'Yêu cầu sản phẩm thành công. \nQuản trị viên sẽ xem xét yêu cầu của cửa hàng',
          title: 'Thành công',
          cancelButtonText: 'Đóng',
        });
      return true;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
      return false;
    }
  },
  storeAcceptSupplier: async (id) => {
    try {
      const { data } = await axios.put(
        `${routerLinks(ConnectManagementService.storeRequestSupplier, 'api')}/accept/${id}`,
      );
      if (data.message)
        Message.success({
          text: 'Kết nối thành công',
          title: 'Thành công',
          cancelButtonText: 'Đóng',
        });
      return true;
    } catch (e) {
      console.log('error', e);
      if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
      return false;
    }
  },
  adminRejectStore: async (values, id) => {
    try {
      const { data } = await axios.put(
        `${routerLinks(ConnectManagementService.storeRequest, 'api')}/reject/${id}`,
        values.note ? values : { ...values, note: ' ' },
      );
      if (data.message)
        Message.success({
          text: 'Hoàn tất từ chối phê duyệt',
          title: 'Thành công',
          cancelButtonText: 'Đóng',
        });
      // return true;
    } catch (e) {
      console.log('error', e);
      if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
      // return false;
    }
  },
  storeRejectSupplier: async (values) => {
    try {
      const { data } = await axios.put(
        `${routerLinks(ConnectManagementService.storeRequestSupplier, 'api')}/reject-all`,
        values.note ? values : { ...values, note: ' ' },
      );
      if (data.message)
        Message.success({
          text: 'Đã từ chối tất cả nhà cung cấp',
          title: 'Thành công',
          cancelButtonText: 'Đóng',
        });
      // return true;
    } catch (e) {
      console.log('error', e);
      if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
      // return false;
    }
  },
  adminApproveStore: async (id) => {
    try {
      const { data } = await axios.put(
        `${routerLinks(ConnectManagementService.storeRequestSupplier, 'api')}/accept-all`,
        { storeRequestId: parseInt(id) },
      );
      if (data.message)
        Message.success({
          text: 'Phê duyệt thành công',
          title: 'Thành công',
          cancelButtonText: 'Đóng',
        });
      return true;
    } catch (e) {
      console.log('error', e);
      if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
      return false;
    }
  },
  getConnectList: async (params) => {
    try {
      const { data } = await axios.get(routerLinks(ConnectManagementService.storeConnectSupplier, 'api'), { params });
      const listResult = data?.data?.map((request) => {
        return {
          ...request,
          detail: request?.description,
          requestDate:
            request?.storeRequestSupplier?.storeRequest?.requestedAt &&
            formatTime(request?.storeRequestSupplier?.storeRequest?.requestedAt, true),
          approveDate:
            request?.storeRequestSupplier?.storeRequest?.requestedAt &&
            formatTime(request?.storeRequestSupplier?.storeRequest?.approvedAt, true),
          storeName: request?.store?.name,
          productName: request?.storeRequestSupplierProduct[0]?.product?.name,
          code: request?.storeRequestSupplier?.storeRequest?.code,
          status: request?.storeRequestSupplier?.storeRequest?.status,
        };
      });
      return {
        data: listResult,
        count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  adminDeleteSuggestedSupplier: async (id) => {
    try {
      const { data } = await axios.delete(`${routerLinks(ConnectManagementService.storeRequestSupplier, 'api')}/${id}`);
      if (data.message)
        Message.success({
          text: 'Đã xóa đề xuất',
          title: 'Thành công',
          cancelButtonText: 'Đóng',
        });
      return true;
    } catch (e) {
      console.log('error', e);
      if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
      return false;
    }
  },
  getByIdConnect: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(ConnectManagementService.storeConnectSupplier, 'api')}/${id}`);
      return {
        ...data.data,
        storeAddress: convertAddress(data.data?.store?.address),
        code: data.data?.storeRequestSupplier?.storeRequest?.code,
        requestedAt: data.data?.storeRequestSupplier?.storeRequest?.requestedAt,
        approvedAt: data.data?.storeRequestSupplier?.storeRequest?.approvedAt,
        description: data.data?.storeRequestSupplier?.storeRequest?.description,
        productName: data.data?.storeRequestSupplierProduct[0]?.product?.name,
        status: data.data?.storeRequestSupplier?.storeRequest?.status,
        storePnumber: '08989812323',
        supplierPnumber: '012398123813',
        supplierAddress: convertAddress(data.data?.supplier?.address),
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  getPriceDetails: async (params, idProduct) => {
    try {
      if (idProduct) {
        const { data } = await axios.get(`/product/${idProduct}`);

        const listResult = data?.data?.productPrice?.map((request) => {
          return {
            id: request?.id,
            priceType: request?.priceType,
            minQuantity: request?.minQuantity,
            price: formatCurrency(request?.price || 0, ''),
            productId: request?.productId,
          };
        });
        return {
          data: listResult,
        };
      }
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getInforDetails: async (params, idProduct) => {
    try {
      if (idProduct) {
        const { data } = await axios.get(`/product/${idProduct}`);
        return {
          data: data.data,
        };
      }
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getContractBetweenStoreNSupplier: async () => {
    const dataTest = [
      {
        id: 1,
        code: 'HD001',
        approvedDate: '1/7/2022',
        storeName: 'Tân java',
        supplierName: 'Dũng babe',
        status: 'Ký thành công',
      },
      {
        id: 2,
        code: 'HD002',
        approvedDate: '1/8/2022',
        storeName: 'Nhựt white hat',
        supplierName: 'Dũng superman',
        status: 'Chờ ký',
      },
      {
        id: 3,
        code: 'HD003',
        approvedDate: '1/9/2022',
        storeName: 'Nhựt black hat',
        supplierName: 'Tân Nguyên',
        status: 'CH từ chối',
      },
    ];
    return {
      data: dataTest,
      count: 3,
    };
  },
};
