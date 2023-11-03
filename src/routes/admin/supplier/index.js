import React, { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { HookDataTable } from 'hooks';
import { routerLinks } from 'utils';
import { SupplierService } from 'services/supplier';
import { ColumnSupplierTable } from 'columns/supplier';
import { useAuth } from 'global';
import { Input } from 'antd';
import './index.less';
const { Search } = Input;

const Page = () => {
  const timeout = useRef();
  const mount = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, set_changSearchSupplier } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const fullTextSearchURL = urlSearch.get('fullTextSearch') !== null ? urlSearch.get('fullTextSearch') : '';
  const [fullTextSearch, setFullTextSearch] = useState(fullTextSearchURL ?? fullTextSearchURL);
  const initFunction = useCallback(async () => {
    if (!mount.current) {
      mount.current = true;
    }
  }, [mount]);
  const navigateEdit = (id) => {
    return navigate(routerLinks('SupplierEdit') + `?id=${id}`);
  };

  useEffect(() => {
    initFunction();
  }, [initFunction, pathname]);

  function navigateWithParams(routeName, params) {
    const navigateParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        navigateParams[key] = value;
      }
    });
    navigate(`${routerLinks(routeName)}?${new URLSearchParams(navigateParams).toString()}`);
  }

  useEffect(() => {
    handleChange();
    navigateWithParams('Supplier', {
      fullTextSearch,
    });
  }, [fullTextSearch]);

  const [handleChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => navigate(routerLinks('SupplierEdit') + `?id=${data.id}`),
    }),
    isLoading,
    setIsLoading,
    loadFirst: false,
    save: false,
    showSearch: false,
    Get: async (params) => {
      return SupplierService.get({ ...params, fullTextSearch, type: 'SUPPLIER' });
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} nhà cung cấp`,
    columns: ColumnSupplierTable({
      navigateEdit,
      // navigateDetail,
      handleChange: async () => await handleChange(),
    }),
    leftHeader: (
      <>
        <div className="relative lg:mb-6 w-full sm:w-[245px]">
          <div className="search-container search-product manager_order">
            <Search
              placeholder="Tìm kiếm"
              allowClear
              onChange={(e) => {
                setFullTextSearch(e.target.value);
                clearTimeout(timeout.current);
                set_changSearchSupplier(e.target.value);
              }}
              defaultValue={fullTextSearch}
              style={{
                width: 322,
              }}
            />
          </div>
          <i className="text-[18px] las la-search absolute top-3 left-5 sm:z-10 -rotate-90" />
        </div>
      </>
    ),
    rightHeader: roleCode === 'ADMIN' && (
      <Fragment>
        <button
          className={
            ' text-white h-10 justify-center rounded-[0.625rem] inline-flex items-center bg-teal-900 hover:bg-teal-700 px-3 sm:mt-0 mt-2'
          }
          onClick={() => navigate(routerLinks('SupplierCreate'))}
          id="addBtn"
        >
          <i className="las la-plus mr-1 bold"></i>
          {' Thêm nhà cung cấp'}
        </button>
      </Fragment>
    ),
  });

  return (
    <Fragment>
      <div className="table-category min-h-screen">
        <p className="text-2xl font-bold text-teal-900 mb-8">Quản lý nhà cung cấp</p>
        <div className="bg-white pt-6 pb-10 px-6 rounded-md">{DataTable()}</div>
      </div>
    </Fragment>
  );
};
export default Page;
