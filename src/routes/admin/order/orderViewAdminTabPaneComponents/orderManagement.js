import React, { Fragment, useEffect, useState, useReducer } from 'react';
import './../index.less';
import {
  routerLinks,
  formatCurrency,
  getFormattedDate,
  formatDateString,
  reFormatDateString,
  formatSubmit,
} from 'utils';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { HookDataTable } from 'hooks';
import { SupplierService } from 'services/supplier';
import { Select } from 'antd';
import { ColumnWaitingConfirm } from 'columns/orderManagement';
import { useAuth } from 'global';
import './index.less';
import DateFilterBar from '../DateFilterBar';

let date = new Date();
let firstDay = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
const { Option } = Select;

let initDate = {
  dateFrom: formatDateString(getFormattedDate(firstDay)) + ' 00:00:00',
  dateTo: formatDateString(getFormattedDate(date)) + ' 23:59:59',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FROM':
      return {
        ...state,
        dateFrom: action.dateFrom ? formatDateString(action.dateFrom) + ' 00:00:00' : action.dateFrom,
      };
    case 'TO':
      return { ...state, dateTo: action.dateTo ? formatDateString(action.dateTo) + ' 23:59:59' : action.dateTo };
    default:
      return state;
  }
};

const OrderManagementViewAd = () => {
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const filterStoreURL = urlSearch.get('filterStore');
  const filterSupplierURL = urlSearch.get('filterSupplier');
  const fullTextSearchURL = urlSearch.get('fullTextSearch') !== null ? urlSearch.get('fullTextSearch') : '';
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const [isLoading, setIsLoading] = useState(false);
  const [filterDate, dispatch] = useReducer(reducer, initDate);
  const [showValidateFilter, setShowValidateFilter] = useState(false);

  const [supplierList, setSupplierList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [filterSupplier, setFilterSupplier] = useState(filterSupplierURL ?? filterSupplierURL);
  const [filterStore, setFilterStore] = useState(filterStoreURL ?? filterStoreURL);
  const [filterStoreName, setFilterStoreName] = useState();
  const [filterSupplierName, setFilterSupplierName] = useState();
  const [queryParams, setQueryParams] = useState({});

  const onChangeDateFrom = (_, dateString) => {
    if (new Date(reFormatDateString(dateString)) > new Date(filterDate.dateTo)) {
      setShowValidateFilter(true);
      return;
    }
    setShowValidateFilter(false);
    dispatch({ type: 'FROM', dateFrom: dateString });
    const newDateString = dateString.slice(6, 10) + '/' + dateString.slice(3, 5) + '/' + dateString.slice(0, 2);
    if (newDateString !== '//') {
      initDate = {
        dateFrom: newDateString + ' 00:00:00',
        dateTo: formatDateString(getFormattedDate(date)) + ' 23:59:59',
      };
      firstDay = new Date(newDateString);
    } else {
      initDate = {
        dateFrom: '',
        dateTo: formatDateString(getFormattedDate(date)) + ' 23:59:59',
      };
      firstDay = new Date(0);
    }
  };

  const onChangeDateTo = (_, dateString) => {
    if (new Date(filterDate.dateFrom) > new Date(reFormatDateString(dateString))) {
      setShowValidateFilter(true);
      return;
    }
    setShowValidateFilter(false);
    dispatch({ type: 'TO', dateTo: dateString });
    const newDateString = dateString.slice(6, 10) + '/' + dateString.slice(3, 5) + '/' + dateString.slice(0, 2);
    if (newDateString !== '//') {
      initDate = {
        dateFrom: formatDateString(getFormattedDate(firstDay)) + ' 00:00:00',
        dateTo: newDateString + ' 23:59:59',
      };
      date = new Date(newDateString);
    } else {
      initDate = {
        dateFrom: formatDateString(getFormattedDate(firstDay)) + ' 00:00:00',
        dateTo: formatDateString(getFormattedDate(new Date())) + ' 23:59:59',
      };
      date = new Date();
    }
  };

  const navigateDetail = (idOrder) => {
    return navigate(routerLinks('OrderDetail') + `?id=${idOrder}`);
  };

  useEffect(() => {
    const fetchListFilter = async () => {
      const supplierList = await SupplierService.getSupplierListWithOrder();
      setSupplierList(supplierList.data);
      const storeList = await SupplierService.getStoreListWithOrder();
      setStoreList(storeList.data);
      if (filterStore !== 'null' && filterStore) {
        const value = storeList.data.find((item) => item.id === filterStore).name;
        setFilterStoreName(value);
      }
      if (filterSupplier !== 'null' && filterSupplier) {
        const valueSupplier = supplierList.data.find((item) => item.id === filterSupplier).name;
        setFilterSupplierName(valueSupplier);
      }
    };
    fetchListFilter();
  }, []);

  const queryParamsString = Object.keys(queryParams)
    .filter((key) => queryParams[key] !== null && queryParams[key] !== undefined)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&');

  useEffect(() => {
    handleChange();
    navigate(`${routerLinks('OrderManagement')}?${queryParamsString}`);
  }, [filterSupplier, filterStore, fullTextSearchURL, filterDate]);

  const [handleChange, DataTab] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: () => navigate(routerLinks('OrderDetail') + `?id=${data.id}` + `&view=admin`),
    }),
    isLoading,
    setIsLoading,
    showSearch: true,
    searchPlaceholder: 'Mã đơn hàng',
    save: true,
    Get: async (params) => {
      setQueryParams({
        filterStore,
        filterSupplier,
        fullTextSearch: params?.fullTextSearch,
      });
      return SupplierService.getOrderManagement({
        ...params,
        filterSupplier:
          filterSupplier === 'undefined' || filterSupplier === 'null' || filterSupplier === null ? '' : filterSupplier,
        filterStore: filterStore === 'undefined' || filterStore === 'null' || filterStore === null ? '' : filterStore,
        filterDate: {
          dateFrom: formatSubmit(filterDate.dateFrom),
          dateTo: formatSubmit(filterDate.dateTo),
        },
      });
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`,
    columns: ColumnWaitingConfirm({
      handDelete: async (id) => {
        (await SupplierService.delete(id)) && handleChange();
      },
      formatCurrency,
      navigateDetail,
      roleCode,
    }),
    rightHeader: (
      <div className="flex 3xl:items-center xl:items-end items-start 3xl:flex-row flex-col 3xl:gap-3 filter-group-orderManagement 3xl:my-0 sm:my-4 my-0">
        <div className="flex 3xl:my-0 sm:flex-row flex-col mb-0 sm:mb-2 xl:mb-0 w-full">
          <Select
            className="sm:!w-[190px] mr-0 sm:mr-6 rounded-[10px] store-filter-orderManagement sm:mb-0 mb-1 !ml-0"
            placeholder="Chọn cửa hàng"
            optionFilterProp="children"
            allowClear
            onChange={(event) => {
              setQueryParams({
                ...queryParams,
                filterStore: event,
              });
              setFilterStore(event);
            }}
            showSearch
            label="Chọn cửa hàng"
            defaultValue={
              filterStore && filterStore !== 'null' && filterStore !== 'undefined'
                ? { value: filterStore, label: filterStoreName }
                : null
            }
          >
            {storeList &&
              storeList.map((item, index) => {
                return (
                  <Option key={index} value={item?.id}>
                    {item?.name}
                  </Option>
                );
              })}
          </Select>
          <Select
            className="rounded-[10px] sm:!w-[190px] supplier-filter-orderManagement"
            placeholder="Chọn nhà cung cấp"
            optionFilterProp="children"
            allowClear
            onChange={(event) => {
              setQueryParams({
                ...queryParams,
                filterSupplier: event,
              });
              setFilterSupplier(event);
            }}
            showSearch
            defaultValue={
              filterSupplier && filterSupplier !== 'null' && filterSupplier !== 'undefined'
                ? { value: filterSupplier, label: filterSupplierName }
                : null
            }
          >
            {supplierList &&
              supplierList.map((item, index) => {
                return (
                  <Option key={index} value={item?.id}>
                    {item?.name}
                  </Option>
                );
              })}
          </Select>
        </div>

        <DateFilterBar
          onChangeDateFrom={onChangeDateFrom}
          onChangeDateTo={onChangeDateTo}
          showValidateFilter={showValidateFilter}
          firstDay={firstDay}
          date={date}
        />
      </div>
    ),
  });

  return (
    <Fragment>
      <div className="table-order">{DataTab()}</div>
    </Fragment>
  );
};
export default OrderManagementViewAd;
