import React, { useState, Fragment, useEffect, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import { ColumnRevenueByOrderAdmin } from 'columns/store';
import { RevenueService } from 'services/revenue';
import { PromotionalGoodsService } from 'services/PromotionalGoods';
import { HookDataTable } from 'hooks';
import { DatePicker, Space, Select, Table } from 'antd';
import { reFormatDateString, formatCurrency, formatDateString, getFormattedDate, routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import * as XLSX from 'xlsx';
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

const OrderRevenue = ({ tabKey }) => {
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const typeURL = urlSearch.get('type');
  const filterStoreURL = urlSearch.get('storeId');
  const filterSupplierURL = urlSearch.get('idSupplier');
  const fullTextSearchURL = urlSearch.get('fullTextSearch') !== null ? urlSearch.get('fullTextSearch') : '';
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState(typeURL ?? typeURL);
  const [filterStore, setFilterStore] = useState(filterStoreURL ?? filterStoreURL);
  const [filterSupplier, setFilterSupplier] = useState(filterSupplierURL ?? filterSupplierURL);
  const [filterTypeName, setFilterTypeName] = useState();
  const [filterStoreName, setFilterStoreName] = useState();
  const [filterSupplierName, setFilterSupplierName] = useState();
  const [filterDate, dispatch] = useReducer(reducer, initDate);
  const [supplierList, setSupplierList] = useState([]);
  const [disableStore, setDisableStore] = useState(true);
  const [storeList, setStoreList] = useState([]);
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const [dataExcel, setDataExcel] = useState([]);
  const [statistical, setStatistical] = useState({});
  const [total, setTotal] = useState({});
  const [queryParams, setQueryParams] = useState({});
  const [paramSExcel, setParamSExcel] = useState({
    page: 0,
    perPage: 0,
    fullTextSearch: '',
    idSupplier: filterSupplier,
    idStore: filterStore,
    type: filterType,
    filterDate,
  });
  const [headExcelInfo, setHeadExcelInfo] = useState({
    fullTextSearch: '',
    dateFrom: dayjs(getFormattedDate(firstDay)).format('YYYY-MM-DD') + ' 00:00:00',
    dateTo: dayjs(new Date()).format('YYYY-MM-DD') + ' 23:59:59',
    type: filterTypeName,
    supplierName: filterSupplierName,
    storeName: filterStoreName,
    totalRenueve: 0,
    totalOderSuccess: 0,
    totalOderReturn: 0,
    totalOderCancel: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const supplierList = await PromotionalGoodsService.getSupplierListWithOrderParams({ supplierType: 'BALANCE' });
      if (
        filterSupplierURL !== null &&
        filterSupplierURL !== 'null' &&
        filterSupplierURL !== undefined &&
        filterSupplierURL !== 'undefined'
      ) {
        setFilterSupplier(filterSupplierURL);
      } else {
        setFilterSupplier(supplierList?.data[0]?.id);
      }
  
      setDisableStore(false);
      setSupplierList(supplierList.data);
      if (filterSupplier !== 'null' && filterSupplier) {
        const valueSupplier = supplierList.data.find((item) => item.id === filterSupplier).name;
        setFilterSupplierName(valueSupplier);
      }
      setHeadExcelInfo((prev) => ({
        ...prev,
        supplierName: supplierList?.data[0]?.name,
      }));
      if (
        filterSupplierURL !== null &&
        filterSupplierURL !== 'null' &&
        filterSupplierURL !== undefined &&
        filterSupplierURL !== 'undefined'
      ) {
        const storeList = await RevenueService.getStoreBySupplier(filterSupplierURL);
        setStoreList(storeList.data);
      } else {
        const storeList = await RevenueService.getStoreBySupplier(supplierList?.data[0]?.id);
        setStoreList(storeList.data);
      }
    }
    fetchData()
  }, []);

  const formatCur = (value) => {
    if (!value) return 0;
    return value || value === 0 ? value : null;
  };

  const onChangeDateFrom = (_, dateString) => {
    if (new Date(reFormatDateString(dateString)) > new Date(filterDate.dateTo)) {
      setShowValidateFilter(true);
      return;
    }
    setShowValidateFilter(false);
    dispatch({ type: 'FROM', dateFrom: dateString });
    const formattedDate = dayjs(dateString, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
    if (formattedDate !== '//') {
      initDate = {
        dateFrom: formattedDate,
        dateTo: formatDateString(getFormattedDate(date)) + ' 23:59:59',
      };
      firstDay = new Date(formattedDate);
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

  const handelTesst = async () => {
    const supplierName = supplierList.find((item) => item?.id === filterSupplier);
    const storeName = storeList.find((item) => item?.id === filterStore);
    const typeName = typeURL === 'RETURN' ? 'Trả hàng' : typeURL === 'RECIEVED' ? 'Bán hàng' : null;
    const res = filterSupplier
      ? await RevenueService.getRevenueOrder({
          ...paramSExcel,
          isExport: true,
        })
      : [];
    setTotal(res?.total);
    const data = res.data?.map((i) => ({
      index: i.index,
      invoiceCode: i.invoiceCode,
      storeName: i.storeName,
      pickUpDate: i.pickUpDate,
      completedDate: i.completedDate,
      subTotal: formatCurrency(formatCur(i.subTotal), ''),
      total: formatCurrency(formatCur(i.total), ''),
      voucherAmount: formatCurrency(formatCur(i.voucherAmount), ''),
      money: formatCurrency(formatCur(i.money), ' '),
      billType: i.billType === 'RETURN' ? ' Trả hàng' : 'Bán hàng',
    }));
    const sum = res.data
      ?.map((i) => ({
        index: i.index,
        invoiceCode: i.invoiceCode,
        storeName: i.storeName,
        pickUpDate: i.pickUpDate,
        completedDate: i.completedDate,
        subTotal: +i.subTotal,
        total: +i.total,
        voucherAmount: +i.voucherAmount,
        money: +i.money,
        billType: i.billType === 'RETURN' ? ' Trả hàng' : 'Bán hàng',
      }))
      ?.reduce((acc, obj) => {
        Object.keys(obj).forEach((key) => {
          acc[key] = (acc[key] || 0) + +obj[key];
        });
        return acc;
      }, {});
    sum.index = '';
    sum.invoiceCode = '';
    sum.storeName = '';
    sum.pickUpDate = '';
    sum.completedDate = 'Tổng';
    sum.subTotal = formatCurrency(formatCur(total.sumSubTotal), ' ');
    sum.total = formatCurrency(formatCur(total.sumTotal), ' ');
    sum.voucherAmount = formatCurrency(formatCur(total.sumVoucherAmount), ' ');
    sum.money = formatCurrency(formatCur(total.sumMoney), ' ');
    sum.billType = '';

    data.push(sum);

    const Heading = [
      [
        'STT',
        'Mã đơn hàng',
        'Tên cửa hàng',
        'Ngày đặt',
        'Ngày nhận',
        'Trước thuế',
        'Sau thuế',
        'Khuyến mãi',
        'Thành tiền',
        'Loại đơn',
      ],
    ];

    const wb = XLSX.utils.book_new();
    // const ws = XLSX.utils.aoa_to_sheet(Heading);
    const ws = XLSX.utils.sheet_add_aoa(wb, Heading, {
      origin: 'A11',
    });
    XLSX.utils.sheet_add_aoa(ws, [['BÁO CÁO DOANH THU NHÀ CUNG CẤP THEO ĐƠN HÀNG']], { origin: 'C1' });

    // Create a new workbook and worksheet
    // const ws = XLSX.utils.aoa_to_sheet(Heading);

    // Thông tin file Excel (filters, tên cửa hàng, nhà cc...)
    XLSX.utils.sheet_add_aoa(ws, [['Tìm kiếm:', headExcelInfo.fullTextSearch]], { origin: 'A3' });
    XLSX.utils.sheet_add_aoa(ws, [['Chọn loại đơn hàng', headExcelInfo.type || filterTypeName || typeName]], {
      origin: 'D3',
    });
    XLSX.utils.sheet_add_aoa(ws, [['Chọn nhà cung cấp:', supplierName?.name]], {
      origin: 'G3',
    });
    XLSX.utils.sheet_add_aoa(ws, [['Chọn cửa hàng:', headExcelInfo.storeName || filterStoreName || storeName?.name]], { origin: 'J3' });
    XLSX.utils.sheet_add_aoa(
      ws,
      [['Từ ngày', headExcelInfo.dateFrom && dayjs(headExcelInfo.dateFrom).format('DD/MM/YYYY')]],
      {
        origin: 'A5',
      },
    );
    XLSX.utils.sheet_add_aoa(
      ws,
      [['Đến ngày', headExcelInfo.dateTo && dayjs(headExcelInfo.dateTo).format('DD/MM/YYYY')]],
      { origin: 'D5' },
    );

    XLSX.utils.sheet_add_aoa(ws, [['Doanh thu:', formatCurrency(headExcelInfo.totalRenueve || 0, ' VND')]], {
      origin: 'A7',
    });
    XLSX.utils.sheet_add_aoa(
      ws,
      [['Tổng số đơn thành công:', formatCurrency(headExcelInfo.totalOderSuccess || 0, ' ')]],
      { origin: 'D7' },
    );
    XLSX.utils.sheet_add_aoa(ws, [['Tổng số đơn trả:', formatCurrency(headExcelInfo.totalOderReturn || 0, ' ')]], {
      origin: 'A9',
    });
    XLSX.utils.sheet_add_aoa(ws, [['Tổng số đơn bị hủy:', formatCurrency(headExcelInfo.totalOderCancel || 0, ' ')]], {
      origin: 'D9',
    });

    XLSX.utils.sheet_add_json(wb, data, { origin: 'A12', skipHeader: true, skipcolumn: 1 });

    // Add the worksheet to the workbook and save the file
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Doanh thu nhà cung cấp theo đơn hàng.xlsx`);
  };

  const queryParamsString = Object.keys(queryParams)
    .filter((key) => queryParams[key] !== null && queryParams[key] !== undefined)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&');

  useEffect(() => {
    handleChangeDataRebvenueByOrder();
    navigate(`${routerLinks('RevenueManagementSupplier')}?${queryParamsString}`);
  }, [filterDate, filterSupplier, filterStore, filterType, fullTextSearchURL]);

  const [handleChangeDataRebvenueByOrder, DataRevenueByOrder] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: async (event) => {
        return data?.billType === 'RECIEVED'
          ? navigate(
              routerLinks('RevenueDetail') + `?id=${data.orderId}` + `&idSupplier=${filterSupplier}` + `management`,
            )
          : navigate(routerLinks('ManageReturnGoodsDetail') + `?view=admin&id=${data?.orderId}`, {
              state: { billCode: data?.code },
            });
      },
    }),
    showSearch: true,
    searchPlaceholder: 'Tìm kiếm theo mã đơn hàng',
    isLoading,
    setIsLoading,
    save: true,
    Get: async (params) => {
      setQueryParams({
        idSupplier: filterSupplier,
        storeId: filterStore,
        type: filterType,
        fullTextSearch: params?.fullTextSearch,
      });
      const res = filterSupplier
        ? await RevenueService.getRevenueOrder({
            ...params,
            idSupplier:
              filterSupplier === 'undefined' || filterSupplier === 'null' || filterSupplier === null
                ? ''
                : filterSupplier,
            idStore: filterStore === 'undefined' || filterStore === 'null' || filterStore === null ? '' : filterStore,
            type: filterType === 'undefined' || filterType === 'null' || filterType === null ? '' : filterType,
            filterDate,
          })
        : [];
      setStatistical(res.statistical);
      setParamSExcel((prev) => ({
        ...prev,
        page: 1,
        perPage: params?.page * params?.perPage,
        fullTextSearch: params?.fullTextSearch,
        idSupplier: filterSupplier,
        idStore: filterStore,
        type: filterType,
        filterDate,
      }));
      setHeadExcelInfo((prev) => ({
        ...prev,
        fullTextSearch: params?.fullTextSearch,
        dateFrom: filterDate?.dateFrom,
        dateTo: filterDate?.dateTo,
        totalRenueve: res?.statistical?.totalRenueve,
        totalOderSuccess: res?.statistical?.totalOderSuccess,
        totalOderReturn: res?.statistical?.totalOderReturn,
        totalOderCancel: res?.statistical?.totalOderCancel,
      }));
      setTotal(res?.total);
      setDataExcel(res.data);
      return res;
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`,
    columns: ColumnRevenueByOrderAdmin(filterSupplier),
    subHeader: () => (
      <Fragment>
        {/* show 2xl */}
        <div className="2xl:hidden xl:flex hidden justify-between">
          <div className="flex flex-row">
            <div className="flex flex-col">
              <Select
                className="sm:w-[195px] w-full rounded-[10px] mr-0 lg:mr-6 lg:mb-0 mb-2"
                placeholder="Chọn nhà cung cấp *"
                optionFilterProp="children"
                value={filterSupplier}
                allowClear
                onChange={async (event, options) => {
                  setQueryParams({
                    ...queryParams,
                    idSupplier: event,
                  });
                  setFilterSupplier(event);
                  event && setDisableStore(false);
                  setHeadExcelInfo((prev) => ({
                    ...prev,
                    supplierName: options?.title,
                  }));
                  setFilterSupplierName(options?.title);
                  const storeList = event && (await RevenueService.getStoreBySupplier(event));
                  setStoreList(storeList.data);
                  setFilterStore();
                  setFilterStoreName();
                }}
                onClear={() => {
                  setDisableStore(true);
                }}
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.title
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .indexOf(
                        input
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, ''),
                      ) >= 0
                  );
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
                      <Option key={index} value={item?.id} title={item?.name}>
                        {item?.name}
                      </Option>
                    );
                  })}
              </Select>
              <div>
                {!filterSupplier && (
                  <span className="text-red-500 right-0 my-1 sm:mb-0 mb-4">Vui lòng chọn nhà cung cấp</span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <Select
                disabled={disableStore}
                className="sm:w-[195px] w-full rounded-[10px]"
                placeholder="Chọn cửa hàng"
                optionFilterProp="children"
                allowClear
                onChange={(event, options) => {
                  setQueryParams({
                    ...queryParams,
                    storeId: event,
                  });
                  setFilterStore(event);
                  setHeadExcelInfo((prev) => ({
                    ...prev,
                    storeName: options?.title,
                  }));
                  setFilterStoreName(options?.title);
                }}
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.title
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .indexOf(
                        input
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, ''),
                      ) >= 0
                  );
                }}
                value={
                  filterStore && filterStore !== 'null' && filterStore !== 'undefined' && filterStore !== undefined
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
              <div>{!filterSupplier && <span className="text-white"></span>}</div>
            </div>
          </div>
          <div
            className={classNames('sm:relative my-2 lg:my-0', {
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
                  className={'sm:ml-0 datepicker-to-input'}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 sm:gap-4 mt-[40px] sm:mb-3 mb-4">
          <div className="total-revenue w-full rounded-xl shadow-[0_0_9px_rgb(0,0,0,0.25)] pt-3 pb-5 px-5 text-center flex flex-col items-center justify-center h-[115px] mb-4">
            <h1 className="font-bold mb-3">Doanh thu</h1>
            <span className="text-teal-900 text-xl font-bold mt-auto">
              {(statistical?.totalRenueve && formatCurrency(statistical?.totalRenueve || 0, ' VND')) || 0}
            </span>
          </div>
          <div className="total-successfulOrder w-full mt-4 sm:mt-0 rounded-xl shadow-[0_0_9px_rgb(0,0,0,0.25)] pt-3 pb-5 px-5 text-center flex flex-col items-center justify-center h-[115px] mb-4">
            <h1 className="font-bold mb-3">Tổng số đơn thành công</h1>
            <span className="text-teal-900 text-xl font-bold mt-auto">
              {(statistical?.totalOderSuccess && formatCurrency(statistical?.totalOderSuccess || 0, ' ')) || 0}
            </span>
          </div>
          <div className="total-successfulOrder w-full mt-4 sm:mt-0 rounded-xl shadow-[0_0_9px_rgb(0,0,0,0.25)] pt-3 pb-5 px-5 text-center flex flex-col items-center justify-center h-[115px] mb-4">
            <h1 className="font-bold mb-3">Tổng số đơn trả</h1>
            <span className="text-teal-900 text-xl font-bold mt-auto">
              {(statistical?.totalOderReturn && formatCurrency(statistical?.totalOderReturn || 0, ' ')) || 0}
            </span>
          </div>
          <div className="total-cancelledOrder w-full mt-4 sm:mt-0 rounded-xl shadow-[0_0_9px_rgb(0,0,0,0.25)] pt-3 pb-5 px-5 text-center flex flex-col items-center justify-center h-[115px] mb-4">
            <h1 className="font-bold mb-3">Tổng số đơn bị hủy</h1>
            <span className="text-teal-900 text-xl font-bold mt-auto">
              {(statistical?.totalOderCancel && formatCurrency(statistical?.totalOderCancel || 0, ' ')) || 0}
            </span>
          </div>
        </div>
      </Fragment>
    ),
    rightHeader: (
      <Fragment>
        <div className="flex xl:items-end flex-col 2xl:mt-0">
          {/* show 3xl */}
          <div className="flex xl:hidden 2xl:flex lg:flex-row flex-col 2xl:mb-4 mb-2 xl:mt-0 mt-2 w-full">
            <div className="flex flex-col">
              <Select
                className="sm:w-[195px] w-full rounded-[10px] mr-0 lg:mr-6 lg:mb-0 mb-2"
                placeholder="Chọn loại đơn hàng"
                optionFilterProp="children"
                allowClear
                onChange={(event) => {
                  setQueryParams({
                    ...queryParams,
                    type: event,
                  });
                  setFilterType(event);
                  setHeadExcelInfo((prev) => ({
                    ...prev,
                    type: event === 'RETURN' ? 'Trả hàng' : event === 'RECIEVED' ? 'Bán hàng' : null,
                  }));
                  setFilterTypeName(event === 'RETURN' ? 'Trả hàng' : event === 'RECIEVED' ? 'Bán hàng' : null);
                }}
                defaultValue={
                  filterType && filterType !== 'null' && filterType !== 'undefined'
                    ? { value: filterType, label: filterTypeName }
                    : null
                }
              >
                <Option value="RECIEVED">Bán hàng</Option>
                <Option value="RETURN">Trả hàng</Option>
              </Select>
              <div>{!filterSupplier && <span className="text-white"></span>}</div>
            </div>
            <div className="flex flex-col">
              <Select
                className="sm:w-[195px] w-full rounded-[10px] mr-0 lg:mr-6 lg:mb-0 mb-2"
                placeholder="Chọn nhà cung cấp *"
                optionFilterProp="children"
                allowClear
                onChange={async (event, options) => {
                  setQueryParams({
                    ...queryParams,
                    idSupplier: event,
                  });
                  setFilterSupplier(event);
                  event && setDisableStore(false);
                  setHeadExcelInfo((prev) => ({
                    ...prev,
                    supplierName: options?.title,
                  }));
                  const storeList = event && (await RevenueService.getStoreBySupplier(event));
                  setStoreList(storeList.data);
                  setFilterStore(undefined);
                  setFilterStoreName(undefined);
                  setFilterSupplierName(options?.title);
                }}
                onClear={() => {
                  setDisableStore(true);
                }}
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.title
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .indexOf(
                        input
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, ''),
                      ) >= 0
                  );
                }}
                value={
                  filterSupplier && filterSupplier !== 'null' && filterSupplier !== 'undefined'
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
              <div>
                {!filterSupplier && (
                  <span className="text-red-500 right-0 my-1 sm:mb-0 mb-4">Vui lòng chọn nhà cung cấp</span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <Select
                disabled={disableStore}
                className="sm:w-[195px] w-full rounded-[10px]"
                placeholder="Chọn cửa hàng"
                optionFilterProp="children"
                allowClear
                onChange={(event, options) => {
                  setQueryParams({
                    ...queryParams,
                    storeId: event,
                  });
                  setFilterStore(event);
                  setHeadExcelInfo((prev) => ({
                    ...prev,
                    storeName: options?.title,
                  }));
                  setFilterStoreName(options?.title);
                }}
                showSearch
                filterOption={(input, option) => {
                  return (
                    option.title
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .indexOf(
                        input
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, ''),
                      ) >= 0
                  );
                }}
                value={
                  filterStore && filterStore !== 'null' && filterStore !== 'undefined' && filterStore !== undefined
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
              <div>{!filterSupplier && <span className="text-white"></span>}</div>
            </div>
          </div>
          {/* show 3xl */}
          <div
            className={classNames('sm:relative my-2 lg:my-0 flex xl:hidden 2xl:flex', {
              '!mb-8': showValidateFilter,
            })}
          >
            <div className="sm:flex gap-3 items-end justify-end flex-col md:flex-row">
              <Space
                direction="vertical"
                className="flex items-center gap-2 lg:w-[235px] sm:justify-between justify-start"
              >
                <p className="text-[12px] text-left w-auto lg:w-[56px] sm:mr-0 mr-2">Từ ngày</p>{' '}
                {formatDateString(getFormattedDate(firstDay)) !== '1970/01/01' ? (
                  <DatePicker
                    onChange={onChangeDateFrom}
                    format={'DD/MM/YYYY'}
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
              <Space
                direction="vertical"
                className="flex items-center gap-2 sm:mt-0 mt-2 lg:w-[235px] datepicker-to !justify-start sm:!justify-between"
              >
                <p className="text-[12px] text-left w-auto lg:w-[56px]">Đến ngày</p>{' '}
                <DatePicker
                  onChange={onChangeDateTo}
                  format="DD/MM/YYYY"
                  // defaultValue={dayjs(getFormattedDate(date), 'DD/MM/YYYY')}
                  defaultValue={dayjs(getFormattedDate(date), 'DD/MM/YYYY')} 
                  disabledDate={(current) => {
                    return current && current.valueOf() > Date.now();
                  }}
                  className={'sm:ml-0 datepicker-to-input'}
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
          {/* show 2xl */}
          <div className="2xl:hidden xl:flex hidden justify-end mb-2 mt-0 w-full">
            <Select
              className="sm:w-[195px] w-full rounded-[10px] mr-0 lg:mb-0 mb-2"
              placeholder="Chọn loại đơn hàng"
              optionFilterProp="children"
              allowClear
              onChange={(event) => {
                setQueryParams({
                  ...queryParams,
                  type: event,
                });
                setFilterType(event);
                setHeadExcelInfo((prev) => ({
                  ...prev,
                  type: event === 'RETURN' ? 'Trả hàng' : event === 'RECIEVED' ? 'Bán hàng' : null,
                }));
                setFilterTypeName(event === 'RETURN' ? 'Trả hàng' : event === 'RECIEVED' ? 'Bán hàng' : null);
              }}
              defaultValue={
                filterType && filterType !== 'null' && filterType !== 'undefined'
                  ? { value: filterType, label: filterTypeName }
                  : null
              }
            >
              <Option value="RECIEVED">Bán hàng</Option>
              <Option value="RETURN">Trả hàng</Option>
            </Select>
          </div>
        </div>
      </Fragment>
    ),
    summary: (data) => {
      if (data && data.length === 0) return null;
      return (
        <>
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={5} align="right">
              <span className="font-bold text-base">Tổng cộng</span>
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base">
              {total?.sumSubTotal && formatCurrency(total?.sumSubTotal, ' ')}
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base">
              {total?.sumTotal && formatCurrency(total?.sumTotal, ' ')}
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base">
              {total?.sumVoucherAmount && formatCurrency(total?.sumVoucherAmount, ' ')}
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base">
              {total?.sumMoney && formatCurrency(total?.sumMoney, ' ')}
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base" />
          </Table.Summary.Row>
        </>
      );
    },
  });

  return (
    <Fragment>
      <div className="revenueByOrder">
        {DataRevenueByOrder()}
        <div className="flex sm:justify-end justify-center items-center mt-4">
          <button
            disabled={dataExcel?.length === 0}
            type="submit"
            className="bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center w-[171px] h-11 justify-center disabled:opacity-60 disabled:pointer-events-none"
            onClick={() => handelTesst(dataExcel)}
          >
            Xuất báo cáo
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default OrderRevenue;
