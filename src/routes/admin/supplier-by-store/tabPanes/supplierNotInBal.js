import React, { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { HookDataTable } from 'hooks';
import { routerLinks } from 'utils';
import { SupplierService } from 'services/supplier';

import '../index.less';
import { ColumnSupplierManagementByStore } from 'columns/supplier-by-store';
import { Input } from 'antd';
const { Search } = Input;

const SupplierManagementNotInBal = () => {
  const timeout = useRef();
  const mount = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const fullTextSearchURL = urlSearch.get('fullTextSearch') !== null ? urlSearch.get('fullTextSearch') : '';
  const [fullTextSearch, setFullTextSearch] = useState(fullTextSearchURL ?? fullTextSearchURL);
  const idStore = urlSearch.get('id');
  const initFunction = useCallback(async () => {
    if (!mount.current) {
      mount.current = true;
    }
  }, [mount]);

  const navigateEdit = (id) => {
    return navigate(routerLinks('StoreEdit') + `?id=${id}`);
  };
  const navigateDetail = (id) => {
    return navigate(routerLinks('StoreDetail') + `?id=${id}`);
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
    navigate(`${routerLinks(routeName)}?id=${idStore}&tab=2&${new URLSearchParams(navigateParams).toString()}`);
  }

  useEffect(() => {
    handleTableChange();
    navigateWithParams('SupplierManagementByStore', {
      fullTextSearch,
    });
  }, [fullTextSearch]);

  const [handleTableChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => navigate(routerLinks('SupplierEdit') + `?id=${data.id}&site=NonBal`),
    }),
    isLoading,
    setIsLoading,
    Get: async (params) => {
      return SupplierService.getNonBalSupplierOfStore({
        ...params,
        fullTextSearch,
        storeId: idStore,
        supplierType: 'NON_BALANCE',
      });
    },
    save: false,
    showSearch: false,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} nhà cung cấp`,
    columns: ColumnSupplierManagementByStore({
      navigateDetail,
      navigateEdit,
      handDelete: async (listId) => {
        (await SupplierService.delete(listId)) && handleTableChange();
      },
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
    rightHeader: (
      <Fragment>
        <button
          className={
            ' text-white w-[173px] h-[44px] font-normal sm:justify-center rounded-[10px] inline-flex items-center bg-teal-900 hover:bg-teal-700'
          }
          onClick={() => navigate(routerLinks('SupplierCreate') + `?site=NonBal`)}
          id="addBtn"
        >
          <i className="las la-plus mr-1 bold sm:ml-0 ml-2"></i>
          {' Thêm nhà cung cấp'}
        </button>
      </Fragment>
    ),
  });

  return (
    <Fragment>
      <div className="table-store min-h-screen ">
        <div className="bg-white pt-2 pb-10 px-1 rounded-md">{DataTable()}</div>
      </div>
    </Fragment>
  );
};
export default SupplierManagementNotInBal;
