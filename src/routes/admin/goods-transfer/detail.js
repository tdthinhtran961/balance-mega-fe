import React, { Fragment, useState, useEffect } from 'react';
import { Form } from 'antd';
import moment from 'moment';
import { Message } from 'components';
import { useLocation } from 'react-router-dom';
import TitleForm from './components/TitleForm';
import HeadTableTransfer from './components/HeadTableTransfer';
import GoodTransferAddMode from './components/GoodTransferAddModal';
import { GoodTransferService } from 'services/GoodTransfer';
import { useNavigate } from 'react-router';
import { formatCurrency, routerLinks } from 'utils';
import { useAuth } from 'global';
import classNames from 'classnames';
const Page = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const storeId = user?.userInfor?.subOrgId;
  const roleCode = user?.userInfor?.roleCode;
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const urlSearch = new URLSearchParams(location.search);
  const idOrder = urlSearch.get('id');
  const idStore = user?.userInfor?.subOrgId;
  const [valuePartnerName, setValuePartnerName] = useState();

  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(8);

  const type = urlSearch.get('type');
  const typeStock = urlSearch.get('typeStock');
  const [params, setParams] = useState({
    page: 1,
    perPage: 9,
    fullTextSearch: '',
    idSupplier: '',
    idStore: '',
  });
  const [displayModal, setDisPlayModal] = useState(false);
  const [loading, setLoading] = useState({
    loadingMainPage: false,
    loadingProduct: false,
    loadingSupplier: false,
    loadingExportDisposalNote: false,
  });
  const [load, setLoad] = useState(false);
  // list Product
  const [listProduct, setListProduct] = useState([]);
  // useEffect
  const [listSupplier, setListSupplier] = useState([]);
  // list product choose
  const [itemChoose, setItemChoose] = useState([]);
  const remainingListProduct = listProduct?.filter((goods) => {
    return itemChoose?.findIndex((item) => item?.barcode === goods?.barcode) === -1;
  });
  const [listBranchRecive, setListBranchRecive] = useState([]);
  const [addressStoreTransfer, setAddressStoreTransfer] = useState('');
  const [data, setData] = useState({});
  const [, setInforSubOrg] = useState({
    storeId: null,
    supplierId: null,
    infor: null,
  });

  const [supplierType, setSupplierType] = useState('BALANCE');
  const [isNonBalSupplier, setIsNonBalSupplier] = useState(false);
  const [, setValueSupplier] = useState('');
  const [dataOrderInvoice, setDataOrderInvoice] = useState({
    url: '',
    code: '',
  });
  const [unitChange, setUnitChange] = useState([]);

  useEffect(() => {
    itemChoose?.forEach((i) => {
      if (i.quantity === undefined) {
        form.resetFields([`quantity${i.barcode}`]);
      }
    });
    setUnitChange(itemChoose.map((e) => e?.inventoryProductUnits?.findIndex((f) => f.isDefault)));
  }, [itemChoose?.length]);
  useEffect(() => {
    const initValueDetail = async () => {
      setLoading((prev) => ({ ...prev, loadingMainPage: true }));
      if ((pageType === 'detail' || pageType === 'edit') && type === 'transfer') {
        const dataDetail = await GoodTransferService.getById(idOrder);
        setDataOrderInvoice({ url: dataDetail?.url, code: dataDetail?.code });
        setItemChoose(
          dataDetail?.detailProduct.map((e) => ({
            ...e,
            inventoryProductUnits:
              e.inventoryProductUnits
                ?.sort((a, b) => +a.conversionValue - +b.conversionValue)
                .map((f) => ({ ...f, isDefault: f.productCode === (e.currentUnit || e.code) })) || [],
          })),
        );
        setData(dataDetail);
        setSupplierType(dataDetail?.supplierType);
        form.setFieldsValue({
          nameBrand: dataDetail?.storeReceived?.name,
          importedAt: moment(dataDetail?.issuedAt),
          importedReason: dataDetail?.reason,
          doiTac: dataDetail?.supplierType,
        });
      }
      if (type === 'receive') {
        const dataDetail = await GoodTransferService.getById(idOrder);
        setDataOrderInvoice({ url: dataDetail?.url, code: dataDetail?.code });
        setItemChoose(
          dataDetail?.detailProduct.map((e) => ({
            ...e,
            inventoryProductUnits:
              e.inventoryProductUnits
                ?.sort((a, b) => +a.conversionValue - +b.conversionValue)
                .map((f) => ({ ...f, isDefault: f.productCode === (e.currentUnit || e.code) })) || [],
          })),
        );
        setData(dataDetail);
        setSupplierType(dataDetail?.supplierType);
      }
      setLoading((prev) => ({ ...prev, loadingMainPage: false }));
    };
    initValueDetail();
  }, [pageType, idOrder, type]);

  useEffect(() => {
    const fetchListProduct = async () => {
      if (total !== 0 && listProduct?.length >= total) {
        setHasMore(false);
        return;
      }
      setHasMore(true);
      if (listSupplier.length > 0) {
        try {
          if (displayModal) {
            const res = await GoodTransferService.getListProduct({
              ...params,
              idStore: storeId,
              supplierType: supplierType === 'NON_BALANCE' ? 'NON_BALANCE' : undefined,
            });
            setListProduct(listProduct.concat(res.data?.inventory));
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchListProduct();
  }, [params, supplierType, listSupplier]);

  useEffect(() => {
    const getListBranch = async () => {
      if (pageType !== 'detail') {
        const data = await GoodTransferService.getListBranch({
          ...params,
          storeId: idStore,
          supplierType: 'BALANCE',
        });

        setListBranchRecive(data?.data);
        const dataStore = await GoodTransferService.getDetailStore(idStore);
        setAddressStoreTransfer(dataStore?.data);
      }
    };
    getListBranch();
  }, []);
  useEffect(() => {
    const fetchListSupplier = async () => {
      if (pageType !== 'detail') {
        setLoading((prev) => ({ ...prev, loadingSupplier: true }));
        try {
          const res = await GoodTransferService.getListSupplier();
          setListSupplier(res.data);
          setParams((prev) => ({ ...prev, idSupplier: res.data?.[0]?.supplier?.id }));
        } catch (err) {
          console.log(err);
        } finally {
          setLoading((prev) => ({ ...prev, loadingSupplier: false }));
        }
      }
    };
    fetchListSupplier();
  }, []);

  useEffect(() => {
    const fetchListSupplier = async () => {
      if (pageType !== 'detail') {
        setLoading((prev) => ({ ...prev, loadingSupplier: true }));
        try {
          const res = await GoodTransferService.getListSupplierNonBal({
            ...params,
            storeId,
            supplierType: 'NON_BALANCE',
          });
          setListSupplier(res.data);
          setParams((prev) => ({ ...prev, idSupplier: res.data?.[0]?.id }));
        } catch (err) {
          console.log(err);
        } finally {
          setLoading((prev) => ({ ...prev, loadingSupplier: false }));
        }
      }
    };
    supplierType === 'NON_BALANCE' && pageType === 'edit' && fetchListSupplier();
  }, [supplierType]);

  const isNumber = (n) => {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  };
  const submit = async (value) => {
    if (pageType === 'create') {
      const params = {
        // orderId: 0,
        reason: value?.importedReason,
        storeId: idStore,
        productItem: itemChoose.map((item, index) => ({
          id: item?.productId,
          quantityReturn: item?.quantity,
          inventoryProductUnitId: +item?.inventoryProductUnits[unitChange[index]]?.id,
          price: item?.inventoryProductUnits[unitChange[index]]?.inventoryPrice,
          tax: item.tax,
          supplierId: item?.subOrg?.id,
        })),
        issuedAt: moment(value.importedAt),
        type: 'TRANSFER_GOOD',
        storeReceivedId: value?.nameBrand,
        supplierType,
      };
      // Edit by Thinh - start
      const listOverInventory =
        itemChoose
          .filter(
            (item, index) =>
              item.quantity && item.quantity > item?.inventoryProductUnits[unitChange[index]]?.quantityBal,
          )
          .map((item) => item.name)
          .join(', ') ?? '';
      if (listOverInventory.length > 0) {
        Message.warning({
          text: `Tồn kho sản phẩm ${listOverInventory} không đủ!`,
          title: 'Thất bại',
          showConfirmButton: false,
        }).then(async (response) => {
          if (response.isConfirmed) {
            const res = await GoodTransferService.post(params);
            if (res) {
              if (typeStock === '1') {
                return navigate(routerLinks('ListOfStock'));
              } else {
                return navigate(`${routerLinks('GoodTransfer')}?tab=${2}`);
              }
            }
          }
        });
      } else {
        const res = await GoodTransferService.post(params);
        if (res) {
          if (typeStock === '1') {
            return navigate(routerLinks('ListOfStock'));
          } else {
            return navigate(`${routerLinks('GoodTransfer')}?tab=${2}`);
          }
        }
      }
      // Edit by Thinh - end
      return false;
    }
    if (pageType === 'edit') {
      const params = {
        reason: value?.importedReason,
        storeId: idStore,
        productItem: itemChoose.map((item, index) => ({
          id: item?.productId || item?.idProduct,
          quantityReturn: item?.quantity,
          inventoryProductUnitId: +item?.inventoryProductUnits[unitChange[index]]?.id,
          price: item?.inventoryProductUnits[unitChange[index]]?.inventoryPrice,
          tax: item.tax,
          supplierId: item?.subOrg?.id || item?.supplier?.id,
        })),
        issuedAt: moment(value.importedAt),
        type: 'TRANSFER_GOOD',
        storeReceivedId: isNumber(value?.nameBrand) ? value.nameBrand : data?.storeReceived?.id,
        supplierType,
      };
      // Edit by Thinh - start
      const listOverInventory =
        itemChoose
          .filter(
            (item, index) =>
              item.quantity && item.quantity > item?.inventoryProductUnits[unitChange[index]]?.quantityBal,
          )
          .map((item) => item.name)
          .join(', ') ?? '';
      if (listOverInventory.length > 0) {
        Message.warning({
          text: `Tồn kho sản phẩm ${listOverInventory} không đủ!`,
          title: 'Thất bại',
          showConfirmButton: false,
        }).then(async (response) => {
          if (response.isConfirmed) {
            const res = await GoodTransferService.put(idOrder, params);
            if (res) {
              return window.history.back();
              // if (typeStock === '1') {
              //   return navigate(routerLinks('ListOfStock'));
              // } else {
              //   return navigate(`${routerLinks('GoodTransfer')}?tab=${2}`);
              // }
            }
          }
        });
      } else {
        const res = await GoodTransferService.put(idOrder, params);
        if (res) {
          return window.history.back();
          // if (typeStock === '1') {
          //   return navigate(routerLinks('ListOfStock'));
          // } else {
          //   return navigate(`${routerLinks('GoodTransfer')}?tab=${2}`);
          // }
        }
      }
      // Edit by Thinh - end
      return false;
    }
  };
  const totalAmount = itemChoose.reduce((acc, item, index) => {
    if (item.quantity !== undefined) {
      return acc + +item?.inventoryProductUnits[unitChange[index]]?.inventoryPrice * +item.quantity;
    }
    return acc;
  }, 0);
  if (
    ((roleCode === 'OWNER_STORE' || roleCode === 'ADMIN' ) &&
      (pageType === 'detail' || pageType === 'edit') &&
      !data.id) ||
    loading.loadingExportDisposalNote ||
    ((roleCode === 'OWNER_STORE' ) && !addressStoreTransfer && pageType !== 'detail')
  ) {
    return <div className="h-screen w-full flex items-center justify-center"></div>;
  }
  return (
    <Fragment>
      <div className="min-h-screen good-transfer ">
        <Form form={form} component={false} onFinish={submit}>
          <p className="text-2xl text-teal-900 font-bold">{type !== 'receive' ? 'Chuyển hàng' : 'Nhận hàng'}</p>
          <div className="bg-white w-full px-6 rounded-xl mt-5 relative pb-[72px]">
            <div className=" border-b border-gray-200 mb-6">
              <div className="flex flex-row pt-2">
                <h2 className="text-lg text-teal-900 font-bold mr-3 ">
                  {type !== 'receive' ? '  Thông tin chuyển hàng' : 'Thông tin nhận hàng'}{' '}
                </h2>
                {pageType !== 'create' && (
                  <>
                    <>
                      {data?.status === 'COMPLETED' ? (
                        <div className="flex items-center text-green-600">
                          <svg
                            width="19"
                            height="19"
                            viewBox="0 0 19 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 0.75L9.76562 0.960938L1.21094 9.60938L0.695312 10.125L1.21094 10.6641L8.33594 17.7891L8.875 18.3047L9.39062 17.7891L18.0391 9.23438L18.25 9V0.75H10ZM10.6328 2.25H16.75V8.36719L8.875 16.1953L2.80469 10.125L10.6328 2.25ZM14.5 3.75C14.0869 3.75 13.75 4.08691 13.75 4.5C13.75 4.91309 14.0869 5.25 14.5 5.25C14.9131 5.25 15.25 4.91309 15.25 4.5C15.25 4.08691 14.9131 3.75 14.5 3.75Z"
                              fill="#16A34A"
                            />
                          </svg>
                          <span className="ml-2"> Đã hoàn tất</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-500">
                          <svg
                            width="19"
                            height="19"
                            viewBox="0 0 19 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 0.75L9.76562 0.960938L1.21094 9.60938L0.695312 10.125L1.21094 10.6641L8.33594 17.7891L8.875 18.3047L9.39062 17.7891L18.0391 9.23438L18.25 9V0.75H10ZM10.6328 2.25H16.75V8.36719L8.875 16.1953L2.80469 10.125L10.6328 2.25ZM14.5 3.75C14.0869 3.75 13.75 4.08691 13.75 4.5C13.75 4.91309 14.0869 5.25 14.5 5.25C14.9131 5.25 15.25 4.91309 15.25 4.5C15.25 4.08691 14.9131 3.75 14.5 3.75Z"
                              fill="#EAB308"
                            />
                          </svg>
                          <span className="ml-2"> Đang xử lý</span>
                        </div>
                      )}
                    </>
                  </>
                )}
              </div>
              {pageType === 'create' || pageType === 'detail' || pageType === 'edit' ? (
                <TitleForm
                  pageType={pageType}
                  listBranchRecive={listBranchRecive}
                  listSupplier={listSupplier}
                  data={data}
                  user={user}
                  addressStoreTransfer={addressStoreTransfer}
                  setIsNonBalSupplier={setIsNonBalSupplier}
                  setParams={setParams}
                  setSupplier={setListSupplier}
                  setValueSupplier={setValueSupplier}
                  setInforSubOrg={setInforSubOrg}
                  storeId={storeId}
                  params={params}
                  setSupplierType={setSupplierType}
                  supplierType={supplierType}
                  setListProduct={setListProduct}
                  setItemChoose={setItemChoose}
                  valuePartnerName={valuePartnerName}
                  setValuePartnerName={setValuePartnerName}
                />
              ) : null}
              <div className="mt-4">
                <div className=" flex justify-between font-bold">
                  <h2 className="font-bold text-base text-teal-900">Chi tiết chuyển hàng</h2>
                  {(pageType === 'edit' || pageType === 'create') && (
                    <button
                      className="hover:bg-teal-700 w-[130px] md:w-[153px] h-[36px] bg-teal-900 text-white text-[13px] md:text-sm !font-medium rounded-[10px] flex justify-center items-center gap-[10px] "
                      onClick={async () => {
                        setDisPlayModal(true);
                        setListProduct([]);
                        setLoad(true);
                        // setParams({ ...params, page: 1 });
                        const res = await GoodTransferService.getListProductTransfer({
                          ...params,
                          page: 1,
                          idStore: storeId,
                          supplierType: supplierType === 'NON_BALANCE' ? 'NON_BALANCE' : undefined,
                        });
                        setParams({ ...params, page: 1 });
                        setListProduct(res.data?.inventory);
                        setTotal(res?.count);
                        setLoad(false);
                      }}
                    >
                      <svg
                        width="11"
                        height="12"
                        viewBox="0 0 11 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="hidden md:inline-block"
                      >
                        <path
                          d="M10.1665 5.33464H6.1665V1.33464C6.1665 1.15782 6.09627 0.988255 5.97124 0.863231C5.84622 0.738207 5.67665 0.667969 5.49984 0.667969C5.32303 0.667969 5.15346 0.738207 5.02843 0.863231C4.90341 0.988255 4.83317 1.15782 4.83317 1.33464V5.33464H0.833171C0.65636 5.33464 0.48679 5.40487 0.361766 5.5299C0.236742 5.65492 0.166504 5.82449 0.166504 6.0013C0.166504 6.17811 0.236742 6.34768 0.361766 6.47271C0.48679 6.59773 0.65636 6.66797 0.833171 6.66797H4.83317V10.668C4.83317 10.8448 4.90341 11.0143 5.02843 11.1394C5.15346 11.2644 5.32303 11.3346 5.49984 11.3346C5.67665 11.3346 5.84622 11.2644 5.97124 11.1394C6.09627 11.0143 6.1665 10.8448 6.1665 10.668V6.66797H10.1665C10.3433 6.66797 10.5129 6.59773 10.6379 6.47271C10.7629 6.34768 10.8332 6.17811 10.8332 6.0013C10.8332 5.82449 10.7629 5.65492 10.6379 5.5299C10.5129 5.40487 10.3433 5.33464 10.1665 5.33464Z"
                          fill="white"
                        />
                      </svg>
                      <span>Thêm sản phẩm</span>
                    </button>
                  )}
                </div>
                <div className="mt-4">
                  <HeadTableTransfer
                    pageType={pageType}
                    itemChoose={itemChoose}
                    setItemChoose={setItemChoose}
                    listSupplier={listSupplier}
                    listBranchRecive={listBranchRecive}
                    data={data}
                    idOrder={idOrder}
                    navigate={navigate}
                    unitChange={unitChange}
                    setUnitChange={setUnitChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row items-end justify-end ">
              <span className="font-bold text-teal-900 text-base ">Tổng tiền:</span>
              <span className="font-bold text-teal-900 text-base ml-10">{formatCurrency(totalAmount, '')} VND</span>
            </div>
          </div>
        </Form>
        <div className="flex sm:flex-row flex-col justify-between flex-col-reverse">
          <div className="flex flex-col items-center">
            <button
              type="button"
              className=" sm:w-[106px] w-[60%] h-[44px] hover:bg-teal-900 bg-white hover:text-white text-teal-900 text-sm rounded-[10px] mt-3 border border-teal-900"
              onClick={() => {
                window.history.back();
              }}
            >
              Trở về
            </button>
          </div>
          {type !== 'receive' && roleCode !== 'ADMIN' && data.status !== 'COMPLETED' && (
            <div className="flex sm:flex-row flex-col items-center flex-col-reverse">
              {pageType === 'detail' && (
                <button
                  type="button"
                  className=" sm:w-[84px] w-[60%] h-[44px] bg-red-500 text-white text-sm rounded-[10px] mt-3 border  sm:mr-4 active:bg-red-400"
                  onClick={() => {
                    if (pageType === 'detail') {
                      Message.confirm({
                        text: 'Bạn có chắc muốn xóa hàng chuyển này?',
                        onConfirm: async () => {
                          const res = await GoodTransferService.delete(idOrder);
                          if (res) {
                            if (typeStock === '1') {
                              return navigate(routerLinks('ListOfStock'));
                            } else {
                              return navigate(`${routerLinks('GoodTransfer')}?tab=${2}`);
                            }
                          }
                        },
                        title: 'Thông báo',
                        cancelButtonText: 'Hủy',
                        confirmButtonColor: '#DC2626',
                        confirmButtonText: 'Đồng ý',
                      });
                    }
                  }}
                >
                  Xoá
                </button>
              )}
              {(itemChoose.length > 0 && pageType !== 'create') || type === 'receive' ? (
                <button
                  type="button"
                  className={classNames(
                    `sm:w-[185px] w-[60%] h-[44px] bg-white text-teal-900 text-sm rounded-[10px] mt-3 border border-teal-900 sm:mr-4 disabled`,
                  )}
                  onClick={async (e) => {
                    setLoading((prev) => ({ ...prev, loadingExportDisposalNote: true }));
                    const res = await GoodTransferService.exportBilGoodTransferWhenEdit(idOrder);
                    if (res) {
                      const link = document.createElement('a');
                      link.href = window.URL.createObjectURL(new Blob([res], { type: res.type }));
                      link.target = '_blank';
                      link.download = `Phiếu chuyển hàng - Mã đơn: ${data.code || 'Đang cập nhật'}`;
                      document.body.appendChild(link);
                      link.click();
                      link?.parentNode?.removeChild(link);
                      setLoading((prev) => ({ ...prev, loadingExportDisposalNote: false }));
                      if (type === 'transfer' && (roleCode === 'OWNER_STORE' )) {
                        if (typeStock === '1') {
                          return navigate(routerLinks('ListOfStock'));
                        } else {
                          return navigate(`${routerLinks('GoodTransfer')}?tab=${2}`);
                        }
                      }
                      if (type === 'receive' && (roleCode === 'OWNER_STORE' )) {
                        if (typeStock === '1') {
                          return navigate(routerLinks('ListOfStock'));
                        } else {
                          return navigate(`${routerLinks('GoodTransfer')}?tab=${1}`);
                        }
                      }
                      if (roleCode === 'ADMIN') {
                        return navigate(`${routerLinks('GoodTransfer')}?tab=${1}`);
                      }
                    }
                    setLoading((prev) => ({ ...prev, loadingExportDisposalNote: false }));
                  }}
                >
                  Xuất phiếu chuyển hàng
                </button>
              ) : (
                pageType !== 'create' && (
                  <button
                    type="button"
                    className={classNames(
                      `sm:w-[185px] w-[60%] h-[44px] bg-white text-teal-900 text-sm rounded-[10px] mt-3 border border-teal-900 sm:mr-4 opacity-40 disabled`,
                    )}
                  >
                    Xuất phiếu chuyển hàng
                  </button>
                )
              )}
              {(pageType === 'create' || pageType === 'detail') && (
                <>
                  {itemChoose.length > 0 ? (
                    <button
                      type="button"
                      className={classNames(
                        `sm:w-[156px] w-[60%] h-[44px] hover:bg-teal-700 bg-teal-900 text-white text-sm rounded-[10px] mt-3 border border-teal-900 active:bg-teal-600`,
                      )}
                      onClick={() => {
                        if (pageType === 'create') {
                          return form && form.submit();
                        }
                        if (pageType === 'detail') {
                          return navigate(
                            routerLinks('GoodTransferEdit') + `?id=${idOrder}&type=transfer` + `&typeStock=${1}`,
                          );
                        }
                      }}
                    >
                      {pageType === 'create' ? 'Lưu' : pageType === 'detail' ? 'Chỉnh sửa' : ''}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={classNames(
                        `sm:w-[156px] w-[60%] h-[44px] bg-teal-900 text-white text-sm rounded-[10px] mt-3 border border-teal-900 active:bg-teal-600`,
                        {
                          'opacity-70 disabled': itemChoose.length === 0,
                        },
                      )}
                    >
                      {pageType === 'create' ? 'Lưu' : pageType === 'detail' ? 'Chỉnh sửa' : ''}
                    </button>
                  )}
                </>
              )}
              {pageType === 'edit' && (
                <button
                  type="button"
                  className=" w-[156px] h-[44px] bg-teal-900 text-white text-sm rounded-[10px] mt-3 border border-teal-900"
                  onClick={() => {
                    form && form.submit();
                  }}
                >
                  Lưu
                </button>
              )}
            </div>
          )}
          {type === 'receive' && data.status !== 'COMPLETED' && (
            <div className="flex sm:flex-row flex-col items-center flex-col-reverse">
              <button
                type="button"
                className={classNames(
                  `sm:w-[185px] w-[60%] h-[44px] bg-white text-teal-900 text-sm rounded-[10px] mt-3 border border-teal-900  disabled`,
                )}
                onClick={async (e) => {
                  setLoading((prev) => ({ ...prev, loadingExportDisposalNote: true }));
                  const res = await GoodTransferService.exportBilGoodTransferWhenEdit(idOrder);
                  if (res) {
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(new Blob([res], { type: res.type }));
                    link.target = '_blank';
                    link.download = `Phiếu chuyển hàng - Mã đơn: ${data.code || 'Đang cập nhật'}`;
                    document.body.appendChild(link);
                    link.click();
                    link?.parentNode?.removeChild(link);
                    setLoading((prev) => ({ ...prev, loadingExportDisposalNote: false }));
                    if (typeStock === '1') {
                      return navigate(routerLinks('ListOfStock'));
                    } else {
                      return navigate(`${routerLinks('GoodTransfer')}?tab=${2}`);
                    }
                  }
                  setLoading((prev) => ({ ...prev, loadingExportDisposalNote: false }));
                }}
              >
                Xuất phiếu chuyển hàng
              </button>
            </div>
          )}
          {data.status === 'COMPLETED' && (
            <div className="flex items-center flex-col">
              <button
                onClick={async () => {
                  setLoading((prev) => ({ ...prev, loadingExportDisposalNote: true }));
                  const NoteKey = dataOrderInvoice?.url;
                  if (NoteKey) {
                    const responsive = await GoodTransferService.downloadBillDisposalWhenCreateWithKey(NoteKey);
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(new Blob([responsive], { type: responsive.type }));
                    link.target = '_blank';
                    link.download = `Phiếu chuyển hàng - Mã đơn: ${dataOrderInvoice.code}`;
                    document.body.appendChild(link);
                    link.click();
                    link?.parentNode?.removeChild(link);
                  }
                  setLoading((prev) => ({ ...prev, loadingExportDisposalNote: false }));
                }}
                type="button"
                className={classNames(
                  `sm:w-[185px] w-[60%] h-[44px] hover:bg-white bg-translate text-teal-900 text-sm rounded-[10px] mt-3 border border-teal-900  disabled`,
                )}
              >
                In phiếu chuyển hàng
              </button>
            </div>
          )}
        </div>
        <GoodTransferAddMode
          remainingListProduct={remainingListProduct}
          displayModal={displayModal}
          setDisPlayModal={setDisPlayModal}
          pageType={pageType}
          listProduct={listProduct}
          setListProduct={setListProduct}
          listSupplier={listSupplier}
          setParams={setParams}
          params={params}
          setLoading={setLoading}
          setItemChoose={setItemChoose}
          itemChoose={itemChoose}
          storeId={storeId}
          setLoad={setLoad}
          load={load}
          hasMore={hasMore}
          total={total}
          isNonBalSupplier={isNonBalSupplier}
          idStore={idStore}
          supplierType={supplierType}
          valuePartnerName={valuePartnerName}
          setValuePartnerName={setValuePartnerName}
          // supplierNonBalance={supplierNonBalance}
        />
      </div>
    </Fragment>
  );
};
export default Page;
