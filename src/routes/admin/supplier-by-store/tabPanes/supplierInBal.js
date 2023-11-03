import React, { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { HookDataTable } from 'hooks';
import { routerLinks } from 'utils';
import { SupplierService } from 'services/supplier';

import '../index.less';
import { ColumnSupplierInBalance } from 'columns/supplier-by-store';
import { useAuth } from 'global';
import { Input } from 'antd';
const { Search } = Input;

const SupplierManagementInBal = () => {
  const timeout = useRef();
  const mount = useRef(false);
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const fullTextSearchURL = urlSearch.get('fullTextSearch') !== null ? urlSearch.get('fullTextSearch') : '';
  const [fullTextSearch, setFullTextSearch] = useState(fullTextSearchURL ?? fullTextSearchURL);
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const subOrgId = user?.userInfor?.subOrgId;
  const idStore = urlSearch.get('id');

  const initFunction = useCallback(async () => {
    if (!mount.current) {
      mount.current = true;
    }
  }, [mount]);

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
    navigate(`${routerLinks(routeName)}?id=${idStore || subOrgId}&tab=1&${new URLSearchParams(navigateParams).toString()}`);
  }

  useEffect(() => {
    handleTableChange();
    navigateWithParams('SupplierManagementByStore', {
      fullTextSearch,
    });
  }, [fullTextSearch]);

  const [handleTableChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => {
        navigate(routerLinks('SupplierEdit') + `?id=${data.id}&site=inBal`);
      },
    }),
    isLoading,
    setIsLoading,
    Get: async (params) => {
      return SupplierService.getDetailListConnectSupplier(
        { ...params,fullTextSearch, idSuppiler: idStore || subOrgId },
        idStore || subOrgId,
      );
    },
    save: false,
    showSearch: false,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} nhà cung cấp`,
    columns: ColumnSupplierInBalance({
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
  });

  return (
    <Fragment>
      <div className="table-store min-h-screen ">
        <div className="bg-white pt-2 pb-10 px-1 rounded-md">{DataTable()}</div>
      </div>
    </Fragment>
  );
};
export default SupplierManagementInBal;
