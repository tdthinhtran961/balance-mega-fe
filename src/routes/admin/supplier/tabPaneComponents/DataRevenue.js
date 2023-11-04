import { DatePicker, Space, Tabs } from 'antd';
import { ColumnRevenueReturnOrder, ColumnRevenueSupplier } from 'columns/supplier';
import { Spin } from 'components';
// import { Spin } from 'components';
import { useAuth } from 'global';
import { HookDataTable } from 'hooks';
import moment from 'moment';
import './index.less';
import React, { useEffect, useState, useReducer } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { SupplierService } from 'services/supplier';
import { formatCurrency, routerLinks } from 'utils';
import dayjs from 'dayjs';
const date = new Date();
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
const formatDate = (dateString) => {
  if (dateString)
    return (dateString = dateString.substr(6, 4) + '/' + dateString.substr(3, 2) + '/' + dateString.substr(0, 2));
  return dateString;
};
const initDate = {
  dateFrom: formatDate(getFormattedDate(firstDay)) + ' 00:00:00',
  dateTo: formatDate(getFormattedDate(date)) + ' 23:59:59',
};

const formatSubmit = (dateString) => {
  if (dateString) return dateString.replace(/\//g, '-');
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

const formatDate2 = (dateString) => {
  const parts = dateString.split('/');
  const date1 = parts[2] + '/' + parts[1] + '/' + parts[0];

  return date1;
};

function getFormattedDate(date) {
  const year = date.getFullYear();

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return day + '/' + month + '/' + year;
}

const DataRevenue = ({ id }) => {
  const [countRevenue, setCountRevenue] = useState({});
  const [filterDate, dispatch] = useReducer(reducer, initDate);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const location = useLocation();

  const urlSearch = new URLSearchParams(location.search);
  const idSupplier = urlSearch.get('id');
  const { user } = useAuth();
  const subOrgId = user?.userInfor?.subOrgId;
  const [detailRevenueKey, setDetailRevenueKey] = useState(1);

  const onChangeDetailKey = (key) => {
    setDetailRevenueKey(key);
  };

  useEffect(() => {
    switch (+detailRevenueKey) {
      case 1:
        handleTableRevenueChange();
        break;
      case 2:
        handleTableRevenueReturnOrder();
        break;
      default:
        break;
    }
  }, [detailRevenueKey]);

  useEffect(() => {
    const submitFormatDate = {
      dateFrom: formatSubmit(filterDate.dateFrom),
      dateTo: formatSubmit(filterDate.dateTo),
    };
    const fetchRevenue = async () => {
      try {
        const res = await SupplierService.countRevenue(id, { filter: submitFormatDate });
        setCountRevenue(res.data);
      } catch (error) {
        return false;
      }
    };
    fetchRevenue();
    handleTableRevenueChange({ ...params, filter: submitFormatDate });
    handleTableRevenueReturnOrder({ ...params, filter: submitFormatDate });
  }, [filterDate]);

  const onChangeDateFrom = (date, dateString) => {
    if (new Date(formatDate2(dateString)) > new Date(filterDate.dateTo)) {
      setShowValidateFilter(true);
      dispatch({ type: 'FROM', dateFrom: dateString });
      return;
    }
    setShowValidateFilter(false);
    dispatch({ type: 'FROM', dateFrom: dateString });
  };
  const onChangeDateTo = (date, dateString) => {
    if (new Date(filterDate.dateFrom) > new Date(formatDate2(dateString))) {
      setShowValidateFilter(true);
      dispatch({ type: 'TO', dateTo: dateString });
      return;
    }
    setShowValidateFilter(false);
    dispatch({ type: 'TO', dateTo: dateString });
  };
  const [handleTableRevenueChange, DataTableRevenue, params] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: async (event) => {
        return navigate(routerLinks('RevenueDetail') + `?id=${data.id}` + `&idSupplier=${idSupplier || subOrgId}`);
      },
    }),
    loading,
    setLoading,
    save: false,
    defaultRequest: { status: 'DELIVERED' },
    Get: async (params) => {
      const submitFormatDate = {
        dateFrom: formatSubmit(filterDate.dateFrom),
        dateTo: formatSubmit(filterDate.dateTo),
      };
      return SupplierService.getRevenueSupplier(idSupplier || subOrgId, {
        ...params,
        filter: submitFormatDate !== null ? submitFormatDate : null,
      });
    },
    // Get: SupplierService.GetOrder,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`,
    columns: ColumnRevenueSupplier({
      handDelete: async (id) => {
        (await SupplierService.delete(id)) && handleTableRevenueChange();
      },
      formatCurrency,
      idSupplier,
      subOrgId,
    }),
  });

  const [handleTableRevenueReturnOrder, DataTableRevenueReturnOrder] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) =>
        navigate(routerLinks('ManageReturnGoodsDetail') + `?view=admin&id=${data?.id}`, {
          state: { billCode: data?.billCode },
        }),
    }),
    loading,
    setLoading,
    save: false,
    defaultRequest: { status: 'DELIVERED' },
    Get: async (params) => {
      const submitFormatDate = {
        dateFrom: formatSubmit(filterDate.dateFrom),
        dateTo: formatSubmit(filterDate.dateTo),
      };
      return SupplierService.getRevenueSupplierReturnOrder(idSupplier || subOrgId, {
        ...params,
        filter: submitFormatDate !== null ? submitFormatDate : null,
        idSupplier,
      });
    },
    // Get: SupplierService.GetOrder,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`,
    columns: ColumnRevenueReturnOrder({
      handDelete: async (id) => {
        (await SupplierService.delete(id)) && handleTableRevenueReturnOrder();
      },
      formatCurrency,
      idSupplier,
      subOrgId,
    }),
  });

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }

  if (!countRevenue) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }

  const items = [
    {
      tab: <span className="font-medium text-sm text-teal-900">Đã giao</span>,
      key: "1",
      children: (
        <div className="mt-4">
          {Number(detailRevenueKey) === 1 && DataTableRevenue()}
        </div>
      ),
    },
    {
      tab: "Trả hàng",
      key: "2",
      children: (
        <div className="mt-4">
          {Number(detailRevenueKey) === 2 && DataTableRevenueReturnOrder()}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="sm:relative mb-5 sm:mt-0 mt-4">
        <div className="sm:flex gap-4 items-end justify-end">
          <Space direction="vertical" className="flex items-center gap-2">
            <p className="text-[16px] text-left sm:w-auto sm:mr-0 mr-4">Từ ngày</p>{' '}
            <DatePicker
              onChange={onChangeDateFrom}
              format="DD/MM/YYYY"
              defaultValue={dayjs(getFormattedDate(firstDay), 'DD/MM/YYYY')}
              disabledDate={(current) => {
                // return moment().add(-1, 'days') <= current;
                return current && current.valueOf() > Date.now();
              }}
              size={'middle'}
            />
          </Space>
          <Space direction="vertical" className="flex items-center gap-2 sm:mt-0 mt-2">
            <p className="text-[16px] text-left sm:w-auto">Đến ngày</p>{' '}
            <DatePicker
              onChange={onChangeDateTo}
              format="DD/MM/YYYY"
              defaultValue={dayjs(getFormattedDate(date), 'DD/MM/YYYY')}
              disabledDate={(current) => {
                // return moment().add(-1, 'days') <= current;
                return current && current.valueOf() > Date.now();
              }}
              className={'sm:ml-0'}
              size={'middle'}
            />
          </Space>
        </div>
        {showValidateFilter && (
          <span className="text-red-500 absolute right-0 my-2 sm:mb-0 mb-4">
            Ngày kết thúc phải lớn hơn ngày bắt đầu
          </span>
        )}
      </div>
      <div className="md:flex justify-center items-center sm:gap-4 mt-[40px] sm:mb-3 mb-4">
        <div className="total-revenue md:w-[24%] w-full rounded-xl shadow-[0_0_9px_rgb(0,0,0,0.25)] pt-3 pb-5 px-5 text-center flex flex-col items-center justify-center h-[115px]">
          <h1 className="font-bold mb-3">Doanh thu</h1>
          <span className="text-teal-900 text-xl font-bold mt-auto">
            {(countRevenue && countRevenue?.totalRenueve && formatCurrency(countRevenue?.totalRenueve || 0, ' VND')) ||
              0}
          </span>
        </div>
        <div className="total-successfulOrder md:w-[24%] mt-4 sm:mt-0 rounded-xl shadow-[0_0_9px_rgb(0,0,0,0.25)] pt-3 pb-5 px-5 text-center flex flex-col items-center justify-center h-[115px]">
          <h1 className="font-bold mb-3">Tổng số đơn thành công</h1>
          <span className="text-teal-900 text-xl font-bold mt-auto">
            {countRevenue && countRevenue['total-oder-success']}
          </span>
        </div>
        <div className="total-successfulOrder md:w-[24%] mt-4 sm:mt-0 rounded-xl shadow-[0_0_9px_rgb(0,0,0,0.25)] pt-3 pb-5 px-5 text-center flex flex-col items-center justify-center h-[115px]">
          <h1 className="font-bold mb-3">Tổng số đơn trả</h1>
          <span className="text-teal-900 text-xl font-bold mt-auto">
            {countRevenue && countRevenue['total-oder-return']}
          </span>
        </div>
        <div className="total-cancelledOrder md:w-[24%] mt-4 sm:mt-0 rounded-xl shadow-[0_0_9px_rgb(0,0,0,0.25)] pt-3 pb-5 px-5 text-center flex flex-col items-center justify-center h-[115px]">
          <h1 className="font-bold mb-3">Tổng số đơn bị hủy</h1>
          <span className="text-teal-900 text-xl font-bold mt-auto">
            {countRevenue && countRevenue['total-oder-cancel']}
          </span>
        </div>
      </div>
      <div className="font-medium tab-revenue">
        <Tabs defaultActiveKey="1" items={items} className="mt-10" onChange={onChangeDetailKey} activeKey={String(detailRevenueKey)}>
        </Tabs>
      </div>
    </div>
  );
};

export default DataRevenue;
