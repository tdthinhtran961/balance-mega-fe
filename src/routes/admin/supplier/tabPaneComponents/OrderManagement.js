import { ColumnOrderManagement } from 'columns/supplier';
import { HookDataTable } from 'hooks';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { SupplierService } from 'services/supplier';
import { routerLinks } from 'utils';
import { Input } from 'antd';
import './index.less';
const { Search } = Input;

const OrderManagement = ({ tabKey }) => {
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const timeout = useRef();
  const idSupplier = urlSearch.get('id');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fullTextSearchURL = urlSearch.get('fullTextSearch') !== null ? urlSearch.get('fullTextSearch') : '';
  const [fullTextSearch, setFullTextSearch] = useState(fullTextSearchURL ?? fullTextSearchURL);

  function navigateWithParams(routeName, params) {
    const navigateParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        navigateParams[key] = value;
      }
    });
    navigate(`${routerLinks(routeName)}?id=${idSupplier}&tab=${tabKey}&${new URLSearchParams(navigateParams).toString()}`);
  }

  useEffect(() => {
    handleTableOrderChange();
    navigateWithParams('SupplierEdit', {
     fullTextSearch,
    });
  }, [fullTextSearch]);

  const [handleTableOrderChange, DataTableOrderManagement] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) =>
        navigate(routerLinks('OrderDetail') + `?id=${data.id}` + `&view=admin` + `&idSupplier=${idSupplier}`),
    }),
    loading,
    setLoading,
    showSearch: false,
    save: false,
    loadFirst: false,
    Get: async (params) => {
      return SupplierService.getOrderManagement({ ...params, fullTextSearch, filterSupplier: idSupplier });
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`,
    columns: ColumnOrderManagement({
      handDelete: async (id) => {
        (await SupplierService.delete(id)) && handleTableOrderChange();
      },
      idSupplier,
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
  return <>{DataTableOrderManagement()}</>;
};

export default OrderManagement;
