import React, { useState, Fragment, useEffect, useRef } from 'react';
import { Form as FormAnt, Input, Radio, Space } from 'antd';
import {
  ColumnEmptyForm,
  ColumnProductGeneralForm,
  ColumnProductStatus2Form,
  ColumnProductStatusForm,
} from 'columns/product';
import { v4 as uuidv4 } from 'uuid';
import { Form, Message, Spin, Upload } from 'components';
import { useAuth } from 'global';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { ProductService } from 'services/product';
import { routerLinks } from 'utils';
import ProductDiscountByMoney from './components/productDiscountByMoney';
import ProductDiscountByPercent from './components/productDiscountByPercent';
import ProductPrice from './components/productPrice';
import WrapImagesComponent from './components/warpImages';
import './index.less';
import useDebounce from './helper/useDebounce';
import { CategoryService } from 'services/category';
import { UtilService } from 'services/util';
import TableInformationOrder from './components/tableInfomationOrder';
import {
  blockInvalidCharForPercent,
  convertDecimal,
  convertDecimalStr,
  deleteProduct,
  handleReject,
  discountType,
  isNullOrUndefinedOrEmpty,
} from './func';
import CategoryContainer from './components/CategoryContainer';
import PurchaseUnit from './components/PurchaseUnit';

const Page = () => {
  const [form] = FormAnt.useForm();
  const location = useLocation();
  const { user, formatDate } = useAuth();
  const supplierName = user?.userInfor?.subOrgName;
  const roleCode = user?.userInfor?.roleCode;
  const subOrgId = user?.userInfor?.subOrgId;
  const [loading, setLoading] = useState(false);
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const idProduct = urlSearch.get('id');
  const productType = urlSearch.get('type');
  const view = urlSearch.get('view') ?? '';
  const [step, setStep] = useState(urlSearch.get('step') || 2);
  const [data, setData] = useState({
    supplierName,
  });
  const inputRef = useRef(null);
  const [isUserSubmit, setIsUserSubmit] = useState(false);
  const [setListImage, listImage, WrapImagesJsx, isListImageMain] = WrapImagesComponent({
    canEdit: pageType !== 'detail',
    isUserSubmit,
    pageType,
  });

  const [isDisabled, setIsDisabled] = useState(false);
  const [isValidate, setIsValidate] = useState({ tablePrice: false, tableRevenue: false, category: false });
  const [valueDiscountType, setValueDiscountType] = useState(discountType.FIXED_DISCOUNT);
  const [valueDiscountFlexible, setValueDiscountFlexible] = useState(discountType.DISCOUNT_BY_PERCENT);
  const [priceArr, setPriceArr] = useState([
    {
      key: 1,
      priceType: '',
      minQuantity: undefined,
      price: undefined,
    },
  ]);

  const [revenueArr, setRevenueArr] = useState([
    {
      key: 1,
      revenue: undefined,
      percentBalance: undefined,
    },
  ]);

  const [revenueMoneyArr, setRevenueMoneyArr] = useState([
    {
      key: 1,
      revenue: undefined,
      amountBalance: undefined,
    },
  ]);
  const [purchaseUnit, setPurchaseUnit] = useState([
    {
      key: 1,
      unit: undefined,
      coefficient: undefined,
      price: undefined,
      // barcode: undefined
      basePrice: undefined,
      code: null,
    },
  ]);

  const [purchasePrice, setPurchasePrice] = useState('');

  const [fixedDiscount, setFixedDiscount] = useState('');

  const [dataCategory, setDataCategory] = useState({
    dataCategoryMain: [],
    dataCategory1: [],
    dataCategory2: [],
    dataCategory3: [],
    dataCategory4: [],
  });

  const [idCategory, setIdCategory] = useState({
    idCategoryMain: '',
    idCategory1: '',
    idCategory2: '',
    idCategory3: '',
    idCategory4: '',
  });
  const [isLoad, setIsLoad] = useState({
    loadingMain: false,
    loading1: false,
    loading2: false,
    loading3: false,
    loading4: false,
  });
  const [categorySubmit, setCategorySubmit] = useState('');
  const [InputSeach, setInputSearch] = useState({
    search: '',
    search1: '',
    search2: '',
    search3: '',
    search4: '',
  });

  const [disabledStep, setDisabledStep] = useState(true);
  const searchDebounce = useDebounce(InputSeach.search, 500);
  const searchDebounce1 = useDebounce(InputSeach.search1, 500);
  const searchDebounce2 = useDebounce(InputSeach.search2, 500);
  const searchDebounce3 = useDebounce(InputSeach.search3, 500);
  const searchDebounce4 = useDebounce(InputSeach.search4, 500);

  const [informationOrder, setInformationOrder] = useState([]);
  const [categoryArr, setCategoryArr] = useState(['', '', '', '', '']);
  const [listSupplierOfStore, setListSupplierOfStore] = useState([]);

  const tempInfo = useRef(informationOrder);

  useEffect(() => {
    tempInfo.current = informationOrder;
  }, [informationOrder]);

  useEffect(() => {
    setTimeout(() => {
      import('glightbox').then(({ default: GLightbox }) => new GLightbox());
    });
  }, []);

  useEffect(() => {
    const initDataSupplier = async () => {
      if (roleCode === 'OWNER_STORE') {
        try {
          const res = await ProductService.getListSupplierOfStore({
            page: 1,
            perPage: 99,
            storeId: subOrgId,
            supplierType: 'NON_BALANCE',
          });
          setListSupplierOfStore(res.data);
        } catch (error) {
          return error;
        }
      }
    };
    initDataSupplier();
  }, []);
  useEffect(() => {
    if (categoryArr.filter((item) => !!item).length) {
      setIsValidate((prev) => ({ ...prev, category: false }));
    }
  }, [categoryArr]);
  useEffect(() => {
    const initDataCategory = async () => {
      setIsLoad((prev) => ({ ...prev, loadingMain: true }));
      try {
        const res = await CategoryService.get({ fullTextSearch: searchDebounce });
        setDataCategory((prev) => ({ ...prev, dataCategoryMain: res.data }));
      } catch (error) {
        return error;
      } finally {
        setIsLoad((prev) => ({ ...prev, loadingMain: false }));
      }
    };
    initDataCategory();
  }, [searchDebounce]);

  useEffect(() => {
    const initDataCategory = async () => {
      if (idCategory.idCategoryMain) {
        setIsLoad((prev) => ({ ...prev, loading1: true }));
        try {
          const res = await CategoryService.get({ id: idCategory.idCategoryMain, fullTextSearch: searchDebounce1 });
          if (res?.data?.length === 0) {
            setDisabledStep(false);
            setCategorySubmit(idCategory.idCategoryMain);
          } else {
            setDisabledStep(true);
          }
          setDataCategory((prev) => ({
            ...prev,
            dataCategory1: res.data,
            dataCategory2: [],
            dataCategory3: [],
            dataCategory4: [],
          }));
        } catch (error) {
          return error;
        } finally {
          setIsLoad((prev) => ({ ...prev, loading1: false }));
        }
      }
    };
    initDataCategory();
  }, [idCategory.idCategoryMain, searchDebounce1]);

  useEffect(() => {
    const initDataCategory = async () => {
      if (idCategory.idCategory1) {
        setIsLoad((prev) => ({ ...prev, loading2: true }));
        try {
          const res = await CategoryService.get({ id: idCategory.idCategory1, fullTextSearch: searchDebounce2 });
          if (res?.data?.length === 0) {
            setDisabledStep(false);
            setCategorySubmit(idCategory.idCategory1);
          } else {
            setDisabledStep(true);
          }
          setDataCategory((prev) => ({ ...prev, dataCategory2: res.data, dataCategory3: [], dataCategory4: [] }));
        } catch (error) {
          return error;
        } finally {
          setIsLoad((prev) => ({ ...prev, loading2: false }));
        }
      }
    };
    initDataCategory();
  }, [idCategory.idCategory1, searchDebounce2]);

  useEffect(() => {
    const initDataCategory = async () => {
      if (idCategory.idCategory2) {
        setIsLoad((prev) => ({ ...prev, loading3: true }));
        try {
          const res = await CategoryService.get({ id: idCategory.idCategory2, fullTextSearch: searchDebounce3 });
          if (res?.data?.length === 0) {
            setDisabledStep(false);
            setCategorySubmit(idCategory.idCategory2);
          } else {
            setDisabledStep(true);
          }
          setDataCategory((prev) => ({ ...prev, dataCategory3: res.data, dataCategory4: [] }));
        } catch (error) {
          return error;
        } finally {
          setIsLoad((prev) => ({ ...prev, loading3: false }));
        }
      }
    };
    initDataCategory();
  }, [idCategory.idCategory2, searchDebounce3]);

  useEffect(() => {
    const initDataCategory = async () => {
      if (idCategory.idCategory3) {
        setIsLoad((prev) => ({ ...prev, loading4: true }));
        try {
          const res = await CategoryService.get({ id: idCategory.idCategory3, fullTextSearch: searchDebounce4 });
          if (res?.data?.length === 0) {
            setDisabledStep(false);
            setCategorySubmit(idCategory.idCategory3);
          } else {
            setDisabledStep(true);
          }
          setDataCategory((prev) => ({ ...prev, dataCategory4: res.data }));
        } catch (error) {
          return error;
        } finally {
          setIsLoad((prev) => ({ ...prev, loading4: false }));
        }
      }
    };
    initDataCategory();
  }, [idCategory.idCategory3, searchDebounce4]);

  useEffect(() => {
    const initFunction = async () => {
      if (idProduct && roleCode) {
        try {
          setLoading(true);
          const res = await ProductService.getById(idProduct);
          setListImage(res?.photos);
          setPurchaseUnit(
            res?.retailPrice
              ?.map((item, index) => ({ ...item, key: index + 1 }))
              .sort((a, b) => a?.coefficient - b?.coefficient) ?? [],
          );
          setPurchasePrice(res?.sellingPrice ?? '');
          if (pageType === 'edit' || pageType === 'detail') {
            setCategorySubmit(res?.category?.child?.child?.child?.child?.id ?? '');
            setIdCategory((prev) => ({
              ...prev,
              idCategoryMain: res?.category?.id,
              idCategory1: res?.category?.child?.id,
              idCategory2: res?.category?.child?.child?.id,
              idCategory3: res?.category?.child?.child?.child?.id,
              idCategory4: res?.category?.child?.child?.child?.child?.id,
            }));

            setCategoryArr((prev) => {
              const arr = [...prev];
              arr[0] = res?.category;
              arr[1] = !res?.category?.child ? '' : res?.category?.child;
              arr[2] = !res?.category?.child?.child ? '' : res?.category?.child?.child;
              arr[3] = !res?.category?.child?.child?.child ? '' : res?.category?.child?.child?.child;
              arr[4] = !res?.category?.child?.child?.child?.child ? '' : res?.category?.child?.child?.child?.child;
              return arr;
            });
          }

          if (+res?.priceBalanceCommission?.[0]?.revenue === 0) {
            setValueDiscountType(discountType.FIXED_DISCOUNT);
            setFixedDiscount(res?.priceBalanceCommission?.[0]?.percentBalance);
          }
          if (+res?.priceBalanceCommission?.[0]?.revenue !== 0) {
            setValueDiscountType(discountType.FLEXIBLE_DISCOUNT);
            if (
              +res?.priceBalanceCommission?.[0]?.percentBalance !== 0 &&
              res?.priceBalanceCommission?.[0]?.amountBalance === null
            ) {
              setValueDiscountFlexible(discountType.DISCOUNT_BY_PERCENT);
              setRevenueArr(
                res?.priceBalanceCommission
                  ?.map((item, index) => ({ ...item, key: index + 1 }))
                  ?.sort((a, b) => +a?.revenue - +b?.revenue),
              );
            } else {
              setValueDiscountFlexible(discountType.DISCOUNT_BY_AMOUNT);
              setRevenueMoneyArr(
                res?.priceBalanceCommission
                  ?.map((item, index) => ({ ...item, key: index + 1 }))
                  ?.sort((a, b) => +a?.revenue - +b?.revenue),
              );
            }
          }
          setPriceArr(
            res?.productPrice
              ?.sort((a, b) => a?.minQuantity - b?.minQuantity)
              ?.map((item, index) => ({ ...item, key: index + 1 })),
          );
          setInformationOrder(res?.information);

          setData({
            ...res,
            retailPrice: res?.retailPrice.sort((a, b) => a?.coefficient - b?.coefficient),
            exportTaxId: res?.exportTax?.id ?? '',
            importTaxId: res?.importTax?.id ?? '',
            month: res?.abilitySupply?.month,
            quarter: res?.abilitySupply?.quarter,
            year: res?.abilitySupply?.year,
            supplierId: res?.subOrg?.id ?? '',
          });
        } catch (error) {
          setLoading(false);
          return error;
        } finally {
          setTimeout(() => setLoading(false), 200);
        }
      }
    };
    initFunction();
  }, [idProduct, formatDate, roleCode, pageType]);

  const submit = async (values) => {
    try {
      setIsUserSubmit(true);
      if (!listImage.filter(Boolean).length) return Message.error({ text: 'Hình ảnh không được để trống.' });
      if (isListImageMain()) return Message.error({ text: 'Sản phẩm phải có hình ảnh chính.' });
      if (categorySubmit === '') {
        return Message.error({ text: 'Vui lòng chọn danh mục trước khi chọn sản phẩm.' });
      }
      if (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') {
        if (
          priceArr.filter((item) => item.priceType === '' || item.priceType === undefined || item.priceType === null)
            .length
        ) {
          return Message.error({ text: 'Chủng loại giá là bắt buộc.' });
        }
        if (
          priceArr.filter(
            (item) => item.minQuantity === '' || item.minQuantity === undefined || item.minQuantity === null,
          ).length
        )
          return Message.error({ text: 'Số lượng tối thiểu là bắt buộc.' });
        // if (
        //   priceArr.filter(
        //     (item) =>
        //       +item.minQuantity === 0
        //   ).length
        // )
        //   return Message.error({ text: 'Vui lòng nhập số lượng tối thiểu lớn hơn 0.' });
        if (
          priceArr.filter(
            (item) => +item.price === 0 || +item.price === '' || item.price === undefined || item.price === null,
          ).length
        ) {
          return Message.error({ text: 'Giá bán là bắt buộc.' });
        }

        if (isValidate.tablePrice) return Message.error({ text: 'Số lượng tối thiểu phải lớn hơn số lượng vừa tạo.' });
        if (isValidate.tableRevenue) return Message.error({ text: 'Doanh thu phải lớn hơn doanh thu vừa tạo.' });

        if (informationOrder.filter((item) => item.content === null || item.content === undefined).length) {
          return Message.error({ text: 'Vui Lòng nhập nội dung của thông tin.' });
        }
      }
      values.description = values?.description ?? null;
      values.brand = values?.brand ?? null;
      delete values.storeName;
      delete values.shipmentAndExpirationDate;

      let res;
      switch (roleCode) {
        case 'OWNER_STORE': {
          const basicUnit = data?.basicUnit ?? form.getFieldValue('basicUnit');
          const isActive = !!purchaseUnit.find((e) => e.isActive);
          const isExistBasicUnit = !!purchaseUnit.find(
            (e) => e.unit?.trim().toLowerCase() === basicUnit.trim().toLowerCase(),
          );
          const baseCoefficient =
            isExistBasicUnit && purchaseUnit.length > 0
              ? +purchaseUnit.find((e) => e.unit.trim().toLowerCase() === basicUnit.trim().toLowerCase()).coefficient
              : null;
          if (pageType === 'edit') {
            if (purchasePrice === null || purchasePrice === undefined || purchasePrice === '')
              return Message.error({ text: 'Giá bán (VND) là bắt buộc.' });
            if (
              purchaseUnit.filter(
                (item) =>
                  isNullOrUndefinedOrEmpty(item.unit) ||
                  isNullOrUndefinedOrEmpty(item.coefficient) ||
                  isNullOrUndefinedOrEmpty(item.price),
              ).length
            ) {
              return Message.error({ text: 'Đơn vị là bắt buộc.' });
            }
            if (purchaseUnit.filter((item) => isNullOrUndefinedOrEmpty(item.coefficient)).length) {
              return Message.error({ text: 'Giá trị quy đổi là bắt buộc.' });
            }
            if (purchaseUnit.filter((item) => isNullOrUndefinedOrEmpty(item.price)).length) {
              return Message.error({ text: 'Giá bán là  bắt buộc.' });
            }
            if (!isExistBasicUnit && isActive) {
              return Message.error({ text: `Cần phải có đơn vị gốc (${basicUnit}).` });
            }
          }
          if (productType === 'NON_BALANCE') {
            const paramStore = {
              ...values,
              photos: listImage,
              categoryId: categorySubmit,
              quantity: values?.stockQuantity,
              storeBarcode: values?.storeBarcode ?? '',
              sellingPrice: purchasePrice,
              baseCoefficient: baseCoefficient,
              retailPrices: purchaseUnit.map((i, idx) => ({
                id: null,
                unit: i?.unit,
                coefficient: i.coefficient,
                basePrice: i.basePrice,
                price: i.price,
                barcode: i.barcode,
                code: i.code ?? null,
                isActive: i.isActive ?? false,
              })),
            };
            delete paramStore.stockQuantity;
            delete paramStore.barcodeNCC;
            setIsDisabled(true);
            pageType === 'create'
              ? (res = await ProductService.createProductNonBalance(paramStore))
              : (res = await ProductService.editProductNonBalance(paramStore, idProduct));
            setIsDisabled(false);
            if (res && pageType === 'create') {
              return navigate(`${routerLinks('Product')}?tab=2`);
            }
            if (res && pageType === 'edit') {
              return navigate(`${routerLinks('Product')}?tab=1`);
            }
            return;
          } else {
            const paramStore = {
              ...values,
              photos: listImage,
              categoryListId: [categorySubmit],
              abilitySupply: JSON.stringify({
                month: values?.month ?? null,
                year: values?.year ?? null,
                quarter: values?.quarter ?? null,
              }),
              exportMarket: values?.exportMarket ?? null,
              approveStatus: 'APPROVED',
              sellingPrice: purchasePrice,
              baseCoefficient: baseCoefficient,
              retailPrices: purchaseUnit.map((i, idx) => ({
                id: null,
                unit: i?.unit,
                coefficient: i.coefficient,
                basePrice: i.basePrice,
                price: i.price,
                barcode: i.barcode,
                code: i.code ?? null,
                isActive: i.isActive ?? false,
              })),
            };
            delete paramStore.stockQuantity;
            delete paramStore.barcodeNCC;
            setIsDisabled(true);
            pageType === 'create'
              ? (res = await ProductService.post(paramStore))
              : (res = await ProductService.put(paramStore, idProduct));
            setIsDisabled(false);
            if (res) {
              return navigate(`${routerLinks('Product')}?tab=1`);
            }
            return;
          }
        }
        case 'OWNER_SUPPLIER' || 'DISTRIBUTOR': {
          if (valueDiscountType === discountType.FIXED_DISCOUNT) {
            if (fixedDiscount === '' || fixedDiscount === null || fixedDiscount === undefined)
              return Message.error({ text: 'Chiết khấu cố định là bắt buộc.' });
            const param = {
              ...values,
              photos: listImage,
              productPrice: [
                ...priceArr
                  .map((item) => ({
                    priceType: item?.priceType,
                    minQuantity: +item?.minQuantity,
                    price: +item?.price,
                  }))
                  .sort((a, b) => a?.minQuantity - b?.minQuantity),
              ],
              priceBalanceCommission: [{ revenue: 0, percentBalance: convertDecimal(fixedDiscount) }],
              categoryListId: [categorySubmit],
              productInformation: [...informationOrder.map((item) => ({ content: item.content, url: item.url }))],
              abilitySupply: JSON.stringify({
                month: values?.month ?? null,
                year: values?.year ?? null,
                quarter: values?.quarter ?? null,
              }),
              exportMarket: values?.exportMarket ?? null,
              sellingPrice: purchasePrice,
              retailPrices: purchaseUnit.map((i, idx) => ({
                id: null,
                unit: i?.unit,
                coefficient: i.coefficient,
                basePrice: i.basePrice,
                price: i.price,
                barcode: i.barcode ?? '',
                code: i.code ?? null,
                isActive: i.isActive ?? false,
              })),
            };
            setIsDisabled(true);
            pageType === 'create'
              ? (res = await ProductService.post(param))
              : (res = await ProductService.put(param, idProduct));
            setIsDisabled(false);
          } else {
            if (valueDiscountFlexible === discountType.DISCOUNT_BY_PERCENT) {
              if (
                revenueArr.filter(
                  (item) =>
                    +item.revenue === '' || +item.revenue === 0 || item.revenue === null || item.revenue === undefined,
                ).length
              )
                return Message.error({ text: 'Doanh thu là bắt buộc.' });
              if (
                revenueArr.filter(
                  (item) =>
                    +item.percentBalance === '' ||
                    +item.percentBalance === 0 ||
                    item.percentBalance === null ||
                    item.percentBalance === undefined,
                ).length
              )
                return Message.error({ text: 'Chiết khấu theo doanh thu (%) là bắt buộc.' });
              const param = {
                ...values,
                photos: listImage,
                productPrice: [
                  ...priceArr
                    .map((item) => ({
                      priceType: item?.priceType,
                      minQuantity: +item?.minQuantity,
                      price: +item?.price,
                    }))
                    .sort((a, b) => a?.minQuantity - b?.minQuantity),
                ],
                priceBalanceCommission: [
                  ...revenueArr.map((item) => ({
                    revenue: +item?.revenue,
                    percentBalance: convertDecimal(item?.percentBalance),
                  })),
                ],
                categoryListId: [categorySubmit],
                productInformation: [...informationOrder.map((item) => ({ content: item.content, url: item.url }))],
                abilitySupply: JSON.stringify({ month: values?.month, year: values?.year, quarter: values?.quarter }),
                exportMarket: values?.exportMarket,
                sellingPrice: purchasePrice,
                retailPrices: purchaseUnit.map((i, idx) => ({
                  id: null,
                  unit: i?.unit,
                  coefficient: i.coefficient,
                  basePrice: i.basePrice,
                  price: i.price,
                  barcode: i.barcode ?? '',
                  code: i.code ?? null,
                  isActive: i.isActive ?? false,
                })),
              };
              setIsDisabled(true);
              pageType === 'create'
                ? (res = await ProductService.post(param))
                : (res = await ProductService.put(param, idProduct));
              setIsDisabled(false);
            }
            if (valueDiscountFlexible === discountType.DISCOUNT_BY_AMOUNT) {
              if (
                revenueMoneyArr.filter(
                  (item) =>
                    +item.revenue === '' ||
                    (+item.revenue === 0) | (item.revenue === null) ||
                    item.revenue === undefined,
                ).length
              )
                return Message.error({ text: 'Doanh thu là bắt buộc.' });
              if (
                revenueMoneyArr.filter(
                  (item) =>
                    +item.amountBalance === '' ||
                    +item.amountBalance === 0 ||
                    item.amountBalance === null ||
                    item.amountBalance === undefined,
                ).length
              )
                return Message.error({ text: 'Số tiền chiết khấu (VNĐ) là bắt buộc.' });

              const param = {
                ...values,
                photos: listImage,
                productPrice: [
                  ...priceArr
                    .map((item) => ({
                      priceType: item?.priceType,
                      minQuantity: +item?.minQuantity,
                      price: +item?.price,
                    }))
                    .sort((a, b) => a?.minQuantity - b?.minQuantity),
                ],
                priceBalanceCommission: [
                  ...revenueMoneyArr.map((item) => ({ revenue: +item?.revenue, amountBalance: +item?.amountBalance })),
                ],
                categoryListId: [categorySubmit],
                productInformation: [...informationOrder.map((item) => ({ content: item.content, url: item.url }))],
                abilitySupply: JSON.stringify({ month: values?.month, year: values?.year, quarter: values?.quarter }),
                exportMarket: values?.exportMarket,
                sellingPrice: purchasePrice,
                retailPrices: purchaseUnit.map((i, idx) => ({
                  id: null,
                  unit: i?.unit,
                  coefficient: i.coefficient,
                  basePrice: i.basePrice,
                  price: i.price,
                  barcode: i.barcode ?? '',
                  code: i.code ?? null,
                  isActive: i.isActive ?? false,
                })),
              };
              setIsDisabled(true);
              pageType === 'create'
                ? (res = await ProductService.post(param))
                : (res = await ProductService.put(param, idProduct));
              setIsDisabled(false);
            }
          }
          setLoading(false);
          if (res && pageType === 'create') {
            return navigate(`${routerLinks('Product')}?tab=2`);
          }
          if (res && pageType === 'edit') {
            return navigate(`${routerLinks('Product')}?tab=2`);
          }
          return;
        }
        default:
          return roleCode;
      }
    } catch (err) {
      setLoading(false);
      return err;
    } finally {
      setIsDisabled(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }

  return (
    <Fragment>
      {pageType !== 'detail' && +step === 1 && (
        <div className="h-screen mb-[100px]">
          <CategoryContainer
            pageType={pageType}
            isLoad={isLoad}
            idCategory={idCategory}
            dataCategory={dataCategory}
            setDataCategory={setDataCategory}
            setIdCategory={setIdCategory}
            setInputSearch={setInputSearch}
            disabledStep={disabledStep}
            setDisabledStep={setDisabledStep}
            setCategorySubmit={setCategorySubmit}
            data={data}
            categoryArr={categoryArr}
            setCategoryArr={setCategoryArr}
          />
          <div className="flex justify-between mt-6 button-product-group">
            <button
              onClick={() => window.history.back()}
              className="px-8 py-3 h-[44px] text-sm bg-white-500 border-teal-900 hover:border-teal-600 border-solid border rounded-[10px] text-teal-900 hover:text-teal-600 back-product-button"
              id="backBtn"
            >
              Trở về
            </button>
            <button
              onClick={() => {
                setStep(2);
                if (productType === 'NON_BALANCE') {
                  if (pageType === 'create') {
                    window.scrollTo(0, 0);
                    return navigate(`${routerLinks('ProductCreate')}?type=NON_BALANCE&step=2`);
                  }
                  if (pageType === 'edit') {
                    window.scrollTo(0, 0);
                    return navigate(
                      `${routerLinks('ProductEdit')}?id=${idProduct || data?.id}&type=NON_BALANCE&step=2`,
                    );
                  } else {
                    if (pageType === 'create') {
                      window.scrollTo(0, 0);
                      return navigate(`${routerLinks('ProductCreate')}?step=2`);
                    }
                    if (pageType === 'edit') {
                      window.scrollTo(0, 0);
                      return navigate(`${routerLinks('ProductEdit')}?id=${idProduct || data?.id}&step=2`);
                    }
                  }
                }
                window.scrollTo(0, 0);
              }}
              disabled={disabledStep}
              className="w-[133px] h-[44px] text-sm bg-teal-900 text-white border-teal-900 hover:border-teal-600 border-solid border rounded-[10px]"
              id="continueBtn"
            >
              Tiếp theo
            </button>
          </div>
        </div>
      )}
      {(+step === 2 || pageType === 'detail') && (
        <div>
          <div className="min-h-screen product-merchandise-detail">
            <p className="text-2xl text-teal-900">
              {pageType === 'detail' && (
                <button
                  className="h-10 w-10 bg-teal-900 text-white rounded-lg mr-2"
                  onClick={() => window.history.back()}
                >
                  <i className="las la-arrow-left"></i>
                </button>
              )}
              {pageType === 'create' ? 'Thêm sản phẩm' : pageType === 'edit' ? 'Chỉnh sửa sản phẩm' : 'Sản phẩm'}
            </p>
            <div
              className={`bg-white px-6 pt-[26px] rounded-xl mt-5 pb-[35px] relative product-display ${
                pageType !== 'detail' ? 'label-required' : null
              }`}
            >
              <div className="flex product-detail-form">
                {/* Left form */}
                <div className="w-full sm:w-full xl:w-1/4 flex product-detail-left-form">
                  {/* image */}
                  <div className="mb-2">{WrapImagesJsx()}</div>

                  {/* product status */}
                  <div className="bg-white pr-2 rounded-xl relative  warpProductImg">
                    {/* <div>
                      <p className="text-xl font-bold text-teal-900 py-4">Tình trạng sản phẩm</p>
                    </div> */}
                    <div className="flex ">
                      <Form
                        className="w-full"
                        columns={ColumnProductStatusForm({ pageType, roleCode, productType })}
                        handSubmit={submit}
                        values={data}
                        form={form}
                        isResetForm={false}
                      />
                    </div>
                    {pageType === 'detail' && (
                      <>
                        {(roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && (
                          <div>
                            <p className="text-xl font-bold text-teal-900 pb-2">Trạng thái sản phẩm</p>
                            {data?.approveStatus === 'WAITING_APPROVE' && (
                              <p className="font-normal text-base text-yellow-500 flex items-center">
                                {' '}
                                <i className="las la-tags text-lg mr-2"></i>Chờ phê duyệt
                              </p>
                            )}
                            {data?.approveStatus === 'APPROVED' && (
                              <p className="font-normal text-base text-green-600 flex items-center">
                                {' '}
                                <i className="las la-tags text-lg mr-2"></i>Đang bán
                              </p>
                            )}
                            {data?.approveStatus === 'STOP_SELLING' && (
                              <p className="font-normal text-base text-red-500 flex items-center">
                                <i className="las la-tags text-lg mr-2"></i>Ngưng bán
                              </p>
                            )}
                            {data?.approveStatus === 'REJECTED' && (
                              <>
                                <p className="font-normal text-base text-blue-500 flex items-center">
                                  <i className="las la-tags text-lg mr-2"></i>Từ chối
                                </p>
                                <p className="text-xl font-bold text-teal-900 pb-2 pt-4">Lý do</p>
                                <p className="text-sm font-normal text-gray-700 whitespace-pre-line">
                                  {data?.rejectReason}
                                </p>
                              </>
                            )}
                            {data?.approveStatus === 'CANCELLED' && (
                              <>
                                <p className="font-normal text-base text-black-500 flex items-center">
                                  <i className="las la-tags text-lg mr-2"></i>Đã hủy
                                </p>
                              </>
                            )}
                          </div>
                        )}
                        {roleCode === 'ADMIN' && productType !== 'NON_BALANCE' && (
                          <div>
                            <p className="text-xl font-bold text-teal-900 pb-2">Trạng thái sản phẩm</p>
                            {data?.approveStatus === 'WAITING_APPROVE' && (
                              <p className="font-normal text-base text-yellow-500 flex items-center">
                                {' '}
                                <i className="las la-tags text-lg mr-2"></i>Chờ phê duyệt
                              </p>
                            )}
                            {data?.approveStatus === 'APPROVED' && (
                              <p className="font-normal text-base text-green-600 flex items-center">
                                {' '}
                                <i className="las la-tags text-lg mr-2"></i>Đang bán
                              </p>
                            )}
                            {data?.approveStatus === 'STOP_SELLING' && (
                              <p className="font-normal text-base text-orange-600 flex items-center">
                                <i className="las la-tags text-lg mr-2"></i>Ngưng bán
                              </p>
                            )}
                            {data?.approveStatus === 'REJECTED' && (
                              <>
                                <p className="font-normal text-base text-red-600 flex items-center">
                                  <i className="las la-tags text-lg mr-2"></i>Đã Từ chối
                                </p>
                                <p className="text-xl font-bold text-teal-900 pb-2 pt-4">Lý do</p>
                                <p className="text-sm font-normal text-gray-700 whitespace-pre-wrap">
                                  {data?.rejectReason}
                                </p>
                              </>
                            )}
                            {data?.approveStatus === 'CANCELLED' && (
                              <>
                                <p className="font-normal text-base text-black-500 flex items-center">
                                  <i className="las la-tags text-lg mr-2"></i>Đã hủy
                                </p>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}
                    {pageType === 'edit' && (
                      <>
                        {(roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') &&
                          data?.approveStatus !== 'REJECTED' && (
                            <div>
                              <p className="text-xl font-bold text-teal-900 pb-4">Trạng thái sản phẩm</p>
                              <Form
                                className="w-full"
                                columns={ColumnProductStatus2Form({ pageType })}
                                handSubmit={submit}
                                values={data}
                                form={form}
                                isResetForm={false}
                              />
                            </div>
                          )}
                        {(roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && data?.approveStatus === 'REJECTED' && (
                          <>
                            <p className="font-normal text-base text-blue-500 flex items-center">
                              <i className="las la-tags text-lg mr-2"></i>Từ chối
                            </p>
                            <p className="text-xl font-bold text-teal-900 pb-2 pt-4">Lý do</p>
                            <p className="text-sm font-normal text-gray-700">{data?.rejectReason}</p>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="w-full xl:w-3/4">
                  <div className="bg-whit rounded-[10px] relative">
                    <div>
                      <p className="text-lg sm:text-xl font-bold text-teal-900 pb-4">Tổng quát</p>
                    </div>
                    <div className="flex ">
                      <Form
                        className="w-full form-price"
                        columns={ColumnProductGeneralForm({
                          pageType,
                          categoryArr,
                          navigate,
                          setStep,
                          idProduct,
                          roleCode,
                          listSupplierOfStore,
                          productType,
                          data,
                          setPurchaseUnit,
                        })}
                        handSubmit={submit}
                        checkHidden={true}
                        classGroupButton={'absolute justify-end items-end mt-10 right-0 submit-btn text-sm'}
                        values={data}
                        form={form}
                        isResetForm={false}
                      />
                    </div>
                  </div>
                  {/* product detail */}
                  {roleCode === 'ADMIN' && view === 'VIEWSTORE' && productType !== 'NON_BALANCE' && (
                    <>
                      <hr className="h-[0.25px] w-full bg-gray-200 " />
                      <PurchaseUnit
                        purchaseUnit={purchaseUnit}
                        pageType={pageType}
                        setPurchaseUnit={setPurchaseUnit}
                        setDataSource={setData}
                        setPurchasePrice={setPurchasePrice}
                        purchasePrice={purchasePrice}
                        basicUnit={data?.basicUnit ?? form.getFieldValue('basicUnit')}
                      />
                    </>
                  )}

                  {roleCode === 'ADMIN' && view === 'VIEWSTORE' && productType === 'NON_BALANCE' && (
                    <>
                      <hr className="h-[0.25px] w-full bg-gray-200 " />
                      <PurchaseUnit
                        purchaseUnit={purchaseUnit}
                        pageType={pageType}
                        setPurchaseUnit={setPurchaseUnit}
                        setDataSource={setData}
                        setPurchasePrice={setPurchasePrice}
                        purchasePrice={purchasePrice}
                        basicUnit={data?.basicUnit ?? form.getFieldValue('basicUnit')}
                      />
                    </>
                  )}

                  {roleCode !== 'OWNER_STORE' && productType !== 'NON_BALANCE' && (
                    <div className="bg-white rounded-xl relative product-price-table">
                      <div className="block">
                        <ProductPrice
                          priceArr={priceArr}
                          setPriceArr={setPriceArr}
                          pageType={pageType}
                          setIsValidate={setIsValidate}
                        />
                      </div>
                      <div className="w-full radio-discount ">
                        <p className="text-lg sm:text-xl font-bold text-teal-900 mt-4 mb-4">Chiết khấu với Balance</p>
                        <Radio.Group
                          className="w-full"
                          onChange={(e) => setValueDiscountType(e.target.value)}
                          value={valueDiscountType}
                        >
                          <Space direction="vertical">
                            <Radio
                              value={discountType.FIXED_DISCOUNT}
                              className="mb-4 discount-fixed text-base !text-gray-900"
                              disabled={pageType === 'detail'}
                            >
                              Chiết khấu cố định
                              <br />
                              {valueDiscountType === discountType.FIXED_DISCOUNT && (
                                <div className="flex items-center mt-4">
                                  <span>Đề nghị chiết khấu cố định</span>
                                  <Input
                                    className="bg-white border !not-sr-only border-gray-200 !ml-4 !rounded-[10px] !h-[44px] !w-[181px] !px-2 focus:!shadow-none focus:!border-gray-200 "
                                    readOnly={pageType === 'detail'}
                                    ref={inputRef}
                                    onKeyDown={(e) => blockInvalidCharForPercent(e, inputRef)}
                                    value={convertDecimalStr(fixedDiscount)}
                                    placeholder="Nhập giá trị"
                                    onChange={(e) => {
                                      setFixedDiscount(e.target.value);
                                    }}
                                  />{' '}
                                  <span className="ml-4">%</span>
                                </div>
                              )}
                            </Radio>
                            <Radio
                              value={discountType.FLEXIBLE_DISCOUNT}
                              className="text-base"
                              onClick={() => {
                                setFixedDiscount(0);
                              }}
                              disabled={pageType === 'detail'}
                            >
                              Chiết khấu linh động
                            </Radio>
                          </Space>
                          {valueDiscountType === discountType.FLEXIBLE_DISCOUNT && (
                            <Radio.Group
                              className="w-full mt-4"
                              onChange={(e) => {
                                setValueDiscountFlexible(e.target.value);
                                setFixedDiscount('');
                              }}
                              value={valueDiscountFlexible}
                            >
                              <Space direction="vertical" className="pl-5">
                                <Radio
                                  value={discountType.DISCOUNT_BY_PERCENT}
                                  className="mb-4 text-base"
                                  disabled={pageType === 'detail'}
                                >
                                  Chiết khấu theo %
                                </Radio>
                                <Radio
                                  value={discountType.DISCOUNT_BY_AMOUNT}
                                  className="text-base"
                                  disabled={pageType === 'detail'}
                                >
                                  Chiết khấu theo số tiền
                                </Radio>
                              </Space>
                              {valueDiscountFlexible === discountType.DISCOUNT_BY_PERCENT && (
                                <ProductDiscountByPercent
                                  setRevenueArr={setRevenueArr}
                                  revenueArr={revenueArr}
                                  pageType={pageType}
                                  setIsValidate={setIsValidate}
                                />
                              )}
                              {valueDiscountFlexible === discountType.DISCOUNT_BY_AMOUNT && (
                                <ProductDiscountByMoney
                                  setRevenueMoneyArr={setRevenueMoneyArr}
                                  revenueMoneyArr={revenueMoneyArr}
                                  pageType={pageType}
                                  setIsValidate={setIsValidate}
                                />
                              )}
                            </Radio.Group>
                          )}
                        </Radio.Group>
                      </div>
                    </div>
                  )}
                  <div className="product-price-table mt-4">
                    {(roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR')&& pageType === 'detail' && informationOrder?.length > 0 && (
                      <>
                        <div className="border-t border-t-gray-200"></div>
                        <p className="text-lg sm:text-xl font-bold text-teal-900 mt-4 mb-4">Thông tin khác</p>
                      </>
                    )}
                    {(roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR')&& pageType !== 'detail' && (
                      <>
                        <div className="border-t border-t-gray-200"></div>
                        <p className="text-lg sm:text-xl font-bold text-teal-900 mt-4 mb-4">Thông tin khác</p>
                      </>
                    )}
                    {(roleCode !== 'OWNER_SUPPLIER' && roleCode !== 'DISTRIBUTOR') && pageType === 'detail' && informationOrder?.length > 0 && (
                      <>
                        <div className="border-t border-t-gray-200"></div>
                        <p className="text-lg sm:text-xl font-bold text-teal-900 mt-4 mb-4">Thông tin khác</p>
                      </>
                    )}

                    {(roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && pageType !== 'detail' && (
                      <div className="flex justify-end uploadFile">
                        <Upload
                          accept=".pdf,image/*"
                          onlyImage={false}
                          isProduct={true}
                          action={async (file) => {
                            const isLt20M = file.size / 1024 / 1024 < 20;
                            if (!isLt20M) {
                              return Message.error({ text: 'Vui lòng tải file dưới 20MB!' });
                            }
                            if (!['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
                              return Message.error({ text: `Vui lòng chỉ chọn hình ảnh hoặc file pdf.` });
                            }
                            const urlArr = await UtilService.post(file, 'PRODUCT');
                            if (tempInfo.current.length > 2) {
                              return;
                            }
                            if (tempInfo.current.length === 2) {
                              tempInfo.current = [...tempInfo.current, ''];
                              return Message.error({ text: `Vui lòng chỉ tải 2 file cho mỗi sản phẩm.` });
                            }
                            tempInfo.current = [
                              ...tempInfo.current,
                              { id: uuidv4(), content: undefined, url: urlArr[0] },
                            ];
                            setInformationOrder(tempInfo.current);
                          }}
                        />
                      </div>
                    )}
                    {informationOrder?.length > 0 && (
                      <TableInformationOrder
                        dataSource={informationOrder}
                        setDataSource={setInformationOrder}
                        pageType={pageType}
                      />
                    )}
                  </div>

                  {roleCode === 'OWNER_STORE' && (pageType === 'detail' || pageType === 'edit') && (
                    <PurchaseUnit
                      purchaseUnit={purchaseUnit}
                      pageType={pageType}
                      setPurchaseUnit={setPurchaseUnit}
                      setPurchasePrice={setPurchasePrice}
                      setDataSource={setData}
                      purchasePrice={purchasePrice}
                      productDetail={{
                        code: data?.code,
                        basePrice: data?.price ?? 0,
                        retailPrice: data?.retailPrice,
                        barcode: data?.storeBarcode,
                        price: purchasePrice ?? 0,
                      }}
                      basicUnit={data?.basicUnit ?? form.getFieldValue('basicUnit')}
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-6 button-product-group">
                {pageType !== 'detail' ? (
                  <button
                    onClick={() => {
                      setStep(1);
                      pageType === 'create' && navigate(`${routerLinks('ProductCreate')}?step=1`);
                      pageType === 'edit' && navigate(`${routerLinks('Product')}`);
                    }}
                    className="px-8 py-3 h-[44px] text-sm bg-white-500 border-teal-900 hover:border-teal-600 border-solid border rounded-[10px] text-teal-900 hover:text-teal-600 back-product-button-create"
                    id="backBtn"
                  >
                    Trở về
                  </button>
                ) : (
                  <button
                    onClick={() => window.history.back()}
                    className="px-8 py-3 back-product-button h-[44px] text-sm bg-white-500 border-teal-900 hover:border-teal-600 border-solid border rounded-[10px] text-teal-900 hover:text-teal-600"
                    id="backBtn"
                  >
                    Trở về
                  </button>
                )}
                <div className="form-attribute">
                  <Form
                    className={`w-full form-attribute pb-4 ${pageType === 'detail' ? 'empty-form' : ''} `}
                    columns={ColumnEmptyForm({ pageType })}
                    handSubmit={submit}
                    checkHidden={true}
                    disableSubmit={isDisabled}
                    textSubmit={pageType === 'create' ? 'Lưu' : pageType === 'edit' ? 'Lưu' : null}
                    classGroupButton={
                      'absolute justify-end items-end !mt-0 right-[24px] submit-btn text-sm !w-[162px] submit-product-button disabled:opacity-70'
                    }
                    values={data}
                    form={form}
                    isResetForm={false}
                  />
                </div>
                {pageType === 'detail' && roleCode === 'ADMIN' && data?.approveStatus === 'WAITING_APPROVE' && (
                  <div className="flex justify-end items-end text-sm right-button-group">
                    <button
                      onClick={async () => {
                        await handleReject(idProduct, navigate);
                      }}
                      id="rejectBtn"
                      className="px-4 bg-red-600 h-[44px] w-[162px] text-white text-sm p-2 rounded-xl hover:bg-red-500 reject-request-button"
                    >
                      Từ chối yêu cầu
                    </button>
                    <button
                      onClick={async () => {
                        if (!idProduct) return;
                        const res = await ProductService.approveProduct(idProduct);
                        res && navigate(`${routerLinks('Product')}?tab=2`);
                      }}
                      id="approveBtn"
                      className="px-4 bg-teal-900 h-[44px] w-[162px] text-white text-sm p-2 rounded-xl hover:bg-teal-600"
                    >
                      Phê duyệt yêu cầu
                    </button>
                  </div>
                )}
                {pageType === 'detail' && (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && data?.approveStatus !== 'CANCELLED' && (
                  <div className="flex justify-end items-end text-sm right-button-group">
                    {pageType === 'detail' &&
                      (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') &&
                      (data?.approveStatus === 'APPROVED' || 'OUT_OF_STOCK') && (
                        <button
                          onClick={() => deleteProduct(idProduct, navigate)}
                          id="deleteBtn"
                          className="mr-4 bg-red-600 h-[44px] w-[162px] text-white text-sm rounded-xl hover:bg-red-600 delete-product-button"
                        >
                          Xóa sản phẩm
                        </button>
                      )}
                    <button
                      onClick={() => {
                        navigate(`${routerLinks('ProductEdit')}?id=${idProduct}&step=2`);
                        setStep(2);
                      }}
                      id="editBtn"
                      className="h-[44px] w-[162px] bg-teal-900 text-white text-sm rounded-xl hover:bg-teal-600"
                    >
                      Chỉnh sửa thông tin
                    </button>
                  </div>
                )}
                {pageType === 'detail' && roleCode === 'OWNER_STORE' && productType !== 'NON_BALANCE' && (
                  <div className="flex justify-end items-end text-sm right-button-group">
                    <button
                      onClick={() => {
                        navigate(`${routerLinks('ProductEdit')}?id=${idProduct}&step=2`);
                        setStep(2);
                      }}
                      id="editBtn"
                      className="h-[44px] w-[162px] bg-teal-900 text-white text-sm rounded-xl hover:bg-teal-600"
                    >
                      Chỉnh sửa thông tin
                    </button>
                  </div>
                )}
                {pageType === 'detail' && roleCode === 'OWNER_STORE' && productType === 'NON_BALANCE' && (
                  <div className="flex justify-end items-end text-sm right-button-group">
                    <button
                      onClick={() => {
                        deleteProduct(idProduct, navigate, 'NON_BALANCE');
                      }}
                      id="deleteBtn"
                      className="mr-4 bg-red-600 h-[44px] w-[162px] text-white text-sm rounded-xl hover:bg-red-600 delete-product-nonBal"
                    >
                      Xóa
                    </button>

                    <button
                      onClick={() => {
                        navigate(`${routerLinks('ProductEdit')}?id=${idProduct}&type=NON_BALANCE&step=2`);
                        setStep(2);
                      }}
                      id="editBtn"
                      className="h-[44px] w-[162px] bg-teal-900 text-white text-sm rounded-xl hover:bg-teal-600"
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Page;
