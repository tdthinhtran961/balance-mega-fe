import { Col, DatePicker, Form, Input, InputNumber, List, Modal, Row, Space, Spin as SpinAntd, Select } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { formatCurrency, routerLinks } from 'utils';
import { blockInvalidChar } from './components/TablePromotionalGoods';
import './index.less';
import ImportFile from './components/importFile';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { Message, Spin, Select_Tax } from 'components';
import { PromotionalGoodsService } from 'services/PromotionalGoods';
import PromotionGoodsCard from './components/promotionGoodCard';
import { useAuth } from 'global';
import InfiniteScroll from 'react-infinite-scroll-component';
import { taxApply, fileType } from 'constants/index';
import { SupplierService } from 'services/supplier';
import { ProductService } from 'services/product';
const { Option } = Select;
const Page = () => {
  const TimeOutId = useRef();
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
    isLoadingSkin: false,
  });
  const { user } = useAuth();
  const storeId = user?.userInfor?.subOrgId;
  const roleCode = user?.userInfor?.roleCode;
  const [stop, setStop] = useState(false);
  const [data, setData] = useState({});
  const [step, setStep] = useState(pageType === 'create' ? 1 : urlSearch.get('step'));
  const [listSupplier, setSupplier] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [choosingPromotionGoods, setChoosingPromotionGoods] = useState([]);
  const [dataTempChoose, setDataTempChoose] = useState([]);
  const [, setLoadingSkeleton] = useState(false);
  const [, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [visibleExcel, setVisibleExcel] = useState(false);
  const [paymentSupplier, setPaymentSupplier] = useState(0);
  const [checkPaymentSupplier, setCheckPaymentSupplier] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    perPage: 12,
    fullTextSearch: '',
    filterSupplier: '',
  });

  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(8);
  const [disabled, setDisabled] = useState(false);
  const [createExport, setCreateExport] = useState(false);
  const [exportBillByCraete, setExportBillByCreate] = useState(false);
  const [inforSubOrg, setInforSubOrg] = useState({
    storeId: null,
    supplierId: null,
    infor: null,
  });
  const [temporary, setTemporary] = useState();
  const [valueSupplier, setValueSupplier] = useState();
  const remainingListProduct = listProduct.filter((goods) => {
    return choosingPromotionGoods.findIndex((item) => item?.code === goods?.code) === -1;
  });

  const [dataOrder, setDataOrder] = useState([]);
  const [disabledButon, setDisabledButton] = useState({
    disabledBtn: false,
  });
  const [listStoreBarcode, setListStoreBarcode] = useState([]);
  const [filterTax, setFilterTax] = useState(taxApply.APPLY);

  const [dataExcel, setDataExcel] = useState([]);
  const [importExcel, setImportExcel] = useState(0);
  const [loadingImport, setLoadingImport] = useState(false);
  const [dataOrderInvoice, setDataOrderInvoice] = useState([]);

  const totalPrice =
    choosingPromotionGoods &&
    choosingPromotionGoods
      .filter((item) => item.unitPrice !== undefined || item.quantity !== undefined)
      .reduce((a, c) => {
        if (!c.priceUnit || !c.quantity) {
          return a;
        }
        return a + +c.priceUnit * +c.quantity;
      }, 0);

  const totalTaxPrice =
    choosingPromotionGoods &&
    choosingPromotionGoods
      .filter((item) => item.unitPrice !== undefined || item.quantity !== undefined)
      .reduce((a, c) => {
        if (!c.priceUnit || !c.quantity) {
          return a;
        }
        return a + +c.priceUnit * +c.quantity * ((+c?.importTax?.taxRate || +c?.tax) / 100);
      }, 0);

  const totalPriceAfterTax =
    choosingPromotionGoods &&
    choosingPromotionGoods
      .filter((item) => item.unitPrice !== undefined || item.quantity !== undefined)
      .reduce((a, c) => {
        if (!c.priceUnit || !c.quantity) {
          return a;
        }
        return a + +c.priceUnit * +c.quantity * ((+c?.importTax?.taxRate || +c?.tax) / 100 + 1);
      }, 0);

  const key = 'id';
  const arrayListProduct = [...new Map(listProduct?.map((item) => [item[key], item])).values()];

  useEffect(() => {
    const fetchListFilter = async () => {
      if (pageType !== 'detail') {
        setLoading((prev) => ({ ...prev, loadingSupplier: true }));
        try {
          const res = await PromotionalGoodsService.getListSupplier();
          setSupplier(res.data);
          if (pageType === 'create') {
            setTemporary(res.data?.[0]?.supplier?.name);
            setInforSubOrg((prev) => ({
              ...prev,
              storeId: res.data?.[0]?.storeId,
              supplierId: res.data?.[0]?.supplierId,
              infor: res.data?.[0],
            }));
            setParams((prev) => ({ ...prev, filterSupplier: res.data?.[0]?.supplier?.name }));
          }
          if (pageType === 'edit') {
            const res = await PromotionalGoodsService.getById(idProduct);
            setTemporary(res?.supplierName);
            setValueSupplier(res?.supplierName);
            setParams((prev) => ({ ...prev, filterSupplier: res?.supplierName }));
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading((prev) => ({ ...prev, loadingSupplier: false }));
        }
      }
    };
    fetchListFilter();
  }, [pageType]);

  useEffect(() => {
    const fetchListProduct = async () => {
      if (loading.loadingProduct) {
        return;
      }
      if (total !== 0 && arrayListProduct?.length >= total) {
        setHasMore(false);
        return;
      }
      setHasMore(true);
      if (listSupplier.length > 0 && pageType !== 'detail') {
        setLoading((prev) => ({ ...prev, loadingProduct: true }));
        try {
          setLoadingSkeleton(true);
          const res = await PromotionalGoodsService.getListProduct({ ...params });
          if (+res?.data?.length === 0) {
            setStop(true);
          } else {
            setStop(false);
            setListProduct(listProduct.concat(res.data));
          }
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
  }, [params, stop, pageType]);

  useEffect(() => {
    const initFunction = async () => {
      if (idProduct) {
        setLoading((prev) => ({ ...prev, loadingMainPage: true }));
        try {
          const res = await PromotionalGoodsService.getById(idProduct);
          setDataOrderInvoice(res?.url);
          setFilterTax(!!res?.isApplyTax === true ? taxApply.APPLY : taxApply.NO_APPLY);
          setChoosingPromotionGoods(res?.itemList);
          for (let i = 0; i < res?.itemList.length; i++) {
            const item = res?.itemList[i];
            res['quantity' + item.code] = res?.itemList[i].quantity;
            res['priceUnit' + item.code] = res?.itemList[i].priceUnit;
          }
          form.setFieldsValue(res);
          setTemporary(res?.supplierName);
          setValueSupplier(res?.supplierName);
          if (pageType === 'edit') {
            const _res = await PromotionalGoodsService.getListProduct({ ...params, filterSupplier: res?.supplierName });
            setListProduct(_res.data);
          }
          setData({
            ...res,
            itemList: res.itemList.map((item) => ({ ...item, ['priceUnit' + item.code]: item.priceUnit })),
          });
        } catch (err) {
          console.log(err);
        } finally {
          setLoading((prev) => ({ ...prev, loadingMainPage: false }));
        }
      }
    };
    initFunction();
  }, [idProduct, pageType]);

  const handleDelete = async (id) => {
    import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        icon: 'warning',
        title: 'Thông báo',
        text: 'Bạn có chắc muốn xóa nhập hàng này?',
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Xóa',
        confirmButtonColor: '#DC2626',
        cancelButtonText: 'Hủy',
        reverseButtons: true,
        preConfirm: async () => {
          await PromotionalGoodsService.delete(id);
          if (type === '1') {
            return navigate(routerLinks('ListOfStock'));
          } else {
            return navigate(routerLinks('PromotionalGoods'));
          }
        },
      }),
    );
  };

  const handleDeleteKey = (code) => {
    const newData = choosingPromotionGoods?.filter((item) => item.code !== code);
    setChoosingPromotionGoods(newData);
    const removedItems = choosingPromotionGoods
      ?.filter((item) => item.code === code)
      .map((item) => ({ ...item, isDeleted: true }));
    setDataOrder((prev) => prev.concat(removedItems));
    newData.length === 0 && setImportExcel(0);
    form.resetFields([`quantity${code}`]);
  };

  useEffect(() => {
    const finalRemovedProductsArr = dataOrder.filter((goods) => {
      return choosingPromotionGoods.findIndex((item) => item?.code === goods?.code) === -1;
    });
    setDataOrder(finalRemovedProductsArr);
  }, [dataOrder.length, choosingPromotionGoods.length]);

  useEffect(() => {
    if (pageType === 'edit') {
      if (choosingPromotionGoods.length === 0 && data?.itemList?.length === dataOrder.length) {
        PromotionalGoodsService.delete(idProduct);
        PromotionalGoodsService.get({ page: 1, perPage: 10, storeId });
        return navigate(routerLinks('PromotionalGoods'));
      }
    }
  }, [pageType, choosingPromotionGoods.length, data?.itemList, dataOrder.length]);

  useEffect(() => {
    choosingPromotionGoods.forEach((i) => {
      form.resetFields([`priceUnit${i.code}`]);
      if (i.quantity === undefined && i.priceUnit === undefined) {
        form.resetFields([`quantity${i.code}`]);
        form.resetFields([`priceUnit${i.code}`]);
      }
    });
  }, [choosingPromotionGoods?.length]);

  useEffect(() => {
    const fetchAllBarcodeOfStore = async () => {
      try {
        const res = await PromotionalGoodsService.getAllBarcode();
        setListStoreBarcode(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllBarcodeOfStore();
  }, []);

  const toggleAmount = (data, type) => {
    const { code, _priceUnit, _quantity, storeBarcode } = data;
    const tempOrder =
      choosingPromotionGoods &&
      choosingPromotionGoods.map((item) => {
        if (item.code === code) {
          if (type === 3) {
            return { ...item, _storeBarcode: storeBarcode };
          }
          if (type === 1) {
            return { ...item, priceUnit: _priceUnit };
          }
          if (type === 2) {
            return { ...item, quantity: _quantity };
          }
        }
        return item;
      });

    return setChoosingPromotionGoods([...tempOrder]);
  };
  const _renderTableOrderDetail = () => {
    return (
      <div className="overflow-x-scroll w-full h-auto overflow-y-hidden">
        <div className="AddScrollTable ">
          {filterTax === taxApply.APPLY ? (
            <Row gutter={16} className="mb-3">
              <Col className="gutter-row " span={3}>
                <div className="text-sm font-bold text-gray-700">Mã vạch</div>
              </Col>
              <Col className="gutter-row " span={4}>
                <div className="text-sm font-bold text-gray-700">Tên sản phẩm</div>
              </Col>
              <Col className="gutter-row" span={2}>
                <div className="text-sm font-bold text-gray-700">ĐVT</div>
              </Col>
              <Col className="gutter-row" span={3}>
                <div className="text-sm font-bold text-gray-700">Đơn giá (VND)</div>
              </Col>
              <Col className="gutter-row" span={3}>
                <div className="text-sm font-bold text-gray-700">Số lượng</div>
              </Col>
              <Col className="gutter-row" span={3}>
                <div className="text-sm font-bold text-gray-700">Thành tiền (VND)</div>
              </Col>
              <Col className="gutter-row" span={2}>
                <div className="text-sm font-bold text-gray-700">Thuế</div>
              </Col>
              <Col className="gutter-row" span={3}>
                <div className="text-sm font-bold text-gray-700">Tiền sau thuế (VND)</div>
              </Col>
              <Col className="gutter-row text-center" span={1}>
                <div></div>
              </Col>
            </Row>
          ) : (
            <Row gutter={16} className="mb-3">
              <Col className="gutter-row " span={3}>
                <div className="text-sm font-bold text-gray-700">Mã vạch</div>
              </Col>
              <Col className="gutter-row " span={5}>
                <div className="text-sm font-bold text-gray-700">Tên sản phẩm</div>
              </Col>
              <Col className="gutter-row" span={2}>
                <div className="text-sm font-bold text-gray-700">ĐVT</div>
              </Col>
              <Col className="gutter-row" span={4}>
                <div className="text-sm font-bold text-gray-700">Đơn giá (VND)</div>
              </Col>
              <Col className="gutter-row" span={4}>
                <div className="text-sm font-bold text-gray-700">Số lượng</div>
              </Col>
              <Col className="gutter-row" span={5}>
                <div className="text-sm font-bold text-gray-700">Thành tiền (VND)</div>
              </Col>
              <Col className="gutter-row text-center" span={1}>
                <div></div>
              </Col>
            </Row>
          )}

          <hr />
          {choosingPromotionGoods &&
            choosingPromotionGoods?.map((item, index) => {
              item.tax = item?.importTax?.taxRate ?? item?.tax;
              return (
                <div key={index}>
                  <Row gutter={16} className="py-3 flex items-center">
                    <Col className="gutter-row " span={3}>
                      {(item?.storeBarcode === undefined || item?.storeBarcode === null || item?.storeBarcode === '') &&
                      !item?.storeBarcodeCheck ? (
                        <Form.Item
                          name={`_storeBarCode${item.code}`}
                          style={{
                            margin: 0,
                          }}
                          rules={[
                            ({ getFieldValue }) => ({
                              validator(rule, value) {
                                if (value === undefined) {
                                  return Promise.resolve();
                                }
                                if (
                                  choosingPromotionGoods.filter((item) => item.storeBarcode === value).length > 0 ||
                                  choosingPromotionGoods.filter((item) => item._storeBarcode === value).length > 1 ||
                                  listStoreBarcode.filter((item) => item === value).length > 0
                                ) {
                                  return Promise.reject(new Error('Mã vạch đã được dùng, Vui lòng nhập lại'));
                                }
                                if (value?.length > 13) {
                                  return Promise.reject(new Error('Vượt quá 13 ký tự'));
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          <Input
                            readOnly={pageType === 'detail'}
                            type="number"
                            defaultValue={item?.barcode}
                            value={item?.barcode}
                            onChange={(e) => {
                              toggleAmount({ code: item?.code, storeBarcode: e.target.value }, 3);
                            }}
                            onPressEnte={(e) => {
                              toggleAmount({ code: item?.code, storeBarcode: e.target.value }, 3);
                            }}
                            // onKeyDown={blockInvalidChar}
                            placeholder="Nhập mã"
                            className="!h-9 w-[85%] !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 !text-left p-2"
                          />
                        </Form.Item>
                      ) : (
                        <div className="text-sm font-normal text-gray-700">{item?.storeBarcode}</div>
                      )}
                    </Col>
                    <Col className="gutter-row " span={filterTax === taxApply.APPLY ? 4 : 5}>
                      <div className="h-full grid items-center gap-4 text-left">
                        <div className="flex gap-1 items-center">
                          <img
                            src={pageType === 'create' ? item?.photos?.[0]?.url : item.image || item?.photos?.[0]?.url}
                            alt={item?.name}
                            className="object-cover !h-[38px] !w-[46px] rounded-[4px] flex-none"
                          />
                          <h5 className="col-span-3 text-sm font-normal text-gray-700 break-normal">{item?.name}</h5>
                        </div>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={2}>
                      <h5 className="text-sm font-normal text-gray-700 break-all"> {item?.basicUnit}</h5>
                    </Col>
                    <Col className="gutter-row" span={filterTax === taxApply.APPLY ? 3 : 4}>
                      <div className="flex items-center justify-left btn-quantity ">
                        {pageType !== 'detail' && (
                          <Form.Item
                            name={`priceUnit${item.code}`}
                            style={{
                              margin: 0,
                            }}
                            rules={[
                              {
                                required: true,
                                message: `Đơn giá là bắt buộc`,
                              },
                            ]}
                            initialValue={
                              pageType === 'edit' ? +item.priceUnit || +item.price : +item?.productPrice?.[0]?.price
                            }
                          >
                            <InputNumber
                              readOnly={pageType === 'detail'}
                              formatter={(value) => {
                                if (!value) {
                                  return;
                                }
                                return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                              }}
                              parser={(value) => {
                                if (!value) {
                                  return;
                                }
                                return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
                              }}
                              value={item?.priceUnit}
                              initialValues={item?.priceUnit}
                              onChange={(value) => {
                                toggleAmount({ code: item?.code, _priceUnit: value }, 1);
                              }}
                              onKeyDown={blockInvalidChar}
                              placeholder=" Nhập giá trị"
                              className="!h-9 w-[100%] !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 !text-left pl-2"
                            />
                          </Form.Item>
                        )}

                        {pageType === 'detail' && (
                          <span className="text-sm font-normal text-gray-700">
                            {formatCurrency(item?.priceUnit, ' ')}
                          </span>
                        )}
                      </div>
                    </Col>
                    <Col className="gutter-row " span={filterTax === taxApply.APPLY ? 3 : 4}>
                      <div className="flex items-center justify-left btn-quantity ">
                        {pageType === 'detail' && <span>{item?.quantity.toLocaleString('vi-VN')}</span>}
                        {pageType !== 'detail' && (
                          <Form.Item
                            name={`quantity${item.code}`}
                            style={{
                              margin: 0,
                            }}
                            rules={[
                              {
                                required: importExcel !== 2 && true,
                                message: `Số lượng là bắt buộc`,
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (+value === 0 && value !== '' && value !== null) {
                                    return Promise.reject(new Error('Vui lòng nhập giá trị lớn hơn 0'));
                                  }
                                  if (+value > 999999) {
                                    return Promise.reject(new Error('Số lượng không được vượt quá 999999'));
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                          >
                            <Input
                              readOnly={pageType === 'detail'}
                              value={+item?.quantity}
                              defaultValue={+item?.quantity}
                              type="number"
                              min={1}
                              maxLength={6}
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
                              placeholder=" Nhập giá trị"
                              className="h-9 w-[100%] !rounded-xl !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 pl-2"
                            />
                          </Form.Item>
                        )}
                      </div>
                    </Col>
                    <Col className="gutter-row " span={filterTax === taxApply.APPLY ? 3 : 5}>
                      <div className="text-sm font-normal text-gray-700 break-all">
                        {isNaN(item?.priceUnit) || item?.priceUnit === undefined || item?.quantity === undefined
                          ? null
                          : formatCurrency(+item?.priceUnit * +item?.quantity, ' ')}
                      </div>
                    </Col>
                    {filterTax === taxApply.APPLY ? (
                      <Col className="gutter-row " span={2}>
                        <div className="text-sm font-normal text-gray-700">
                          {(item?.importTax?.taxRate === 0 && 0) || +item?.tax}%
                        </div>
                      </Col>
                    ) : null}
                    {filterTax === taxApply.APPLY ? (
                      <Col className="gutter-row " span={3}>
                        <div className="text-sm font-normal text-gray-700 break-all">
                          {/* {pageType === 'create' && item?.priceUnit === undefined
                          ? item?.productPrice[0]?.price === undefined || item?.quantity === undefined
                            ? null
                            : formatCurrency(+item?.productPrice[0]?.price * +item?.quantity, ' ')
                          : pageType === 'create' && item?.priceUnit !== undefined
                            ? item?.priceUnit === undefined || item?.quantity === undefined
                              ? null
                              : formatCurrency(+item?.priceUnit * +item?.quantity, ' ')
                            : pageType === 'edit' && item.priceUnit === undefined && item.quantity === undefined
                              ? null
                              : formatCurrency((+item?.priceUnit || +item?.price) * +item?.quantity, ' ')} */}
                          {isNaN(item?.priceUnit) || item?.priceUnit === undefined || item?.quantity === undefined
                            ? null
                            : formatCurrency(
                                Math.floor(
                                  +item?.priceUnit *
                                    +item?.quantity *
                                    (1 +
                                      ((item?.importTax?.taxRate === 0 ? 0 : item?.importTax?.taxRate) || +item?.tax) /
                                        100),
                                ),
                                ' ',
                              )}
                        </div>
                      </Col>
                    ) : null}

                    <Col className="gutter-row " span={1}>
                      {pageType !== 'detail' && (
                        <button className="remove-btn" onClick={() => handleDeleteKey(item.code)}>
                          <i className="las la-trash-alt text-red-600 text-2xl"></i>
                        </button>
                      )}
                    </Col>
                  </Row>
                  <hr />
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  const handleSubmit = async (values) => {
    if ((totalPriceAfterTax === 0 || totalPrice === 0) && choosingPromotionGoods.length === 0) {
      Message.error({ text: 'Vui lòng chọn ít nhất một sản phẩm' });
    } else {
      setDisabledButton((prev) => ({ ...prev, disabledBtn: true }));
      setLoading((prev) => ({ ...prev, isLoadingSkin: true }));
      let param = {};
      pageType === 'create'
        ? (param = {
            importedAt: moment(values.importedAt).toISOString(),
            supplierId: inforSubOrg.supplierId,
            storeId: inforSubOrg.storeId,
            importedAddress: {
              street: values?.importedAddress,
            },
            importedReason: values?.importedReason,
            itemList: [
              ...choosingPromotionGoods.map((item) => ({
                code: item.code,
                id: item.id,
                name: item.name,
                basicUnit: item.basicUnit,
                priceUnit: item.priceUnit,
                quantity: item.quantity,
                isDeleted: false,
                tax: +item.importTax.taxRate,
                storeBarcode: item.storeBarcode || item?._storeBarcode || item.barcode,
              })),
            ],
            importedStatus: createExport === true ? 'DELIVERED' : 'PROCESSING',
            total: filterTax === taxApply.APPLY ? totalPriceAfterTax : totalPrice,
            isApplyTax: filterTax === taxApply.APPLY,
            paymentSupplier,
          })
        : (param = {
            importedAt: moment(values.importedAt).toISOString(),
            supplierId: inforSubOrg.supplierId,
            storeId: inforSubOrg.storeId,
            importedAddress: {
              street: values?.importedAddress,
            },
            importedReason: values?.importedReason,
            itemList: [
              ...choosingPromotionGoods
                .map((item) => ({
                  id: item.id,
                  code: item.code,
                  name: item.name,
                  basicUnit: item.basicUnit,
                  priceUnit: item.priceUnit,
                  quantity: item.quantity,
                  isDeleted: false,
                  storeBarcode: item?._storeBarcode || item.storeBarcode || item.barcode,
                  tax: +item?.tax || +item?.importTax?.taxRate,
                }))
                .concat(dataOrder),
            ],
            importedStatus: 'PROCESSING',
            total: filterTax === taxApply.APPLY ? totalPriceAfterTax : totalPrice,
            isApplyTax: filterTax === taxApply.APPLY,
            paymentSupplier,
          });
      if (pageType === 'create' && exportBillByCraete === true) {
        const response = await PromotionalGoodsService.exportBillPromotionByCreate(param);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(new Blob([response], { type: response.type }));
        link.target = '_blank';
        link.download = `Phiếu nhập hàng trực tiếp`;
        document.body.appendChild(link);
        link.click();
        link?.parentNode?.removeChild(link);
        setLoading((prev) => ({ ...prev, isLoadingSkin: false }));
        if (type === '1') {
          return navigate(routerLinks('ListOfStock'));
        } else {
          return navigate(routerLinks('PromotionalGoods'));
        }
        // return navigate(routerLinks('PromotionalGoods'));
      }
      let res;
      pageType === 'create'
        ? (res = await PromotionalGoodsService.post(param))
        : (res = await PromotionalGoodsService.put(idProduct, param));

      if (res) {
        setDisabledButton((prev) => ({ ...prev, disabledBtn: false }));
        setLoading((prev) => ({ ...prev, isLoadingSkin: false }));
        if (type === '1') {
          return navigate(routerLinks('ListOfStock'));
        } else {
          return navigate(routerLinks('PromotionalGoods'));
        }
        // return navigate(routerLinks('PromotionalGoods'));
      }
    }
  };
  if (loading.loadingMainPage) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }
  if (loading.isLoadingSkin) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <SpinAntd />
      </div>
    );
  }
  return (
    <Fragment>
      <div className="min-h-screen promotional-good-container">
        <Form form={form} component={false} onFinish={handleSubmit}>
          <p className="text-2xl text-teal-900 font-bold">Nhập hàng trực tiếp</p>
          <div className="bg-white w-full px-6 pt-2 rounded-xl mt-5 relative pb-5">
            <div className="mb-4 border-b border-gray-200">
              <div className="flex mb-4 flex-col sm:flex-row justify-start items-center">
                <h2 className="font-bold text-lg text-teal-900 sm:mr-3 mb-2 sm:mb-0">Thông tin nhập hàng</h2>
                {pageType !== 'create' && (
                  <div>
                    {data?.importedStatus === 'PROCESSING' ? (
                      <div className="flex text-base font-semibold text-yellow-500">
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M10 0.75L9.76562 0.960938L1.21094 9.60938L0.695312 10.125L1.21094 10.6641L8.33594 17.7891L8.875 18.3047L9.39062 17.7891L18.0391 9.23438L18.25 9V0.75H10ZM10.6328 2.25H16.75V8.36719L8.875 16.1953L2.80469 10.125L10.6328 2.25ZM14.5 3.75C14.0869 3.75 13.75 4.08691 13.75 4.5C13.75 4.91309 14.0869 5.25 14.5 5.25C14.9131 5.25 15.25 4.91309 15.25 4.5C15.25 4.08691 14.9131 3.75 14.5 3.75Z"
                            fill="#EAB308"
                          />
                        </svg>
                        <span className="ml-2"> Đang xử lý</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-base font-semibold text-green-600">
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M10 0.75L9.76562 0.960938L1.21094 9.60938L0.695312 10.125L1.21094 10.6641L8.33594 17.7891L8.875 18.3047L9.39062 17.7891L18.0391 9.23438L18.25 9V0.75H10ZM10.6328 2.25H16.75V8.36719L8.875 16.1953L2.80469 10.125L10.6328 2.25ZM14.5 3.75C14.0869 3.75 13.75 4.08691 13.75 4.5C13.75 4.91309 14.0869 5.25 14.5 5.25C14.9131 5.25 15.25 4.91309 15.25 4.5C15.25 4.08691 14.9131 3.75 14.5 3.75Z"
                            fill="#16A34A"
                          />
                        </svg>

                        <span className="ml-2"> Đã hoàn tất</span>
                      </div>
                    )}
                  </div>
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
                  className="mb-4 grid grid-cols-1 lg:grid-cols-2"
                >
                  <Col span={24} sm={12}>
                    <div className="mb-2 lg:mb-0 grid sm:grid-cols-[180px_minmax(180px,_1fr)]">
                      <span className="font-normal text-black text-base">Nhà cung cấp: </span>
                      <span className="font-normal text-base text-gray-500">
                        {temporary || inforSubOrg?.infor?.supplier?.name}
                      </span>
                    </div>
                  </Col>
                  <Col span={24} sm={12}>
                    <div className="grid-cols-1 sm:w-[180px] mb-2 lg:mb-0 grid md:grid-cols-[180px_minmax(180px,_1fr)] lg:w-auto items-center">
                      <div className="font-normal text-black text-base mb-2 lg:mb-0">Thời gian nhập hàng: </div>
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
                            format="DD/MM/YYYY"
                            className="w-full !bg-white !border-gray-200 !text-gray-500 "
                            disabledDate={(current) => {
                              return current && current.valueOf() > Date.now();
                            }}
                          />
                        </Form.Item>
                      </Space>
                    </div>
                  </Col>
                  {/* </div> */}
                  {/* <div className="block md:flex items-center w-full"> */}
                  <Col span={24} sm={12}>
                    <div className="grid sm:grid-cols-[180px_minmax(180px,_1fr)] items-center mt-2">
                      <span className="font-normal text-black text-base ">Tên cửa hàng: </span>
                      {/* <span className="font-normal text-base text-gray-500">{inforSubOrg?.infor?.store?.name}</span> */}
                      <span className="font-normal text-base text-gray-500">{user?.userInfor?.subOrgName}</span>
                    </div>
                  </Col>
                  <Col span={24} sm={12}>
                    <div className="grid-cols-1 sm:w-[180px] mb-2 lg:mb-0 grid md:grid-cols-[180px_minmax(180px,_1fr)] lg:w-auto items-center mt-1">
                      <span className="font-normal text-black text-base mb-2 lg:mb-0">
                        Lý do nhập hàng: <span className="text-[#ff4d4f] text-sm">*</span>
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
                                return Promise.reject(new Error('Lý do nhập hàng là bắt buộc'));
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

                  {/* </div> */}
                </Row>
              ) : (
                <Row
                  gutter={{
                    xs: 8,
                    sm: 16,
                    md: 24,
                    lg: 32,
                  }}
                  className="grid grid-cols-1 lg:grid-cols-2"
                >
                  <Col span={24} sm={12}>
                    <div className="mb-4 grid sm:grid-cols-[180px_minmax(180px,_1fr)]">
                      <span className="font-normal text-black text-base">Mã nhập hàng: </span>
                      <span className="font-normal text-base text-gray-500">{data?.importedCode || 'Đang xử lý'}</span>
                    </div>
                  </Col>
                  <Col span={24} sm={12}>
                    <div className="mb-4 grid sm:grid-cols-[180px_minmax(180px,_1fr)] items-center">
                      <span className="font-normal text-black text-base">Thời gian nhập hàng: </span>
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
                                message: `Thời gian nhập hàng là bắt buộc`,
                              },
                            ]}
                            initialValue={moment()}
                          >
                            <DatePicker
                              format="DD/MM/YYYY"
                              className="w-full !bg-white !border-gray-200 !text-gray-500 "
                              disabledDate={(current) => {
                                return current && current.valueOf() > Date.now();
                              }}
                            />
                          </Form.Item>
                        </Space>
                      ) : (
                        <span className="font-normal text-base text-gray-500">
                          {moment(data?.importedAt).format('DD/MM/YYYY')}
                        </span>
                      )}
                    </div>
                  </Col>
                  <Col span={24} sm={12}>
                    <div className="mb-4 grid sm:grid-cols-[180px_minmax(100%,_1fr)]">
                      <span className="font-normal text-black text-base">Nhà cung cấp: </span>
                      <span className="font-normal text-base text-gray-500">{data?.supplierName}</span>
                    </div>
                  </Col>
                  <Col span={24} sm={12}>
                    <div className="mb-4 grid sm:grid-cols-[180px_minmax(100%,_1fr)]">
                      <span className="font-normal text-black text-base">Tên cửa hàng: </span>
                      <span className="font-normal text-base text-gray-500">{data?.storeName}</span>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="mb-4 grid sm:grid-cols-[180px_minmax(150%,_1fr)] items-center">
                      <span className="font-normal text-black text-base">
                        Lý do nhập hàng: {pageType !== 'detail' && <span className="text-[#ff4d4f] text-sm">*</span>}{' '}
                      </span>
                      {pageType !== 'detail' ? (
                        <Form.Item
                          name="importedReason"
                          style={{
                            margin: 0,
                          }}
                          rules={[
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || value.trim() === '') {
                                  return Promise.reject(new Error('Lý do nhập hàng là bắt buộc'));
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          <Input
                            className="w-full  px-3 py-2 !bg-white rounded-[10px] border border-gray-200 focus:!shadow-none focus:!border-gray-200"
                            placeholder="Nhập lý do"
                          />
                        </Form.Item>
                      ) : (
                        <span className="font-normal text-base text-gray-500">{data?.importedReason}</span>
                      )}
                    </div>
                  </Col>
                </Row>
              )}
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center flex-col sm:flex-row mb-4 mt-4">
                <h2 className="font-bold text-base text-teal-900">Chi tiết nhập hàng</h2>
                <Select_Tax
                  disabled={pageType === 'detail'}
                  defaultValue={filterTax}
                  className="w-full sm:w-[245px] my-2"
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
              <div className="flex items-center sm:justify-end justify-center mb-4 gap-4">
                {pageType !== 'detail' && (
                  <>
                    {pageType === 'create' && (
                      <button
                        disabled={importExcel === 1}
                        className={
                          'btn-import hover:text-white text-teal-900 w-[136px] sm:w-[173px] h-[44px] justify-center rounded-[10px] inline-flex items-center hover:bg-teal-900 bg-white border border-teal-900'
                        }
                        onClick={() => {
                          if (choosingPromotionGoods.length === 0) {
                            setVisibleExcel(true);
                          } else {
                            import('sweetalert2').then(({ default: Swal }) =>
                              Swal.fire({
                                title: 'Thông báo',
                                text: 'Tất cả các sản phẩm được chọn sẽ bị xóa! Bạn có muốn tiếp tục không?',
                                icon: 'warning',
                                showCancelButton: true,
                                cancelButtonText: 'Hủy',
                                confirmButtonText: 'Tiếp tục',
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  setImportExcel(0);
                                  setVisibleExcel(true);
                                  setChoosingPromotionGoods([]);
                                  setListProduct([]);
                                }
                              }),
                            );
                          }
                        }}
                        id="addBtn"
                      >
                        {'Nhập từ file excel'}
                      </button>
                    )}
                    <button
                      disabled={importExcel === 2}
                      type="button"
                      onClick={async () => {
                        setLoading((prev) => ({ ...prev, loadingProduct: true }));
                        setVisible(true);
                        setListProduct([]);
                        setParams({ ...params, page: 1 });
                        setLoading((prev) => ({ ...prev, loadingProduct: false }));
                      }}
                      id="saveBtn"
                      className="btn-add w-[136px] sm:w-[173px] h-[44px] bg-teal-900 text-white text-sm rounded-[10px] flex justify-center items-center gap-[10px]"
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
                  </>
                )}
              </div>
              {/* <div>
                  <TablePromotionalGoods
                    dataSource={choosingPromotionGoods.map((item, index) => ({
                      ...item,
                      key: index + 1,
                    }))}
                    setDataSource={setChoosingPromotionGoods}
                    pageType={pageType}
                  // isValidate={isValidate}
                  // setDataOrder={setDataOrder}
                  // dataOrder={dataOrder}
                  />
                  <div className="!bg-gray-300 w-full h-[0.5px]" />

                </div> */}

              <div>{_renderTableOrderDetail()}</div>
              {/* <div className="w-full flex justify-end mt-8">
                  <div className="flex justify-between mr-5">
                    <span className="font-bold text-base text-teal-900 mr-11">Tổng tiền:</span>
                    <span className="font-bold text-base text-slate-700">
                      {' '}
                      {formatBigNumberCurency(totalPrice, ' VND')}{' '}
                    </span>
                  </div>
                </div> */}

              <div
                className={`totalMoney-area w-full ${
                  +totalPriceAfterTax > 999999999999 ? 'lg:w-[45%]' : 'lg:w-[40%]'
                }  flex flex-col ml-auto gap-2 mt-6 mb-[54px]`}
              >
                <div>
                  <div className="flex justify-between mr-5">
                    <span className="font-bold text-sm md:text-base text-teal-900 mr-11">Tổng tiền hàng:</span>
                    <span className="font-bold text-sm md:text-base text-slate-700">
                      {' '}
                      {formatCurrency(totalPrice, ' VND')}{' '}
                    </span>
                  </div>
                </div>
                {filterTax === taxApply.APPLY ? (
                  <div>
                    <div className="flex justify-between mr-5">
                      <span className="font-bold text-sm md:text-base text-teal-900 mr-11">Tiền thuế:</span>
                      <span className="font-bold text-sm md:text-base text-slate-700">
                        {' '}
                        {formatCurrency(totalTaxPrice, ' VND')}{' '}
                      </span>
                    </div>
                  </div>
                ) : null}
                {filterTax === taxApply.APPLY ? (
                  <div>
                    <div className="flex justify-between mr-5">
                      <span className="font-bold text-sm md:text-base text-teal-900 mr-11">Tổng tiền sau thuế:</span>
                      <span className="font-bold text-sm md:text-base text-slate-700">
                        {' '}
                        {formatCurrency(Math.round(totalPriceAfterTax), ' VND')}{' '}
                      </span>
                    </div>
                  </div>
                ) : null}
                {pageType === 'detail' && (
                  <div>
                    <div className="flex justify-between mr-5">
                      <span className="font-bold text-sm md:text-base text-teal-900 mr-11">
                        Đã trả cho nhà cung cấp:
                      </span>
                      <span className="font-bold text-sm md:text-base text-slate-700">
                        {' '}
                        {formatCurrency(Math.round(data?.paymentSupplierOrder), ' VND')}{' '}
                      </span>
                    </div>
                  </div>
                )}
                {data.paymentSupplierStatus !== 'PAID' && (
                  <div>
                    <div className="flex justify-between mr-5">
                      <span className="font-bold text-sm md:text-base text-teal-900 mr-11">Số tiền thanh toán:</span>
                      <span className="font-bold text-sm md:text-base text-slate-700">
                        <InputNumber
                          className="input-payment h-9 !w-[173px] !px-2 !rounded-[10px] !bg-white !border-1 border-gray-200 focus:!shadow-none focus:!border-gray-200"
                          placeholder="Nhập số tiền"
                          value={paymentSupplier}
                          onChange={(e) => {
                            if (e > totalPriceAfterTax || e < 0) {
                              setCheckPaymentSupplier(true);
                            } else {
                              setCheckPaymentSupplier(false);
                            }
                            setPaymentSupplier(e);
                          }}
                        />
                      </span>
                    </div>
                    {checkPaymentSupplier && (
                      <p className="text-red-500 text-right">
                        Số tiền nhập không được lớn hơn tổng số tiền cần thanh toán.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row justify-between mt-[22px] items-center">
            <button
              onClick={() => {
                if (pageType === 'create' && +step === 1) {
                  setStep(1);
                  return navigate(`${routerLinks('PromotionalGoods')}`);
                }
                if (pageType === 'create' && +step === 2) {
                  setStep(1);
                  return navigate(`${routerLinks('PromotionalGoodsCreate')}?step=1`);
                }
                if (pageType === 'edit' || pageType === 'detail') {
                  return window.history.back();
                }
              }}
              className={`mb-2 lg:mb-0 w-[259px] md:w-[106px] h-[44px] bg-white border-teal-900 text-teal-900  border-solid border
        text-sm rounded-[10px]`}
              id="backBtn"
            >
              Trở về
            </button>
            {(((roleCode === 'OWNER_STORE' ) && data?.importedStatus === 'PROCESSING') ||
              pageType === 'create') && (
              <div className="flex justify-center lg:justify-end flex-col md:flex-row">
                {pageType === 'create' && (
                  <button
                    disabled={disabledButon.disabledBtn}
                    onClick={async () => {
                      setExportBillByCreate(true);
                      form && form.submit();
                    }}
                    id="outBtn"
                    className="mb-2 lg:mb-0 w-[259px] md:w-[177px] h-[44px] bg-transparent border border-teal-900 text-teal-900 text-sm rounded-[10px] md:mr-4"
                  >
                    Xuất phiếu nhập hàng
                  </button>
                )}

                {pageType === 'detail' && (
                  <button
                    disabled={disabledButon.disabledBtn}
                    onClick={async () => {
                      setDisabledButton((prev) => ({ ...prev, disabledBtn: true }));
                      setLoading((prev) => ({ ...prev, isLoadingSkin: true }));
                      // const res = await PromotionalGoodsService.exportBillPromotion(idProduct);
                      const response = await PromotionalGoodsService.printOrderPromotion(idProduct, paymentSupplier);
                      const link = document.createElement('a');
                      link.href = window.URL.createObjectURL(new Blob([response], { type: response.type }));
                      link.target = '_blank';
                      link.download = `Phiếu nhập hàng trực tiếp`;
                      document.body.appendChild(link);
                      link.click();
                      link?.parentNode?.removeChild(link);
                      // if (res) {
                      //   setDisabledButton((prev) => ({ ...prev, disabledBtn: false }));
                      // }
                      if (response) {
                        setLoading((prev) => ({ ...prev, isLoadingSkin: false }));
                      }
                      if (type === '1') {
                        return navigate(routerLinks('ListOfStock'));
                      } else {
                        return navigate(routerLinks('PromotionalGoods'));
                      }
                      // return navigate(routerLinks('PromotionalGoods'));
                    }}
                    id="outBtn"
                    className="mb-2 lg:mb-0 w-[259px] md:w-[177px] h-[44px] bg-transparent border border-teal-900 text-teal-900 text-sm rounded-[10px] mr-0 md:mr-2 lg:mr-4 "
                  >
                    Xuất phiếu nhập hàng
                  </button>
                )}
                {pageType !== 'detail' ? (
                  <button
                    type="submit"
                    onClick={() => {
                      setCreateExport(false);
                      form && form.submit();
                    }}
                    id="saveBtn"
                    className="mb-2 lg:mb-0 w-[259px] md:w-[137px] h-[44px] bg-teal-900 text-white text-sm rounded-[10px]"
                  >
                    Lưu
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (type === '1')
                        navigate(
                          routerLinks('PromotionalGoodsEdit') + `?id=${idProduct || data?.id}&step=2` + `&type=${1}`,
                        );
                      else navigate(`${routerLinks('PromotionalGoodsEdit')}?id=${idProduct || data?.id}&step=2`);
                    }}
                    id="editBtn"
                    className="mb-2 lg:mb-0 w-[259px] md:w-[156px] h-[44px] bg-teal-900 text-white text-sm rounded-[10px]"
                  >
                    Chỉnh sửa
                  </button>
                )}
                {pageType === 'detail' && (
                  <button
                    onClick={() => handleDelete(idProduct)}
                    id="deleteBtn"
                    className="mb-2 lg:mb-0 w-[259px] md:w-[84px] h-[44px] bg-red-600 text-white text-sm rounded-[10px] ml-0 md:ml-2 lg:ml-4"
                  >
                    Xóa
                  </button>
                )}
              </div>
            )}
            {(roleCode === 'OWNER_STORE' ) &&
              data?.importedStatus === 'DELIVERED' &&
              data.paymentSupplierStatus !== 'PAID' && (
                <div className="flex justify-center lg:justify-end flex-col md:flex-row">
                  <button
                    onClick={async () => {
                      setLoading((prev) => ({ ...prev, isLoadingSkin: true }));
                      const NoteKey = dataOrderInvoice;
                      if (NoteKey) {
                        const responsive = await SupplierService.downloadWhenCreateWithKey(NoteKey);
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(new Blob([responsive], { type: responsive.type }));
                        link.target = '_blank';
                        link.download = `Phiếu nhập hàng trực tiếp`;
                        document.body.appendChild(link);
                        link.click();
                        link?.parentNode?.removeChild(link);
                      }
                      setLoading((prev) => ({ ...prev, isLoadingSkin: false }));
                    }}
                    id="outBtn"
                    className="mb-2 lg:mb-0 w-[259px] md:w-[177px] h-[44px] hover:bg-white bg-transparent border border-teal-900 text-teal-900 text-sm rounded-[10px] md:mr-4"
                  >
                    In phiếu nhập hàng
                  </button>
                  <button
                    onClick={async () => {
                      const res = await SupplierService.paidSupplier(idProduct, paymentSupplier);
                      res &&
                        Message.success({
                          text: res.message,
                          title: 'Thành công',
                          cancelButtonText: 'Đóng',
                        });
                      return navigate(`${routerLinks('PromotionalGoods')}`);
                    }}
                    id="saveBtn"
                    className="mb-2 lg:mb-0 w-[259px] md:w-[137px] h-[44px] bg-teal-900 text-white text-sm rounded-[10px]"
                  >
                    Thanh toán
                  </button>
                </div>
              )}
          </div>
        </Form>
        {/* modal excel */}
        <Modal
          closable={false}
          title={false}
          centered
          okText="Tiếp theo"
          open={visibleExcel}
          width={831}
          wrapClassName={'modal-add-promotion-goods'}
          footer={
            <div className="flex justify-between w-full">
              <button
                onClick={(event) => {
                  if (loadingImport) {
                    event.preventDefault();
                  } else {
                    setVisibleExcel(false);
                  }
                }}
                className="w-[106px] h-[44px] hover:bg-teal-900 bg-white border-2 border-radius border-teal-900 hover:text-white text-teal-900 text-sm rounded-[10px]"
              >
                Đóng
              </button>
              <button
                disabled={dataExcel.length === 0}
                onClick={async (event) => {
                  const newArrDataExcel = dataExcel.map((item) => {
                    const newPrice = Number.isInteger(item?.price) ? item.price : Math.floor.item?.price;
                    const newQuantity =
                      typeof item.quantity === 'string' ? Number(item.quantity.replace(',', '.')) : item.quantity;
                    return { ...item, price: newPrice, quantity: newQuantity };
                  });
                  if (loadingImport) {
                    event.preventDefault();
                  } else {
                    setLoadingImport(true);
                    const allHaveSameSupplier = newArrDataExcel.every(
                      (item) => item.supplierName === newArrDataExcel[0].supplierName || item.supplierName === null,
                    );
                    // check supplier === null
                    if (allHaveSameSupplier) {
                      const emptySupplierNames = newArrDataExcel.filter((item) => item.supplierName === null);
                      // dataExcelSupplier is array has supplier
                      const dataExcelSupplier = newArrDataExcel.filter((item) => item.supplierName !== null);
                      const newEmptySupplierNames = emptySupplierNames.map((item) => ({
                        index: item?.index,
                        error: 'Để trống nhà cung cấp',
                      }));

                      // check dataExcelSupplier in getListSupplier
                      if (dataExcelSupplier.length === 0) {
                        Message.error({
                          text: 'Không được để trống nhà cung cấp!',
                        });
                        setLoadingImport(false);
                        setVisibleExcel(false);
                        return;
                      }
                      const result = listSupplier?.filter(
                        (item) => item.supplier.code === dataExcelSupplier[0].supplierName,
                      );
                      if (result.length > 0) {
                        // check quantity === null
                        const nullQuantityItems = dataExcelSupplier.filter((item) => item.quantity === null);
                        const newNullQuantityItems = nullQuantityItems.map((item) => ({
                          index: item?.index,
                          error: 'Để trống số lượng sản phẩm',
                        }));

                        // check quantity !== null
                        const nonNullQuantityItems = dataExcelSupplier.filter((item) => item.quantity !== null);
                        if (nonNullQuantityItems.length === 0) {
                          Message.error({
                            text: 'Không được để trống số lượng sản phẩm!',
                          });
                          setLoadingImport(false);
                          setVisibleExcel(false);
                          return;
                        }

                        // check barcode === null
                        const nullBarcodeItems = nonNullQuantityItems.filter(
                          (item) => item.barcodeSupplier === null && item.barcodeStore === null,
                        );
                        const newNullBarcodeItems = nullBarcodeItems.map((item) => ({
                          index: item?.index,
                          error: 'Để trống mã vạch sản phẩm',
                        }));

                        // check barcode !== null
                        const nonNullBarcodeItems = nonNullQuantityItems.filter(
                          (item) => item.barcodeSupplier !== null || item.barcodeStore !== null,
                        );

                        const _res = await PromotionalGoodsService.getListProduct({
                          ...params,
                          page: 0,
                          perPage: 0,
                          filterSupplier: result[0]?.supplier?.name,
                        });
                        setInforSubOrg({
                          storeId: result[0]?.storeId,
                          supplierId: result[0]?.supplier.id,
                          infor: result[0]?.supplier,
                        });
                        // check barcode Store
                        if (nonNullBarcodeItems.length === 0) {
                          Message.error({
                            text: 'Không được để trống mã vạch sản phẩm!',
                          });
                          setLoadingImport(false);
                          setVisibleExcel(false);
                          return;
                        }
                        const result1 = _res?.data.reduce((acc, item1) => {
                          const item2 = nonNullBarcodeItems.find(
                            (product) => product.barcodeStore === item1.storeBarcode,
                          );
                          if (item2) {
                            const newItem = {
                              ...item1,
                              quantity: +item2.quantity.toFixed(2),
                              priceUnit: +item2.price,
                              storeBarcodeCheck: true,
                              productPrice: [
                                {
                                  id: item1.productPrice[0].priceType,
                                  priceType: item1.productPrice[0].priceType,
                                  minQuantity: item1.productPrice[0].minQuantity,
                                  price: +item2.price,
                                  productId: item1.productPrice[0].productId,
                                  defaultPrice: item1.productPrice[0].defaultPrice,
                                },
                              ],
                            };
                            acc.push(newItem);
                          }
                          return acc;
                        }, []);

                        const differentElements = nonNullBarcodeItems.filter((element) => {
                          return !result1.some((item) => item.storeBarcode === element.barcodeStore);
                        });

                        const checkBarcodeSuplier = _res?.data.reduce((acc, item1) => {
                          const item3 = differentElements.find((product) => product.barcodeSupplier === item1.barcode);
                          if (item3) {
                            const newItem = {
                              ...item1,
                              quantity: +item3.quantity.toFixed(2),
                              priceUnit: +item3.price,
                              storeBarcode: +item1.storeBarcode
                                ? item1.storeBarcode
                                : +item3.barcodeStore
                                ? +item3.barcodeStore
                                : null,
                              storeBarcodeCheck: Boolean(item1.storeBarcode),
                              productPrice: [
                                {
                                  id: item1.productPrice[0].priceType,
                                  priceType: item1.productPrice[0].priceType,
                                  minQuantity: item1.productPrice[0].minQuantity,
                                  price: +item3.price,
                                  productId: item1.productPrice[0].productId,
                                  defaultPrice: item1.productPrice[0].defaultPrice,
                                },
                              ],
                            };
                            acc.push(newItem);
                          }
                          return acc;
                        }, []);

                        const nonDifferentProdcut = differentElements.filter((element) => {
                          return !checkBarcodeSuplier.some((item) => item.barcode === element.barcodeSupplier);
                        });

                        const newNonDifferentProdcut = nonDifferentProdcut.map((item) => ({
                          index: item?.index,
                          error: 'Không tìm thấy sản phẩm',
                        }));

                        if (result1.length > 0 || checkBarcodeSuplier.length > 0) {
                          const allErrors = [
                            ...newEmptySupplierNames,
                            ...newNullQuantityItems,
                            ...newNullBarcodeItems,
                            ...newNonDifferentProdcut,
                          ];
                          allErrors.sort((a, b) => a.index - b.index);

                          const errorCounts = allErrors.reduce((counts, { index, error }) => {
                            counts[error] = [...(counts[error] || []), index];
                            return counts;
                          }, {});

                          const errorString = Object.entries(errorCounts)
                            .map(([error, indexes]) => `${error}: Dòng ${indexes.join(', ')}`)
                            .join('\n');
                          const numErrors = allErrors.length;
                          if (allErrors.length === 0) {
                            setValueSupplier(result[0]?.supplier?.name);
                            setTemporary(result[0]?.supplier?.name);
                            setChoosingPromotionGoods([...choosingPromotionGoods, ...result1, ...checkBarcodeSuplier]);
                            setImportExcel(2);
                          } else {
                            import('sweetalert2').then(({ default: Swal }) =>
                              Swal.fire({
                                title: 'Thông báo',
                                text: `Có ${numErrors} sản phẩm không hợp lệ.\n${errorString} `,
                                icon: 'warning',
                                showCancelButton: true,
                                cancelButtonText: 'Hủy',
                                confirmButtonText: 'Tiếp tục',
                                customClass: 'custom__swal',
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  setValueSupplier(result[0]?.supplier?.name);
                                  setTemporary(result[0]?.supplier?.name);
                                  setChoosingPromotionGoods([
                                    ...choosingPromotionGoods,
                                    ...result1,
                                    ...checkBarcodeSuplier,
                                  ]);
                                  setImportExcel(2);
                                } else if (result.dismiss) {
                                  setVisibleExcel(false);
                                }
                              }),
                            );
                          }
                        } else {
                          Message.error({
                            text: 'Không tìm thấy sản phẩm',
                          });
                        }
                      } else {
                        Message.error({
                          text: 'Không tìm thấy nhà cung cấp. Vui lòng nhập sản phẩm cho nhà cung cấp đã kết nối!',
                        });
                      }
                    } else {
                      Message.error({ text: 'Vui lòng chỉ nhập sản phẩm từ một nhà cung cấp!' });
                    }
                    setLoadingImport(false);
                    setVisibleExcel(false);
                  }
                }}
                id="add"
                className={`w-[126px] h-[44px] hover:bg-teal-700 bg-teal-900 text-white text-sm rounded-[10px] btn-add`}
              >
                Nhập
              </button>
            </div>
          }
        >
          {loadingImport ? (
            <Spin tip="Loading">
              <div className="bg-white p-4 rounded-[10px]">
                <h1 className="text-xl mb-4 text-teal-900 font-medium">Thêm sản phẩm từ excel</h1>

                <p className="mb-4">
                  Tải file mẫu:
                  <a
                    className="underline text-blue-500 ml-4"
                    onClick={async () => {
                      const response = await ProductService.getFileTemplate({
                        type: fileType.PRODUCT_IMPORT_PROMOTION,
                      });
                      const link = document.createElement('a');
                      link.href = window.URL.createObjectURL(new Blob([response], { type: response.type }));
                      link.target = '_blank';
                      link.download = 'Mãu template';
                      document.body.appendChild(link);
                      link.click();
                      link?.parentNode?.removeChild(link);
                    }}
                  >
                    Bấm để tải
                  </a>
                </p>
                <ImportFile setDataExcel={setDataExcel} setDisabled={setDisabled} />
              </div>
            </Spin>
          ) : (
            <div className="bg-white p-4 rounded-[10px]">
              <h1 className="text-xl mb-4 text-teal-900 font-medium">Thêm sản phẩm từ excel</h1>

              <p className="mb-4">
                Tải file mẫu:
                <a
                  className="underline text-blue-500 ml-4"
                  onClick={async () => {
                    const response = await ProductService.getFileTemplate({ type: fileType.PRODUCT_IMPORT_PROMOTION });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(new Blob([response], { type: response.type }));
                    link.target = '_blank';
                    link.download = 'Mãu template';
                    document.body.appendChild(link);
                    link.click();
                    link?.parentNode?.removeChild(link);
                  }}
                >
                  Bấm để tải
                </a>
              </p>
              <ImportFile setDataExcel={setDataExcel} setDisabled={setDisabled} />
            </div>
          )}
        </Modal>
        {/* modal add */}
        <Modal
          closable={false}
          title={false}
          centered
          okText="Tiếp theo"
          open={visible}
          width={831}
          wrapClassName={'modal-add-promotion-goods'}
          footer={
            <div className="flex justify-between w-full">
              <button
                onClick={() => {
                  setDataTempChoose([]);
                  setVisible(false);
                  setValueSupplier(temporary);
                }}
                className="w-[106px] h-[44px] hover:bg-teal-900 bg-white border-2 border-radius border-teal-900 hover:text-white text-teal-900 text-sm rounded-[10px]"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setLoading((prev) => ({ ...prev, loadingProduct: true }));
                  setChoosingPromotionGoods(choosingPromotionGoods.concat(dataTempChoose));
                  setDataTempChoose([]);
                  choosingPromotionGoods.length > 0 && setImportExcel(1);
                  setLoading((prev) => ({ ...prev, loadingProduct: false }));
                }}
                id="add"
                className={`w-[126px] h-[44px] hover:bg-teal-700 bg-teal-900 text-white text-sm rounded-[10px]  `}
              >
                Thêm
              </button>
            </div>
          }
        >
          <div>
            <div className="search-promotion-goods mt-4 ml-2 flex justify-between items-center flex-col gap-2 md:flex-row">
              <div className="relative">
                <Input
                  placeholder="Theo mã vạch, tên sản phẩm"
                  className="w-[282px] !bg-white rounded-[10px] pl-[55px] pr-[10px] py-[10px] border border-solid border-gray-200 h-[40px] promotion-goods-search"
                  onChange={(value) => {
                    setSearch(value.target.value);
                    clearTimeout(TimeOutId.current);
                    setListProduct([]);
                    TimeOutId.current = setTimeout(() => {
                      setParams((prev) => ({ ...prev, page: 1, perPage: 12, fullTextSearch: value.target.value }));
                    }, 500);
                  }}
                />
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute top-[13px] left-[17px] text-gray-700"
                >
                  <path
                    d="M5.25 0.5C2.631 0.5 0.5 2.631 0.5 5.25C0.5 7.869 2.631 10 5.25 10C6.37977 10 7.41713 9.60163 8.2334 8.94043L12.8135 13.5205L13.5205 12.8135L8.94043 8.2334C9.60163 7.41713 10 6.37977 10 5.25C10 2.631 7.869 0.5 5.25 0.5ZM5.25 1.5C7.318 1.5 9 3.182 9 5.25C9 7.318 7.318 9 5.25 9C3.182 9 1.5 7.318 1.5 5.25C1.5 3.182 3.182 1.5 5.25 1.5Z"
                    fill="#9CA3AF"
                  />
                </svg>
              </div>
              {pageType === 'create' && +step === 1 && (
                <Select
                  className="w-[282px] h-[36px] rounded-[10px] flex items-center supplier-promotion-select mt-3 sm:mt-0"
                  placeholder="Chọn nhà cung cấp"
                  optionFilterProp="children"
                  defaultValue={listSupplier?.[0]?.supplier?.name}
                  value={valueSupplier}
                  defaultActiveFirstOption
                  onChange={(value) => {
                    setTemporary(value);
                    setLoadingSkeleton(true);
                    if (value === temporary || choosingPromotionGoods.length === 0) {
                      setDataTempChoose([]);
                      setParams((prev) => ({ ...prev, filterSupplier: value || '', page: 1 }));
                      setListProduct([]);
                    } else {
                      import('sweetalert2').then(({ default: Swal }) =>
                        Swal.fire({
                          title: 'Thông báo',
                          text: 'Bạn chỉ có thể nhập hàng Non-Balance cùng một nhà cung cấp. Việc chọn nhà cung cấp khác sẽ xóa hết tất sản phẩm đã được chọn của nhà cung cấp trước. Bạn có muốn tiếp tục chọn nhà cung cấp khác không?',
                          icon: 'warning',
                          showCancelButton: true,
                          cancelButtonText: 'Hủy',
                          confirmButtonText: 'Tiếp tục',
                        }).then((result) => {
                          if (result.isConfirmed) {
                            setChoosingPromotionGoods([]);
                            setDataTempChoose([]);
                            setListProduct([]);
                            setParams((prev) => ({ ...prev, filterSupplier: value || '', page: 1, perPage: 12 }));
                          } else if (result.dismiss) {
                            setValueSupplier(valueSupplier);
                            setTemporary(temporary);
                          }
                        }),
                      );
                    }
                    setLoadingSkeleton(false);
                  }}
                  showSearch
                  filterOption={(input, option) => {
                    return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                >
                  {listSupplier &&
                    listSupplier.map((item, index) => {
                      return (
                        <Option
                          key={index}
                          value={item?.supplier?.name}
                          title={item?.supplier?.name}
                          className="p-0 promotion-supplier-select-wrapper leading-[32px]"
                        >
                          <span
                            className="w-full inline-block promotion-select-item pl-2"
                            onClick={() => {
                              setValueSupplier(item?.supplier?.name);
                              setTemporary(item?.supplier?.name);
                              setInforSubOrg({ storeId: item?.storeId, supplierId: item?.supplierId, infor: item });
                            }}
                          >
                            {item?.supplier?.name}
                          </span>
                        </Option>
                      );
                    })}
                </Select>
              )}
            </div>
            <div id="scrollableDiv" className="list__products__scroll h-[450px] mt-8 overflow-auto pr-4">
              <InfiniteScroll
                dataLength={remainingListProduct.length}
                next={() => {
                  setParams((prev) => ({ ...prev, page: prev.page + 1, perPage: 12 }));
                }}
                hasMore={hasMore}
                scrollableTarget="scrollableDiv"
              >
                <List
                  loading={loading.loadingProduct}
                  className="list-product_modal list__products__scroll "
                  dataSource={remainingListProduct}
                  renderItem={(item) => {
                    return (
                      <List.Item key={item.id}>
                        <PromotionGoodsCard
                          key={item?.id}
                          item={item}
                          dataTempChoose={dataTempChoose}
                          setDataTempChoose={setDataTempChoose}
                          fromPage="edit"
                          setDisabled={setDisabled}
                          disabled={disabled}
                        />
                      </List.Item>
                    );
                  }}
                />
              </InfiniteScroll>
            </div>
          </div>
        </Modal>
      </div>
    </Fragment>
  );
};
export default Page;
