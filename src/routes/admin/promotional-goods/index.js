import React, { useState, Fragment, useEffect, useCallback, useRef, useReducer } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { HookDataTable } from 'hooks';
import { routerLinks, getFormattedDate, formatDateString, reFormatDateString, formatSubmit } from 'utils';
import { useAuth } from 'global';
import './index.less';
import { ColumnTableList } from 'columns/promotional-goods';
import { PromotionalGoodsService } from 'services/PromotionalGoods';
import { DatePicker, Select, Space } from 'antd';
import DateFilterBar from './components/DateFilterBar';
import moment from 'moment';
import { SupplierService } from 'services/supplier';
import classNames from 'classnames';

let date = new Date();
let firstDay = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
let initDate = {
  dateFrom: formatDateString(getFormattedDate(firstDay)) + ' 00:00:00',
  dateTo: formatDateString(getFormattedDate(date)) + ' 23:59:59',
};
const { Option } = Select;

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
  const filterStoreURL = urlSearch.get('storeId');
  const filterSupplierURL = urlSearch.get('supplierId');
  const fullTextSearchURL = urlSearch.get('promotionOrderCode') !== null ? urlSearch.get('promotionOrderCode') : '';
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const storeId = user?.userInfor?.subOrgId;

  const [supplierList, setSupplierList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [filterSupplier, setFilterSupplier] = useState(filterSupplierURL ?? filterSupplierURL);
  const [filterStore, setFilterStore] = useState(filterStoreURL ?? filterStoreURL);
  const [filterDate, dispatch] = useReducer(reducer, initDate);
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState(filterStatusURL ?? filterStatusURL);
  const [filterStatusName, setFilterStatusName] = useState();
  const [filterStoreName, setFilterStoreName] = useState();
  const [filterSupplierName, setFilterSupplierName] = useState();
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    const fetchListFilter = async () => {
      const supplierList = await PromotionalGoodsService.getListSupplier();
      setSupplierList(supplierList.data);
    };
    (roleCode === 'OWNER_STORE' ) && fetchListFilter();
    const fetchListStore = async () => {
      const storeList = await SupplierService.getStoreListWithOrder();
      setStoreList(storeList.data);
    };
    (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && fetchListStore();
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
    return navigate(routerLinks('PromotionalGoodsEdit') + `?id=${id}`);
  };
  const navigateDetail = (id) => {
    return navigate(routerLinks('PromotionalGoodsDetail') + `?id=${id}`);
  };

  useEffect(() => {
    initFunction();
  }, [initFunction, pathname]);

  useEffect(() => {
    const fetchListFilter = async () => {
      const supplierList = await PromotionalGoodsService.getSupplierListWithOrder();
      setSupplierList(supplierList.data);
      const storeList = await PromotionalGoodsService.getStoreListWithOrder();
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
    roleCode === 'ADMIN' && fetchListFilter();
  }, []);

  const queryParamsString = Object.keys(queryParams)
    .filter((key) => queryParams[key] !== null && queryParams[key] !== undefined)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&');

  useEffect(() => {
    handleTableChange();
    navigate(`${routerLinks('PromotionalGoods')}?${queryParamsString}`);
  }, [fullTextSearchURL, filterStore, filterSupplier, filterStatus, filterDate]);

  const [handleTableChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => navigate(routerLinks('PromotionalGoodsDetail') + `?id=${data.id}`),
    }),
    isLoading,
    setIsLoading,
    fullTextSearch: 'promotionOrderCode',
    searchPlaceholder: 'Mã nhập hàng',
    Get: async (params) => {
      setQueryParams({
        status: filterStatus,
        supplierId: filterSupplier,
        storeId: filterStore,
        promotionOrderCode: params?.promotionOrderCode,
      });
      return roleCode === 'OWNER_STORE' 
        ? await PromotionalGoodsService.get(
            { ...params, storeId, filterDate, supplierId: filterSupplier, status: filterStatus },
            storeId,
          )
        : roleCode === 'ADMIN'
        ? await PromotionalGoodsService.getPromotionOrderList({
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
        : null;
    },
    save: true,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`,
    columns: ColumnTableList({
      roleCode,
      navigateEdit,
      navigateDetail,
      handDelete: async (listId) => {
        (await PromotionalGoodsService.delete(listId)) && handleTableChange();
      },
    }),
    subHeader: (data) =>
      (roleCode === 'OWNER_STORE' ) && (
        <Fragment>
          <div className="flex justify-end items-end lg:block">
            <button
              className={
                'lg:mb-8 mb-4 text-white !w-[136px] h-[36px] font-normal justify-center rounded-[10px] flex items-center bg-teal-900 hover:bg-teal-700 sm:ml-auto mt-3'
              }
              onClick={() => navigate(`${routerLinks('PromotionalGoodsCreate')}?step=1`)}
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
            <div className="flex 3xl:my-0 lg:mb-1 md:flex-row flex-col w-full sm:w-fit">
              <Select
                className="w-full sm:w-[195px] mr-6 rounded-[10px] lg:mb-0 mb-4"
                placeholder="Chọn trạng thái"
                optionFilterProp="children"
                allowClear
                onChange={(event) => {
                  setQueryParams({
                    ...queryParams,
                    status: event,
                  });
                  setFilterStatus(event);
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
                className="rounded-[10px] w-full sm:w-[195px] select-search mb-4 lg:mb-0"
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
                      <Option key={index} value={item?.supplierId}>
                        {item?.supplier?.name}
                      </Option>
                    );
                  })}
              </Select>
            </div>
            <div
              className={classNames('sm:relative lg:my-2 lg:my-0 sm:mt-0 ', {
                '!mb-8': showValidateFilter,
              })}
            >
              <div className="sm:flex gap-3 items-end justify-end flex-col md:flex-row">
                <Space
                  direction="vertical"
                  className="flex items-center gap-2 lg:w-[245px] lg:ml-4 sm:justify-between justify-start !mb-4 sm:!mb-0"
                >
                  <p className="text-[12px] text-left w-auto lg:w-[56px] sm:mr-0 mr-4">Từ ngày</p>{' '}
                  {formatDateString(getFormattedDate(firstDay)) !== '1970/01/01' ? (
                    <DatePicker
                      className="!bg-white"
                      onChange={onChangeDateFrom}
                      format="DD/MM/YYYY"
                      defaultValue={moment(getFormattedDate(firstDay), 'DD/MM/YYYY')}
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
                  className="flex items-center gap-2 sm:mt-0 mt-2 lg:w-[245px] datepicker-to !justify-start sm:!justify-between "
                >
                  <p className="text-[12px] text-left w-[61px] w-auto lg:w-[56px]">Đến ngày</p>{' '}
                  <DatePicker
                    onChange={onChangeDateTo}
                    format="DD/MM/YYYY"
                    defaultValue={moment()}
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
      ) : roleCode === 'ADMIN' ? (
        <div className="flex 3xl:items-center xl:items-end items-start 3xl:flex-row flex-col 3xl:gap-3">
          <div className="flex 3xl:my-0 sm:flex-row flex-col 3xl:mb-0 sm:mb-4 xl:mt-0 lg:mt-4 w-full sm:w-fit">
            <Select
              className="w-full sm:w-[190px] mr-0 sm:mr-6 rounded-[10px] sm:mb-0 mb-2"
              placeholder="Chọn cửa hàng"
              optionFilterProp="children"
              allowClear
              onChange={(event) => {
                setQueryParams({
                  ...queryParams,
                  storeId: event,
                });
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
                    <Option key={index} value={item?.id}>
                      {item?.name}
                    </Option>
                  );
                })}
            </Select>
            <Select
              className="w-full sm:w-[190px] rounded-[10px]"
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
      ) : null,
  });

  return (
    <Fragment>
      <div className="table-store min-h-screen ">
        <p className="text-2xl font-bold text-teal-900 mb-6">Nhập hàng trực tiếp</p>
        <div className="bg-white pt-6 pb-10 px-4 rounded-md table-promotional">{DataTable()}</div>
      </div>
    </Fragment>
  );
};
export default Page;
