import React, { Fragment, useEffect, useState } from 'react';
import { Message, Spin } from 'components';
import InfiniteScroll from 'react-infinite-scroll-component';
import './index.less';
import ImgError from '../../../assets/images/no-image-info.jpg';
import ImgProduct from '../../../assets/images/imgproduct.png';
import { List } from 'antd';
import { useLocation } from 'react-router-dom';
import { formatCurrency, routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { useAuth } from 'global';
import { ConnectManagementService } from 'services/connect-management';
import { HookModal, HookModalForm } from 'hooks';
import { ColumnSupplier, ColumnRefuse } from 'columns/connect-management';
import { useTranslation } from 'react-i18next';
import SupplierCard from './supplierCard';
import SearchBar from './search';
import isURL from './checkUrl';
import SupplierTable from './supplierTable/supplier';
import { ERole } from 'variable';
// const checkKey = (id) => {
//   for (const key in localStorage) {
//     if (key === `searchkey_${id}`) return true;
//   }
//   return false;
// };
const Page = () => {
  const location = useLocation();
  const { t } = useTranslation();
  // const [isLoadingSkeleton, Skeleton] = useState(false);
  const [total, setTotal] = useState(8);

  const navigate = useNavigate();
  const { user, formatDate } = useAuth();
  const urlSearch = new URLSearchParams(location.search);
  const idRequest = urlSearch.get('id');
  const [data, setData] = useState({});
  const [approvedSupplier, setApprovedSupplier] = useState({});
  const [supplierList, setSupplierList] = useState([]);
  const roleCode = user?.userInfor?.roleCode;
  const [isLoading, setIsLoading] = useState(false);
  const [choosingSupplier, setChoosingSupplier] = useState([]);
  const [recommendedSuppliers, setRecommendedSuppliers] = useState([]);
  const [params, setParams] = useState(8);
  const [reject, setReject] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  // const [searchKey, setSearchKey] = useState(
  //   checkKey(idRequest) ? localStorage.getItem(`searchkey_${idRequest}`) : data.productName,
  // );
  const [searchKey, setSearchKey] = useState(data.productName);

  const getDataRequest = async () => {
    try {
      if (roleCode !== 'OWNER_SUPPLIER' && roleCode !== 'DISTRIBUTOR') {
        const res = await ConnectManagementService.getById(parseInt(idRequest));
        if (res && res.status === 'APPROVED') {
          const idApproved = res.storeRequestSupplier.findIndex((item) => {
            return item.status === 'APPROVED';
          });
          setApprovedSupplier(res.storeRequestSupplier[idApproved]?.supplier);
        }
        setData(res);
        localStorage.setItem(`status_${idRequest}`, res.status);
        setSearchKey(res?.productName);
        // setSearchKey(checkKey(idRequest) ? localStorage.getItem(`searchkey_${idRequest}`) : res.productName);
      } else {
        const res = await ConnectManagementService.getByIdConnect(parseInt(idRequest));
        setData(res);
        // setSearchKey(checkKey(idRequest) ? localStorage.getItem(`searchkey_${idRequest}`) : res.productName);
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  // useEffect(() => {
  //   getDataRequest();
  // }, []);
  useEffect(() => {
    getDataRequest();
  }, [reject]);

  useEffect(() => {
    if (roleCode !== 'OWNER_SUPPLIER' && roleCode !== 'DISTRIBUTOR' && data && data?.status === 'APPROVED') {
      const idApproved = data.storeRequestSupplier.findIndex((item) => {
        return item.status === 'APPROVED';
      });
      setApprovedSupplier(data.storeRequestSupplier[idApproved]?.supplier);
    }
  });
  const getSupplierList = async () => {
    try {
      if (roleCode !== 'OWNER_SUPPLIER' && roleCode !== 'DISTRIBUTOR') {
        const res = await ConnectManagementService.getSupplier('', idRequest);
        // setSearchKey(checkKey(idRequest) ? localStorage.getItem(`searchkey_${idRequest}`) : res.productName);
        // setSearchKey(res.productName);
        setSupplierList(res);
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    getSupplierList();
  }, []);

  const getRecommendedSuppliers = async () => {
    try {
      if (
        (roleCode !== 'OWNER_SUPPLIER' &&
          roleCode !== 'DISTRIBUTOR' &&
          data &&
          data?.storeId &&
          data.status !== 'APPROVED' &&
          data.status !== 'REJECT_BY_ADMIN' &&
          data.status !== 'REJECT_BY_STORE') ||
        ((roleCode === 'OWNER_STORE' || roleCode === ERole.sales) && data && data?.storeId && data.status !== 'WAITING_ADMIN')
      ) {
        if (total !== 0 && recommendedSuppliers?.data?.length >= total && searchKey !== '') {
          setHasMore(false);
          return;
        }
        setHasMore(true);
        const res = await ConnectManagementService.getSupplierWithProduct(searchKey, params, data?.storeId);
        setRecommendedSuppliers(res);
        setTotal(res?.total);
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    getRecommendedSuppliers();
  }, [params, searchKey]);

  const convertAddress = (address) => {
    if (!address) return '';
    const street = address?.street ? address?.street + ', ' : '';
    const ward = address?.ward && address?.ward?.name ? address?.ward?.name + ', ' : '';
    const district = address?.district && address?.district?.name ? address?.district?.name + ', ' : '';
    const province = address?.province && address?.province?.name ? address?.province?.name + ', ' : '';
    const res = street + ward + district + province;
    if (res[res.length - 2] === ',') {
      return res.slice(0, -2);
    }
    return res;
  };

  const formatTime = (time) => {
    if (!time) return null;
    const timer = new Date(time);
    const yyyy = timer.getFullYear();
    let mm = timer.getMonth() + 1;
    let dd = timer.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday =
      dd +
      '/' +
      mm +
      '/' +
      yyyy +
      ' - ' +
      new Date(time).getHours() +
      ':' +
      (new Date(time).getMinutes() < 10 ? '0' : '') +
      new Date(time).getMinutes();

    return formattedToday;
  };

  let statusLetter = '';
  if (
    (supplierList && supplierList.data && supplierList.data.length >= 0) ||
    roleCode === 'OWNER_SUPPLIER' ||
    roleCode === 'DISTRIBUTOR'
  ) {
    switch (data.status) {
      case 'APPROVED':
        statusLetter = 'Đã phê duyệt';
        break;
      case 'WAITING_ADMIN':
        statusLetter = 'Chờ phê duyệt';
        break;
      case 'WAITING_STORE':
        statusLetter = 'Chờ kết nối';
        break;
      case 'REJECT_BY_ADMIN':
        statusLetter = 'Từ chối';
        break;
      case 'REJECT_BY_STORE':
        statusLetter = 'Từ chối';
        break;
    }
  }
  // const statusCheck = data?.status;
  const listReasonAdmin = [
    {
      value: 'Yêu cầu không phù hợp với cửa hàng',
      label: 'Yêu cầu không phù hợp với cửa hàng',
    },
    {
      value: 'Sản phẩm chưa có nhà cung cấp',
      label: 'Sản phẩm chưa có nhà cung cấp',
    },
    {
      value: 'Khác',
      label: 'Khác',
    },
  ];
  const listReasonStore = [
    {
      value: 'Không tìm thấy nhà cung cấp phù hợp',
      label: 'Không tìm thấy nhà cung cấp phù hợp',
    },
    {
      value: 'Sản phẩm được đề nghị không phù hợp',
      label: 'Sản phẩm được đề nghị không phù hợp',
    },
    {
      value: 'Giá bán sản phẩm không phù hợp',
      label: 'Giá bán sản phẩm không phù hợp',
    },
    {
      value: 'Khác',
      label: 'Khác',
    },
  ];
  const [handleChange, DataTable, ModalDetailForm, ModalPrice] = SupplierTable({
    getSupplierList,
    statusCheck: data?.status,
    // statusCheck: localStorage.getItem(`status_${idRequest}`) || data?.status,
    roleCode,
    idRequest,
    formatDate,
  });

  const [handleAddSupplier, ModalAddSupplierForm, ...prop] = HookModal({
    className: 'addSupplier',
    title: (data) => <span className="text-xl text-teal-900 font-semibold">Thêm nhà cung cấp</span>,
    isLoading,
    setIsLoading,
    handleChange: async () => await handleAddSupplier(),
    columns: ColumnSupplier({}),
    onOk: async (data) => {
      const res = await ConnectManagementService.addRecommendSuppliers({
        supplierProductList: choosingSupplier.map((item) => {
          return {
            supplierId: parseInt(item.subOrg.id),
            productId: item.id,
          };
        }),
        storeReqId: parseInt(idRequest),
      });
      res && Message.success({ text: `Thêm nhà cung cấp thành công` });
      setChoosingSupplier([]);
      getSupplierList();
      await handleChange();
      return true;
    },
    keyWord: data.productName,
    // Get: ConnectManagementService.getSupplierWithProduct,
    widthModal: 1000,
    idElement: idRequest,
    textSubmit: 'Thêm nhà cung cấp',
    textCancel: 'Trở về',
    search: true,
    idSearch: 'addSupplier',
    showSubmitButton: !!choosingSupplier && choosingSupplier.length > 0,
    params,
    footerCustom: (handleOk, handleCancel) => (
      <div className="flex justify-center gap-5 buttonGroup">
        <button
          type={'button'}
          className="px-2 bg-white-500 border-teal-900 hover:border-teal-600 border-solid border
          text-base p-2 rounded-xl text-teal-900 hover:text-teal-600 mt-1 w-[120px]"
          onClick={handleCancel}
        >
          {'Trở về'}
        </button>
        {choosingSupplier && choosingSupplier.length > 0 && (
          <button
            type={'button'}
            className={
              'py-2.5 px-1 bg-teal-900 text-white text-base rounded-xl hover:bg-teal-600 mt-1 w-[166px] text-center submitbtn'
            }
            onClick={handleOk}
          >
            {/* {isLoading && <i className="las la-spinner mr-1 animate-spin" />} */}
            {'Thêm nhà cung cấp'}
          </button>
        )}
      </div>
    ),
  });

  const [handleRefuse, ModalRefuseForm] = HookModalForm({
    className: 'refuse',
    title: (data) => <span className="text-xl text-teal-900 font-semibold">Từ chối yêu cầu sản phẩm</span>,
    isLoading,
    setIsLoading,
    handleChange: async () => await handleRefuse(),
    columns: ColumnRefuse({
      roleCode,
      idRequest: parseInt(idRequest),
      listReason: roleCode === 'ADMIN' ? listReasonAdmin : listReasonStore,
    }),
    Put: async (params) => {
      if (roleCode === 'OWNER_STORE' || roleCode === ERole.sales) {
        ConnectManagementService.storeRejectSupplier(params, idRequest);
        setReject(true);
        getDataRequest();
      } else {
        ConnectManagementService.adminRejectStore(params, idRequest);
        setReject(true);
        getDataRequest();
      }
    },
    widthModal: 600,
    idElement: 'ConnectManagement',
    textSubmit: 'Gửi',
    textCancel: 'Hủy thao tác',
    footerCustom: (handleOk, handleCancel) => (
      <div className="flex justify-center gap-5 buttonGroup">
        <button
          type={'button'}
          className="px-2 bg-white-500 border-teal-900 hover:border-teal-600 border-solid border
          text-base p-2 rounded-xl text-teal-900 hover:text-teal-600 mt-1 w-[120px]"
          onClick={handleCancel}
        >
          {'Hủy'}
        </button>
        {
          <button
            type={'button'}
            className={
              'py-2.5 px-2 bg-red-600 text-white text-base p-2 rounded-xl hover:bg-red-400 mt-1 w-[166px] text-center submitbtn'
            }
            onClick={handleOk}
          >
            {/* {isLoading && <i className="las la-spinner mr-1 animate-spin" />} */}
            {'Gửi'}
          </button>
        }
      </div>
    ),
  });

  const handleAdminAccept = async (idRequest) => {
    const res = await ConnectManagementService.adminApproveStore(idRequest);
    res && Message.success({ text: `Phê duyệt thành công` });
    return navigate(routerLinks('ConnectManagement'));
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
        <p className="sm:text-2xl text-xl font-bold text-teal-900 sm:mb-8">Quản lý kết nối</p>
        <div className="bg-white w-full px-4 rounded-xl mt-5 relative sm:pb-5">
          {/* Section chung tất cả */}
          <div className="flex flex-row items-center">
            <p className="sm:text-xl text-base font-bold text-teal-900 py-4 mr-5">Chi tiết yêu cầu</p>
          </div>
          <div className="w-full sm:flex sm:flex-row">
            <div className="w-full">
              <div className="w-full flex flex-row mb-5 text-base">
                <div className="font-bold text-teal-900 w-[150px] flex-none">Mã yêu cầu:</div>
                <div>{data.code}</div>
              </div>
              <div className="w-full flex flex-row mb-5 text-base">
                <div className="font-bold text-teal-900 w-[150px] flex-none">Trạng thái:</div>
                <div>{statusLetter}</div>
              </div>
              <div className="w-full flex flex-row mb-5 text-base">
                <div className="font-bold text-teal-900 w-[150px] flex-none">Tên sản phẩm:</div>
                <div>{data.productName}</div>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full flex flex-row mb-5 text-base">
                <div className="font-bold text-teal-900 w-[150px] flex-none">Ngày yêu cầu:</div>
                <div>{data?.requestedAt && formatTime(data.requestedAt)}</div>
              </div>
              {data && data?.status && data.status === 'APPROVED' && (
                <div className="w-full flex flex-row mb-5 text-base">
                  <div className="font-bold text-teal-900 w-[150px] flex-none">Ngày phê duyệt:</div>
                  <div>{data?.approvedAt && formatTime(data.approvedAt)}</div>
                </div>
              )}
              {data?.description && data?.description !== ' ' && (
                <div className="w-full sm:flex sm:flex-row gap-5 mb-5 text-base">
                  <div className="font-bold text-teal-900 text-base flex-none">Yêu cầu chi tiết về sản phẩm:</div>
                  <div className="whitespace-pre-wrap">{data.description}</div>
                </div>
              )}
            </div>
          </div>
          {/* <div className="w-full mb-5">
            <span className="font-bold text-teal-900 mr-5 text-base">Yêu cầu chi tiết về sản phẩm:</span>
            <span>{data.description}</span>
          </div> */}
          <hr />
          {/* Check các điều kiện userRole + status */}
          {((roleCode === 'ADMIN' && data && data.status) ||
            ((roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && data.status === 'APPROVED')) && (
            <>
              {' '}
              <div className="flex flex-row items-center">
                <p className="sm:text-xl text-base font-bold text-teal-900 py-4 mr-5">Thông tin cửa hàng</p>
              </div>
              <div className="w-full sm:flex sm:flex-row">
                <div className="w-full">
                  <div className="w-full flex flex-row mb-5 text-base">
                    <div className="font-bold text-teal-900 w-[150px] flex-none">Cửa hàng:</div>
                    <div>{data?.store.name}</div>
                  </div>
                  <div className="w-full flex flex-row mb-5 text-base">
                    <div className="font-bold text-teal-900 w-[150px] flex-none">Số điện thoại:</div>
                    <div>{data?.store?.userRole[0]?.userAdmin?.phoneNumber || data.storePnumber}</div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-row mb-5 text-base">
                    <div className="font-bold text-teal-900 w-[150px] flex-none">Tên chủ cửa hàng:</div>
                    <div>{data?.store?.userRole[0]?.userAdmin?.name}</div>
                  </div>
                  <div className="w-full flex flex-row mb-5 text-base">
                    <div className="font-bold text-teal-900 w-[150px] flex-none">Số fax:</div>
                    <div>{data?.store?.fax}</div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="w-full sm:flex sm:flex-row mb-5 text-base">
                  <div className="font-bold text-teal-900 w-[150px] flex-none ">Địa chỉ:</div>
                  <div className="">{data?.storeAddress}</div>
                </div>
              </div>
              <hr />
            </>
          )}

          {/* Section: store view + status đã phê duyệt / admin view + status đã phê duyệt và không bị từ chối / supplier
          view */}
          {(roleCode === 'OWNER_STORE' || roleCode === 'ADMIN' || roleCode === ERole.sales) &&
            data &&
            data.status === 'APPROVED' &&
            approvedSupplier && (
              <>
                {' '}
                <div className="flex flex-row items-center">
                  <p className="sm:text-xl text-base font-bold text-teal-900 py-4 mr-5">Thông tin nhà cung cấp</p>
                </div>
                <div className="w-full sm:flex sm:flex-row">
                  <div className="w-full">
                    <div className="w-full flex flex-row mb-5 text-base">
                      <div className="font-bold text-teal-900 w-[150px] flex-none">Nhà cung cấp:</div>
                      <div>{approvedSupplier?.name}</div>
                    </div>
                    <div className="w-full flex flex-row mb-5 text-base">
                      <div className="font-bold text-teal-900 w-[150px] flex-none">Số điện thoại:</div>
                      <div>{approvedSupplier?.userRole[0]?.userAdmin?.phoneNumber}</div>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="w-full flex flex-row mb-5 text-base">
                      <div className="font-bold text-teal-900 w-[150px] flex-none">Chủ nhà cung cấp:</div>
                      <div>{approvedSupplier?.userRole[0]?.userAdmin?.name}</div>
                    </div>
                    <div className="w-full flex flex-row mb-5 text-base">
                      <div className="font-bold text-teal-900 w-[150px] flex-none">Số fax:</div>
                      <div>{approvedSupplier?.fax}</div>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:flex sm:flex-row mb-5 text-base">
                  <div className="font-bold text-teal-900 w-[150px] flex-none">Địa chỉ:</div>
                  <div className="">{convertAddress(approvedSupplier?.address)}</div>
                </div>
                <hr />
              </>
            )}
          {/* SUPPLIER ROLE */}
          {(roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && data && (
            <>
              {' '}
              <div className="flex flex-row items-center">
                <p className="sm:text-xl text-base font-bold text-teal-900 py-4 mr-5">Thông tin nhà cung cấp</p>
              </div>
              <div className="w-full sm:flex sm:flex-row">
                <div className="w-full">
                  <div className="w-full flex flex-row mb-5 text-base">
                    <div className="font-bold text-teal-900 w-[150px] flex-none">Nhà cung cấp:</div>
                    <div>{data?.supplier?.name}</div>
                  </div>
                  <div className="w-full flex flex-row mb-5 text-base">
                    <div className="font-bold text-teal-900 w-[150px] flex-none">Số điện thoại:</div>
                    <div>{data?.supplier?.userRole[0]?.userAdmin?.phoneNumber || data.supplierPnumber}</div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-row mb-5 text-base">
                    <div className="font-bold text-teal-900 w-[150px] flex-none">Chủ nhà cung cấp:</div>
                    <div>{data.supplier?.userRole[0]?.userAdmin?.name}</div>
                  </div>
                  <div className="w-full flex flex-row mb-5 text-base">
                    <div className="font-bold text-teal-900 w-[150px] flex-none">Số fax:</div>
                    <div>{data.supplier?.fax}</div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="w-full sm:flex sm:flex-row mb-5 text-base">
                  <div className="font-bold text-teal-900 w-[150px] flex-none">Địa chỉ:</div>
                  <div>{data?.supplierAddress}</div>
                </div>
              </div>
              <hr />
            </>
          )}
          {(data.status === 'REJECT_BY_ADMIN' || data.status === 'REJECT_BY_STORE') && (
            <>
              {' '}
              <p className="text-xl font-bold text-teal-900 py-4 mr-5">Chi tiết </p>
              <div className="w-full flex flex-row">
                <div className="w-full">
                  <div className="w-full flex flex-row mb-5 text-base">
                    <div className="font-bold text-teal-900 w-[150px] flex-none">Ngày phản hồi:</div>
                    <div>{data?.approvedAt && formatTime(data.approvedAt)}</div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-row mb-5 text-base">
                    <div className="font-bold text-teal-900 w-[150px] flex-none">Từ chối bởi:</div>
                    <div>{data.status === 'REJECT_BY_ADMIN' ? 'Quản trị viên' : 'Chủ cửa hàng'}</div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row mb-5 text-base">
                <div className="font-bold text-teal-900 w-[150px] flex-none">Lý do:</div>
                {data.reason === 'Khác' ? (
                  <div>{data?.note}</div>
                ) : (
                  <div>{data.reason + (data?.note && data?.note !== ' ' ? ' (' + data.note + ')' : '')}</div>
                )}
              </div>
              <hr />
            </>
          )}

          {((data.status === 'WAITING_ADMIN' && roleCode === 'ADMIN') || data.status === 'WAITING_STORE') && (
            <>
              <div className="flex items-center justify-between">
                {(((roleCode === 'OWNER_STORE' || roleCode === ERole.sales) && supplierList && supplierList?.data?.length > 0) ||
                  roleCode === 'ADMIN') && (
                  <p className="sm:text-xl text-base font-bold text-teal-900 py-4 mr-5 ">Danh sách nhà cung cấp</p>
                )}
                {roleCode === 'ADMIN' && data.status === 'WAITING_ADMIN' && (
                  <Fragment>
                    <button
                      className="bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center"
                      onClick={() => {
                        handleAddSupplier();
                        // if(searchKey.length === 0){
                        getRecommendedSuppliers();
                        // }
                      }}
                    >
                      <i className="las la-plus mr-1" />
                      {t('Thêm nhà cung cấp')}
                    </button>
                  </Fragment>
                )}
                {/* Từ chối button */}
              </div>
              {supplierList && supplierList?.data?.length > 0 && data && data?.status && DataTable()}
            </>
          )}
          <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-between mt-10">
            <button
              onClick={() => {
                window.history.back();
                // navigate(`${routerLinks('ConnectManagement')}`);
              }}
              className="px-8 sm:w-auto w-[60%] bg-white-500 border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-xl text-teal-900 hover:text-teal-600 mt-1 sm:mb-0 mb-4 h-[40px]"
              id="backBtn testBtn"
            >
              Trở về
            </button>

            {roleCode === 'ADMIN' && data.status === 'WAITING_ADMIN' && (
              <>
                <div className="flex sm:flex-row flex-col items-center sm:w-auto w-[100%] sm:justify-end sm:items-end text-sm sm:mb-0">
                  <button
                    onClick={async () => handleRefuse({ ...data, note: null })}
                    className="px-4 sm:w-auto w-[60%] bg-red-500 text-white text-base p-2 rounded-xl hover:bg-red-400 mt-1 h-[40px]"
                    id="refusedBtn"
                  >
                    Từ chối yêu cầu
                  </button>
                  {supplierList && supplierList.data && supplierList?.data?.length > 0 && (
                    <button
                      onClick={() => {
                        handleAdminAccept(idRequest);
                      }}
                      className="px-4 sm:w-auto w-[60%] bg-teal-900 text-white text-base p-2 rounded-xl hover:bg-teal-600 mt-1 sm:ml-4 disabled:bg-gray-300 disabled:text-gray-400 disabled:hover:bg-gray-300"
                      // disabled={!supplierList || !supplierList.data || supplierList?.data?.length <= 0}
                      id="saveBtn"
                    >
                      Phê duyệt yêu cầu
                    </button>
                  )}
                </div>
              </>
            )}
            {(roleCode === 'OWNER_STORE' || roleCode === ERole.sales) &&
              data.status === 'WAITING_STORE' &&
              supplierList &&
              supplierList.data &&
              supplierList.data.length > 0 && (
                <Fragment>
                  <button
                    className="px-3 bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 border-solid border
                      text-base p-2 rounded-xl text-white mt-1"
                    onClick={() => handleRefuse({ ...data, note: null })}
                  >
                    {'Từ chối tất cả'}
                  </button>
                </Fragment>
              )}
          </div>
        </div>
      </div>
      {ModalRefuseForm()}
      {ModalDetailForm((data) => {
        // const DataPriceTable = React.lazy(() => import('./pricetable'));
        // const inforTable = await ConnectManagementService.getPriceDetails(data?.id)
        return (
          <div className="w-full">
            {/* top form */}
            <div className="w-full mb-4">
              <div className="font-bold text-teal-900 w-full text-base">Thông tin nhà cung cấp</div>
              <div className="sm:flex w-full mt-2">
                <div className="sm:w-[50%] w-full flex flex-row  text-base gap-3">
                  <div className="font-bold text-teal-900 flex-none">Nhà cung cấp:</div>
                  <div className="ml-2">{data?.supplierName} </div>
                </div>
                <div className="w-full sm:flex flex-row text-base gap-4 sm:p-0 py-4">
                  <div className=" font-bold text-teal-900 flex-none ">Địa chỉ:</div>
                  <div className="ml-2">{data?.address}</div>
                </div>
              </div>
            </div>
            <hr></hr>
            <div className="sm:flex sm:flex-row w-full mt-2">
              {/* Left form */}
              <div className="bg-white relative pb-5 rounded-xl" style={{ height: 'fit-content' }}>
                <div className="flex justify-center flex-col items-center ">
                  <div className="sm:p-3">
                    <img
                      src={
                        (data?.product?.photos.length > 0 &&
                          data?.product?.photos[0].url &&
                          isURL(data?.product?.photos[0].url) &&
                          data?.product?.photos[0].url) ||
                        ImgError
                      }
                      // src={null}
                      alt="productImage"
                      className="sm:max-w-[224px]  max-w-[110px] aspect-square object-cover rounded-xl shadow-md"
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = { ImgError };
                      }}
                    />
                  </div>
                  <div className="flex flex-grow items-center mt-1 gap-[9px] justify-between">
                    {data.product?.photos.length > 0 &&
                      data.product?.photos
                        .slice(1)
                        .map(
                          (photo) =>
                            photo.url && (
                              <img src={photo.url} alt="productImage" className="detailImage" key={photo.id} />
                            ),
                        )}
                  </div>
                </div>
              </div>
              {/* Right form */}
              <div className="bg-white  w-full rounded-xl sm:pl-5 sm:ml-2">
                <div className="sm:flex w-full gap-4">
                  <div className="w-full flex flex-row text-base">
                    <div className="font-bold text-teal-900 flex-none">Tên sản phẩm:</div>
                    <div className="text-base text-black ml-3 ">{data?.productName}</div>
                  </div>
                  <div className="w-full flex flex-row mb-5 text-base">
                    <div className="font-bold text-teal-900 flex-none">Đơn vị tính:</div>
                    <div className=" text-black ml-3">{data?.product?.basicUnit}</div>
                  </div>
                </div>
                {data?.product?.abilitySupply && (
                  <div>
                    <div className="font-bold text-teal-900 w-full text-base mt-2">Khả năng cung ứng:</div>

                    <div className="sm:flex sm:flex-row w-full gap-4 mt-[8px] mb-[16px] sm:ml-0 ml-4">
                      {data?.product?.abilitySupply?.quarter && (
                        <div className="w-full flex gap-2">
                          <div className="text-teal-900 flex-none">Theo quý:</div>
                          <div className="font-[16px] text-black"> {data?.product?.abilitySupply?.quarter} </div>
                        </div>
                      )}
                      {data?.product?.abilitySupply?.month && (
                        <div className="w-full flex gap-2">
                          <div className="text-teal-900 flex-none">Theo tháng:</div>
                          <div className="font-[16px] text-black"> {data?.product?.abilitySupply?.month} </div>
                        </div>
                      )}
                      {data?.product?.abilitySupply?.year && (
                        <div className="w-full flex gap-2">
                          <div className="text-teal-900 flex-none">Theo năm:</div>
                          <div className="font-[16px] text-black"> {data?.product?.abilitySupply?.year} </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {data?.product?.productPrice.length > 0 && (
                  <div className="w-full flex flex-col mb-5">
                    <div className="font-bold text-teal-900 w-[160px] text-base ">Bảng giá sản phẩm:</div>
                    {/* {Object.keys(data).length !== 0 && DataPriceTable && <DataPriceTable idProduct={data.idProduct} />} */}
                    <div className=" overflow-x-auto ">
                      <table
                        id="tablePriceP"
                        className="sm:table-auto table_discount h-16 sm:w-[98%] w-[400px]  mt-4  text-gray-900 mb-auto rounded-xl tablePriceProduct"
                      >
                        <thead className="text-left  ">
                          <tr className="font-normal  text-[14px] border-b-[0.5px]">
                            <td className=" pt-2 pb-2   !bg-white  text-center w-[10%] ">STT</td>
                            <td className="pt-2 pb-2 !bg-white w-[30%] ">Chủng loại giá </td>
                            <td className="pt-2 pb-2 !bg-white ">Số lượng tối thiểu</td>
                            <td className="pt-2 pb-2 !bg-white ">Giá bán(VND)</td>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.product?.productPrice?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="font-normal text-[14px] sm:pt-3 pt-2 sm:pb-2 pb-2 text-center w-[10%]">
                                  {index + 1}{' '}
                                </td>
                                <td className="font-normal  text-[14px] sm:pt-3 pt-2 sm:pb-2 pb-2">
                                  {item?.priceType}{' '}
                                </td>
                                <td className="font-normal text-[14px] sm:pt-3 pt-2 sm:pb-2 pb-2">
                                  {item?.minQuantity}{' '}
                                </td>
                                <td className="font-normal text-[14px] sm:pt-3 pt-2 sm:pb-2 pb-2">
                                  {formatCurrency(item?.price, '')}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="mt-3 w-full">
                  <div className="w-full sm:flex sm:flex-row">
                    <div className="w-full">
                      <div className="w-full flex flex-row mb-5 gap-2 text-base">
                        <div className="font-bold text-teal-900 flex-none">Mã sản phẩm:</div>
                        <div>{data?.product?.code}</div>
                      </div>
                      <div className="w-full flex flex-row mb-5 gap-2 text-base">
                        <div className="font-bold text-teal-900 flex-none">Thương hiệu:</div>
                        <div>{data?.product?.brand}</div>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full flex flex-row mb-5 gap-2 text-base">
                        <div className="font-bold text-teal-900 flex-none">Mã vạch:</div>
                        <div>{data?.product?.barcode}</div>
                      </div>
                      <div className="w-full flex flex-row mb-5 gap-2 text-base">
                        <div className="font-bold text-teal-900 flex-none">Danh mục:</div>
                        <div>
                          {data.product?.productCategory.reduce((acc, cate, index) => {
                            return index !== 0 || index !== data.product?.productCategory.length - 1
                              ? (acc += cate.category.name + ', ')
                              : (acc += cate.category.name);
                          }, '')}
                        </div>
                      </div>
                    </div>
                  </div>
                  {data?.product?.exportMarket && (
                    <div className="w-full flex flex-row">
                      <div className="w-full flex flex-row mb-5 text-base">
                        <div className="font-bold text-teal-900 w-[190px]">Thị trường xuất khẩu:</div>
                        <div>{data?.product?.exportMarket}</div>
                      </div>
                    </div>
                  )}
                  {data?.product?.description && (
                    <div className="w-full flex flex-row">
                      <div className="w-full">
                        <div className="w-full flex flex-col gap-2 mb-5 text-base">
                          <div className="font-bold text-teal-900 text-justify">Mô tả sản phẩm:</div>
                          <div className="text-justify ">{data?.product?.description}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {data?.product?.information.length > 0 && (
                    <div>
                      <div>
                        <div className="font-bold text-base text-teal-900 text-justify">Thông tin khác</div>
                      </div>
                      {data?.product?.information.length > 0 && (
                        <table
                          id="tableFileImport"
                          className="table-auto table_discount h-16 w-[98%]  text-gray-900 mb-auto tableFileImport"
                        >
                          <thead className="text-left">
                            <tr className="font-normal text-[14px] border-b-[0.5px]">
                              <td className=" pt-2 pb-2 bg-[#F3F4F6] text-center w-[10%]  ">STT</td>
                              <td className="pt-2 pb-2 w-[60%] bg-[#F3F4F6]">Nội dung </td>
                              <td className="pt-2 pb-2 bg-[#F3F4F6]">File đính kèm</td>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.product?.information?.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td className="font-normal text-[14px] sm:pt-3 pt-2 sm:pb-2 pb-2 text-center w-[10%]">
                                    {index + 1}{' '}
                                  </td>
                                  <td className="font-normal text-[14px] sm:pt-3 pt-2 sm:pb-2 pb-2">
                                    {item?.content}{' '}
                                  </td>
                                  <td className="font-normal text-[14px] sm:pt-3 pt-2 sm:pb-2 pb-2">
                                    <a
                                      href={`${item?.url}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className=" text-[#3B82F6] underline "
                                    >
                                      {item?.url?.split('/').reverse()[0]}
                                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {ModalAddSupplierForm(() => {
        const supplierRecommendListArray = recommendedSuppliers ? Object.values(recommendedSuppliers) : [];
        const currentList =
          supplierList &&
          supplierList.data &&
          supplierList.data.length > 0 &&
          supplierList.data.map((item) => {
            return item.product;
          });
        let res = supplierRecommendListArray && supplierRecommendListArray.length > 0 && supplierRecommendListArray[0];
        currentList &&
          currentList.length > 0 &&
          supplierRecommendListArray &&
          supplierRecommendListArray.length > 0 &&
          currentList.forEach((item) => {
            res = supplierRecommendListArray[0].filter((supplier) => {
              return supplier.id !== item.id;
            });
            supplierRecommendListArray[0] = res;
          });
        if (res && res.length > 0) {
          // res = res.filter((item) => item.status === 'ON_SALE');
          res = res.filter((item) => item.approveStatus === 'APPROVED');
        }
        return (
          <>
            <SearchBar
              // onChange={handleChange}
              data={data}
              params={params}
              setRecommendedSuppliers={setRecommendedSuppliers}
              setTotal={setTotal}
              // searchHolder={
              //   // setSearchKey
              //   // (searchKey && searchKey) ||
              //   // (checkKey(idRequest) ? localStorage.getItem(`searchkey_${idRequest}`) : data.productName)
              // }
              idSearch="addSupplier"
              setParams={setParams}
              setSearchKey={setSearchKey}
              idElement={idRequest}
              searchKey={searchKey}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
            <div
              id="scrollableDiv"
              className="list__products__scroll h-[430px] mt-8 overflow-auto pr-4 overflow-y-auto"
            >
              <InfiniteScroll
                dataLength={res?.length || 0}
                next={() => {
                  setParams((prev) => prev + 8);
                }}
                hasMore={hasMore}
                scrollableTarget="scrollableDiv"
              >
                <List
                  isLoading={isLoading}
                  className="list-importGoodsNonBal-product list__products__scroll"
                  dataSource={res || []}
                  renderItem={(item) => {
                    return res.length > 0 ? (
                      <List.Item key={item.id}>
                        <SupplierCard
                          item={item}
                          choosingSupplier={choosingSupplier}
                          setChoosingSupplier={setChoosingSupplier}
                          handleChange={prop[0]}
                        />
                      </List.Item>
                    ) : (
                      <img className="mx-auto" src={ImgProduct}></img>
                    );
                  }}
                />
              </InfiniteScroll>
            </div>

            {/* {res && res.length >= 0 && (
              <div
                className={
                  `list-supplier sm:mt-0 mt-4 sm:ml-0 ml-3  flex sm:gap-5 gap-4 sm:my-4 flex-wrap max-h-[50vh] ` +
                  (res.length > 4 ? 'overflow-y-scroll' : 'overflow-y-hidden')
                }
                id="scrollableDiv"
                // ref={scrollRef}
                // onScroll={onScroll}
              >
                {isLoadingSkeleton && <Skeleton />}
                {res.length > 0 ? (
                  res.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="card-item sm:w-[23%] md:w-[30%] w-[45%] bg-white rounded-md mb-3 shadow-xl sm:p-3  hover:shadow-2xl hover:bg-green-100 transition-all cursor-pointer relative h-[215px] text-center"
                      >
                        <SupplierCard
                          item={item}
                          choosingSupplier={choosingSupplier}
                          setChoosingSupplier={setChoosingSupplier}
                          handleChange={prop[0]}
                        />
                      </div>
                    );
                  })
                ) : (
                  <img className="mx-auto" src={ImgProduct}></img>
                )}
              </div>
            )} */}
          </>
        );
      })}
      {ModalPrice((detailPrice) => {
        const DataPriceTable = React.lazy(() => import('./pricetable'));
        return (
          <div className="w-full">
            <div className="w-full sm:flex flex-row mb-1 text-base">
              <div className="w-full">
                <div className="w-full flex flex-row mb-1 text-base">
                  <div className="font-bold text-teal-900 w-[150px] flex-none">Tên sản phẩm:</div>
                  <div>{detailPrice?.product?.name}</div>
                </div>
              </div>
              <div className="w-full">
                <div className="w-full flex flex-row mb-1 text-base">
                  <div className="font-bold text-teal-900 w-[150px] flex-none">Nhà cung cấp:</div>
                  <div>{detailPrice?.supplierName}</div>
                </div>
              </div>
            </div>
            <div className="w-full sm:flex flex-row mb-1 text-base">
              <div className="w-full">
                <div className="w-full flex flex-row mb-5 text-base">
                  <div className="font-bold text-teal-900 w-[150px] flex-none">Đơn vị cơ bản:</div>
                  <div>{detailPrice?.product?.basicUnit}</div>
                </div>
              </div>
            </div>
            {Object.keys(detailPrice).length !== 0 && DataPriceTable && (
              <DataPriceTable idProduct={detailPrice.idProduct} />
            )}
          </div>
        );
      })}
    </Fragment>
  );
};
export default Page;
