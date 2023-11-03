import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { Col, Modal, Row, Form, Input, Tooltip, DatePicker, Select as SelectAnt } from 'antd';
import moment from 'moment';
import unorm from 'unorm';

import { exportSvg } from 'utils/exportSvg';
import { taxApply } from 'constants/index';
import { formatCurrency, routerLinks } from 'utils';
import { VoucherService } from 'services/voucher';
import { Message, Select, Spin } from 'components';
import { isNullOrUndefinedOrEmpty } from 'utils/fucntion';
import { CartService } from 'services/cart';
import { useCart } from 'cartContext';
import { SaleService } from 'services/sales';

import './index.less';
import ImgCart from '../../../assets/images/imgcart.png';
import { CloseButton, Close, AddressIcon, Gps } from '../../../assets/svg/index';

const { Search } = Input;
export const blockInvalidChar = (e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
// const onInput = (event) => {
//   event.target.value = event.target.value.replace(/[^0-9+]/g, '');
// };

function Page() {
  const location = useLocation();
  const [form] = Form.useForm();
  const [customerForm] = Form.useForm();
  const [isDesktop, set_isDesktop] = useState(window.innerWidth > 767);
  const [codeList, setCodeList] = useState([])
  const [nameList, setNameList] = useState([])
  const [phoneList, setPhoneList] = useState('')
  const [customer, setCustomer] = useState({})
  const [customers, setCustomers] = useState({})
  const [addresDetail, setAddressDetail] = useState('')

  useEffect(async() => {
    set_isDesktop(window.innerWidth > 640);
  }, []);
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  const {
    dataCart,
    cart,
    deleteCartItem,
    toggleAmount,
    fetchListCart,
    setDiscount,
    discount,
    isLoading,
  } = useCart();
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [visible, setVisible] = useState(false);
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
  useEffect(async () => {
    const res = await CartService.getListCart();
    for (let i = 0; i < res.data.cartLineItem?.length; i++) {
      const item = res?.data?.cartLineItem[i];
      res['quantity' + item.productId] = res?.data?.cartLineItem[i].quantity;
    }
    form.setFieldsValue(res);
  }, [pageType]);

  const _renderCart = () => {
    return (
      cart &&
      cart?.map((item, index) => {
        return (
          <div key={index}>
            <Row gutter={16} className="py-3 flex items-center">
              <Col className="gutter-row" span={3}>
                <h5 className="text-sm font-normal text-gray-700 break-all border rounded p-1">
                  {item?.product?.code || ''}
                </h5>
              </Col>
              <Col className="gutter-row " span={filterTax === 'APPLY' ? 5 : 6}>
                <div className="h-full items-center gap-0">
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
              <Col className="gutter-row" span={filterTax === 'APPLY' ? 2 : 3}>
                <h5 className="text-sm font-normal text-gray-700 break-all text-right">{item?.product?.basicUnit}</h5>
              </Col>
              <Col className="gutter-row" span={2}>
                <h5 className="text-sm font-normal text-gray-700 text-right">{'1kg/1 gói'}</h5>
              </Col>
              <Col className="gutter-row" span={3}>
                <h5 className="text-sm font-normal text-gray-700 text-right">
                  {formatCurrency(Number(item?.price)) || ''}
                </h5>
              </Col>
              <Col className="gutter-row" span={filterTax === 'APPLY' ? 2 : 3}>
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
                    className="w-[70px] h-[40px] text-right font-[4px] py-2 !bg-white rounded-[10px] border border-gray-200 focus:!shadow-none focus:!border-gray-200 disabled:!bg-white !ml-auto block custom-input"
                    placeholder="Nhập số lượng"
                    defaultValue={item?.quantity}
                    type="number"
                    maxLength={5}
                    onKeyDown={blockInvalidChar}
                    onChange={(e) => {
                      toggleAmount({
                        id: item?.productId,
                        value: 'update',
                        updateAmount: Number.parseFloat(e.target.value).toFixed(2),
                        voucher: voucherText,
                      });
                    }}
                    onPressEnter={(e) => {
                      e.key === 'Enter' && e.preventDefault();
                    }}
                    min={1}
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row " span={filterTax === 'APPLY' ? 2 : 3}>
                <h5 className="subtotal break-all text-right">
                  {' '}
                  {+item.quantity > 0 && +item.quantity >= item?.product?.productPrice?.at(-1)?.minQuantity
                    ? formatCurrency(Number(item?.price) * Number(item?.quantity), ' ')
                    : 0}
                </h5>
              </Col>
              {filterTax === taxApply.APPLY ? (
                <Col className="gutter-row !pr-0" span={1}>
                  <h5 className="subtotal text-right"> {item?.product?.importTax?.taxRate}%</h5>
                </Col>
              ) : null}
              {filterTax === taxApply.APPLY ? (
                <Col className="gutter-row " span={3}>
                  <h5 className="subtotal break-all text-right">
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
                  <i className="las la-trash-alt text-red-600 text-2xl text-right"></i>
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
    const res = await CartService.postOrder(cart, discount?.uuid, isApplyTax, customer?.id);
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
      //   setCartFail(res?.data);
    }
    setDisabledBtn(false);
    return true;
  };

  const onAddnewCustomer = async (values) => {
    setDisabledBtn(true);

    const res = await SaleService.addNewCustomer(values);
    if (res?.data !== null && res?.statusCode === 200) {
      setDisabledBtn(false);
      setVisible(false);
      await fetchListCart();
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
                    <Col span={isDesktop ? 16 : 24} className="pr-3 mb-4">
                      <Col className="flex items-center mb-1" span={24}>
                        <Col span={5}>
                          <div className="relative text-stone-900">
                            Mã KH <span className="text-red-500">*</span>{' '}
                            <span className="absolute right-1 font-bold">:</span>
                          </div>
                        </Col>
                        <Col span={isDesktop ? 15 : 12}>
                          <Form.Item
                            name={'customerCode'}
                            style={{
                              margin: 0,
                            }}
                            rules={[
                              () => ({
                                validator() {
                                  if (!customer.code) {
                                    return Promise.reject(new Error('Mã khách hàng là bắt buộc'));
                                  }
                                  return Promise.resolve();
                                },
                              })
                            ]}
                          >
                            <SelectAnt
                              className='custom-select'
                              showSearch={true}
                              options={codeList}
                              value={customer?.code || ''}
                              onSearch={async (e) => {
                                if(e){
                                const res = await SaleService.searchCustomerInfo({ type: 'code', value: e })
                                if(res.data?.length > 0){
                                const list = []
                                  for(let i=0; i<res.data?.length; i++){
                                    const item = { label: res.data[i]?.code, value: res.data[i]?.code }
                                    list.push(item)
                                  }
                                  setCodeList(list)
                                  setCustomers(res.data)
                                }else{
                                  setCodeList([])
                                  setCustomers([])
                                }
                                }
                              }}
                              onChange={e=>{
                                const customer = customers?.filter(item => item?.code === e)[0]
                                setCustomer(customer)
                                customerForm.setFieldsValue({ customerCode: e })
                              }}
                            >
                            </SelectAnt>
                            <svg
                              width="19"
                              height="19"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="absolute top-[6px] right-[10px] text-gray-700"
                            >
                              <path
                                d="M5.25 0.5C2.631 0.5 0.5 2.631 0.5 5.25C0.5 7.869 2.631 10 5.25 10C6.37977 10 7.41713 9.60163 8.2334 8.94043L12.8135 13.5205L13.5205 12.8135L8.94043 8.2334C9.60163 7.41713 10 6.37977 10 5.25C10 2.631 7.869 0.5 5.25 0.5ZM5.25 1.5C7.318 1.5 9 3.182 9 5.25C9 7.318 7.318 9 5.25 9C3.182 9 1.5 7.318 1.5 5.25C1.5 3.182 3.182 1.5 5.25 1.5Z"
                                fill="#9CA3AF"
                              />
                            </svg>
                          </Form.Item>
                        </Col>
                        <Col className="ml-auto" span={isDesktop ? 4 : 6}>
                          <div className="sm:ml-2 mt-0 sm:mt-0">
                            <button
                              type="button"
                              onClick={async () => {
                                setVisible(true);
                              }}
                              id="saveBtn"
                              className="w-[100%] h-[34px] hover:bg-teal-700 bg-teal-900 text-white text-sm rounded-[10px] flex justify-center mt[16px] items-center gap-[10px]"
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
                              <span>Thêm mới</span>
                            </button>
                          </div>
                        </Col>
                      </Col>
                      <Col className="flex items-center mb-1" span={24}>
                        <Col span={5}>
                          <div className="relative text-stone-900">
                            Tên NPP <span className="text-red-500">*</span>
                            <span className="absolute right-1 font-bold">:</span>
                          </div>
                        </Col>
                        <Col span={19}>
                          <Form.Item
                            name={'distributorName'}
                            style={{
                              margin: 0,
                            }}
                            rules={[
                              () => ({
                                validator() {
                                  if (!customer.name) {
                                    return Promise.reject(new Error('Tên NPP là bắt buộc'));
                                  }
                                  return Promise.resolve();
                                },
                              })
                            ]}
                          >
                            <SelectAnt
                            className='custom-select'
                              showSearch={true}
                              options={nameList}
                              value={customer?.name || ''}
                              onSearch={async (e) => {
                                if(e){
                                const res = await SaleService.searchCustomerInfo({ type: 'name', value: e })
                                if(res.data.length > 0){
                                const list = []
                                  for(let i=0; i<res.data.length; i++){
                                    const item = { label: res.data[i]?.name, value: res.data[i]?.name }
                                    list.push(item)
                                  }
                                  setNameList(list)
                                  setCustomers(res.data)
                                }else{
                                  setNameList([])
                                  setCustomers([])
                                }
                                }
                              }}
                              onChange={e=>{
                                console.log(e)
                                const customer = customers?.filter(item => item?.name === e)[0]
                                setCustomer(customer)
                              }}
                            >
                            </SelectAnt>
                            <svg
                              width="19"
                              height="19"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="absolute top-[6px] right-[10px] text-gray-700"
                            >
                              <path
                                d="M5.25 0.5C2.631 0.5 0.5 2.631 0.5 5.25C0.5 7.869 2.631 10 5.25 10C6.37977 10 7.41713 9.60163 8.2334 8.94043L12.8135 13.5205L13.5205 12.8135L8.94043 8.2334C9.60163 7.41713 10 6.37977 10 5.25C10 2.631 7.869 0.5 5.25 0.5ZM5.25 1.5C7.318 1.5 9 3.182 9 5.25C9 7.318 7.318 9 5.25 9C3.182 9 1.5 7.318 1.5 5.25C1.5 3.182 3.182 1.5 5.25 1.5Z"
                                fill="#9CA3AF"
                              />
                            </svg>
                          </Form.Item>
                        </Col>
                      </Col>
                      <Col className="flex items-center mb-1" span={24}>
                        <Col span={5}>
                          <div className="relative text-stone-900">
                            Số ĐT <span className="text-red-500">*</span>
                            <span className="absolute right-1 font-bold">:</span>
                          </div>
                        </Col>
                        <Col span={19}>
                          <Form.Item
                            name={'phone'}
                            style={{
                              margin: 0,
                            }}
                            rules={[
                              () => ({
                                validator() {
                                  if (!customer.phone) {
                                    return Promise.reject(new Error('Số ĐT là bắt buộc'));
                                  }
                                  return Promise.resolve();
                                },
                              })
                            ]}
                          >
                            <SelectAnt
                              className='custom-select'
                              showSearch={true}
                              options={phoneList}
                              value={customer?.phone || ''}
                              onSearch={async (e) => {
                                if(e){
                                const res = await SaleService.searchCustomerInfo({ type: 'phone', value: e })
                                if(res.data.length > 0){
                                const list = []
                                  for(let i=0; i<res.data.length; i++){
                                    const item = { label: res.data[i]?.phone, value: res.data[i]?.phone }
                                    list.push(item)
                                  }
                                  setPhoneList(list)
                                  setCustomers(res.data)
                                }else{
                                  setPhoneList([])
                                  setCustomers([])
                                }
                                }
                              }}
                              onChange={e=>{
                                const customer = customers?.filter(item => item?.phone === e)[0]
                                setCustomer(customer)
                              }}
                            >
                            </SelectAnt>
                            <svg
                              width="19"
                              height="19"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="absolute top-[6px] right-[10px] text-gray-700"
                            >
                              <path
                                d="M5.25 0.5C2.631 0.5 0.5 2.631 0.5 5.25C0.5 7.869 2.631 10 5.25 10C6.37977 10 7.41713 9.60163 8.2334 8.94043L12.8135 13.5205L13.5205 12.8135L8.94043 8.2334C9.60163 7.41713 10 6.37977 10 5.25C10 2.631 7.869 0.5 5.25 0.5ZM5.25 1.5C7.318 1.5 9 3.182 9 5.25C9 7.318 7.318 9 5.25 9C3.182 9 1.5 7.318 1.5 5.25C1.5 3.182 3.182 1.5 5.25 1.5Z"
                                fill="#9CA3AF"
                              />
                            </svg>
                          </Form.Item>
                        </Col>
                      </Col>
                      <Col className="flex items-center mb-1" span={24}>
                        <Col span={5}>
                          <div className="relative text-stone-900">
                            Địa chỉ <span className="absolute right-1 font-bold">:</span>
                          </div>
                        </Col>
                        <Col span={19}>
                          <Form.Item
                            name={'address'}
                            style={{
                              margin: 0,
                            }}
                          >
                            <div className="w-[95%] h-[34px] text-left font-[4px] py-2 !bg-white rounded-[4px] focus:!shadow-none disabled:!bg-white px-2 whitespace-nowrap overflow-hidden text-ellipsis">{customer?.address || ''}</div>
                            <Input
                              disabled={true}
                              placeholder="Nhập địa chỉ"
                              type="hidden"
                              maxLength={5}
                              onKeyDown={blockInvalidChar}
                              onChange={(e) => {}}
                              min={1}
                            />
                            <span onClick={()=>{
                              if(customer){
                                  setAddressDetail(customer?.address)
                                }
                            }} className="absolute right-[-4px] top-[10px] text-red-500 cursor-pointer w-[30px] h-[30px]">
                              <img src={AddressIcon} alt="" />
                            </span>
                          </Form.Item>
                        </Col>
                      </Col>
                      <Col className="sm:flex items-center mb-1" span={24}>
                        <Col span={isDesktop ? 5 : 24}>
                          <div className="relative text-stone-900">
                            Địa chỉ giao hàng <span className="text-red-500">*</span>
                            <span className="absolute right-1 font-bold hidden sm:inline-block">:</span>
                          </div>
                        </Col>
                        <Col span={isDesktop ? 19 : 24}>
                          <Form.Item
                            name={'addressDetail'}
                            style={{
                              margin: 0,
                            }}
                            rules={[
                              () => ({
                                validator() {
                                  if (!addresDetail) {
                                    return Promise.reject(new Error('Địa chỉ giao hàng là bắt buộc'));
                                  }
                                  return Promise.resolve();
                                },
                              })
                            ]}
                          >
                            <Input
                              disabled={isLoading}
                              className="w-[100%] h-[34px] text-left font-[4px] pl-2 pr-10 !bg-white rounded-[4px] border border-gray-200 focus:!shadow-none focus:!border-gray-200 disabled:!bg-white px-2 custom-input"
                              placeholder="Nhập địa chỉ giao hàng"
                              type="text"
                              onChange={e=>{
                                setAddressDetail(e.target.value)
                              }}      
                              min={1}
                              value={addresDetail || ''}
                            />
                            <span
                              onClick={() => {
                                setAddressDetail('')
                              }}
                              className="absolute right-[-4px] top-[10px] text-red-500 cursor-pointer w-[30px] h-[30px]"
                            >
                              <img src={CloseButton} alt="" />
                            </span>
                          </Form.Item>
                        </Col>
                      </Col>
                    </Col>
                    <Col span={isDesktop ? 8 : 24}>
                      <Col className="flex sm:justify-end" span={24}>
                        <Form.Item name="endDate" label="Ngày đặt hàng">
                          <DatePicker
                            onChange={(date, dateString) => {
                              // if (!date) {
                              // setFilterDate((prev) => ({ ...prev, dateTo: moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59' }))
                              //   setShowValidateFilter(false);
                              //   return;
                              // }
                              // if (new Date(filterDate.dateFrom) > new Date(reFormatDateString(dateString))) {
                              //   setShowValidateFilter(true);
                              //   return;
                              // } else {
                              //   setShowValidateFilter(false);
                              // }
                              // setFilterDate((prev) => ({ ...prev, dateTo: moment(date).format('YYYY-MM-DD') + ' 23:59:59' }));
                            }}
                            format="DD/MM/YYYY"
                            defaultValue={moment()}
                            //   disabledDate={(current) => {
                            //     return current && current.valueOf() > Date.now();
                            //   }}
                            className={'sm:ml-0 !bg-white !rounded-md !h-[34px] sm:w-[152px]'}
                            size={'middle'}
                          />
                        </Form.Item>
                      </Col>
                      <Col className="flex sm:justify-end" span={24}>
                        <Form.Item name="endDate" label="Ngày giao hàng">
                          <DatePicker
                            onChange={(date, dateString) => {
                              // if (!date) {
                              // setFilterDate((prev) => ({ ...prev, dateTo: moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59' }))
                              //   setShowValidateFilter(false);
                              //   return;
                              // }
                              // if (new Date(filterDate.dateFrom) > new Date(reFormatDateString(dateString))) {
                              //   setShowValidateFilter(true);
                              //   return;
                              // } else {
                              //   setShowValidateFilter(false);
                              // }
                              // setFilterDate((prev) => ({ ...prev, dateTo: moment(date).format('YYYY-MM-DD') + ' 23:59:59' }));
                            }}
                            format="DD/MM/YYYY"
                            defaultValue={moment()}
                            //   disabledDate={(current) => {
                            //     return current && current.valueOf() > Date.now();
                            //   }}
                            className={'sm:ml-0 !bg-white !rounded-md !h-[34px] sm:w-[152px]'}
                            size={'middle'}
                          />
                        </Form.Item>
                      </Col>
                    </Col>
                    <Col span={14} className="">
                      <div className="flex mb-4">
                        <span className="font-medium text-base text-black mt-[8px] mr-6">Voucher:</span>
                        <div className="sm:flex w-max">
                          <div className="search-container voucherSalesText sm:w-[350px] w-[200px]">
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
                          <div className="sm:ml-2 mt-3 sm:mt-0">
                            <button
                              disabled={disabledBtn}
                              onClick={async (e) => {
                                handleCheckVoucher(voucherText, e);
                              }}
                              id="inputProductBtn"
                              className="bg-teal-900 h-[34px] text-white py-2 px-7 rounded-[10px] hover:bg-teal-600 w-auto sm:mb-0 mb-2"
                            >
                              Áp dụng
                            </button>
                          </div>
                        </div>
                      </div>
                    </Col>
                    {discount?.description ? (
                      <Col span={10} className="lg:pl-3 xl:pl-5">
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
                              <div className="text-sm font-normal text-gray-700">Mã sản phẩm</div>
                            </Col>
                            <Col className="gutter-row " span={filterTax === 'APPLY' ? 5 : 6}>
                              <div className="text-sm font-normal text-gray-700">Tên sản phẩm</div>
                            </Col>
                            <Col className="gutter-row " span={filterTax === 'APPLY' ? 2 : 3}>
                              <div className="text-sm font-normal text-gray-700 text-right">Đơn vị</div>
                            </Col>
                            <Col className="gutter-row " span={2}>
                              <div className="text-sm font-normal text-gray-700 text-right">Quy cách</div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                              <div className="text-sm font-normal text-gray-700 text-right">Đơn giá (VND)</div>
                            </Col>
                            <Col className="gutter-row" span={filterTax === 'APPLY' ? 2 : 3}>
                              <div className="text-sm font-normal text-gray-700 text-right">Số lượng</div>
                            </Col>
                            <Col className="gutter-row" span={filterTax === 'APPLY' ? 2 : 3}>
                              <div className="text-sm font-normal text-gray-700 text-right">Thành tiền</div>
                            </Col>
                            <Col className="gutter-row" span={1}>
                              <div className="text-sm font-normal text-gray-700 text-right">Thuế</div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                              <div className="text-sm font-normal text-gray-700 text-right">Tiền sau thuế</div>
                            </Col>
                            <Col className="gutter-row text-center" span={1}>
                              <div></div>
                            </Col>
                          </Row>
                        ) : (
                          <Row gutter={16} className="mb-3 tableListProduct">
                            <Col className="gutter-row " span={3}>
                              <div className="text-sm font-normal text-gray-700">Mã sản phẩm</div>
                            </Col>
                            <Col className="gutter-row " span={filterTax === 'APPLY' ? 5 : 6}>
                              <div className="text-sm font-normal text-gray-700">Tên sản phẩm</div>
                            </Col>
                            <Col className="gutter-row " span={filterTax === 'APPLY' ? 2 : 3}>
                              <div className="text-sm font-normal text-gray-700 text-right">Đơn vị</div>
                            </Col>
                            <Col className="gutter-row " span={2}>
                              <div className="text-sm font-normal text-gray-700 text-right">Quy cách</div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                              <div className="text-sm font-normal text-gray-700 text-right">Đơn giá (VND)</div>
                            </Col>
                            <Col className="gutter-row" span={filterTax === 'APPLY' ? 2 : 3}>
                              <div className="text-sm font-normal text-gray-700 text-right">Số lượng</div>
                            </Col>
                            <Col className="gutter-row" span={filterTax === 'APPLY' ? 2 : 3}>
                              <div className="text-sm font-normal text-gray-700 text-right">Thành tiền</div>
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
          title="Thêm mới khách hàng"
          centered
          okText="Thêm"
          visible={visible}
          onOk={async () => {
            customerForm && customerForm.submit();
            // await CartService.deleteNotApproveProduct();
            // await fetchListCart();
            // setVisible(false);
          }}
          onCancel={() => setVisible(false)}
          width={660}
          cancelText="Hủy"
          wrapClassName={'modal-group-sales-cart'}
        >
          <div className="px-4 relative">
            <h1 className="text-[22px] sm:text-3xl text-left mb-6 mt-2 font-bold">Thêm mới khách hàng</h1>
            <div onClick={() => setVisible(false)} className="absolute right-0 top-0 w-[32px] h-[32px] cursor-pointer">
              <img src={Close} alt="" />
            </div>
            <Form form={customerForm} component={false} onFinish={onAddnewCustomer}>
              <Col className="sm:flex sm:justify-between mb-4" span={24}>
                <Col className="mb-4 sm:mb-0" span={isDesktop ? 6 : 24}>
                  <p className="text-[16px] sm:mb-2">Mã KH:</p>
                  <Form.Item
                    name={'code'}
                    style={{
                      margin: 0,
                    }}
                  >
                    <Input
                      disabled={isLoading}
                      className="w-[100%] h-[44px] text-left font-[4px] py-2 !bg-white rounded-[4px] border border-gray-200 focus:!shadow-none focus:!border-gray-200 disabled:!bg-white px-2"
                      placeholder="Nhập mã"
                      defaultValue={''}
                      type="text"
                      maxLength={20}
                      onKeyDown={blockInvalidChar}
                      onChange={(e) => {}}
                      onPressEnter={(e) => {
                        e.key === 'Enter' && e.preventDefault();
                      }}
                      min={1}
                    />
                  </Form.Item>
                </Col>
                <Col span={isDesktop ? 17 : 24}>
                  <p className="text-[16px] sm:mb-2">
                    Tên NPP: <span className="text-red-500">*</span>
                  </p>
                  <Form.Item
                    name={'name'}
                    style={{
                      margin: 0,
                    }}
                    rules={[
                      {
                        required: true,
                        message: `Tên NPP là bắt buộc`,
                      },
                    ]}
                  >
                    <Input
                      disabled={isLoading}
                      className="w-[100%] h-[44px] text-left font-[4px] py-2 !bg-white rounded-[4px] border border-gray-200 focus:!shadow-none focus:!border-gray-200 disabled:!bg-white px-2"
                      placeholder="Nhập tên"
                      defaultValue={''}
                      type="text"
                      maxLength={50}
                      // onKeyDown={blockInvalidChar}
                      onChange={(e) => {}}
                      onPressEnter={(e) => {
                        e.key === 'Enter' && e.preventDefault();
                      }}
                      min={1}
                    />
                  </Form.Item>
                </Col>
              </Col>
              <Col className="sm:flex sm:justify-between mb-4" span={24}>
                <Col className="mb-4 sm:mb-0" span={isDesktop ? 6 : 24}>
                  <p className="text-[16px] sm:mb-2">
                    Số ĐT:<span className="text-red-500">*</span>
                  </p>
                  <Form.Item
                    name={'phone'}
                    style={{
                      margin: 0,
                    }}
                    rules={[
                      {
                        required: true,
                        message: `Số ĐT là bắt buộc`,
                      },
                    ]}
                  >
                    <Input
                      disabled={isLoading}
                      className="w-[100%] h-[44px] text-left font-[4px] py-2 !bg-white rounded-[4px] border border-gray-200 focus:!shadow-none focus:!border-gray-200 disabled:!bg-white px-2"
                      placeholder="Nhập số ĐT"
                      defaultValue={''}
                      type="text"
                      maxLength={15}
                      onKeyDown={blockInvalidChar}
                      onChange={(e) => {}}
                      onPressEnter={(e) => {
                        e.key === 'Enter' && e.preventDefault();
                      }}
                      min={1}
                    />
                  </Form.Item>
                </Col>
                <Col className="mb-4 sm:mb-0" span={isDesktop ? 9 : 24}>
                  <p className="text-[16px] sm:mb-2">Email:</p>
                  <Form.Item
                    name={'email'}
                    style={{
                      margin: 0,
                    }}
                  >
                    <Input
                      disabled={isLoading}
                      className="w-[100%] h-[44px] text-left font-[4px] py-2 !bg-white rounded-[4px] border border-gray-200 focus:!shadow-none focus:!border-gray-200 disabled:!bg-white px-2"
                      placeholder=""
                      defaultValue={''}
                      type="text"
                      maxLength={50}
                      // onKeyDown={blockInvalidChar}
                      onChange={(e) => {}}
                      onPressEnter={(e) => {
                        e.key === 'Enter' && e.preventDefault();
                      }}
                      min={1}
                    />
                  </Form.Item>
                </Col>
                <Col span={isDesktop ? 7 : 24}>
                  <p className="text-[16px] sm:mb-2">Mã số thuế:</p>
                  <Form.Item
                    name={'mst'}
                    style={{
                      margin: 0,
                    }}
                  >
                    <Input
                      disabled={isLoading}
                      className="w-[100%] h-[44px] text-left font-[4px] py-2 !bg-white rounded-[4px] border border-gray-200 focus:!shadow-none focus:!border-gray-200 disabled:!bg-white px-2"
                      placeholder="Nhập MST"
                      defaultValue={''}
                      type="text"
                      maxLength={20}
                      onKeyDown={blockInvalidChar}
                      onChange={(e) => {}}
                      onPressEnter={(e) => {
                        e.key === 'Enter' && e.preventDefault();
                      }}
                      min={1}
                    />
                  </Form.Item>
                </Col>
              </Col>
              <Col className="mb-4" span={24}>
                <p className="text-[16px] sm:mb-2">
                  Địa chỉ: <span className="text-red-500">*</span>
                </p>
                <Form.Item
                  name={'address'}
                  style={{
                    margin: 0,
                  }}
                  rules={[
                    {
                      required: true,
                      message: `Địa chỉ là bắt buộc`,
                    },
                  ]}
                >
                  <Input
                    disabled={isLoading}
                    className="w-[100%] h-[44px] text-left font-[4px] py-2 !bg-white rounded-[4px] border border-gray-200 focus:!shadow-none focus:!border-gray-200 disabled:!bg-white px-2"
                    placeholder="Nhập địa chỉ"
                    defaultValue={''}
                    type="text"
                    onChange={(e) => {}}
                    onPressEnter={(e) => {
                      e.key === 'Enter' && e.preventDefault();
                    }}
                    min={1}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <p className="text-[16px] sm:mb-2">Định vị:</p>
                <Form.Item
                  name={'latitude'}
                  style={{
                    margin: 0,
                  }}
                >
                  <Input
                    disabled={isLoading}
                    className="w-[100%] h-[44px] text-left font-[4px] py-2 !bg-white rounded-[4px] border border-gray-200 focus:!shadow-none focus:!border-gray-200 disabled:!bg-white px-2"
                    placeholder="Chọn định vị"
                    defaultValue={'0.0.0.1'}
                    value={'0.0.0.1'}
                    type="text"
                    // maxLength={}
                    onKeyDown={blockInvalidChar}
                    onChange={(e) => {}}
                    onPressEnter={(e) => {
                      e.key === 'Enter' && e.preventDefault();
                    }}
                    min={1}
                  />
                  <span className="absolute right-[-4px] top-[10px] text-red-500 cursor-pointer w-[30px] h-[30px]">
                    <img src={Gps} alt="" />
                  </span>
                </Form.Item>
              </Col>
              <Col span={24}>
                <p className="text-[16px] sm:mb-2">Định vị:</p>
                <Form.Item
                  name={'longitude'}
                  style={{
                    margin: 0,
                  }}
                >
                  <Input
                    disabled={isLoading}
                    className="w-[100%] h-[44px] text-left font-[4px] py-2 !bg-white rounded-[4px] border border-gray-200 focus:!shadow-none focus:!border-gray-200 disabled:!bg-white px-2"
                    placeholder="Chọn định vị"
                    defaultValue={'0.0.0.1'}
                    type="hidden"
                    value={'0.0.0.1'}
                    // maxLength={5}
                    onKeyDown={blockInvalidChar}
                    onChange={(e) => {}}
                    onPressEnter={(e) => {
                      e.key === 'Enter' && e.preventDefault();
                    }}
                    min={1}
                  />
                </Form.Item>
              </Col>
            </Form>
          </div>
        </Modal>
      </div>
    </Fragment>
  );
}

export default Page;
