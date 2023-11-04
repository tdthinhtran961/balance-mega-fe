import { Col, DatePicker, Form, Input, InputNumber, Row, Space } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { formatCurrency, routerLinks } from 'utils';
import { blockInvalidChar } from './components/TableImportGoodsFromNonBal';
import './index.less';
import { useLocation } from 'react-router-dom';

import { useNavigate } from 'react-router';
import { Message, Select, Spin } from 'components';
import { ImportGoodsFromNonBalService } from 'services/ImportGoodsFromNonBal';
// import useDebounce from './hooks/useDebounce';
import { useAuth } from 'global';

import ImportGoodsFromNonBalModal from './components/importGoodsFromNonBalAddModal';
import { taxApply } from 'constants/index';

const Page = () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const idProduct = urlSearch.get('id');
  const stepping = urlSearch.get('step');
  const type = urlSearch.get('type');
  const [temporary, setTemporary] = useState();

  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const [loading, setLoading] = useState({
    loadingMainPage: false,
    loadingProduct: false,
    loadingSupplier: false,
    loadingExportImportNonBalNote: false,
  });
  const { user } = useAuth();
  const storeId = user?.userInfor?.subOrgId;
  const [stop, setStop] = useState(null);
  const [data, setData] = useState({});
  const [, setFilterDate] = useState('');
  const [step] = useState(pageType === 'create' ? 1 : urlSearch.get('step'));
  const [listSupplier, setSupplier] = useState([]);
  const [valueSupplier, setValueSupplier] = useState();
  const [listProduct, setListProduct] = useState([]);
  const [dataOrderInvoice, setDataOrderInvoice] = useState({
    url: '',
    code: '',
  });
  const [choosingImportNonBalGoods, setChoosingImportNonBalGoods] = useState([]);
  const remainingListProduct = listProduct?.filter((goods) => {
    return choosingImportNonBalGoods?.findIndex((item) => item?.barcode === goods?.barcode) === -1;
  });
  const scrollPopUpRef = useRef();
  const [, setLoadingSkeleton] = useState(false);
  const [visible, setVisible] = useState(false);

  const [disabled, setDisabled] = useState(false);
  const [createExport, setCreateExport] = useState(false);

  const roleCode = user?.userInfor?.roleCode;

  const [inforSubOrg, setInforSubOrg] = useState({
    storeId: null,
    supplierId: null,
    infor: null,
  });

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
    // edit BL-1343 by Tuấn. Sowkiuu Start
    disabledBtn: true,
    // edit BL-1343 by Tuấn. Sowkiuu End
  });
  const [filterTax, setFilterTax] = useState(taxApply.APPLY);

  const key = 'id';
  const arrayListProduct = [...new Map(listProduct?.map((item) => [item[key], item])).values()];

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
        const res = await ImportGoodsFromNonBalService.getListSupplier({
          ...params,
          storeId,
          supplierType: 'NON_BALANCE',
        });
        setSupplier(res.data);
        setTemporary(res.data?.[0]?.supplier?.id);
        setParams((prev) => ({ ...prev, idSupplier: res.data?.[0]?.supplier?.id }));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading((prev) => ({ ...prev, loadingSupplier: false }));
      }
    };
    (roleCode === 'OWNER_STORE' ) && fetchListFilter();
  }, []);

  useEffect(() => {
    const initFunction = async () => {
      if (idProduct) {
        try {
          setLoading((prev) => ({ ...prev, loadingProduct: true }));
          const res = await ImportGoodsFromNonBalService.getById(idProduct);
          setDataOrderInvoice({ url: res?.url, code: res?.importedCode });
          setFilterTax(!!res?.isApplyTax === true ? taxApply.APPLY : taxApply.NO_APPLY);
          setChoosingImportNonBalGoods(res?.itemList);
          form.setFieldsValue(res);
          form.setFieldsValue({
            importedAt: moment(res?.importedAt),
            importedReason: res?.importedReason,
          });
          setData({
            ...res,
            itemList: res.itemList.map((item) => ({ ...item, ['priceUnit' + item.code]: item.priceUnit })),
            // issuedAt: res.issuedAt
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
      if (total !== 0 && arrayListProduct?.length >= total) {
        setHasMore(false);
        return;
      }
      setHasMore(true);
      if (listSupplier.length > 0 && idProduct === null && visible) {
        setLoading((prev) => ({ ...prev, loadingProduct: true }));
        try {
          setLoading((prev) => ({ ...prev, loadingProduct: true }));
          let res = [];
          pageType === 'create'
            ? (res = await ImportGoodsFromNonBalService.getListProduct({
                ...params,
                type: 'NON_BALANCE',
                idStore: storeId,
                supplierId: params.idSupplier === '' ? '' : params.idSupplier || listSupplier[0].id,
              }))
            : pageType === 'edit'
            ? (res = await ImportGoodsFromNonBalService.getListProduct({
                ...params,
                type: 'NON_BALANCE',
                idStore: storeId,
                supplierId: data.supplierId,
              }))
            : (res = null);

          if (+res?.data?.length === 0) {
            setStop(true);
          } else {
            setListProduct(listProduct.concat(res.data));
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
          let res = [];
          pageType === 'create'
            ? (res = await ImportGoodsFromNonBalService.getListProduct({
                ...params,
                // fullTextSearch: searchDebounce,
                type: 'NON_BALANCE',
                idStore: storeId,
                supplierId: params.idSupplier === '' ? '' : params.idSupplier || listSupplier[0].id,
              }))
            : pageType === 'edit'
            ? (res = await ImportGoodsFromNonBalService.getListProduct({
                ...params,
                type: 'NON_BALANCE',
                idStore: storeId,
                supplierId: data.supplierId,
              }))
            : (res = null);

          if (+res?.data?.length === 0) {
            setStop(true);
          } else {
            setListProduct(listProduct.concat(res.data));
            setTotal(res?.count);
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
      text: 'Bạn có chắc muốn xóa nhập hàng này?',
      onConfirm: async () => {
        setLoading((prev) => ({ ...prev, loadingExportImportNonBalNote: true }));
        const res = await ImportGoodsFromNonBalService.delete(id);
        setLoading((prev) => ({ ...prev, loadingExportImportNonBalNote: false }));
        //  navigate(routerLinks('ImportGoodsNonBal'));
        if (type === '1') {
          return res && navigate(routerLinks('ListOfStock'));
        } else {
          return res && navigate(routerLinks('ImportGoodsNonBal'));
        }
      },
      title: 'Thông báo',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#DC2626',
      confirmButtonText: 'Xóa',
    });
  };

  useEffect(() => {
    choosingImportNonBalGoods.forEach((i) => {
      if (i.quantity === undefined) {
        form.resetFields([`quantity${i.code}`]);
      }
    });
  }, [choosingImportNonBalGoods.length]);

  const handleDeleteKey = async (good) => {
    if (pageType === 'edit') {
      const data1 = choosingImportNonBalGoods.filter((item) => item.id !== good);
      setChoosingImportNonBalGoods(data1);
      const removedItems = choosingImportNonBalGoods
        ?.filter((item) => item.id === good)
        .map((item) => ({ ...item, isDeleted: true }));
      setDataOrder((prev) => prev.concat(removedItems));

      // if (
      //   (choosingImportNonBalGoods.length === 0 && data?.itemList?.length === dataOrder.length) ||
      //   choosingImportNonBalGoods.length === 1
      // ) {
      //   await ImportGoodsFromNonBalService.deleteLastImportNonBalItem(+good);
      // } else {
      //   await ImportGoodsFromNonBalService.deleteImportNonBalItem(+good);
      // }
      if (
        (choosingImportNonBalGoods.length === 0 && data?.itemList?.length === dataOrder.length) ||
        choosingImportNonBalGoods.length === 1
      ) {
        ImportGoodsFromNonBalService.delete(idProduct);
        const res = ImportGoodsFromNonBalService.get({
          page: 1,
          perPage: 10,
          storeId,
        });
        res && navigate(routerLinks('ImportGoodsNonBal'));
      }
      // else {
      //   const res = await ImportGoodsFromNonBalService.getById(idProduct);
      //   setChoosingImportNonBalGoods(res?.itemList);
      // }
    }

    if (pageType === 'create') {
      const newData = choosingImportNonBalGoods?.filter((item) => item.id !== good);
      setChoosingImportNonBalGoods(newData);
      const removedItems = choosingImportNonBalGoods
        ?.filter((item) => item.id === good)
        .map((item) => ({ ...item, isDeleted: true }));
      setDataOrder((prev) => prev.concat(removedItems));
    }
  };

  useEffect(() => {
    if (pageType === 'create' && +step === 2) {
      if (choosingImportNonBalGoods.length === 0 && data?.itemList?.length === dataOrder.length) {
        ImportGoodsFromNonBalService.delete(idProduct);
        const res = ImportGoodsFromNonBalService.get({ page: 1, perPage: 10, idStore: storeId, type: 'DISPOSAL_GOOD' });
        res && navigate(routerLinks('ImportNonBalGoods'));
      }
    }
    // edit BL-1343 by Tuấn. Sowkiuu Start
    checkDisableButton(choosingImportNonBalGoods);
    // edit BL-1343 by Tuấn. Sowkiuu End
  }, [pageType, choosingImportNonBalGoods?.length, data?.itemList, dataOrder?.length]);

  // edit BL-1343 by Tuấn. Sowkiuu Start
  const checkDisableButton = (list) => {
    let flagDisableButton = true;
    for (let i = 0; i < list?.length; i++) {
      if (Number(list[i].quantity) <= 0 || list[i].quantity?.length === 0 || list[i].quantity === undefined) {
        flagDisableButton = false;
      }
    }
    if (flagDisableButton === false) {
      setDisabledButton((prev) => ({ ...prev, disabledBtn: true }));
    } else {
      setDisabledButton((prev) => ({ ...prev, disabledBtn: false }));
    }
  };
  // edit BL-1343 by Tuấn. Sowkiuu End
  const toggleAmount = (data, type) => {
    const { code, _priceUnit, _quantity } = data;
    const tempOrder =
      choosingImportNonBalGoods &&
      choosingImportNonBalGoods.map((item) => {
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
    // edit BL-1343 by Tuấn. Sowkiuu Start
    checkDisableButton(tempOrder);
    // edit BL-1343 by Tuấn. Sowkiuu End
    return setChoosingImportNonBalGoods([...tempOrder]);
  };

  const _renderTableOrderDetail = () => {
    return (
      <div className="overflow-x-scroll w-full h-auto overflow-y-hidden">
        <div className="w-[1100px] lg:w-full  AddScrollTable ">
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
                <div className="text-sm font-bold text-gray-700">Tiền sau thuế</div>
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
          {choosingImportNonBalGoods && choosingImportNonBalGoods.length > 0 ? (
            choosingImportNonBalGoods?.map((item, index) => {
              return (
                <div key={index}>
                  <Row gutter={16} className="py-3 flex items-center">
                    <Col className="gutter-row " span={3}>
                      {(item?.storeBarcode === undefined || item?.storeBarcode === null || item?.storeBarcode === '') &&
                      item?.barcode === null ? (
                        <Form.Item
                          name={`_storeBarCode${item.code}`}
                          style={{
                            margin: 0,
                          }}
                          rules={[
                            {
                              required: true,
                              message: `Mã vạch là bắt buộc`,
                            },
                            ({ getFieldValue }) => ({
                              validator(rule, value) {
                                if (
                                  arrayListProduct.filter((item) => item.storeBarcode === value).length > 0 ||
                                  arrayListProduct.filter((item) => item._storeBarcode === value).length > 1
                                ) {
                                  return Promise.reject(new Error('Mã vạch đã được dùng, Vui lòng nhập lại'));
                                }
                                if (value.length > 13) {
                                  return Promise.reject(new Error('Vượt quá 13 ký tự'));
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          <Input
                            readOnly={pageType === 'detail'}
                            onChange={(e) => {
                              toggleAmount({ code: item?.code, storeBarcode: e.target.value }, 3);
                            }}
                            onKeyDown={blockInvalidChar}
                            placeholder="Nhập mã"
                            className="!h-9 w-[85%] !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 !text-left p-2"
                          />
                        </Form.Item>
                      ) : (
                        <div className="text-sm font-normal text-gray-700">{item?.storeBarcode || item?.barcode}</div>
                      )}
                    </Col>
                    <Col className="gutter-row " span={filterTax === taxApply.APPLY ? 4 : 5}>
                      <div className="h-full grid grid-cols-product-name items-center gap-4 text-left">
                        <h5 className="col-span-3 text-sm font-normal text-gray-700 break-normal">{item?.name}</h5>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={2}>
                      <h5 className="text-sm font-normal text-gray-700 break-all"> {item?.basicUnit || item?.unit}</h5>
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
                            // initialValue={formatCurrency(+item.price, '')}
                            initialValue={pageType === 'edit' ? +item.priceUnit || +item.price : +item.price}
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
                              onChange={(value) => {
                                toggleAmount({ code: item?.code, _priceUnit: value }, 1);
                              }}
                              onKeyDown={blockInvalidChar}
                              placeholder=" Nhập giá trị"
                              className="!h-9 w-[90%] !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 !text-left pl-2"
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
                                required: true,
                                message: `Số lượng là bắt buộc`,
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (+value === 0 && value !== '' && value !== null) {
                                    return Promise.reject(new Error('Vui lòng nhập giá trị lớn hơn 0'));
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                            initialValue={item?.quantity || null}
                          >
                            <Input
                              readOnly={pageType === 'detail'}
                              // formatter={(value) => {
                              //   if (!value) {
                              //     return;
                              //   }
                              //   return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                              // }}
                              // parser={(value) => {
                              //   if (!value) {
                              //     return;
                              //   }
                              //   return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
                              // }}
                              type="number"
                              min={1}
                              onChange={(e) =>
                                toggleAmount(
                                  {
                                    code: item?.code,
                                    _quantity: e.target.value > 0 && Number.parseFloat(e.target.value).toFixed(2),
                                  },
                                  2,
                                )
                              }
                              onKeyDown={blockInvalidChar}
                              placeholder=" Nhập giá trị"
                              className="percentInput h-9 w-[90%] !rounded-xl !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 pl-2"
                            />
                          </Form.Item>
                        )}
                      </div>
                    </Col>
                    <Col className="gutter-row " span={filterTax === taxApply.APPLY ? 3 : 5}>
                      <div className="text-sm font-normal text-gray-700 break-all">
                        {pageType !== 'detail' && pageType !== 'edit' && item?.priceUnit === undefined
                          ? item?.price === undefined || item?.quantity === undefined
                            ? null
                            : formatCurrency(+item?.price * +item?.quantity, ' ')
                          : pageType !== 'detail' && pageType !== 'edit' && item?.priceUnit !== undefined
                          ? item?.priceUnit === undefined || item?.quantity === undefined
                            ? null
                            : formatCurrency(+item?.priceUnit * +item?.quantity, ' ')
                          : pageType === 'edit' && item.priceUnit === undefined && item.quantity === undefined
                          ? null
                          : formatCurrency((+item?.priceUnit || +item?.price) * +item?.quantity, ' ')}
                      </div>
                    </Col>
                    {filterTax === taxApply.APPLY ? (
                      <Col className="gutter-row " span={2}>
                        <div className="text-sm font-normal text-gray-700">
                          {pageType !== 'detail' && pageType !== 'edit'
                            ? item?.importTax?.taxRate
                            : item?.tax === 0
                            ? 0
                            : item?.tax !== 0 && item?.tax !== undefined
                            ? item?.tax
                            : item?.importTax?.taxRate}
                          %
                        </div>
                      </Col>
                    ) : null}
                    {filterTax === taxApply.APPLY ? (
                      <Col className="gutter-row " span={3}>
                        <div className="text-sm font-normal text-gray-700 break-all">
                          {pageType !== 'detail' && pageType !== 'edit' && item.priceUnit === undefined
                            ? item?.price === undefined || item?.quantity === undefined
                              ? null
                              : formatCurrency(
                                  Math.round(+item?.price * +item?.quantity * (1 + +item?.importTax?.taxRate / 100)),
                                  ' ',
                                )
                            : pageType !== 'detail' && pageType !== 'edit' && item.priceUnit !== undefined
                            ? item?.priceUnit === undefined || item?.quantity === undefined
                              ? null
                              : formatCurrency(
                                  Math.round(
                                    +item?.priceUnit * +item?.quantity * (1 + +item?.importTax?.taxRate / 100),
                                  ),
                                  ' ',
                                )
                            : pageType === 'edit' && item?.priceUnit === undefined && item?.quantity === undefined
                            ? null
                            : formatCurrency(
                                Math.round(
                                  (+item?.priceUnit || +item?.price) *
                                    +item?.quantity *
                                    (1 +
                                      (item?.tax === 0
                                        ? 0
                                        : item?.tax !== 0 && item?.tax !== undefined
                                        ? item?.tax
                                        : item?.importTax?.taxRate) /
                                        100),
                                ),
                                ' ',
                              )}
                        </div>
                      </Col>
                    ) : null}

                    <Col className="gutter-row " span={1}>
                      {(pageType === 'edit' || pageType === 'create') && (
                        <button className="remove-btn" onClick={() => handleDeleteKey(item.id)}>
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
            <p className="text-sm text-center mt-2 pt-1 pb-4">Trống</p>
          )}
        </div>
      </div>
    );
  };

  const handleSubmit = async (values) => {
    setDisabledButton((prev) => ({ ...prev, disabledBtn: true }));
    let param = {};
    let paramEdit = {};
    param = {
      importedAt: moment(values.importedAt).toISOString(),
      storeId,
      importedReason: values?.importedReason,
      supplierId: +choosingImportNonBalGoods[0]?.product?.subOrg?.id,
      itemList: [
        ...choosingImportNonBalGoods.map((item) => ({
          id: +item.productId || +item.idProduct || +item.id,
          quantity: +item.quantity,
          storeBarcode: item?.storeBarcode,
          tax: +item?.importTax?.taxRate,
          basicUnit: item?.basicUnit,
          priceUnit: item.priceUnit === undefined ? +item?.price : +item.priceUnit,
          name: item?.name,
          barcode: item?.barcode,
          isDeleted: false,
          code: item?.code,
        })),
      ],
      total: filterTax === taxApply.APPLY ? +totalPriceAfterTax : totalPrice,
      isApplyTax: filterTax === taxApply.APPLY,
    };
    paramEdit = {
      importedAt: moment(values.importedAt).toISOString(),
      importedReason: values?.importedReason,
      itemList: [
        ...choosingImportNonBalGoods.map((item) => ({
          id: +item.productId || +item.idProduct || +item.id,
          quantity: +item.quantity,
          storeBarcode: item?.storeBarcode,
          tax: +item?.tax,
          basicUnit: item?.basicUnit,
          priceUnit: item?.priceUnit || item?.price,
          name: item?.name,
          barcode: item?.barcode,
          isDeleted: false,
          code: item?.code,
        })),
        ...dataOrder.map((item) => ({
          id: +item.productId || +item.idProduct || +item.id,
          quantity: +item.quantity,
          storeBarcode: item?.storeBarcode,
          tax: +item?.tax,
          basicUnit: item?.basicUnit,
          priceUnit: item?.priceUnit || item?.price,
          name: item?.name,
          barcode: item?.barcode,
          isDeleted: true,
          code: item?.code,
        })),
      ],
      total: filterTax === taxApply.APPLY ? +totalPriceAfterTaxEditView : totalPriceViewEdit,
      isApplyTax: filterTax === taxApply.APPLY,
    };
    let res;
    setLoading((prev) => ({ ...prev, loadingExportImportNonBalNote: true }));
    pageType === 'create' && createExport === false
      ? (res = await ImportGoodsFromNonBalService.post(param))
      : createExport === true
      ? (res = await ImportGoodsFromNonBalService.exportBillCombineCreating(param))
      : (res = await ImportGoodsFromNonBalService.put(idProduct, paramEdit));
    if (createExport === true && res) {
      const importGoodsNonBalNoteKey = res?.data?.key;
      const responsive = await ImportGoodsFromNonBalService.downloadBillImportNonBalWhenCreateWithKey(
        importGoodsNonBalNoteKey,
      );
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([responsive], { type: responsive.type }));
      link.target = '_blank';
      // link.download = values.fileName || values.name;
      link.download = `Phiếu nhập hàng`;
      document.body.appendChild(link);
      link.click();
      link?.parentNode?.removeChild(link);
    }
    if (res) {
      setDisabledButton((prev) => ({ ...prev, disabledBtn: false }));
      if (type === '1') {
        return navigate(routerLinks('ListOfStock'));
      } else {
        return navigate(routerLinks('ImportGoodsNonBal'));
      }
      // return navigate(routerLinks('ImportGoodsNonBal'));
    }
    setLoading((prev) => ({ ...prev, loadingExportImportNonBalNote: false }));
    setDisabledButton((prev) => ({ ...prev, disabledBtn: false }));
  };

  const totalPrice =
    choosingImportNonBalGoods &&
    choosingImportNonBalGoods
      .filter((item) =>
        item.priceUnit === undefined
          ? item.price !== undefined || item.quantity !== undefined
          : item.priceUnit !== undefined || item.quantity !== undefined,
      )
      .reduce((a, c) => {
        if (c.priceUnit === undefined ? !c.price || !c.quantity : !c.priceUnit || !c.quantity) {
          return a;
        }
        return a + (c.priceUnit === undefined ? +c.price : +c.priceUnit) * +c.quantity;
      }, 0);

  const totalPriceViewDetail =
    choosingImportNonBalGoods &&
    choosingImportNonBalGoods
      .filter((item) => item.priceUnit !== undefined || item.quantity !== undefined)
      .reduce((a, c) => {
        if (!c.priceUnit || !c.quantity) {
          return a;
        }
        return a + +c.priceUnit * +c.quantity;
      }, 0);

  const totalPriceViewEdit =
    choosingImportNonBalGoods &&
    choosingImportNonBalGoods
      .filter((item) => item.priceUnit !== undefined || item.price !== undefined || item.quantity !== undefined)
      .reduce((a, c) => {
        if (c.price !== undefined && (!c.price || !c.quantity)) {
          return a;
        } else if (c.priceUnit !== undefined && (!c.priceUnit || !c.quantity)) {
          return a;
        }
        return a + (+c.priceUnit || +c.price) * +c.quantity;
      }, 0);

  const totalTaxPrice =
    choosingImportNonBalGoods &&
    choosingImportNonBalGoods
      .filter((item) =>
        item.priceUnit === undefined
          ? item.price !== undefined || item.quantity !== undefined
          : item.priceUnit !== undefined || item.quantity !== undefined,
      )
      .reduce((a, c) => {
        if (c.priceUnit === undefined ? !c.price || !c.quantity : !c.priceUnit || !c.quantity) {
          return a;
        }
        return a + (c.priceUnit === undefined ? +c.price : c.priceUnit) * +c.quantity * (+c?.importTax?.taxRate / 100);
      }, 0);
  const totalTaxPriceDetailView =
    choosingImportNonBalGoods &&
    choosingImportNonBalGoods
      .filter((item) => item.priceUnit !== undefined || item.quantity !== undefined)
      .reduce((a, c) => {
        if (!c.priceUnit || !c.quantity) {
          return a;
        }
        return a + +c.priceUnit * +c.quantity * (+c?.tax / 100);
      }, 0);

  const totalTaxPriceEditView =
    choosingImportNonBalGoods &&
    choosingImportNonBalGoods
      .filter((item) => item.priceUnit !== undefined || item.price !== undefined || item.quantity !== undefined)
      .reduce((a, c) => {
        if (c.price !== undefined && (!c.price || !c.quantity)) {
          return a;
        } else if (c.priceUnit !== undefined && (!c.priceUnit || !c.quantity)) {
          return a;
        }
        return (
          a +
          (+c.priceUnit || +c.price) *
            +c.quantity *
            ((c?.tax === 0 ? 0 : c?.tax !== 0 && c?.tax !== undefined ? c?.tax : c?.importTax?.taxRate) / 100)
        );
      }, 0);

  const totalPriceAfterTax =
    choosingImportNonBalGoods &&
    choosingImportNonBalGoods
      .filter((item) =>
        item.priceUnit === undefined
          ? item.price !== undefined || item.quantity !== undefined
          : item.priceUnit !== undefined || item.quantity !== undefined,
      )
      .reduce((a, c) => {
        if (c.priceUnit === undefined ? !c.price || !c.quantity : !c.priceUnit || !c.quantity) {
          return a;
        }
        return (
          a + (c.priceUnit === undefined ? +c.price : +c.priceUnit) * +c.quantity * (+c?.importTax?.taxRate / 100 + 1)
        );
      }, 0);
  const totalPriceAfterTaxDetailView =
    choosingImportNonBalGoods &&
    choosingImportNonBalGoods
      .filter((item) => item.priceUnit !== undefined || item.quantity !== undefined)
      .reduce((a, c) => {
        if (!c.priceUnit || !c.quantity) {
          return a;
        }
        return a + +c.priceUnit * +c.quantity * (+c?.tax / 100 + 1);
      }, 0);
  const totalPriceAfterTaxEditView =
    choosingImportNonBalGoods &&
    choosingImportNonBalGoods
      .filter((item) => item.priceUnit !== undefined || item.price !== undefined || item.quantity !== undefined)
      .reduce((a, c) => {
        if (c.price !== undefined && (!c.price || !c.quantity)) {
          return a;
        } else if (c.priceUnit !== undefined && (!c.priceUnit || !c.quantity)) {
          return a;
        }
        return (
          a +
          (+c.priceUnit || +c.price) *
            +c.quantity *
            ((c?.tax === 0 ? 0 : c?.tax !== 0 && c?.tax !== undefined ? c?.tax : c?.importTax?.taxRate) / 100 + 1)
        );
      }, 0);

  if (
    ((roleCode === 'OWNER_STORE' ) &&
      (((pageType === 'detail' || pageType === 'edit') && !data.id) || loading.loadingExportImportNonBalNote)) ||
    (roleCode === 'ADMIN' && !data.id)
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
        <div className="min-h-screen importGoodsNonBal-good-container">
          <Form form={form} component={false} onFinish={handleSubmit}>
            <p className="text-2xl text-teal-900 font-bold">Nhập hàng Non-Balance</p>
            <div className="bg-white w-full px-6 pt-2 rounded-xl mt-5 relative pb-[72px]">
              <div className="mb-6 border-b border-gray-200">
                <div className="flex items-center mb-4 importGoodsNonBal-status-info">
                  <h2 className="font-bold text-lg text-teal-900 mr-3 importGoodsNonBal-first-title">
                    Thông tin nhập hàng
                  </h2>
                  {pageType !== 'create' && (
                    <>
                      {data?.importedStatus === 'WAITING_APPROVED' ? (
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
                    <div className=" w-full above-importGoodsNonBal-section">
                      <Col span={24} sm={12}>
                        <div className="grid grid-cols-[180px_minmax(100%,_1fr)] importGoodsNonBal-info-sectiondetail filter-supplier items-center">
                          <span className="font-normal text-black text-base">Nhà cung cấp: </span>
                          <span className="font-normal text-base text-gray-500 break-all">
                            {choosingImportNonBalGoods[0]?.product?.subOrg?.name || ''}
                          </span>
                        </div>
                      </Col>
                      <Col span={24} sm={12} className="col-importGoodsNonBal-time">
                        <div className="grid grid-cols-[180px_minmax(100%,_1fr)] items-center time-cancel-field importGoodsNonBal-info-sectiondetail">
                          <span className="font-normal text-black text-base">Thời gian nhập hàng: </span>
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
                                className="!w-[100%] lg:!w-[60%] !bg-white !border-gray-200 !text-gray-500 "
                                // defaultValue={dayjs()}
                                disabledDate={(current) => {
                                  // return moment().add(-1, 'days') <= current;
                                  return current && current.valueOf() > Date.now();
                                }}
                              />
                            </Form.Item>
                          </Space>
                        </div>
                      </Col>
                    </div>
                    <div className="flex items-center w-full below-importGoodsNonBal-section">
                      <Col span={24} sm={12} className="col-importGoodsNonBal-time">
                        <div className="grid grid-cols-[180px_minmax(100%,_1fr)] items-center time-cancel-field importGoodsNonBal-info-sectiondetail-reason">
                          <span className="font-normal text-black text-base">Lý do nhập hàng: </span>
                          <Form.Item
                            name="importedReason"
                            style={{
                              margin: 0,
                            }}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: `Lý do nhập hàng là bắt buộc`,
                            //   },
                            // ]}
                          >
                            <Input
                              className="w-full !text-gray-500 px-3 py-2 !bg-white rounded-[10px] border border-gray-200 focus:!shadow-none focus:!border-gray-200"
                              placeholder="Nhập lý do"
                            />
                          </Form.Item>
                        </div>
                      </Col>
                      <Col span={24} sm={12} className="mt-3 store-name-col">
                        <div className="grid grid-cols-[180px_minmax(100%,_1fr)] importGoodsNonBal-info-storeName items-center">
                          <span className="font-normal text-black text-base">Tên cửa hàng: </span>
                          <span className="font-normal text-base text-gray-500 break-all">
                            {user?.userInfor?.subOrgName}
                          </span>
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
                    <div className="below-importGoodsNonBal-section-notCreate">
                      {' '}
                      <Col span={24} sm={12} className="flex items-center mb-4 ">
                        <div className="grid grid-cols-[180px_minmax(100%,_1fr)] importGoodsNonBal-info-inputCode items-center">
                          <span className="font-normal text-black text-base">Mã nhập hàng: </span>
                          <span className="font-normal text-base text-gray-500 break-all">
                            {data?.importedCode || 'Đang xử lý'}
                          </span>
                        </div>
                      </Col>
                      <Col span={24} sm={12}>
                        <div className="sm:mb-4 grid grid-cols-[180px_minmax(100%,_1fr)] importGoodsNonBal-info-sectiondetail items-center">
                          <span className="font-normal text-black text-base">Nhà cung cấp: </span>
                          <span className="font-normal text-base text-gray-500 break-all">{data?.supplierName}</span>
                        </div>
                      </Col>
                    </div>
                    <div className="below-importGoodsNonBal-section-notCreate">
                      <Col span={24} sm={12}>
                        <div className="mb-4 grid grid-cols-[180px_minmax(100%,_1fr)] items-center importGoodsNonBal-info-sectiondetail">
                          <span className="font-normal text-black text-base">Thời gian nhập hàng: </span>
                          <span className="font-normal text-base text-gray-500 break-all">
                            {moment(data?.issuedAt).format('DD/MM/YYYY')}
                          </span>
                        </div>
                      </Col>

                      <Col span={24} sm={12}>
                        <div className="mb-4 grid grid-cols-[180px_minmax(100%,_1fr)] importGoodsNonBal-info-sectiondetail items-center">
                          <span className="font-normal text-black text-base">Tên cửa hàng: </span>
                          <span className="font-normal text-base text-gray-500 break-all">{data?.storeName}</span>
                        </div>
                      </Col>
                    </div>
                    <div className="below-importGoodsNonBal-section-notCreate !w-full">
                      <Col span={24}>
                        <div className="mb-4 grid grid-cols-[180px_minmax(100%,_1fr)] items-center importGoodsNonBal-info-reason">
                          <span className="font-normal text-black text-base">Lý do nhập hàng: </span>
                          <span className="font-normal text-base text-gray-500 break-all">{data?.importedReason}</span>
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
                    <div className="below-importGoodsNonBal-section-notCreate">
                      <Col span={24} sm={12} className="flex items-center sm:mb-[28px] md:mt-2">
                        <div className="grid grid-cols-[180px_minmax(100%,_1fr)] importGoodsNonBal-info-inputCode items-center">
                          <span className="font-normal text-black text-base">Mã nhập hàng: </span>
                          <span className="font-normal text-base text-gray-500 break-all">
                            {data?.importedCode || 'Đang xử lý'}
                          </span>
                        </div>
                      </Col>
                      <Col span={24} sm={12}>
                        <div className="sm:mb-4 grid grid-cols-[180px_minmax(100%,_1fr)] importGoodsNonBal-info-sectiondetail items-center">
                          <span className="font-normal text-black text-base">Nhà cung cấp: </span>
                          <span className="font-normal text-base text-gray-500 break-all">{data?.supplierName}</span>
                        </div>
                      </Col>
                    </div>

                    <div className="below-importGoodsNonBal-section-notCreate">
                      {' '}
                      <Col span={24} sm={12} className="sm:mb-1">
                        <div className="grid grid-cols-[180px_minmax(100%,_1fr)] importGoodsNonBal-info-timeEdit items-center">
                          <span className="font-normal text-black text-base">Thời gian nhập hàng: </span>

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
                        <div className="mb-4 grid grid-cols-[180px_minmax(100%,_1fr)] importGoodsNonBal-info-storeNameEdit items-center">
                          <span className="font-normal text-black text-base">Tên cửa hàng: </span>
                          <span className="font-normal text-base text-gray-500 break-all">{data?.storeName}</span>
                        </div>
                      </Col>
                    </div>
                    <div className="below-importGoodsNonBal-section-notCreate">
                      {' '}
                      <Col span={24} sm={12}>
                        <div className="mb-4 grid grid-cols-[180px_minmax(100%,_1fr)] importGoodsNonBal-info-reasonEdit items-center">
                          <span className="font-normal text-black text-base">Lý do nhập hàng: </span>

                          <Form.Item
                            name="importedReason"
                            style={{
                              margin: 0,
                            }}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: `Lý do nhập hàng là bắt buộc`,
                            //   },
                            // ]}
                            initialValue={data?.importedReason}
                          >
                            <Input
                              className="w-full  px-3 py-2 !bg-white rounded-[10px] border border-gray-200 focus:!shadow-none focus:!border-gray-200"
                              placeholder="Nhập lý do"
                            />
                          </Form.Item>
                        </div>
                      </Col>
                    </div>
                  </Row>
                ) : (
                  ''
                )}
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center flex-col sm:flex-row mb-4 mt-4">
                  <h2 className="font-bold text-base text-teal-900">Chi tiết nhập hàng</h2>
                  <Select
                    disabled={pageType === 'detail'}
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
                    params
                  />
                </div>
                <div className="flex items-center justify-end mb-4">
                  {(pageType === 'edit' || pageType === 'create') && (
                    <button
                      type="button"
                      onClick={async () => {
                        setVisible(true);
                        setListProduct([]);
                        setLoading((prev) => ({ ...prev, loadingProduct: true }));
                        // const res = await ImportGoodsFromNonBalService.getListProduct({
                        //   ...params,
                        //   type: 'NON_BALANCE',
                        //   idStore: storeId,
                        //   supplierId: pageType === 'create' ? temporary || listSupplier[0].id : data?.supplierId,
                        // });
                        setParams({ ...params, page: 1 });
                        // setListProduct(res?.data);
                        // setTotal(res?.count);
                        setLoading((prev) => ({ ...prev, loadingProduct: false }));
                      }}
                      id="saveBtn"
                      className="w-[130px] md:w-[153px] h-[36px] hover:bg-teal-700 bg-teal-900 text-white text-[13px] md:text-sm rounded-[10px] flex justify-center items-center gap-[10px] z-[1000]"
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
                {_renderTableOrderDetail()}
              </div>
              <div
                className={`totalMoney-area w-full ${
                  +totalPriceAfterTax > 999999999999 ? 'lg:w-[45%]' : 'lg:w-[40%]'
                }  flex flex-col ml-auto gap-2 mt-6`}
              >
                <div>
                  <div className="flex justify-between mr-5">
                    <span className="font-bold text-sm md:text-base text-teal-900 mr-11">Tổng tiền hàng:</span>
                    <span className="font-bold text-sm md:text-base text-slate-700">
                      {' '}
                      {pageType !== 'detail' && pageType !== 'edit'
                        ? formatCurrency(totalPrice, ' VND')
                        : pageType === 'edit' && +stepping === 2
                        ? formatCurrency(totalPriceViewEdit, ' VND')
                        : formatCurrency(totalPriceViewDetail, ' VND')}{' '}
                    </span>
                  </div>
                </div>
                {filterTax === taxApply.APPLY ? (
                  <div>
                    <div className="flex justify-between mr-5">
                      <span className="font-bold text-sm md:text-base text-teal-900 mr-11">Tiền thuế:</span>
                      <span className="font-bold text-sm md:text-base text-slate-700">
                        {' '}
                        {pageType !== 'detail' && pageType !== 'edit'
                          ? formatCurrency(totalTaxPrice, ' VND')
                          : pageType === 'edit' && +stepping === 2
                          ? formatCurrency(totalTaxPriceEditView, ' VND')
                          : formatCurrency(totalTaxPriceDetailView, ' VND')}{' '}
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
                        {pageType !== 'detail' && pageType !== 'edit'
                          ? formatCurrency(Math.round(totalPriceAfterTax), ' VND')
                          : pageType === 'edit' && +stepping === 2
                          ? formatCurrency(Math.round(totalPriceAfterTaxEditView), ' VND')
                          : formatCurrency(Math.round(totalPriceAfterTaxDetailView), ' VND')}{' '}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div
              className={`flex justify-between mt-[22px] ${
                pageType === 'detail' ? 'importGoodsNonBal-group-button-edit' : 'importGoodsNonBal-group-button'
              }`}
            >
              <button
                onClick={() => {
                  // if (pageType === 'create') {
                  //   setStep(1);
                  //   return navigate(`${routerLinks('ImportGoodsNonBalCreate')}?step=1`);
                  // } else {
                  return window.history.back();
                  // }
                }}
                className="w-[106px] h-[44px] hover:bg-teal-900 bg-white border-teal-900 hover:text-white text-teal-900 border-solid border text-sm rounded-[10px] text-teal-90 back-importGoodsNonBal-button"
                id="backBtn"
              >
                Trở về
              </button>
              {(roleCode === 'OWNER_STORE' ) &&
                (data?.importedStatus === 'WAITING_APPROVED' || pageType === 'create') && (
                  <div className="flex justify-end importGoodsNonBal-right-button-group">
                    {pageType === 'create' && (
                      <button
                        disabled={disabledButon.disabledBtn || choosingImportNonBalGoods.length === 0}
                        onClick={() => {
                          setCreateExport(true);
                          form && form.submit();
                        }}
                        id="outBtn"
                        className="w-[177px] h-[44px] hover:bg-white bg-transparent border border-teal-900 text-teal-900 text-sm rounded-[10px] mr-4 disabled:pointer-events-none disabled:!cursor-not-allowed disabled:opacity-60 importGoodsNonBal-export-bill-button"
                      >
                        Xuất phiếu nhập hàng
                      </button>
                    )}

                    {pageType === 'detail' && (
                      <button
                        disabled={disabledButon.disabledBtn || choosingImportNonBalGoods.length === 0}
                        onClick={async () => {
                          setDisabledButton((prev) => ({ ...prev, disabledBtn: true }));
                          setLoading((prev) => ({ ...prev, loadingExportImportNonBalNote: true }));
                          const res = await ImportGoodsFromNonBalService.exportBillImportNonBalWhenEdit(idProduct);
                          if (res) {
                            setDisabledButton((prev) => ({ ...prev, disabledBtn: false }));
                            const link = document.createElement('a');
                            link.href = window.URL.createObjectURL(new Blob([res], { type: res.type }));
                            link.target = '_blank';
                            link.download = `Phiếu nhập hàng - Mã đơn: ${data.importedCode || 'Đang cập nhật'}`;
                            document.body.appendChild(link);
                            link.click();
                            link?.parentNode?.removeChild(link);
                            setLoading((prev) => ({ ...prev, loadingExportImportNonBalNote: false }));
                            if (type === '1') {
                              return navigate(routerLinks('ListOfStock'));
                            } else {
                              return navigate(routerLinks('ImportGoodsNonBal'));
                            }
                            // return navigate(routerLinks('ImportGoodsNonBal'));
                          }
                        }}
                        id="outBtn"
                        className="w-[177px] h-[44px] hover:bg-white bg-transparent border border-teal-900 text-teal-900 text-sm rounded-[10px] mr-4 disabled:pointer-events-none disabled:!cursor-not-allowed disabled:opacity-60 importGoodsNonBal-export-bill-edit"
                      >
                        Xuất phiếu nhập hàng
                      </button>
                    )}
                    {pageType === 'create' ? (
                      <button
                        type="submit"
                        onClick={() => {
                          setCreateExport(false);
                          form && form.submit();
                        }}
                        disabled={choosingImportNonBalGoods.length === 0}
                        id="saveBtn"
                        className="w-[137px] h-[44px] hover:bg-teal-700 bg-teal-900 text-white text-sm rounded-[10px] disabled:pointer-events-none disabled:!cursor-not-allowed disabled:opacity-60 submit-importGoodsNonBal-button"
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
                        className="w-[137px] h-[44px] hover:bg-teal-700 bg-teal-900 text-white text-sm rounded-[10px] disabled:pointer-events-none disabled:!cursor-not-allowed disabled:opacity-60 submit-importGoodsNonBal-button"
                      >
                        Lưu
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          navigate(`${routerLinks('ImportGoodsNonBalEdit')}?id=${idProduct || data?.id}&step=2`);
                        }}
                        id="editBtn"
                        className="w-[156px] h-[44px] hover:bg-teal-700 bg-teal-900 text-white text-sm rounded-[10px] edit-importGoodsNonBal-button"
                      >
                        Chỉnh sửa
                      </button>
                    )}
                    {pageType === 'detail' && (
                      <button
                        onClick={() => handleDelete(idProduct)}
                        id="deleteBtn"
                        className="w-[84px] h-[44px] bg-red-600 text-white text-sm rounded-[10px] ml-4 delete-importGoodsNonBal-button"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                )}
              {pageType === 'detail' && data?.importedStatus === 'COMPLETED' && (
                <button
                  onClick={async () => {
                    setLoading((prev) => ({ ...prev, loadingExportImportNonBalNote: true }));
                    const NoteKey = dataOrderInvoice?.url;
                    if (NoteKey) {
                      const responsive = await ImportGoodsFromNonBalService.downloadBillImportNonBalWhenCreateWithKey(
                        NoteKey,
                      );
                      const link = document.createElement('a');
                      link.href = window.URL.createObjectURL(new Blob([responsive], { type: responsive.type }));
                      link.target = '_blank';
                      link.download = `Phiếu nhập hàng - Mã đơn: ${dataOrderInvoice.code}`;
                      document.body.appendChild(link);
                      link.click();
                      link?.parentNode?.removeChild(link);
                    }
                    setLoading((prev) => ({ ...prev, loadingExportImportNonBalNote: false }));
                  }}
                  id="outBtn"
                  className="w-[177px] h-[44px] hover:bg-white bg-transparent border border-teal-900 text-teal-900 text-sm rounded-[10px] mr-4 disabled:pointer-events-none disabled:!cursor-not-allowed disabled:opacity-60 importGoodsNonBal-export-bill-button"
                >
                  In phiếu nhập hàng
                </button>
              )}
            </div>
          </Form>
          <ImportGoodsFromNonBalModal
            setTemporary={setTemporary}
            temporary={temporary}
            valueSupplier={valueSupplier}
            setValueSupplier={setValueSupplier}
            setLoading={setLoading}
            visible={visible}
            setVisible={setVisible}
            setListProduct={setListProduct}
            listSupplier={listSupplier}
            setLoadingSkeleton={setLoadingSkeleton}
            setParams={setParams}
            setInforSubOrg={setInforSubOrg}
            scrollPopUpRef={scrollPopUpRef}
            listProduct={arrayListProduct} // Xử lý thêm: ở trang edit thì chỉ lấy danh sách sản phẩm của nhà cung cấp đã chọn (bỏ dropdown)
            remainingListProduct={remainingListProduct}
            choosingImportNonBalGoods={choosingImportNonBalGoods}
            setChoosingImportNonBalGoods={setChoosingImportNonBalGoods}
            disabled={disabled}
            setDisabled={setDisabled}
            pageType={pageType}
            inforSubOrg={inforSubOrg}
            setStop={setStop}
            loading={loading.loadingProduct}
            paramsFilterSupplier={params.idSupplier}
            stop={stop}
            hasMore={hasMore}
            // edit BL-1343 by Tuấn. Sowkiuu Start
            setDisabledButton={setDisabledButton}
            // edit BL-1343 by Tuấn. Sowkiuu End
          />
        </div>
      )}
    </Fragment>
  );
};
export default Page;
