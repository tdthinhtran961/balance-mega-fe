import React, { useState, Fragment, useEffect, useReducer } from 'react';
import { ColumnDiscountTableAdmin } from 'columns/supplier';
import { useAuth } from 'global';
import { HookDataTable } from 'hooks';
import moment from 'moment';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { SupplierService } from 'services/supplier';
import { formatCurrency, routerLinks, reFormatDateString, formatDateString, getFormattedDate } from 'utils';
import classNames from 'classnames';
import { DatePicker, Select, Space, Form, Table } from 'antd';
import * as XLSX from 'xlsx';

let date = new Date();
const { Option } = Select;

let firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
const day = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const endDay = new Date(date.getFullYear(), date.getMonth(), day);
let initDate = {
  dateFrom: formatDateString(getFormattedDate(firstDay)) + ' 00:00:00',
  dateTo: formatDateString(getFormattedDate(endDay)) + ' 23:59:59',
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

const Discount = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const idSupplier = urlSearch.get('id');
  const { user } = useAuth();
  const subOrgId = user?.userInfor?.subOrgId;
  const filterStatusURL = urlSearch.get('status');
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const [filterDate, dispatch] = useReducer(reducer, initDate);
  const [dataExcel, setDataExcel] = useState([]);
  const [totalCommissionSupplier, setTotalCommissionSupplier] = useState();
  const [total, setTotal] = useState({});
  const [filterStatus, setFilterStatus] = useState(filterStatusURL ?? filterStatusURL);
  const [filterStatusName, setFilterStatusName] = useState();
  const [queryParams, setQueryParams] = useState({});
  const [paramSExcel, setParamSExcel] = useState({
    page: 0,
    perPage: 0,
    type: filterStatus,
    filter: filterDate,
  });

  const [headExcelInfo, setHeadExcelInfo] = useState({
    dateFrom: moment(new Date()).format('YYYY-MM'),
    dateTo: moment(new Date()).format('YYYY-MM'),
    status: '',
  });

  const onChangeDateFrom = (_, dateString) => {
    const month = dateString && dateString.slice(0, 2);
    const year = dateString && dateString.slice(3);
    dateString = dateString ? `01/${month}/${year}` : '';

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
    const month = dateString && dateString.slice(0, 2);
    const year = dateString && dateString.slice(3);
    const day = dateString && new Date(year, month, 0).getDate();
    dateString = dateString ? `${day}/${month}/${year}` : '';
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

  useEffect(async () => {
    setHeadExcelInfo((prev) => ({
      ...prev,
      supplierName: idSupplier || subOrgId,
    }));
  }, []);

  const formatCur = (value) => {
    if (!value) return 0;
    return value || value === 0 ? value : null;
  };

  const handelTesst = async () => {
    const status =
    filterStatus === 'PAID'
      ? 'Đã thanh toán'
      : filterStatus === 'NOT_PAID'
      ? 'Chưa thanh toán'
      : filterStatus === 'NOT_COMPLETED_PAID'
      ? 'Chưa hoàn tất'
      : null;
    const res = paramSExcel?.idSupplier
      ? await SupplierService.getDiscountSupplierAdmin(paramSExcel?.idSupplier, {
          ...paramSExcel,
          isExport: true,
          status: filterStatus,
          filter: filterDate,
        })
      : [];
    setTotal(res.total);
    setTotalCommissionSupplier(res?.totalCommissionSupplier);
    const data = res.data?.map((i) => ({
      index: i.index,
      timeRange: i.timeRange,
      discountPrice: formatCurrency(formatCur(i.discountPrice), ''),
      payedTotal: formatCurrency(formatCur(i.payedTotal), ''),
      unpaidTotal: formatCur(i.unpaidTotal) === null ? 0 : formatCurrency(formatCur(i.unpaidTotal), ''),
      status: i.status === 'PAID' ? 'Đã thanh toán' : i.status === 'NOT_PAID' ? 'Chưa thanh toán' : 'Chưa hoàn tất',
    }));
    const sum = res.data
      ?.map((i) => ({
        index: i.index,
        discountPrice: i.discountPrice,
        payedTotal: i.payedTotal,
        unpaidTotal: i.unpaidTotal === null ? 0 : +i.unpaidTotal,
        status: i.status === 'PAID' ? 'Đã thanh toán' : i.status === 'NOT_PAID' ? 'Chưa thanh toán' : 'Chưa hoàn tất',
      }))
      ?.reduce((acc, obj) => {
        Object.keys(obj).forEach((key) => {
          acc[key] = (acc[key] || 0) + +obj[key];
        });
        return acc;
      }, {});
    sum.index = '';
    sum.timeRange = 'Tổng cộng';
    sum.discountPrice = total?.sumDiscountPrice ? formatCurrency(total?.sumDiscountPrice, ' ') : 0;
    sum.payedTotal = total?.sumPayedTotal ? formatCurrency(total?.sumPayedTotal, ' ') : 0;
    sum.unpaidTotal = total?.sumUnpaidTotal ? formatCurrency(total?.sumUnpaidTotal, ' ') : 0;
    sum.status = '';

    data.push(sum);

    const Heading = [['STT', 'Thời gian', 'Chiết khấu', 'Đã thanh toán', 'Chưa thanh toán', 'Trạng thái']];

    const wb = XLSX.utils.book_new();
    // const ws = XLSX.utils.aoa_to_sheet(Heading);
    const ws = XLSX.utils.sheet_add_aoa(wb, Heading, {
      origin: 'A9',
    });
    XLSX.utils.sheet_add_aoa(ws, [['BÁO CÁO CHIẾT KHẤU NHÀ CUNG CẤP']], { origin: 'B1' });

    // Create a new workbook and worksheet
    // const ws = XLSX.utils.aoa_to_sheet(Heading);

    // Thông tin file Excel (filters, tên cửa hàng, nhà cc...)
    XLSX.utils.sheet_add_aoa(
      ws,
      [['Kỳ hạn từ', headExcelInfo.dateFrom && moment(headExcelInfo.dateFrom).format('MM/YYYY')]],
      {
        origin: 'A3',
      },
    );
    XLSX.utils.sheet_add_aoa(ws, [['đến', headExcelInfo.dateTo && moment(headExcelInfo.dateTo).format('MM/YYYY')]], {
      origin: 'D3',
    });
    XLSX.utils.sheet_add_aoa(ws, [['Chọn trạng thái', headExcelInfo.status || status]], { origin: 'A5' });
    XLSX.utils.sheet_add_aoa(ws, [['Chiết khấu cần thanh toán:', totalCommissionSupplier]], { origin: 'A7' });

    XLSX.utils.sheet_add_json(wb, data, { origin: 'A10', skipHeader: true, skipcolumn: 1 });

    // Add the worksheet to the workbook and save the file
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Chiết khấu nhà cung cấp.xlsx`);
  };
  const queryParamsString = Object.keys(queryParams)
    .filter((key) => queryParams[key] !== null && queryParams[key] !== undefined)
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&');
  useEffect(() => {
    handleTableDiscount();
    navigate(`${routerLinks('Discount')}?${queryParamsString}`);
  }, [filterDate, filterStatus]);

  const [handleTableDiscount, DataDiscount] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: () => {
        navigate(
          routerLinks('DiscountDetail') + `?id=${data.id}` + `&idSupplier=${idSupplier || subOrgId}` + 'management',
        );
      },
    }),
    loading,
    save: true,
    setLoading,
    showSearch: false,
    Get: async (params) => {
      setQueryParams({
        status: filterStatus,
      });
      const res =
        idSupplier || subOrgId
          ? await SupplierService.getDiscountSupplierAdmin(idSupplier || subOrgId, {
              ...params,
              status:
                filterStatus === 'undefined' || filterStatus === 'null' || filterStatus === null ? '' : filterStatus,
              filter: filterDate,
            })
          : [];
      setHeadExcelInfo((prev) => ({
        ...prev,
        dateFrom: filterDate?.dateFrom,
        dateTo: filterDate?.dateTo,
      }));
      setDataExcel(res?.data);
      setTotal(res?.total);
      setTotalCommissionSupplier(res?.totalCommissionSupplier);
      setParamSExcel((prev) => ({
        ...prev,
        page: 1,
        perPage: params?.page * params?.perPage,
        idSupplier: idSupplier || subOrgId,
        status: filterStatus,
        filter: filterDate,
      }));
      return res;
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} chiết khấu`,
    columns: ColumnDiscountTableAdmin({
      handleShow: async () => {
        handleTableDiscount();
      },
    }),

    summary: (data) => {
      if (data && data.length === 0) return null;
      return (
        <>
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={2} align="right">
              <span className="font-bold text-base">Tổng cộng</span>
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base">
              {total?.sumDiscountPrice ? formatCurrency(total?.sumDiscountPrice, ' ') : 0}
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base">
              {total?.sumPayedTotal ? formatCurrency(total?.sumPayedTotal, ' ') : 0}
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base">
              {total?.sumUnpaidTotal ? formatCurrency(total?.sumUnpaidTotal, ' ') : 0}
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base" />
          </Table.Summary.Row>
        </>
      );
    },
  });

  return (
    <Fragment>
      <Form form={form} validateTrigger="onChange">
        <div>
          <div className="flex items-baseline lg:flex-row flex-col lg:gap-3 justify-between">
            <div
              className={classNames('sm:relative lg:my-2 lg:my-0 mt-4', {
                '!mb-8': showValidateFilter,
              })}
            >
              <div className="sm:flex gap-3 items-end justify-end flex-col md:flex-row">
                <Space
                  direction="vertical"
                  className="flex items-center gap-2 lg:w-[245px] sm:justify-between justify-start"
                >
                  <p className="text-[12px] text-left lg:w-[68px] w-auto">Kỳ hạn từ</p>
                  {formatDateString(getFormattedDate(firstDay)) !== '1970/01/01' ? (
                    <DatePicker
                      onChange={onChangeDateFrom}
                      format="MM/YYYY"
                      picker="month"
                      defaultValue={moment(firstDay, 'MM/YYYY')}
                      disabledDate={(current) => {
                        return current && current.valueOf() > Date.now();
                      }}
                      size={'middle'}
                    />
                  ) : (
                    <DatePicker
                      onChange={onChangeDateFrom}
                      format="MM/YYYY"
                      picker="month"
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
                  <p className="text-[12px] text-left lg:text-center lg:w-[68px] w-auto sm:mr-0 mr-6">đến</p>{' '}
                  <DatePicker
                    onChange={onChangeDateTo}
                    format="MM/YYYY"
                    picker="month"
                    defaultValue={moment()}
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
                  Tháng kết thúc phải lớn hơn tháng bắt đầu
                </span>
              )}
            </div>
            <div className="flex 3xl:my-0 md:flex-row flex-col 3xl:mb-0 sm:mb-4 xl:mt-0 sm:mt-4 mt-2 w-full lg:justify-end">
              <Select
                className="sm:w-[195px] mr-0 rounded-[10px] md:mb-0 mb-2"
                placeholder="Chọn trạng thái"
                optionFilterProp="children"
                allowClear
                onChange={(event) => {
                  setQueryParams({
                    status: event,
                  });
                  setFilterStatus(event);
                  setHeadExcelInfo((prev) => ({
                    ...prev,
                    type:
                      event === 'PAID'
                        ? 'Đã thanh toán'
                        : event === 'NOT_PAID'
                        ? 'Chưa thanh toán'
                        : event === 'NOT_COMPLETED_PAID'
                        ? 'Chưa hoàn tất'
                        : null,
                  }));
                  setFilterStatusName(
                    event === 'PAID'
                      ? 'Đã thanh toán'
                      : event === 'NOT_PAID'
                      ? 'Chưa thanh toán'
                      : event === 'NOT_COMPLETED_PAID'
                      ? 'Chưa hoàn tất'
                      : null,
                  );
                }}
                defaultValue={
                  filterStatus && filterStatus !== 'null' && filterStatus !== 'undefined'
                    ? { value: filterStatus, label: filterStatusName }
                    : null
                }
              >
                <Option value="PAID">Đã thanh toán</Option>
                <Option value="NOT_PAID">Chưa thanh toán</Option>
                <Option value="NOT_COMPLETED_PAID">Chưa hoàn tất</Option>
              </Select>
            </div>
          </div>
          <div className="my-5">
            <div className="discount-section sm:w-[250px] w-full rounded-xl shadow-[0_0_9px_rgb(0,0,0,0.25)] pt-3 pb-5 px-5 text-center">
              <h1 className="font-bold mb-3">Chiết khấu cần thanh toán</h1>
              <span className="text-teal-900 text-xl font-bold">
                {formatCurrency(totalCommissionSupplier || 0, ' VND')}
              </span>
            </div>
          </div>
          {DataDiscount()}
        </div>
      </Form>
      <div className="flex sm:justify-end justify-center items-center mt-4">
        <button
          disabled={dataExcel?.length === 0}
          type="submit"
          className="bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center sm:w-[171px] w-[69%] h-11 justify-center disabled:opacity-60 disabled:pointer-events-none"
          onClick={() => handelTesst(dataExcel)}
        >
          Xuất báo cáo
        </button>
      </div>
    </Fragment>
  );
};

export default Discount;
