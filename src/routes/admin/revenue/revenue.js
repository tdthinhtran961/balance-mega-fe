import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';
import { formatCurrency, routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { SupplierService } from 'services/supplier';
import { useAuth } from 'global';
import { Spin, Select as SelectComp } from 'components';
import { exportSvg } from 'utils/exportSvg';

const Page = () => {
  const location = useLocation();
  // const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const widthOutput = window.innerWidth - 60;
  const { user } = useAuth();
  const urlSearch = new URLSearchParams(location.search);
  const idOrder = urlSearch.get('id');
  const idSupplier = urlSearch.get('idSupplier');
  const roleCode = user?.userInfor?.roleCode;
  const [filterTax, setFilterTax] = useState();
  // const subOrgId = user?.userInfor?.subOrgId;
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchDetailOrder = async () => {
      if (idOrder) {
        const data = await SupplierService.getDetailGoodsById(idOrder);
        setData(data?.data);
        setFilterTax(data?.data?.isApplyTax);
      }
    };
    fetchDetailOrder();
  }, [idOrder]);
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
    data?.orderLineItem &&
    data?.orderLineItem.reduce((a, c) => {
      return a + +c.price * +c.totalReceived;
    }, 0);
  const totalTaxPrice =
    data?.orderLineItem &&
    data?.orderLineItem.reduce((a, c) => {
      return a + (+c.price * +c.totalReceived * +c.tax) / 100;
    }, 0);

  const totalPriceAfterTax =
    data?.orderLineItem &&
    data?.orderLineItem.reduce((a, c) => {
      return a + +c.price * +c.totalReceived * (+c.tax / 100 + 1);
    }, 0);

  const caculatePrice = useCallback(() => {
    const valueVoucher = Number(data?.voucher?.voucherValue ?? 0);
    const voucherType = data?.voucher?.voucherType;
    const conditionApplyAmount = Number(data?.voucher?.conditionApplyAmount ?? 0);
    const totalOrder = Number(data?.total ?? 0) + Number(data?.voucherAmount ?? 0);
    const totalReceived = Number(data?.totalReceived ?? 0);
    const totalTax = Number(data?.totalTax ?? 0);
    const totalAfterTax = totalReceived + totalTax;

    let totalAll = 0;
    let discount = 0;
    let discountPercent = '';
    switch (voucherType) {
      case 'PERCENT':
        if (totalAfterTax < conditionApplyAmount) {
          discount = 0;
          totalAll = totalAfterTax;
          discountPercent = null;
        } else {
          discount = totalAfterTax * (valueVoucher / 100);
          totalAll = totalAfterTax - discount;
          discountPercent = '(' + valueVoucher + '%)';
        }
        break;
      case 'CASH':
        if (totalAfterTax < conditionApplyAmount) {
          discount = 0;
          totalAll = totalAfterTax;
          discountPercent = null;
        } else {
          discount = valueVoucher;
          totalAll = totalAfterTax - discount;
          discountPercent = '(' + ((valueVoucher / totalAfterTax) * 100).toFixed(2) + '%)';
        }
        break;
      default:
        totalAll = totalAfterTax - discount;
        break;
    }
    discountPercent = data?.voucher === null ? null : discountPercent;
    return {
      conditionApplyAmount,
      totalOrder,
      totalReceived,
      totalTax,
      totalAfterTax,
      discountPercent,
      discount,
      totalAll,
    };
  }, [data]);
  const addDescription = (description) => {
    return description ? (
      <div className="flex gap-3 ml-4">
        {exportSvg('PROMOTION')}
        <span className="text-green-600 w-fit">{description}</span>
      </div>
    ) : null;
  };
  const convertText = (value) => {
    if (!value) {
      return '';
    }
    return value;
  };
  if (!data?.id) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="sm:text-2xl text-xl text-teal-900">Quản lý đơn hàng</p>
        <div className="bg-white w-full px-4 rounded-xl mt-5 relative pb-5">
          <div className="flex flex-row items-center">
            <p className="sm:text-xl text-base font-bold text-teal-900 py-4 mr-5">Thông tin đơn hàng</p>
            {data?.status === 'WAITING_APPROVED' ? (
              <p className="text-[16px] text-yellow-400 py-4 flex flex-row items-center">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Chờ xác nhận</span>
              </p>
            ) : data?.status === 'WAITING_PICKUP' &&
              (user?.userInfor?.roleCode === 'OWNER_STORE') ? (
              <p className="text-[16px] text-[#F97316] py-4 flex flex-row items-center">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Chờ lấy hàng</span>
              </p>
            ) : data?.status === 'WAITING_PICKUP' && (user?.userInfor?.roleCode === 'OWNER_SUPPLIER' || user?.userInfor?.roleCode === 'DISTRIBUTOR') ? (
              <p className="text-[16px] text-[#F97316] py-4 flex flex-row items-center">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Chờ vận chuyển</span>
              </p>
            ) : data?.status === 'WAITING_PICKUP' && user?.userInfor?.roleCode === 'ADMIN' ? (
              <p className="text-[16px] text-[#F97316] py-4 flex flex-row items-center">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Chờ vận chuyển</span>
              </p>
            ) : data?.status === 'DELIVERY' ? (
              <p className="text-[16px] text-[#3B82F6] py-4 flex flex-row items-center">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Đang giao</span>
              </p>
            ) : data?.status === 'DELIVERED' ? (
              <p className="text-[16px] text-[#16A34A] py-4 flex flex-row items-center">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Đã giao</span>
              </p>
            ) : data?.status === 'CANCELLED' ? (
              <p className="text-l text-[#EF4444] py-4 flex flex-row items-center">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Đã hủy</span>
              </p>
            ) : (
              ''
            )}
          </div>
          {user?.userInfor?.roleCode === 'OWNER_SUPPLIER' || user?.userInfor?.roleCode === 'ADMIN' || 
            user?.userInfor?.roleCode === 'DISTRIBUTOR'
          ? (
            <>
              <div className="w-full lg:flex lg:flex-row text-[16px]">
                <div className="w-full">
                  <div className="w-full sm:flex flex-row mb-5">
                    <div className="font-bold text-black lg:w-[150px] w-[200px]">Mã đơn hàng:</div>
                    <div className="mt-4 sm:mt-0">{data.code}</div>
                  </div>
                  <div className="w-full sm:flex flex-row mb-5">
                    <div className="font-bold text-black lg:w-[150px] w-[200px]">Tên cửa hàng:</div>
                    <div className="mt-4 sm:mt-0">{data?.store?.name}</div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full sm:flex flex-row mb-5">
                    <div className="font-bold text-black w-[200px]  ">Thời gian đặt hàng:</div>
                    <div className="sm:mt-0 mt-4 ">{formatTime(data?.createdAt)}</div>
                  </div>
                  <div className="w-full sm:flex flex-row mb-5">
                    <div className="font-bold text-black w-[200px]">Số điện thoại:</div>
                    <div className="mt-4 sm:mt-0">{data?.storeAdmin?.phoneNumber}</div>
                  </div>
                </div>
              </div>
              <div className="lg:flex ">
                <div className="w-full sm:flex flex-row text-[16px]">
                  {/* <div className="w-full flex mb-5"> */}
                  <div className="font-bold text-black lg:w-[150px] w-[200px]">Ngày nhận hàng:</div>
                  <div className="mt-4 sm:mt-0">{formatTime(data?.deliveredAt, false)}</div>
                  {/* </div> */}
                </div>
                <div className="w-full sm:flex flex-row mb-5 text-[16px] lg:mt-0 mt-4">
                  <div className="font-bold text-black w-[200px] flex-none">Địa chỉ giao hàng:</div>
                  {/* <div>{data?.store?.address?.street + ', ' + data?.store?.address?.district + ', ' + data?.store?.address?.city + ', ' + data?.store?.address?.country}</div> */}
                  <div className="sm:mt-0 mt-4">{data?.addressConvert}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-full flex flex-col text-[16px]">
                <div className="w-full">
                  <div className="w-full flex flex-row mb-5">
                    <div className="font-bold text-black order">Mã đơn hàng:</div>
                    <div>{data.code}</div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full sm:flex flex-row mb-5">
                    <div className="font-bold text-black order">Thời gian đặt hàng:</div>
                    <div>{formatTime(data?.createdAt)}</div>
                  </div>
                </div>
              </div>
              (
              <div className="w-full sm:flex flex-row mb-5 text-[16px]">
                <div className="font-bold text-black order">Địa chỉ giao hàng:</div>
                <div>{data?.addressConvert}</div>
              </div>
              )
            </>
          )}
          <div className="w-1/2 lg:flex lg:flex-row text-[16px]">
            <div className="grid lg:grid-cols-[150px_minmax(150px,_1fr)] grid-cols-[120px_minmax(176px,_1fr)] mb-4">
              <span className="font-bold text-black order text-base lg:w-[150px] w-[200px]">Vouchers:</span>
              <span className="flex flex-col sm:flex-row text-base w-1/">
                {convertText(data?.voucher?.code)} {addDescription(convertText(data?.voucher?.description))}
              </span>
            </div>
          </div>

          <hr />
          {data && data?.orderLineItem?.length > 0 && (
            <>
              <div className="flex justify-end">
                <SelectComp
                  type="list"
                  disabled
                  defaultValue={filterTax}
                  className="w-wull sm:w-[245px] my-2 sm:-mb-8"
                  value={filterTax}
                  allowClear={false}
                  placeHolder="Chọn thuế"
                  list={[
                    { label: 'Áp dụng thuế', value: true },
                    { label: 'Không áp dụng thuế', value: false },
                  ]}
                />
              </div>
              <p className="text-[16px] font-bold text-teal-900 py-4 mr-5">Chi tiết đơn hàng</p>
              <div className="overflow-x-auto">
                <table className="lg:table-auto w-[850px] sm:w-[900px] lg:w-[95%] mx-5 text-gray-700">
                  <thead className="text-left">
                    {filterTax ? (
                      <tr className="font-normal text-[14px] border-b-[0.5px]">
                        <td className="pb-8">Mã sản phẩm</td>
                        <td className="sm:w-[20%] w-[20%]">Tên sản phẩm</td>
                        <td>Đơn vị</td>
                        <td>Đơn giá (VND)</td>
                        <td>Số lượng</td>
                        <td>Thành tiền</td>
                        <td>Thuế</td>
                        <td>Tổng tiền sau thuế (VND)</td>
                      </tr>
                    ) : (
                      <tr className="font-normal text-[14px] border-b-[0.5px]">
                        <td className="pb-8">Mã sản phẩm</td>
                        <td className="sm:w-[20%] w-[20%]">Tên sản phẩm</td>
                        <td>Đơn vị</td>
                        <td>Đơn giá (VND)</td>
                        <td>Số lượng</td>
                        <td>Thành tiền</td>
                      </tr>
                    )}
                  </thead>
                  {filterTax ? (
                    <tbody>
                      {data &&
                        data?.orderLineItem?.length &&
                        data?.orderLineItem.map((item) => {
                          return (
                            <tr key={item.id}>
                              <td className="font-normal text-[14px]">{item?.product?.code}</td>
                              <td>
                                <p className="font-medium py-4 text-sm w-[100%]">{item?.product?.name}</p>
                              </td>
                              <td className="font-normal text-[14px]">{item?.product?.basicUnit}</td>
                              <td className="font-normal text-[14px]">{formatCurrency(item?.price, '')}</td>
                              <td className="font-normal text-[14px]">{item?.totalReceived}</td>
                              <td className="font-normal text-[14px]">
                                {item?.totalReceived &&
                                  item?.price &&
                                  formatCurrency(item?.totalReceived * item?.price, '')}
                              </td>
                              <td className="font-normal text-[14px]">{item?.tax}%</td>
                              <td className="font-normal text-[14px]">
                                {formatCurrency(+item?.price * +item?.totalReceived * (+item?.tax / 100 + 1), '')}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  ) : (
                    <tbody>
                      {data &&
                        data?.orderLineItem?.length &&
                        data?.orderLineItem.map((item) => {
                          return (
                            <tr key={item.id}>
                              <td className="font-normal text-[14px]">{item?.product?.code}</td>
                              <td>
                                <p className="font-medium py-4 text-sm w-[100%]">{item?.product?.name}</p>
                              </td>
                              <td className="font-normal text-[14px]">{item?.product?.basicUnit}</td>
                              <td className="font-normal text-[14px]">{formatCurrency(item?.price, '')}</td>
                              <td className="font-normal text-[14px]">{item?.totalReceived}</td>
                              <td className="font-normal text-[14px]">
                                {item?.totalReceived &&
                                  item?.price &&
                                  formatCurrency(item?.totalReceived * item?.price, '')}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  )}
                </table>
              </div>
              <div className="flex flex-col items-end w-full sm:w-[70%] md:w-[50%]  lg:w-[40%] ml-auto">
                <div className="flex flex-row float-right mt-7 justify-between w-full">
                  <div className="mr-10">
                    <p className="text-teal-900 font-bold text-base">
                      {' '}
                      {filterTax ? 'Tổng tiền trước thuế:' : 'Tổng tiền hàng:'}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-teal-900 font-bold text-base">{formatCurrency(totalPrice, ' VND')}</p>
                  </div>
                </div>
                {filterTax && (
                  <>
                    <div className="flex flex-row float-right mt-2 justify-between w-full">
                      <div className="mr-10">
                        <p className="text-teal-900 font-bold text-base">Tổng tiền thuế:</p>
                      </div>
                      <div className="text-right">
                        <p className="text-teal-900 font-bold text-base">{formatCurrency(totalTaxPrice, ' VND')}</p>
                      </div>
                    </div>
                    <div className="flex flex-row float-right mt-2 justify-between w-full">
                      <div className="mr-10">
                        <p className="text-teal-900 font-bold text-base">Tổng tiền sau thuế:</p>
                      </div>
                      <div className="text-right">
                        <p className="text-teal-900 font-bold text-base">
                          {formatCurrency(totalPriceAfterTax, ' VND')}
                        </p>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex flex-row float-right mt-2 justify-between w-full">
                  <div className="mr-10">
                    <p className="text-teal-900 font-bold text-base">Chiết khấu:</p>
                  </div>
                  <div className="text-right">
                    <p className="text-teal-900 font-bold text-base">
                      {formatCurrency(data?.voucherReceiptAmount ?? 0, ' VND')}
                      {caculatePrice().discountPercent}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row float-right mt-2 mb-5 justify-between w-full">
                  <div className="mr-10">
                    <p className="text-teal-900 font-bold text-base">Tổng tiền:</p>
                  </div>
                  <div className="text-right">
                    <p className="text-teal-900 font-bold text-base">
                      {filterTax
                        ? formatCurrency(totalPriceAfterTax - Number(data?.voucherReceiptAmount ?? 0), ' VND')
                        : formatCurrency(totalPrice - Number(data?.voucherReceiptAmount ?? 0), ' VND')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="clear-both"></div>{' '}
            </>
          )}

          <div className="flex mx-auto sm:justify-between justify-center sm:w-auto  mt-10 ">
            {window?.location?.hash.includes('management') ? (
              <button
                onClick={() => {
                  window.history.back();
                }}
                className="px-8 bg-white sm:w-auto w-[60%] border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-[10px] text-teal-900 hover:text-teal-600 mt-1"
                id="backBtn"
              >
                Trở về
              </button>
            ) : roleCode === 'ADMIN' ? (
              <button
                onClick={() => {
                  navigate(`${routerLinks('SupplierEdit')}?id=${idSupplier}&tab=4`);
                }}
                className="px-8 bg-white sm:w-auto w-[60%] border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-[10px] text-teal-900 hover:text-teal-600 mt-1"
                id="backBtn"
              >
                Trở về
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate(`${routerLinks('Revenue')}`);
                }}
                className="px-8 bg-white sm:w-auto w-[60%] border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-[10px] text-teal-900 hover:text-teal-600 mt-1"
                id="backBtn"
              >
                Trở về
              </button>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
