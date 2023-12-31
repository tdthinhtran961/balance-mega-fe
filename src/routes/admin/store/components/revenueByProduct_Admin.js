import React, { useState, Fragment, useEffect, useReducer } from 'react';
import { ColumnStoreRevenueByProductTable } from 'columns/store';
import { StoreService } from 'services/store';
import '../index.less';
import { HookDataTable } from 'hooks';
// import { useAuth } from 'global';
import { CategoryService } from 'services/category';
import { SupplierService } from 'services/supplier';
import { DatePicker, Space, Select, Table, Form } from 'antd';
import { reFormatDateString, formatCurrency, formatDateString, getFormattedDate } from 'utils';
import moment from 'moment';
import * as XLSX from 'xlsx';
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

const RevenueByProductAdmin = (ObjectStore) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  // const { user } = useAuth();
  const subOrgId = ObjectStore?.idStore;
  // const subOrgId = user?.userInfor?.subOrgId;
  const [filterStatus, setFilterStatus] = useState();
  const [filterSupplier, setFilterSupplier] = useState();
  const [supplierList, setSupplierList] = useState([]);
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const [dataExcel, setDataExcel] = useState([]);
  const [filterDate, dispatch] = useReducer(reducer, initDate);
  const [disableSupplier, setDisableSupplier] = useState(true);
  const [total, setTotal] = useState({});
  const [, setIsLoad] = useState({
    loadingMain: false,
    loading1: false,
  });
  const [idCategory, setIdCategory] = useState({
    idCategoryMain: '',
    idCategory1: '',
    idCategory2: '',
  });
  const filterCategory = idCategory.idCategory2 || idCategory.idCategory1 || idCategory.idCategoryMain;
  const [dataCategory, setDataCategory] = useState({
    dataCategoryMain: [],
    dataCategory1: [],
    dataCategory2: [],
  });
  const [headExcelInfo, setHeadExcelInfo] = useState({
    fullTextSearch: '',
    dateFrom: moment(firstDay).format('L'),
    dateTo: moment(new Date()).format('L'),
    status: '',
    supplierName: '',
    storeName: '',
    categoryMain: '',
    category1: '',
    category2: '',
  });
  const [paramSExcel, setParamSExcel] = useState({
    page: 0,
    perPage: 0,
    fullTextSearch: '',
    supplierId: filterSupplier,
    idStore: subOrgId,
    status: filterStatus,
    filter: filterDate,
    categoryId: filterCategory,
  });
  const onChangeDateFrom = (_, dateString) => {
    if (new Date(reFormatDateString(dateString)) > new Date(filterDate.dateTo)) {
      setShowValidateFilter(true);
      dispatch({ type: 'FROM', dateFrom: dateString });
      return;
    }
    setShowValidateFilter(false);
    dispatch({ type: 'FROM', dateFrom: dateString });
    setHeadExcelInfo((prev) => ({
      ...prev,
      dateFrom: dateString,
    }));
  };
  const onChangeDateTo = (_, dateString) => {
    if (new Date(filterDate.dateFrom) > new Date(reFormatDateString(dateString))) {
      setShowValidateFilter(true);
      dispatch({ type: 'TO', dateTo: dateString });
      return;
    }
    setShowValidateFilter(false);
    dispatch({ type: 'TO', dateTo: dateString });
    setHeadExcelInfo((prev) => ({
      ...prev,
      dateTo: dateString,
    }));
  };
  useEffect(async () => {
    setDisableSupplier(false);
    setHeadExcelInfo((prev) => ({
      ...prev,
      storeName: subOrgId,
    }));
    const supplierListBalance = await SupplierService.getListSupplierBalance({
      page: 1,
      perPage: 100000,
      idSuppiler: subOrgId,
    });
    const supplierListNonBalance = await SupplierService.getListSupplierNonBal({
      page: 1,
      perPage: 100000,
      storeId: subOrgId,
      supplierType: 'NON_BALANCE',
    });
    setSupplierList(supplierListBalance?.data.concat(supplierListNonBalance.data));

    // const supplierList = await SupplierService.getDetailListConnectSupplier(
    //   { page: 1, perPage: 100000, idSuppiler: subOrgId },
    //   subOrgId,
    // );

    // setSupplierList(supplierList?.data);
  }, []);
  useEffect(() => {
    const initDataCategory = async () => {
      setIsLoad((prev) => ({ ...prev, loadingMain: true }));
      try {
        const res = (filterSupplier === 'null' || filterSupplier === 'undefined')
          ? await CategoryService.get({})
          : await CategoryService.get({ subOrgId: filterSupplier })
        setDataCategory((prev) => ({ ...prev, dataCategoryMain: res.data }));
      } catch (error) {
        return error;
      } finally {
        setIsLoad((prev) => ({ ...prev, loadingMain: false }));
      }
    };
    initDataCategory();
  }, [filterSupplier]);
  useEffect(() => {
    const initDataCategory = async () => {
      if (idCategory.idCategoryMain) {
        setIsLoad((prev) => ({ ...prev, loading1: true }));
        try {
          const res = (filterSupplier === 'null' || filterSupplier === 'undefined')
            ? await CategoryService.get({ id: idCategory.idCategoryMain })
            : await CategoryService.get({ id: idCategory.idCategoryMain, subOrgId: filterSupplier })
          setDataCategory((prev) => ({
            ...prev,
            dataCategory1: res.data,
            dataCategory2: [],
          }));
        } catch (error) {
          return error;
        } finally {
          setIsLoad((prev) => ({ ...prev, loading1: false }));
        }
      }
    };
    initDataCategory();
  }, [idCategory.idCategoryMain]);
  useEffect(() => {
    const initDataCategory = async () => {
      if (idCategory.idCategory1) {
        setIsLoad((prev) => ({ ...prev, loading2: true }));
        try {
          const res = (filterSupplier === 'null' || filterSupplier === 'undefined')
            ? await CategoryService.get({ id: idCategory.idCategory1 })
            : await CategoryService.get({ id: idCategory.idCategory1, subOrgId: filterSupplier })
          setDataCategory((prev) => ({ ...prev, dataCategory2: res.data }));
        } catch (error) {
          return error;
        } finally {
          setIsLoad((prev) => ({ ...prev, loading2: false }));
        }
      }
    };
    initDataCategory();
  }, [idCategory.idCategory1]);
  useEffect(() => {
    handleChangeDataRebvenueByOrder();
  }, [filterDate, filterSupplier, filterStatus, filterCategory]);
  const formatCur = (value) => {
    if (!value) return 0;
    return value || value === 0 ? value : null;
  };
  const handelTesst = async () => {
    const res = await StoreService.getListRevenueByProduct({
      ...paramSExcel,
      isExport: true,
    });
    setTotal(res?.total);
    const data = res.data?.map((i) => ({
      index: i.index,
      productCode: i.productCode,
      productName: i.productName,
      barcode: i.barcode,
      supplierName: i.supplierName,
      revenue: formatCurrency(formatCur(i.revenue), ''),
      status: i.status === 'STOP_SELLING' ? 'Ngưng bán' : 'Đang bán',
    }));
    const sum = res.data
      ?.map((i) => ({
        index: i.index,
        productCode: i.productCode,
        productName: i.productName,
        barcode: i.barcode,
        supplierName: i.supplierName,
        revenue: +i.revenue,
        status: i.status === 'STOP_SELLING' ? 'Ngưng bán' : 'Đang bán',
      }))
      ?.reduce((acc, obj) => {
        Object.keys(obj).forEach((key) => {
          acc[key] = (acc[key] || 0) + +obj[key];
        });
        return acc;
      }, {});
    sum.index = '';
    sum.productCode = '';
    sum.productName = '';
    sum.barcode = '';
    sum.supplierName = 'Tổng cộng';
    sum.revenue = total.total ? formatCurrency(total.total, ' ') : 0;
    sum.status = '';
    data.push(sum);
    const Heading = [['STT', 'Mã sản phẩm', 'Tên sản phẩm', 'Mã vạch', 'Nhà cung cấp', 'Doanh thu', 'Trạng thái']];
    const wb = XLSX.utils.book_new();
    // const ws = XLSX.utils.aoa_to_sheet(Heading);
    const ws = XLSX.utils.sheet_add_aoa(wb, Heading, {
      origin: 'A11',
    });
    XLSX.utils.sheet_add_aoa(ws, [['BÁO CÁO DOANH THU CỬA HÀNG THEO SẢN PHẨM']], { origin: 'B1' });
    // Create a new workbook and worksheet
    // const ws = XLSX.utils.aoa_to_sheet(Heading);
    // Thông tin file Excel (filters, tên cửa hàng, nhà cc...)
    XLSX.utils.sheet_add_aoa(ws, [['Tìm kiếm:', headExcelInfo.fullTextSearch]], { origin: 'A3' });
    XLSX.utils.sheet_add_aoa(ws, [['Chọn trạng thái', headExcelInfo.status]], { origin: 'A5' });
    XLSX.utils.sheet_add_aoa(ws, [['Chọn nhà cung cấp:', headExcelInfo.supplierName]], { origin: 'D5' });
    XLSX.utils.sheet_add_aoa(ws, [['Từ ngày', headExcelInfo.dateFrom && headExcelInfo.dateFrom]], {
      origin: 'A7',
    });
    XLSX.utils.sheet_add_aoa(ws, [['Đến ngày', headExcelInfo.dateTo && headExcelInfo.dateTo]], {
      origin: 'D7',
    });
    XLSX.utils.sheet_add_aoa(ws, [['Danh mục chính:', headExcelInfo.categoryMain]], { origin: 'A9' });
    XLSX.utils.sheet_add_aoa(ws, [['Danh mục cấp 1:', headExcelInfo.category1]], { origin: 'D9' });
    XLSX.utils.sheet_add_aoa(ws, [['Danh mục cấp 2:', headExcelInfo.category2]], { origin: 'G9' });
    XLSX.utils.sheet_add_json(wb, data, { origin: 'A12', skipHeader: true, skipcolumn: 1 });
    // Add the worksheet to the workbook and save the file
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Doanh thu cửa hàng theo sản phẩm.xlsx`);
  };

  const [handleChangeDataRebvenueByOrder, DataRevenueByProduct] = HookDataTable({
    isLoading,
    setIsLoading,
    save: false,
    Get: async (params) => {
      // return StoreService.getListRevenueByProduct({ ...params, idStore: subOrgId });
      const res = await StoreService.getListRevenueByProduct({
        ...params,
        supplierId: filterSupplier,
        status: filterStatus,
        idStore: subOrgId,
        filter: filterDate,
        categoryId: filterCategory,
      });
      setParamSExcel((prev) => ({
        ...prev,
        page: 1,
        perPage: params?.page * params?.perPage,
        fullTextSearch: params?.fullTextSearch,
        supplierId: filterSupplier,
        idStore: subOrgId,
        status: filterStatus,
        filter: filterDate,
        categoryId: filterCategory,
      }));
      setTotal(res?.total);
      setDataExcel(res?.data);
      setHeadExcelInfo((prev) => ({ ...prev, fullTextSearch: params?.fullTextSearch }));
      return res;
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} sản phẩm`,
    columns: ColumnStoreRevenueByProductTable(),
    subHeader: () => (
      <Fragment>
        <Form form={form} className="min-w-min mt-5 sm:mt-0">
          <div className="grid-cols-1 grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-4 mt-4 mb-4 ">
            <Form.Item name="categoryMain" label="">
              <Select
                showSearch
                allowClear
                placeholder="Danh mục chính"
                optionFilterProp="children"
                className="w-full text-left"
                onChange={(value, options) => {
                  setIdCategory((prev) => ({
                    ...prev,
                    idCategoryMain: value,
                    idCategory1: undefined,
                    idCategory2: undefined,
                  }));
                  setDataCategory((prev) => ({ ...prev, dataCategory1: [], dataCategory2: [] }));
                  form.setFieldsValue({ category1: undefined, category2: undefined });
                  setHeadExcelInfo((prev) => ({ ...prev, categoryMain: options?.label }));
                }}
                filterOption={(input, option) => {
                  return (
                    option.label
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
                options={dataCategory.dataCategoryMain.map((i) => ({ value: i.id, label: i.name }))}
              />
            </Form.Item>
            <Form.Item name="category1" label="">
              <Select
                disabled={dataCategory?.dataCategory1.length === 0}
                showSearch
                allowClear
                placeholder="Danh mục cấp 1"
                optionFilterProp="children"
                className="w-full text-left select-category"
                onChange={(value, options) => {
                  setIdCategory((prev) => ({ ...prev, idCategory1: value, idCategory2: undefined }));
                  setDataCategory((prev) => ({ ...prev, dataCategory2: [] }));
                  form.setFieldsValue({ category2: undefined });
                  setHeadExcelInfo((prev) => ({ ...prev, category1: options?.label }));
                }}
                filterOption={(input, option) => {
                  return (
                    option.label
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
                options={dataCategory.dataCategory1.map((i) => ({ value: i.id, label: i.name }))}
              />
            </Form.Item>
            <Form.Item name="category2" label="">
              <Select
                disabled={dataCategory?.dataCategory2.length === 0}
                showSearch
                allowClear
                placeholder="Danh mục cấp 2"
                optionFilterProp="children"
                className="w-full text-left select-category"
                onChange={(value, options) => {
                  setIdCategory((prev) => ({ ...prev, idCategory2: value }));
                  setHeadExcelInfo((prev) => ({ ...prev, category2: options?.label }));
                }}
                filterOption={(input, option) => {
                  return (
                    option.label
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
                options={dataCategory.dataCategory2.map((i) => ({ value: i.id, label: i.name }))}
              />
            </Form.Item>
          </div>
        </Form>
      </Fragment>
    ),
    rightHeader: (
      <div className="flex 3xl:flex-row flex-col  ">
        {/* <div className="flex 2xl:items-end items-start flex-col 2xl:gap-3 2xl:mt-0 mt-3"></div> */}
        <div className="flex 3xl:my-0 md:flex-row flex-col 3xl:mb-0 md:mb-4 w-full 3xl:mr-4 xl:justify-end justify-start xl:mt-0 mt-0">
          <div className="flex flex-col">
            <Select
              className="sm:w-[185px] w-full rounded-[10px] mr-0 sm:mr-6 md:mb-0 mb-2"
              placeholder="Chọn trạng thái"
              optionFilterProp="children"
              allowClear
              onChange={(event) => {
                setFilterStatus(event);
                setHeadExcelInfo((prev) => ({
                  ...prev,
                  status: event === 'APPROVED' ? 'Đang bán' : event === 'STOP_SELLING' ? 'Ngừng bán' : null,
                }));
              }}
            >
              <Option value="APPROVED">Đang bán</Option>
              <Option value="STOP_SELLING">Ngừng bán</Option>
            </Select>
          </div>
          <div className="flex flex-col 3xl:mr-0 mr-2">
            <Select
              disabled={disableSupplier}
              className="sm:w-[185px] w-full rounded-[10px]"
              placeholder="Chọn nhà cung cấp"
              optionFilterProp="children"
              value={filterSupplier}
              allowClear
              onChange={async (event, options) => {
                setIdCategory((prev) => ({
                  ...prev,
                  idCategoryMain: undefined,
                  idCategory1: undefined,
                  idCategory2: undefined,
                }));
                setDataCategory((prev) => ({ ...prev, dataCategoryMain: [], dataCategory1: [], dataCategory2: [] }));
                form.setFieldsValue({ categoryMain: undefined, category1: undefined, category2: undefined });
                setFilterSupplier(event, options);
                setHeadExcelInfo((prev) => ({
                  ...prev,
                  supplierName: options?.title,
                }));
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
            >
              {supplierList &&
                supplierList.map((item, index) => {
                  return (
                    <Option key={index} value={item?.id} title={item?.supplierName}>
                      {item?.supplierName}
                    </Option>
                  );
                })}
            </Select>
          </div>
        </div>
        <div className="sm:relative md:mt-0 mt-3">
          <div className="sm:flex gap-4 items-end xl:justify-end justify-start">
            <Space direction="vertical" className="flex items-center gap-2 w-[240px]">
              <p className="text-[12px] text-left sm:w-auto sm:mr-0 mr-4">Từ ngày</p>{' '}
              <DatePicker
                onChange={onChangeDateFrom}
                format="DD/MM/YYYY"
                defaultValue={moment(getFormattedDate(firstDay), 'DD/MM/YYYY')}
                disabledDate={(current) => {
                  return current && current.valueOf() > Date.now();
                }}
                size={'middle'}
              />
            </Space>
            <Space direction="vertical" className="flex items-center gap-2 sm:mt-0 mt-2 w-[240px] datepicker-to">
              <p className="text-[12px] text-left sm:w-auto sm:mr-0 mr-1">Đến ngày</p>{' '}
              <DatePicker
                onChange={onChangeDateTo}
                format="DD/MM/YYYY"
                defaultValue={moment(getFormattedDate(date), 'DD/MM/YYYY')}
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
              {total?.total ? formatCurrency(total?.total, ' ') : 0}
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base" />
          </Table.Summary.Row>
        </>
      );
    },
  });
  return (
    <Fragment>
      <div className="min-h-screen store-wrapper">
        <div className="bg-white w-full px-4 pb-6 rounded-[10px] relative revenueByProduct">
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
        </div>
      </div>
    </Fragment>
  );
};
export default RevenueByProductAdmin;
