import React, { useState, Fragment, useEffect, useReducer } from 'react';
import { ColumnRevenueByProductAdmin } from 'columns/store';
import { RevenueService } from 'services/revenue';
import { HookDataTable } from 'hooks';
import { DatePicker, Space, Select, Form, Table } from 'antd';
import { PromotionalGoodsService } from 'services/PromotionalGoods';
import { CategoryService } from 'services/category';
import { reFormatDateString, formatCurrency, formatDateString, getFormattedDate } from 'utils';
import moment from 'moment';
import classNames from 'classnames';
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

const ProductRevenue = ({ tabKey }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState();
  const [filterSupplier, setFilterSupplier] = useState();
  const [filterDate, dispatch] = useReducer(reducer, initDate);
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const [supplierList, setSupplierList] = useState([]);
  const [dataExcel, setDataExcel] = useState([]);
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

  const [paramSExcel, setParamSExcel] = useState({
    page: 0,
    perPage: 0,
    fullTextSearch: '',
    idSupplier: filterSupplier,
    status: filterStatus,
    filterDate,
    categoryId: filterCategory,
  });
  const [headExcelInfo, setHeadExcelInfo] = useState({
    fullTextSearch: '',
    dateFrom: moment(getFormattedDate(firstDay)).format('YYYY-MM-DD') + ' 00:00:00',
    dateTo: moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59',
    status: '',
    supplierName: '',
    categoryMain: '',
    category1: '',
    category2: '',
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

  useEffect(async () => {
    const supplierList = await PromotionalGoodsService.getSupplierListWithOrderParams({supplierType: 'BALANCE'});
    setFilterSupplier(supplierList?.data[0]?.id);
    // setFilterSupplier(849);
    setSupplierList(supplierList.data);
    setHeadExcelInfo((prev) => ({
      ...prev,
      supplierName: supplierList?.data[0]?.name,
    }));
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
    handleChangeDataRebvenueByProduct();
  }, [filterDate, filterSupplier, filterStatus, filterCategory]);

  const formatCur = (value) => {
    if (!value) return 0;
    return value || value === 0 ? value : null;
  };

  const handelTesst = async () => {
    const res = filterSupplier
      ? await RevenueService.getRevenueProduct({
          ...paramSExcel,
          isExport: true,
        })
      : [];
    setTotal(res?.total);
    const data = res.data?.map((i) => ({
      index: i.index,
      productCode: i.productCode,
      productName: i.productName,
      barcode: i.barcode,
      subTotal: formatCurrency(formatCur(i.subTotal), ''),
      total: formatCurrency(formatCur(i.total), ''),
      status: i.status === 'STOP_SELLING' ? 'Ngưng bán' : 'Đang bán',
    }));
    const sum = res.data
      ?.map((i) => ({
        index: i.index,
        productCode: i.productCode,
        productName: i.productName,
        barcode: i.barcode,
        subTotal: +i.subTotal,
        total: +i.total,
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
    sum.barcode = 'Tổng';
    sum.subTotal = formatCurrency(formatCur(total?.sumSubTotal), ' ');
    sum.total = formatCurrency(formatCur(total?.sumTotal), ' ');
    sum.status = '';

    data.push(sum);

    const Heading = [
      ['STT', 'Mã sản phẩm', 'Tên sản phẩm', 'Mã vạch', 'Doanh thu trước thuế', 'Sau thuế', 'Trạng thái'],
    ];

    const wb = XLSX.utils.book_new();
    // const ws = XLSX.utils.aoa_to_sheet(Heading);
    const ws = XLSX.utils.sheet_add_aoa(wb, Heading, {
      origin: 'A11',
    });
    XLSX.utils.sheet_add_aoa(ws, [['BÁO CÁO DOANH THU NHÀ CUNG CẤP THEO SẢN PHẨM']], { origin: 'C1' });

    // Create a new workbook and worksheet
    // const ws = XLSX.utils.aoa_to_sheet(Heading);

    // Thông tin file Excel (filters, tên cửa hàng, nhà cc...)
    XLSX.utils.sheet_add_aoa(ws, [['Tìm kiếm:', headExcelInfo.fullTextSearch]], { origin: 'A3' });
    XLSX.utils.sheet_add_aoa(ws, [['Chọn loại đơn hàng', headExcelInfo.type]], { origin: 'D3' });
    XLSX.utils.sheet_add_aoa(ws, [['Chọn nhà cung cấp:', headExcelInfo.supplierName]], { origin: 'G3' });
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
    XLSX.utils.sheet_add_aoa(ws, [['Danh mục chính:', headExcelInfo.categoryMain]], { origin: 'A7' });
    XLSX.utils.sheet_add_aoa(ws, [['Danh mục cấp 1:', headExcelInfo.category1]], { origin: 'D7' });
    XLSX.utils.sheet_add_aoa(ws, [['Danh mục cấp 2:', headExcelInfo.category2]], { origin: 'G7' });

    XLSX.utils.sheet_add_json(wb, data, { origin: 'A12', skipHeader: true, skipcolumn: 1 });

    // Add the worksheet to the workbook and save the file
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Doanh thu nhà cung cấp theo sản phẩm.xlsx`);
  };

  const [handleChangeDataRebvenueByProduct, DataRevenueByProduct] = HookDataTable({
    showSearch: true,
    searchPlaceholder: 'Tìm kiếm mã sản phẩm, tên, mã vạch',
    isLoading,
    setIsLoading,
    save: false,
    Get: async (params) => {
      const res = filterSupplier
        ? await RevenueService.getRevenueProduct({
            ...params,
            idSupplier: filterSupplier,
            status: filterStatus,
            categoryId: filterCategory,
            filterDate,
          })
        : [];
      setParamSExcel((prev) => ({
        ...prev,
        page: 1,
        perPage: params?.page * params?.perPage,
        fullTextSearch: params?.fullTextSearch,
        idSupplier: filterSupplier,
        status: filterStatus,
        filterDate,
        categoryId: filterCategory,
      }));
      setHeadExcelInfo((prev) => ({
        ...prev,
        fullTextSearch: params?.fullTextSearch,
        dateFrom: filterDate.dateFrom,
        dateTo: filterDate.dateTo,
      }));
      setTotal(res?.total);
      setDataExcel(res.data);
      return res;
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} sản phẩm`,
    columns: ColumnRevenueByProductAdmin(),
    subHeader: () => (
      <Fragment>
        <Form form={form} className="min-w-min sm:mt-0">
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
                // onSearch={onSearch}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={dataCategory.dataCategoryMain.map((i) => ({ value: i.id, label: i.name }))}
              />
            </Form.Item>
            <Form.Item
              // className="w-1/4"
              name="category1"
              label=""
            >
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
                  setHeadExcelInfo((prev) => ({ ...prev, idCategory1: options?.label }));
                }}
                // onSearch={onSearch}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
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
                // onSearch={onSearch}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={dataCategory.dataCategory2.map((i) => ({ value: i.id, label: i.name }))}
              />
            </Form.Item>
          </div>
        </Form>
      </Fragment>
    ),
    rightHeader: (
      <div className="flex 3xl:items-start xl:items-end items-start 3xl:flex-row flex-col 3xl:gap-3">
        <div className="flex 3xl:my-0 sm:flex-row flex-col 3xl:mb-0 sm:mb-4 xl:mt-0 lg:mt-4 mt-0 w-full xl:justify-end">
          <div className="flex flex-col">
            <Select
              className="sm:w-[195px] rounded-[10px] mr-0 sm:mr-6 sm:mb-0 mb-2"
              placeholder="Chọn trạng thái"
              optionFilterProp="children"
              allowClear
              onChange={(event) => {
                setFilterStatus(event);
                setHeadExcelInfo((prev) => ({
                  ...prev,
                  type: event === 'APPROVED' ? 'Đang bán' : event === 'STOP_SELLING' ? 'Ngừng bán' : null,
                }));
              }}
            >
              <Option value="APPROVED">Đang bán</Option>
              <Option value="STOP_SELLING">Ngừng bán</Option>
            </Select>
            <div>{!filterSupplier && <span className="text-white"></span>}</div>
          </div>
          <div className="flex flex-col">
            <Select
              className="sm:w-[190px] rounded-[10px]"
              placeholder="Chọn nhà cung cấp *"
              optionFilterProp="children"
              value={filterSupplier}
              allowClear
              onChange={(event, options) => {
                setIdCategory((prev) => ({
                  ...prev,
                  idCategoryMain: undefined,
                  idCategory1: undefined,
                  idCategory2: undefined,
                }));
                setDataCategory((prev) => ({ ...prev, dataCategoryMain: [], dataCategory1: [], dataCategory2: [] }));
                form.setFieldsValue({ categoryMain: undefined, category1: undefined, category2: undefined });
                setFilterSupplier(event);
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
        </div>
        <div
          className={classNames('sm:relative xl:my-0 sm:mt-0 mt-4', {
            '!mb-8': showValidateFilter,
          })}
        >
          <div className="sm:flex gap-3 items-end justify-end flex-col md:flex-row">
            <Space
              direction="vertical"
              className="flex items-center gap-2 lg:w-[235px] sm:justify-between justify-start"
            >
              <p className="text-[12px] text-left w-auto lg:w-[56px] sm:mr-0 mr-2">Từ ngày</p>{' '}
              <DatePicker
                onChange={onChangeDateFrom}
                format="DD/MM/YYYY"
                defaultValue={moment(getFormattedDate(firstDay), 'DD/MM/YYYY')}
                disabledDate={(current) => {
                  // return moment().add(-1, 'days') <= current;
                  return current && current.valueOf() > Date.now();
                }}
                size={'middle'}
              />
            </Space>
            <Space
              direction="vertical"
              className="flex items-center gap-2 sm:mt-0 mt-2 lg:w-[235px] datepicker-to !justify-start sm:!justify-between"
            >
              <p className="text-[12px] text-left w-auto lg:w-[56px]">Đến ngày</p>{' '}
              <DatePicker
                onChange={onChangeDateTo}
                format="DD/MM/YYYY"
                defaultValue={moment(getFormattedDate(date), 'DD/MM/YYYY')}
                disabledDate={(current) => {
                  // return moment().add(-1, 'days') <= current;
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
            <Table.Summary.Cell colSpan={4} align="right">
              <span className="font-bold text-base">Tổng cộng</span>
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base">
              {total?.sumSubTotal && formatCurrency(total?.sumSubTotal, ' ')}
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base">
              {total?.sumTotal && formatCurrency(total?.sumTotal, ' ')}
            </Table.Summary.Cell>
            <Table.Summary.Cell className="font-bold text-base" />
          </Table.Summary.Row>
        </>
      );
    },
  });

  return (
    <Fragment>
      <div className="revenueByProduct">
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
    </Fragment>
  );
};

export default ProductRevenue;
