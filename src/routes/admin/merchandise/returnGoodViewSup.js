import React, { Fragment, useEffect, useState } from 'react';
import './index.less';
import { useLocation } from 'react-router-dom';
// import { useNavigate } from 'react-router';
import { SupplierService } from 'services/supplier';
// import NoImage from 'assets/images/no-image-info.jpg';
import { Spin } from 'components';
import moment from 'moment';
import { formatCurrency } from 'utils';
import { taxApply } from 'constants/index';
import { Select } from 'antd';
// import "antd/dist/antd.css";

const FormatQuantity = (quantity = 0, convertInt = true) => {
  if (convertInt) {
    quantity = parseInt(quantity, 10);
  }
  return quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const Page = () => {
  const location = useLocation();
  // const [isLoading, setLoading] = useState(false);
  //   const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const idOrder = urlSearch.get('id');
  const { billCode } = location.state;
  const [data, setData] = useState({});
  const [filterTax, setFilterTax] = useState(taxApply.APPLY);
  const [detailProduct, setDetailProduct] = useState([]);

  // const formatBigNumberCurency = (money = 0, currency = '₫') => {
  //   return money.toLocaleString('fullwide', { useGrouping: false }).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + currency;
  // };

  useEffect(() => {
    const fetchDetailOrder = async () => {
      if (idOrder) {
        const data = await SupplierService.getDetailReturnGoods(idOrder);
        setFilterTax(!!data?.isApplyTax === true ? taxApply.APPLY : taxApply.NO_APPLY);
        setDetailProduct(data?.detailProduct?.map(e => ({
          ...e,
          inventoryProductUnits: e.inventoryProductUnits
                                  .sort((a, b) => +a.conversionValue - +b.conversionValue)
                                  .map(f => ({
                                    ...f,
                                    isDefault: f.productCode === e.currentUnit,
                                  }))
        })))
        setData(data);
      }
    };
    fetchDetailOrder();
  }, [idOrder]);

  const totalPrice =
    data.detailProduct &&
    data.detailProduct.reduce((a, c) => {
      return a + +c.price * +c.quantity;
    }, 0);
  const totalTaxPrice =
    data.detailProduct &&
    data.detailProduct.reduce((a, c) => {
      return a + (+c.price * +c.quantity * +c.tax) / 100;
    }, 0);

  const totalPriceAfterTax =
    data.detailProduct &&
    data.detailProduct.reduce((a, c) => {
      return a + +c.price * +c.quantity * (+c.tax / 100 + 1);
    }, 0);

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
        <p className="text-2xl text-teal-900 font-medium">Trả hàng</p>
        <div className="bg-white w-full px-4 rounded-xl mt-5 relative pb-5 tableExtend">
          <div className="flex flex-col sm:flex-row items-center">
            <p className="text-xl font-bold text-teal-900 pt-4 sm:py-4 sm:mr-5">Thông tin đơn hàng</p>
            {data?.status === 'INPROCESS' ? (
              <p className="text-[16px] text-orange-500 pt-0 pb-4 sm:py-4 flex flex-row items-center">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Đang xử lý</span>
              </p>
            ) : (
              <p className="text-[16px] text-green-600 pt-0 pb-4 sm:py-4 flex flex-row items-center">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Đã hoàn tất</span>
              </p>
            )}
          </div>

          <>
            <div className="w-full sm:flex flex-row text-base">
              <div className="w-full">
                <div className="w-full lg:flex flex-row mb-5">
                  <div className="font-bold text-black mr-4">Mã trả hàng:</div>
                  <div>{data?.code || 'Đang cập nhật'}</div>
                </div>
                <div className="w-full lg:flex flex-row mb-5">
                  <div className="font-bold text-black mr-4">Tên cửa hàng:</div>
                  <div>{data?.detailProduct[0]?.supplier?.name || 'Đang cập nhật'}</div>
                </div>
                {billCode === undefined && (
                  <div className="w-full flex flex-col lg:flex-row mb-5">
                    <div className="font-bold text-black mr-4">Thời gian trả hàng:</div>
                    <div> {moment(data?.issuedAt).format('DD/MM/YYYY')}</div>
                  </div>
                )}
                {billCode !== undefined && (
                  <div className="w-full lg:flex flex-row mb-5">
                    <div className="font-bold text-black mr-4">Lý do trả hàng:</div>
                    <div>{data?.reason}</div>
                  </div>
                )}
              </div>

              <div className="w-full">
                {billCode !== undefined && (
                  <div className="w-full flex flex-col lg:flex-row mb-5">
                    <div className="font-bold text-black mr-4">Mã nhập hàng:</div>
                    <div>{data?.orderInvoice?.code}</div>
                  </div>
                )}

                {billCode === undefined && (
                  <div
                    className={`w-full flex flex-col lg:flex-row mb-5 opacity-0 ${
                      window.innerWidth < 640 ? ' hidden ' : ''
                    } `}
                  >
                    <div className="font-bold text-black mr-4 ">Mã nhập hàng:</div>
                    <div>{data?.store.name}</div>
                  </div>
                )}
                {billCode === undefined && (
                  <div
                    className={`w-full flex flex-col lg:flex-row mb-5 opacity-0 ${
                      window.innerWidth < 640 ? ' hidden ' : ''
                    }`}
                  >
                    <div className="font-bold text-black mr-4">Nhà cung cấp:</div>
                    <div>{data?.store.name}</div>
                  </div>
                )}
                {billCode === undefined && (
                  <div className="w-full flex flex-col sm:flex-row mb-5">
                    <div className="font-bold text-black mr-4 w-[120px]">Lý do trả hàng:</div>
                    <div>{data?.reason}</div>
                  </div>
                )}
                {billCode !== undefined && (
                  <div className="w-full flex flex-col lg:flex-row mb-5">
                    <div className="font-bold text-black mr-4">Thời gian trả hàng:</div>
                    <div> {moment(data?.issuedAt).format('DD/MM/YYYY')}</div>
                  </div>
                )}
              </div>
            </div>
          </>

          <hr />

          <>
            <div className="flex justify-between items-center flex-col sm:flex-row">
              <p className="text-[16px] font-bold text-teal-900 py-4 mr-5">Chi tiết trả hàng</p>
              <Select
                disabled={true}
                defaultValue={filterTax === taxApply.APPLY ? 'Áp dụng thuế' : 'Không áp dụng thuế'}
                className="w-full sm:w-[245px]"
                value={filterTax === taxApply.APPLY ? 'Áp dụng thuế' : 'Không áp dụng thuế'}
                allowClear={false}
                // list={[
                //   { label: 'Áp dụng thuế', value: taxApply.APPLY },
                //   { label: 'Không áp dụng thuế', value: taxApply.NO_APPLY },
                // ]}
                // onChange={(value) => setFilterTax(value)}
              />
            </div>
            <div className=" overflow-x-auto">
              <table className="  h-16 w-[1300px] mx-5 text-gray-700 mb-auto">
                {filterTax === taxApply.APPLY ? (
                  <thead className="text-left">
                    <tr className="font-normal text-[14px] border-b-[0.5px]">
                      <td className="pt-4 pb-2">Mã vạch (CH)</td>
                      <td className="pt-4 pb-2">Mã vạch (NCC)</td>
                      <td className="pt-4 pb-2">Tên sản phẩm</td>
                      <td className="pt-4 pb-2">ĐVT</td>
                      {billCode !== undefined && <td className="pt-4 pb-2">SL nhập</td>}
                      <td className="pt-4 pb-2">Đơn giá</td>
                      <td className="pt-4 pb-2">SL trả</td>
                      <td className="pt-4 pb-2">Thành tiền</td>
                      <td className="pt-4 pb-2">Thuế</td>
                      {/* <td className="pt-4 pb-2">Tiền thuế</td> */}
                      <td className="pt-4 pb-2">Tiền sau thuế</td>
                    </tr>
                  </thead>
                ) : (
                  <thead className="text-left">
                    <tr className="font-normal text-[14px] border-b-[0.5px]">
                      <td className="pt-4 pb-2">Mã vạch (CH)</td>
                      <td className="pt-4 pb-2">Mã vạch (NCC)</td>
                      <td className="pt-4 pb-2">Tên sản phẩm</td>
                      <td className="pt-4 pb-2">ĐVT</td>
                      {billCode !== undefined && <td className="pt-4 pb-2">SL nhập</td>}
                      <td className="pt-4 pb-2">Đơn giá</td>
                      <td className="pt-4 pb-2">SL trả</td>
                      <td className="pt-4 pb-2">Thành tiền</td>
                    </tr>
                  </thead>
                )}
                <tbody>
                  {data &&
                    detailProduct?.length &&
                    detailProduct.map((item, index) => {
                      const indexData = item.inventoryProductUnits.find(e => e.isDefault);
                      return filterTax === taxApply.APPLY ? (
                        <tr key={index}>
                          <td className="font-normal text-[14px] pt-4 pb-6 break-all">{item?.storeBarcode} </td>
                          <td className="font-normal text-[14px] pt-4 pb-6">{item?.barcode} </td>
                          <td className="font-normal text-[14px] pt-4 pb-6">
                            <span className=" break-all"> {item?.name}</span>
                          </td>
                          <td className="font-normal text-[14px] pt-4 pb-6 break-all">{indexData?.unitName}</td>

                          {billCode !== undefined && (
                            <td className="font-normal text-[14px] pt-4 pb-6">
                              {FormatQuantity(item?.quantityImport)}
                            </td>
                          )}
                          <td className="font-normal text-[14px] pt-4 pb-6">{formatCurrency(indexData?.inventoryPrice, '')}</td>
                          <td className="font-normal text-[14px] pt-4 pb-6">{item?.quantity.toLocaleString('vi-VN')}</td>
                          <td className="font-normal text-[14px] pt-4 pb-6">{formatCurrency(item?.amount, '')}</td>
                          <td className="font-normal text-[14px] pt-4 pb-6">{formatCurrency(item?.tax, '')}%</td>
                          <td className="font-normal text-[14px] pt-4 pb-6">
                            {formatCurrency(+item?.amount * (+item?.tax / 100 + 1), '')}
                          </td>
                        </tr>
                      ) : (
                        <tr key={index}>
                          <td className="font-normal text-[14px] pt-4 pb-6 break-all">{item?.storeBarcode} </td>
                          <td className="font-normal text-[14px] pt-4 pb-6">{item?.barcode} </td>
                          <td className="font-normal text-[14px] pt-4 pb-6">
                            <span className=" break-all"> {item?.name}</span>
                          </td>
                          <td className="font-normal text-[14px] pt-4 pb-6 break-all">{indexData?.unitName}</td>

                          {billCode !== undefined && (
                            <td className="font-normal text-[14px] pt-4 pb-6">
                              {FormatQuantity(item?.quantityImport)}
                            </td>
                          )}
                          <td className="font-normal text-[14px] pt-4 pb-6">{formatCurrency(indexData?.inventoryPrice, '')}</td>
                          <td className="font-normal text-[14px] pt-4 pb-6">{item?.quantity.toLocaleString('vi-VN')}</td>
                          <td className="font-normal text-[14px] pt-4 pb-6">{formatCurrency(item?.amount, '')}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="totalMoney-area w-full md:w-[70%] lg:w-[45%] flex flex-col ml-auto gap-2 mt-6 mb-[54px]">
              <div>
                <div className="flex justify-between mr-0 ">
                  <span className="font-bold text-base text-teal-900 mr-11 sm:w-auto w-[120px]">Tổng tiền hàng:</span>
                  <span className="font-bold text-base text-slate-700"> {formatCurrency(totalPrice, ' VND')}</span>
                </div>
              </div>
              {filterTax === taxApply.APPLY ? (
                <div>
                  <div className="flex justify-between mr-0 ">
                    <span className="font-bold text-base text-teal-900 mr-11 sm:w-auto w-[120px]">Tiền thuế:</span>
                    <span className="font-bold text-base text-slate-700"> {formatCurrency(totalTaxPrice, ' VND')}</span>
                  </div>
                </div>
              ) : null}

              {filterTax === taxApply.APPLY ? (
                <div>
                  <div className="flex justify-between mr-0 ">
                    <span className="font-bold text-base text-teal-900 mr-11 sm:w-auto w-[150px]">
                      Tổng tiền sau thuế:
                    </span>
                    <span className="font-bold text-base text-slate-700">
                      {' '}
                      {formatCurrency(totalPriceAfterTax, ' VND')}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </>
        </div>
        <div className="flex justify-center sm:justify-between mt-8">
          <button
            onClick={() => {
              window.history.back();
            }}
            className="px-8 bg-white border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-[10px] text-teal-900 hover:text-teal-600 mt-1 sm:w-auto w-[60%]"
            id="backBtn"
          >
            Trở về
          </button>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
