import React, { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate} from 'react-router';
// import { routerLinks } from 'utils';
import { useAuth } from 'global';
import { HookDataTable, HookModalForm } from 'hooks';

// import HookModal from './modal';
import {  ColumnContractSupplierNStore, ColumnRequest } from 'columns/connect-management';
import { ConnectManagementService } from 'services/connect-management';
import './index.less';
import { routerLinks } from 'utils';
// import { Tabs } from 'antd';
// import { routerLinks } from 'utils';
// const { TabPane } = Tabs;

const Page = () => {
  const { t } = useTranslation();
  const mount = useRef(false);
  const { formatDate, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const initFunction = useCallback(async () => {
    if (!mount.current) {
      mount.current = true;
    }
  }, [mount]);

  const roleCode = user?.userInfor?.roleCode;
  useEffect(() => {
    initFunction();
  }, [initFunction, pathname]);

  const [, ModalForm] = HookModalForm({
    className: 'request',
    // title: (data) => (data?.id ? 'Chi tiết yêu cầu' : 'Yêu cầu thêm sản phẩm'),
    title: (data) => 'Yêu cầu thêm sản phẩm',
    isLoading,
    setIsLoading,
    handleChange: async () => await handleChange(),
    columns: ColumnRequest({}),
    // GetById: ConnectManagementService.getById,
    Post: ConnectManagementService.post,
    widthModal: 600,
    idElement: 'ConnectManagement',
    textSubmit: 'Yêu cầu sản phẩm',
  });

  // const [handleDetail, ModalDetailForm] = HookModal({
  //   className: 'detail',
  //   // title: (data) => (data?.id ? 'Chi tiết yêu cầu' : 'Yêu cầu thêm sản phẩm'),
  //   title: (data) => 'Chi tiết yêu cầu',
  //   isLoading,
  //   setIsLoading,
  //   handleChange: async () => await handleChange(),
  //   columns: ColumnRequest({}),
  //   onOk: async (data) => {},
  //   GetById: ConnectManagementService.getById,
  //   Post: ConnectManagementService.post,
  //   widthModal: 550,
  //   idElement: 'ConnectManagement',
  //   textSubmit: 'Lưu',
  // });

  const [handleChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => {
        // handleDetail(data);
        navigate(routerLinks('ContractDetailBetweenStoreNSupplier') + `?id=${data.id}`);
      },
    }),
    save: false,
    isLoading,
    setIsLoading,
    Get: ConnectManagementService.getContractBetweenStoreNSupplier,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} hợp đồng`,
    columns: ColumnContractSupplierNStore({
      t,
      formatDate,
      handleChange: async () => await handleChange(),
      roleCode,
    }),
    // rightHeader: roleCode === 'OWNER_STORE' && (
    //   <Fragment>
    //     <button
    //       className="bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center"
    //       onClick={() => handleEdit()}
    //     >
    //       <i className="las la-plus mr-1" />
    //       {'Thêm yêu cầu'}
    //     </button>
    //   </Fragment>
    // ),
  });

  // const [handleContractChange, DataContractTable] = HookDataTable({
  //   onRow: (data) => ({
  //     onClick: (event) => {
  //       handleDetail(data);
  //     },
  //   }),
  //   save: false,
  //   isLoading,
  //   setIsLoading,
  //   Get: ConnectManagementService.getContract,
  //   pageSizeRender: (page) => page,
  //   pageSizeWidth: '70px',
  //   paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`,
  //   columns: ColumnContract({
  //     t,
  //     formatDate,
  //     handleChange: async () => await handleContractChange(),
  //   }),
  //   rightHeader: (
  //     <Fragment>
  //       <button
  //         className="bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center"
  //         onClick={() => handleEdit()}
  //       >
  //         <i className="las la-plus mr-1" />
  //         {'Thêm cửa hàng'}
  //       </button>
  //     </Fragment>
  //   ),
  // });

//   let tabPaneTitle;
//   switch (roleCode) {
//     case 'ADMIN':
//       tabPaneTitle = 'Quản lý yêu cầu';
//       break;
//     case 'OWNER_SUPPLIER':
//       tabPaneTitle = 'Danh sách kết nối';
//       break;
//     case 'OWNER_STORE':
//       tabPaneTitle = 'Yêu cầu sản phẩm';
//       break;
//   }

  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="text-2xl font-bold text-teal-900 mb-8">Hợp đồng kết nối</p>
        <div className="bg-white pt-6 pb-10 px-6 rounded-md">
          {DataTable()} {ModalForm()}{' '}
          {/* {ModalDetailForm((data) => {
            let status;
            switch (data.status) {
              case 'APPROVED':
                status = 'Đã phê duyệt';
                break;
              case '2':
                status = 'WAITING_APPROVE';
                break;
              case '3':
                status = 'NOT_APPROVED';
                break;
            }
            return (
              <div className="w-full">
                <div className="w-full flex flex-row mb-5">
                  <div className="font-bold text-black detailCol">Mã yêu cầu</div>
                  <div>{data.code}</div>
                </div>
                <div className="w-full flex flex-row mb-5">
                  <div className="font-bold text-black detailCol">Tên sản phẩm</div>
                  <div>{data.productName}</div>
                </div>
                <div className="w-full flex flex-row mb-5">
                  <div className="font-bold text-black detailCol">Trạng thái</div>
                  <div>{status}</div>
                </div>
              </div>
            );
          })} */}
        </div>
      </div>
    </Fragment>
  );
};
export default Page;