import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { formatCurrency, routerLinks } from 'utils';
import { Col, Row, Form, Input, Tooltip } from 'antd';
import './index.less';
import { SupplierService } from 'services/supplier';
import { Message, Select } from 'components';
import { exportSvg } from 'utils/exportSvg';
import { VoucherService } from 'services/voucher';
import { PromotionalGoodsService } from 'services/PromotionalGoods';
import unorm from 'unorm';
import { isNullOrUndefinedOrEmpty } from 'utils/fucntion';
import { taxApply } from 'constants/index';
import ModalAddProduct from './modalAddProduct';

const { Search } = Input;
export const blockInvalidChar = (e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
const onInput = (event) => {
  event.target.value = event.target.value.replace(/[^0-9+]/g, '');
};

function Page() {
  const location = useLocation();
  const [form] = Form.useForm();
  const urlSearch = new URLSearchParams(location?.search);
  const idOrder = urlSearch.get('id');
  const navigate = useNavigate();
  const [inforOrder, setInforOrder] = useState([]);
  const [listOrder, setListOrder] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [listProductBasic, setListProductBasic] = useState([]);
  const [discount, setDiscount] = useState('');
  const [visible, setVisible] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(12);
  const [params, setParams] = useState({
    page: 1,
    perPage: 12,
    fullTextSearch: '',
    filterSupplier: '',
  });

  const [disabledBtn, setDisabledBtn] = useState(false);
  const [filterTax, setFilterTax] = useState(taxApply.APPLY);
  const [voucherText, setVoucherText] = useState('');
  const formatTime = (time, hour = true) => {
    const timer = new Date(time);
    const yyyy = timer.getFullYear();
    let mm = timer.getMonth() + 1;
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

  const totalPrice =
    listOrder &&
    listOrder?.reduce((a, c) => a + c?.price * c?.quantity, 0).toLocaleString('fullwide', { useGrouping: false });
  const totoTax =
    listOrder &&
    listOrder
      .reduce((a, c) => a + c?.price * c?.quantity * (+c?.product?.importTax?.taxRate / 100), 0)
      .toLocaleString('fullwide', { useGrouping: false });
  const totoTaxAfter =
    listOrder &&
    listOrder
      .reduce((a, c) => a + c?.price * c?.quantity * (+c?.product?.importTax?.taxRate / 100 + 1), 0)
      .toLocaleString('fullwide', { useGrouping: false });

  useEffect(async () => {
    const res = await SupplierService.getDetailGoodsById(idOrder);
    setVoucherText(res?.data?.voucher?.code);
    setDiscount(res?.data?.voucher);
    setFilterTax(!!res?.data?.isApplyTax === true ? taxApply.APPLY : taxApply.NO_APPLY);
    setInforOrder(res?.data);
    setListOrder(res?.data?.orderLineItem);
    const resProduct = await PromotionalGoodsService.getListProduct({
      ...params,
      filterSupplier: res?.data?.supplier?.name,
    });
    setTotal(resProduct?.count);
    setListProductBasic(resProduct?.data);
    setParams({ ...params, filterSupplier: res?.data?.supplier?.name });
    const data = resProduct?.data.filter((goods) => {
      return res?.data?.orderLineItem.findIndex((item) => item?.product?.barcode === goods?.barcode) === -1;
    });
    setListProduct(data);
    form.setFieldsValue(res);
  }, []);

  useEffect(async () => {
    const fetchListProduct = async () => {
      if (total !== 0 && listProduct?.length >= total) {
        setHasMore(false);
        return;
      }
      setHasMore(true);
      if (visible) {
        setLoading(true);
        try {
          const res = await PromotionalGoodsService.getListProduct({ ...params });
          if (res?.data?.length > 0) {
            const data = res.data.filter((goods) => {
              return listOrder.findIndex((item) => item?.product?.barcode === goods?.barcode) === -1;
            });
            setListProductBasic(res?.data);
            setListProduct(listProduct.concat(data));
          }
          setTotal(res?.count);
          setLoading(false);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchListProduct();
  }, [params]);

  const handleDelete = async (item) => {
    const itemsOrder = listOrder?.filter((good) => good.productId !== item);
    setListOrder(itemsOrder.map((good) => ({ ...good, isDeleted: null })));
    const productChange = listProductBasic?.filter((good) => good.id === item);
    setListProduct((prevListProduct) => prevListProduct.concat({ ...productChange[0], isDeleted: true }));
  };

  const _renderOrder = () => {
    return (
      listOrder &&
      listOrder?.map((item, index) => {
                return (
          <div key={index}>
            <Row gutter={16} className="py-3 flex items-center">
              <Col className="gutter-row" span={3}>
                {item?.storeBarcode === null || item?.storeBarcode === '' || item?.storeBarcode === undefined ? (
                  <Form.Item
                    name={`code${item.productId}`}
                    style={{
                      margin: 0,
                    }}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (value === undefined || value.trim() === '') {
                            return Promise.resolve();
                          } else {
                            if (
                              listOrder.filter(
                                (item) => item?.storeBarcode !== undefined && item?.storeBarcode === value,
                              ).length > 0 ||
                              listOrder.filter((item) => item.StoreBarcode === value).length > 1
                            ) {
                              return Promise.reject(new Error('Mã vạch trùng , Vui lòng nhập lại'));
                            }
                            if (value?.length > 13) {
                              return Promise.reject(new Error('Xin vui lòng nhập tối đa 13 kí tự'));
                            }
                            return Promise.resolve();
                          }
                        },
                      }),
                    ]}
                  >
                    <Input
                      className="w-[120px] font-[4px] px-1 py-2 !bg-white rounded-[10px] border border-gray-200 focus:!shadow-none focus:!border-gray-200"
                      placeholder="Nhập mã"
                      type="text"
                      onInput={onInput}
                      onKeyDown={blockInvalidChar}
                      value={item?.product?.barcode}
                      defaultValue={item?.product?.barcode}
                      onChange={(e) => {
                        toggleAmount(
                          {
                            id: item?.productId,
                            storeBarcode: e.target.value,
                          },
                          3,
                        );
                      }}
                      onPressEnter={(e) => {
                        toggleAmount(
                          {
                            id: item?.productId,
                            storeBarcode: e.target.value,
                          },
                          3,
                        );
                      }}
                    />
                  </Form.Item>
                ) : (
                  <div className=" break-words ">{item?.storeBarcode}</div>
                )}
              </Col>
              <Col className="gutter-row" span={3}>
                <h5 className="text-sm font-normal text-gray-700 break-all">
                  {item?.product?.barcode ? item?.product?.barcode : ''}
                </h5>
              </Col>
              <Col className="gutter-row " span={filterTax === 'APPLY' ? 3 : 5}>
                <div className="h-full grid grid-cols-product-name items-center gap-0 text-left">
                  <div>
                    <Tooltip
                      placement="topLeft"
                      title={item?.product?.name}
                      mouseEnterDelay={0.1}
                      mouseLeaveDelay={0.1}
                    >
                      <h5 className="name text-sm font-medium break-all">{item?.product?.name}</h5>
                    </Tooltip>
                    <h5 className="font-normal text-xs text-gray-500"></h5>
                  </div>
                </div>
              </Col>
              <Col className="gutter-row" span={2}>
                <h5 className="text-sm font-normal text-gray-700 break-all ">{item?.product?.basicUnit}</h5>
              </Col>
              <Col className="gutter-row" span={3}>
                <h5 className="text-sm font-normal text-gray-700">{formatCurrency(item?.price, '')}</h5>
              </Col>
              <Col className="gutter-row" span={3}>
                <Form.Item
                  name={`quantity${item.productId}`}
                  style={{
                    margin: 0,
                  }}
                  rules={[
                    {
                      required:
                        (item?.quantity === '' ||
                          item?.quantity === null ||
                          item?.quantity === undefined ||
                          item?.quantity === false) &&
                        true,
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
                    className="w-[100px] h-[40px] text-right font-[4px] px-3 py-2 !bg-white rounded-[10px] border border-gray-200 focus:!shadow-none focus:!border-gray-200 disabled:!bg-white"
                    placeholder="Nhập SL"
                    value={+item?.quantity}
                    defaultValue={+item?.quantity}
                    type="number"
                    maxLength={6}
                    onKeyDown={blockInvalidChar}
                    onChange={(e) => {
                      toggleAmount(
                        {
                          id: item?.productId,
                          _quantity: +e.target.value > 0 && Number.parseFloat(e.target.value).toFixed(2),
                          // updateAmount: Number.parseFloat(e.target.value).toFixed(2),
                          // voucher: voucherText,
                        },
                        2,
                      );
                    }}
                    onPressEnter={(e) => {
                      e.key === 'Enter' && e.preventDefault();
                    }}
                    min={1}
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row " span={filterTax === 'APPLY' ? 2 : 4}>
                <h5 className="subtotal break-all">
                  {+item.quantity > 0 ? formatCurrency(Number(item?.price) * Number(item?.quantity), ' ') : ''}
                </h5>
              </Col>
              {filterTax === taxApply.APPLY ? (
                <Col className="gutter-row " span={2}>
                  <h5 className="subtotal"> {item?.product?.importTax?.taxRate}%</h5>
                </Col>
              ) : null}
              {filterTax === taxApply.APPLY ? (
                <Col className="gutter-row " span={2}>
                  <h5 className="subtotal break-all">
                    {' '}
                    {+item.quantity > 0
                      ? formatCurrency(
                          Number(item?.price) * Number(item?.quantity) * (+item?.product?.importTax?.taxRate / 100 + 1),
                          ' ',
                        )
                      : 0}
                  </h5>
                </Col>
              ) : null}
              <Col className="gutter-row " span={1}>
                <button
                  className="remove-btn"
                  onClick={() => {
                    handleDelete(item?.productId);
                  }}
                >
                  <i className="las la-trash-alt text-red-600 text-2xl"></i>
                </button>
              </Col>
            </Row>
            <hr />
          </div>
        );
      })
    );
  };

  const caculatePrice = useCallback(() => {
    switch (filterTax) {
      case taxApply.APPLY: {
        const totoTaxAfter =
          listOrder &&
          listOrder.reduce((a, c) => a + c?.price * c?.quantity * (+c?.product?.importTax?.taxRate / 100 + 1), 0);
        let discountPrice;
        let totalBill;
        let voucherValuePercent;
        if (totoTaxAfter < discount?.conditionApplyAmount) {
          discountPrice = 0;
          totalBill = totoTaxAfter;
          voucherValuePercent = 0;
        } else {
          discountPrice =
            (discount?.voucherType === 'PERCENT'
              ? totoTaxAfter * (discount?.voucherValue / 100)
              : discount?.voucherValue) ?? 0;
          totalBill = +totoTaxAfter - +discountPrice < 0 ? 0 : totoTaxAfter - +discountPrice;
          voucherValuePercent =
            discount?.voucherType === 'PERCENT'
              ? discount?.voucherValue
              : ((discount?.voucherValue / totoTaxAfter) * 100).toFixed(2);
        }
        return { totoTaxAfter, discountPrice, totalBill, voucherValuePercent };
      }
      case taxApply.NO_APPLY: {
        const totalPrice = listOrder && listOrder?.reduce((a, c) => a + c?.price * c?.quantity, 0);
        let voucherValuePercentNoTax;
        let discountNoTax;
        let totalOrderNoTax;
        if (totalPrice < discount?.conditionApplyAmount) {
          discountNoTax = 0;
          totalOrderNoTax = totalPrice;
          voucherValuePercentNoTax = 0;
        } else {
          discountNoTax =
            (discount?.voucherType === 'PERCENT'
              ? totalPrice * (discount?.voucherValue / 100)
              : discount?.voucherValue) ?? 0;
          totalOrderNoTax = totalPrice - discountNoTax;
          voucherValuePercentNoTax =
            discount?.voucherType === 'PERCENT'
              ? discount?.voucherValue
              : ((discount?.voucherValue / totalOrderNoTax) * 100).toFixed(2);
        }
        return { totalPrice, discountNoTax, totalOrderNoTax, voucherValuePercentNoTax };
      }
      default:
        break;
    }
  }, [listOrder, discount, filterTax]);

  const handleCheckVoucher = async (value) => {
    if (!value) return;
    try {
      const res_ = await VoucherService.getInfo({
        code: value,
        supplierId: inforOrder?.supplierId,
        totalAmount: totalPrice,
      });

      if (res_ && res_.data) {
        setDiscount(res_?.data);
        return (
          // e.key === 'Enter' &&
          Message.success({ text: 'Lấy thông tin voucher thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' })
        );
      } else {
        setDiscount({});
        setVoucherText('');
      }
    } catch (error) {
      setVoucherText('');
      console.log('error: ', error);
      return error;
    }
  };

  const toggleAmount = (data, type) => {
    const { id, _quantity, storeBarcode } = data;
    const tempOrder =
      listOrder &&
      listOrder.map((item) => {
        if (item.productId === id) {
          if (type === 3) {
            return { ...item, _storeBarcode: storeBarcode };
          }
          if (type === 2) {
            return { ...item, quantity: _quantity };
          }
        }
        return item;
      });
    return setListOrder([...tempOrder]);
  };

  useEffect(async () => {
    if (isNullOrUndefinedOrEmpty(voucherText)) {
      setDiscount({});
    }
    if (totalPrice < discount?.conditionApplyAmount && voucherText !== '') {
      Message.error({ text: 'Điều kiện áp dụng voucher không đủ' });
      setDiscount('');
    } else if (voucherText === '') {
      setDiscount('');
    } else if (voucherText) {
      const res_ = await VoucherService.getInfo({
        code: voucherText,
        supplierId: inforOrder?.supplierId,
        totalAmount: totalPrice,
      });
      if (!res_) {
        setDiscount('');
      } else {
        setDiscount(res_?.data);
      }
    }
  }, [totalPrice, listOrder]);

  const onFinish = async () => {
    setDisabledBtn(true);
        if (listOrder.length === 0) {
      Message.error({ text: 'Vui lòng thêm sản phẩm' });
    } else {
      const list = listOrder?.map((item) => {
        return {
          productId: item?.productId,
          storeBarcode: item?.storeBarcode || item?.product?.barcode,
          price: item?.price,
          quantity: item?.quantity,
          tax: item?.product?.importTax?.taxRate,
          supplierBarcode: item?.product?.barcode,
        };
      });
      const params = {
        orderId: +idOrder,
        voucherUuid: discount?.uuid,
        supplierId: inforOrder?.supplierId,
        isApplyTax: filterTax === taxApply.APPLY,
        list,
      };
      await PromotionalGoodsService.editOrder(params);
      setTimeout(() => navigate(routerLinks('OrderDetail') + `?id=${idOrder}` + `&tabKey=${1}`), 100);
      return true;
    }
  };

  return (
    <Fragment>
      <div className="cart min-h-screen md:h-full h-full tableOrderProductCart ">
        <p className="text-2xl text-teal-900 font-medium">Chỉnh sửa đơn hàng</p>
        <div className="bg-white w-full px-4 rounded-xl mt-5 relative pb-5 tableExtend">
          <div className="flex flex-row items-center order-detail-title">
            <p className="text-xl font-bold text-teal-900 py-4 mr-5 order-info-title">Thông tin đơn hàng</p>
            <p className="text-[16px] text-yellow-400 py-4 flex flex-row items-center order-detail-status">
              <i className="mr-1 text-lg las la-tag"></i>
              <span className="text-[16px]">Chờ xác nhận</span>
            </p>
          </div>
          <div className="w-full flex flex-col md:flex-row text-base">
            <div className="w-full">
              <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                <div className="font-bold text-black order">Mã đơn hàng:</div>
                <div className="text-gray-500">{inforOrder?.code}</div>
              </div>
              <div className="w-full flex flex-row mb-5 gap-3 detail-order-section items-center">
                <div className="font-bold text-black order">Nhà cung cấp:</div>
                <div className="text-gray-500">{inforOrder?.supplier?.name}</div>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full flex flex-row mb-5 gap-3 detail-order-section">
                <div className="font-bold text-black order">Thời gian đặt hàng: </div>
                <div className="text-gray-500">{formatTime(inforOrder?.createdAt)}</div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row mb-5 gap-3 detail-order-section text-base">
            <div className="font-bold text-black order flex-none">Địa chỉ giao hàng:</div>
            <div className="text-gray-500">{inforOrder?.addressConvert}</div>
          </div>

          <Form form={form} component={false} onFinish={onFinish}>
            <div className="lg:flex">
              <div>
                <div className="w-full flex sm:flex-row mb-5 gap-3 detail-order-section sm:items-center">
                  <span className="font-bold text-black order text-base">Vouchers:</span>
                  <div className="sm:flex sm:w-max">
                    <div className="flex flex-col sm:flex-row text-base">
                      <div className="search-container voucherText">
                        <Search
                          value={voucherText}
                          placeholder="Nhập voucher và Enter"
                          addonAfter={null}
                          allowClear
                          maxLength={10}
                          onChange={(e) => {
                            const value = e.target.value.trim();
                            setVoucherText(value);
                          }}
                          onPressEnter={(e) => {
                            handleCheckVoucher(voucherText, e);
                          }}
                          // onBlur={(e) => {
                          //   handleCheckVoucher(voucherText, e);
                          // }}
                          onKeyDown={(e) => {
                            const value = unorm.nfkd(e.key).replace(/[\u0300-\u036F]/g, '');
                            const regex = /\S/g;
                            if (!regex.test(value)) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="sm:ml-2 sm:mt-0 mt-4">
                      <button
                        // disabled={disabledBtn}
                        onClick={async (e) => {
                          handleCheckVoucher(voucherText, e);
                        }}
                        id="inputProductBtn"
                        className=" bg-teal-900 h-[40px] text-white text-base py-2 px-7 rounded-[10px] hover:bg-teal-600 w-auto sm:mb-0 mb-2"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:ml-5">
                {discount?.description ? (
                  <div className="justify-center sm:justify-start flex items-center gap-2 py-2 px-3 bg-green-50 border border-green-600 sm:w-fit h-fit rounded-[10px] mb-4">
                    <span> {exportSvg('PROMOTION')}</span>
                    <span className="text-base text-green-600">{discount?.description}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <hr />
            <div className="flex justify-between items-center flex-col sm:flex-row mb-4 mt-4">
              <p className="text-[16px] font-bold text-teal-900 py-4 sm:mr-5">Chi tiết đơn hàng</p>
              <Select
                defaultValue={filterTax}
                value={filterTax}
                className="w-wull sm:w-[245px]"
                allowClear={false}
                placeHolder="Chọn thuế"
                list={[
                  { label: 'Áp dụng thuế', value: taxApply?.APPLY },
                  { label: 'Không áp dụng thuế', value: taxApply?.NO_APPLY },
                ]}
                onChange={(value) => setFilterTax(value)}
              />
            </div>
            <div className="flex items-center sm:justify-end justify-center mb-4 gap-4">
              <button
                type="button"
                onClick={async () => {
                  setVisible(true);
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
            </div>
            <div>
              <div className="lg:overflow-hidden overflow-x-auto ">
                <table className="lg:overflow-hidden overflow-x-auto lg:w-[98%] md:w-[1000px] w-[1000px] tableList">
                  {filterTax === 'APPLY' ? (
                    <Row gutter={16} className="mb-3 tableListProduct">
                      <Col className="gutter-row" span={3}>
                        <div className="text-sm font-normal text-gray-700">Mã vạch (CH)</div>
                      </Col>
                      <Col className="gutter-row " span={3}>
                        <div className="text-sm font-normal text-gray-700">Mã vạch (NCC)</div>
                      </Col>
                      <Col className="gutter-row " span={3}>
                        <div className="text-sm font-normal text-gray-700">Tên sản phẩm</div>
                      </Col>
                      <Col className="gutter-row " span={2}>
                        <div className="text-sm font-normal text-gray-700">ĐVT</div>
                      </Col>
                      <Col className="gutter-row" span={3}>
                        <div className="text-sm font-normal text-gray-700">Đơn giá (VND)</div>
                      </Col>
                      <Col className="gutter-row" span={3}>
                        <div className="text-sm font-normal text-gray-700">Số lượng</div>
                      </Col>
                      <Col className="gutter-row" span={2}>
                        <div className="text-sm font-normal text-gray-700">Thành tiền</div>
                      </Col>
                      <Col className="gutter-row" span={2}>
                        <div className="text-sm font-normal text-gray-700">Thuế</div>
                      </Col>
                      <Col className="gutter-row" span={3}>
                        <div className="text-sm font-normal text-gray-700">Tiền sau thuế</div>
                      </Col>
                      <Col className="gutter-row text-center" span={1}>
                        <div></div>
                      </Col>
                    </Row>
                  ) : (
                    <Row gutter={16} className="mb-3 tableListProduct">
                      <Col className="gutter-row " span={3}>
                        <div className="text-sm font-normal text-gray-700">Mã vạch (CH)</div>
                      </Col>
                      <Col className="gutter-row " span={3}>
                        <div className="text-sm font-normal text-gray-700">Mã vạch (NCC)</div>
                      </Col>
                      <Col className="gutter-row " span={5}>
                        <div className="text-sm font-normal text-gray-700">Tên sản phẩm</div>
                      </Col>
                      <Col className="gutter-row " span={2}>
                        <div className="text-sm font-normal text-gray-700">ĐVT</div>
                      </Col>
                      <Col className="gutter-row" span={3}>
                        <div className="text-sm font-normal text-gray-700">Đơn giá (VND)</div>
                      </Col>
                      <Col className="gutter-row" span={3}>
                        <div className="text-sm font-normal text-gray-700">Số lượng</div>
                      </Col>
                      <Col className="gutter-row" span={4}>
                        <div className="text-sm font-normal text-gray-700">Thành tiền</div>
                      </Col>
                      <Col className="gutter-row text-center" span={1}>
                        <div></div>
                      </Col>
                    </Row>
                  )}

                  <hr />
                  {_renderOrder()}
                </table>
              </div>

              {filterTax === taxApply.APPLY ? (
                <div className="flex justify-end mt-4 ">
                  <div className="grid grid-cols-2 ">
                    <div className="grid-cols-1">
                      <p className="font-bold sm:text-base text-sm text-teal-900 mr-11 leading-7">Tổng tiền hàng:</p>
                      <p className="font-bold sm:text-base text-sm text-teal-900 mr-11 leading-10">Tiền thuế:</p>
                      <p className="font-bold sm:text-base text-sm text-teal-900 mr-11 leading-7">
                        Tổng tiền sau thuế:
                      </p>
                      <p className="font-bold sm:text-base text-sm text-teal-900 mr-11 leading-7">Chiết khấu:</p>
                      <p className="font-bold sm:text-base text-sm text-teal-900 mr-11 leading-7">Tổng tiền:</p>
                    </div>
                    <div className="mr-4">
                      <p className="font-bold sm:text-base text-sm text-slate-700 leading-7 text-right">
                        {totalPrice !== 'NaN' ? formatCurrency(totalPrice, ' VND') : 0}
                      </p>
                      <p className="font-bold sm:text-base text-sm text-slate-700 leading-10 text-right">
                        {totoTax !== 'NaN' ? formatCurrency(totoTax, ' VND') : 0}
                      </p>
                      <p className="font-bold sm:text-base text-sm text-slate-700 sm:leading-7 leading-7 sm:mt-0  text-right ">
                        {totoTaxAfter !== 'NaN' ? formatCurrency(totoTaxAfter, ' VND') : 0}
                      </p>
                      <p className="font-bold sm:text-base text-sm text-slate-700 sm:leading-7 leading-7 sm:mt-0  text-right ">
                        {caculatePrice().discountPrice !== 'NaN'
                          ? formatCurrency(caculatePrice().discountPrice ?? 0, ' VND ')
                          : 0}
                        {caculatePrice().voucherValuePercent > 0 && caculatePrice().voucherValuePercent !== 'Infinity'
                          ? '(' + caculatePrice().voucherValuePercent + '%)'
                          : null}
                      </p>
                      <p className="font-bold sm:text-base text-sm text-slate-700 sm:leading-7 leading-7 sm:mt-0  text-right ">
                        {!isNaN(caculatePrice().totalBill) ? formatCurrency(caculatePrice().totalBill ?? 0, ' VND') : 0}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end mt-4 ">
                  <div className="grid grid-cols-2 ">
                    <div className="grid-cols-1">
                      <p className="font-bold sm:text-base text-sm text-teal-900 mr-11 leading-7">Tổng tiền hàng:</p>
                      <p className="font-bold sm:text-base text-sm text-teal-900 mr-11 leading-7">Chiết khấu:</p>
                      <p className="font-bold sm:text-base text-sm text-teal-900 mr-11 leading-7">Tổng tiền:</p>
                    </div>
                    <div className="mr-4">
                      <p className="font-bold sm:text-base text-sm text-slate-700 leading-7 text-right">
                        {totalPrice !== 'NaN' ? formatCurrency(totalPrice, ' VND') : 0}{' '}
                      </p>
                      <p className="font-bold sm:text-base text-sm text-slate-700 sm:leading-7 leading-7 sm:mt-0  text-right ">
                        {caculatePrice().discountNoTax !== 'NaN'
                          ? formatCurrency(caculatePrice().discountNoTax ?? 0, ' VND ')
                          : 0}
                        {caculatePrice().voucherValuePercentNoTax > 0
                          ? '(' + caculatePrice().voucherValuePercentNoTax + '%)'
                          : null}
                      </p>
                      <p className="font-bold sm:text-base text-sm text-slate-700 sm:leading-7 leading-7 sm:mt-0  text-right ">
                        {caculatePrice().totalOrderNoTax !== 'NaN'
                          ? formatCurrency(caculatePrice().totalOrderNoTax ?? 0, ' VND')
                          : 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Form>
        </div>
        <div className=" flex sm:flex-row flex-col items-center sm:justify-between mt-[53px]">
          <button
            onClick={() => {
              window.history.back();
            }}
            className="px-8 bg-white-500 border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-xl text-teal-900 hover:text-teal-600 mt-1 sm:w-[150px] w-[60%] sm:mb-0 mb-2"
            id="backBtn"
          >
            Trở về
          </button>
          <button
            disabled={disabledBtn}
            onClick={async () => {
              form && form.submit();
            }}
            id="inputProductBtn"
            className="bg-teal-900 h-[44px] text-white text-base py-2 px-7 rounded-[10px] hover:bg-teal-600 mt-1 sm:w-[150px] w-[60%] sm:mb-0 mb-2"
          >
            Lưu
          </button>
        </div>
      </div>
      {/* modal add */}
      <ModalAddProduct
        visible={visible}
        setVisible={setVisible}
        setParams={setParams}
        listProduct={listProduct}
        setListProduct={setListProduct}
        listOrder={listOrder}
        setListOrder={setListOrder}
        loading={loading}
        setLoading={setLoading}
        hasMore={hasMore}
      />
    </Fragment>
  );
}

export default Page;
