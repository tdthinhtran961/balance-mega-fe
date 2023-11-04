import React, { useState, Fragment, useEffect, useCallback, useRef, useReducer } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { HookDataTable } from 'hooks';
import { routerLinks, getFormattedDate, formatDateString, reFormatDateString, formatSubmit } from 'utils';
import { useAuth } from 'global';
import './index.less';
import { ColumnTableList, ColumnTableListViewAdmin } from 'columns/import-goods-from-nonBal';
import { ImportGoodsFromNonBalService } from 'services/ImportGoodsFromNonBal';
import { DatePicker, Select, Space } from 'antd';
import DateFilterBar from './components/DateFilterBar';
// import moment from 'moment';
import classNames from 'classnames';
import dayjs from 'dayjs';

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
  const urlSearch = new URLSearchParams(location.search);
  const filterStatusURL = urlSearch.get('status');
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const storeId = user?.userInfor?.subOrgId;
  const filterStoreURL = urlSearch.get('storeId') ? urlSearch.get('storeId') : null;
  const filterSupplierURL = urlSearch.get('supplierId');
  const fullTextSearchURL = urlSearch.get('promotionOrderCode') !== null ? urlSearch.get('promotionOrderCode') : '';
  const [filterStoreName, setFilterStoreName] = useState();
  const [filterSupplierName, setFilterSupplierName] = useState();
  const [storeList, setStoreList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [filterSupplier, setFilterSupplier] = useState(filterSupplierURL ?? filterSupplierURL);
  const [filterStore, setFilterStore] = useState(filterStoreURL ?? filterStoreURL);
  const [filterDate, dispatch] = useReducer(reducer, initDate);
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState(filterStatusURL ?? filterStatusURL);
  const [filterStatusName, setFilterStatusName] = useState();
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    if (roleCode === 'ADMIN') {
      const fetchListFilter = async () => {
        const storeList = await ImportGoodsFromNonBalService.getStoreListWithOrder();
        setStoreList(storeList.data);
        if (filterStore !== 'null' && filterStore) {
          const value = storeList.data.find((item) => item.id === filterStore).name;
          setFilterStoreName(value);
        }
      };
      fetchListFilter();
    }
  }, []);
  useEffect(() => {
    if (roleCode === 'ADMIN' && filterStore) {
      const fetchListFilter = async () => {
        const param = {
          page: 1,
          perPage: 1000000000000000,
          storeId: filterStore,
          supplierType: 'NON_BALANCE',
        };
        const supplierList = await ImportGoodsFromNonBalService.getListSupplier(param);
        setSupplierList(supplierList.data);
        if (filterSupplier !== 'null' && filterSupplier && filterSupplier !== null) {
          const valueSupplier = supplierList.data.find((item) => item.id === filterSupplier).name;
          setFilterSupplierName(valueSupplier);
        }
      };
      if (!filterStore) {
        setFilterSupplier();
        setSupplierList([]);
      }
      fetchListFilter();
    }
  }, [filterStore]);

  useEffect(() => {
    if (roleCode !== 'ADMIN') {
      const fetchListFilter = async () => {
        const param = {
          page: 1,
          perPage: 100000000,
          storeId,
          supplierType: 'NON_BALANCE',
        };
        const supplierList = await ImportGoodsFromNonBalService.getListSupplier(param);
        setSupplierList(supplierList.data);
      };

      fetchListFilter();
    }
  }, [roleCode]);

  const initFunction = useCallback(async () => {
    if (!mount.current) {
      mount.current = true;
    }
  }, [mount]);

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

  const navigateEdit = (id) => {
    return navigate(routerLinks('ImportGoodsNonBalEdit') + `?id=${id}`);
  };
  const navigateDetail = (id) => {
    return navigate(routerLinks('ImportGoodsNonBalDetail') + `?id=${id}`);
  };

  useEffect(() => {
    initFunction();
  }, [initFunction, pathname]);

  const queryParamsString = Object.keys(queryParams)
    .filter((key) => queryParams[key] !== null && queryParams[key] !== undefined)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&');

  useEffect(() => {
    handleTableChange();
    navigate(`${routerLinks('ImportGoodsNonBal')}?${queryParamsString}`);
  }, [filterStore, filterSupplier, filterDate, filterStatus, fullTextSearchURL]);

  const [handleTableChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => navigate(routerLinks('ImportGoodsNonBalDetail') + `?id=${data.id}`),
    }),
    isLoading,
    setIsLoading,
    fullTextSearch: 'promotionOrderCode',
    searchPlaceholder: 'Mã nhập hàng',
    Get: async (params) => {
      setQueryParams({
        supplierId: filterSupplier,
        storeId: filterStore,
        promotionOrderCode: params?.promotionOrderCode,
        status: filterStatus,
      });
      return roleCode === 'OWNER_STORE' 
        ? ImportGoodsFromNonBalService.get({
            ...params,
            storeId,
            filterDate: {
              dateFrom: formatSubmit(filterDate.dateFrom),
              dateTo: formatSubmit(filterDate.dateTo),
            },
            supplierId: filterSupplier,
            status: filterStatus,
          })
        : roleCode === 'ADMIN'
        ? ImportGoodsFromNonBalService.getImportNonBalGoodsList({
            ...params,
            supplierId:
              filterSupplier === 'undefined' || filterSupplier === 'null' || filterSupplier === null
                ? ''
                : filterSupplier,
            storeId: filterStore === 'undefined' || filterStore === 'null' || filterStore === null ? '' : filterStore,
            filterDate: {
              dateFrom: formatSubmit(filterDate.dateFrom),
              dateTo: formatSubmit(filterDate.dateTo),
            },
          })
        : '';
    },
    save: true,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`,
    columns:
      roleCode === 'OWNER_STORE' 
        ? ColumnTableList({
            roleCode,
            navigateEdit,
            navigateDetail,
            handDelete: async (listId) => {
              (await ImportGoodsFromNonBalService.delete(listId)) && handleTableChange();
            },
          })
        : ColumnTableListViewAdmin({
            roleCode,
            navigateEdit,
            navigateDetail,
            handDelete: async (listId) => {
              (await ImportGoodsFromNonBalService.delete(listId)) && handleTableChange();
            },
          }),
    subHeader: (data) =>
      (roleCode === 'OWNER_STORE' ) && (
        <Fragment>
          <div className="flex justify-end items-end lg:block">
            <button
              className={
                'text-white w-[136px] h-[36px] font-normal justify-center rounded-[10px] block items-center bg-teal-900 hover:bg-teal-700 sm:ml-auto mt-3'
              }
              onClick={() => navigate(`${routerLinks('ImportGoodsNonBalCreate')}?step=2`)}
              id="addBtn"
            >
              <i className="las la-plus mr-1 bold"></i>
              {' Thêm mới'}
            </button>
          </div>
        </Fragment>
      ),
    rightHeader:
      roleCode === 'OWNER_STORE'  ? (
        <Fragment>
          <div className="flex 3xl:items-center xl:items-end items-start 3xl:flex-row flex-col 3xl:gap-3">
            <div className="flex 3xl:my-0 lg:mb-2 md:flex-row flex-col w-full sm:w-fit">
              <Select
                className="w-full sm:w-[195px] lg:ml-4 rounded-[10px] mr-6 lg:mb-0 mb-3"
                placeholder="Chọn trạng thái"
                optionFilterProp="children"
                allowClear
                onChange={(event) => {
                  setFilterStatus(event);
                  setQueryParams({
                    ...queryParams,
                    status: event,
                  });
                  setFilterStatusName(
                    event === 'INPROCESS' ? 'Đang xử lý' : event === 'COMPLETED' ? 'Đã hoàn tất' : null,
                  );
                }}
                defaultValue={
                  filterStatus && filterStatus !== 'null' && filterStatus !== 'undefined'
                    ? { value: filterStatus, label: filterStatusName }
                    : null
                }
              >
                <Option value="INPROCESS">Đang xử lý</Option>
                <Option value="COMPLETED">Đã hoàn tất</Option>
              </Select>
              <Select
                showSearch
                className="rounded-[10px] sm:w-[195px]"
                placeholder="Chọn nhà cung cấp"
                optionFilterProp="children"
                allowClear
                onChange={(event) => {
                  setQueryParams({
                    ...queryParams,
                    supplierId: event,
                  });
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
            </div>

            <div
              className={classNames('sm:relative lg:my-2 lg:my-0 sm:mt-0 mt-3', {
                '!mb-8': showValidateFilter,
              })}
            >
              <div className="sm:flex gap-3 items-end justify-end flex-col md:flex-row">
                <Space
                  direction="vertical"
                  className="flex items-center gap-2 lg:w-[245px] lg:ml-4 sm:justify-between justify-start"
                >
                  <p className="text-[12px] text-left w-[56px] w-auto">Từ ngày</p>
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
                <Space
                  direction="vertical"
                  className="flex items-center gap-2 sm:mt-0 mt-2 lg:w-[245px] datepicker-to !justify-start sm:!justify-between"
                >
                  <p className="text-[12px] text-left lg:w-[56px] w-auto">Đến ngày</p>{' '}
                  <DatePicker
                    onChange={onChangeDateTo}
                    format="DD/MM/YYYY"
                    defaultValue={dayjs()}
                    disabledDate={(current) => {
                      return current && current.valueOf() > Date.now();
                    }}
                    className={'sm:ml-0 datepicker-to-input !bg-white'}
                    size={'middle'}
                  />
                </Space>
              </div>
              {showValidateFilter && (
                <span className="text-red-500 absolute right-0 my-1 sm:mb-0 mb-4 z-10">
                  Ngày kết thúc phải lớn hơn ngày bắt đầu
                </span>
              )}
            </div>
          </div>
        </Fragment>
      ) : (
        <div className="flex 3xl:items-center xl:items-end items-start 3xl:flex-row flex-col 3xl:gap-3">
          <div className="flex 3xl:my-0 sm:flex-row flex-col 3xl:mb-0 sm:mb-4 xl:mt-0 sm:mt-4">
            <Select
              className="w-[190px] mr-0 sm:mr-6 rounded-[10px] sm:mb-0 mb-2"
              placeholder="Chọn cửa hàng"
              optionFilterProp="children"
              allowClear
              onChange={(event) => {
                setQueryParams({
                  ...queryParams,
                  storeId: event,
                  supplierId: null,
                });
                setFilterStore(event);
                const storeName = storeList.find((item) => item?.id === event);
                setFilterStoreName(storeName?.name);
                setFilterSupplier();
                setSupplierList([]);
              }}
              showSearch
              filterOption={(input, option) => {
                return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              value={
                filterStore && filterStore !== 'null' && filterStore !== 'undefined'
                  ? { value: filterStore, label: filterStoreName }
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
              className="w-[190px] rounded-[10px]"
              placeholder="Chọn nhà cung cấp"
              optionFilterProp="children"
              disabled={!filterStore}
              allowClear
              onChange={(event) => {
                const supplierName = supplierList.find((item) => item?.id === event);
                setFilterSupplierName(supplierName?.name);
                setFilterSupplier(event);
                setQueryParams({
                  ...queryParams,
                  supplierId: event,
                });
              }}
              showSearch
              filterOption={(input, option) => {
                return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              value={
                filterSupplier && filterSupplier !== 'null' && filterSupplier !== 'undefined' && filterSupplier !== null
                  ? { value: filterSupplier, label: filterSupplierName }
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
        <p className="text-2xl font-bold text-teal-900 mb-6">Nhập hàng Non-Balance</p>
        <div className="bg-white pt-6 pb-10 px-4 rounded-md table-import-goods">{DataTable()}</div>
      </div>
    </Fragment>
  );
};
export default Page;
