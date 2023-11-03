import axios from 'axios';
import { formatCurrency, routerLinks } from 'utils';
import { Message } from 'components';
import moment from 'moment';
// import { data } from 'autoprefixer';a

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

const formatTime = (time, hour = true) => {
  const timer = new Date(time);
  const yyyy = timer.getFullYear();
  let mm = timer.getMonth() + 1; // Months start at 0!
  let dd = timer.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = dd + '/' + mm + '/' + yyyy;
  if (hour)
    return (
      formattedToday +
      ' - ' +
      new Date(time).getHours() +
      ':' +
      (new Date(time).getMinutes() < 10 ? '0' : '') +
      new Date(time).getMinutes()
    );

  return formattedToday;
};

export const SupplierService = {
  nameLink: 'StoreSupplier',
  product: 'Product',
  user: 'User',
  connectSupplierStore: 'ConnectStoreSupplier',
  order: 'OrderManagement',
  connectContract: 'ConnectContract',
  util: 'Util',
  fileDocContract: 'FileDocContract',
  commission: 'Commission',
  commissionPayment: 'CommissionPayment',
  commissionLine: 'CommissionLine',
  storeConnectSupplier: 'StoreConnectSupplier',
  inventoryOrder: 'InventoryOrder',

  storeDisconnectNonBalSupplier: async (params) => {
    try {
      const { data } = await axios.post(`${routerLinks(SupplierService.storeConnectSupplier, 'api')}/disconnect`, {
        ...params,
      });
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message)
        Message.error({ text: e.response.data.message, title: 'Thất bại', cancelButtonText: 'Đóng' });
      return false;
    }
  },

  downloadWhenCreateWithKey: async (disposalNoteKey) => {
    try {
      const { data } = await axios.get(`${routerLinks('Util', 'api')}/download?key=${disposalNoteKey}`, {
        responseType: 'blob',
      });
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  exportBillCombineCreating: async (id, paymentSupplier) => {
    try {
      const body = {
        paymentSupplier: paymentSupplier
      }
      const { data } = await axios.post(`${routerLinks('OrderManagement', 'api')}/print-receiving-note/${id}`, body);
      if (data.mesage) Message.success({ text: data.mesage, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message)
        Message.error({ text: e.response.data.message, title: 'Thất bại', cancelButtonText: 'Đóng' });
      return false;
    }
  },
  get: async (params) => {
    try {
      const { data } = await axios.get(routerLinks(SupplierService.nameLink, 'api'), { params });
      const listResult = data?.data?.map((supplier) => {
        return {
          ...supplier,
          address: convertAddress(supplier?.address),
          supplierName: supplier?.name,
          managerName: supplier?.userRole[0]?.userAdmin?.name,
          phoneNumber: supplier?.userRole[0]?.userAdmin?.phoneNumber,
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
  getNonBalSupplierOfStore: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.nameLink, 'api')}/sub-org-in-store`, { params });
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
  getDetailListConnectSupplier: async (params, idStore) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.storeConnectSupplier, 'api')}/supplier`, {
        params,
      });
      const convertData = data?.data?.map((item) => ({
        ...item,
        supplierCode: item?.supplier?.code,
        supplierName: item?.supplier?.name,
        address: convertAddress(item?.supplier?.address),
        managerName: item?.supplier?.userRole[0]?.userAdmin.name,
        phoneNumber: item?.supplier?.userRole[0]?.userAdmin.phoneNumber,
        // requestedAt: item?.storeRequestSupplier?.storeRequest?.requestedAt === null ? '' : new Date(item?.storeRequestSupplier?.storeRequest?.requestedAt).toLocaleDateString(),
        // approvedAt: item?.storeRequestSupplier?.storeRequest?.approvedAt === null ? '' : new Date(item?.storeRequestSupplier?.storeRequest?.approvedAt).toLocaleDateString(),
        // supplierName: item?.supplier?.name,
        // name: item?.storeRequestSupplierProduct?.[0]?.product?.name
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
  getSupplierListWithOrder: async () => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.nameLink, 'api')}/supplier-order`);
      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getStoreListWithOrder: async () => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.nameLink, 'api')}/store-order`);
      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getStoreListForStore: async () => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.nameLink, 'api')}/list-store`);
      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getById: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.nameLink, 'api')}/detail/${id}`);
      return {
        ...data,
        address: data?.address?.street,
        ward: data?.address?.ward?.id,
        district: data?.address?.district?.id,
        province: data?.address?.province?.id,
        // wardId: data?.address?.ward?.id,
        // districtId: data?.address?.district?.id,
        // provinceId: data?.address?.province?.id,
        provinceCode: data?.address?.province?.code,
        districtCode: data?.address?.district?.code,
        idManager: data?.userRole?.[0]?.userAdmin?.id,
        email: data?.userRole?.[0]?.userAdmin?.email,
        manageName: data?.userRole[0]?.userAdmin?.name,
        managePhone: data?.userRole[0]?.userAdmin?.phoneNumber,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getByIdNonBal: async (idSupplier, storeId) => {
    try {
      const { data } = await axios.get(
        `${routerLinks(SupplierService.nameLink, 'api')}/suplier-non-bal/${idSupplier}?storeId=${storeId}`,
      );

      const res = data.data;
      return {
        ...res,
        address: res?.address?.street,
        ward: res?.address?.wardId,
        district: res?.address?.districtId,
        province: res?.address?.provinceId,
        // wardId: res?.address?.ward?.id,
        // districtId: res?.address?.district?.id,
        // provinceId: res?.address?.province?.id,
        provinceCode: res?.address?.provinceCode,
        districtCode: res?.address?.districtCode,

        email: res?.peopleContact?.email,
        manageName: res?.peopleContact?.name,
        managePhone: res?.peopleContact?.phoneNumber,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getByIdInBal: async (storeId) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.storeConnectSupplier, 'api')}/${storeId}`);
      const res = data.data;
      return {
        ...res,
        address: res?.supplier?.address?.street,
        ward: res?.supplier?.address?.ward.name,
        district: res?.supplier?.address?.district.name,
        province: res?.supplier?.address?.province.name,
        // wardId: res?.address?.ward?.id,
        // districtId: res?.address?.district?.id,
        // provinceId: res?.address?.province?.id,
        provinceCode: res?.address?.province?.code,
        districtCode: res?.address?.district?.code,
        name: res?.supplier?.name,
        email: res?.supplier?.userRole[0]?.userAdmin?.email,
        manageName: res?.supplier?.userRole[0]?.userAdmin?.name,
        managePhone: res?.supplier?.userRole[0]?.userAdmin?.phoneNumber,
        code: res?.supplier?.code,
        fax: res?.supplier?.fax,
        note: res?.supplier?.note,
        requestCode: res?.storeRequestSupplier?.storeRequest?.code,
        productName: res?.storeRequestSupplier?.storeRequest?.productName,
        requestDate: new Date(res?.storeRequestSupplier?.storeRequest?.requestedAt).toLocaleDateString(),
        approvedDate: new Date(res?.storeRequestSupplier?.storeRequest?.approvedAt).toLocaleDateString(),
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  postImportProduct: async (values) => {
    const dataImport = values.map((ele) => {
      return {
        productId: ele?.productId,
        quantity: ele?.amount,
      };
    });

    const datat = dataImport.filter((ele) => ele.quantity !== undefined && ele.quantity > 0);
    if (datat.length === 0) {
      Message.error({
        text: 'Vui lòng nhập hàng',
        title: 'Thất bại',
        cancelButtonText: 'Đóng',
      });
      return false;
    } else {
      try {
        const { data } = await axios.post(
          `${routerLinks(SupplierService.order, 'api')}/import-goods/${values[0].orderId}`,
          datat,
        );

        if (data.message) Message.success({ text: data.message, title: 'Thành công', cancelButtonText: 'Đóng' });
        return true;
      } catch (e) {
        console.log('error', e);
        if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
        return false;
      }
    }
  },
  putImportProduct: async (values) => {
    if (values.data.updatedReason === null) {
      Message.error({ text: 'Vui lòng nhập lý do chỉnh sửa' });
      return;
    }
    const dataNew = [
      {
        productId: values?.record?.productId,
        quantity: +values?.data?.quantity,
        updatedReason: values?.data?.updatedReason,
      },
    ];
    try {
      const { data } = await axios.put(
        `${routerLinks(SupplierService.order, 'api')}/import/update-quantity-goods/${values?.record?.orderPhaseId}`,
        dataNew,
      );
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  // putExportBill
  putExportBill: async (id) => {
    try {
      const { data } = await axios.put(`${routerLinks(SupplierService.order, 'api')}/export-bill/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  // postPrintPurchaseOrder
  printPurchaseOrder: async (id) => {
    try {
      const { data } = await axios.post(`${routerLinks(SupplierService.order, 'api')}/print-purchase-order/${id}`);
      const purchaseOrderKey = data?.data?.key;
      try {
        const { data } = await axios.get(
          `${routerLinks(SupplierService.util, 'api')}/download?key=${purchaseOrderKey}`,
          {
            responseType: 'blob',
          },
        );
        return data;
      } catch (e) {
        console.log('error', e);
        if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
        return false;
      }
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  printPurchaseOrderTemp: async (id) => {
    try {
      const { data } = await axios.post(
        `${routerLinks(SupplierService.order, 'api')}/print-receiving-note-temporary/${id}`,
      );
      const purchaseOrderKey = data?.data?.key;
      try {
        const { data } = await axios.get(
          `${routerLinks(SupplierService.util, 'api')}/download?key=${purchaseOrderKey}`,
          {
            responseType: 'blob',
          },
        );
        return data;
      } catch (e) {
        console.log('error', e);
        if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
        return false;
      }
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  // print-receiving-note-temporary
  deleteProduct: async (values) => {
    const objectDelete = {
      orderPhaseId: +values?.orderPhaseId,
      orderLineItemPhaseId: +values?.orderLineItemPhaseId,
    };
    try {
      const { data } = await axios.delete(`${routerLinks(SupplierService.order, 'api')}/delete/import-goods`, {
        data: objectDelete,
      });
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  post: async (values) => {
    try {
      const { data } = await axios.post(routerLinks(SupplierService.nameLink, 'api'), values);
      if (data.message) Message.success({ text: data.message, title: 'Thành công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log('error', e);
      if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
      return false;
    }
  },
  // postNonBal: async (values) => {
  //   try {
  //     const { data } = await axios.post(`${routerLinks(SupplierService.nameLink, 'api')}/non-bal`, values);
  //     if (data.message) Message.success({ text: data.message, title: 'Thành công', cancelButtonText: 'Đóng' });
  //     return true;
  //   } catch (e) {
  //     console.log('error', e);
  //     if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
  //     return false;
  //   }
  // },
  put: async (values, id) => {
    if (
      values.name.code?.trim().length === 0 ||
      values.name?.trim().length === 0 ||
      values.address.street?.trim().length === 0 ||
      // values.address.street?.trim().length === 0 ||
      // values.address.street?.trim().length === 0 ||
      // values.address.street?.trim().length === 0 ||
      values?.note?.length > 500
    )
      return;
    try {
      const { data } = await axios.put(`${routerLinks(SupplierService.nameLink, 'api')}/${id}`, values);
      if (data.mesage || data.message)
        Message.success({ text: data.mesage || data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.mesage || e.response.data.message)
        Message.error({ text: e.response.data.mesage || e.response.data.message });
      return false;
    }
  },
  // putNonBal: async (values, id) => {
  //   try {
  //     const { data } = await axios.put(`${routerLinks(SupplierService.nameLink, 'api')}/non-bal/${id}`, values);

  //     if (data.mesage) Message.success({ text: data.mesage, title: 'Thành công', cancelButtonText: 'Đóng' });
  //     return data;
  //   } catch (e) {
  //     console.log('error', e);
  //     if (e.response.data.message || e.response.data.mesage)
  //       Message.error({ text: e.response.data.message || e.response.data.mesage, title: 'Thất bại' });
  //     return false;
  //   }
  // },
  delete: async (values) => {
    try {
      const { data } = await axios.delete(`${routerLinks(SupplierService.nameLink, 'api')}`, {
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
  getGoodsList: async (values) => {
    try {
      const { data } = await axios.get(routerLinks(SupplierService.product, 'api'), { params: values });
      const listResult = data?.data?.map((productItem, index) => {
        return {
          ...productItem,
          index: index + 1,
          code: productItem?.code,
          productName: productItem?.name,
          categoryName: productItem?.category,
          category: productItem?.productCategory[0]?.category?.name,
          retailPrice: formatCurrency(productItem?.productPrice[0]?.price, ''),
          amount: productItem?.stockQuantity,
          status: productItem?.approveStatus,
        };
      });
      return {
        data: listResult,
        count: data?.pagination?.total,
      };
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  getProductById: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.product, 'api')}/${id}`);
      return {
        ...data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getOrderManagement: async (values) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.order, 'api')}`, { params: values });
      const listResult = data?.data?.map((orderItem) => {
        return {
          ...orderItem,
          orderCode: orderItem?.code,
          storeName: orderItem?.store?.name,
          reciever: orderItem?.storeAdmin?.name,
          deliveryAddress: convertAddress(orderItem?.store?.address),
          totalPrice: formatCurrency(orderItem?.total, ''),
          orderDate: formatTime(orderItem?.createdAt, false),
          status: orderItem?.status,
          supplierName: orderItem?.supplier?.name,
          pickUpAddress: convertAddress(orderItem?.store?.address),
        };
      });
      return {
        data: listResult,
        count: data?.pagination?.total,
      };
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.log(error);
    }
  },
  getPromotionOrderList: async (values) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.order, 'api')}/promotion/get-list`, {
        params: values,
      });
      const listResult = data?.data?.map((orderItem) => {
        return {
          ...orderItem,
          orderCode: orderItem?.code,
          storeName: orderItem?.storeName,
          // reciever: orderItem?.storeAdmin?.name,
          deliveryAddress: orderItem?.importedAddress?.street,
          totalPrice: formatCurrency(orderItem?.totalPrice, ''),
          orderDate: formatTime(orderItem?.importedAt, false),
          status: orderItem?.importedStatus,
          supplierName: orderItem?.supplierName,
          // pickUpAddress: convertAddress(orderItem?.store?.address),
        };
      });
      return {
        data: listResult,
        count: data?.pagination?.total,
      };
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.log(error);
    }
  },
  getDisposalGoodsList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryOrder', 'api')}`, {
        params,
      });
      const convertData = data?.data.map((item) => ({
        ...item,
        disposalDate: moment(item?.issuedAt).format('DD/MM/YYYY'),
        disposalCode: item?.code,
        disposalStatus: item?.status,
        storeName: item?.storeName,
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
  getDetailDisposalGoods: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryOrder', 'api')}/${id}`);
      console.log(data);
      const converData = {
        ...data?.data,
        // importedAddress: data?.data?.importedAddress?.street,
        // issuedAt: moment(data?.data?.issuedAt),
      };
      return {
        ...converData,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getDetailReturnGoods: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryOrder', 'api')}/${id}`);
      const converData = {
        ...data?.data,
        // importedAddress: data?.data?.importedAddress?.street,
        // issuedAt: moment(data?.data?.issuedAt),
      };
      return {
        ...converData,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getReturnGoodsList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryOrder', 'api')}`, {
        params,
      });
      const convertData = data?.data.map((item) => ({
        ...item,
        ReturnDate: moment(item?.issuedAt).format('DD/MM/YYYY'),
        ReturnCode: item?.code,
        ReturnStatus: item?.status,
        storeName: item?.storeName,
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
  getConnectedStoreList: async (params) => {
    try {
      const { data } = await axios.get(
        `${routerLinks(SupplierService.connectSupplierStore, 'api')}/store-list/${params.supplierId}`,
        { params },
      );

      const connectedList = data?.data?.map((store) => {
        return {
          ...store,
          storeCode: store?.store?.id,
          productCategory: store?.product?.name,
          storeName: store?.store?.name,
          orderedAmount: store?.numberDeposit,
          successfulOrder: store?.numberBillSuccess,
          totalTransactionValue: store?.priceBill,
        };
      });
      return {
        data: connectedList,
        count: data?.pagination?.total,
      };
      // return {
      //   data: [{}],
      // };
      // eslint-disable-next-line no-unreachable
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  activeSupplier: async (values, id) => {
    try {
      const { data } = await axios.put(`${routerLinks(SupplierService.nameLink, 'api')}/${id}/active-status`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.data.message) Message.error({ text: error.response.data.message });
      return false;
    }
  },
  activeSupplierHaveOrder: async (values, id) => {
    try {
      const { data } = await axios.put(
        `${routerLinks(SupplierService.nameLink, 'api')}/${id}/active-order-status`,
        values,
      );
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (error) {
      console.log(error);
      if (error.response.data.message) Message.error({ text: error.response.data.message });
      return false;
    }
  },
  getEmailList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.user, 'api')}/list-manager`, { params });
      const listResult = data?.data?.map((supplier) => {
        return {
          ...supplier,
          supplierName: supplier?.name,
          phoneNumber: supplier?.phoneNumber,
        };
      });
      return {
        data: listResult,
        count: data?.pagination?.total,
      };
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  getRevenueSupplier: async (idSupplier, params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.order, 'api')}/renueve/${idSupplier}`, {
        params: {
          ...params,
          // status: 'DELIVERED',
        },
      });
      const listResult = data?.data?.map((supplier) => {
        return {
          ...supplier,
          orderCode: supplier?.code,
          orderDate: supplier?.createdAt ? formatTime(supplier?.createdAt, false) : '',
          storeName: supplier?.store?.name,
          pickupDate: supplier?.pickupAt ? formatTime(supplier?.pickupAt, false) : '',
          totalPrice: formatCurrency(supplier?.total, ''),
          deliveredDate: supplier?.deliveredAt ? formatTime(supplier?.deliveredAt, false) : '',
        };
      });
      return {
        data: listResult,
        count: data?.pagination?.total,
      };
    } catch (error) {
      console.log(error);
    }
  },
  getRevenueSupplierReturnOrder: async (idSupplier, params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.inventoryOrder, 'api')}/return-good/list`, {
        params: {
          ...params,
          // status: 'DELIVERED',
        },
      });
      const listResult = data?.data?.map((supplier) => {
        return {
          ...supplier,
          returnCode: supplier?.code,
          returnDate: supplier?.issuedAt ? formatTime(supplier?.issuedAt, false) : '',
          totalPrice: formatCurrency(supplier?.totalPrice, ''),
          billCode: supplier?.billCode,
        };
      });
      return {
        data: listResult,
        count: data?.pagination?.total,
      };
    } catch (error) {
      console.log(error);
    }
  },

  getDiscountSupplier: async (idSupplier, params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.commission, 'api')}/${idSupplier}`, { params });
      const listResult = data?.data?.data?.map((discount) => {
        return {
          ...discount,
          timeRange: `${formatTime(discount?.datefrom, false)} -  ${formatTime(discount?.dateto, false)}`,
          discountPrice: discount?.commision !== null ? formatCurrency(discount?.commision, '') : 0,
          payedTotal: discount?.paid !== null ? formatCurrency(discount?.paid, '') : 0,
          unpaidTotal: discount?.noPay !== null ? formatCurrency(discount?.noPay, '') : 0,
          status: discount?.status,
        };
      });
      return {
        data: listResult,
        count: data?.pagination?.total,
      };
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.log(error);
    }
  },
  getDiscountSupplierAdmin: async (idSupplier, params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.commission, 'api')}/${idSupplier}`, { params });
      const listResult = data?.data?.data?.map((discount, index) => {
        return {
          index: params?.page > 1 ? (params?.page - 1) * 10 + index + 1 : index + 1,
          ...discount,
          timeRange: `${moment(discount?.datefrom).utc().format('MM/YYYY')} -  ${moment(discount?.dateto)
            .utc()
            .format('MM/YYYY')}`,
          discountPrice: discount?.commision !== null ? discount?.commision : 0,
          payedTotal: discount?.paid !== null ? discount?.paid : 0,
          unpaidTotal: discount?.noPay !== null ? discount?.noPay : 0,
          status: discount?.status,
        };
      });
      const total = {
        sumDiscountPrice: data?.total?.totalCommission, // chiết khấu
        sumPayedTotal: data?.total?.totalPaid, // đã thanh toán
        sumUnpaidTotal: data?.total?.totalNopay, // chưa thanh toán
      };
      // const totalCommissionSupplier = 1000; // Chiết khấu cần thanh toán
      return {
        data: listResult,
        count: data?.pagination?.total,
        total,
        totalCommissionSupplier: data?.data?.totalCommissionSupplier,
      };
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.log(error);
    }
  },
  getTotalDiscountOfSupplier: async (idSupplier, params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.commission, 'api')}/${idSupplier}`, { params });
      return {
        data: data.data,
        count: data?.pagination?.total,
      };
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.log(error);
    }
  },

  getDiscountDetail: async (idCommission) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.commission, 'api')}/detail/${idCommission}`);
      return {
        data: data?.data,
        count: data?.pagination?.total,
      };
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.log(error);
    }
  },

  getDiscountPaymentList: async (idCommission) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.commission, 'api')}/detail/${idCommission}`);
      const listResult = data?.data?.subOrgCommisionPayment.map((payment) => {
        return {
          ...payment,
          paymentCode: payment?.code,
          paymentDate: formatTime(payment?.createdAt, false),
          payedTotal: formatCurrency(payment?.commisionMoney, ''),
          method: payment?.paymentMethod,
        };
      });
      return {
        data: listResult,
        count: data?.pagination?.total,
      };
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.log(error);
    }
  },

  getDetailPayMentCommission: async (idPayment) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.commissionPayment, 'api')}/${idPayment}`);
      console.log(data);
      return {
        data,
      };
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.log(error);
    }
  },

  getDiscountOrderList: async (params, idCommission) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.commissionLine, 'api')}/${idCommission}`, params);
      console.log(data);
      const listResult = data?.data?.map((product, i) => {
        return {
          ...product,
          index: i + 1,
          productCode: product?.product?.code,
          productName: product?.product?.name,
          amount: product?.quantity,
          unit: product?.product?.basicUnit,
          revenue: formatCurrency(product?.revenueCommission, ''),
          discountTotal: formatCurrency(product?.commisionMoney, ''),
          discountType: product?.product?.balancePriceType,
        };
      });
      return {
        data: listResult,
        count: data?.pagination?.total,
      };
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      console.log(error);
    }
  },

  createCommissionPayment: async (values) => {
    try {
      const { data } = await axios.post(routerLinks(SupplierService.commissionPayment, 'api'), values);
      if (data.message) Message.success({ text: data.message, title: 'Thành công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log('error', e);
      if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
      return false;
    }
  },

  AdminReceivedPayment: async (values, idCommission) => {
    try {
      const { data } = await axios.put(
        `${routerLinks(SupplierService.commissionPayment, 'api')}/${idCommission}`,
        values,
      );
      console.log(data);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  GetOrder: async (params) => {
    try {
      const { data } = await axios.get(routerLinks(SupplierService.order, 'api'), { params });
      const listResult = data?.data?.map((order) => {
        return {
          ...order,
          id: order?.id,
          storeName: order?.store?.name,
          orderCode: order?.code,
          totalPrice: formatCurrency(order?.total, ''),
          supplierName: order?.supplier.name,
          pickUpAddress: convertAddress(order?.store.address),
          orderDate: order?.createdAt !== null ? formatTime(order?.createdAt, false) : '',
          confirmAt: order?.confirmAt !== null ? formatTime(order?.confirmAt, false) : '',
          pickupAt: order?.pickupAt !== null ? formatTime(order?.pickupAt, false) : '',
          deliveredAt: order?.deliveredAt !== null ? formatTime(order?.deliveredAt, false) : '',
          cancelledAt: order?.cancelledAt !== null ? formatTime(order?.cancelledAt, false) : '',
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
  getDetailGoodsById: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.order, 'api')}/${id}`);
      return {
        data: { ...data?.data, addressConvert: convertAddress(data?.data?.store?.address) },
        // count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  getDetailGoodsByCode: async (code) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.order, 'api')}/promotion/${code}`);
      return {
        data: data.returnData,
        // count: data?.pagination?.total,
      };
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  getShippingOrder: async (params) => {
    try {
      const { data } = await axios.get(routerLinks(SupplierService.order, 'api'), { params });
      const listResult = data?.data?.map((order) => {
        return {
          ...order,
          id: order?.id,
          storeName: order?.store?.name,
          orderCode: order?.code,
          totalPrice: order?.total,
          orderDate: new Date(order?.createdAt).toLocaleDateString(),
          pickUpDate: new Date(order?.deliveredAt).toLocaleDateString(),
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
  getSuccessfullyDeliveredOrder: async (params) => {
    try {
      const { data } = await axios.get(routerLinks(SupplierService.order, 'api'), { params });
      const listResult = data?.data?.map((order) => {
        return {
          ...order,
          id: order?.id,
          storeName: order?.store?.name,
          orderCode: order?.code,
          totalPrice: order?.total,
          orderDate: new Date(order?.createdAt).toLocaleDateString(),
          recievedDate: new Date(order?.deliveredAt).toLocaleDateString(),
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
  getCancelOrder: async (params) => {
    try {
      const { data } = await axios.get(routerLinks(SupplierService.order, 'api'), { params });

      const listResult = data?.data?.map((order) => {
        return {
          ...order,
          id: order?.id,
          storeName: order?.store?.name,
          orderCode: order?.code,
          totalPrice: order?.total,
          orderDate: new Date(order?.createdAt).toLocaleDateString(),
          cancelDate: new Date(order?.cancelledAt).toLocaleDateString(),
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
  confirmOrder: async (id, orderCount) => {
    const updateOrderCountTest = {
      updateOrderCount: orderCount
    }
    try {
      const { data } = await axios.put(`${routerLinks(SupplierService.order, 'api')}/confirm-order/${id}`, updateOrderCountTest);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (error) {
      console.log('Lỗi:', error);
      if (error.response.data.message) Message.error({ text: error.response.data.message });
      return false;
    }
  },
  cancelOrder: async (id, values) => {
    try {
      const { data } = await axios.put(`${routerLinks(SupplierService.order, 'api')}/cancel-order/${id}`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (error) {
      console.log('Lỗi:', error);
      if (error.response.data.message) Message.error({ text: error.response.data.message });
      return false;
    }
  },
  deliveryOrder: async (id) => {
    try {
      const { data } = await axios.put(`${routerLinks(SupplierService.order, 'api')}/delivery-order/${id}`);
      console.log(data);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (error) {
      console.log('Lỗi:', error);
      if (error.response.data.message) Message.error({ text: error.response.data.message });
      return false;
    }
  },
  deliveredOrder: async (id) => {
    try {
      const { data } = await axios.put(`${routerLinks(SupplierService.order, 'api')}/delivered-order/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (error) {
      console.log('Lỗi:', error);
      if (error.response.data.message) Message.error({ text: error.response.data.message });
      return false;
    }
  },
  getContractDetail: async (idSubOrgld) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.connectContract, 'api')}/${idSubOrgld}`);
      return {
        ...data,
        addressSupplier: convertAddress(data?.data?.subOrg?.address),
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  uploadImageContract: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(SupplierService.util, 'api')}/upload`, values, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      });
      return {
        ...data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  uploadFileDocContract: async (values) => {
    const formData = new FormData();
    formData.append('subOrgId', values?.subOrgId);
    formData.append('docSubOrgId', values?.docSubOrgId);
    for (let i = 0; i < values?.files?.length; i++) {
      formData.append('files', values?.files[i]?.originFileObj);
    }
    if (values?.files?.length === 1) formData.append('files', values?.files[0]);
    for (const pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    try {
      const { data } = await axios.post(`${routerLinks(SupplierService.fileDocContract, 'api')}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (data.message) Message.success({ text: data.message, title: 'Thành công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  deleteContract: async (id) => {
    try {
      const { data } = await axios.delete(`${routerLinks(SupplierService.fileDocContract, 'api')}/${id}`);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  downloadContractItem: async (idContract) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.fileDocContract, 'api')}/${idContract}`, {
        responseType: 'blob',
      });
      return data;
    } catch (e) {
      console.log('error', e);
      if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
      return false;
    }
  },

  countRevenue: async (id, params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.order, 'api')}/renueve/count-revenue/${id}`, {
        params: {
          id: +id,
          ...params,
          // status: 'DELIVERED',
        },
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
  downloadContractZip: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(SupplierService.util, 'api')}/zip`, values, {
        responseType: 'blob',
      });
      return data;
    } catch (e) {
      console.log('error', e);
      if (e.response.data.message) Message.error({ text: e.response.data.message, title: 'Thất bại' });
      return false;
    }
  },
  editStatusContractBetweenBalanceNSupplier: async (values, id) => {
    try {
      const { data } = await axios.put(`${routerLinks(SupplierService.connectContract, 'api')}/${id}`, values);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListSupplierBalance: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.storeConnectSupplier, 'api')}/supplier`, {
        params,
      });
      const convertData = data?.data?.map((item) => ({
        supplierName: item?.supplier?.name,
        id: item?.supplier?.id,
      }));

      return {
        data: convertData || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListSupplierNonBal: async (params) => {
    try {
      const { data } = await axios.get(`sub-organization/sub-org-in-store`, {
        params,
      });
      const convertData = data?.data?.map((item) => ({
        supplierName: item?.name,
        id: item?.id,
      }));

      return {
        data: convertData || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  paidSupplier: async (id, paymentSupplier) => {
    try {
      const body = {
        paymentSupplier: paymentSupplier
      }
      const { data } = await axios.put(`${routerLinks(SupplierService.order, 'api')}/paid/${id}`, body);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
