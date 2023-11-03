import React, { useState, Fragment, useEffect, useCallback, useRef, useReducer } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { HookDataTable } from 'hooks';
import { routerLinks, getFormattedDate, formatDateString, reFormatDateString, formatSubmit } from 'utils';
import { useAuth } from 'global';
import './index.less';
import { ColumnGoodTransferAdmin } from 'columns/goods-transfer';
import { GoodTransferService } from 'services/GoodTransfer';
import { Select } from 'antd';
import DateFilterBar from './components/DateFilterBar';

const { Option } = Select;
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

const Page = () => {
  const mount = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const urlSearch = new URLSearchParams(location.search);
  const filterStoreURL = urlSearch.get('idStore');
  const filterSupplierURL = urlSearch.get('idSupplier');
  const fullTextSearchURL = urlSearch.get('fullTextSearch') !== null ? urlSearch.get('fullTextSearch') : '';
  const [storeList, setStoreList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [filterStore, setFilterStore] = useState({
    idStore: filterStoreURL ?? filterStoreURL,
    filterStore: filterSupplierURL ?? filterSupplierURL,
  });
  const [filterDate, dispatch] = useReducer(reducer, initDate);
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const [filterStoreName, setFilterStoreName] = useState();
  const [filterSupplierName, setFilterSupplierName] = useState();
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    if (roleCode === 'ADMIN') {
      const fetchListFilter = async () => {
        const storeList = await GoodTransferService.getStoreListWithOrder();
        setStoreList(storeList?.data);
        if (filterStore?.idStore !== 'null' && filterStore?.idStore) {
          const value = storeList.data.find((item) => item.id === filterStore?.idStore).name;
          setFilterStoreName(value);
        }
      };
      fetchListFilter();
    }
  }, []);

  useEffect(() => {
    if (roleCode === 'ADMIN') {
      const fetchListFilter = async () => {
        const storeList = await GoodTransferService.getListBranchSearch();
        setSupplierList(storeList?.data?.data);
        if (filterStore?.filterStore !== 'null' && filterStore?.filterStore) {
          const value = storeList.data.find((item) => item.id === filterStore?.filterStore).name;
          setFilterSupplierName(value);
        }
      };
      fetchListFilter();
    }
  }, []);

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

  const initFunction = useCallback(async () => {
    if (!mount.current) {
      mount.current = true;
    }
  }, [mount]);

  useEffect(() => {
    initFunction();
  }, [initFunction, pathname]);

  const queryParamsString = Object.keys(queryParams)
    .filter((key) => queryParams[key] !== null && queryParams[key] !== undefined)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&');

  useEffect(() => {
    if (roleCode === 'ADMIN' && (filterStore.idStore !== null || filterStore.filterStore !== null)) {
      handleTableChange();
      navigate(`${routerLinks('GoodTransferAdmin')}?${queryParamsString}`);
    }
  }, [filterStore, filterDate, fullTextSearchURL]);

  const [handleTableChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => navigate(routerLinks('GoodTransferAdminDetail') + `?id=${data.id}&type=transfer`),
    }),
    isLoading,
    setIsLoading,
    searchPlaceholder: 'Mã chuyển hàng',
    Get: async (params) => {
      setQueryParams({
        idSupplier: filterStore.filterStore,
        idStore: filterStore.idStore,
        fullTextSearch: params?.fullTextSearch,
      });
      return await GoodTransferService.get({
        ...params,
        idSupplier:
          filterStore.filterStore === 'undefined' ||
          filterStore.filterStore === 'null' ||
          filterStore.filterStore === null
            ? ''
            : filterStore.filterStore,
        idStore:
          filterStore.idStore === 'undefined' || filterStore.idStore === 'null' || filterStore.idStore === null
            ? ''
            : filterStore.idStore,
        type: 'TRANSFER_GOOD',
        filterDate: {
          dateFrom: formatSubmit(filterDate.dateFrom),
          dateTo: formatSubmit(filterDate.dateTo),
        },
      });
    },
    save: true,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`,
    columns: ColumnGoodTransferAdmin(),
    rightHeader:
      roleCode === 'OWNER_STORE'  ? (
        <Fragment>
          <button
            className={
              'text-white w-[153px] h-[36px] font-normal justify-center rounded-[10px] inline-flex items-center bg-teal-900 hover:bg-teal-700'
            }
            onClick={() => navigate(`${routerLinks('ImportGoodsNonBalCreate')}?step=2`)}
            id="addBtn"
          >
            <i className="las la-plus mr-1 bold"></i>
            {' Thêm mới'}
          </button>
        </Fragment>
      ) : (
        <div className="flex 3xl:items-center xl:items-end items-start 3xl:flex-row flex-col 3xl:gap-3">
          <div className="flex 3xl:my-0 sm:flex-row flex-col 3xl:mb-0 sm:mb-4 xl:mt-0 lg:mt-4 w-full sm:w-fit">
            <Select
              className="sm:w-[190px] mr-0 sm:mr-6 rounded-[10px] sm:mb-0 mb-2"
              placeholder="Cửa hàng chuyển"
              optionFilterProp="children"
              allowClear
              onChange={(event) => {
                setQueryParams({
                  ...queryParams,
                  idStore: event,
                });
                setFilterStore((prev) => ({ ...prev, idStore: event }));
              }}
              showSearch
              filterOption={(input, option) => {
                return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              defaultValue={
                filterStore?.idStore && filterStore?.idStore !== 'null' && filterStore?.idStore !== 'undefined'
                  ? { value: filterStore?.idStore, label: filterStoreName }
                  : null
              }
            >
              {storeList &&
                storeList.map((item, index) => {
                  return (
                    <Option key={index} value={item?.id} title={item?.name}>
                      {item?.name}
                    </Option>
                  );
                })}
            </Select>
            <Select
              className="sm:w-[190px] rounded-[10px]"
              placeholder="Cửa hàng nhận"
              optionFilterProp="children"
              allowClear
              onChange={(event) => {
                setQueryParams({
                  ...queryParams,
                  idSupplier: event,
                });
                setFilterStore((prev) => ({ ...prev, filterStore: event }));
              }}
              showSearch
              filterOption={(input, option) => {
                return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              defaultValue={
                filterStore?.filterStore &&
                filterStore?.filterStore !== 'null' &&
                filterStore?.filterStore !== 'undefined'
                  ? { value: filterStore?.filterStore, label: filterSupplierName }
                  : null
              }
            >
              {supplierList &&
                supplierList.map((item, index) => {
                  return (
                    <Option key={index} value={item?.id} title={item?.name}>
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
      <div className="table-store min-h-screen ">
        <p className="text-2xl font-bold text-teal-900 mb-6">Chuyển hàng</p>
        <div className="bg-white pt-6 pb-10 px-4 rounded-md table-transfer">{DataTable()}</div>
      </div>
    </Fragment>
  );
};
export default Page;
