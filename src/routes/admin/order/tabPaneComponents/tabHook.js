// import { Select } from 'antd';
import { Select, Space, DatePicker, Input } from 'antd';
import {
  ColumnOrderCancel,
  ColumnOrderDeliveried,
  ColumnOrderDelivering,
  ColumnWaitingConfirm,
  ColumnWaitingTakeGoods,
} from 'columns/orderManagement';
import { useAuth } from 'global';
import { HookDataTable } from 'hooks';
// import moment from 'moment';
import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { StoreService } from 'services/store';
import { SupplierService } from 'services/supplier';
import { routerLinks, formatCurrency, reFormatDateString, getFormattedDate, formatDateString } from 'utils';
import classNames from 'classnames';
import dayjs from 'dayjs';

const { Option } = Select;
const { Search } = Input;

let date = new Date();
let firstDay = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
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

const TabData = ({ tabKey, navigateDetail, statusName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const storeId = user?.userInfor?.subOrgId;
  const timeout = useRef();

  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const fullTextSearchURL = urlSearch.get('orderCode') !== null ? urlSearch.get('orderCode') : '';
  const filterStoreURL = urlSearch.get('filterStore');
  const filterSupplierURL = urlSearch.get('filterSupplier');
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const [supplierList, setSupplierList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [filterSupplier, setFilterSupplier] = useState(filterSupplierURL ?? filterSupplierURL);
  const [filterSupplierName] = useState();
  const [filterStore, setFilterStore] = useState(filterStoreURL ?? filterStoreURL);
  const [filterStoreName] = useState();
  const [fullTextSearch, setFullTextSearch] = useState(fullTextSearchURL ?? fullTextSearchURL);
  const [filterDate, dispatch] = useReducer(reducer, initDate);

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

  useEffect(() => {
    const fetchListStore = async () => {
      const storeList = await SupplierService.getStoreListForStore();
      setStoreList(storeList.data);
    };
    (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && fetchListStore();
  }, [roleCode]);

  useEffect(() => {
    let flag = true;
    const fetchSupplierList = async () => {
      try {
        const res = await StoreService.getListSupplierForFilterProd(
          {
            storeId,
            type: 'ALL',
          },
          'store/all-supplier-store',
        );
        if (flag) setSupplierList(res);
      } catch (error) {
        console.log(error);
      }
    };
    roleCode === 'OWNER_STORE' && fetchSupplierList();
    return () => {
      flag = false;
    };
  }, [roleCode]);

  function navigateWithParams(routeName, params) {
    const navigateParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        navigateParams[key] = value;
      }
    });
    navigate(`${routerLinks(routeName)}?tab=${tabKey}&${new URLSearchParams(navigateParams).toString()}`);
  }

  useEffect(() => {
    handleChange();
    navigateWithParams('OrderManagement', {
      filterStore,
      filterSupplier,
      orderCode: fullTextSearch,
    });
  }, [filterSupplier, filterStore, filterDate, fullTextSearch]);

  const [handleChange, DataTab] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => navigate(routerLinks('OrderDetail') + `?id=${data.id}` + `&tabKey=${tabKey}`),
    }),
    isLoading,
    setIsLoading,
    showSearch: false,
    loadFirst: false,
    save: false,
    Get: async (params) => {
      return SupplierService.GetOrder({
        ...params,
        orderCode: fullTextSearch,
        status: statusName,
        filterDate,
        filterSupplier,
        filterStore,
      });
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`,
    searchPlaceholder: 'Mã đơn hàng',
    columns:
      +tabKey === 1
        ? ColumnWaitingConfirm({
            handleShow: async () => {
              handleChange();
            },
            formatCurrency,
            navigateDetail,
            tabKey,
            roleCode,
          })
        : +tabKey === 2
        ? ColumnWaitingTakeGoods({
            handleShow: async () => {
              handleChange();
            },
            formatCurrency,
            navigateDetail,
            tabKey,
            roleCode,
          })
        : +tabKey === 3
        ? ColumnOrderDelivering({
            handleShow: async () => {
              handleChange();
            },
            formatCurrency,
            navigateDetail,
            tabKey,
            roleCode,
          })
        : +tabKey === 4
        ? ColumnOrderDeliveried({
            handleShow: async () => {
              handleChange();
            },
            formatCurrency,
            navigateDetail,
            tabKey,
            roleCode,
          })
        : ColumnOrderCancel({
            handleShow: async () => {
              handleChange();
            },
            formatCurrency,
            navigateDetail,
            tabKey,
            roleCode,
          }),
    leftHeader: (
      <>
        <div className="relative lg:mb-6 w-full sm:w-[245px]">
          <div className="search-container search-product manager_order">
            <Search
              placeholder="Mã đơn hàng"
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
      <div className="flex lg:items-end filter-group-orderManagement-waiting items-start flex-col 2xl:flex-row">
        {(roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && (
          <Select
            className="w-full sm:w-[245px] rounded-[10px]"
            placeholder="Chọn cửa hàng"
            optionFilterProp="children"
            allowClear
            onChange={(event) => {
              setFilterStore(event);
            }}
            showSearch
            defaultValue={
              filterStore && filterStore !== 'null' && filterStore !== 'undefined'
                ? { value: filterStore, label: filterStoreName }
                : null
            }
          >
            {storeList &&
              storeList.map((item, index) => {
                return (
                  <Option key={index} value={item?.storeId}>
                    {item?.store?.name}
                  </Option>
                );
              })}
          </Select>
        )}
        {roleCode === 'OWNER_STORE' && (
          <Select
            showSearch
            className="rounded-[10px] w-full sm:w-[245px] supplier-filter-orderManagement"
            placeholder="Chọn nhà cung cấp"
            optionFilterProp="children"
            allowClear
            onChange={(event) => {
              setFilterSupplier(event);
            }}
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
        )}
        <div
          className={classNames('sm:relative mt-3 sm:mt-0 lg:mt-4 2xl:mt-0', {
            'mb-4': showValidateFilter,
          })}
        >
          <div className="items-end justify-end flex-col sm:flex-row flex">
            <Space direction="vertical" className="flex items-center gap-2 lg:w-[240px] lg:ml-4">
              <p className="text-[12px] text-left w-auto lg:w-[56px] sm:mr-0 mr-4">Từ ngày</p>{' '}
              {formatDateString(getFormattedDate(firstDay)) !== '1970/01/01' ? (
                <DatePicker
                  className="!bg-white"
                  onChange={onChangeDateFrom}
                  format="DD/MM/YYYY"
                  defaultValue={dayjs(getFormattedDate(firstDay), 'DD/MM/YYYY')}
                  disabledDate={(current) => {
                    return current && current.valueOf() > Date.now();
                  }}
                  size={'middle'}
                />
              ) : (
                <DatePicker
                  className="!bg-white"
                  onChange={onChangeDateFrom}
                  format="DD/MM/YYYY"
                  disabledDate={(current) => {
                    return current && current.valueOf() > Date.now();
                  }}
                  size={'middle'}
                />
              )}
            </Space>
            <Space direction="vertical" className="flex items-center lg:mt-0 mt-4 datepicker-to sm:!gap-0 lg:w-[250px]">
              <p className="text-[12px] text-left w-auto lg:w-[56px] sm:mx-4">Đến ngày</p>{' '}
              <DatePicker
                onChange={onChangeDateTo}
                format="DD/MM/YYYY"
                defaultValue={dayjs(getFormattedDate(date), 'DD/MM/YYYY')}
                disabledDate={(current) => {
                  return current && current.valueOf() > Date.now();
                }}
                className={'sm:ml-0 datepicker-to-input !bg-white'}
                size={'middle'}
              />
            </Space>
          </div>
          {showValidateFilter && (
            <span className="text-red-500 absolute right-0 my-1 sm:mb-4 mb-4 z-10">
              Ngày kết thúc phải lớn hơn ngày bắt đầu
            </span>
          )}
        </div>
      </div>
    ),
  });
  return <div className="table-waiting">{DataTab()}</div>;
};

export default TabData;
