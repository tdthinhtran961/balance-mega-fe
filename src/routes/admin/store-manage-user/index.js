import React, { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { routerLinks } from 'utils';
import { useAuth } from 'global';
import { HookDataTable } from 'hooks';
import { ColumnStoreManageUser } from 'columns/store-manage-user';
import { StoreUserManagementService } from 'services/store-user-management';
const Page = () => {
  const { t } = useTranslation();
  const mount = useRef(false);
  const { formatDate } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    
  }, []);

  const initFunction = useCallback(async () => {
    if (!mount.current) {
      mount.current = true;
    }
  }, [mount]);

  useEffect(() => {
    initFunction();
  }, [initFunction, pathname]);

  const [handleChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => {
        navigate(routerLinks('StoreManageUserEdit') + `?id=${data.id}`);
      },
    }),
    isLoading,
    setIsLoading,
    Get: async (params) => {
      return await StoreUserManagementService.get(params)
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} người dùng`,
    columns: ColumnStoreManageUser({
      t,
      formatDate,
      handleChange: async () => await handleChange(),
    }),
    rightHeader: (
      <Fragment>
        <button
          className="bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center w-[183px] justify-center"
          onClick={() => navigate(routerLinks('StoreManageUserAdd'))}
        >
          <i className="las la-plus mr-1" />
          {t('Thêm quản trị viên')}
        </button>
      </Fragment>
    ),
  });

  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="text-2xl font-bold text-teal-900 mb-8">Người dùng</p>
        <div className="bg-white pt-6 pb-10 px-6 rounded-md">
          {DataTable()}
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
