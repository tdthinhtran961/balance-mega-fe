import React, { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { HookDataTable } from 'hooks';
import { routerLinks } from 'utils';
import { StoreService } from 'services/store';
import { ColumnStoreTable } from 'columns/store';
import { useAuth } from 'global';
import './index.less';
import { Input } from 'antd';
const { Search } = Input;
const Page = () => {
  const timeout = useRef();
  const mount = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, set_changSearch } = useAuth();
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

  // const navigateEdit = (id) => {
  //   return navigate(routerLinks('StoreEdit') + `?id=${id}`);
  // };
  // const navigateDetail = (id) => {
  //   return navigate(routerLinks('StoreDetail') + `?id=${id}`);
  // };

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
    handleTableChange();
    navigateWithParams('Quản lý cửa hàng', {
      fullTextSearch,
    });
  }, [fullTextSearch]);

  const [handleTableChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => navigate(routerLinks('StoreEdit') + `?id=${data.id}&text=${fullTextSearchURL}`),
    }),
    isLoading,
    setIsLoading,
    Get: async (params) => {
      return StoreService.get({ ...params, fullTextSearch, type: 'STORE' });
    },
    loadFirst: false,
    save: false,
    showSearch: false,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} cửa hàng`,
    columns: ColumnStoreTable({
      // navigateEdit,
      // navigateDetail,
      // handDelete: async (listId) => {
      //   (await StoreService.delete(listId)) && handleTableChange();
      // },
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
                set_changSearch(e.target.value);
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
            ' text-white w-[173px] h-[44px] font-normal justify-center rounded-[10px] inline-flex items-center bg-teal-900 hover:bg-teal-700'
          }
          onClick={() => navigate(routerLinks('StoreCreate'))}
          id="addBtn"
        >
          <i className="las la-plus mr-1 bold"></i>
          {' Thêm cửa hàng'}
        </button>
      </Fragment>
    ),
  });

  return (
    <Fragment>
      <div className="table-store min-h-screen ">
        <p className="text-2xl font-bold text-teal-900 mb-6">Quản lý cửa hàng</p>
        <div className="bg-white pt-6 pb-10 px-6 rounded-md table-store">{DataTable()}</div>
      </div>
    </Fragment>
  );
};
export default Page;
