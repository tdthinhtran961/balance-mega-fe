import { Col, DatePicker, Form, Input, Modal, Row, Select, Space } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { routerLinks } from 'utils';
import { blockInvalidChar } from './components/TableDisposalGoods';
import './index.less';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { Message, Spin } from 'components';
import { DisposalGoodsService } from 'services/DisposalGoods';
import { useAuth } from 'global';

import DisposalAddModal from './components/disposalAddModal';
const { Option } = Select;

const Page = () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const idProduct = urlSearch.get('id');
  const type = urlSearch.get('type');

  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const [loading, setLoading] = useState({
    loadingMainPage: false,
    loadingProduct: false,
    loadingSupplier: false,
    loadingExportDisposalNote: false,
  });
  const { user } = useAuth();
  const storeId = user?.userInfor?.subOrgId;

  const [stop, setStop] = useState(null);
  const [data, setData] = useState({});
  const [, setFilterDate] = useState('');
  const [step, setStep] = useState(pageType === 'create' ? 1 : urlSearch.get('step'));
  const [listSupplier, setSupplier] = useState([]);

  const [listProduct, setListProduct] = useState([]);
  const scrollPopUpRef = useRef();
  const [, setLoadingSkeleton] = useState(false);
  const [visible, setVisible] = useState(false);
  const [valueSupplier, setValueSupplier] = useState();
  const [disabled, setDisabled] = useState(false);
  const [createExport, setCreateExport] = useState(false);
  const [visibleInfringingProducts, setVisibleInfringingProducts] = useState(false);

  const [values, setValueSubmit] = useState();
  const [infringingProductsArr, setInfringingProductsArr] = useState([]);
  const roleCode = user?.userInfor?.roleCode;

  const [inforSubOrg, setInforSubOrg] = useState({
    storeId: null,
    supplierId: null,
    infor: null,
  });
  const [isNonBalSupplier, setIsNonBalSupplier] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(8);

  const [params, setParams] = useState({
    page: 1,
    perPage: 9,
    fullTextSearch: '',
    idSupplier: '',
    idStore: '',
  });

  const [dataOrder, setDataOrder] = useState([]);
  const [disabledButon, setDisabledButton] = useState({
    disabledBtn: false,
  });
  const [dataOrderInvoice, setDataOrderInvoice] = useState({
    url: '',
    code: '',
  });
  const key = 'id';
  const arrayListProduct = [...new Map(listProduct?.map((item) => [item[key], item])).values()];
  const [choosingDisposalGoods, setChoosingDisposalGoods] = useState([]);
  const remainingListProduct = listProduct?.filter((goods) => {
    return choosingDisposalGoods?.findIndex((item) => item?.barcode === goods?.barcode) === -1;
  });
  const [unitChange, setUnitChange] = useState([]);
  const handleSelectDate = (date) => {
    if (!date) {
      setFilterDate('');
      return;
    }
    setFilterDate(moment(date).format('YYYY-MM-DD') + ' 00:00:00');
  };

  useEffect(() => {
    const fetchListFilter = async () => {
      setLoading((prev) => ({ ...prev, loadingSupplier: true }));

      try {
        const res = await DisposalGoodsService.getListSupplier({ type: 'ALL' });
        setSupplier(res.data);
        setInforSubOrg((prev) => ({
          ...prev,
          storeId: res.data?.[0]?.storeId,
          supplierId: res.data?.[0]?.supplierId,
          infor: res.data?.[0],
        }));
        setParams((prev) => ({ ...prev, idSupplier: res.data?.[0]?.supplier?.id }));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading((prev) => ({ ...prev, loadingSupplier: false }));
      }
    };
    (roleCode === 'OWNER_STORE') && pageType !== 'edit' && fetchListFilter();
  }, []);

  useEffect(() => {
    const fetchListFilter = async () => {
      setLoading((prev) => ({ ...prev, loadingSupplier: true }));
      if (data?.supplierType === 'NON_BALANCE') {
        try {
          const res = await DisposalGoodsService.getListSupplierNonBal({
            ...params,
            storeId,
            supplierType: 'NON_BALANCE',
          });
          setSupplier(res.data);
          setInforSubOrg((prev) => ({
            ...prev,
            storeId: res.data?.[0]?.storeId,
            supplierId: res.data?.[0]?.id,
            infor: res.data?.[0],
          }));
          setParams((prev) => ({ ...prev, idSupplier: res.data?.[0]?.id }));
        } catch (err) {
          console.log(err);
        } finally {
          setLoading((prev) => ({ ...prev, loadingSupplier: false }));
        }
      } else {
        try {
          const res = await DisposalGoodsService.getListSupplier({ type: 'ALL' });
          setSupplier(res.data);
          setInforSubOrg((prev) => ({
            ...prev,
            storeId: res.data?.[0]?.storeId,
            supplierId: res.data?.[0]?.supplierId,
            infor: res.data?.[0],
          }));
          setParams((prev) => ({ ...prev, idSupplier: res.data?.[0]?.supplier?.id }));
        } catch (err) {
          console.log(err);
        } finally {
          setLoading((prev) => ({ ...prev, loadingSupplier: false }));
        }
      }
    };
    (roleCode === 'OWNER_STORE') && pageType === 'edit' && data && fetchListFilter();
  }, [data]);

  useEffect(() => {
    const initFunction = async () => {
      if (idProduct) {
        try {
          setLoading((prev) => ({ ...prev, loadingProduct: true }));
          const res = await DisposalGoodsService.getById(idProduct);
          setDataOrderInvoice({ url: res?.url, code: res?.code });
          setChoosingDisposalGoods(
            res?.detailProduct.map((e) => ({
              ...e,
              inventoryProductUnits: e.inventoryProductUnits
                .sort((a, b) => +a.conversionValue - +b.conversionValue)
                .map((f) => ({
                  ...f,
                  isDefault: f.productCode === (e.currentUnit || e.code),
                })),
            })),
          );
          form.setFieldsValue(res);
          form.setFieldsValue({
            importedAt: moment(res?.issuedAt),
            importedReason: res?.reason,
          });
          setData({
            ...res,
            itemList: res.detailProduct.map((item) => ({ ...item, ['priceUnit' + item.code]: item.priceUnit })),
          });
          setLoading((prev) => ({ ...prev, loadingProduct: false }));
        } catch (err) {
          console.log(err);
        }
      }
    };
    initFunction();
  }, [idProduct]);

  useEffect(() => {
    const fetchListProduct = async () => {
      if (loading.loadingProduct) {
        return;
      }
      if (total !== 0 && arrayListProduct?.length >= 100) {
        setHasMore(false);
        return;
      }
      setHasMore(true);
      if (listSupplier.length > 0 && idProduct === null && visible) {
        setLoading((prev) => ({ ...prev, loadingProduct: true }));
        try {
          setLoading((prev) => ({ ...prev, loadingProduct: true }));
          const res = await DisposalGoodsService.getListProduct({
            ...params,
            idStore: storeId,
            supplierType:
              pageType === 'edit' && data?.supplierType === 'NON_BALANCE' && isNonBalSupplier
                ? 'NON_BALANCE'
                : undefined,
          });

          if (+res?.data?.inventory?.length === 0) {
            setStop(true);
          } else {
            setListProduct(listProduct.concat(res.data?.inventory));
            setStop(false);
          }
          setLoading((prev) => ({ ...prev, loadingProduct: false }));
          setTotal(res?.count);
          setLoadingSkeleton(false);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading((prev) => ({ ...prev, loadingProduct: false }));
        }
      } else if (listSupplier.length > 0 && idProduct && visible) {
        setLoading((prev) => ({ ...prev, loadingProduct: true }));
        try {
          setLoading((prev) => ({ ...prev, loadingProduct: true }));
          const res = await DisposalGoodsService.getListProduct({
            ...params,
            idStore: storeId,
            supplierType:
              pageType === 'edit' && data?.supplierType === 'NON_BALANCE' && isNonBalSupplier
                ? 'NON_BALANCE'
                : undefined,
          });

          if (+res?.data?.inventory?.length === 0) {
            setStop(true);
          } else {
            setListProduct(listProduct.concat(res.data?.inventory));
            setStop(false);
          }
          setLoading((prev) => ({ ...prev, loadingProduct: false }));
          setTotal(res?.count);
          setLoadingSkeleton(false);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading((prev) => ({ ...prev, loadingProduct: false }));
        }
      }
    };

    fetchListProduct();
  }, [params, stop, idProduct, visible]);

  const handleDelete = async (id) => {
    Message.confirm({
      text: 'Bạn có chắc muốn xóa hủy hàng này?',
      onConfirm: async () => {
        setLoading((prev) => ({ ...prev, loadingExportDisposalNote: true }));
        const res = await DisposalGoodsService.delete(id);
        setLoading((prev) => ({ ...prev, loadingExportDisposalNote: false }));
        if (type === '1') {
          return res && navigate(routerLinks('ListOfStock'));
        } else {
          return res && navigate(routerLinks('DisposalGoods'));
        }
      },
      title: 'Thông báo',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#DC2626',
      confirmButtonText: 'Xóa',
    });
  };

  useEffect(() => {
    choosingDisposalGoods?.forEach((i) => {
      if (i.quantity === undefined) {
        form.resetFields([`quantity${i.code}`]);
      }
    });
    setUnitChange(choosingDisposalGoods?.map((e) => e?.inventoryProductUnits?.findIndex((f) => f.isDefault)));
  }, [choosingDisposalGoods?.length]);

  const handleDeleteKey = async (good) => {
    if (pageType === 'edit') {
      if (
        (choosingDisposalGoods.length === 0 && data?.itemList?.length === dataOrder.length) ||
        choosingDisposalGoods.length === 1
      ) {
        await DisposalGoodsService.deleteLastDisposalItem(+good.id);
      } else {
        await DisposalGoodsService.deleteDisposalItem(+good.id);
      }

      if (
        (choosingDisposalGoods.length === 0 && data?.itemList?.length === dataOrder.length) ||
        choosingDisposalGoods.length === 1
      ) {
        DisposalGoodsService.delete(idProduct);
        const res = DisposalGoodsService.get({ page: 1, perPage: 10, idStore: storeId, type: 'DISPOSAL_GOOD' });
        if (type === '1') {
          return res && navigate(routerLinks('ListOfStock'));
        } else {
          return res && navigate(routerLinks('DisposalGoods'));
        }
      } else {
        const res = await DisposalGoodsService.getById(idProduct);
        setChoosingDisposalGoods(res?.detailProduct);
      }
    }

    if (pageType === 'create') {
      const newData = choosingDisposalGoods?.filter((item) => item.code !== good.code);

      setChoosingDisposalGoods(newData);

      const removedItems = choosingDisposalGoods
        ?.filter((item) => item.code === good.code)
        .map((item) => ({ ...item, isDeleted: true }));

      setDataOrder((prev) => prev.concat(removedItems));
    }
  };

  useEffect(() => {
    if (pageType === 'edit' || (pageType === 'create' && +step === 2)) {
      if (choosingDisposalGoods?.length === 0 && data?.itemList?.length === dataOrder.length) {
        DisposalGoodsService.delete(idProduct);
        const res = DisposalGoodsService.get({ page: 1, perPage: 10, idStore: storeId, type: 'DISPOSAL_GOOD' });
        if (type === '1') {
          return res && navigate(routerLinks('ListOfStock'));
        } else {
          return res && navigate(routerLinks('DisposalGoods'));
        }
      }
    }
  }, [pageType, choosingDisposalGoods?.length, data?.itemList, dataOrder?.length]);

  const toggleAmount = (data, type) => {
    const { code, _priceUnit, _quantity } = data;
    const tempOrder =
      choosingDisposalGoods &&
      choosingDisposalGoods.map((item) => {
        if (item.code === code) {
          if (type === 1) {
            return { ...item, priceUnit: _priceUnit };
          }
          if (type === 2) {
            return { ...item, quantity: _quantity };
          }
        }
        return item;
      });
    return setChoosingDisposalGoods([...tempOrder]);
  };

  const _renderTableOrderDetail = () => {
    return choosingDisposalGoods && choosingDisposalGoods.length > 0 ? (
      choosingDisposalGoods?.map((item, index) => {
        const indexData = item?.inventoryProductUnits[unitChange[index]];
        return (
          <div key={index}>
            <Row gutter={16} className="py-3 flex items-center gap-2">
              <Col className="gutter-row " span={4}>
                <div className="text-sm font-normal text-gray-700">{item?.storeBarcode}</div>
              </Col>
              <Col className="gutter-row " span={4}>
                <div className="h-full grid grid-cols-product-name items-center gap-4 text-left">
                  <div className="flex items-center">
                    <h5 className="text-sm font-normal text-gray-700">{item?.name}</h5>
                  </div>
                </div>
              </Col>
              <Col className="gutter-row" span={5}>
                <h5 className="text-sm font-normal text-gray-700">
                  {' '}
                  {pageType === 'create' ? item?.subOrg?.name : item?.supplier?.name || item?.subOrg?.name}
                </h5>
              </Col>
              <Col className="gutter-row" span={4}>
                {pageType !== 'detail' && indexData && (
                  <Select
                    className="w-full rounded-[10px]"
                    placeholder="Đơn vị"
                    optionFilterProp="children"
                    onChange={(value, option) => {
                      const listIndex = [...unitChange];
                      listIndex[index] = +value;
                      setUnitChange(listIndex);
                    }}
                    showSearch
                    defaultValue={indexData?.unitName}
                    filterOption={(input, option) => {
                      return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }}
                  >
                    {item?.inventoryProductUnits?.map((e, i) => {
                      return (
                        <Option key={i} value={e.value} title={e.unitName}>
                          {e.unitName}
                        </Option>
                      );
                    })}
                  </Select>
                )}
                {pageType === 'detail' && indexData && (
                  <h5 className="text-sm font-normal text-gray-700">{indexData?.unitName}</h5>
                )}
              </Col>
              <Col className="gutter-row" span={4}>
                <div>
                  {pageType === 'detail' && <span>{item?.quantity.toLocaleString('vi-VN')}</span>}

                  {pageType !== 'detail' && (
                    <Form.Item
                      name={`quantity${item.code}`}
                      style={{
                        margin: 0,
                      }}
                      rules={[
                        {
                          required: true,
                          message: `Số lượng là bắt buộc`,
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (+value === 0 && value !== '' && value !== null) {
                              return Promise.reject(new Error('Vui lòng nhập số lượng lớn hơn 0'));
                            }
                            // if (+value > 999999) {
                            //   return Promise.reject(new Error('Số lượng tối đa là 999999'));
                            // }

                            return Promise.resolve();
                          },
                        }),
                      ]}
                      initialValue={item?.quantity || null}
                    >
                      <Input
                        readOnly={pageType === 'detail'}
                        type="number"
                        min={1}
                        onChange={(e) => {
                          toggleAmount(
                            {
                              code: item?.code,
                              _quantity: +e.target.value > 0 && Number.parseFloat(e.target.value).toFixed(2),
                            },
                            2,
                          );
                        }}
                        onKeyDown={blockInvalidChar}
                        placeholder=" Nhập số lượng"
                        className="!h-9 !w-[90%] !rounded-xl !bg-white !border !border-gray-200 focus:!border-gray-200 focus:!shadow-none !px-2"
                      />
                    </Form.Item>
                  )}
                </div>
              </Col>

              <Col className="gutter-row " span={1}>
                {(pageType === 'edit' || pageType === 'create') && (
                  <button className="remove-btn" onClick={() => handleDeleteKey(item)}>
                    <i className="las la-trash-alt text-red-600 text-2xl"></i>
                  </button>
                )}
              </Col>
            </Row>
            <hr />
          </div>
        );
      })
    ) : (
      <p className="text-sm text-center mt-2">Trống</p>
    );
  };

  const handleSubmit = async (values) => {
    setValueSubmit(values);

    const infringingProducts = choosingDisposalGoods.filter(
      (item, index) => +item.quantity > +item.inventoryProductUnits[unitChange[index]].quantityBal,
    );
    setInfringingProductsArr(infringingProducts);

    const checkQuantityInBalInventory = (item, index) => {
      return +item.quantity <= +item.inventoryProductUnits[unitChange[index]].quantityBal;
    };

    if (choosingDisposalGoods.every(checkQuantityInBalInventory) === false) {
      setVisibleInfringingProducts(true);
    } else {
      const submit = async () => {
        setDisabledButton((prev) => ({ ...prev, disabledBtn: true }));
        let param = {};
        param = {
          issuedAt: moment(values.importedAt).toISOString(),
          storeId: pageType === 'create' ? inforSubOrg.storeId : undefined,
          reason: values?.importedReason,
          productItem: [
            ...choosingDisposalGoods.map((item, index) => ({
              id: +item.productId || +item.idProduct || +item.id,
              quantityReturn: +item.quantity,
              supplierId: +item?.subOrg?.id || +item?.supplier?.id,
              storeBarcode: item?.storeBarcode,
              inventoryProductUnitId: +item?.inventoryProductUnits[unitChange[index]]?.id,
              checkQuantity: +item?.inventoryProductUnits[unitChange[index]]?.quantityBal - (+item.quantity || 0),
            })),
          ],
          type: 'DISPOSAL_GOOD',
          supplierType: isNonBalSupplier ? 'NON_BALANCE' : undefined,
        };
        let res;
        setLoading((prev) => ({ ...prev, loadingExportDisposalNote: true }));
        pageType === 'create' && createExport === false
          ? (res = await DisposalGoodsService.post(param))
          : createExport === true
          ? (res = await DisposalGoodsService.exportBillCombineCreating(param))
          : (res = await DisposalGoodsService.put(idProduct, param));
        if (createExport === true && res) {
          const disposalNoteKey = res?.data?.key;
          const responsive = await DisposalGoodsService.downloadBillDisposalWhenCreateWithKey(disposalNoteKey);
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(new Blob([responsive], { type: responsive.type }));
          link.target = '_blank';
          link.download = `Phiếu hủy hàng`;
          document.body.appendChild(link);
          link.click();
          link?.parentNode?.removeChild(link);
        }
        if (res) {
          setDisabledButton((prev) => ({ ...prev, disabledBtn: false }));
          return window.history.back();
          // if (type === '1') {
          //   return navigate(routerLinks('ListOfStock'));
          // } else {
          //   return navigate(routerLinks('DisposalGoods'));
          // }
        }
        setLoading((prev) => ({ ...prev, loadingExportDisposalNote: false }));
      };
      submit();
    }
  };

  if (
    ((roleCode === 'OWNER_STORE') &&
      (((pageType === 'detail' || pageType === 'edit') && !data.code) || loading.loadingExportDisposalNote)) ||
    (roleCode === 'ADMIN' && !data.code)
  ) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }
  return (
    <Fragment>
      {(+step === 2 || pageType === 'detail' || pageType === 'create' || pageType === 'edit') && (
        <div className="min-h-screen disposal-good-container">
          <Form form={form} component={false} onFinish={handleSubmit}>
            <p className="text-2xl text-teal-900 font-bold">Hủy hàng</p>
            <div className="bg-white w-full px-6 pt-2 rounded-xl mt-5 relative pb-[72px]">
              <div className="mb-6 border-b border-gray-200">
                <div className="flex items-center mb-4 disposal-status-info">
                  <h2 className="font-bold text-lg text-teal-900 mr-3 disposal-first-title">Thông tin hủy hàng</h2>
                  {pageType !== 'create' && (
                    <>
                      {data?.status === 'INPROCESS' ? (
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
                    className="mb-4"
                  >
                    <div className="flex items-center w-full mb-[28px] above-field-disposal">
                      <Col span={24} sm={12}>
                        <div className="grid grid-cols-[180px_minmax(100%,_1fr)] disposal-info-sectiondetail items-center">
                          <span className="font-normal text-black text-base">Tên cửa hàng: </span>
                          <span className="font-normal text-base text-gray-500 break-all">
                            {user?.userInfor?.subOrgName}
                          </span>
                        </div>
                      </Col>
                    </div>

                    <div className="flex items-center w-full below-disposal-section">
                      <Col span={24} sm={12} className="col-disposal-time">
                        <div className="grid grid-cols-[180px_minmax(100%,_1fr)] items-center time-cancel-field disposal-info-sectiondetail">
                          <span className="font-normal text-black text-base">Thời gian hủy hàng: </span>
                          <Space direction="vertical" className="">
                            <Form.Item
                              name="importedAt"
                              style={{
                                margin: 0,
                              }}
                              rules={[
                                {
                                  required: true,
                                  message: `Thời gian hủy hàng là bắt buộc`,
                                },
                              ]}
                              initialValue={moment()}
                            >
                              <DatePicker
                                onChange={handleSelectDate}
                                format="DD/MM/YYYY"
                                className="!w-[100%] lg:!w-[60%] !bg-white !border-gray-200 !text-gray-500 "
                                disabledDate={(current) => {
                                  return current && current.valueOf() > Date.now();
                                }}
                              />
                            </Form.Item>
                          </Space>
                        </div>
                      </Col>
                      <Col span={24} sm={12} className="col-disposal-time">
                        <div className="grid grid-cols-[180px_minmax(100%,_1fr)] items-center time-cancel-field disposal-info-sectiondetail-reason">
                          <span className="font-normal text-black text-base">
                            Lý do hủy hàng: <span className="text-[#ff4d4f] text-sm">*</span>
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
                                    return Promise.reject(new Error('Lý do hủy hàng là bắt buộc'));
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                          >
                            <Input
                              className="w-full !text-gray-500  px-3 py-2 !bg-white rounded-[10px] border border-gray-200 focus:!shadow-none focus:!border-gray-200"
                              placeholder="Nhập lý do"
                            />
                          </Form.Item>
                        </div>
                      </Col>
                    </div>
                    <div className="flex items-center w-full below-disposal-section">
                      <Col span={24} sm={12} className="col-disposal-time mt-2">
                        <div className="grid grid-cols-[180px_minmax(100%,_1fr)] items-center time-cancel-field disposal-info-sectiondetail">
                          <span className="font-normal text-black text-base">Đối tác: </span>
                          <Select
                            className="w-[220px] h-[36px] rounded-[10px]  supplier-good-return-select mr-6 mb-4"
                            placeholder="Chọn đối tác"
                            optionFilterProp="children"
                            defaultActiveFirstOption
                            defaultValue="Balance"
                            options={[
                              {
                                value: 'Balance',
                                label: 'Balance',
                              },
                              {
                                value: 'Non_Balance',
                                label: 'Non_Balance',
                              },
                            ]}
                            onSelect={async (e) => {
                              setChoosingDisposalGoods([]);
                              setListProduct([]);
                              if (e === 'Balance') {
                                setIsNonBalSupplier(false);
                                try {
                                  const res = await DisposalGoodsService.getListSupplier({ type: 'ALL' });
                                  setSupplier(res.data);
                                  setValueSupplier(res.data[0].supplier?.name);

                                  setInforSubOrg((prev) => ({
                                    ...prev,
                                    storeId: res.data?.[0]?.storeId,
                                    supplierId: res.data?.[0]?.supplierId,
                                    infor: res.data?.[0],
                                  }));
                                  setParams((prev) => ({ ...prev, idSupplier: res.data?.[0]?.supplier?.id, page: 1 }));
                                } catch (err) {
                                  console.log(err);
                                }
                              } else if (e === 'Non_Balance') {
                                setIsNonBalSupplier(true);
                                try {
                                  const res = await DisposalGoodsService.getListSupplierNonBal({
                                    ...params,
                                    storeId,
                                    supplierType: 'NON_BALANCE',
                                    page: 1,
                                  });
                                  setSupplier(res.data);
                                  setValueSupplier(res.data[0]?.name);

                                  setParams((prev) => ({ ...prev, idSupplier: res.data?.[0]?.id, page: 1 }));
                                } catch (err) {
                                  console.log(err);
                                }
                              }
                            }}
                          ></Select>
                        </div>
                      </Col>
                    </div>
                  </Row>
                ) : pageType === 'detail' ? (
                  <Row
                    gutter={{
                      xs: 8,
                      sm: 16,
                      md: 24,
                      lg: 32,
                    }}
                  >
                    <div className="below-disposal-section-notCreate">
                      {' '}
                      <Col span={24} sm={12} className="flex items-center mb-4 ">
                        <div className="grid grid-cols-[180px_minmax(100%,_1fr)] disposal-info-sectiondetail items-center">
                          <span className="font-normal text-black text-base">Mã hủy hàng: </span>
                          <span className="font-normal text-base text-gray-500 break-all">
                            {data?.code || 'Đang cập nhật'}
                          </span>
                        </div>
                      </Col>
                      <Col span={24} sm={12}>
                        <div className="mb-4 grid grid-cols-[180px_minmax(100%,_1fr)] disposal-info-sectiondetail items-center">
                          <span className="font-normal text-black text-base">Tên cửa hàng: </span>
                          <span className="font-normal text-base text-gray-500 break-all">{data?.store?.name}</span>
                        </div>
                      </Col>
                    </div>
                    <div className="below-disposal-section-notCreate">
                      <Col span={24} sm={12}>
                        <div className="mb-4 grid grid-cols-[180px_minmax(100%,_1fr)] items-center disposal-info-sectiondetail">
                          <span className="font-normal text-black text-base">Thời gian hủy hàng: </span>
                          <span className="font-normal text-base text-gray-500 break-all">
                            {moment(data?.issuedAt).format('DD/MM/YYYY')}
                          </span>
                        </div>
                      </Col>

                      <Col span={24} sm={12}>
                        <div className="mb-4 grid grid-cols-[180px_minmax(100%,_1fr)] items-center disposal-info-sectiondetail">
                          <span className="font-normal text-black text-base">Lý do hủy hàng: </span>
                          <span className="font-normal text-base text-gray-500 break-all">{data?.reason}</span>
                        </div>
                      </Col>
                    </div>
                    <div className="below-disposal-section-notCreate">
                      <Col span={24} sm={12}>
                        <div className="mb-4 grid grid-cols-[180px_minmax(100%,_1fr)] items-center disposal-info-sectiondetail">
                          <span className="font-normal text-black text-base">Đối tác: </span>
                          <span className="font-normal text-base text-gray-500 break-all">
                            {data?.supplierType === 'NON_BALANCE' ? 'Ngoài Balance' : 'Thuộc Balance'}
                          </span>
                        </div>
                      </Col>
                    </div>
                  </Row>
                ) : pageType === 'edit' ? (
                  <Row
                    gutter={{
                      xs: 8,
                      sm: 16,
                      md: 24,
                      lg: 32,
                    }}
                  >
                    <div className="below-disposal-section-notCreate">
                      <Col span={24} sm={12} className="flex items-center mb-[28px]">
                        <div className="grid grid-cols-[180px_minmax(100%,_1fr)] disposal-info-sectiondetail items-center">
                          <span className="font-normal text-black text-base">Mã hủy hàng: </span>
                          <span className="font-normal text-base text-gray-500 break-all">
                            {data?.code || 'Đang cập nhật'}
                          </span>
                        </div>
                      </Col>
                      <Col span={24} sm={12}>
                        <div className="mb-4 grid grid-cols-[180px_minmax(100%,_1fr)] disposal-info-sectiondetail items-center">
                          <span className="font-normal text-black text-base">Tên cửa hàng: </span>
                          <span className="font-normal text-base text-gray-500 break-all">{data?.store?.name}</span>
                        </div>
                      </Col>
                    </div>

                    <div className="below-disposal-section-notCreate">
                      {' '}
                      <Col span={24} sm={12} className="mb-1">
                        <div className="grid grid-cols-[180px_minmax(100%,_1fr)] disposal-info-sectiondetail items-center">
                          <span className="font-normal text-black text-base">Thời gian hủy hàng: </span>

                          <Space direction="vertical" className="">
                            <Form.Item
                              name="importedAt"
                              style={{
                                margin: 0,
                              }}
                              rules={[
                                {
                                  required: true,
                                  message: `Thời gian hủy hàng là bắt buộc`,
                                },
                              ]}
                              initialValue={moment(data?.issuedAt)}
                            >
                              <DatePicker
                                onChange={handleSelectDate}
                                format="DD/MM/YYYY"
                                className="!w-[100%] !bg-white !border-gray-200 !text-gray-500 "
                                disabledDate={(current) => {
                                  return current && current.valueOf() > Date.now();
                                }}
                              />
                            </Form.Item>
                          </Space>
                        </div>
                      </Col>
                      <Col span={24} sm={12}>
                        <div className="mb-1 grid grid-cols-[180px_minmax(100%,_1fr)] disposal-info-sectiondetail items-center">
                          <span className="font-normal text-black text-base">
                            Lý do hủy hàng: <span className="text-[#ff4d4f] text-sm">*</span>
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
                                    return Promise.reject(new Error('Lý do hủy hàng là bắt buộc'));
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                            initialValue={data?.reason}
                          >
                            <Input
                              className="w-full  px-3 py-2 !bg-white rounded-[10px] border border-gray-200 focus:!shadow-none focus:!border-gray-200"
                              placeholder="Nhập lý do"
                            />
                          </Form.Item>
                        </div>
                      </Col>
                    </div>
                    <div className="flex items-center w-full below-disposal-section">
                      <Col span={24} sm={12} className="col-disposal-time">
                        <div className="grid grid-cols-[180px_minmax(100%,_1fr)] items-center time-cancel-field disposal-info-sectiondetail">
                          <span className="font-normal text-black text-base">Đối tác: </span>
                          <Select
                            className="w-[220px] h-[36px] rounded-[10px]  supplier-good-return-select mr-6 mb-4"
                            placeholder="Chọn Đối tác"
                            optionFilterProp="children"
                            defaultValue={data?.supplierType === 'NON_BALANCE' ? 'Non_Balance' : 'Balance'}
                            options={[
                              {
                                value: 'Balance',
                                label: 'Balance',
                              },
                              {
                                value: 'Non_Balance',
                                label: 'Non_Balance',
                              },
                            ]}
                            onSelect={async (e) => {
                              setChoosingDisposalGoods([]);
                              setListProduct([]);
                              if (e === 'Balance') {
                                setIsNonBalSupplier(false);
                                try {
                                  const res = await DisposalGoodsService.getListSupplier({ type: 'ALL' });
                                  setSupplier(res.data);
                                  setValueSupplier(res.data[0].supplier?.name);

                                  setInforSubOrg((prev) => ({
                                    ...prev,
                                    storeId: res.data?.[0]?.storeId,
                                    supplierId: res.data?.[0]?.supplierId,
                                    infor: res.data?.[0],
                                  }));
                                  setParams((prev) => ({ ...prev, idSupplier: res.data?.[0]?.supplier?.id, page: 1 }));
                                } catch (err) {
                                  console.log(err);
                                }
                              } else if (e === 'Non_Balance') {
                                setIsNonBalSupplier(true);
                                try {
                                  const res = await DisposalGoodsService.getListSupplierNonBal({
                                    ...params,
                                    storeId,
                                    supplierType: 'NON_BALANCE',
                                    page: 1,
                                  });
                                  setSupplier(res.data);
                                  setValueSupplier(res.data[0]?.name);
                                  setParams((prev) => ({ ...prev, idSupplier: res.data?.[0]?.id, page: 1 }));
                                } catch (err) {
                                  console.log(err);
                                }
                              }
                            }}
                          ></Select>
                        </div>
                      </Col>
                    </div>
                  </Row>
                ) : (
                  ''
                )}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-base text-teal-900">Chi tiết hủy hàng</h2>
                  {(pageType === 'edit' || pageType === 'create') && (
                    <button
                      type="button"
                      onClick={async () => {
                        setVisible(true);
                        setListProduct([]);
                        setLoading((prev) => ({ ...prev, loadingProduct: true }));
                        setParams({ ...params, page: 1 });
                        // const res = await DisposalGoodsService.getListProduct({
                        //   ...params,
                        //   idStore: storeId,
                        //   supplierType:
                        //     pageType === 'edit' && data?.supplierType === 'NON_BALANCE' && isNonBalSupplier
                        //       ? 'NON_BALANCE'
                        //       : undefined,
                        // });
                        // setListProduct(res.data?.inventory);
                        // setTotal(res?.count);
                        setLoading((prev) => ({ ...prev, loadingProduct: false }));
                      }}
                      id="saveBtn"
                      className="w-[130px] md:w-[153px] h-[36px] bg-teal-900 text-white text-[13px] md:text-sm rounded-[10px] flex justify-center items-center gap-[10px]"
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

                <div className="overflow-x-auto">
                  <div className="w-max min-w-full">
                    <Row gutter={16} className="mb-3 gap-2">
                      <Col className="gutter-row w-[200px]" span={4}>
                        <div className="text-sm font-bold text-gray-700">Mã vạch</div>
                      </Col>
                      <Col className="gutter-row " span={4}>
                        <div className="text-sm font-bold text-gray-700">Tên sản phẩm</div>
                      </Col>
                      <Col className="gutter-row " span={5}>
                        <div className="text-sm font-bold text-gray-700">Nhà cung cấp</div>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <div className="text-sm font-bold text-gray-700">Đơn vị tính</div>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <div className="text-sm font-bold text-gray-700">Số lượng hủy</div>
                      </Col>
                      <Col className="gutter-row text-center" span={1}>
                        <div></div>
                      </Col>
                    </Row>
                    <hr />
                    {_renderTableOrderDetail()}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`flex justify-between mt-[22px] ${
                pageType === 'detail' ? 'disposal-group-button-edit' : 'disposal-group-button'
              }`}
            >
              <button
                onClick={() => {
                  if (roleCode === 'ADMIN') {
                    window.history.back();
                    // return navigate(`${routerLinks('DisposalGoods')}`);
                  }
                  if (pageType === 'create' && step === 1) {
                    return navigate(`${routerLinks('DisposalGoods')}`);
                  }
                  if (pageType === 'edit' || pageType === 'detail' || (pageType === 'create' && +step === 2)) {
                    return window.history.back();
                  }
                  if (pageType === 'create') {
                    setStep(1);
                    return navigate(`${routerLinks('DisposalGoodsCreate')}?step=1`);
                  }
                }}
                className="w-[106px] h-[44px] bg-white border-teal-900 text-teal-900  border-solid border text-sm rounded-[10px] text-teal-90 back-disposal-button"
                id="backBtn"
              >
                Trở về
              </button>
              {(roleCode === 'OWNER_STORE') &&
                (data?.status === 'INPROCESS' || pageType === 'create') && (
                  <div className="flex justify-end disposal-right-button-group">
                    {pageType === 'create' && (
                      <button
                        disabled={disabledButon.disabledBtn || choosingDisposalGoods.length === 0}
                        onClick={() => {
                          setCreateExport(true);
                          form && form.submit();
                        }}
                        id="outBtn"
                        className="w-[177px] h-[44px] bg-transparent border border-teal-900 text-teal-900 text-sm rounded-[10px] mr-4 disabled:pointer-events-none disabled:!cursor-not-allowed disabled:opacity-60 disposal-export-bill-button"
                      >
                        Xuất phiếu hủy hàng
                      </button>
                    )}

                    {pageType === 'detail' && (
                      <button
                        disabled={disabledButon.disabledBtn || choosingDisposalGoods.length === 0}
                        onClick={async () => {
                          const infringingProducts = choosingDisposalGoods.filter(
                            (item, index) =>
                              +item.quantity > +item.inventoryProductUnits[unitChange[index]].quantityBal,
                          );
                          setInfringingProductsArr(infringingProducts);

                          const checkQuantityInBalInventory = (item, index) => {
                            return +item.quantity <= +item.inventoryProductUnits[unitChange[index]].quantityBal;
                          };

                          if (choosingDisposalGoods.every(checkQuantityInBalInventory) === false) {
                            setVisibleInfringingProducts(true);
                          } else {
                            const submit = async () => {
                              setDisabledButton((prev) => ({ ...prev, disabledBtn: true }));
                              setLoading((prev) => ({ ...prev, loadingExportDisposalNote: true }));
                              const res = await DisposalGoodsService.exportBillDisposalWhenEdit(idProduct);
                              if (res) {
                                setDisabledButton((prev) => ({ ...prev, disabledBtn: false }));
                                const link = document.createElement('a');
                                link.href = window.URL.createObjectURL(new Blob([res], { type: res.type }));
                                link.target = '_blank';
                                link.download = `Phiếu hủy hàng - Mã đơn: ${data.code || 'Đang cập nhật'}`;
                                document.body.appendChild(link);
                                link.click();
                                link?.parentNode?.removeChild(link);
                                setLoading((prev) => ({ ...prev, loadingExportDisposalNote: false }));
                                if (type === '1') {
                                  return navigate(routerLinks('ListOfStock'));
                                } else {
                                  return navigate(routerLinks('DisposalGoods'));
                                }
                              }
                            };
                            submit();
                          }
                        }}
                        id="outBtn"
                        className="w-[177px] h-[44px] bg-transparent border border-teal-900 text-teal-900 text-sm rounded-[10px] mr-4 disabled:pointer-events-none disabled:!cursor-not-allowed disabled:opacity-60 disposal-export-bill-edit"
                      >
                        Xuất phiếu hủy hàng
                      </button>
                    )}
                    {pageType === 'create' ? (
                      <button
                        type="submit"
                        onClick={() => {
                          setCreateExport(false);
                          form && form.submit();
                        }}
                        disabled={choosingDisposalGoods.length === 0}
                        id="saveBtn"
                        className="w-[137px] h-[44px] bg-teal-900 text-white text-sm rounded-[10px] disabled:pointer-events-none disabled:!cursor-not-allowed disabled:opacity-60 submit-disposal-button"
                      >
                        Lưu
                      </button>
                    ) : pageType === 'edit' || (pageType === 'create' && +step === 2) ? (
                      <button
                        type="submit"
                        onClick={() => {
                          setCreateExport(false);
                          form && form.submit();
                        }}
                        id="saveBtn"
                        className="w-[137px] h-[44px] bg-teal-900 text-white text-sm rounded-[10px] disabled:pointer-events-none disabled:!cursor-not-allowed disabled:opacity-60 submit-disposal-button"
                      >
                        Lưu
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          navigate(
                            routerLinks('DisposalGoodsEdit') + `?id=${idProduct || data?.id}&step=2}` + `&type=${1}`,
                          );
                        }}
                        id="editBtn"
                        className="w-[156px] h-[44px] bg-teal-900 text-white text-sm rounded-[10px] edit-disposal-button"
                      >
                        Chỉnh sửa
                      </button>
                    )}
                    {pageType === 'detail' && (
                      <button
                        onClick={() => handleDelete(idProduct)}
                        id="deleteBtn"
                        className="w-[84px] h-[44px] bg-red-600 text-white text-sm rounded-[10px] ml-4 delete-disposal-button"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                )}
              {data?.status === 'COMPLETED' && (
                <button
                  onClick={async () => {
                    setLoading((prev) => ({ ...prev, loadingExportDisposalNote: true }));
                    const NoteKey = dataOrderInvoice?.url;
                    if (NoteKey) {
                      const responsive = await DisposalGoodsService.downloadBillDisposalWhenCreateWithKey(NoteKey);
                      const link = document.createElement('a');
                      link.href = window.URL.createObjectURL(new Blob([responsive], { type: responsive.type }));
                      link.target = '_blank';
                      link.download = `Phiếu hủy hàng - Mã đơn: ${dataOrderInvoice.code}`;
                      document.body.appendChild(link);
                      link.click();
                      link?.parentNode?.removeChild(link);
                    }
                    setLoading((prev) => ({ ...prev, loadingExportDisposalNote: false }));
                  }}
                  id="outBtn"
                  className="w-[177px] h-[44px] bg-transparent border border-teal-900 text-teal-900 text-sm rounded-[10px] hover:bg-white"
                >
                  In phiếu hủy hàng
                </button>
              )}
            </div>
          </Form>
          <DisposalAddModal
            valueSupplier={valueSupplier}
            setValueSupplier={setValueSupplier}
            isNonBalSupplier={isNonBalSupplier}
            visible={visible}
            setVisible={setVisible}
            setListProduct={setListProduct}
            listSupplier={listSupplier}
            setLoadingSkeleton={setLoadingSkeleton}
            setLoading={setLoading}
            setParams={setParams}
            setInforSubOrg={setInforSubOrg}
            scrollPopUpRef={scrollPopUpRef}
            listProduct={arrayListProduct}
            remainingListProduct={remainingListProduct}
            choosingDisposalGoods={choosingDisposalGoods}
            setChoosingDisposalGoods={setChoosingDisposalGoods}
            disabled={disabled}
            setDisabled={setDisabled}
            pageType={pageType}
            inforSubOrg={inforSubOrg}
            setStop={setStop}
            loading={loading.loadingProduct}
            paramsFilterSupplier={params.idSupplier}
            stop={stop}
            hasMore={hasMore}
          />
        </div>
      )}
      <Modal
        title="Thông báo"
        centered
        // cancelText="Nhập lại"
        // okText="Đồng ý"
        open={visibleInfringingProducts}
        onOk={async () => {
          if (pageType === 'create' || pageType === 'edit') {
            setDisabledButton((prev) => ({ ...prev, disabledBtn: true }));
            let param = {};
            param = {
              issuedAt: moment(values.importedAt).toISOString(),
              storeId: inforSubOrg.storeId,
              reason: values?.importedReason,
              productItem: [
                ...choosingDisposalGoods.map((item) => ({
                  id: +item.productId || +item.idProduct || +item.id,
                  quantityReturn: +item.quantity,
                  supplierId: +item?.subOrg?.id || +item?.supplier?.id,
                  storeBarcode: item.storeBarcode,
                })),
              ],
              type: 'DISPOSAL_GOOD',
              supplierType: isNonBalSupplier ? 'NON_BALANCE' : undefined,
            };
            let res;
            setLoading((prev) => ({ ...prev, loadingExportDisposalNote: true }));
            pageType === 'create' && createExport === false
              ? (res = await DisposalGoodsService.post(param))
              : createExport === true
              ? (res = await DisposalGoodsService.exportBillCombineCreating(param))
              : (res = await DisposalGoodsService.put(idProduct, param));
            if (createExport === true && res) {
              const disposalNoteKey = res?.data?.key;
              const responsive = await DisposalGoodsService.downloadBillDisposalWhenCreateWithKey(disposalNoteKey);
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(new Blob([responsive], { type: responsive.type }));
              link.target = '_blank';
              link.download = `Phiếu hủy hàng`;
              document.body.appendChild(link);
              link.click();
              link?.parentNode?.removeChild(link);
            }
            if (res) {
              setDisabledButton((prev) => ({ ...prev, disabledBtn: false }));
              if (type === '1') {
                return navigate(routerLinks('ListOfStock'));
              } else {
                return navigate(routerLinks('DisposalGoods'));
              }
            }
            setLoading((prev) => ({ ...prev, loadingExportDisposalNote: false }));
            setVisibleInfringingProducts(false);
          } else if (pageType === 'detail') {
            const submit = async () => {
              setDisabledButton((prev) => ({ ...prev, disabledBtn: true }));
              setLoading((prev) => ({ ...prev, loadingExportDisposalNote: true }));
              const res = await DisposalGoodsService.exportBillDisposalWhenEdit(idProduct);
              if (res) {
                setDisabledButton((prev) => ({ ...prev, disabledBtn: false }));
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(new Blob([res], { type: res.type }));
                link.target = '_blank';
                link.download = `Phiếu hủy hàng - Mã đơn: ${data.code || 'Đang cập nhật'}`;
                document.body.appendChild(link);
                link.click();
                link?.parentNode?.removeChild(link);
                setLoading((prev) => ({ ...prev, loadingExportDisposalNote: false }));
                if (type === '1') {
                  return navigate(routerLinks('ListOfStock'));
                } else {
                  return navigate(routerLinks('DisposalGoods'));
                }
              }
            };
            submit();
          }
        }}
        onCancel={() => setVisibleInfringingProducts(false)}
        // Hide button 'Đồng ý'
        footer={
          <button
            key="retype"
            onClick={() => setVisibleInfringingProducts(false)}
            className="w-[126px] h-[44px] bg-white border-2 border-radius border-teal-900 text-teal-900 text-sm rounded-[10px]"
          >
            Nhập lại
          </button>
        }
        width={800}
        wrapClassName={'modal-disposal-infringingProducts'}
      >
        <div>
          <h1 className="text-teal-900 text-4xl text-center mb-3 mt-4 font-medium">Thông báo</h1>
          <p className="text-center font-normal text-base pb-4 border-b border-gray-200 mb-2">
            Số lượng hủy vượt quá số lượng trong kho
          </p>
          <h3 className="text-base mb-4 font-medium text-teal-900">
            Danh sách sản phẩm có số lượng nhập hủy vượt quá số lượng trong kho:
          </h3>

          <div>
            {infringingProductsArr && infringingProductsArr?.length > 0 && (
              <div className="">
                <Row gutter={16} className="mb-3">
                  <Col className="gutter-row !pr-0 !pl-2" span={6}>
                    <div className="text-sm text-gray-700 font-semibold">Tên sản phẩm</div>
                  </Col>
                  <Col className="gutter-row !p-0" span={7}>
                    <div className="text-sm text-gray-700 font-semibold">Nhà cung cấp</div>
                  </Col>
                  <Col className="gutter-row !p-0" span={6}>
                    <div className="text-sm text-gray-700 font-semibold">Số lượng trong kho</div>
                  </Col>
                  <Col className="gutter-row !p-0" span={5}>
                    <div className="text-sm text-gray-700 font-semibold">Số lượng nhập hủy</div>
                  </Col>
                </Row>
                <hr />
                <div className="overflow-y-scroll max-h-[300px] overflow-x-hidden">
                  {infringingProductsArr?.map((item, index) => {
                    const indexData = item?.inventoryProductUnits[unitChange[index]];
                    return (
                      <div key={item.id}>
                        <Row gutter={16} className="py-[10px] flex items-center">
                          <Col className="gutter-row " span={6}>
                            <div>
                              <h5 className="name text-sm font-medium">{item?.name}</h5>
                            </div>
                          </Col>
                          <Col className="gutter-row !pl-1" span={7}>
                            <h5 className="text-sm font-normal text-gray-700">
                              {item?.subOrg?.name || item?.supplier?.name}{' '}
                            </h5>
                          </Col>
                          <Col className="gutter-row !pl-[10px]" span={6}>
                            <h4 className="text-sm font-normal text-gray-700">{indexData?.quantityBal}</h4>
                          </Col>
                          <Col className="gutter-row !pl-[14px]" span={5}>
                            <h5 className="subtotal text-sm font-normal text-gray-700">{+item?.quantity}</h5>
                          </Col>
                        </Row>
                        <hr />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};
export default Page;
