import { Col, DatePicker, Form, Input, Modal, Row, Space, Select } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { formatCurrency, routerLinks } from 'utils';
import './index.less';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { Message, Spin, Select as SelectComp } from 'components';
import { GoodsReturnService } from 'services/GoodReturn.js';
import useDebounce from './hooks/useDebounce';
import MoneyTax from './components/Moneytax';
import { taxApply } from 'constants/index';
import { useAuth } from 'global';
import RadioChooseType from './components/radioChoose';
import TableGoodReturnQuantity, { blockInvalid } from './components/tableGoodReturn';
import TableGoodPrice from './components/TableGoodPrice';
import ModalImportCoupon from './components/modalImportCoupon';
import ModalNoImportCoupon from './components/modalNoImportCoupon';
const { Option } = Select;
const Page = () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const idProduct = urlSearch.get('id');
  const type = urlSearch.get('type');
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const [loading, setLoading] = useState({
    loadingMainPage: false,
    loadingProduct: false,
    loadingSupplier: false,
    loadingReturnNote: false,
  });
  const storeId = user?.userInfor?.subOrgId;
  const { billCode } = location.state;
  const [stop, setStop] = useState(false);
  const [data, setData] = useState({});
  const [, setFilterDate] = useState('');
  const [step, setStep] = useState(pageType === 'create' ? 1 : urlSearch.get('step'));
  const [, setSupplier] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [createExport, setCreateExport] = useState(false);
  const [search] = useState('');
  const [visible, setVisible] = useState(false);
  const [visibleNo, setVisibleNo] = useState(false);
  const [isShowSelectProduct, setIsShowSelectProduct] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    perPage: 9,
    fullTextSearch: '',
    filterSupplier: '',
    idSupplier: '',
    idStore: '',
  });
  const [paramsReturn, setParamsReturn] = useState({
    page: 1,
    perPage: 9,
    fullTextSearch: '',
    orderId: '',
    listProductId: '',
    idStore: '',
  });
  const [disabled, setDisabled] = useState(false);
  const searchDebounce = useDebounce(search, 500);
  const [dataSearchFollowCodeProduct, setDataSearchFollowCodeProduct] = useState({});
  const [arrayProductlist, setArrayProductlist] = useState([]);
  const [idPut, setId] = useState();
  const [inforSubOrg, setInforSubOrg] = useState({
    storeId: null,
    idSupplier: null,
    infor: null,
  });
  const [supplierType, setSupplierType] = useState('BALANCE');
  const [enableNcc, setEnableNcc] = useState(true);
  const [itemChoose, setItemChoose] = useState([]);
  const remainingListProduct = listProduct?.filter((goods) => {
    return itemChoose?.findIndex((item) => item?.barcode === goods?.barcode) === -1;
  });
  const [remainingListProductList, setRemainingListProductList] = useState([]);

  const [dataOrder, setDataOrder] = useState([]);
  const [disabledButon, setDisabledButton] = useState({
    disabledBtn: false,
  });
  const [showModalCheckQuantity, SetShowModalCheckQuantity] = useState(false);
  const [listArrcheckQuantity, SetCheckQuantity] = useState([]);
  const [checkDataQuantitySubmit] = useState(false);
  const [valueSupplierWhenChoosePartner, setValueSupplierWhenChoosePartner] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(8);
  const [valueSupplier, setValueSupplier] = useState(undefined);
  const [load, setLoad] = useState(false);
  const [importCoupon, setImportCoupon] = useState(false);
  const [hasMoreImport, setHasMoreImport] = useState(false);
  const [importCouponListModal, setImportCouponListModal] = useState([]);
  const [filterTax, setFilterTax] = useState(taxApply.APPLY);
  const [temporary, setTemporary] = useState();
  const [dataDelete, setDataDelete] = useState([]);
  const [dataOrderInvoice, setDataOrderInvoice] = useState({
    url: '',
    code: '',
  });

  const [unitChange, setUnitChange] = useState([]);

  useEffect(() => {
    setRemainingListProductList(remainingListProduct);
  }, [remainingListProduct?.length, remainingListProductList?.length]);

  useEffect(() => {
    itemChoose?.forEach((i) => {
      if (i.quantity === undefined) {
        form.resetFields([`quantity${i.barcode}`]);
      }
    });
  }, [itemChoose?.length]);

  const handleSelectDate = (date) => {
    if (!date) {
      setFilterDate('');
      return;
    }
    setFilterDate(moment(date).format('YYYY-MM-DD') + ' 00:00:00');
  };

  useEffect(() => {
    if (pageType === 'create' || (pageType === 'edit' && billCode === undefined) || pageType !== 'detail') {
      const fetchListFilter = async () => {
        setLoading((prev) => ({ ...prev, loadingSupplier: true }));
        try {
          const res = await GoodsReturnService.getListSupplier();
          setSupplier(res.data);
          setInforSubOrg((prev) => ({
            ...prev,
            storeId: res.data?.[0]?.storeId,
            idSupplier: res.data?.[0]?.supplierId,
            infor: res.data?.[0],
          }));
          setParamsReturn((prev) => ({
            ...prev,
            idStore: storeId,
            idSupplier: inforSubOrg.supplierId,
            filterSupplier: res.data?.[0]?.supplier?.name,
          }));
        } catch (err) {
          console.log(err);
        } finally {
          setLoading((prev) => ({ ...prev, loadingSupplier: false }));
        }
      };
      fetchListFilter();
    }
  }, [pageType === 'create' && billCode === undefined]);

  useEffect(() => {
    if (pageType === 'create' || (pageType === 'edit' && billCode === undefined) || pageType !== 'detail') {
      const fetchListFilter = async () => {
        setLoading((prev) => ({ ...prev, loadingSupplier: true }));
        try {
          const res = await GoodsReturnService.getListSupplier();
          setSupplier(res.data);
          setInforSubOrg((prev) => ({
            ...prev,
            storeId: res.data?.[0]?.storeId,
            idSupplier: res.data?.[0]?.supplierId,
            infor: res.data?.[0],
          }));
          pageType === 'create' &&
            setParams((prev) => ({
              ...prev,
              idStore: storeId,
              idSupplier: inforSubOrg.supplierId,
              filterSupplier: res.data?.[0]?.supplier?.name,
            }));
        } catch (err) {
          console.log(err);
        } finally {
          setLoading((prev) => ({ ...prev, loadingSupplier: false }));
        }
      };
      fetchListFilter();
      // billCode === undefined && pageType === 'edit' ? setIsShowSelectProduct(true) : setIsShowSelectProduct(false);
    }
  }, [pageType]);

  //  trả hàng không theo phiếu nhập hàng
  useEffect(() => {
    const fetchListProduct = async () => {
      if (total !== 0 && arrayProductlist?.length >= total) {
        setHasMore(false);
        return;
      }
      setHasMore(true);
      if (valueSupplierWhenChoosePartner.length > 0 && isShowSelectProduct) {
        setLoading((prev) => ({ ...prev, loadingProduct: true }));
        try {
          const res = await GoodsReturnService.getListProduct({
            ...paramsReturn,
            idSupplier: inforSubOrg.idSupplier || '',
            // fullTextSearch: params.fullTextSearch || searchDebounce,
          });
          if (+res?.data?.length === 0) {
            setStop(true);
          } else {
            setLoading((prev) => ({ ...prev, loadingProduct: false }));
            setListProduct(listProduct.concat(res?.data?.inventory));
            setTotal(res?.count);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading((prev) => ({ ...prev, loadingProduct: false }));
        }
      }
    };
    billCode === undefined && fetchListProduct();
  }, [paramsReturn, stop, searchDebounce, isShowSelectProduct]);

  useEffect(() => {
    const initFunction = async () => {
      if (idProduct) {
        setLoading((prev) => ({ ...prev, loadingMainPage: true }));
        try {
          const res = await GoodsReturnService.getById(idProduct);
          setDataOrderInvoice({ url: res?.data?.url, code: res?.data?.code });
          setFilterTax(!!res?.data?.isApplyTax === true ? taxApply.APPLY : taxApply.NO_APPLY);
          setId({ idOd: res?.data?.order?.id, idSt: res?.data?.store?.id, code: res?.data?.code });
          setArrayProductlist(
            res?.data?.detailProduct.map((e) => ({
              ...e,
              inventoryProductUnits: e.inventoryProductUnits
                .sort((a, b) => +a.conversionValue - +b.conversionValue)
                .map((f) => ({
                  ...f,
                  isDefault: f.productCode === (e.currentUnit || e.code),
                })),
            })),
          );
          for (let i = 0; i < res?.data?.detailProduct?.length; i++) {
            const item = res?.data?.detailProduct[i];
            res['quantity' + item.code] = +res?.data?.detailProduct[i].quantity;
            res['price' + item.code] = +res?.data?.detailProduct[i].price;
          }
          form.setFieldsValue(res);
          form.setFieldsValue({
            importedAt: moment(res?.data?.issuedAt),
            importedReason: res?.data?.reason,
          });
          setData({
            ...res,
            detailProduct: res?.data?.detailProduct?.map((item) => ({ ...item, ['price' + item.code]: item.price })),
          });

          // if (pageType === 'edit' && billCode !== undefined) {
          //   const resList = await GoodsReturnService.getListProduct({
          //     ...params,
          //     filterSupplier: res?.data?.detailProduct[0]?.supplier?.name,
          //     idSupplier: res?.data?.detailProduct[0]?.supplier?.id,
          //     idStore: storeId,
          //   });
          //   setListProduct([]);
          //   setListProduct(resList?.data?.inventory);
          //   setParams((prev) => ({
          //     ...prev,
          //     idStore: storeId,
          //     filterSupplier: res?.data?.detailProduct[0]?.supplier?.name,
          //     idSupplier: res?.data?.detailProduct[0]?.supplier?.id,
          //   }));
          // }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading((prev) => ({ ...prev, loadingMainPage: false }));
        }
      }
    };

    initFunction();
  }, [idProduct, pageType === 'edit']);

  useEffect(() => {
    if (pageType !== 'detail') {
      const initFunction = async () => {
        if (idProduct && billCode === undefined) {
          setLoading((prev) => ({ ...prev, loadingMainPage: true }));
          try {
            let res;
            if (billCode !== undefined) {
              res = await GoodsReturnService.getById(idProduct);
              setFilterTax(!!res?.data?.isApplyTax === true ? taxApply.APPLY : taxApply.NO_APPLY);
              setArrayProductlist(res?.data?.detailProduct);
              for (let i = 0; i < res?.data?.detailProduct?.length; i++) {
                const item = res?.data?.detailProduct[i];
                res['quantity' + item.code] = +res?.data?.detailProduct[i].quantity;
                res['price' + item.code] = +res?.data?.detailProduct[i].price;
              }
              form.setFieldsValue(res);
              form.setFieldsValue({
                importedAt: moment(res?.data?.issuedAt),
                importedReason: res?.data?.reason,
              });
              setData({
                ...res,
                detailProduct: res?.data?.detailProduct?.map((item) => ({
                  ...item,
                  ['price' + item.code]: item.price,
                })),
              });
            }

            if (pageType === 'edit' && billCode === undefined) {
              res = await GoodsReturnService.getById(idProduct);
              const dataListTable = res?.data?.detailProduct;
              const resList = await GoodsReturnService.getListProduct({
                ...paramsReturn,
                page: 0,
                perPage: 0,
                filterSupplier: res?.data?.detailProduct[0]?.supplier?.name,
                idSupplier: res?.data?.detailProduct[0]?.supplier?.id,
                idStore: storeId,
              });

              const dataModel = resList?.data?.inventory;
              const filteredArr2 = dataModel.filter((item2) => {
                const matchingItem = dataListTable.find((item1) => item1.barcode === item2.barcode);
                return !matchingItem;
              });
              setListProduct(filteredArr2);
              setRemainingListProductList(filteredArr2);
            }
          } catch (err) {
            console.log(err);
          } finally {
            setLoading((prev) => ({ ...prev, loadingMainPage: false }));
          }
        }
      };
      initFunction();
    }
  }, [idProduct]);

  useEffect(() => {
    arrayProductlist?.forEach((i) => {
      // form.resetFields([`price${i.code}`]);
      if (i.quantity === undefined && i.price === undefined) {
        form.resetFields([`quantity${i.code}`]);
        form.resetFields([`quantityUnit${i.code}`] || [`quantity${i.code}`]);
        // form.resetFields([`price${i.code}`]);
      }
    });
    setUnitChange(arrayProductlist?.map((e) => e?.inventoryProductUnits?.findIndex((f) => f.isDefault)));
  }, [arrayProductlist?.length]);

  useEffect( () => {
    const fetchListProduct = async () => {
      if (total !== 0 && importCouponListModal?.length >= total) {
        setHasMoreImport(false);
        return;
      }
      setHasMoreImport(true);
      if (importCoupon) {
        setLoading((prev) => ({ ...prev, loadingProduct: true }));
        try {
          const listProductId = arrayProductlist?.map((ele) => +ele?.orderLineItemId || +ele?.id);
          const res = await GoodsReturnService.getListProductOrder({
            ...paramsReturn,
            orderId: dataSearchFollowCodeProduct?.orderId,
            listProductId,
          });

          if (+res?.data?.length === 0) {
            setStop(true);
          } else {
            setLoading((prev) => ({ ...prev, loadingProduct: false }));
            setImportCouponListModal(importCouponListModal.concat(res?.data?.inventory));
            setTotal(res?.count);
            setStop(false);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading((prev) => ({ ...prev, loadingProduct: false }));
        }
      }
    };
    fetchListProduct();
  }, [paramsReturn, stop, importCoupon]);

  const handleDelete = (id) => {
    Message.confirm({
      text: 'Bạn có chắc muốn xóa trả hàng này?',
      onConfirm: async () => {
        await GoodsReturnService.deleteAll(id);
        return window.history.back();
        // if (type === '1') {
        //   return navigate(routerLinks('ListOfStock'));
        // } else {
        //   return navigate(routerLinks('GoodReturn'));
        // }
        // return navigate(routerLinks('GoodReturn'));
      },
      title: 'Thông báo',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#DC2626',
      confirmButtonText: 'Đồng ý',
    });
  };

  const handleDeleteKeyNo = (code, id) => {
    if (pageType === 'edit' && billCode === undefined) {
      Message.confirm({
        text: 'Bạn có chắc muốn xóa trả hàng này?',
        onConfirm: async () => {
          const res = await GoodsReturnService.deleteOneProduct(id);
          if (res) {
            const newData = arrayProductlist?.filter((item) => item.code !== code);
            setArrayProductlist(newData);
            const removedItems = arrayProductlist?.filter((item) => item.code === code).map((item) => ({ ...item }));
            setDataOrder((prev) => prev.concat(removedItems));
            setListProduct(listProduct.concat(removedItems));
            setRemainingListProductList(remainingListProductList.concat(removedItems));
          }
        },
        title: 'Thông báo',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#DC2626',
        confirmButtonText: 'Đồng ý',
      });
    } else {
      form.resetFields([`quantityUnit${code}`]);
      const newData = arrayProductlist?.filter((item) => item.code !== code);
      setDataDelete(dataDelete.concat(arrayProductlist?.filter((item) => item.code === code)));
      setRemainingListProductList(
        remainingListProductList.concat(arrayProductlist?.filter((item) => item.code === code)),
      );
      setListProduct(remainingListProductList.concat(arrayProductlist?.filter((item) => item.code === code)));
      setArrayProductlist(newData);
    }
  };

  const handleDeleteKey = async (code, id) => {
    if (pageType === 'edit' && billCode !== undefined) {
      Message.confirm({
        text: 'Bạn có chắc muốn xóa trả hàng này?',
        onConfirm: async () => {
          const res = await GoodsReturnService.deleteOneProduct(id);
          if (res) {
            const newData = arrayProductlist?.filter((item) => item.code !== code);
            setArrayProductlist(newData);
            const removedItems = arrayProductlist?.filter((item) => item.code === code).map((item) => ({ ...item }));
            setDataOrder((prev) => prev.concat(removedItems));
          }
        },
        title: 'Thông báo',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#DC2626',
        confirmButtonText: 'Đồng ý',
      });
    } else {
      const newData = arrayProductlist?.filter((item) => item.code !== code);
      setArrayProductlist(newData);
      const removedItems = arrayProductlist?.filter((item) => item.code === code).map((item) => ({ ...item }));
      setDataOrder((prev) => prev.concat(removedItems));
      setRemainingListProductList(remainingListProductList.concat(removedItems));
      // form.resetFields([`price${code}`]);
      form.resetFields([`quantityUnit${code}`]);
    }
  };

  useEffect(() => {
    const data = async () => {
      if (pageType === 'edit') {
        if (arrayProductlist.length === 0 && data?.detailProduct?.length === dataOrder?.length) {
          await GoodsReturnService.deleteAll(idProduct);
          await GoodsReturnService.get({ page: 1, perPage: 10, storeId });
          window.history.go(-2);
          // if (type === '1') {
          //   return navigate(routerLinks('ListOfStock'));
          // } else {
          //   return navigate(routerLinks('GoodReturn'));
          // }
          // return navigate(routerLinks('GoodReturn'));
        }
      }
    }
    data()
  }, [pageType, data?.itemList, dataOrder?.length, arrayProductlist]);

  const toggleAmount = (data, type, index) => {
    const { code, _priceUnit, _quantity } = data;
    const tempOrder =
      arrayProductlist &&
      [...arrayProductlist].map((e, i) => {
        if (i === index) {
          if (type === 1) {
            return {
              ...e,
              inventoryProductUnits: e.inventoryProductUnits.map((item) => {
                if (item?.productCode === code) {
                  return { ...item, inventoryPrice: _priceUnit };
                }
                return item;
              }),
            };
          }
          if (type === 2) {
            return { ...e, quantityUnit: _quantity };
          }
        }
        return e;
      });
    return setArrayProductlist([...tempOrder]);
  };

  const handleSubmit = async (values) => {
    let result = true;
    for (const prop in values) {
      if (prop.startsWith('quantity')) {
        if (+values[prop] === 0 || values[prop] === '' || values[prop] === undefined) {
          result = true;
        } else {
          result = false;
          break;
        }
      }
    }

    console.log(values, result, listArrcheckQuantity);
    if (result) {
      Message.error({ text: 'Vui lòng nhập số lượng cho ít nhất một sản phẩm' });
    } else {
      if (
        (pageType === 'create' && !checkDataQuantitySubmit && isShowSelectProduct && listArrcheckQuantity.length > 0) ||
        (pageType === 'edit' && listArrcheckQuantity.length > 0 && !checkDataQuantitySubmit && billCode === undefined)
      ) {
        const checkQuantity = arrayProductlist.filter((item) => {
          return +item.quantityUnit > +item.inventoryProductUnits[unitChange].quantityBal;
        });
        console.log(checkQuantity, unitChange);
        if (
          checkQuantity.length > 0 ||
          (!checkDataQuantitySubmit && +step === 2 && checkQuantity.length > 0) ||
          (pageType === 'edit' && billCode === undefined && !checkDataQuantitySubmit && checkQuantity.length > 0)
        ) {
          SetCheckQuantity(checkQuantity);
          SetShowModalCheckQuantity(true);
        }
      } else {
        let param = {};
        pageType === 'create'
          ? (param = {
              orderId: dataSearchFollowCodeProduct.orderId,
              issuedAt: moment(values.importedAt).toISOString(),
              storeId: inforSubOrg.storeId,
              reason: values?.importedReason,
              productItem: isShowSelectProduct
                ? arrayProductlist.map((item, index) => ({
                    supplierId: isShowSelectProduct ? inforSubOrg.idSupplier : dataSearchFollowCodeProduct.supplierId,
                    id: !isShowSelectProduct ? item.id : item.productId,
                    price: item.price,
                    quantityReturn: +item.quantityUnit || 0,
                    quantityImport: +item?.inventoryProductUnits[unitChange[index]]?.quantityBal,
                    inventoryProductUnitId: +item?.inventoryProductUnits[unitChange[index]]?.id,
                    checkQuantity:
                      +item?.inventoryProductUnits[unitChange[index]]?.quantityBal - (+item.quantityUnit || 0),
                    tax: +item.tax,
                    storeBarcode: item.storeBarcode,
                  }))
                : arrayProductlist.map((item, index) => ({
                    orderLineItemId: item?.orderLineItemId,
                    supplierId: isShowSelectProduct ? inforSubOrg.idSupplier : dataSearchFollowCodeProduct.supplierId,
                    id: !isShowSelectProduct ? item.id : item.productId,
                    price: item.price,
                    quantityReturn: +item.quantityUnit || 0,
                    quantityImport: +item?.inventoryProductUnits[unitChange[index]]?.quantityBal,
                    inventoryProductUnitId: +item?.inventoryProductUnits[unitChange[index]]?.id,
                    checkQuantity:
                      +item?.inventoryProductUnits[unitChange[index]]?.quantityBal - (+item.quantityUnit || 0),
                    tax: +item.tax,
                    storeBarcode: item.storeBarcode,
                  })),
              type: 'RETURN_GOOD',
              supplierType,
              data,
              isApplyTax: filterTax === taxApply.APPLY,
            })
          : (param = {
              orderId: idPut?.idOd,
              issuedAt: moment(values.importedAt).toISOString(),
              reason: values?.importedReason,
              productItem:
                billCode === undefined
                  ? arrayProductlist.map((item, index) => ({
                      supplierId: +inforSubOrg?.supplierId || +item?.supplier?.id || +item?.subOrg?.id,
                      id: +item?.idProduct || +item?.productId || +item?.id,
                      price: +item?.price,
                      quantityReturn: +item?.quantityUnit || +item?.quantity || 0,
                      quantityImport: +item?.inventoryProductUnits[unitChange[index]]?.quantityBal,
                      inventoryProductUnitId: +item?.inventoryProductUnits[unitChange[index]]?.id,
                      checkQuantity:
                        +item?.inventoryProductUnits[unitChange[index]]?.quantityBal - (+item.quantityUnit || 0),
                      tax: +item.tax,
                      storeBarcode: item.storeBarcode,
                    }))
                  : arrayProductlist.map((item, index) => ({
                      orderLineItemId: item?.orderLineItemId,
                      supplierId: +inforSubOrg?.supplierId || +item?.supplier?.id || +item?.subOrg?.id,
                      id: +item?.idProduct || +item?.productId || +item?.id,
                      price: +item?.price,
                      quantityReturn: +item?.quantityUnit >= 0 ? +item?.quantityUnit : +item?.quantity,
                      quantityImport: +item?.inventoryProductUnits[unitChange[index]]?.quantityBal,
                      inventoryProductUnitId: +item?.inventoryProductUnits[unitChange[index]]?.id,
                      checkQuantity:
                        +item?.inventoryProductUnits[unitChange[index]]?.quantityBal - (+item.quantityUnit || 0),
                      tax: +item.tax,
                      storeBarcode: item.storeBarcode,
                    })),
              type: 'RETURN_GOOD',
              supplierType,
              isApplyTax: filterTax === taxApply.APPLY,
            });

        if (isShowSelectProduct && pageType === 'create') {
          delete param.orderId;
        }
        if (pageType === 'edit' && billCode === undefined) {
          delete param.orderId;
        }
        let res;
        setLoading((prev) => ({ ...prev, loadingReturnNote: true }));
        pageType === 'create' && createExport === false
          ? (res = await GoodsReturnService.post(param))
          : createExport === true
          ? (res = await GoodsReturnService.exportBillCombineCreating(param))
          : (res = await GoodsReturnService.put(idProduct, param));
        setLoading((prev) => ({ ...prev, loadingReturnNote: false }));
        if (createExport === true && res) {
          const disposalNoteKey = res?.data?.key;
          const responsive = await GoodsReturnService.downloadBillDisposalWhenCreateWithKey(disposalNoteKey);
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(new Blob([responsive], { type: responsive.type }));
          link.target = '_blank';
          // link.download = values.fileName || values.name;
          link.download = `Phiếu trả hàng`;
          document.body.appendChild(link);
          link.click();
          link?.parentNode?.removeChild(link);
        }
        if (res) {
          setLoading((prev) => ({ ...prev, loadingReturnNote: false }));
          return window.history.back();
          // return navigate(routerLinks('GoodReturn'));
          // if (type === '1') {
          //   return navigate(routerLinks('ListOfStock'));
          //  } else {
          //     return navigate(routerLinks('GoodReturn'));
          //   } */}
        }
      }
    }
  };
  const searchByName = (products, name) => {
    return products?.filter((product) => product?.name.toLowerCase().includes(name.toLowerCase()));
  };

  const arrMap = useCallback(() => {
    const result = searchByName(
      remainingListProductList || remainingListProduct,
      params.fullTextSearch || searchDebounce,
    );
    return { result };
  }, [
    params.fullTextSearch,
    searchDebounce,
    remainingListProduct.length,
    remainingListProductList.length,
    listProduct.length,
  ]);

  if (loading.loadingMainPage || loading.loadingReturnNote) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }
  return (
    <Fragment>
      {(+step === 1 || pageType === 'create' || pageType === 'detail' || pageType === 'edit') && (
        <div className="min-h-screen good-return-container">
          <Form form={form} component={false} onFinish={handleSubmit}>
            <p className="text-2xl text-teal-900 font-medium">Trả hàng</p>
            <div className="bg-white w-full px-6 pt-2 rounded-xl mt-5 relative pb-5">
              {pageType === 'create' && (
                <>
                  <h2 className="font-bold text-lg text-teal-900 mr-3">Phân loại</h2>
                  <div className="mt-4">
                    <RadioChooseType
                      setIsShowSelectProduct={setIsShowSelectProduct}
                      setStep={setStep}
                      setArrayProductlist={setArrayProductlist}
                      setDataSearchFollowCodeProduct={setDataSearchFollowCodeProduct}
                      form={form}
                      enableNcc={enableNcc}
                      setEnableNcc={setEnableNcc}
                      setListProduct={setListProduct}
                      setImportCoupon={setImportCoupon}
                      importCoupon={importCoupon}
                    />
                  </div>
                  {!isShowSelectProduct && (
                    <div>
                      <div
                        className={`mt-2 grid grid-cols-[140px_minmax(140px,_1fr)] items-center goods-input-code ${
                          roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR' ? 'opacity-0' : ''
                        }`}
                      >
                        <span className={`font-normal text-black text-base mb-2 `}>
                          Mã nhập hàng: <span className="ml-[3px] text-red-600 absolute  ">*</span>
                        </span>
                        <Form.Item
                          name="code"
                          rules={[
                            {
                              required: true,
                              message: `Vui lòng nhập mã nhập hàng`,
                            },
                          ]}
                          className={'mt-4 input-goods-return-input'}
                        >
                          <Input
                            onPressEnter={async (e) => {
                              const code = e.target.value.trim().length > 0;
                              if (code) {
                                const data = await GoodsReturnService.getByCode(e.target.value.trim());
                                if (data) {
                                  setFilterTax(!!data?.data?.isApplyTax === true ? taxApply.APPLY : taxApply.NO_APPLY);

                                  data && setDataSearchFollowCodeProduct(data?.data);
                                  setArrayProductlist(
                                    data?.data?.item
                                      .filter((item) => item.quantity > 0)
                                      .map((e) => ({
                                        ...e,
                                        inventoryProductUnits: e.inventoryProductUnits
                                          .sort((a, b) => +a.conversionValue - +b.conversionValue)
                                          .map((f) => ({
                                            ...f,
                                            isDefault: f.productCode === (e.currentUnit || e.productCodeStore),
                                          })),
                                      })),
                                  );
                                  setImportCoupon(true);
                                }
                              }
                            }}
                            onKeyDown={blockInvalid}
                            placeholder="Nhập mã nhập hàng & nhấn Enter"
                            type="text"
                            className="w-full !text-gray-500 px-3 py-2 !bg-white rounded-[10px] border border-gray-200 focus:!shadow-none focus:!border-gray-200"
                          />
                        </Form.Item>
                      </div>
                      <hr className="mt-4"></hr>
                    </div>
                  )}
                  {isShowSelectProduct && <hr className="mt-10"></hr>}
                </>
              )}
              {(dataSearchFollowCodeProduct?.id || +step === 2 || pageType === 'detail' || pageType === 'edit') && (
                <>
                  <div className="mb-6 border-b border-gray-200">
                    <div className="flex items-center mb-4 mt-4 goods-return-title">
                      <h2 className="font-bold text-lg text-teal-900 mr-3 goods-return-first-title">
                        Thông tin trả hàng
                      </h2>
                      {pageType !== 'create' && (
                        <>
                          {data?.data?.status === 'INPROCESS' ? (
                            <div className="flex items-center text-base font-semibold text-yellow-500">
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
                          ) : (
                            <div className="flex items-center text-base font-semibold text-green-600">
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
                          )}
                        </>
                      )}
                    </div>

                    {pageType === 'create' ? (
                      <Row
                        gutter={{
                          xs: 8,
                          sm: 16,
                          md: 24,
                          lg: 32,
                        }}
                        className="goods-return-row"
                      >
                        {isShowSelectProduct && window.innerWidth < 640 && (
                          <div className=" items-center w-[70%] mb-4 goodReturn-info-create-bellow ">
                            <Col span={24} sm={12} md={15} className="goods-return-section-info-col">
                              <div className="grid grid-cols-[190px_minmax(180px,_1fr)] items-center goods-return-info-section col-span-5/8">
                                <span className="font-normal text-black text-base">Đối tác: </span>
                                <Select
                                  className="w-[100%] h-[36px] rounded-[10px]  supplier-good-return-select mr-6 mb-4"
                                  placeholder="Chọn Đối tác"
                                  optionFilterProp="children"
                                  options={[
                                    {
                                      value: 'BALANCE',
                                      label: 'Balance',
                                    },
                                    {
                                      value: 'NON_BALANCE',
                                      label: 'Non_Balance',
                                    },
                                  ]}
                                  onSelect={async (e) => {
                                    setEnableNcc(false);
                                    let data;
                                    setValueSupplierWhenChoosePartner([]);
                                    if (e === 'BALANCE') {
                                      setSupplierType(e);
                                      data = await GoodsReturnService.getListSupplierWhenChoose({
                                        page: 1,
                                        perPage: 9999,
                                        idSuppiler: storeId,
                                      });
                                    } else if (e === 'NON_BALANCE') {
                                      setSupplierType(e);
                                      data = await GoodsReturnService.getListSupplierWhenChooseNonBal({
                                        page: 1,
                                        perPage: 9999,
                                        storeId,
                                        supplierType: 'NON_BALANCE',
                                      });
                                    }
                                    setValueSupplierWhenChoosePartner(data.data);
                                    setArrayProductlist([]);
                                  }}
                                ></Select>
                              </div>
                            </Col>
                          </div>
                        )}
                        <div className="flex items-center w-full mb-[10px] goodReturn-info-create">
                          <Col span={24} sm={12} className="goods-return-section-info-col">
                            <div className="grid grid-cols-[180px_minmax(180px,_1fr)] items-center goods-return-info-section">
                              <span className="font-normal text-black text-base">Tên cửa hàng:</span>
                              <span className="font-normal text-base text-gray-500">{user?.userInfor?.subOrgName}</span>
                            </div>
                          </Col>

                          {!isShowSelectProduct ? (
                            <Col span={24} sm={12}>
                              <div className="grid grid-cols-[180px_minmax(180px,_1fr)] goods-return-info-section">
                                <span className="font-normal text-black text-base">Nhà cung cấp:</span>
                                <span className="font-normal text-base text-gray-500">
                                  {isShowSelectProduct
                                    ? inforSubOrg?.infor?.supplier?.name
                                    : dataSearchFollowCodeProduct?.supplierName}
                                </span>
                              </div>
                            </Col>
                          ) : (
                            <Col span={24} sm={12}>
                              <div className="grid grid-cols-[180px_minmax(180px,_1fr)] goods-return-info-section">
                                <span className="font-normal text-black text-base mt-1">Nhà cung cấp:</span>
                                <Select
                                  className="w-[100%] h-[36px] rounded-[10px]  supplier-good-return-select mr-6 mb-4"
                                  placeholder="Chọn nhà cung cấp"
                                  optionFilterProp="children"
                                  disabled={enableNcc}
                                  onChange={(value) => {
                                    // const handleChange = (value) => {
                                    //   console.log(`Old value: ${selectedValue}`);
                                    //   setSelectedValue(value);
                                    //   console.log(`New value: ${value}`);
                                    //   message.success(`Selected value changed to ${value}`);
                                    // };
                                    setTemporary(value);

                                    // form.resetFields([`quantity${code}`]);
                                    if (arrayProductlist.length === 0 || value === temporary) {
                                      setListProduct([]);
                                      setParams((prev) => ({ ...prev, page: 1, filterSupplier: value || '' }));
                                      setParamsReturn((prev) => ({ ...prev, page: 1, filterSupplier: value || '' }));
                                    } else {
                                      import('sweetalert2').then(({ default: Swal }) =>
                                        Swal.fire({
                                          title: 'Thông báo',
                                          text: 'Bạn chỉ có thể trả hàng theo nhà cùng một nhà cung cấp. Việc chọn nhà cung cấp khác sẽ xóa hết tất sản phẩm đã được chọn của nhà cung cấp trước. Bạn có muốn tiếp tục chọn nhà cung cấp khác!',
                                          icon: 'warning',
                                          showCancelButton: true,
                                          cancelButtonText: 'Hủy',
                                          confirmButtonText: 'Tiếp tục',
                                        }).then((result) => {
                                          if (result.isConfirmed) {
                                            form.resetFields();
                                            setArrayProductlist([]);
                                            setItemChoose([]);
                                            remainingListProduct.length = 0;
                                            setListProduct([]);
                                            setParamsReturn((prev) => ({
                                              ...prev,
                                              page: 1,
                                              filterSupplier: value || '',
                                            }));
                                          } else if (result.dismiss) {
                                            setValueSupplier(paramsReturn?.filterSupplier);
                                            setTemporary(temporary);
                                          }
                                        }),
                                      );
                                    }
                                  }}
                                  value={valueSupplier}
                                >
                                  {valueSupplierWhenChoosePartner &&
                                    valueSupplierWhenChoosePartner.map((item, index) => {
                                      return (
                                        <Option
                                          key={index}
                                          label={item?.supplier?.name}
                                          className="p-0 good-return-supplier-select-wrapper leading-[32px]"
                                        >
                                          <span
                                            className="w-full inline-block good-return-select-item pl-2"
                                            onClick={() => {
                                              setValueSupplier(item?.supplier?.name || item?.name);
                                              setInforSubOrg({
                                                storeId: item?.storeId || storeId,
                                                idSupplier: item?.supplier?.id || item?.id,
                                                infor: item,
                                              });
                                            }}
                                          >
                                            {item?.supplier?.name || item?.name}
                                          </span>
                                        </Option>
                                      );
                                    })}
                                </Select>
                              </div>
                            </Col>
                          )}
                        </div>
                        <div className="flex items-center w-full mb-4 goodReturn-info-create-bellow">
                          <Col span={24} sm={12} className="goods-return-section-info-col">
                            <div className="grid grid-cols-[180px_minmax(180px,_1fr)] items-center goods-return-info-section">
                              <span className="font-normal text-black text-base">
                                Thời gian trả hàng: <span className=" font-[2px] mb-2 text-red-600 "> *</span>{' '}
                              </span>
                              <Space direction="vertical" className="">
                                <Form.Item
                                  name="importedAt"
                                  style={{
                                    margin: 0,
                                  }}
                                  rules={[
                                    {
                                      required: true,
                                      message: `Thời gian nhập hàng là bắt buộc`,
                                    },
                                  ]}
                                  initialValue={moment()}
                                >
                                  <DatePicker
                                    onChange={handleSelectDate}
                                    format="DD/MM/YYYY"
                                    className="!h-[36px] !bg-white !border-gray-200 !text-gray-500 goodsReturn-datepicker"
                                    disabledDate={(current) => {
                                      const date = new Date();
                                      return current && current.valueOf() >= date.setDate(date.getDate());
                                    }}
                                  />
                                </Form.Item>
                              </Space>
                            </div>
                          </Col>
                          <Col span={24} sm={12} className="goods-return-section-info-col">
                            <div className="grid grid-cols-[180px_minmax(180px,_1fr)] items-center goods-return-info-section">
                              <span className="font-normal text-black text-base">
                                Lý do trả hàng: <span className=" font-[2px] mb-2 text-red-600 "> *</span>{' '}
                              </span>
                              <Form.Item
                                name="importedReason"
                                style={{
                                  margin: 0,
                                }}
                                rules={[
                                  ({ getFieldValue }) => ({
                                    validator(_, value) {
                                      if (!value || value.trim() === '') {
                                        return Promise.reject(new Error('Lý do trả hàng là bắt buộc.'));
                                      }
                                      return Promise.resolve();
                                    },
                                  }),
                                ]}
                              >
                                <Input
                                  className="w-[100%] !text-gray-500 px-3 py-2 !bg-white rounded-[10px] border border-gray-200 focus:!shadow-none focus:!border-gray-200"
                                  placeholder="Nhập lý do"
                                  type="text"
                                />
                              </Form.Item>
                            </div>
                          </Col>
                        </div>
                        {isShowSelectProduct && window.innerWidth >= 640 && (
                          <div className=" items-center w-[70%] mb-4 goodReturn-info-create-bellow ">
                            <Col span={24} sm={12} md={15} className="goods-return-section-info-col">
                              <div className="grid grid-cols-[190px_minmax(180px,_1fr)] items-center goods-return-info-section col-span-5/8">
                                <span className="font-normal text-black text-base">Đối tác: </span>
                                <Select
                                  className="w-[100%] h-[36px] rounded-[10px]  supplier-good-return-select mr-6 mb-4"
                                  placeholder="Chọn đối tác"
                                  optionFilterProp="children"
                                  options={[
                                    {
                                      value: 'BALANCE',
                                      label: 'Balance',
                                    },
                                    {
                                      value: 'NON_BALANCE',
                                      label: 'Non_Balance',
                                    },
                                  ]}
                                  onChange={async (e) => {
                                    setValueSupplier();
                                    setEnableNcc(false);
                                    let data;
                                    setValueSupplierWhenChoosePartner([]);
                                    if (e === 'BALANCE') {
                                      setSupplierType(e);
                                      data = await GoodsReturnService.getListSupplierWhenChoose({
                                        page: 1,
                                        perPage: 9999,
                                        idSuppiler: storeId,
                                      });
                                    } else if (e === 'NON_BALANCE') {
                                      setSupplierType(e);
                                      data = await GoodsReturnService.getListSupplierWhenChooseNonBal({
                                        page: 1,
                                        perPage: 9999,
                                        storeId,
                                        supplierType: 'NON_BALANCE',
                                      });
                                    }
                                    setValueSupplierWhenChoosePartner(data.data);
                                    setArrayProductlist([]);
                                  }}
                                ></Select>
                              </div>
                            </Col>
                          </div>
                        )}
                      </Row>
                    ) : (
                      <Row
                        gutter={{
                          xs: 8,
                          sm: 16,
                          md: 24,
                          lg: 32,
                        }}
                      >
                        <Col span={24} lg={12}>
                          <div className="mb-4 grid grid-cols-[180px_minmax(180px,_1fr)] goods-return-info-section">
                            <span className="font-normal text-black text-base">Mã trả hàng:</span>
                            <span className="font-normal text-base text-gray-500">{data?.data?.code || ''}</span>
                          </div>
                        </Col>
                        {/* thời gian trả hàng  */}
                        {/* {data?.data?.status !== 'INPROCESS' && billCode === undefined && (
                          <Col span={24} lg={12}>
                            <div
                              className={`mb-4 grid grid-cols-[180px_minmax(180px,_1fr)] goods-return-info-section opacity-0 ${window.innerWidth < 640 && billCode === undefined ? 'hidden' : ''
                                } `}
                            >
                              <span className="font-normal text-black text-base">Mã trả hàng:</span>
                              <span className="font-normal text-base text-gray-500">{data?.data?.code || ''}</span>
                            </div>
                          </Col>
                        )} */}
                        {data?.data?.status === 'COMPLETED' && billCode !== undefined && (
                          <Col span={24} lg={12}>
                            <div className="mb-4 grid grid-cols-[180px_minmax(180px,_1fr)] goods-return-info-section">
                              <span className="font-normal text-black text-base">Mã nhập hàng: </span>
                              <span className="font-normal text-base text-gray-500">
                                {data?.data?.orderInvoice?.code || ''}
                              </span>
                            </div>
                          </Col>
                        )}
                        {data?.data?.status === 'INPROCESS' && billCode !== undefined && (
                          <Col span={24} lg={12}>
                            <div
                              className={`mb-4 grid grid-cols-[180px_minmax(180px,_1fr)] goods-return-info-section  ${
                                (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && billCode === undefined
                                  ? 'opacity-0'
                                  : ''
                              }`}
                            >
                              <span className="font-normal text-black text-base">Mã nhập hàng:</span>
                              <span className="font-normal text-base text-gray-500">
                                {data?.data?.orderInvoice?.code}
                              </span>
                            </div>
                          </Col>
                        )}
                        {data?.data?.status === 'INPROCESS' && billCode === undefined && (
                          <Col span={24} lg={12}>
                            <div className="mb-4 grid grid-cols-[180px_minmax(180px,_1fr)] hidden md:opacity-0 goods-return-info-section">
                              <span className="font-normal text-black text-base">Mã nhập hàng:</span>
                              <span className="font-normal text-base text-gray-500">
                                {data?.data?.orderInvoice?.code}
                              </span>
                            </div>
                          </Col>
                        )}
                        {/* tên cửa hàng */}
                        <Col span={24} lg={12}>
                          <div className="mb-4 grid grid-cols-[180px_minmax(180px,_1fr)] goods-return-info-section">
                            <span className="font-normal text-black text-base">Tên cửa hàng:</span>
                            <span className="font-normal text-base text-gray-500">{data?.data?.store?.name}</span>
                          </div>
                        </Col>
                        {/* nhà cung cấp */}
                        <Col span={24} lg={12}>
                          <div
                            className={`mb-4 grid grid-cols-[180px_minmax(180px,_1fr)] goods-return-info-section  ${
                              (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && billCode === undefined
                                ? 'opacity-0'
                                : ''
                            }`}
                          >
                            <span className="font-normal text-black text-base">Nhà cung cấp:</span>
                            <span className="font-normal text-base text-gray-500">
                              {data?.data?.detailProduct[0]?.supplier?.name}{' '}
                            </span>
                          </div>
                        </Col>
                        {/* thời gian trả hàng */}
                        {data?.data?.status !== 'INPROCESS' && (
                          <Col span={24} lg={12}>
                            <div className="mb-4 grid grid-cols-[180px_minmax(180px,_1fr)] items-center goods-return-info-section">
                              <>
                                <span className="font-normal text-black text-base">Thời gian trả hàng:</span>
                                <span className="font-normal text-base text-gray-500">
                                  {moment(data?.issuedAt).format('DD/MM/YYYY')}
                                </span>
                              </>
                            </div>
                          </Col>
                        )}
                        {(roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && (
                          <Col span={24} lg={12}>
                            <div className="mb-4 grid grid-cols-[180px_minmax(180px,_1fr)] items-center goods-return-info-section">
                              <>
                                <span className="font-normal text-black text-base">Lý do trả hàng:</span>
                                <span className="font-normal text-base text-gray-500">{data?.data?.reason}</span>
                              </>
                            </div>
                          </Col>
                        )}
                        {data?.data?.status === 'INPROCESS' && (
                          <Col span={24} lg={12}>
                            {((roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') &&
                              billCode === undefined) ||
                            roleCode === 'OWNER_STORE' ||
                            roleCode === 'ADMIN' ? (
                              <div className="mb-4 grid grid-cols-[180px_minmax(180px,_1fr)] items-center goods-return-info-section">
                                <span className="font-normal text-black text-base">Thời gian trả hàng:</span>
                                {pageType !== 'detail' ? (
                                  <Space direction="vertical" className="">
                                    <Form.Item
                                      name="importedAt"
                                      style={{
                                        margin: 0,
                                      }}
                                      rules={[
                                        {
                                          required: true,
                                          message: `Thời gian trả hàng là bắt buộc`,
                                        },
                                      ]}
                                      initialValue={moment()}
                                    >
                                      <DatePicker
                                        onChange={handleSelectDate}
                                        format="DD/MM/YYYY"
                                        className=" !w-[171px] !h-[36px] !bg-white !border-gray-200 !text-gray-500"
                                        disabledDate={(current) => {
                                          const date = new Date();
                                          return current && current.valueOf() >= date.setDate(date.getDate());
                                        }}
                                      />
                                    </Form.Item>
                                  </Space>
                                ) : (
                                  <span className="font-normal text-base text-gray-500">
                                    {moment(data?.data?.issuedAt).format('DD/MM/YYYY')}
                                  </span>
                                )}
                              </div>
                            ) : (
                              (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') &&
                              billCode === undefined && (
                                <div className="grid grid-cols-[180px_minmax(180px,_1fr)] items-center goods-return-info-section">
                                  <span className="font-normal text-black text-base">Lý do trả hàng:</span>
                                  <span className="font-normal text-base text-gray-500">{data?.data?.reason}</span>
                                </div>
                              )
                            )}
                          </Col>
                        )}
                        {roleCode !== 'OWNER_SUPPLIER' && roleCode !== 'DISTRIBUTOR' && (
                          <Col span={24} lg={12}>
                            <div className="mb-4 grid grid-cols-[180px_minmax(180px,_1fr)] items-center goods-return-info-section">
                              <span className="font-normal text-black text-base">Lý do trả hàng:</span>
                              {pageType !== 'detail' ? (
                                <Form.Item
                                  name="importedReason"
                                  style={{
                                    margin: 0,
                                  }}
                                  rules={[
                                    {
                                      required: true,
                                      message: `Lý do nhập hàng là bắt buộc`,
                                    },
                                  ]}
                                >
                                  <Input
                                    className="w-full  px-3 py-2 !bg-white rounded-[10px] border border-gray-200 focus:!shadow-none focus:!border-gray-200"
                                    placeholder="Nhập lý do"
                                    type="text"
                                  />
                                </Form.Item>
                              ) : (
                                <span className="font-normal text-base text-gray-500">{data?.data?.reason}</span>
                              )}
                            </div>
                          </Col>
                        )}
                      </Row>
                    )}
                  </div>
                  <div className="mt-4">
                    {+step === 2 || pageType === 'edit' || pageType === 'create' ? (
                      <div className="flex justify-between mb-2 flex-col lg:flex-row">
                        <h2 className="font-bold text-base text-teal-900 h-[24px] sm:text-left text-center">
                          Chi tiết trả hàng
                        </h2>
                        <div className="flex gap-3 justify-end items-center">
                          <SelectComp
                            type="list"
                            disabled={
                              pageType === 'detail' ||
                              (isShowSelectProduct === false && (pageType === 'create' || pageType === 'edit'))
                            }
                            defaultValue={filterTax}
                            className="w-wull sm:w-[245px] my-2"
                            value={filterTax}
                            allowClear={false}
                            placeHolder="Chọn thuế"
                            list={[
                              { label: 'Áp dụng thuế', value: taxApply.APPLY },
                              { label: 'Không áp dụng thuế', value: taxApply.NO_APPLY },
                            ]}
                            onChange={(value) => setFilterTax(value)}
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              if (importCoupon || billCode !== undefined) {
                                setLoading((prev) => ({ ...prev, loadingProduct: true }));
                                setImportCouponListModal([]);
                                setVisible(true);
                                const listProductId = arrayProductlist?.map((ele) => +ele?.orderLineItemId || +ele?.id);
                                const res = await GoodsReturnService.getListProductOrder({
                                  ...paramsReturn,
                                  perPage: 0,
                                  page: 0,
                                  orderId: dataSearchFollowCodeProduct?.orderId || idPut?.idOd,
                                  listProductId,
                                });
                                setImportCouponListModal(res?.data?.inventory);
                                setTotal(res?.count);
                                setLoading((prev) => ({ ...prev, loadingProduct: false }));
                              } else {
                                setVisibleNo(true);
                                setDataDelete([]);
                              }
                            }}
                            id="saveBtn"
                            className="w-[145px] sm:w-[173px] h-[44px] hover:bg-teal-700 bg-teal-900 text-white text-sm rounded-[10px] flex justify-center mt[16px] items-center gap-[10px]"
                          >
                            <svg
                              width="11"
                              height="12"
                              viewBox="0 0 11 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="hidden sm:inline-block"
                            >
                              <path
                                d="M10.1665 5.33464H6.1665V1.33464C6.1665 1.15782 6.09627 0.988255 5.97124 0.863231C5.84622 0.738207 5.67665 0.667969 5.49984 0.667969C5.32303 0.667969 5.15346 0.738207 5.02843 0.863231C4.90341 0.988255 4.83317 1.15782 4.83317 1.33464V5.33464H0.833171C0.65636 5.33464 0.48679 5.40487 0.361766 5.5299C0.236742 5.65492 0.166504 5.82449 0.166504 6.0013C0.166504 6.17811 0.236742 6.34768 0.361766 6.47271C0.48679 6.59773 0.65636 6.66797 0.833171 6.66797H4.83317V10.668C4.83317 10.8448 4.90341 11.0143 5.02843 11.1394C5.15346 11.2644 5.32303 11.3346 5.49984 11.3346C5.67665 11.3346 5.84622 11.2644 5.97124 11.1394C6.09627 11.0143 6.1665 10.8448 6.1665 10.668V6.66797H10.1665C10.3433 6.66797 10.5129 6.59773 10.6379 6.47271C10.7629 6.34768 10.8332 6.17811 10.8332 6.0013C10.8332 5.82449 10.7629 5.65492 10.6379 5.5299C10.5129 5.40487 10.3433 5.33464 10.1665 5.33464Z"
                                fill="white"
                              />
                            </svg>
                            <span>Thêm sản phẩm</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mb-2 flex-col lg:flex-row">
                        <h2 className="font-bold text-base text-teal-900 h-[24px]">Chi tiết trả hàng</h2>
                        <div className="flex gap-3 justify-end items-center">
                          <SelectComp
                            type="list"
                            disabled={pageType === 'detail' || (isShowSelectProduct === false && pageType === 'create')}
                            defaultValue={filterTax}
                            className="w-wull sm:w-[245px] my-2"
                            value={filterTax}
                            allowClear={false}
                            placeHolder="Chọn thuế"
                            list={[
                              { label: 'Áp dụng thuế', value: taxApply.APPLY },
                              { label: 'Không áp dụng thuế', value: taxApply.NO_APPLY },
                            ]}
                            onChange={(value) => setFilterTax(value)}
                          />
                        </div>
                      </div>
                    )}
                    {/* -----------------table trả hàng ----------------- */}
                    <TableGoodPrice
                      toggleAmount={toggleAmount}
                      handleDeleteKey={handleDeleteKey}
                      handleDeleteKeyNo={handleDeleteKeyNo}
                      step={step}
                      pageType={pageType}
                      isShowSelectProduct={isShowSelectProduct}
                      Form={Form}
                      setFieldsValue={form.setFieldsValue}
                      getFieldValue={form.getFieldValue}
                      itemChoose={itemChoose}
                      setItemChoose={setItemChoose}
                      arrayProductlist={arrayProductlist}
                      filterTax={filterTax}
                      unitChange={unitChange}
                      setUnitChange={setUnitChange}
                    />
                    {/* ----------------- Tổng tiền ----------------- */}

                    <MoneyTax
                      arrayProductlist={arrayProductlist}
                      pageType={pageType}
                      formatCurrency={formatCurrency}
                      filterTax={filterTax}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between mt-[22px] goodsReturn-button-group">
              <button
                onClick={() => {
                  if (pageType === 'create') {
                    setStep(1);
                    navigate(`${routerLinks('GoodReturn')}?step=1`);
                  }
                  if (pageType === 'edit' || pageType === 'detail') {
                    return window.history.back();
                  }
                }}
                className="w-[106px] h-[44px] hover:bg-teal-900 bg-white border-teal-900 hover:text-white text-teal-900  border-solid border
        text-sm rounded-[10px] text-teal-90 goodsReturn-back-button"
                id="backBtn"
              >
                Trở về
              </button>
              {((roleCode !== 'ADMIN' && data?.data?.status !== 'COMPLETED') ||
                (roleCode === 'OWNER_STORE' && data?.data?.status !== 'COMPLETED')) && (
                <div>
                  {((data?.data?.status === 'INPROCESS' && roleCode === 'OWNER_STORE') ||
                    pageType === 'create' ||
                    roleCode === 'OWNER_STORE' ||
                    data?.data?.status !== 'COMPLETED') && (
                    <div
                      className={`flex justify-end ${
                        pageType === 'detail'
                          ? 'goodsReturn-right-button-group-detailSide'
                          : 'goodsReturn-right-button-group'
                      } `}
                    >
                      {((pageType === 'create' && dataSearchFollowCodeProduct?.id) ||
                        (pageType === 'create' && isShowSelectProduct && arrayProductlist.length > 0)) && (
                        <button
                          disabled={disabledButon.disabledBtn}
                          onClick={() => {
                            setCreateExport(true);
                            form && form.submit();
                          }}
                          id="outBtn"
                          className="w-[185px] h-[44px] hover:bg-white bg-transparent border border-teal-900 text-teal-900 text-sm rounded-[10px] mr-4 goodsReturn-bill-export-button"
                        >
                          Xuất phiếu trả hàng
                        </button>
                      )}
                      {pageType === 'detail' && (
                        <button
                          disabled={disabledButon.disabledBtn}
                          onClick={async () => {
                            setLoading((prev) => ({ ...prev, loadingReturnNote: true }));
                            const res = await GoodsReturnService.exportBillDisposalWhenEdit(idProduct, billCode);
                            setLoading((prev) => ({ ...prev, loadingReturnNote: false }));
                            if (res) {
                              setDisabledButton((prev) => ({ ...prev, disabledBtn: false }));
                              const link = document.createElement('a');
                              link.href = window.URL.createObjectURL(new Blob([res], { type: res.type }));
                              link.target = '_blank';
                              link.download = `Phiếu trả hàng - Mã đơn: ${idPut.code}`;
                              document.body.appendChild(link);
                              link.click();
                              link?.parentNode?.removeChild(link);
                              if (type === '1') {
                                return navigate(routerLinks('ListOfStock'));
                              } else {
                                return navigate(routerLinks('GoodReturn'));
                              }
                              // return navigate(routerLinks('GoodReturn'));
                            }
                          }}
                          id="outBtn"
                          className="w-[185px] h-[44px] hover:bg-white bg-transparent border border-teal-900 text-teal-900 text-sm rounded-[10px] mr-4 goodsReturn-bill-export-button-Ndetail"
                        >
                          Xuất phiếu trả hàng
                        </button>
                      )}
                      {(pageType !== 'detail' && dataSearchFollowCodeProduct?.id) ||
                      (isShowSelectProduct && arrayProductlist?.length > 0) ? (
                        <button
                          type="submit"
                          onClick={() => {
                            const checkQuantity = arrayProductlist.filter((item) => {
                              return +item.quantityUnit > +item.inventoryProductUnits[unitChange].quantityBal;
                            });
                            SetCheckQuantity(checkQuantity);
                            setCreateExport(false);
                            form && form.submit();
                          }}
                          id="saveBtn"
                          className="w-[137px] h-[44px] hover:bg-teal-700 bg-teal-900 text-white text-sm rounded-[10px] goods-return-submit-button-createSide"
                        >
                          Lưu
                        </button>
                      ) : (
                        pageType === 'detail' &&
                        billCode !== undefined && (
                          <button
                            onClick={() => {
                              setIsShowSelectProduct(false);
                              navigate(
                                routerLinks('GoodReturnEdit') + `?id=${idProduct || data?.id}&step=2}` + `&type=${1}`,
                                {
                                  state: { billCode },
                                },
                              );
                              // navigate(`${routerLinks('GoodReturnEdit')}?id=${idProduct || data?.id}&step=2`, {
                              //   state: { billCode },
                              // });
                            }}
                            id="editBtn"
                            className="w-[156px] h-[44px] bg-teal-900 text-white text-sm rounded-[10px] edit-goodsReturn-button"
                          >
                            Chỉnh sửa
                          </button>
                        )
                      )}
                      {pageType === 'detail' && billCode === undefined && (
                        <button
                          onClick={() => {
                            setListProduct([]);
                            navigate(
                              routerLinks('GoodReturnEdit') + `?id=${idProduct || data?.id}&step=2}` + `&type=${1}`,
                              {
                                state: { billCode },
                              },
                            );
                            setIsShowSelectProduct(true);
                          }}
                          id="editBtn"
                          className="w-[156px] h-[44px] bg-teal-900 text-white text-sm rounded-[10px] edit-goodsReturn-button"
                        >
                          Chỉnh sửa
                        </button>
                      )}
                      {pageType === 'edit' && (
                        <button
                          onClick={() => {
                            const checkQuantity = arrayProductlist.filter((item) => {
                              return +item.quantityUnit > +item.inventoryProductUnits[unitChange].quantityBal;
                            });
                            SetCheckQuantity(checkQuantity);
                            form && form.submit();
                          }}
                          id="saveBtn"
                          className="w-[156px] h-[44px] bg-teal-900 text-white text-sm rounded-[10px] goods-return-save-button"
                        >
                          Lưu
                        </button>
                      )}
                      {pageType === 'detail' && (
                        <button
                          onClick={() => handleDelete(idProduct)}
                          id="deleteBtn"
                          className="w-[84px] h-[44px] bg-red-600 text-white text-sm rounded-[10px] ml-4 goods-return-delete-button"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
              {data?.data?.status === 'COMPLETED' && (
                <button
                  onClick={async () => {
                    setLoading((prev) => ({ ...prev, loadingReturnNote: true }));
                    const NoteKey = dataOrderInvoice?.url;
                    if (NoteKey) {
                      const responsive = await GoodsReturnService.downloadBillDisposalWhenCreateWithKey(NoteKey);
                      const link = document.createElement('a');
                      link.href = window.URL.createObjectURL(new Blob([responsive], { type: responsive.type }));
                      link.target = '_blank';
                      link.download = `Phiếu trả hàng - Mã đơn: ${dataOrderInvoice.code}`;
                      document.body.appendChild(link);
                      link.click();
                      link?.parentNode?.removeChild(link);
                    }
                    setLoading((prev) => ({ ...prev, loadingReturnNote: false }));
                  }}
                  id="outBtn"
                  className="w-[185px] h-[44px] hover:bg-white bg-transparent border border-teal-900 text-teal-900 text-sm rounded-[10px] mr-4 goodsReturn-bill-export-button"
                >
                  In phiếu trả hàng
                </button>
              )}
            </div>
          </Form>
          {/* ModalImportCoupon theo phiếu nhập hàng */}
          <ModalImportCoupon
            visible={visible}
            setVisible={setVisible}
            hasMoreImport={hasMoreImport}
            paramsReturn={paramsReturn}
            setParamsReturn={setParamsReturn}
            setImportCouponListModal={setImportCouponListModal}
            importCouponListModal={importCouponListModal}
            arrayProductlist={arrayProductlist}
            setArrayProductlist={setArrayProductlist}
            setStop={setStop}
            setLoading={setLoading}
            loading={loading.loadingProduct}
          />
          {/* ModalNoImportCoupon không theo phiếu nhập hàng */}
          <ModalNoImportCoupon
            visibleNo={visibleNo}
            setVisibleNo={setVisibleNo}
            setLoad={setLoad}
            arrMap={arrMap}
            load={load}
            setLoading={setLoading}
            paramsReturn={paramsReturn}
            setParamsReturn={setParamsReturn}
            listProduct={listProduct}
            remainingListProduct={remainingListProduct}
            disabled={disabled}
            setDisabled={setDisabled}
            setStop={setStop}
            loading={loading.loadingProduct}
            stop={stop}
            hasMore={hasMore}
            step={step}
            setArrayProductlist={setArrayProductlist}
            arrayProductlist={arrayProductlist}
            dataSearchFollowCodeProduct={dataSearchFollowCodeProduct}
            setListProduct={setListProduct}
            itemChoose={itemChoose}
            setItemChoose={setItemChoose}
            remainingListProductList={remainingListProductList}
            setRemainingListProductList={setRemainingListProductList}
            dataDelete={dataDelete}
            setDataDelete={setDataDelete}
          />
          <Modal
            title={false}
            centered
            open={showModalCheckQuantity}
            width={831}
            onCancel={() => SetShowModalCheckQuantity(false)}
            wrapClassName={'modal-add-good-return'}
            footer={
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    SetShowModalCheckQuantity(false);
                  }}
                  className="w-[126px] h-[44px] bg-white border-2 border-radius border-teal-900 text-teal-900 text-sm rounded-[10px]"
                >
                  Nhập lại
                </button>
                {/* <button
                  onClick={() => {
                    form && form.submit();
                    setCheckDataQuantitySubmit(true);
                  }}
                  id="add"
                  className="w-[126px] h-[44px] bg-red-600 text-white text-sm rounded-[10px]"
                >
                  Đồng ý
                </button> */}
              </div>
            }
          >
            <div>
              <div className="abc">
                <TableGoodReturnQuantity
                  listArrcheckQuantity={listArrcheckQuantity}
                  pageType={pageType}
                  unitChange={unitChange}
                />
              </div>
            </div>
          </Modal>
        </div>
      )}
    </Fragment>
  );
};
export default Page;
