import React, { useState, Fragment, useEffect, useCallback, useRef, useReducer } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { HookDataTable } from 'hooks';
import { routerLinks, getFormattedDate, formatDateString, reFormatDateString, formatSubmit } from 'utils';
import { useAuth } from 'global';
import './index.less';
import { ColumnTableList } from 'columns/disposal-goods';
import { DisposalGoodsService } from 'services/DisposalGoods';
import { Select, Space, DatePicker } from 'antd';
import DateFilterBar from './components/DateFilterBar';
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
  const { pathname } = useLocation();
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const mount = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const storeId = user?.userInfor?.subOrgId;
  const filterStatusURL = urlSearch.get('status');
  const filterStoreURL = urlSearch.get('idStore');
  const fullTextSearchURL = urlSearch.get('inventoryOrderCode') !== null ? urlSearch.get('inventoryOrderCode') : '';

  const [storeList, setStoreList] = useState([]);
  const [filterStore, setFilterStore] = useState(filterStoreURL ?? filterStoreURL);
  const [filterStoreName, setFilterStoreName] = useState();
  const [filterStatus, setFilterStatus] = useState(filterStatusURL ?? filterStatusURL);
  const [filterStatusName, setFilterStatusName] = useState();
  const [filterDate, dispatch] = useReducer(reducer, initDate);
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    if (roleCode === 'ADMIN') {
      const fetchListFilter = async () => {
        const storeList = await DisposalGoodsService.getStoreListWithOrder();
        setStoreList(storeList.data);
        if (filterStore !== 'null' && filterStore) {
          const value = storeList.data.find((item) => item.id === filterStore).name;
          setFilterStoreName(value);
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

  const navigateEdit = (id) => {
    return navigate(routerLinks('DisposalGoodsEdit') + `?id=${id}`);
  };
  const navigateDetail = (id) => {
    return navigate(routerLinks('DisposalGoodsDetail') + `?id=${id}`);
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
    navigate(`${routerLinks('DisposalGoods')}?${queryParamsString}`);
  }, [filterStore, filterDate, filterStatus, fullTextSearchURL]);

  const [handleTableChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => navigate(routerLinks('DisposalGoodsDetail') + `?id=${data.id}`),
    }),
    isLoading,
    setIsLoading,
    searchPlaceholder: 'Mã hủy hàng',
    fullTextSearch: 'inventoryOrderCode',
    Get: async (params) => {
      setQueryParams({
        idStore: filterStore,
        inventoryOrderCode: params?.inventoryOrderCode,
        status: filterStatus,
      });
      return roleCode === 'OWNER_STORE'
        ? DisposalGoodsService.get({
            ...params,
            idStore: storeId,
            type: 'DISPOSAL_GOOD',
            filterDate: {
              dateFrom: formatSubmit(filterDate.dateFrom),
              dateTo: formatSubmit(filterDate.dateTo),
            },
            status: filterStatus,
          })
        : roleCode === 'ADMIN'
        ? DisposalGoodsService.getDisposalGoodsList({
            ...params,
            idStore: filterStore === 'undefined' || filterStore === 'null' || filterStore === null ? '' : filterStore,
            type: 'DISPOSAL_GOOD',
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
    columns: ColumnTableList({
      roleCode,
      navigateEdit,
      navigateDetail,
      handDelete: async (listId) => {
        (await DisposalGoodsService.delete(listId)) && handleTableChange();
      },
    }),
    subHeader: (data) =>
      (roleCode === 'OWNER_STORE') && (
        <Fragment>
          <div className="flex justify-end items-end lg:block">
            <button
              className={
                'text-white w-[136px] h-[36px] font-normal justify-center rounded-[10px] items-center bg-teal-900 hover:bg-teal-700 sm:ml-auto mt-3 block'
              }
              onClick={() => navigate(`${routerLinks('DisposalGoodsCreate')}?step=2`)}
              id="addBtn"
            >
              <i className="las la-plus mr-1 bold"></i>
              {' Thêm mới'}
            </button>
          </div>
        </Fragment>
      ),
    rightHeader:
      roleCode === 'OWNER_STORE' ? (
        <Fragment>
          <div className="flex 2xl:items-center xl:items-end items-start 2xl:flex-row flex-col 2xl:gap-3">
            <div className="flex 2xl:my-0 lg:mb-4 lg:flex-row flex-col w-full sm:w-fit">
              <Select
                className="w-full sm:w-[200px] mr-0 rounded-[10px] lg:mb-0 sm:mb-2 mb-3"
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
            </div>

            <div
              className={classNames('sm:relative my-2 lg:my-0', {
                '!mb-8': showValidateFilter,
              })}
            >
              <div className="sm:flex gap-4 items-end justify-end flex-col md:flex-row">
                <Space
                  direction="vertical"
                  className="flex items-center gap-2 lg:w-[245px] sm:justify-between justify-start"
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
        <div className="flex 3xl:items-center xl:items-end lg:items-center items-start 3xl:flex-row xl:flex-col lg:flex-row flex-col 3xl:gap-3">
          <Select
            className="w-full sm:w-[190px] rounded-[10px] 3xl:mb-0 sm:mb-4 xl:mt-0 lg:mt-4 sm:mt-1 xl:mr-0 mr-3"
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
            filterOption={(input, option) => {
              return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
                  <Option key={index} value={item?.id} title={item?.name}>
                    {item?.name}
                  </Option>
                );
              })}
          </Select>

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
        <p className="text-2xl font-bold text-teal-900 mb-6">Hủy hàng</p>
        <div className="bg-white pt-6 pb-10 px-6 rounded-md table-disposal">{DataTable()}</div>
      </div>
    </Fragment>
  );
};
export default Page;
