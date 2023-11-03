import React, { Fragment, useEffect, useState } from 'react';

import './index.less';
import { useLocation } from 'react-router-dom';
import { formatCurrency, routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { HookDataTable, HookModal } from 'hooks';
import { SupplierService } from 'services/supplier';
import { ColumnDiscountPaymentPopUp, ColumnOrderDetail, ColumnPaymentDetail } from 'columns/supplier';
import { Select, Input, InputNumber } from 'antd';
import { useAuth } from 'global';
import { Spin } from 'components';

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
      formattedToday +
      ' - ' +
      new Date(time).getHours() +
      ':' +
      (new Date(time).getMinutes() < 10 ? '0' : '') +
      new Date(time).getMinutes()
    );

  return formattedToday;
};

const DiscountDetail = () => {
  const { Option } = Select;
  const { TextArea } = Input;
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  //   const pageType =
  //     location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const idSupplier = urlSearch.get('idSupplier');
  const idCommission = urlSearch.get('id');

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const [method, setMethod] = useState('BANK_TRANSFER');
  const [payDiscount, setPayDiscount] = useState();
  const [note, setNote] = useState();
  const [data, setData] = useState([]);
  const [changeFetch, setChangeFetch] = useState(false);
  const [showBtnSendPayment, setShowBtnSendPayment] = useState(false);
  const [showBtnReceivedPaymentByAd, setShowBtnReceivedPaymentByAd] = useState(false);

  const [handleTableDetailPayment, DataDetailPayment] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: async (event) => {
        const res = await SupplierService.getDetailPayMentCommission(data.id);
        handlePayment(res?.data);
        setShowBtnSendPayment(false);
        if (res?.data?.status === 'DELIVERED') {
          setShowBtnReceivedPaymentByAd(true);
        } else setShowBtnReceivedPaymentByAd(false);
      },
    }),

    loading,
    save: false,
    setLoading,
    Get: async (id) => {
      return SupplierService.getDiscountPaymentList((id = idCommission));
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    // paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} thanh toán`,
    showPagination: false,
    columns: ColumnPaymentDetail({
      handleShow: async (id) => {
        handleTableDetailPayment();
      },
    }),
    showSearch: false,
  });

  useEffect(() => {
    const fetchGetDiscountDetail = async () => {
      try {
        const res = await SupplierService.getDiscountDetail(idCommission);
        setData(res.data);
      } catch (error) {
        return false;
      }
    };
    fetchGetDiscountDetail();
  }, [changeFetch]);

  const [handleTableDetailOrder, DataDetailOrder] = HookDataTable({
    onRow: (data) => ({
      // onDoubleClick: (event) => navigate(routerLinks('Supplier')),
    }),
    loading,
    save: false,
    setLoading,
    Get: async (params) => {
      return SupplierService.getDiscountOrderList({ params }, idCommission);
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} sản phẩm`,
    // showPagination: false,
    columns: ColumnOrderDetail({
      handleShow: async (id) => {
        handleTableDetailOrder();
      },
    }),
    showSearch: false,
  });

  // const currentTime = new Date();

  const handleSelectPayment = (e) => {
    let paymentMethod = '';
    switch (e) {
      case 'Chuyển khoản':
        paymentMethod = 'BANK_TRANSFER';
        break;
      case 'Tiền mặt':
        paymentMethod = 'CASH';
        break;
      default:
        paymentMethod = 'BANK_TRANSFER';
        break;
    }
    setMethod(paymentMethod);
  };
  const [showNumberValidate, setShowNumberValidate] = useState(false);
  const handleInputDiscount = (e) => {
    // if (
    //   (!Number(e.target.value) && e.target.value !== '0') ||
    //   Number(e.target.value < 0) ||
    //   Number(e.target.value) > Number(data?.commisionTotal) - Number(data?.totalPayment)
    // ) {
    //   setShowNumberValidate(true);
    //   return;
    // }
    // setShowNumberValidate(false);
    // // if(Number(e.target.value) < 0){
    // //   setShowNumberValidate(true)
    // // }
    setPayDiscount(e);
  };

  useEffect(() => {
    if (+payDiscount > Number(data?.commisionTotal) - Number(data?.totalPayment)) {
      setShowNumberValidate(true);
    } else if (Number(payDiscount) < 0) {
      setShowNumberValidate(true);
    } else {
      setShowNumberValidate(false);
    }
  }, [payDiscount]);

  const onChangeNote = (e) => {
    setNote(e.target.value);
  };

  const sendPayment = async () => {
    if ((!Number(payDiscount) && payDiscount !== '0') || Number(payDiscount < 0)) {
      // setShowNumberValidate(true);
      return;
    }
    await SupplierService.createCommissionPayment({
      commisionMoney: Number(payDiscount),
      subOrgCommisionId: Number(idCommission),
      note,
      paymentMethod: method,
    });
    await handleTableDetailPayment();
    setChangeFetch((prev) => !prev);
  };

  const recivedPayment = async (data) => {
    await SupplierService.AdminReceivedPayment(
      {
        status: 'RECIVED',
        commisionMoney: Number(data?.commisionMoney),
        subOrgCommisionId: Number(idCommission),
        note,
        paymentMethod: data?.paymentMethod,
      },
      data?.id,
    );
    await handleTableDetailPayment();
    setChangeFetch((prev) => !prev);
  };

  const [handlePayment, ModalHandlePayment] = HookModal({
    className: 'discountPayment',
    title: (dataPayment) => (
      <>
        <p className="text-xl text-teal-900 font-semibold mb-4">Thanh toán chiết khấu</p>
        {dataPayment.createdAt ? (
          <p className="text-left text-[#134E4A] text-base">
            Ngày thanh toán: <span className="text-black font-normal">{formatTime(dataPayment?.createdAt, false)}</span>
          </p>
        ) : (
          <p className="text-left text-[#134E4A] text-base">
            Kỳ thanh toán:{' '}
            <span className="text-black font-normal">
              {`${formatTime(data?.dateFrom, false)} -  ${formatTime(data?.dateTo, false)}`}
            </span>
          </p>
        )}
      </>
    ),
    isLoading,
    setIsLoading,
    onOk: async (data) => {
      return (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') ? sendPayment() : roleCode === 'ADMIN' ? recivedPayment(data) : '';
    },
    handleChange: async () => await handlePayment(),
    columns: ColumnDiscountPaymentPopUp({}),
    widthModal: 1000,
    idElement: 'PaymentChoose',
    textSubmit: 'Gửi thanh toán',
    textCancel: 'Trở về',

    footerCustom: (handleOk, handleCancel) => (
      <div className="flex justify-between items-center buttonGroup">
        <button
          type={'button'}
          className="px-2 bg-white border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-[10px] text-teal-900 hover:text-teal-600 mt-1 w-[120px]"
          onClick={handleCancel}
        >
          {'Trở về'}
        </button>

        {(roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && showBtnSendPayment && (
          <button
            type={'button'}
            className={
              'sm:py-2.5 sm:px-2 bg-teal-900 text-white text-base p-2 rounded-xl hover:bg-teal-600 sm:mt-1 w-[166px] text-center submitbtn disabled:bg-gray-300 disabled:hover:bg-gray-300'
            }
            onClick={handleOk}
            disabled={
              showNumberValidate || payDiscount === undefined || Number(payDiscount) === 0 || payDiscount === null
            }
          >
            {/* {isLoading && <i className="las la-spinner mr-1 animate-spin" />} */}
            {'Gửi thanh toán'}
          </button>
        )}
        {roleCode === 'ADMIN' && showBtnReceivedPaymentByAd && (
          <button
            type={'button'}
            className={
              ' bg-teal-900 text-white text-base sm:p-3 p-2  rounded-xl hover:bg-teal-600 mt-1 text-center submitbtn'
            }
            onClick={handleOk}
          >
            {/* {isLoading && <i className="las la-spinner mr-1 animate-spin" />} */}
            {'Đã nhận thanh toán'}
          </button>
        )}
      </div>
    ),
  });

  let statusTranslate;
  switch (data?.status) {
    case 'PAID':
      statusTranslate = 'Đã thanh toán';
      break;
    case 'NOT_PAID':
      statusTranslate = 'Chưa thanh toán';
      break;
    case 'NOT_COMPLETED_PAID':
      statusTranslate = 'Chưa hoàn tất';
      break;
  }

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
        <p className="sm:text-2xl text-xl font-bold text-teal-900 sm:mb-8 mb-2 sm:mt-0 mt-2">Chi tiết nhà cung cấp</p>
        <div className="bg-white w-full px-4 rounded-xl mt-5 relative">
          <div>
            <p className="sm:text-xl text-md font-bold text-teal-900 py-[18px]">Chi tiết chiết khấu</p>
          </div>
          <div className="w-full lg:flex lg:flex-row ">
            <div className="w-full  ">
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-black mr-2">Thời gian:</div>
                <div>{`${formatTime(data?.dateFrom, false)} -  ${formatTime(data?.dateTo, false)}`}</div>
              </div>
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-black mr-2">Chiết khấu:</div>
                <div>{formatCurrency(data?.commisionTotal, ' VND')}</div>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-black mr-2">Trạng thái:</div>
                <div>{statusTranslate}</div>
              </div>
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-black mr-2">Đã thanh toán:</div>
                <div>{formatCurrency(data?.totalPayment, ' VND')}</div>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-black mr-2">Cần thanh toán:</div>
                <div>{formatCurrency(Number(data?.commisionTotal) - Number(data?.totalPayment), ' VND')}</div>
              </div>
            </div>
          </div>
          <hr />
          <div className="flex items-center justify-between">
            <p className="sm:text-xl text-base font-bold text-teal-900 py-[18px]">Danh sách thanh toán</p>
            <Fragment>
              {/* Điều kiện kiểm tra date bổ sung:
            !(new Date(data?.dateFrom) <= currentTime && currentTime <= new Date(data?.dateTo)) &&  */}
              {(roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && Number(data?.commisionTotal) > Number(data?.totalPayment) && (
                <button
                  className={
                    ' text-white h-10 justify-center rounded-[0.625rem] inline-flex items-center bg-teal-900 hover:bg-teal-700 px-3'
                  }
                  onClick={() => {
                    handlePayment();
                    setShowBtnSendPayment(true);
                  }}
                  id="addBtn"
                >
                  <i className="las la-plus mr-1 bold"></i>
                  {' Thêm thanh toán chiết khấu'}
                </button>
              )}
            </Fragment>

            {ModalHandlePayment((paymentData) => {
              let statusMethod;
              switch (paymentData?.paymentMethod) {
                case 'BANK_TRANSFER':
                  statusMethod = 'Chuyển khoản';
                  break;
                case 'CASH':
                  statusMethod = 'Tiền mặt';
                  break;
              }

              let statusTranslater;
              switch (paymentData?.status) {
                case 'RECIVED':
                  statusTranslater = 'Đã nhận';
                  break;
                case 'DELIVERED':
                  statusTranslater = 'Đã chuyển';
                  break;
              }

              return (
                <div className="w-full">
                  <div className="w-full flex flex-row mb-1 text-base">
                    <div className="flex items-center justify-between w-full">
                      <div className="w-full">
                        <div className="w-full flex flex-row mb-5 text-base items-center">
                          <div className="font-bold text-teal-900 w-[220px] sm:mb-0 mb-2">
                            Chiết khấu cần thanh toán:
                          </div>
                          <div>{formatCurrency(Number(data?.commisionTotal) - Number(data?.totalPayment), ' VND')}</div>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="w-full flex flex-row mb-5 text-base items-center">
                          <div className="font-bold text-teal-900 w-[220px] sm:mb-0 mb-2">Phương thức thanh toán:</div>
                          <Select
                            defaultValue={statusMethod || 'Chuyển khoản'}
                            style={{
                              width: 250,
                            }}
                            disabled={roleCode === 'ADMIN' || statusTranslater}
                            onChange={handleSelectPayment}
                          >
                            <Option value="Chuyển khoản">Chuyển khoản</Option>
                            <Option value="Tiền mặt">Tiền mặt</Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-row mb-5 text-base">
                    <div className="w-full">
                      <div className="w-full flex flex-row mb-5 text-base items-center">
                        {(roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && (
                          <>
                            {paymentData.commisionMoney ? (
                              <>
                                <div className="font-bold text-teal-900 w-[220px] sm:mb-0 mb-2">
                                  Chiết khấu thanh toán:
                                </div>
                                <div>{formatCurrency(Number(paymentData?.commisionMoney), ' VND')}</div>
                              </>
                            ) : (
                              <>
                                <div className="font-bold text-teal-900 w-[220px] sm:mb-0 mb-2">
                                  Chiết khấu thanh toán:
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex gap-1 items-center">
                                    <div>
                                      <InputNumber
                                        placeholder="Nhập số tiền"
                                        className="discount-paying border border-gray-200 p-2 !rounded-[10px] w-[150px]"
                                        size="small"
                                        onChange={handleInputDiscount}
                                        required={true}
                                        // type="number"
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
                                        // onKeyDown={(e) =>
                                        //   ![
                                        //     '0',
                                        //     '1',
                                        //     '2',
                                        //     '3',
                                        //     '4',
                                        //     '5',
                                        //     '6',
                                        //     '7',
                                        //     '8',
                                        //     '9',
                                        //     'Delete',
                                        //     '.',
                                        //     'ArrowRight',
                                        //     'ArrowLeft',
                                        //     'Enter',
                                        //     'BackSpace'
                                        //   ].includes(e.key) && e.preventDefault()
                                        // }
                                        // max={Number(data?.commisionTotal) - Number(data?.totalPayment)}
                                      ></InputNumber>
                                    </div>
                                    <span>VND</span>
                                  </div>
                                  {!!showNumberValidate && <h1 className="text-red-500">Nhập số tiền hợp lệ</h1>}
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {roleCode === 'ADMIN' && (
                          <>
                            <div className="font-bold text-teal-900 w-[220px] sm:mb-0 mb-2">
                              Chiết khấu đã thanh toán:
                            </div>
                            <div>{formatCurrency(Number(paymentData?.commisionMoney), ' VND')}</div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full flex flex-row mb-5 text-base">
                        {statusTranslater && (
                          <Fragment>
                            <div className="font-bold text-teal-900 sm:w-[220px] sm:mb-0 mb-2">Trạng thái:</div>
                            <div className="sm:ml-0 ml-2">{statusTranslater}</div>
                          </Fragment>
                        )}
                      </div>
                    </div>
                  </div>
                  {Number(data?.commisionTotal) - Number(data?.totalPayment) - Number(payDiscount) >= 0 && (
                    <div className="w-full flex flex-row mb-5 text-base">
                      <div className="w-full">
                        <div className="w-full flex flex-row mb-5 text-base">
                          <div className="font-bold text-teal-900 w-[220px] sm:mb-0 mb-2">Chiết khấu còn lại:</div>
                          <div>
                            {Number(payDiscount)
                              ? formatCurrency(
                                  Number(data?.commisionTotal) - Number(data?.totalPayment) - Number(payDiscount),
                                  ' VND',
                                )
                              : paymentData.commisionMoney
                              ? formatCurrency(
                                  Number(data?.commisionTotal) -
                                    Number(data?.totalPayment) -
                                    Number(paymentData.commisionMoney),
                                  ' VND',
                                )
                              : formatCurrency(Number(data?.commisionTotal) - Number(data?.totalPayment), ' VND')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="w-full flex flex-row text-base">
                    <div className="w-full">
                      <div className="w-full flex flex-col mb-5 text-base gap-2">
                        <div className="font-bold text-teal-900">Ghi chú:</div>
                        <TextArea
                          // showCount
                          maxLength={500}
                          style={{
                            height: 100,
                          }}
                          value={paymentData.note}
                          disabled={roleCode === 'ADMIN' || statusTranslater}
                          className="border border-solid border-[#E5E7EB] rounded-lg p-2 text-black"
                          onChange={onChangeNote}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <>{DataDetailPayment()}</>
          <div className="">
            <p className="sm:text-xl text-base font-bold text-teal-900 py-[18px]">Danh sách sản phẩm</p>
          </div>
          <div className="mb-[32px]">{DataDetailOrder()}</div>
          <div className="flex sm:flex-row flex-col items-center justify-between mt-12 sm:mb-2 mb-10">
            {window?.location?.hash.includes('management') ? (
              <button
                onClick={() => {
                  window.history.back();
                }}
                className="px-8 sm:w-auto w-[60%] bg-white border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-[10px] text-teal-900 hover:text-teal-600"
                id="backBtn"
              >
                Trở về
              </button>
            ) : roleCode === 'ADMIN' ? (
              <button
                onClick={() => {
                  navigate(`${routerLinks('Supplier')}/edit?id=${idSupplier}&tab=5`);
                }}
                className="px-8 sm:w-auto w-[60%] bg-white border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-[10px] text-teal-900 hover:text-teal-600"
                id="backBtn"
              >
                Trở về
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate(`${routerLinks('Discount')}`);
                }}
                className="px-8 bg-white sm:w-auto w-[60%] border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-[10px] text-teal-900 hover:text-teal-600"
                id="backBtn"
              >
                Trở về
              </button>
            )}
          </div>
          <hr />
        </div>
      </div>
    </Fragment>
  );
};
export default DiscountDetail;
