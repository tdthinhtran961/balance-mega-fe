import React, { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
// import { routerLinks } from 'utils';
import { useAuth } from 'global';
import { HookDataTable, HookModalForm } from 'hooks';
// import HookModalForm from './modal/form';
// import HookModal from './modal';
import { ColumnRequest } from 'columns/connect-management';
import { ConnectManagementService } from 'services/connect-management';
import './index.less';
import { routerLinks } from 'utils';
import { ERole } from 'variable';

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

  const [handleEdit, ModalForm] = HookModalForm({
    className: 'request',
    title: (data) => 'Yêu cầu thêm sản phẩm',
    isLoading,
    setIsLoading,
    handleChange: async () => await handleChange(),
    columns: ColumnRequest({}),
    Post: ConnectManagementService.post,
    widthModal: 600,
    idElement: 'ConnectManagement',
    textSubmit: 'Yêu cầu sản phẩm',
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
              'py-2.5 px-2 bg-teal-900 text-white text-base p-2 rounded-xl hover:bg-teal-600 mt-1 w-[166px] text-center submitbtn'
            }
            onClick={handleOk}
          >
            {/* {isLoading && <i className="las la-spinner mr-1 animate-spin" />} */}
            {'Yêu cầu sản phẩm'}
          </button>
        }
      </div>
    ),
  });

  const [handleChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => {
        navigate(routerLinks('RequestDetail') + `?id=${data.id}`);
      },
    }),
    save: true,
    isLoading,
    setIsLoading,
    Get:
      roleCode !== 'OWNER_SUPPLIER' && roleCode !== 'DISTRIBUTOR'
        ? ConnectManagementService.get
        : ConnectManagementService.getConnectList,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} yêu cầu`,
    columns: ColumnRequest({
      t,
      formatDate,
      handleChange: async () => await handleChange(),
      roleCode,
    }),
    rightHeader: (roleCode === 'OWNER_STORE' || roleCode === ERole.sales) && (
      <Fragment>
        <button
          className="bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center w-[173px] justify-center"
          onClick={() => handleEdit()}
        >
          <i className="las la-plus mr-1" />
          {'Thêm yêu cầu'}
        </button>
      </Fragment>
    ),
    className: 'request data-table',
  });

  let tabPaneTitle;
  switch (roleCode) {
    case 'ADMIN':
      tabPaneTitle = 'Kết nối';
      break;
    case 'OWNER_SUPPLIER' || 'DISTRIBUTOR':
      tabPaneTitle = 'Kết nối';
      break;
    case 'OWNER_STORE':
      tabPaneTitle = 'Kết nối';
      break;
    case ERole.sales:
      tabPaneTitle = 'Kết nối';
    break;
  }
  
  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="text-2xl font-bold text-teal-900 mb-8">{tabPaneTitle}</p>
        <div className="bg-white pt-6 pb-10 px-6 rounded-md">
          {DataTable()} {ModalForm()}{' '}
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
