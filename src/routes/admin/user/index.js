import React, { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { routerLinks } from 'utils';
import { useAuth } from 'global';
import { HookDataTable } from 'hooks';
import { ColumnUser } from 'columns/user';
import { UserService } from 'services/user';
import './index.less';
import { ColumnStoreManageUser } from 'columns/store-manage-user';
import { StoreUserManagementService } from 'services/store-user-management';
const Page = () => {
  const { t } = useTranslation();
  const mount = useRef(false);
  const { formatDate } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  let res = [];

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
        return roleCode === 'ADMIN'
          ? navigate(routerLinks('UserEdit') + `?id=${data.id}`)
          : roleCode === 'OWNER_STORE' 
          ? navigate(routerLinks('StoreManageUserEdit') + `?id=${data.id}`)
          : null;
      },
    }),
    isLoading,
    setIsLoading,
    Get: async (params) => {
      res =
        roleCode === 'ADMIN'
          ? UserService.get(params)
          : roleCode === 'OWNER_STORE' 
          ? StoreUserManagementService.get(params)
          : null;
      return res;
    },
    save: true,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} người dùng`,
    columns:
      roleCode === 'ADMIN'
        ? ColumnUser({
            t,
            formatDate,
            handleChange: async () => await handleChange(),
          })
        : roleCode === 'OWNER_STORE' 
        ? ColumnStoreManageUser({
            t,
            formatDate,
            handleChange: async () => await handleChange(),
          })
        : null,
    rightHeader: (
      <Fragment>
        {roleCode === 'ADMIN' ? (
          <button
            className="bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center w-[183px] justify-center"
            onClick={() => navigate(routerLinks('UserCreate'))}
          >
            <i className="las la-plus mr-1" />
            {t('Thêm quản trị viên')}
          </button>
        ) : roleCode === 'OWNER_STORE'  ? (
          <button
            className="bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center w-[183px] justify-center"
            onClick={() => navigate(routerLinks('StoreManageUserAdd'))}
          >
            <i className="las la-plus mr-1" />
            {t('Thêm quản trị viên')}
          </button>
        ) : null}
      </Fragment>
    ),
  });

  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="text-2xl font-bold text-teal-900 mb-8">Quản lý người dùng</p>
        <div className="bg-white pt-6 pb-10 px-6 rounded-md table-user">{DataTable()}</div>
      </div>
    </Fragment>
  );
};
export default Page;
