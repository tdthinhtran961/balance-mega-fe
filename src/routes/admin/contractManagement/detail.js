import React, { Fragment, useEffect, useState } from 'react';
import { Message } from 'components';
// import SearchBar from './search';
import './index.less';
// import { Form } from 'components';
import ImgProduct from '../../../assets/images/imgproduct.png';
import { Skeleton } from 'antd';
import { useLocation } from 'react-router-dom';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { useAuth } from 'global';
import { ConnectManagementService } from 'services/connect-management';
// import { HookDataTable } from 'hooks';
import { ColumnSupplier, ColumnRefuse } from 'columns/connect-management';
import { useTranslation } from 'react-i18next';
import HookModal from './modal';
import HookModalForm from './modal/form';
import SupplierCard from './supplierCard';
import HookDataTableModify from './data-table';
// import { Form } from 'antd';
const Page = () => {
  // const [form] = FormAnt.useForm();
  const location = useLocation();
  const { t } = useTranslation();
  const [isLoadingSkeleton, setLoadingSkeleton] = useState(false);
  const navigate = useNavigate();
  const { user, formatDate } = useAuth();
  const urlSearch = new URLSearchParams(location.search);
  const idRequest = urlSearch.get('id');
  const [data, setData] = useState({});
  const [approvedSupplier, setApprovedSupplier] = useState({});
  const [supplierList, setSupplierList] = useState([]);
  const roleCode = user?.userInfor?.roleCode;
  const [isLoading, setIsLoading] = useState(false);
  // const { Search } = Input;

  useEffect(() => {
    const getDataRequest = async () => {
      try {
        const res = await ConnectManagementService.getById(parseInt(idRequest));
        if (res && res.status === 'APPROVED') {
          const idApproved = res.storeRequestSupplier.findIndex((item) => {
            return item.status === 'APPROVED';
          });
          setApprovedSupplier(res.storeRequestSupplier[idApproved].supplier);
        }
        setData(res);
      } catch (error) {
        console.log(error);
        return false;
      }
    };
    getDataRequest();
  }, []);

  useEffect(() => {
    if (data && data.status === 'APPROVED') {
      const idApproved = data.storeRequestSupplier.findIndex((item) => {
        return item.status === 'APPROVED';
      });
      setApprovedSupplier(data.storeRequestSupplier[idApproved].supplier);
    }
  });

  useEffect(() => {
    const getSupplierList = async () => {
      try {
        setLoadingSkeleton(true);
        const res = await ConnectManagementService.getSupplier(idRequest);
        setSupplierList(res);
        setLoadingSkeleton(false);
      } catch (error) {
        console.log(error);
        return false;
      }
    };
    getSupplierList();
  }, []);

  const convertAddress = (address) => {
    const res = Object.values(address)
      .slice(1, -1)
      .reduce((acc, item) => {
        if (item) return (acc += item + ', ');
        return acc;
      }, '');
    if (res[res.length - 2] === ',') {
      return res.slice(0, -2);
    }
    return res;
  };

  const formatTime = (time) => {
    const timer = new Date(time);
    const yyyy = timer.getFullYear();
    let mm = timer.getMonth() + 1; // Months start at 0!
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
  if (supplierList && supplierList.data && supplierList.data.length >= 0) {
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
  const statusCheck = data?.status;
  // const listReason = [
  //   {
  //     value: 'Gạo ST25',
  //     label: 'Gạo ST25',
  //   },
  //   {
  //     value: 'Gạo lứt',
  //     label: 'Gạo lứt',
  //   },
  //   {
  //     value: 'other',
  //     label: 'Khác',
  //   },
  // ];
  const [handleChange, DataTable] = HookDataTableModify({
    onRow: (data) => ({
      onClick: async (event) => {
        if (event.target.tagName === 'BUTTON') {
          // console.log('OK');
          if (roleCode === 'OWNER_STORE') {
            const res = await ConnectManagementService.storeAcceptSupplier(data.id);
            res && Message.success({ text: `Kết nối thành công` });
            return navigate(`${routerLinks('ConnectManagement')}`);
          }
          return;
        }
        // if (event.target.innerHtml)
        // handleDetail(data);
        // navigate(routerLinks('RequestDetail') + `?id=${data.id}`);
        handleDetail(data);
        if (event.target.tagName === 'SPAN') {
          // const finalList = choosingSupplier.filter((item) => item.id !== data.id);
          // console.log(finalList);
          // console.log(choosingSupplier);
          // localStorage.setItem('supplier requestList', finalList)
          // setChoosingSupplier(finalList)
          // // setChoosingSupplier((prevChoosingSupplier)=>({}));
          // handleChange();
          // console.log(choosingSupplier);
          // console.log('delete thành công');
          // return true;
          if (roleCode === 'ADMIN') {
            const res = await ConnectManagementService.adminDeleteSuggestedSupplier(data.id);
            res && Message.success({ text: `Kết nối thành công` });
            // return navigate(`${routerLinks('ConnectManagement')}`);
          }
          return;
        }
      },
    }),
    save: false,
    isLoading,
    showSearch: false,
    setIsLoading,
    idProp: idRequest,
    Get: ConnectManagementService.getSupplier,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} người dùng`,
    columns: ColumnSupplier({
      t,
      formatDate,
      handleChange: async () => await handleChange(),
      roleCode,
      statusCheck,
    }),
    // rightHeader: (
    //   <Fragment>
    //     <button
    //       className="bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center"
    //       onClick={()=>{}}
    //     >
    //       <i className="las la-plus mr-1" />
    //       {'Thêm yêu cầu'}
    //     </button>
    //   </Fragment>
    // ),
  });

  const [handleDetail, ModalDetailForm] = HookModal({
    className: 'detailSupplier',
    // title: (data) => (data?.id ? 'Chi tiết yêu cầu' : 'Yêu cầu thêm sản phẩm'),
    title: (data) => 'Chi tiết yêu cầu',
    isLoading,
    setIsLoading,
    handleChange: async () => await handleChange(),
    columns: ColumnSupplier({
      // t,
      // formatDate,
      // listProduct,
    }),
    onOk: async (data) => {
      const res = await ConnectManagementService.storeAcceptSupplier(data.id);
      res && Message.success({ text: `Kết nối thành công` });
      return navigate(`${routerLinks('ConnectManagement')}`);
    },
    GetById: ConnectManagementService.getByIdSupplier,
    // Post: ConnectManagementService.post,
    widthModal: 1000,
    idElement: 'ConnectManagement',
    textSubmit: 'Yêu cầu kết nối',
    textCancel: 'Trở về',
    showSubmitButton: roleCode === 'OWNER_STORE',
  });

  const [handleAddSupplier, ModalAddSupplierForm] = HookModal({
    className: 'addSupplier',
    // title: (data) => (data?.id ? 'Chi tiết yêu cầu' : 'Yêu cầu thêm sản phẩm'),
    title: (data) => 'Thêm nhà cung cấp',
    isLoading,
    setIsLoading,
    handleChange: async () => await handleChange(),
    columns: ColumnSupplier({
      // t,
      // formatDate,
      // listProduct,
    }),
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
      if (supplierList?.data.length === 0) {
        const newlist = await ConnectManagementService.getSupplier(idRequest);

        setSupplierList(newlist);
      }
      // console.log('res', res);
      // setSupplierList();
      await handleChange();
      // return navigate(`${routerLinks('ConnectManagement')}/detail?id=${idRequest}`);
      return true;
    },
    keyWord: data.productName,
    // GetById: ConnectManagementService.getByIdSupplier,
    Get: ConnectManagementService.getSupplierWithProduct,
    // Post: ConnectManagementService.post,
    widthModal: 1000,
    idElement: 'ConnectManagement',
    textSubmit: 'Thêm nhà cung cấp',
    textCancel: 'Trở về',
    search: true,
    searchHolder: data.productName,
    inputSearch: 'addSupplier',
    // showSubmitButton: roleCode === 'OWNER_STORE',
  });

  const [handleRefuse, ModalRefuseForm] = HookModalForm({
    className: 'refuse',
    // title: (data) => (data?.id ? 'Chi tiết yêu cầu' : 'Yêu cầu thêm sản phẩm'),
    title: (data) => 'Từ chối yêu cầu sản phẩm',
    isLoading,
    setIsLoading,
    handleChange: async () => await handleChange(),
    columns: ColumnRefuse({
      roleCode,
      idRequest: parseInt(idRequest),
    }),
    // GetById: ConnectManagementService.getById,
    Put:
      roleCode === 'OWNER_STORE'
        ? ConnectManagementService.storeRejectSupplier
        : ConnectManagementService.adminRejectStore,
    widthModal: 600,
    idElement: 'ConnectManagement',
    textSubmit: 'Gửi',
    textCancel: 'Hủy thao tác',
    navigate: true,
  });

  // const onSearch = () => {
  //   console.log('search');
  // };

  const [choosingSupplier, setChoosingSupplier] = useState([]);
  // const[showTick, setShowTick]=useState(false);

  // const handleChoose = (choosingItem) => {
  //   console.log('id đang chọn', choosingItem.id);
  //   const indexChoosedSupplier = choosingSupplier?.findIndex((supplier) => supplier.id === choosingItem.id);
  //   console.log(indexChoosedSupplier);
  //   if (indexChoosedSupplier !== -1) {
  //     choosingSupplier.splice(indexChoosedSupplier, 1);
  //     console.log(choosingSupplier);
  //     setShowTick(false)
  //   } else {
  //     choosingSupplier.push(choosingItem);
  //     console.log(choosingSupplier);
  //     setShowTick(true)
  //   }
  //   setChoosingSupplier(choosingSupplier)
  //   return choosingSupplier;
  // };

  const handleAdminAccept = async (idRequest) => {
    const res = await ConnectManagementService.adminApproveStore(idRequest);
    res && Message.success({ text: `Phê duyệt thành công` });
    return navigate(routerLinks('ConnectManagement'));
  };

  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="text-2xl text-teal-900">Thông tin yêu cầu</p>

        <div className="bg-white w-full px-4 rounded-xl mt-5 relative pb-5">
          {/* Section chung tất cả */}
          <div className="flex flex-row items-center">
            <p className="text-xl font-bold text-teal-900 py-4 mr-5">Chi tiết yêu cầu</p>
          </div>
          <div className="w-full flex flex-row">
            <div className="w-full">
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Mã yêu cầu:</div>
                <div>{data.code}</div>
              </div>
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Trạng thái:</div>
                <div>{statusLetter}</div>
              </div>
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Tên sản phẩm</div>
                <div>{data.productName}</div>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Ngày yêu cầu:</div>
                <div>{formatTime(data.requestedAt)}</div>
              </div>
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Ngày phê duyệt:</div>
                <div>{formatTime(data.approvedAt)}</div>
              </div>
              <div className="w-full flex flex-row mb-5">
                {/* <div className="font-bold text-teal-900 mr-5">Yêu cầu chi tiết về sản phẩm:</div>
                <div>{data.description}</div> */}
              </div>
            </div>
          </div>
          <div className="w-full mb-5">
            <span className="font-bold text-teal-900 mr-5">Yêu cầu chi tiết về sản phẩm:</span>
            <span>{data.description}</span>
          </div>
          <hr />
          {/* Check các điều kiện userRole + status */}
          {((roleCode === 'ADMIN' &&
            (data.status === 'APPROVED' || data.status === 'NOT_APPROVED' || data.status === 'WAITING_ADMIN')) ||
            ((roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && data.status === 'APPROVED')) && (
            <>
              {' '}
              <div className="flex flex-row items-center">
                <p className="text-xl font-bold text-teal-900 py-4 mr-5">Thông tin cửa hàng</p>
              </div>
              <div className="w-full flex flex-row">
                <div className="w-full">
                  <div className="w-full flex flex-row mb-5">
                    <div className="font-bold text-teal-900 order w-[150px]">Cửa hàng:</div>
                    <div>{data.store.name}</div>
                  </div>
                  <div className="w-full flex flex-row mb-5">
                    <div className="font-bold text-teal-900 order w-[150px]">Số điện thoại:</div>
                    <div>{data.store?.userRole[0]?.userAdmin?.phoneNumber}</div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-row mb-5">
                    <div className="font-bold text-teal-900 order w-[150px]">Tên chủ cửa hàng:</div>
                    <div>{data.store?.userRole[0]?.userAdmin?.name}</div>
                  </div>
                  <div className="w-full flex flex-row mb-5">
                    <div className="font-bold text-teal-900 order w-[150px]">Địa chỉ:</div>
                    <div>{data.storeAddress}</div>
                  </div>
                </div>
              </div>
              <hr />
            </>
          )}

          {/* Section: store view + status đã phê duyệt / admin view + status đã phê duyệt và không bị từ chối / supplier
          view */}
          {
            // (roleCode === 'OWNER_STORE' ||
            //   roleCode === 'ADMIN' ||
            //   roleCode === 'OWNER_SUPPLIER') &&

            data && data.status === 'APPROVED' && approvedSupplier && (
              <>
                {' '}
                <div className="flex flex-row items-center">
                  <p className="text-xl font-bold text-teal-900 py-4 mr-5">Thông tin nhà cung cấp</p>
                </div>
                <div className="w-full flex flex-row">
                  <div className="w-full">
                    <div className="w-full flex flex-row mb-5">
                      <div className="font-bold text-teal-900 order w-[150px]">Nhà cung cấp:</div>
                      <div>{approvedSupplier?.name}</div>
                    </div>
                    <div className="w-full flex flex-row mb-5">
                      <div className="font-bold text-teal-900 order w-[150px]">Số điện thoại:</div>
                      <div>{approvedSupplier?.userRole[0]?.userAdmin?.phoneNumber}</div>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="w-full flex flex-row mb-5">
                      <div className="font-bold text-teal-900 order w-[150px]">Tên chủ cửa hàng:</div>
                      <div>{data.store?.userRole[0]?.userAdmin?.name}</div>
                    </div>
                    <div className="w-full flex flex-row mb-5">
                      <div className="font-bold text-teal-900 order w-[150px]">Địa chỉ:</div>
                      <div>{convertAddress(approvedSupplier?.address)}</div>
                    </div>
                  </div>
                </div>
                <hr />
              </>
            )
          }
          {(data.status === 'REJECT_BY_ADMIN' || data.status === 'REJECT_BY_STORE') && (
            <>
              {' '}
              <p className="text-xl font-bold text-teal-900 py-4 mr-5">Chi tiết </p>
              {/* <div className="w-full mb-5 flex gap-[4rem]">
                <div className="left-label">
                  <p className="font-bold text-teal-900 mb-2 w-[150px]">Ngày phản hồi:</p>
                  <p className="font-bold text-teal-900 mb-2 w-[150px]">Từ chối bởi:</p>
                  <p className="font-bold text-teal-900 mb-2 w-[150px]">Lý do:</p>
                </div>
                <div className="right-content">
                  <p className="mb-2">{data.responseDate}</p>
                  <p className="mb-2">{data.refusedBy}</p>
                  <p className="mb-2">{data.reason}</p>
                </div>
              </div> */}
              <div className="w-full flex flex-row">
                <div className="w-full">
                  <div className="w-full flex flex-row mb-5">
                    <div className="font-bold text-teal-900 order w-[150px]">Ngày phản hồi:</div>
                    <div>{formatTime(data.approvedAt)}</div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-row mb-5">
                    <div className="font-bold text-teal-900 order w-[150px]">Từ chối bởi:</div>
                    <div>{data.status === 'REJECT_BY_ADMIN' ? 'Quản trị viên' : 'Chủ cửa hàng'}</div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 order w-[150px]">Lý do:</div>
                <div>{data.reason + ' (' + data.note + ')'}</div>
              </div>
              <hr />
            </>
          )}

          {((data.status === 'WAITING_ADMIN' && roleCode === 'ADMIN') || data.status === 'WAITING_STORE') && (
            <>
              <div className="flex items-center justify-between">
                {((roleCode === 'OWNER_STORE' && supplierList && supplierList?.data?.length > 0) ||
                  roleCode === 'ADMIN') && (
                  <p className="text-xl font-bold text-teal-900 py-4 mr-5">Danh sách nhà cung cấp</p>
                )}
                {roleCode === 'ADMIN' && (
                  <Fragment>
                    <button
                      className="bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center"
                      onClick={() => handleAddSupplier()}
                    >
                      <i className="las la-plus mr-1" />
                      {t('Thêm nhà cung cấp')}
                    </button>
                  </Fragment>
                )}
                {roleCode === 'OWNER_STORE' && supplierList && supplierList.data && supplierList.data.length > 0 && (
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
              {supplierList && supplierList?.data?.length > 0 && DataTable()}
            </>
          )}
          <div className="flex justify-between mt-10 ">
            <button
              onClick={() => {
                navigate(`${routerLinks('ConnectManagement')}`);
              }}
              className="px-8 bg-white-500 border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-xl text-teal-900 hover:text-teal-600 mt-1"
              id="backBtn"
            >
              Trở về
            </button>
            {/* {roleCode === 'OWNER_STORE' && data.status === 'WAITING_ADMIN' && (
              <>
                <button
                  onClick={() => {
                    handleRefuse();
                  }}
                  className="px-8 bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 border-solid border
        text-base p-2 rounded-xl text-white mt-1"
                  id="refusedAllBtn"
                >
                  Từ chối tất cả
                </button>
              </>
            )} */}
            {roleCode === 'ADMIN' && data.status === 'WAITING_ADMIN' && (
              <>
                <div className="flex justify-end items-end text-sm">
                  <button
                    onClick={async () => handleRefuse({ ...data, note: null })}
                    className="px-4 bg-red-500 text-white text-base p-2 rounded-xl hover:bg-red-400 mt-1 mr-4"
                    id="refusedBtn"
                  >
                    Từ chối yêu cầu
                  </button>
                  <button
                    onClick={() => {
                      handleAdminAccept(idRequest);
                    }}
                    className="px-4 bg-teal-900 text-white text-base p-2 rounded-xl hover:bg-teal-600 mt-1 disabled:bg-gray-300 disabled:text-gray-400 disabled:hover:bg-gray-300"
                    disabled={!supplierList || !supplierList.data || supplierList?.data?.length <= 0}
                    id="saveBtn"
                  >
                    Phê duyệt yêu cầu
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {ModalRefuseForm()}
      {ModalDetailForm((data) => {
        // let status;
        // switch (data.status) {
        //   case '1':
        //     status = 'Đã phê duyệt';
        //     break;
        //   case '2':
        //     status = 'Chờ phê duyệt';
        //     break;
        //   case '3':
        //     status = 'Từ chối';
        //     break;
        // }
        return (
          <div className="w-full">
            <div className="flex flex-row items-center">
              <p className="text-base font-bold text-teal-900 pb-4 mr-5">Thông tin nhà cung cấp</p>
            </div>
            <div className="w-full flex flex-row">
              <div className="w-full">
                <div className="w-full flex flex-row mb-5">
                  <div className="font-bold text-teal-900 w-[150px]">Nhà cung cấp:</div>
                  <div>{data.supplierName}</div>
                </div>
                {/* <div className="w-full flex flex-row mb-5">
                  <div className="font-bold text-teal-900 w-[150px]">Số điện thoại</div>
                  <div>{data.pNumber}</div>
                </div> */}
              </div>
              <div className="w-full">
                {/* <div className="w-full flex flex-row mb-5">
                  <div className="font-bold text-teal-900 w-[150px]">Tên chủ cửa hàng:</div>
                  <div>{data.owner}</div>
                </div> */}
                <div className="w-full flex flex-row mb-5">
                  <div className="font-bold text-teal-900 w-[150px]">Địa chỉ giao hàng:</div>
                  <div>{data.address}</div>
                </div>
              </div>
            </div>
            <hr />
            <div className="flex flex-row items-center pt-4">
              <p className="text-base font-bold text-teal-900 mb-5">Chi tiết sản phẩm</p>
            </div>
            <div className="flex flex-row w-full">
              {/* Left form */}
              <div className="bg-white relative w-[35%] pb-5 rounded-xl shadow-lg" style={{ height: 'fit-content' }}>
                <div className="flex justify-center flex-col items-center ">
                  <img
                    src={data.product?.photos.length > 0 && data.product?.photos[0].url}
                    alt="productImage"
                    className="w-3/4 aspect-square object-cover rounded-xl shadow-md"
                  />
                  <div className="flex flex-grow items-center px-5 mt-5 justify-between">
                    {data.product?.photos.length > 0 &&
                      data.product?.photos
                        .slice(1)
                        .map((photo) => (
                          <img src={photo.url} alt="productImage" className="detailImage" key={photo.id} />
                        ))}
                    {/* <img src={data.imageProduct} alt="productImage" className="detailImage" />
                    <img src={data.imageProduct} alt="productImage" className="detailImage" />
                    <img src={data.imageProduct} alt="productImage" className="detailImage" /> */}
                  </div>
                </div>
              </div>
              {/* Right form */}
              <div className="bg-white relative w-[65%] rounded-xl shadow-lg px-5 ml-2">
                {/* <p className="text-2xl font-bold text-teal-900 mb-5">{data.productName}</p> */}
                <div className="w-full flex flex-row mb-5">
                  <div className="font-bold text-black w-[150px]">Tên sản phẩm:</div>
                  <div>{data.productName}</div>
                </div>
                <p className="text-2xl text-teal-900 mb-5">{data.discountPrice}</p>
                <hr />
                {/* <Form
                  className="mt-3 w-full"
                  columns={ColumnSupplier({ roleCode })}
                  // handSubmit={submit}
                  checkHidden={true}
                  values={data}
                  form={form}
                /> */}
                <div className="mt-3 w-full">
                  <div className="mb-3">
                    <div className="font-bold text-black">Mô tả sản phẩm:</div>
                    <p>{data.product?.description}</p>
                  </div>
                  <div className="w-full flex flex-row">
                    <div className="w-full">
                      <div className="w-full flex flex-row mb-5">
                        <div className="font-bold text-black w-[110px]">Mã sản phẩm:</div>
                        <div>{data.product?.code}</div>
                      </div>
                      <div className="w-full flex flex-row mb-5">
                        <div className="font-bold text-black w-[110px]">Thương hiệu:</div>
                        <div>{data.product?.brand}</div>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full flex flex-row mb-5">
                        <div className="font-bold text-black w-[110px]">Mã vạch:</div>
                        <div>{data.product?.barcode}</div>
                      </div>
                      <div className="w-full flex flex-row mb-5">
                        <div className="font-bold text-black w-[110px]">Danh mục:</div>
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
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {ModalAddSupplierForm((supplierRecommendList) => {
        return (
          <>
            <div className="flex items-center flex-row gap-3">
              {/* <Search placeholder="Nhập sản phẩm" onSearch={onSearch} style={{ width: 200 }} className="ml-2" /> */}
              {/* <SearchBar placeholder={data.productName} idElement="addSupplier" /> */}
            </div>
            <div className="list-supplier flex gap-5 my-4 flex-wrap max-h-[92vh] overflow-y-scroll">
              {isLoadingSkeleton && <Skeleton />}
              {supplierRecommendList && Object.values(supplierRecommendList).length > 0 ? (
                Object.values(supplierRecommendList).map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="card-item w-[23%] bg-white rounded-md mb-3 shadow-xl p-3 hover:shadow-2xl hover:bg-red-100 transition-all cursor-pointer relative h-[215px] text-center"
                      // onClick={() => {
                      //   handleChoose(item);
                      // }}
                    >
                      <SupplierCard
                        item={item}
                        choosingSupplier={choosingSupplier}
                        setChoosingSupplier={setChoosingSupplier}
                      />
                    </div>
                  );
                })
              ) : (
                <img className="mx-auto" src={ImgProduct}></img>
              )}
            </div>
          </>
        );
      })}
    </Fragment>
  );
};
export default Page;
