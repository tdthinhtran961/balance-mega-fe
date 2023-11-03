import React, { Fragment, useState, useEffect, useReducer } from 'react';
import './index.less';
import {
  routerLinks,
  formatSubmit,
  formatCurrency,
  reFormatDateString,
  formatDateString,
  getFormattedDate,
} from 'utils';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { HookDataTable } from 'hooks';
import { SupplierService } from 'services/supplier';
import { useAuth } from 'global';
import { ColumnReturnGoods } from 'columns/merchandiseManagement';
import moment from 'moment';
import { Select, Space, DatePicker } from 'antd';
import classNames from 'classnames';
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

const PromotionOrderManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const filterStoreURL = urlSearch.get('idStore');
  const filterStatusURL = urlSearch.get('status');
  const fullTextSearchURL = urlSearch.get('inventoryOrderCode') !== null ? urlSearch.get('inventoryOrderCode') : '';
  const { user } = useAuth();
  const storeId = user?.userInfor?.subOrgId;
  const roleCode = user?.userInfor?.roleCode;
  const [isLoading, setIsLoading] = useState(false);
  const navigateDetail = (idOrder) => {
    return navigate(routerLinks('OrderDetail') + `?id=${idOrder}`);
  };
  const [storeList, setStoreList] = useState([]);
  const [filterStore, setFilterStore] = useState(filterStoreURL ?? filterStoreURL);
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState(filterStatusURL ?? filterStatusURL);
  const [filterStatusName, setFilterStatusName] = useState();
  const [filterStoreName, setFilterStoreName] = useState();
  const [filterDate, dispatch] = useReducer(reducer, initDate);
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

  useEffect(() => {
    const fetchListStore = async () => {
      const storeList = await SupplierService.getStoreListForStore();
      setStoreList(storeList.data);
      if (filterStore !== 'null' && filterStore) {
        const value = storeList.data.find((item) => item.id === filterStore).name;
        setFilterStoreName(value);
      }
    };
    fetchListStore();
  }, [roleCode]);

  const queryParamsString = Object.keys(queryParams)
    .filter((key) => queryParams[key] !== null && queryParams[key] !== undefined)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&');

  useEffect(() => {
    handleChange();
    navigate(`${routerLinks('ManageReturnGoods')}?${queryParamsString}`);
  }, [filterStatus, filterDate, filterStore, fullTextSearchURL]);

  const [handleChange, DataTab] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) =>
        navigate(routerLinks('ManageReturnGoodsDetail') + `?view=admin&id=${data?.id}`, {
          state: { billCode: data?.billCode },
        }),
    }),
    isLoading,
    setIsLoading,
    showSearch: true,
    save: true,
    Get: async (params) => {
      setQueryParams({
        status: filterStatus,
        idStore: filterStore,
        inventoryOrderCode: params?.promotionOrderCode,
      });
      return await SupplierService.getReturnGoodsList({
        ...params,
        inventoryOrderCode: fullTextSearchURL,
        idSupplier: storeId,
        type: 'RETURN_GOOD',
        status: filterStatus === 'undefined' || filterStatus === 'null' || filterStatus === null ? '' : filterStatus,
        filterDate: {
          dateFrom: formatSubmit(filterDate.dateFrom),
          dateTo: formatSubmit(filterDate.dateTo),
        },
        idStore: filterStore === 'undefined' || filterStore === 'null' || filterStore === null ? '' : filterStore,
      });
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`,
    columns: ColumnReturnGoods({
      formatCurrency,
      navigateDetail,
      roleCode,
    }),
    fullTextSearch: 'inventoryOrderCode',
    searchPlaceholder: 'Mã trả hàng',
    rightHeader: (
      <div className="flex items-center flex-col md:flex-row gap-3">
        <Select
          className="w-full lg:w-[245px] mr-0 lg:ml-4 rounded-[10px]"
          placeholder="Chọn trạng thái"
          optionFilterProp="children"
          allowClear
          onChange={(event) => {
            setQueryParams({
              ...queryParams,
              status: event,
            });
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
          className="rounded-[10px] w-full lg:w-[245px]"
          placeholder="Chọn cửa hàng"
          optionFilterProp="children"
          allowClear
          onChange={(event) => {
            setQueryParams({
              ...queryParams,
              idStore: event,
            });
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
                <Option key={index} value={item?.storeId}>
                  {item?.store?.name}
                </Option>
              );
            })}
        </Select>
      </div>
    ),
    subHeader: (data) => (
      <Fragment>
        <div
          className={classNames('sm:relative my-2 lg:my-0 sm:mt-0 mt-4', {
            '!mb-8': showValidateFilter,
          })}
        >
          <div className="sm:flex gap-3 items-end lg:justify-end flex-col md:flex-row">
            <Space direction="vertical" className="flex items-center gap-2 lg:w-[223px]">
              <p className="text-[12px] text-left sm:w-auto lg:w-[56px] sm:mr-0 mr-4">Từ ngày</p>{' '}
              {formatDateString(getFormattedDate(firstDay)) !== '1970/01/01' ? (
                <DatePicker
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
                  onChange={onChangeDateFrom}
                  format="DD/MM/YYYY"
                  disabledDate={(current) => {
                    return current && current.valueOf() > Date.now();
                  }}
                  size={'middle'}
                />
              )}
            </Space>
            <Space direction="vertical" className="flex items-center gap-2 sm:mt-0 mt-2 lg:w-[233px] datepicker-to">
              <p className="text-[12px] text-left sm:w-auto lg:w-[56px]">Đến ngày</p>{' '}
              <DatePicker
                onChange={onChangeDateTo}
                format="DD/MM/YYYY"
                defaultValue={moment(getFormattedDate(date), 'DD/MM/YYYY')}
                disabledDate={(current) => {
                  return current && current.valueOf() > Date.now();
                }}
                className={'sm:ml-0'}
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
      </Fragment>
    ),
  });

  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="text-2xl font-bold text-teal-900 mb-6">Quản lý trả hàng</p>
        <div className="bg-white w-full rounded-xl mt-5 relative pt-4 pb-6 px-6">
          <div className="table-return-supplier">{DataTab()}</div>
        </div>
      </div>
    </Fragment>
  );
};
export default PromotionOrderManagement;
