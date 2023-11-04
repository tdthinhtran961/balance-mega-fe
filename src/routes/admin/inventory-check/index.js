import React, { useState, Fragment, useEffect, useCallback, useRef, useReducer } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { HookDataTable } from 'hooks';
import { routerLinks, reFormatDateString, formatDateString, getFormattedDate, formatSubmit } from 'utils';
import { useAuth } from 'global';
import { DatePicker, Select, Space } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import { tableInventoryCheckList } from 'columns/inventory-check';
import { InventoryCheckService } from 'services/inventory-check';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const fullTextSearchURL = urlSearch.get('fullTextSearch') !== null ? urlSearch.get('fullTextSearch') : '';
  const filterStatusURL = urlSearch.get('status');
  const roleCode = user?.userInfor?.roleCode;
  const [filterStatus, setFilterStatus] = useState(filterStatusURL ?? filterStatusURL);
  const [filterStatusName, setFilterStatusName] = useState();
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const [filterDate, dispatch] = useReducer(reducer, initDate);
  const [indexParams, setIndexParams] = useState({});
  const [queryParams, setQueryParams] = useState({});

  const [dataExcel, setDataExcel] = useState([]);
  const [headExcelInfo, setHeadExcelInfo] = useState({
    status: filterStatus,
    dateFrom: '',
    dateTo: '',
    // fullTextSerach: fullTextSearchURL,
    fullTextSearch: fullTextSearchURL,
  });

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

  useEffect(() => {
    initFunction();
  }, [initFunction, pathname]);

  const queryParamsString = Object.keys(queryParams)
    .filter((key) => queryParams[key] !== null && queryParams[key] !== undefined)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&');

  useEffect(() => {
    handleTableChange();
    navigate(`${routerLinks('InventoryCheck')}?${queryParamsString}`);
  }, [filterStatus, filterDate, fullTextSearchURL]);

  const handleCopy = (uuid) => {
    return navigate(routerLinks('InventoryCheckCreate') + `?uuid=${uuid}`);
  };
  const [handleTableChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => navigate(routerLinks('InventoryCheckEdit') + `?uuid=${data.uuid}`),
    }),
    isLoading,
    setIsLoading,
    Get: async (params) => {
      setIndexParams(params);
      setQueryParams({
        status: filterStatus,
        fullTextSearch: params?.fullTextSearch,
        // fullTextSerach: params?.fullTextSearch,
      });
      const res = await InventoryCheckService.get({
        ...params,
        filterDate: {
          dateFrom: formatSubmit(filterDate.dateFrom),
          dateTo: formatSubmit(filterDate.dateTo),
        },
        status: filterStatus,
      });
      setHeadExcelInfo((prev) => ({
        ...prev,
        status: filterStatus,
        dateFrom: formatSubmit(filterDate.dateFrom),
        dateTo: formatSubmit(filterDate.dateTo),
        fullTextSearch: params?.fullTextSearch,
        // fullTextSerach: params?.fullTextSearch,
      }));
      setDataExcel(res.data);
      return res;
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} kiểm kê`,
    columns: tableInventoryCheckList({
      handleCopy,
      roleCode,
      indexParams,
    }),
    save: true,
    searchPlaceholder: 'Mã kiểm kê',
    loadFirst: true,
    rightHeader: (
      <div className="flex items-center flex-col sm:flex-row gap-3">
        <Select
          className="w-full sm:w-[245px] mr-0 lg:ml-4 rounded-[10px]"
          placeholder="Chọn trạng thái"
          optionFilterProp="children"
          allowClear
          onChange={(event) => {
            setQueryParams({
              status: event,
            });
            setFilterStatus(event);
            setFilterStatusName(
              event === 'INPROCESS'
                ? 'Đang xử lý'
                : event === 'COMPLETED'
                ? 'Đã hoàn tất'
                : event === 'CANCELED'
                ? 'Đã hủy'
                : null,
            );
          }}
          options={[
            { label: 'Đang xử lý', value: 'INPROCESS' },
            { label: 'Đã hoàn tất', value: 'COMPLETED' },
            { label: 'Đã hủy', value: 'CANCELED' },
          ]}
          defaultValue={
            filterStatus && filterStatus !== 'null' && filterStatus !== 'undefined'
              ? { value: filterStatus, label: filterStatusName }
              : null
          }
        ></Select>
      </div>
    ),
    subHeader: (data) =>
      (roleCode === 'OWNER_STORE' ) && (
        <Fragment>
          <div className="flex flex-col sm:flex-row lg:items-start sm:items-end items-start justify-between">
            <div
              className={classNames('sm:relative my-2 lg:my-0 sm:mt-0 mt-4', {
                '!mb-8': showValidateFilter,
              })}
            >
              <div className="sm:flex gap-3 items-end justify-end flex-col lg:flex-row">
                <Space
                  direction="vertical"
                  className="flex items-center gap-2 sm:w-[245px] lg:ml-4 sm:justify-between justify-start"
                >
                  <p className="text-[12px] text-left sm:w-auto sm:mr-0 mr-4">Từ ngày</p>{' '}
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
                  className="flex items-center gap-2 sm:mt-0 mt-2 sm:w-[245px] datepicker-to !justify-start sm:!justify-between "
                >
                  <p className="text-[12px] text-left w-[61px] sm:w-auto">Đến ngày</p>{' '}
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
            <button
              className={
                ' text-white !w-[136px] h-[36px] font-normal justify-center rounded-[10px] flex items-center bg-teal-900 hover:bg-teal-700 sm:ml-auto mb-2 lg:mb-0'
              }
              onClick={() => navigate(`${routerLinks('InventoryCheckCreate')}`)}
              id="addBtn"
            >
              <i className="las la-plus mr-1 bold"></i>
              {' Thêm mới'}
            </button>
          </div>
        </Fragment>
      ),
  });

  const handleExport = async () => {
    const result = await InventoryCheckService.get({
      page: 0,
      perPage: 0,
      status: filterStatus,
      filterDate: {
        dateFrom: formatSubmit(filterDate.dateFrom),
        dateTo: formatSubmit(filterDate.dateTo),
      },
      fullTextSearch: fullTextSearchURL,
    });
    if (result && result?.data?.length > 0) {
      const dataExcel = result?.data?.map((i, idx) => ({
        stt: idx + 1,
        code: i?.code,
        description: i?.description,
        checkDate: i.checkDate ? moment(i.checkDate).format('DD/MM/YYYY') : null,
        approvalDate: i.approvalDate ? moment(i.approvalDate).format('DD/MM/YYYY') : null,
        status: i.status === 'INPROCESS' ? 'Đang xử lý' : i.status === 'COMPLETED' ? 'Đã hoàn tất' : 'Đã hủy',
      }));
      const Heading = [['STT', 'Mã kiểm kê', 'Mô tả', 'Ngày kiểm kê', 'Ngày duyệt', 'Trạng thái']];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.sheet_add_aoa(wb, Heading, {
        origin: 'A8',
      });
      XLSX.utils.sheet_add_aoa(ws, [['BÁO CÁO KIỂM KÊ']], { origin: 'B1' });

      // Thông tin file Excel (filters, tên cửa hàng, nhà cc...)
      XLSX.utils.sheet_add_aoa(ws, [['Tìm kiếm:', headExcelInfo.fullTextSearch || fullTextSearchURL]], {
        origin: 'A3',
      });
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            'Trạng thái :',
            headExcelInfo.status === 'INPROCESS'
              ? 'Đang xử lý'
              : headExcelInfo.status === 'COMPLETED'
              ? 'Đã hoàn tất'
              : headExcelInfo.status === 'CANCELED'
              ? 'Đã hủy'
              : null,
          ],
        ],
        { origin: 'E3' },
      );
      XLSX.utils.sheet_add_aoa(
        ws,
        [['Từ ngày', headExcelInfo.dateFrom === '' ? null : moment(headExcelInfo.dateFrom).format('DD/MM/YYYY')]],
        { origin: 'A5' },
      );
      XLSX.utils.sheet_add_aoa(
        ws,
        [['Đến ngày', headExcelInfo.dateTo === '' ? null : moment(headExcelInfo.dateTo).format('DD/MM/YYYY')]],
        { origin: 'E5' },
      );
      XLSX.utils.sheet_add_json(wb, dataExcel, { origin: 'A9', skipHeader: true, skipcolumn: 1 });
      XLSX.utils.book_append_sheet(wb, ws, 'Kiểm kê');
      XLSX.writeFile(wb, 'Kiểm kê.xlsx');
    }
  };
  return (
    <Fragment>
      <div className="table-store min-h-screen ">
        <p className="text-2xl font-bold text-teal-900 mb-6">Danh Sách Kiểm Kê</p>
        <div className="bg-white pt-6 pb-10 px-4 rounded-md">{DataTable()}</div>
        <div className="flex justify-center sm:justify-end items-center mt-4 ">
          <button
            disabled={dataExcel?.length === 0}
            type="submit"
            className="bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center w-[171px] h-11 justify-center disabled:opacity-60 disabled:pointer-events-none "
            onClick={() => handleExport()}
          >
            Xuất báo cáo
          </button>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
