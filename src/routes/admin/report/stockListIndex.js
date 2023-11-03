import React, { useState, Fragment, useEffect, useCallback, useRef, useReducer } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useAuth } from 'global';
import { HookDataTable } from 'hooks';
import './index.less';
import { ColumnListOfStocks } from 'columns/report';
import { DatePicker, Select, Space } from 'antd';
import moment from 'moment';
import { ExportCSV } from './exportDataToExcel/exportExcelLogic';
import { StoreService } from 'services/store';
import { GoodTransferService } from 'services/GoodTransfer';
import { ReportService } from 'services/report';
import { formatCurrency, routerLinks, formatDateString, reFormatDateString } from 'utils';

let date = new Date();
let firstDay = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
let initDate = {
  dateFrom: formatDateString(getFormattedDate(firstDay)) + ' 00:00:00',
  dateTo: formatDateString(getFormattedDate(date)) + ' 23:59:59',
};
const { Option } = Select;
const formatDate = (dateString) => {
  if (dateString)
    return (dateString = dateString.substr(6, 4) + '/' + dateString.substr(3, 2) + '/' + dateString.substr(0, 2));
  return dateString;
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FROM':
      return { ...state, dateFrom: action.dateFrom ? formatDate(action.dateFrom) + ' 00:00:00' : action.dateFrom };
    case 'TO':
      return { ...state, dateTo: action.dateTo ? formatDate(action.dateTo) + ' 23:59:59' : action.dateTo };
    default:
      return state;
  }
};

function getFormattedDate(date) {
  const year = date.getFullYear();

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return day + '/' + month + '/' + year;
}

const Page = () => {
  const mount = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const filterTypeURL = urlSearch.get('type');
  const filterStatusURL = urlSearch.get('status');
  const filterStoreURL = urlSearch.get('idStore');
  const filterSupplierURL = urlSearch.get('idSupplier');
  const fullTextSearchURL = urlSearch.get('fullTextSearch') !== null ? urlSearch.get('fullTextSearch') : '';
  const [supplierList, setSupplierList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [idSupplierChoosed, setIdSupplierChoosed] = useState(filterSupplierURL ?? filterSupplierURL);
  const [idItemChoosed, setIdItemChoosed] = useState(filterTypeURL ?? filterTypeURL);
  const [idStoreChoosed, setIdStoreChoosed] = useState(filterStoreURL ?? filterStoreURL);
  const [idStatusChoosed, setIdStatusChoosed] = useState(filterStatusURL ?? filterStatusURL);
  const [idSupplierChoosedName, setIdSupplierChoosedName] = useState();
  const [idItemChoosedName, ] = useState();
  const [idStoreChoosedName, setIdStoreChoosedName] = useState();
  const [idStatusChoosedName, ] = useState();
  const fileName = `Danh sách phiếu kho cửa hàng ` + user?.userInfor?.subOrgName;
  const [filterDate, dispatch] = useReducer(reducer, initDate);
  const [queryParams, setQueryParams] = useState({});

  const [headExcelInfo, setHeadExcelInfo] = useState({
    type: '',
    idStore: null,
    idSupplier: null,
    status: '',
    supplierName: '',
    storeName: '',
    fullTextSearch: null,
    filterDate: {
      dateFrom: formatDateString(getFormattedDate(firstDay)) + ' 00:00:00',
      dateTo: moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59',
    },
  });

  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const statusListENUM = [
    { value: 'COMPLETED', label: 'Đã hoàn thành' },
    { value: 'INPROCESS', label: 'Đang xử lý' },
  ];
  const itemList = [
    { value: 'RECIEVED', label: 'Nhập hàng' },
    { value: 'RETURN', label: 'Trả hàng' },
    { value: 'DISPOSAL', label: 'Hủy hàng' },
    { value: 'TRANSFER_SEND', label: 'Chuyển hàng' },
  ];
  const [dataTableExportExcel, setDataTableExportExcel] = useState([]);

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

  const storeId = user?.userInfor?.subOrgId;

  const fetchListBranch = async () => {
    try {
      return await GoodTransferService.getListBranch({
        ...params,
        storeId,
        supplierType: 'BALANCE',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchListSupplier = async () => {
    try {
      return await StoreService.getListSupplierForFilterProd(
        {
          storeId,
          type: 'ALL',
        },
        'store/all-supplier-store',
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let flag = true;
    const fetchAllData = async () => {
      const [storeList, supplierList] = await Promise.all([fetchListBranch(), fetchListSupplier()]);
      if (flag) {
        setStoreList(storeList?.data);
        if (idStoreChoosed !== 'null' && idStoreChoosed) {
          const value = storeList.data.find((item) => item.id === idStoreChoosed).name;
          setIdStoreChoosedName(value);
        }
        setSupplierList(supplierList);
        if (idSupplierChoosed !== 'null' && idSupplierChoosed) {
          const valueSupplier = supplierList.find((item) => item.id === idSupplierChoosed).name;
          setIdSupplierChoosedName(valueSupplier);
        }
      }
    };
    fetchAllData();
    return () => {
      flag = false;
    };
  }, []);

  const queryParamsString = Object.keys(queryParams)
    .filter((key) => queryParams[key] !== null && queryParams[key] !== undefined)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&');

  useEffect(() => {
    handleChange();
    navigate(`${routerLinks('ListOfStock')}?${queryParamsString}`);
  }, [fullTextSearchURL, idStoreChoosed, idSupplierChoosed, idItemChoosed, idStatusChoosed, filterDate]);

  const [handleChange, DataTable, params] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => {
        if (data.orderId) {
          switch (data.orderType) {
            case 'ORDER':
              navigate(
                routerLinks('OrderDetail') + `?id=${data.orderId}` + `&tabKey=${data?.status === 'INPROCESS' ? 3 : 4}`,
              );
              break;
            case 'PROMOTION':
              navigate(routerLinks('PromotionalGoodsDetail') + `?id=${data.orderId}` + `&type=${1}`);
              break;
            case 'ORDER_NON_BALANCE':
              navigate(routerLinks('ImportGoodsNonBalDetail') + `?id=${data.orderId}` + `&type=${1}`);
              break;
            default:
              break;
          }
        } else {
          switch (data.inventoryOrderType) {
            case 'RETURN':
              navigate(routerLinks('GoodReturnDetail') + `?id=${data.inventoryOrderId}` + `&type=${1}`, {
                state: { billCode: data?.billNumber },
              });
              break;
            case 'DISPOSAL':
              navigate(routerLinks('DisposalGoodsDetail') + `?id=${data.inventoryOrderId}` + `&type=${1}`);
              break;
            case 'TRANSFER_SEND':
              navigate(
                routerLinks('GoodTransferDetail') + `?id=${data.inventoryOrderId}&type=transfer` + `&typeStock=${1}`,
              );
              break;

            case 'TRANSFER_RECIEVED':
              navigate(
                routerLinks('GoodReceiveDetail') + `?id=${data.inventoryOrderId}&type=receive` + `&typeStock=${1}`,
              );
              break;
            default:
              break;
          }
        }
      },
    }),
    searchPlaceholder: 'Tìm kiếm theo mã phiếu',
    isLoading,
    setIsLoading,
    Get: async (params) => {
      setQueryParams({
        type: idItemChoosed,
        idStore: idStoreChoosed,
        idSupplier: idSupplierChoosed,
        status: idStatusChoosed,
        fullTextSearch: params?.fullTextSearch
      });
      const data = await ReportService.getInventoryItemList({
        ...params,
        type: idItemChoosed,
        idStore: idStoreChoosed,
        idSupplier: idSupplierChoosed,
        status: idStatusChoosed,
        filterDate,
      });
      setHeadExcelInfo((prev) => ({
        ...prev,
        filterDate,
        type: idItemChoosed,
        idStore: idStoreChoosed,
        idSupplier: idSupplierChoosed,
        status:
          idStatusChoosed === 'COMPLETED' ? 'Đã hoàn thành' : idStatusChoosed === 'INPROCESS' ? 'Đang xử lý' : null,
        fullTextSearch: params.fullTextSearch,
      }));

      const dataForExcel = await ReportService.getInventoryItemList({
        ...params,
        page: 0,
        perPage: 0,
        type: idItemChoosed,
        idStore: idStoreChoosed,
        idSupplier: idSupplierChoosed,
        status: idStatusChoosed,
        filterDate,
      });
      const convertData = dataForExcel?.data.map((item) => ({
        'Mã phiếu': item.billNumber,
        'Loại phiếu':
          item.billType === 'RECIEVED'
            ? 'Nhập hàng'
            : item.billType === 'RETURN'
            ? 'Trả hàng'
            : item.billType === 'DISPOSAL'
            ? 'Hủy hàng'
            : item.billType === 'TRANSFER_SEND'
            ? 'Chuyển Hàng(Xuất)'
            : item.billType === 'TRANSFER_RECIEVED'
            ? 'Chuyển Hàng(Nhập)'
            : '',
        'Ngày tạo': item.createdAt,
        'Tên nhà cung cấp': item.supplierName,
        'PO/RN': item.referenceCode,
        'CH Nhập/Xuất': item?.referenceStoreName,
        'Tổng tiền (VND)': item.totalAmount && formatCurrency(item.totalAmount, ' '),
        'Trạng thái': item.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Đang xử lý',
        'Người tạo': item.createdBy,
      }));
      setDataTableExportExcel(convertData);
      return data;
    },
    save: true,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} phiếu kho`,
    columns: ColumnListOfStocks({}),
    rightHeader: (
      <div className="hidden lg:block mt-3">
        <div className="flex flex-col lg:flex-row items-center gap-3 mb-3">
          <Select
            showSearch
            allowClear
            placeholder="Chọn loại phiếu"
            optionFilterProp="children"
            className="w-full lg:w-[221px] text-left"
            onChange={(value) => {
              setIdItemChoosed(value);
              setQueryParams({
                ...queryParams,
                type: value,
              });
            }}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={itemList}
            defaultValue={
              idItemChoosed && idItemChoosed !== 'null' && idItemChoosed !== 'undefined'
                ? { value: idItemChoosed, label: idItemChoosedName }
                : null
            }
          >
          </Select>
          <Select
            showSearch
            allowClear
            placeholder="Chọn cửa hàng"
            optionFilterProp="children"
            className="w-full lg:w-[221px] text-left"
            onChange={(value, option) => {
              setQueryParams({
                ...queryParams,
                idStore: value,
              });
              setIdStoreChoosed(value);
              setHeadExcelInfo((prev) => ({ ...prev, storeName: option?.label }));
            }}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={storeList.map((i) => ({ value: i.id, label: i.name }))}
            defaultValue={
              idStoreChoosed && idStoreChoosed !== 'null' && idStoreChoosed !== 'undefined'
                ? { value: idStoreChoosed, label: idStoreChoosedName }
                : null
            }
         >
            {storeList.map((item, index) => {
              return (
                <Option key={index} value={item?.id} title={item?.name}>
                  {item?.name}
                </Option>
              );
            })}
          </Select>
          <Select
            showSearch
            allowClear
            placeholder="Chọn nhà cung cấp"
            optionFilterProp="children"
            className="w-full lg:w-[221px] text-left"
            onChange={(value, option) => {
              setQueryParams({
                ...queryParams,
                idSupplier: value,
              });
              setIdSupplierChoosed(value);
              setHeadExcelInfo((prev) => ({ ...prev, supplierName: option?.label }));
            }}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={supplierList.map((i) => ({ value: i.id, label: i.name }))}
            defaultValue={
              idSupplierChoosed && idSupplierChoosed !== 'null' && idSupplierChoosed !== 'undefined'
                ? { value: idSupplierChoosed, label: idSupplierChoosedName }
                : null
            }
          >
            {supplierList.map((item, index) => {
              return (
                <Option key={index} value={item?.id} title={item?.name}>
                  {item?.name}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>
    ),
    subHeader: (data) => (
      <>
        <div className="flex flex-col md:flex-row items-center gap-3 lg:my-0 my-3">
          <Select
            showSearch
            allowClear
            placeholder="Chọn loại phiếu"
            optionFilterProp="children"
            className="w-full lg:w-[221px] text-left lg:hidden block"
            onChange={(value) => {
              setIdItemChoosed(value);
              setQueryParams({
                ...queryParams,
                type: value,
              });
            }}
            defaultValue={
              idItemChoosed && idItemChoosed !== 'null' && idItemChoosed !== 'undefined'
                ? { value: idItemChoosed, label: idItemChoosedName }
                : null
            }
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={itemList}
          ></Select>
          <Select
            showSearch
            allowClear
            placeholder="Chọn cửa hàng"
            optionFilterProp="children"
            className="w-full lg:w-[221px] text-left lg:hidden block"
            onChange={(value, option) => {
              setQueryParams({
                ...queryParams,
                idStore: value,
              });
              setIdStoreChoosed(value);
              setHeadExcelInfo((prev) => ({ ...prev, storeName: option?.label }));
            }}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={storeList.map((i) => ({ value: i.id, label: i.name }))}
            defaultValue={
              idStoreChoosed && idStoreChoosed !== 'null' && idStoreChoosed !== 'undefined'
                ? { value: idStoreChoosed, label: idStoreChoosedName }
                : null
            }
          >
            {storeList.map((item, index) => {
              return (
                <Option key={index} value={item?.id} title={item?.name}>
                  {item?.name}
                </Option>
              );
            })}
          </Select>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3 lg:my-0 my-3">
          <Select
            showSearch
            allowClear
            placeholder="Chọn nhà cung cấp"
            optionFilterProp="children"
            className="w-full lg:w-[221px] text-left lg:hidden block"
            onChange={(value, option) => {
              setQueryParams({
                ...queryParams,
                idSupplier: value,
              });
              setIdSupplierChoosed(value);
              setHeadExcelInfo((prev) => ({ ...prev, supplierName: option?.label }));
            }}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={supplierList.map((i) => ({ value: i.id, label: i.name }))}
            defaultValue={
              idSupplierChoosed && idSupplierChoosed !== 'null' && idSupplierChoosed !== 'undefined'
                ? { value: idSupplierChoosed, label: idSupplierChoosedName }
                : null
            }
          >
            {supplierList.map((item, index) => {
              return (
                <Option key={index} value={item?.id} title={item?.name}>
                  {item?.name}
                </Option>
              );
            })}
          </Select>
          <Select
            showSearch
            allowClear
            placeholder="Chọn trạng thái"
            optionFilterProp="children"
            className="w-full lg:w-[221px] text-left lg:hidden block"
            onChange={(value) => {
              setQueryParams({
                ...queryParams,
                status: value,
              });
              setIdStatusChoosed(value);
            }}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={statusListENUM}
            defaultValue={
              idStatusChoosed && idStatusChoosed !== 'null' && idStatusChoosed !== 'undefined'
                ? { value: idStatusChoosed, label: idStatusChoosedName }
                : null
            }
          />
        </div>
        <div>
          <div className="sm:relative mb-2 sm:mt-0 mt-3 flex items-start lg:items-center justify-start 2xl:justify-end flex-col lg:flex-row gap-3">
            <Select
              showSearch
              allowClear
              placeholder="Chọn trạng thái"
              optionFilterProp="children"
              className="w-full sm:w-[221px] text-left hidden lg:block"
              onChange={(value) => {
                setIdStatusChoosed(value);
                setQueryParams({
                  ...queryParams,
                  status: value,
                });
              }}
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={statusListENUM}
              defaultValue={
                idStatusChoosed && idStatusChoosed !== 'null' && idStatusChoosed !== 'undefined'
                  ? { value: idStatusChoosed, label: idStatusChoosedName }
                  : null
              }
            />

            <div className="sm:flex gap-3 items-center justify-between">
              <Space direction="vertical" className="flex items-center gap-2 w-full lg:w-[221px] justify-between">
                <p className="text-[14px] text-left sm:w-auto sm:mr-0 mr-4">Từ</p>{' '}
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
                className="flex items-center gap-2 sm:mt-0 mt-2 w-full lg:w-[221px] justify-between"
              >
                <p className="text-[14px] text-left sm:w-auto">Đến</p>{' '}
                <DatePicker
                  onChange={onChangeDateTo}
                  format="DD/MM/YYYY"
                  defaultValue={moment(getFormattedDate(date), 'DD/MM/YYYY')}
                  disabledDate={(current) => {
                    return current && current.valueOf() > Date.now();
                  }}
                  className={'sm:ml-0 flex-1'}
                  size={'middle'}
                />
              </Space>
            </div>
          </div>
          {showValidateFilter && (
            <div className="text-red-500 my-2 sm:mb-0 mb-4 lg:text-right">Ngày kết thúc phải lớn hơn ngày bắt đầu</div>
          )}
        </div>
      </>
    ),
    className: 'data-table list-of-stocks',
  });

  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="text-2xl font-bold text-teal-900 mb-8">Danh sách phiếu kho</p>
        <div className="bg-white pt-6 pb-10 px-6 rounded-md data-stock">{DataTable()}</div>
        <div className="flex justify-end items-center mt-4">
          <ExportCSV csvData={dataTableExportExcel} fileName={fileName} headExcelInfo={headExcelInfo} supplierList={supplierList} storeList={storeList} fullTextSearchURL={fullTextSearchURL} />
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
