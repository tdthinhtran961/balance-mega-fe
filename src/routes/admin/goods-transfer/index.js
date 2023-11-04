import React, { Fragment, useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { DatePicker, Space, Tabs, Select, Input } from 'antd';
import { HookDataTable } from 'hooks';
import { ColumnGoodsReceive, ColumnGoodTransfer } from 'columns/goods-transfer';
import { useNavigate } from 'react-router';
import { reFormatDateString, routerLinks, formatDateString, getFormattedDate } from 'utils';
import { useAuth } from 'global';
import { useLocation } from 'react-router-dom';
import { GoodTransferService } from 'services/GoodTransfer';
import './index.less';
// import moment from 'moment';
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

const App = () => {
  const timeout = useRef();
  const mount = useRef(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const storeId = user?.userInfor?.subOrgId;
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const statusURL = urlSearch.get('status');
  const idStoreURL = urlSearch.get('idStore');
  const fullTextSearchURL = urlSearch.get('inventoryOrderCode') !== null ? urlSearch.get('inventoryOrderCode') : '';
  const [fullTextSearch, setFullTextSearch] = useState(fullTextSearchURL ?? fullTextSearchURL);

  const [keyTab, setKeyTab] = useState(urlSearch.get('tab') || '1');
  const onChange = (key) => {
    if (key === '1') {
      setKeyTab(1);
      // setFilterDateBy((prev) => ({
      //   ...prev,
      //   dateFrom: formatDateString(getFormattedDate(firstDay)) + ' 00:00:00',
      //   dateTo: moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59',
      // }));
      setFilterStore();
      setFilterStatus();
      setFullTextSearch();
      return navigate(`${routerLinks('GoodTransfer')}?tab=${1}`);
    }
    if (key === '2') {
      setKeyTab(2);
      // setFilterDateBy((prev) => ({
      //   ...prev,
      //   dateFrom: formatDateString(getFormattedDate(firstDay)) + ' 00:00:00',
      //   dateTo: moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59',
      // }));
      setFilterStore();
      setFilterStatus();
      setFullTextSearch();
      return navigate(`${routerLinks('GoodTransfer')}?tab=${2}`);
    }
  };

  const [storeList, setStoreList] = useState([]);
  const [filterStore, setFilterStore] = useState(idStoreURL ?? idStoreURL);
  const [filterStoreName] = useState();
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState(statusURL ?? statusURL);
  const [filterStatusName, setFilterStatusName] = useState();
  const [, setOptions] = useState([]);
  const [, setLoading] = useState(false);
  const [page] = useState(1);
  const [, setHasMore] = useState(true);

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
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const param = {
        page,
        perPage: 10,
        supplierType: 'BALANCE',
        storeId,
      };
      const response = await GoodTransferService.getListBranch(param);
      const data = response.data;
      setOptions((prevOptions) => [...prevOptions, ...data]);
      setHasMore(data.length !== 0);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    const fetchListStore = async () => {
      const param = {
        page: 1,
        perPage: 1000,
        supplierType: 'BALANCE',
        storeId,
      };
      const res = await GoodTransferService.getListBranch(param);
      setStoreList(res.data);
    };
    roleCode !== 'ADMIN' && fetchListStore();
  }, []);

  function navigateWithParams(routeName, params) {
    const navigateParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        navigateParams[key] = value;
      }
    });
    navigate(`${routerLinks(routeName)}?tab=${keyTab}&${new URLSearchParams(navigateParams).toString()}`);
  }

  useEffect(() => {
    +keyTab === 2 && handleChangeProductTransfer();
    navigateWithParams('GoodTransfer', {
      status: filterStatus,
      idStore: filterStore,
      inventoryOrderCode: fullTextSearch,
    });
  }, [keyTab, filterStore, filterDate, filterStatus, fullTextSearch]);

  useEffect(() => {
    +keyTab === 1 && handleChangeProduct();
    navigateWithParams('GoodTransfer', {
      status: filterStatus,
      idStore: filterStore,
      inventoryOrderCode: fullTextSearch,
    });
  }, [keyTab, filterStore, filterDate, filterStatus, fullTextSearch]);

  const [handleChangeProductTransfer, dataTableProductTransfer] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => navigate(routerLinks('GoodTransferDetail') + `?id=${data.id}&type=transfer`),
    }),
    isLoading,
    setIsLoading,
    className: 'data-table abcdfeghik',
    save: false,
    loadFirst: false,
    showSearch: false,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`,
    columns: ColumnGoodTransfer(),
    Get: async (params) => {
      return (
        (roleCode === 'OWNER_STORE' ) &&
        (await GoodTransferService.get({
          ...params,
          inventoryOrderCode: fullTextSearch,
          idStore: filterStore,
          type: 'TRANSFER_GOOD_SEND',
          status: filterStatus,
          filterDate,
        }))
      );
    },
    subHeader: (data) =>
      (roleCode === 'OWNER_STORE' ) && (
        <Fragment>
          <div className="flex justify-end items-end lg:block">
            <button
              className={
                ' text-white w-[130px] h-[36px] font-normal justify-center rounded-[10px] block items-center bg-teal-900 hover:bg-teal-700 sm:ml-auto mt-3'
              }
              onClick={() => navigate(`${routerLinks('GoodTransferCreate')}`) && handleChangeProductTransfer()}
              id="addBtn"
            >
              <i className="las la-plus mr-1 bold"></i>
              {' Thêm mới'}
            </button>
          </div>
        </Fragment>
      ),
    leftHeader: +keyTab === 2 && (roleCode === 'OWNER_STORE' ) && (
      <>
        <div className="relative lg:mb-6 w-full sm:w-[245px]">
          <div className="search-container search-product manager_order">
            <Search
              placeholder="Mã chuyển hàng"
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
    rightHeader: +keyTab === 2 && (roleCode === 'OWNER_STORE' ) && (
      <div className="flex 3xl:items-center xl:items-end items-start 3xl:flex-row flex-col 3xl:gap-3">
        <div className="flex 3xl:my-0 lg:mb-4 md:flex-row flex-col w-full sm:w-fit">
          <Select
            className="sm:w-[190px] sm:mr-6 rounded-[10px] lg:mb-0 mb-4"
            placeholder="Chọn trạng thái"
            optionFilterProp="children"
            allowClear
            onChange={(event) => {
              setFilterStatus(event);
              setFilterStatusName(event === 'INPROCESS' ? 'Đang xử lý' : event === 'COMPLETED' ? 'Đã hoàn tất' : null);
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
            className="rounded-[10px] sm:w-[190px] select-search mb-4 lg:mb-0"
            placeholder="Chọn cửa hàng nhận"
            optionFilterProp="children"
            allowClear
            onChange={(event) => {
              setFilterStore(event);
            }}
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
        </div>

        <div className="sm:relative my-2 lg:my-0 sm:mt-0 mt-4">
          <div className="sm:flex gap-3 items-end justify-end flex-col md:flex-row">
            <Space
              direction="vertical"
              className="flex items-center gap-2 lg:w-[245px] lg:ml-4 sm:justify-between justify-start "
            >
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
            <Space
              direction="vertical"
              className="flex items-center gap-2 sm:mt-0 mt-2 lg:w-[245px] datepicker-to !justify-start sm:!justify-between"
            >
              <p className="text-[12px] text-left w-auto lg:w-[56px]">Đến ngày</p>{' '}
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
            <span className="text-red-500 absolute right-0 my-1 sm:mb-0 mb-4 z-10">
              Ngày kết thúc phải lớn hơn ngày bắt đầu
            </span>
          )}
        </div>
      </div>
    ),
  });
  const [handleChangeProduct, dataTableProduct] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => navigate(routerLinks('GoodReceiveDetail') + `?id=${data.id}&type=receive`),
    }),
    isLoading,
    setIsLoading,
    save: false,
    showSearch: false,
    Get: async (params) => {
      return (
        (roleCode === 'OWNER_STORE' ) &&
        (await GoodTransferService.get({
          ...params,
          inventoryOrderCode: fullTextSearch,
          idStore: filterStore,
          type: 'TRANSFER_GOOD_RECEIVED',
          status: filterStatus,
          filterDate,
        }))
      );
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`,
    columns: ColumnGoodsReceive(),
    leftHeader: +keyTab === 1 && (roleCode === 'OWNER_STORE' ) && (
      <>
        <div className="relative lg:mb-6 w-full sm:w-[245px]">
          <div className="search-container search-product manager_order">
            <Search
              placeholder="Mã chuyển hàng"
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
    rightHeader: +keyTab === 1 && (roleCode === 'OWNER_STORE' ) && (
      <div className="flex 3xl:items-center xl:items-end items-start 3xl:flex-row flex-col 3xl:gap-3">
        <div className="flex 3xl:my-0 lg:mb-4 md:flex-row flex-col w-full sm:w-fit">
          <Select
            className="w-full sm:w-[195px] lg:w-[210px] sm:mr-6 rounded-[10px] lg:mb-0 mb-4"
            placeholder="Chọn trạng thái"
            optionFilterProp="children"
            allowClear
            onChange={(event) => {
              setFilterStatus(event);
              setFilterStatusName(event === 'INPROCESS' ? 'Đang xử lý' : event === 'COMPLETED' ? 'Đã hoàn tất' : null);
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
            className="rounded-[10px] w-full sm:w-[195px] lg:w-[210px] select-search mb-4 lg:mb-0"
            placeholder="Chọn cửa hàng chuyển"
            optionFilterProp="children"
            allowClear
            onChange={(event) => {
              setFilterStore(event);
            }}
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
        </div>

        <div
          className={classNames('sm:relative my-2 lg:my-0 sm:mt-0 mt-4', {
            '!mb-8': showValidateFilter,
          })}
        >
          <div className="sm:flex gap-3 items-end justify-end flex-col md:flex-row">
            <Space
              direction="vertical"
              className="flex items-center gap-2 lg:w-[235px] sm:justify-between justify-start"
            >
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
            <Space
              direction="vertical"
              className="flex items-center gap-2 sm:mt-0 mt-2 lg:w-[235px] datepicker-to !justify-start sm:!justify-between"
            >
              <p className="text-[12px] text-left w-auto lg:w-[56px]">Đến ngày</p>{' '}
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
            <span className="text-red-500 absolute right-0 my-1 sm:mb-0 mb-4 z-10">
              Ngày kết thúc phải lớn hơn ngày bắt đầu
            </span>
          )}
        </div>
      </div>
    ),
  });
  useEffect(() => {
    switch (urlSearch.get('tab')) {
      case '1':
        +keyTab !== 1 && setKeyTab(1);
        break;
      case '2':
        +keyTab !== 2 && setKeyTab(2);
        break;
      default:
        setKeyTab(1);
        break;
    }
  }, [location.search]);

  const items = [
    {
      label:"Hàng nhập", 
      key:"1", 
      children: 
        <div className="min-h-screen  bg-white relative rounded-md ">
          <div className="bg-white pt-6 pb-10 px-6 rounded-md">       
            {dataTableProduct()}
          </div>
        </div>
    },
    {
      label:"Hàng chuyển", 
      key:"2", 
      children: 
        <div className="min-h-screen  bg-white relative rounded-md ">
          <div className="bg-white pt-6 pb-10 px-6 rounded-md">{dataTableProductTransfer()}</div>
        </div>
    },
  ]

  return (
    <div className="table-category min-h-screen product-wrapper">
      <p className="text-2xl font-bold text-teal-900 mb-6">Chuyển hàng </p>
      <Tabs activeKey={String(keyTab)} items={items} onChange={onChange} style={{ display: 'flex', justifyContent: 'space-between' }}>
      </Tabs>
    </div>
  );
};

export default App;
