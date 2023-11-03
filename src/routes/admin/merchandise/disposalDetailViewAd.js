import React, { Fragment, useEffect, useState } from 'react';
import './index.less';
import { useLocation } from 'react-router-dom';
// import { useNavigate } from 'react-router';
import { SupplierService } from 'services/supplier';
// import NoImage from 'assets/images/no-image-info.jpg';
import { Spin } from 'components';
import moment from 'moment';
// import "antd/dist/antd.css";
const Page = () => {
  const location = useLocation();
  // const [isLoading, setLoading] = useState(false);
  //   const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const idOrder = urlSearch.get('id');
  const [data, setData] = useState({});

  //   const formatTime = (time, hour = true) => {
  //     const timer = new Date(time);
  //     const yyyy = timer.getFullYear();
  //     let mm = timer.getMonth() + 1; // Months start at 0!
  //     let dd = timer.getDate();

  //     if (dd < 10) dd = '0' + dd;
  //     if (mm < 10) mm = '0' + mm;

  //     const formattedToday = dd + '/' + mm + '/' + yyyy;
  //     if (hour)
  //       return (
  //         new Date(time).getHours() +
  //         ':' +
  //         (new Date(time).getMinutes() < 10 ? '0' : '') +
  //         new Date(time).getMinutes() +
  //         ' - ' +
  //         formattedToday
  //       );

  //     return formattedToday;
  //   };

  useEffect(() => {
    const fetchDetailOrder = async () => {
      if (idOrder) {
        const data = await SupplierService.getDetailDisposalGoods(idOrder);
        setData(data);
      }
    };
    fetchDetailOrder();
  }, [idOrder]);

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
        <p className="text-2xl text-teal-900 font-medium">Quản lý đơn hàng</p>
        <div className="bg-white w-full px-4 rounded-xl mt-5 relative pb-5 tableExtend">
          <div className="flex flex-row items-center">
            <p className="text-xl font-bold text-teal-900 py-4 mr-5">Thông tin đơn hàng</p>
            {data?.status === 'INPROCESS' ? (
              <p className="text-[16px] text-orange-500 py-4 flex flex-row items-center">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Đang xử lý</span>
              </p>
            ) : (
              <p className="text-[16px] text-green-600 py-4 flex flex-row items-center">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Đã hoàn tất</span>
              </p>
            )}
          </div>

          <>
            <div className="w-full flex flex-row text-base">
              <div className="w-full">
                <div className="w-full flex flex-row mb-5">
                  <div className="font-bold text-black order">Mã hủy hàng:</div>
                  <div>{data?.code || 'Đang cập nhật'}</div>
                </div>
                <div className="w-full flex flex-row mb-5">
                  <div className="font-bold text-black order">Thời gian hủy hàng:</div>
                  <div>  {moment(data?.issuedAt).format('DD/MM/YYYY')}</div>
                </div>
              </div>
              <div className="w-full">
                <div className="w-full flex flex-row mb-5">
                  <div className="font-bold text-black order">Tên cửa hàng:</div>
                  <div>{data?.store.name}</div>
                </div>
                <div className="w-full flex flex-row mb-5">
                  <div className="font-bold text-black order">Lý do hủy hàng:</div>
                  <div>{data?.reason}</div>
                </div>
              </div>
            </div>
          </>

          <hr />

          <>
            {' '}
            <p className="text-[16px] font-bold text-teal-900 py-4 mr-5">Chi tiết hủy hàng</p>
            <table className="table-auto table_discount h-16 w-[98%] mx-5 text-gray-700 mb-[162px]">
              <thead className="text-left">
                <tr className="font-normal text-[14px] border-b-[0.5px]">
                  <td className="pt-4 pb-2">Mã sản phẩm</td>
                  <td className="pt-4 pb-2">Tên sản phẩm</td>
                  <td className="pt-4 pb-2">Nhà cung cấp</td>
                  <td className="pt-4 pb-2">Đơn vị tính</td>
                  <td className="pt-4 pb-2">Số lượng hủy</td>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data?.detailProduct?.length &&
                  data?.detailProduct.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="font-normal text-[14px] pt-4 pb-6">{item?.code} </td>
                        <td className="font-normal text-[14px] pt-4 pb-6">
                          {/* <img
                            src={item?.image || NoImage}
                            className="w-[45px] h-[38px] object-cover flex-none"
                            alt={item?.name}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = { NoImage };
                            }}
                          />{' '} */}
                          <span className=""> {item?.name}</span>
                        </td>
                        <td className="font-normal text-[14px] pt-4 pb-6">{item?.supplier?.name}</td>
                        <td className="font-normal text-[14px] pt-4 pb-6">{item?.unit}</td>
                        <td className="font-normal text-[14px] pt-4 pb-6">{item?.quantity}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>{' '}
            <div className="clear-both"></div>{' '}
            {/* <div className="flex justify-end mt-[26px] mb-[30px] mr-1">
              <div className="mr-10">
                <p className="text-teal-900 font-bold text-base">Tổng tiền:</p>
              </div>
              <div className="text-right">
                <p className="text-teal-900 font-bold text-base">{formatCurrency(data?.total, ' VND')}</p>
              </div>
            </div> */}
          </>
        </div>
        <div className="flex justify-between mt-8">
          <button
            onClick={() => {
              window.history.back();
            }}
            className="px-8 bg-white border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-[10px] text-teal-900 hover:text-teal-600 mt-1"
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
