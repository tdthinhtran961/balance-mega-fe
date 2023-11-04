import React, { Fragment, useCallback, useEffect, useRef, useState, useReducer } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { HookDataTable } from 'hooks';
import { DatePicker, Select, Space } from 'antd';
import './index.less';
import { reFormatDateString, routerLinks, formatDateString, getFormattedDate } from 'utils';
import { VoucherService } from 'services/voucher';
import { ColumnTableVouchers } from 'columns/promotionManagement';
import moment from 'moment';
import dayjs from 'dayjs';
const { Option } = Select;
moment.locale('en');
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
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const fullTextSearchURL = urlSearch.get('fullTextSearch') !== null ? urlSearch.get('fullTextSearch') : '';
  const isActiveURL = urlSearch.get('isActive');
  const mount = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(isActiveURL ?? isActiveURL);
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const [isActiveName, setIsActiveName] = useState();
  const [filterDate, dispatch] = useReducer(reducer, initDate);
  const [queryParams, setQueryParams] = useState({});

  const initFunction = useCallback(() => {
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

  useEffect(() => {
    initFunction();
  }, [initFunction, pathname]);

  const queryParamsString = Object.keys(queryParams)
    .filter((key) => queryParams[key] !== null && queryParams[key] !== undefined)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&');

  useEffect(() => {
    handleChange({ ...params, filterDate });
    navigate(`${routerLinks('VoucherManagement')}?${queryParamsString}`);
  }, [isActive, filterDate, fullTextSearchURL]);

  const handleActive = async (uuid) => {
    if (!uuid) return null;
    const res = await VoucherService.active(uuid, { uuid });
    res && handleChange();
    return true;
  };
  const [handleChange, DataTable, params] = HookDataTable({
    loadFirst: false,
    onRow: (data) => ({
      onDoubleClick: (event) => {
        return navigate(routerLinks('VoucherManagementEdit') + `?uuid=${data.uuid}`);
      },
    }),
    searchPlaceholder: 'Mã voucher',
    isLoading,
    setIsLoading,
    Get: async (params) => {
      setQueryParams({
        isActive,
        fullTextSearch: params?.fullTextSearch,
      });
      return await VoucherService.get({
        ...params,
        isActive: isActive === 'undefined' || isActive === 'null' || isActive === null ? '' : isActive,
        filterDate,
      });
    },
    save: true,
    xScroll: 1600,
    yScroll: null,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} voucher`,
    columns: ColumnTableVouchers({ handleActive }),
    rightHeader: (
      <div className="mt-3">
        <div className="sm:relative mb-2 sm:mt-0 mt-3 flex items-start lg:items-center justify-end flex-col lg:flex-row gap-3">
          <Select
            showSearch
            allowClear
            placeholder="Chọn trạng thái"
            optionFilterProp="children"
            className="w-full md:w-80 xl:w-[221px] text-left"
            onChange={(value) => {
              setQueryParams({
                ...queryParams,
                isActive: value,
              });
              setIsActive(value);
              setIsActiveName(value === true ? 'Đang hiệu lực' : value === false ? 'Hết hiệu lực' : null);
            }}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            defaultValue={
              isActive && isActive !== 'null' && isActive !== 'undefined'
                ? { label: isActiveName, value: isActive }
                : null
            }
          >
            <Option value="true">Đang hiệu lực</Option>
            <Option value="false">Hết hiệu lực</Option>
          </Select>
          <div className="">
            <div className="sm:flex gap-3 items-center justify-between flex-col lg:flex-row">
              <Space direction="vertical" className="flex items-center gap-2 lg:w-[223px]">
                <p className="text-[12px] text-left sm:w-auto lg:w-[56px] sm:mr-0 mr-4">Từ ngày</p>{' '}
                {formatDateString(getFormattedDate(firstDay)) !== '1970/01/01' ? (
                  <DatePicker
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
                  defaultValue={dayjs(getFormattedDate(date), 'DD/MM/YYYY')}
                  disabledDate={(current) => {
                    return current && current.valueOf() > Date.now();
                  }}
                  className={'sm:ml-0'}
                  size={'middle'}
                />
              </Space>
            </div>
            {showValidateFilter && (
              <div className="text-red-500 my-2 sm:mb-0 mb-4 lg:text-right">
                Ngày kết thúc phải lớn hơn ngày bắt đầu
              </div>
            )}
          </div>
          <button
            className="bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center w-[133px] justify-center"
            onClick={() => navigate(routerLinks('VoucherManagementCreate'))}
          >
            <i className="las la-plus mr-1" />
            Thêm mới
          </button>
        </div>
      </div>
    ),
    className: 'data-table list-of-stocks',
  });

  return (
    <Fragment>
      <div className="min-h-screen">
        {/* <p className="text-2xl font-bold text-teal-900 mb-8">Quản lý voucher</p> */}
        <div className="bg-white pt-6 pb-10 px-6 rounded-md table-voucher">{DataTable()}</div>
        <div className="flex justify-end items-center mt-4"></div>
      </div>
    </Fragment>
  );
};
export default Page;
