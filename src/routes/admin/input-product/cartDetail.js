import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { formatCurrency, routerLinks } from 'utils';
import { Col, Modal, Row, Form, Input, Tooltip } from 'antd';
import './index.less';
import ImgCart from '../../../assets/images/imgcart.png';
import { useCart } from 'cartContext';
import { CartService } from 'services/cart';
import { Message, Select, Spin } from 'components';
import { exportSvg } from 'utils/exportSvg';
import { VoucherService } from 'services/voucher';
import unorm from 'unorm';
import { isNullOrUndefinedOrEmpty } from 'utils/fucntion';
import { taxApply } from 'constants/index';

const { Search } = Input;
export const blockInvalidChar = (e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
const onInput = (event) => {
  event.target.value = event.target.value.replace(/[^0-9+]/g, '');
};

function Page() {
  const location = useLocation();
  const [form] = Form.useForm();
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  const {
    dataCart,
    cart,
    deleteCartItem,
    toggleAmount,
    storeInfo,
    supplierInfo,
    fetchListCart,
    getCodeBar,
    setDiscount,
    discount,
    isLoading,
  } = useCart();
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cartFail, setCartFail] = useState([]);
  const [filterTax, setFilterTax] = useState(taxApply.APPLY);
  const [voucherText, setVoucherText] = useState('');
  const [isLoadingCart, set_isLoadingCart] = useState(false);

  const totalPrice =
    cart && cart?.reduce((a, c) => a + c?.price * c?.quantity, 0).toLocaleString('fullwide', { useGrouping: false });
  const totoTax =
    cart &&
    cart
      .reduce((a, c) => a + c?.price * c?.quantity * (+c?.product?.importTax?.taxRate / 100), 0)
      .toLocaleString('fullwide', { useGrouping: false });
  const totoTaxAfter =
    cart &&
    cart
      .reduce((a, c) => a + c?.price * c?.quantity * (+c?.product?.importTax?.taxRate / 100 + 1), 0)
      .toLocaleString('fullwide', { useGrouping: false });

  let title = '';
  switch (pageType) {
    case 'cart':
      title = 'Chi tiết Giỏ hàng';
      break;
    default:
      title = 'Giỏ hàng';
      break;
  }
  useEffect(() => {
    const data = async () => {
      const res = await CartService.getListCart();
      for (let i = 0; i < res.data.cartLineItem?.length; i++) {
        const item = res?.data?.cartLineItem[i];
        res['quantity' + item.productId] = res?.data?.cartLineItem[i].quantity;
      }
      form.setFieldsValue(res);
    }
    data()
  }, [pageType]);

  const _renderCart = () => {
    return (
      cart &&
      cart?.map((item, index) => {
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
                      // {
                      //   required: true,
                      //   message: `Mã vạch là bắt buộc`,
                      // },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (value === undefined || value.trim() === '') {
                            return Promise.resolve();
                          } else {
                            if (
                              cart.filter((item) => item?.storeBarcode !== undefined && item?.storeBarcode === value)
                                .length > 0 ||
                              cart.filter((item) => item.StoreBarcode === value).length > 1
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
                        getCodeBar({ id: item?.productId, _codeBar: e.target.value });
                      }}
                      onPressEnter={(e) => {
                        getCodeBar({ id: item?.productId, _codeBar: item?.product?.barcode });
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
              <Col className="gutter-row " span={filterTax === 'APPLY' ? 4 : 5}>
                <div className="h-full items-center gap-0 text-left">
                  <div>
                    <Tooltip
                      placement="topLeft"
                      title={item?.product?.name}
                      mouseEnterDelay={0.1}
                      mouseLeaveDelay={0.1}
                    >
                      <h5 className="name text-sm font-medium truncate">{item?.product?.name}</h5>
                    </Tooltip>
                    <h5 className="font-normal text-xs text-gray-500"></h5>
                  </div>
                </div>
              </Col>
              <Col className="gutter-row" span={2}>
                <h5 className="text-sm font-normal text-gray-700 break-all ">{item?.product?.basicUnit}</h5>
              </Col>
              <Col className="gutter-row" span={3}>
                <h5 className="text-sm font-normal text-gray-700">
                  {item?.quantity > 0 ? formatCurrency(item?.price, '') : 0}
                </h5>
              </Col>
              <Col className="gutter-row" span={2}>
                <Form.Item
                  name={`quantity${item.productId}`}
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
                        const dataReverse = item?.product?.productPrice?.sort(
                          (a, b) => a?.minQuantity - b?.minQuantity,
                        );
                        if (+value < dataReverse[0]?.minQuantity && value !== '') {
                          return Promise.reject(new Error('Vui lòng nhập lớn hơn hoặc bằng số lượng tối thiểu'));
                        }
                        if (+value === 0 && value !== '') {
                          return Promise.reject(new Error('Vui lòng nhập số lượng lớn hơn 0!'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input
                    disabled={isLoading}
                    className="w-[80px] h-[40px] text-right font-[4px] px-3 py-2 !bg-white rounded-[10px] border border-gray-200 focus:!shadow-none focus:!border-gray-200 disabled:!bg-white"
                    placeholder="Nhập số lượng"
                    defaultValue={item?.quantity}
                    type="number"
                    maxLength={6}
                    onKeyDown={blockInvalidChar}
                    onChange={(e) => {
                      console.log(e)
                      toggleAmount({
                        id: item?.productId,
                        value: 'update',
                        updateAmount: Number.parseFloat(e.target.value).toFixed(2),
                        voucher: voucherText,
                      });
                    }}
                    onPressEnter={(e) => {
                      e.key === 'Enter' && e.preventDefault();
                      // toggleAmount({ id: item?.productId, value: 'update', updateAmount: e.target.value, voucher: voucherText });

                      // }, 1000);
                    }}
                    min={1}
                  />
                </Form.Item>
                {/* </Form> */}
                {/* <button
                    onClick={() => {
                      toggleAmount({ id: item?.productId, value: 'inc' });
                    }}
                    className="h-8 w-8 leading-8 text-center rounded-full bg-transparent border border-teal-900 text-teal-900 hover:bg-teal-900 hover:text-white"
                  >
                    <i className="las la-plus"></i>
                  </button> */}
                {/* </div> */}
              </Col>
              <Col className="gutter-row " span={filterTax === 'APPLY' ? 3 : 5}>
                <h5 className="subtotal break-all">
                  {' '}
                  {+item.quantity > 0 && +item.quantity >= item?.product?.productPrice?.at(-1)?.minQuantity
                    ? formatCurrency(Number(item?.price) * Number(item?.quantity), ' ')
                    : 0}
                </h5>
              </Col>
              {filterTax === taxApply.APPLY ? (
                <Col className="gutter-row " span={1}>
                  <h5 className="subtotal"> {item?.product?.importTax?.taxRate}%</h5>
                </Col>
              ) : null}
              {filterTax === taxApply.APPLY ? (
                <Col className="gutter-row " span={2}>
                  <h5 className="subtotal break-all">
                    {' '}
                    {+item.quantity > 0 && +item.quantity >= item?.product?.productPrice?.at(-1)?.minQuantity
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
                    deleteCartItem(item?.productId);
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

  const handleCheckVoucher = async (value, e) => {
    if (!value) return;
    try {
      const res_ = await VoucherService.getInfo({
        code: value,
        supplierId: dataCart?.supplierId,
        totalAmount: totoTaxAfter,
      });
      if (res_ && res_.data) {
        setDiscount(res_?.data);
        return (
          e.key === 'Enter' &&
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

    // }
  };
  useEffect(() => {
    if (isNullOrUndefinedOrEmpty(voucherText)) {
      setDiscount({});
    }
  }, [voucherText]);

  const caculatePrice = useCallback(() => {
    switch (filterTax) {
      case taxApply.APPLY: {
        const totoTaxAfter =
          cart && cart.reduce((a, c) => a + c?.price * c?.quantity * (+c?.product?.importTax?.taxRate / 100 + 1), 0);

        const discountPrice =
          (discount?.voucherType === 'PERCENT'
            ? totoTaxAfter * (discount?.voucherValue / 100)
            : discount?.voucherValue) ?? 0;
        const totalBill = +totoTaxAfter - +discountPrice < 0 ? 0 : totoTaxAfter - +discountPrice;
        const voucherValuePercent =
          discount?.voucherType === 'PERCENT'
            ? discount?.voucherValue
            : ((discount?.voucherValue / totoTaxAfter) * 100).toFixed(2);
        return { totoTaxAfter, discountPrice, totalBill, voucherValuePercent };
      }

      case taxApply.NO_APPLY: {
        const totalPrice = cart && cart?.reduce((a, c) => a + c?.price * c?.quantity, 0);

        const discountNoTax =
          (discount?.voucherType === 'PERCENT'
            ? totalPrice * (discount?.voucherValue / 100)
            : discount?.voucherValue) ?? 0;
        const totalOrderNoTax = totalPrice - discountNoTax;
        const voucherValuePercentNoTax =
          discount?.voucherType === 'PERCENT'
            ? discount?.voucherValue
            : ((discount?.voucherValue / totalOrderNoTax) * 100).toFixed(2);
        return { totalPrice, discountNoTax, totalOrderNoTax, voucherValuePercentNoTax };
      }
      default:
        break;
    }
  }, [cart, discount, filterTax]);

  const onFinish = async (values) => {
    setDisabledBtn(true);
    set_isLoadingCart(true);
    const isApplyTax = filterTax === taxApply.APPLY;
    const res = await CartService.postOrder(cart, discount?.uuid, isApplyTax);
    set_isLoadingCart(false);
    if (res?.data !== null && res?.statusCode === 200) {
      setDisabledBtn(false);
      Message.success({ text: res.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      await fetchListCart();
      return navigate(`${routerLinks('OrderManagement')}?tab=1`);
    } else {
      Message.error({ text: res.message, title: 'Thất bại', cancelButtonText: 'Đóng' });
    }
    if (res?.data?.length > 0) {
      setVisible(true);
      setCartFail(res?.data);
    }
    setDisabledBtn(false);
    return true;
  };

  return (
    <Fragment>
      <div className="cart min-h-screen md:h-full h-full tableOrderProductCart ">
        <p className="text-2xl font-bold text-teal-900 mb-4">{title}</p>
        <Spin spinning={isLoadingCart}>
          <Form form={form} component={false} onFinish={onFinish}>
            <div className="bg-white sm:px-4 sm:py-6 py-2 px-2 rounded-[10px]">
              <div className="mb-5">
                <h2 className="cart-title">Thông tin đơn hàng</h2>
                {cart && cart?.length > 0 ? (
                  <Row className="detailOrder">
                    <Col span={12} className="pr-3">
                      <h4 className="text-base font-medium text-teal-900 mb-2">Thông tin cửa hàng</h4>
                      <div>
                        <div className="grid lg:grid-cols-[176px_minmax(176px,_1fr)] grid-cols-[120px_minmax(176px,_1fr)] mb-4">
                          <span className="font-medium text-base text-black ">Cửa hàng:</span>
                          <span className="font-normal text-base text-gray-600 ">{storeInfo?.subOrg?.name}</span>
                        </div>
                        <div className="grid lg:grid-cols-[176px_minmax(176px,_1fr)] grid-cols-[120px_minmax(176px,_1fr)] mb-4">
                          <span className="font-medium text-base text-black ">Số điện thoại:</span>
                          <span className="font-normal text-base text-gray-600 ">{storeInfo?.phoneNumber}</span>
                        </div>
                        <div className="grid lg:grid-cols-[176px_minmax(176px,_1fr)] grid-cols-[120px_minmax(176px,_1fr)] mb-4">
                          <span className="font-medium text-base text-black ">Địa chỉ:</span>
                          <span className="font-normal text-base text-gray-600 ">
                            {storeInfo?.subOrg?.address?.street === null || undefined
                              ? ''
                              : storeInfo?.subOrg?.address?.street}
                            {storeInfo?.subOrg?.address?.ward?.name === null || undefined
                              ? ''
                              : ', ' + storeInfo?.subOrg?.address?.ward?.name}

                            {storeInfo?.subOrg?.address?.district?.name === null || undefined
                              ? ''
                              : ', ' + storeInfo?.subOrg?.address?.district?.name}
                            {storeInfo?.subOrg?.address?.province?.name === null || undefined
                              ? ''
                              : ', ' + storeInfo?.subOrg?.address?.province?.name}
                          </span>
                        </div>
                      </div>
                    </Col>
                    <Col span={12} className="lg:pl-3">
                      <h4 className="text-base font-medium text-teal-900 mb-2">Thông tin nhà cung cấp</h4>
                      <div>
                        <div className="grid lg:grid-cols-[176px_minmax(176px,_1fr)] grid-cols-[120px_minmax(176px,_1fr)] mb-4">
                          <span className="font-medium text-base text-black">Nhà cung cấp:</span>
                          <span className="font-normal text-base text-gray-600 ">{supplierInfo?.name}</span>
                        </div>
                        <div className="grid lg:grid-cols-[176px_minmax(176px,_1fr)] grid-cols-[120px_minmax(176px,_1fr)] mb-4">
                          <span className="font-medium text-base text-black">Số điện thoại:</span>
                          <span className="font-normal text-base text-gray-600 ">
                            {supplierInfo?.userRole?.[0]?.userAdmin?.phoneNumber}
                          </span>
                        </div>
                        <div className="grid lg:grid-cols-[176px_minmax(176px,_1fr)] grid-cols-[120px_minmax(176px,_1fr)] mb-4">
                          <span className="font-medium text-base text-black ">Địa chỉ:</span>
                          <span className="font-normal text-base text-gray-600">
                            {supplierInfo?.address?.street === null || undefined ? '' : supplierInfo?.address?.street}
                            {supplierInfo?.address?.ward?.name === null || undefined
                              ? ''
                              : ', ' + supplierInfo?.address?.ward?.name}
                            {supplierInfo?.address?.district?.name === null || undefined
                              ? ''
                              : ', ' + supplierInfo?.address?.district?.name}
                            {supplierInfo?.address?.province?.name === null || undefined
                              ? ''
                              : ', ' + supplierInfo?.address?.province?.name}
                          </span>
                        </div>
                      </div>
                    </Col>
                    <Col span={12} className="">
                      <div className="grid lg:grid-cols-[176px_minmax(176px,_300px)] grid-cols-[120px_minmax(176px,_300px)] mb-4">
                        <span className="font-medium text-base text-black mt-[8px]">Voucher:</span>
                        <div className='sm:flex w-max'>
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
                              onBlur={(e) => {
                                handleCheckVoucher(voucherText, e);
                              }}
                              onKeyDown={(e) => {
                                const value = unorm.nfkd(e.key).replace(/[\u0300-\u036F]/g, '');
                                const regex = /\S/g;
                                if (!regex.test(value)) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </div>
                          <div className='sm:ml-2 mt-3 sm:mt-0'>
                            <button
                              // disabled={disabledBtn}
                              onClick={async (e) => {
                                handleCheckVoucher(voucherText, e);
                              }}
                              id="inputProductBtn"
                              className="bg-teal-900 h-[40px] text-white text-base py-2 px-7 rounded-[10px] hover:bg-teal-600 w-auto sm:mb-0 mb-2"
                            >
                              Áp dụng
                            </button>
                          </div>
                        </div>
                      </div>
                    </Col>
                    {discount?.description ? (
                      <Col span={12} className="lg:pl-3 xl:pl-5">
                        <div className="flex items-center gap-2 py-2 px-3 bg-green-50 border border-green-600 w-fit h-fit rounded-[10px]">
                          <span> {exportSvg('PROMOTION')}</span>
                          <span className="text-base text-green-600">{discount?.description}</span>
                        </div>
                      </Col>
                    ) : null}
                  </Row>
                ) : null}
              </div>
              <div>
                {cart && cart?.length > 0 ? (
                  <div>
                    <div className="flex justify-between items-center flex-col sm:flex-row mb-4">
                      <h2 className="sm:text-2xl text-sm cart-title">Danh sách sản phẩm</h2>
                      <Select
                        defaultValue={filterTax}
                        className="w-wull sm:w-[245px]"
                        allowClear={false}
                        placeHolder="Chọn thuế"
                        list={[
                          { label: 'Áp dụng thuế', value: taxApply.APPLY },
                          { label: 'Không áp dụng thuế', value: taxApply.NO_APPLY },
                        ]}
                        onChange={(value) => setFilterTax(value)}
                      />
                    </div>
                    <div className="lg:overflow-hidden overflow-x-auto ">
                      <table className="lg:overflow-hidden overflow-x-auto lg:w-[98%] md:w-[1000px] w-[1000px] tableList">
                        {filterTax === 'APPLY' ? (
                          <Row gutter={16} className="mb-3 tableListProduct">
                            <Col className="gutter-row " span={3}>
                              <div className="text-sm font-normal text-gray-700">Mã vạch (CH)</div>
                            </Col>
                            <Col className="gutter-row " span={3}>
                              <div className="text-sm font-normal text-gray-700">Mã vạch (NCC)</div>
                            </Col>
                            <Col className="gutter-row " span={4}>
                              <div className="text-sm font-normal text-gray-700">Tên sản phẩm</div>
                            </Col>
                            <Col className="gutter-row " span={2}>
                              <div className="text-sm font-normal text-gray-700">ĐVT</div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                              <div className="text-sm font-normal text-gray-700">Đơn giá (VND)</div>
                            </Col>
                            <Col className="gutter-row" span={2}>
                              <div className="text-sm font-normal text-gray-700">Số lượng</div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                              <div className="text-sm font-normal text-gray-700">Thành tiền</div>
                            </Col>
                            <Col className="gutter-row" span={1}>
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
                            <Col className="gutter-row" span={2}>
                              <div className="text-sm font-normal text-gray-700">Số lượng</div>
                            </Col>
                            <Col className="gutter-row" span={5}>
                              <div className="text-sm font-normal text-gray-700">Thành tiền</div>
                            </Col>
                            <Col className="gutter-row text-center" span={1}>
                              <div></div>
                            </Col>
                          </Row>
                        )}

                        <hr />
                        {_renderCart()}
                      </table>
                    </div>

                    {filterTax === taxApply.APPLY ? (
                      <div className="flex justify-end mt-4 ">
                        <div className="grid grid-cols-2 ">
                          <div className="grid-cols-1">
                            <p className="font-bold sm:text-base text-sm text-teal-900 mr-11 leading-7">
                              Tổng tiền hàng:
                            </p>
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
                              {caculatePrice().voucherValuePercent > 0
                                ? '(' + caculatePrice().voucherValuePercent + '%)'
                                : null}
                            </p>
                            <p className="font-bold sm:text-base text-sm text-slate-700 sm:leading-7 leading-7 sm:mt-0  text-right ">
                              {caculatePrice().totalBill !== 'NaN'
                                ? formatCurrency(caculatePrice().totalBill ?? 0, ' VND')
                                : 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end mt-4 ">
                        <div className="grid grid-cols-2 ">
                          <div className="grid-cols-1">
                            <p className="font-bold sm:text-base text-sm text-teal-900 mr-11 leading-7">
                              Tổng tiền hàng:
                            </p>
                            <p className="font-bold sm:text-base text-sm text-teal-900 mr-11 leading-7">Chiết khấu:</p>
                            <p className="font-bold sm:text-base text-sm text-teal-900 mr-11 leading-7">Tổng tiền:</p>
                          </div>
                          <div className="mr-4">
                            <p className="font-bold sm:text-base text-sm text-slate-700 leading-7 text-right">
                              {' '}
                              {totalPrice !== 'NaN' ? formatCurrency(totalPrice, ' VND') : 0}{' '}
                            </p>

                            <p className="font-bold sm:text-base text-sm text-slate-700 sm:leading-7 leading-7 sm:mt-0  text-right ">
                              {' '}
                              {caculatePrice().discountNoTax !== 'NaN'
                                ? formatCurrency(caculatePrice().discountNoTax ?? 0, ' VND ')
                                : 0}
                              {caculatePrice().voucherValuePercentNoTax > 0
                                ? '(' + caculatePrice().voucherValuePercentNoTax + '%)'
                                : null}
                            </p>
                            <p className="font-bold sm:text-base text-sm text-slate-700 sm:leading-7 leading-7 sm:mt-0  text-right ">
                              {' '}
                              {caculatePrice().totalOrderNoTax !== 'NaN'
                                ? formatCurrency(caculatePrice().totalOrderNoTax ?? 0, ' VND')
                                : 0}{' '}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full flex justify-center mt-8 mb-44">
                    <div>
                      <img src={ImgCart} alt="" />
                      <h3 className="text-lg text-gray-300 font-normal text-center mt-6">Trống</h3>
                    </div>
                  </div>
                )}
                <div className=" flex sm:flex-row flex-col items-center  sm:justify-between mt-[53px]">
                  <button
                    onClick={() => {
                      window.history.back();
                    }}
                    className="px-8 bg-white-500 border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-xl text-teal-900 hover:text-teal-600 mt-1 sm:w-auto w-[60%] sm:mb-0 mb-2"
                    id="backBtn"
                  >
                    Trở về
                  </button>
                  {cart && cart?.length > 0 && (
                    <button
                      disabled={disabledBtn}
                      onClick={async () => {
                        form && form.submit();
                      }}
                      id="inputProductBtn"
                      className="bg-teal-900 h-[44px] text-white text-base py-2 px-7 rounded-[10px] hover:bg-teal-600 mt-1 sm:w-auto w-[60%] sm:mb-0 mb-2"
                    >
                      Đặt hàng
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Form>
        </Spin>
      </div>
      <div>
        <Modal
          title="Thông báo"
          centered
          okText="Đồng ý"
          open={visible}
          onOk={async () => {
            await CartService.deleteNotApproveProduct();
            await fetchListCart();
            setVisible(false);
          }}
          onCancel={() => setVisible(false)}
          width={800}
          wrapClassName={'modal-group-cart'}
        >
          <div>
            <h1 className="text-teal-900 text-4xl text-center mb-4 mt-4 font-medium">Thông báo</h1>
            <p className="text-center font-normal text-base pb-4 border-b border-gray-200 mb-6">
              Sản phẩm đang cập nhật thông tin.
              <br />
              Bạn có muốn xoá sản phẩm này khỏi giỏ hàng và tiếp tục đặt hàng không?
            </p>
            <h3 className="text-base mb-4 font-medium text-teal-900">Danh sách sản phẩm đang cập nhật</h3>

            <div>
              {cartFail && cartFail?.length > 0 && (
                <div>
                  <Row gutter={16} className="mb-3">
                    <Col className="gutter-row " span={10}>
                      <div className="text-sm font-normal text-gray-700">Tên sản phẩm</div>
                    </Col>
                    <Col className="gutter-row" span={5}>
                      <div className="text-sm font-normal text-gray-700">Giá bán (VND)</div>
                    </Col>
                    <Col className="gutter-row" span={4}>
                      <div className="text-sm font-normal text-gray-700">Số lượng</div>
                    </Col>
                    <Col className="gutter-row" span={5}>
                      <div className="text-sm font-normal text-gray-700">Tổng tiền (VND)</div>
                    </Col>
                  </Row>
                  <hr />
                  {cartFail?.map((item, index) => {
                    return (
                      <div key={index}>
                        <Row gutter={16} className="py-[10px] flex items-center">
                          <Col className="gutter-row " span={10}>
                            <div className="h-full grid grid-cols-product-name items-center gap-[10px] text-left">
                              <div className="block h-14 w-[70px] object-cover">
                                <img
                                  src={item?.product?.photos?.[0]?.url}
                                  alt={item?.name}
                                  className="object-cover h-full w-full block rounded-lg overflow-auto"
                                />
                              </div>
                              <div>
                                <a
                                  onClick={() =>
                                    navigate(`${routerLinks('InputProductDetail')}?id=${item?.product?.id}`)
                                  }
                                >
                                  <h5 className="name cursor-pointer text-sm text-blue-600 font-medium underline">
                                    {item?.product?.name}
                                  </h5>
                                </a>

                                <h5 className="font-normal text-xs text-gray-500"></h5>
                              </div>
                            </div>
                          </Col>
                          <Col className="gutter-row" span={5}>
                            <h5 className="text-sm font-normal text-gray-700"> {formatCurrency(item?.price, '')}</h5>
                          </Col>
                          <Col className="gutter-row" span={4}>
                            <h4 className="text-sm font-normal text-gray-700">{item?.quantity}</h4>
                          </Col>
                          <Col className="gutter-row " span={5}>
                            <h5 className="subtotal text-sm font-normal text-gray-700">
                              {formatCurrency(Number(item?.price) * Number(item?.quantity), ' ')}
                            </h5>
                          </Col>
                        </Row>
                        <hr />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </Fragment>
  );
}

export default Page;
