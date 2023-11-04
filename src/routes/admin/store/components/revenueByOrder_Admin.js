import React, { useState, Fragment, useEffect, useReducer } from 'react';
import { ColumnStoreRevenueByOrderTable } from 'columns/store';
import { StoreService } from 'services/store';
import '../index.less';
import { HookDataTable, HookModal } from 'hooks';
import { DatePicker, Space, Table, Select } from 'antd';
// import { useAuth } from 'global';
import { formatCurrency, getFormattedDate, formatDateString, reFormatDateString } from 'utils';
import moment from 'moment';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

const { Option } = Select;
const date = new Date();
const firstDay = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
const initDate = {
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

const RevenueByOrderAdmin = (ObjectStore) => {
  // const { user } = useAuth();
  const subOrgId = ObjectStore?.idStore;

  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState();
  const [total, setTotal] = useState({});
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const [dataExcel, setDataExcel] = useState([]);
  const [filterDate, dispatch] = useReducer(reducer, initDate);

  const [paramSExcel, setParamSExcel] = useState({
    page: 0,
    perPage: 0,
    fullTextSearch: '',
    status: filterStatus,
    filterDate,
  });

  const [headExcelInfo, setHeadExcelInfo] = useState({
    fullTextSearch: '',
    dateFrom: moment(firstDay).format('YYYY-MM-DD') + ' 00:00:00',
    dateTo: moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59',
    type: '',
  });

  const onChangeDateFrom = (_, dateString) => {
    if (new Date(reFormatDateString(dateString)) > new Date(filterDate.dateTo)) {
      setShowValidateFilter(true);
      dispatch({ type: 'FROM', dateFrom: dateString });
      return;
    }
    setShowValidateFilter(false);
    dispatch({ type: 'FROM', dateFrom: dateString });
  };

  const onChangeDateTo = (_, dateString) => {
    if (new Date(filterDate.dateFrom) > new Date(reFormatDateString(dateString))) {
      setShowValidateFilter(true);
      dispatch({ type: 'TO', dateTo: dateString });
      return;
    }
    setShowValidateFilter(false);
    dispatch({ type: 'TO', dateTo: dateString });
  };

  useEffect(() => {
    handleChangeDataRebvenueByOrder();
  }, [filterDate, filterStatus]);

  const formatCur = (value) => {
    if (!value) return 0;
    return value || value === 0 ? value : null;
  };

  const handelTesst = async () => {
    const res = await StoreService.getListRevenueByOrderAdmin({
      ...paramSExcel,
      isExport: true,
    });
    setTotal(res?.total);
    const data = res.data?.map((i) => ({
      index: i.index,
      invoiceCode: i.invoiceCode,
      completedDate: i.completedDate,
      revenue: formatCurrency(formatCur(i.revenue), ''),
      discount: formatCurrency(formatCur(i.discount), ''),
      total: formatCurrency(formatCur(i.total), ''),
      type:
        i.type === 'REFUND' ? ' Trả hàng' : i.type === 'DELEVERED' ? 'Bán hàng' : i.type === 'CANCEL' ? 'Đã hủy' : null,
    }));
    const sum = res.data
      ?.map((i) => ({
        index: i.index,
        invoiceCode: i.invoiceCode,
        completedDate: i.completedDate,
        revenue: +i.revenue,
        discount: +i.discount,
        total: +i.total,
        type:
          i.type === 'REFUND' ? ' Trả hàng' : i.type === 'DELEVERED' ? 'Bán hàng' : i.type === 'CANCEL' ? 'Đã hủy' : null,
      }))
      ?.reduce((acc, obj) => {
        console.log(Object);
        Object.keys(obj).forEach((key) => {
          acc[key] = (acc[key] || 0) + +obj[key];
        });
        return acc;
      }, {});
    sum.index = '';
    sum.invoiceCode = '';
    sum.completedDate = 'Tổng cộng';
    sum.revenue = total.totalRevenue ? formatCurrency(total.totalRevenue, ' ') : 0;
    sum.discount = total.totalDiscount ? formatCurrency(total.totalDiscount, ' ') : 0;
    sum.total = total.total ? formatCurrency(total.total, ' ') : 0;
    sum.type = '';

    data.push(sum);

    const Heading = [
      ['STT', 'Mã đơn hàng', 'Ngày bán', 'Giá trị (VNĐ)', 'Khuyến mãi (VND)', 'Thành tiền (VND)', 'Loại đơn'],
    ];

    const wb = XLSX.utils.book_new();
    // const ws = XLSX.utils.aoa_to_sheet(Heading);
    const ws = XLSX.utils.sheet_add_aoa(wb, Heading, {
      origin: 'A7',
    });
    XLSX.utils.sheet_add_aoa(ws, [['BÁO CÁO DOANH THU CỬA HÀNG THEO ĐƠN HÀNG']], { origin: 'B1' });

    // Create a new workbook and worksheet
    // const ws = XLSX.utils.aoa_to_sheet(Heading);

    // Thông tin file Excel (filters, tên cửa hàng, nhà cc...)
    XLSX.utils.sheet_add_aoa(ws, [['Tìm kiếm:', headExcelInfo.fullTextSearch]], { origin: 'A3' });
    XLSX.utils.sheet_add_aoa(ws, [['Chọn loại đơn hàng', headExcelInfo.type]], { origin: 'D3' });
    XLSX.utils.sheet_add_aoa(
      ws,
      [['Từ ngày', headExcelInfo.dateFrom && moment(headExcelInfo.dateFrom).format('DD/MM/YYYY')]],
      {
        origin: 'A5',
      },
    );
    XLSX.utils.sheet_add_aoa(
      ws,
      [['Đến ngày', headExcelInfo.dateTo && moment(headExcelInfo.dateTo).format('DD/MM/YYYY')]],
      { origin: 'D5' },
    );

    XLSX.utils.sheet_add_json(wb, data, { origin: 'A8', skipHeader: true, skipcolumn: 1 });

    // Add the worksheet to the workbook and save the file
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Doanh thu cửa hàng theo đơn hàng.xlsx`);
  };

  const [handleChangeDataRebvenueByOrder, DataRevenueByProduct] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: async () => await handleDetail(data),
    }),
    isLoading,
    setIsLoading,
    searchPlaceholder: 'Tìm kiếm theo mã đơn hàng',
    save: false,
    Get: async (params) => {
      const res = await StoreService.getListRevenueByOrderAdmin({
        ...params,
        idStore: subOrgId,
        status: filterStatus,
        filter: filterDate,
      });
      setHeadExcelInfo((prev) => ({
        ...prev,
        fullTextSearch: params?.fullTextSearch,
        dateFrom: filterDate?.dateFrom,
        dateTo: filterDate?.dateTo,
      }));
      setParamSExcel((prev) => ({
        ...prev,
        page: 1,
        perPage: params?.page * params?.perPage,
        fullTextSearch: params?.fullTextSearch,
        idStore: subOrgId,
        type: filterStatus,
        filter: filterDate,
      }));
      setTotal(res?.total);
      setDataExcel(res?.data);
      return res;
    },
    // Get: async (params) => {
    //   return filterDate === '' ? StoreService.getListRevenueByOrder({ ...params, idStore: subOrgId }) : StoreService.getListRevenueByOrder({ ...params, idStore: subOrgId, filter: { date: filterDate } });
    // },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`,
    columns: ColumnStoreRevenueByOrderTable(),
    rightHeader: (
      <Fragment>
        <div className="flex 2xl:items-center xl:items-end items-start 2xl:flex-row flex-col 2xl:gap-3">
          <div className="flex 2xl:my-0 sm:flex-row flex-col 2xl:mb-0 sm:mb-4 xl:mt-0 lg:mt-4 mt-0 w-full xl:justify-end justify-start 2xl:mr-0 mr-2">
            <div className="flex flex-col">
              <Select
               allowClear
                className="sm:w-[190px] w-full rounded-[10px] sm:mb-0 mb-2"
                placeholder="Chọn loại đơn hàng"
                optionFilterProp="children"
                value={filterStatus}
                filterOption={(input, option) => {
                  return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                onChange={(event) => {
                  setFilterStatus(event);
                  setHeadExcelInfo((prev) => ({
                    ...prev,
                    type:
                      event === 'REFUND'
                        ? 'Trả hàng'
                        : event === 'DELEVERED'
                        ? 'Bán hàng'
                        : event === 'CANCEL'
                        ? 'Đã hủy'
                        : null,
                  }));
                }}
              >
                <Option value="DELEVERED">Bán hàng</Option>
                <Option value="REFUND">Trả hàng</Option>
                <Option value="CANCEL">Đã hủy</Option>
              </Select>
            </div>
          </div>
          <div className="sm:relative sm:mt-0 mt-4">
            <div className="sm:flex gap-4 items-end justify-end">
              <Space direction="vertical" className="flex items-center gap-2 lg:w-[240px]">
                <p className="text-[12px] text-left w-auto lg:w-[56px] sm:mr-0 mr-4">Từ ngày</p>{' '}
                <DatePicker
                  onChange={onChangeDateFrom}
                  format="DD/MM/YYYY"
                  defaultValue={dayjs(getFormattedDate(firstDay), 'DD/MM/YYYY')}
                  disabledDate={(current) => {
                    return current && current.valueOf() > Date.now();
                  }}
                  size={'middle'}
                />
              </Space>
              <Space direction="vertical" className="flex items-center gap-2 sm:mt-0 mt-2 lg:w-[240px] datepicker-to">
                <p className="text-[12px] text-left w-auto lg:w-[56px] sm:mr-0 mr-1">Đến ngày</p>{' '}
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
      </Fragment>
    ),
    summary: (data) => {
      if (data && data.length === 0) return null;
      return (
        <>
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={3} align="right">
              <span className="font-bold text-base">Tổng cộng</span>
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base">
              {total?.totalRevenue ? formatCurrency(total?.totalRevenue, '') : 0}
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base">
              {total?.totalDiscount ? formatCurrency(total?.totalDiscount, '') : 0}
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base">
              {total?.total ? formatCurrency(total?.total, '') : 0}
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base" />
          </Table.Summary.Row>
        </>
      );
    },
  });
  const [handleDetail, ModalHandleDetail] = HookModal({
    className: 'productStoreDetail',
    title: (data) => (
      <>
        <p className="text-xl text-teal-900 font-semibold">Thông tin chi tiết đơn hàng</p>
      </>
    ),
    wrapClassName: 'customDetail',
    GetById: async (id) => {
      return StoreService.getDetailRevenueByOrder(id);
    },
    isLoading,
    setIsLoading,
    widthModal: 830,
    idElement: 'productStoreDetail',
    textCancel: 'Trở về',
    onOk: async (data) => {},
    footerCustom: (handleOk, handleCancel) => (
      <div className="flex justify-start items-center buttonGroup mb-[33px] ml-[9px]">
        <button
          type={'button'}
          className="px-2 bg-white-500 border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-xl text-teal-900 hover:text-teal-600 mt-1 w-[120px]"
          onClick={handleCancel}
        >
          {'Trở về'}
        </button>
      </div>
    ),
  });

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 70,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Mặt hàng',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Đơn giá (VND)',
      dataIndex: 'price',
      key: 'price',
      render: (value) => formatCurrency(value, ' '),
    },
    {
      title: 'Thành tiền (VND)',
      dataIndex: 'totalItem',
      key: 'totalItem',
      render: (value) => formatCurrency(value, ' '),
    },
  ];

  return (
    <Fragment>
      <div className="min-h-screen store-wrapper">
        <div className="bg-white w-full px-4 pb-6 rounded-[10px] relative revenueByOrder">
          {DataRevenueByProduct()}
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
          {ModalHandleDetail((_data) => {
            return (
              <>
                <p className="text-xl text-teal-900 font-bold text-[18px] mb-4">Thông tin đơn hàng</p>
                <div className="sm:flex items-center">
                  <div className="w-full flex flex-row mb-5 items-center">
                    <div className="font-bold sm:order mr-2 text-base text-teal-900 sm:w-[180px]">Mã đơn hàng:</div>
                    <div className="text-[16px] text-gray-600 font-normal">{_data?.invoiceCode}</div>
                  </div>
                  <div className="w-full flex flex-row mb-5 items-center">
                    <div className="font-bold text-base text-teal-900 w-[100px]">Ngày bán:</div>
                    <div className="text-[16px] text-gray-600 font-normal">{_data?.completedDate}</div>
                  </div>
                </div>
                <div className="w-full flex mb-5 items-center">
                  <div className="font-bold order mr-2 text-base text-teal-900 sm:w-[180px]">
                    Tổng giá trị đơn hàng:{' '}
                  </div>
                  <div className="text-[16px] text-gray-600 font-normal">
                    {formatCurrency(_data?.totalPayment, ' VND')}
                  </div>
                </div>
                <div className="font-bold order mr-2 text-base text-teal-900">Chi tiết đơn hàng: </div>
                <Table
                  className={`order-detail ${_data?.detailInvoice?.length < 5 ? 'hiddenScroll' : null}`}
                  columns={columns}
                  dataSource={_data?.detailInvoice}
                  pagination={false}
                  scroll={{ y: 200 }}
                />
              </>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
};
export default RevenueByOrderAdmin;
