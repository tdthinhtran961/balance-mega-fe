import React, { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router';
import { formatCurrency, reFormatDateString, getFormattedDate } from 'utils';
// import { useAuth } from 'global';
import { HookDataTable } from 'hooks';
import './index.less';
import { ColumnExportImportExis } from 'columns/report';
import { DatePicker, Form, Select, Space, Table, Input } from 'antd';
import { ReportService } from 'services/report';
// import { ProductService } from 'services/product';
import { CategoryService } from 'services/category';
import { useAuth } from 'global';
import * as XLSX from 'xlsx';
import moment from 'moment';
import classNames from 'classnames';
import { StoreService } from 'services/store';
import dayjs from 'dayjs';

const { Search } = Input;
// import moment from 'moment';

const Page = () => {
  const mount = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [dataExcel, setDataExcel] = useState([]);
  const [dataCategory, setDataCategory] = useState({
    dataCategoryMain: [],
    dataCategory1: [],
    dataCategory2: [],
  });

  const [idCategory, setIdCategory] = useState({
    idCategoryMain: '',
    idCategory1: '',
    idCategory2: '',
  });

  const [, setIsLoad] = useState({
    loadingMain: false,
    loading1: false,
  });
  const filterCategory = idCategory.idCategory2 || idCategory.idCategory1 || idCategory.idCategoryMain;
  const [showValidateFilter, setShowValidateFilter] = useState(false);
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
  const [filterDate, setFilterDate] = useState({
    dateFrom: moment(firstDay).format('YYYY-MM-DD') + ' 00:00:00',
    dateTo: moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59',
  });
  const timeoutSearch = useRef();
  const [supplierList, setSupplierList] = useState([]);
  const [filterSupplier, setFilterSupplier] = useState();
  const storeId = user?.userInfor?.subOrgId;
  const [searchBarcode, setSearchBarcode] = useState();
  const [searchProductName, setSearchProductName] = useState();

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
    let flag = true;
    const fetchSupplierList = async () => {
      try {
        const res = await StoreService.getListSupplierForFilterProd(
          {
            storeId,
            type: 'ALL',
          },
          'store/all-supplier-store',
        );
        if (flag) setSupplierList(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSupplierList();
    return () => {
      flag = false;
    };
  }, []);
  useEffect(() => {
    handleChange();
  }, [filterCategory, filterDate, filterSupplier, searchBarcode, searchProductName]);

  const initFunction = useCallback(async () => {
    if (!mount.current) {
      mount.current = true;
    }
  }, [mount]);

  useEffect(() => {
    initFunction();
  }, [initFunction, pathname]);

  const [headExcelInfo, setHeadExcelInfo] = useState({
    categoryMain: '',
    category1: '',
    category2: '',
    barCode: '',
    productName: '',
    supplierName: '',
    dateFrom: '',
    dateTo: '',
  });

  const [handleChange, DataTable] = HookDataTable({
    // onRow: (data) => ({
    //   onDoubleClick: (event) => {
    //     return null;
    //   },
    // }),
    isLoading,
    setIsLoading,
    Get: async (params) => {
      const res = await ReportService.get({
        ...params,
        dateFrom: filterDate.dateFrom,
        dateTo: filterDate.dateTo,
        categoryId: filterCategory,
        supplierId: filterSupplier,
        barCode: searchBarcode,
        productName: searchProductName,
      });

      setHeadExcelInfo((prev) => ({
        ...prev,
        productName: searchProductName,
        barCode: searchBarcode,
        dateFrom: filterDate.dateFrom,
        dateTo: filterDate.dateTo,
      }));
      setDataExcel(res.data);
      return res;
    },
    save: false,
    showSearch: false,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} báo cáo`,
    columns: ColumnExportImportExis(),
    xScroll: 900,
    yScroll: null,
    className: 'data-table export-import-exist',
    subHeader: (data) => (
      <>
        <div className="filterTable">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
            <Select
              showSearch
              allowClear
              placeholder="Chọn nhà cung cấp"
              optionFilterProp="children"
              className="w-full text-left"
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
                  supplierName: options?.label,
                }));
              }}
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={supplierList?.map((i) => ({ value: i.id, label: i.name }))}
            />

            <div className="search-container w-full">
              <Search
                className="w-full focus:!border-black"
                placeholder="Tìm kiếm theo mã vạch"
                allowClear
                enterButton="Search"
                onChange={(e) => {
                  clearTimeout(timeoutSearch.current);
                  timeoutSearch.current = setTimeout(() => {
                    setSearchBarcode(e.target.value);
                  }, 500);
                }}
              />
              <i className="text-[22px] las la-search absolute top-3 left-5 sm:z-10 -rotate-90" />
            </div>
            <div className="search-container w-full">
              <Search
                className="w-full focus:!border-black"
                placeholder="Tìm kiếm theo tên sản phẩm"
                allowClear
                enterButton="Search"
                // onSearch={onSearch}
                onChange={(e) => {
                  clearTimeout(timeoutSearch.current);
                  timeoutSearch.current = setTimeout(() => {
                    setSearchProductName(e.target.value);
                  }, 500);
                }}
              />
              <i className="text-[22px] las la-search absolute top-3 left-5 sm:z-10 -rotate-90" />
            </div>
            <div className="sm:w-1/4"></div>
          </div>
          <div className="grid-cols-1 grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-1 sm:gap-4 mt-4 ">
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
                options={dataCategory.dataCategoryMain?.map((i) => ({ value: i.id, label: i.name }))}
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
                  setHeadExcelInfo((prev) => ({ ...prev, idCategory1: options?.label }));
                }}
                // onSearch={onSearch}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={dataCategory.dataCategory1?.map((i) => ({ value: i.id, label: i.name }))}
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
                options={dataCategory.dataCategory2?.map((i) => ({ value: i.id, label: i.name }))}
              />
            </Form.Item>
          </div>

          <div
            className={classNames('grid grid-cols-1 sm:grid-cols-4 gap-4 items-center relative', {
              'mb-4': showValidateFilter,
            })}
          >
            <Space direction="vertical" className="flex items-center gap-2 !w-full">
              <Form.Item name="startDate" label="Từ ngày" className="!w-full">
                <DatePicker
                  onChange={(date, dateString) => {
                    if (!date) {
                      // setFilterDate((prev) => ({ ...prev, dateFrom: moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00' }))
                      setShowValidateFilter(false);
                      return;
                    }
                    if (new Date(reFormatDateString(dateString)) > new Date(filterDate.dateTo)) {
                      setShowValidateFilter(true);
                      return;
                    } else {
                      setShowValidateFilter(false);
                    }
                    setFilterDate((prev) => ({ ...prev, dateFrom: dayjs(date).format('YYYY-MM-DD') + ' 00:00:00' }));
                  }}
                  format="DD/MM/YYYY"
                  disabledDate={(current) => {
                    return current && current.valueOf() > Date.now();
                  }}
                  defaultValue={dayjs(getFormattedDate(firstDay), 'DD/MM/YYYY')}
                  className="!bg-white !w-full"
                  size={'middle'}
                />
              </Form.Item>
            </Space>
            <Space direction="vertical" className="items-center gap-2 sm:mt-0 mt-2 !w-full relative">
              <Form.Item name="endDate" label="Đến ngày">
                <DatePicker
                  onChange={(date, dateString) => {
                    if (!date) {
                      // setFilterDate((prev) => ({ ...prev, dateTo: moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59' }))
                      setShowValidateFilter(false);
                      return;
                    }
                    if (new Date(filterDate.dateFrom) > new Date(reFormatDateString(dateString))) {
                      setShowValidateFilter(true);
                      return;
                    } else {
                      setShowValidateFilter(false);
                    }
                    setFilterDate((prev) => ({ ...prev, dateTo: dayjs(date).format('YYYY-MM-DD') + ' 23:59:59' }));
                  }}
                  format="DD/MM/YYYY"
                  defaultValue={dayjs()}
                  disabledDate={(current) => {
                    return current && current.valueOf() > Date.now();
                  }}
                  className={'sm:ml-0 !bg-white'}
                  size={'middle'}
                />
              </Form.Item>
              {showValidateFilter && (
                <span className="text-red-500 !text-[13px] absolute right-0 my-1 sm:mb-4 mb-4 z-10 bottom-[-23px]">
                  Ngày kết thúc phải lớn hơn ngày bắt đầu
                </span>
              )}
            </Space>
            <div className="w-full sm:w-1/4"></div>
            <div className="w-full sm:w-1/4"></div>
          </div>
        </div>
      </>
    ),
    summary: (data) => {
      const caculate = (data, props) => {
        if (!data) return '';
        let total = 0;
        data.forEach((item) => {
          total += +item[props];
        });
        return total;
      };
      const totalPrice = (data, qty, price) => {
        if (!data || !qty || !price) return 0;
        let total = 0;
        data.forEach((item) => {
          total += +item[qty] * +item[price];
        });
        return total || total === 0 ? formatCurrency(total, ' ') : 0;
      };
      if (data && data.length === 0) return null;
      return (
        <>
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={3} align="right">
              <span className="font-bold text-base">Tổng cộng</span>
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {formatCurrency(caculate(data, 'inventoryFirst') ? caculate(data, 'inventoryFirst') : 0, ' ')}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {totalPrice(data, 'inventoryFirst', 'productPrice')}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {formatCurrency(caculate(data, 'importGoods') ? caculate(data, 'importGoods') : 0, ' ')}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {totalPrice(data, 'importGoods', 'productPrice')}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {formatCurrency(caculate(data, 'returnGoods') ? caculate(data, 'returnGoods') : 0, ' ')}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {totalPrice(data, 'returnGoods', 'productPrice')}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {formatCurrency(caculate(data, 'disposalGoods') ? caculate(data, 'disposalGoods') : 0, ' ')}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {totalPrice(data, 'disposalGoods', 'productPrice')}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {formatCurrency(caculate(data, 'transferReceiveGoods') ? caculate(data, 'transferReceiveGoods') : 0, ' ')}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {totalPrice(data, 'transferReceiveGoods', 'productPrice')}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {formatCurrency(caculate(data, 'transferExportGoods') ? caculate(data, 'transferExportGoods') : 0, ' ')}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {totalPrice(data, 'transferExportGoods', 'productPrice')}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {formatCurrency(caculate(data, 'sellGoods') ? caculate(data, 'sellGoods') : 0, ' ')}{' '}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {totalPrice(data, 'sellGoods', 'productPrice')}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {formatCurrency(caculate(data, 'inventoryLast') ? caculate(data, 'inventoryLast') : 0, ' ')}
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center" className="font-bold text-base">
              {totalPrice(data, 'inventoryLast', 'productPrice')}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </>
      );
    },
    loadFirst: false,
  });

  const formatCur = (value) => {
    if (!value) return 0;
    return value || value === 0 ? formatCurrency(value, ' ') : null;
  };
  const totalPriceExcel = (qty, price, type = 1) => {
    if (!qty || !price) return 0;
    if (type === 1) {
      return +qty * +price;
    }
    if (type === 2) {
      return formatCur(+qty * +price);
    }
  };

  const handelTesst = async () => {
    const res = await ReportService.get({
      page: 1,
      perPage: 10,
      dateFrom: filterDate.dateFrom,
      dateTo: filterDate.dateTo,
      categoryId: filterCategory,
      supplierId: filterSupplier,
      barCode: searchBarcode,
      productName: searchProductName,
      isExport: true,
    });
    if (res && res.data.length > 0) {
      const data = res.data?.map((i) => ({
        productStoreBarcode: i.productStoreBarcode,
        productName: i.productName,
        suppplierName: i.suppplierName,
        inventoryFirst: formatCur(i.inventoryFirst),
        prouductPriceFirst: totalPriceExcel(i.inventoryFirst, i.productPrice, 2),
        importGoods: formatCur(i.importGoods),
        productPriceImport: totalPriceExcel(i.importGoods, i.productPrice, 2),
        returnGoods: formatCur(i.returnGoods),
        productPriceReturn: totalPriceExcel(i.returnGoods, i.productPrice, 2),
        disposalGoods: formatCur(i.disposalGoods),
        productPriceDisposal: totalPriceExcel(i.disposalGoods, i.productPrice, 2),
        transferReceiveGoods: formatCur(i.transferReceiveGoods),
        productPriceTransferReceiveGoods: totalPriceExcel(i.transferReceiveGoods, i.productPrice, 2),
        transferExportGoods: formatCur(i.transferExportGoods),
        productPriceTransferExportGoods: totalPriceExcel(i.transferExportGoods, i.productPrice, 2),
        sellGoods: formatCur(i.sellGoods),
        productPriceSell: totalPriceExcel(i.sellGoods, i.productPrice, 2),
        inventoryLast: formatCur(i.inventoryLast),
        productPriceLast: totalPriceExcel(i.inventoryLast, i.productPrice, 2),
      }));

      const sum = res.data
        ?.map((i) => ({
          productStoreBarcode: i.productStoreBarcode,
          productName: i.productName,
          suppplierName: i.suppplierName,
          inventoryFirst: +i.inventoryFirst,
          prouductPriceFirst: totalPriceExcel(i.inventoryFirst, i.productPrice),
          importGoods: +i.importGoods,
          productPriceImport: totalPriceExcel(i.importGoods, i.productPrice),
          returnGoods: +i.returnGoods,
          productPriceReturn: totalPriceExcel(i.returnGoods, i.productPrice),
          disposalGoods: +i.disposalGoods,
          productPriceDisposal: totalPriceExcel(i.disposalGoods, i.productPrice),
          transferReceiveGoods: +i.transferReceiveGoods,
          productPriceTransferReceiveGoods: totalPriceExcel(i.transferReceiveGoods, i.productPrice),
          transferExportGoods: +i.transferExportGoods,
          productPriceTransferExportGoods: totalPriceExcel(i.transferExportGoods, i.productPrice),
          sellGoods: +i.sellGoods,
          productPriceSell: totalPriceExcel(i.sellGoods, i.productPrice),
          inventoryLast: +i.inventoryLast,
          productPriceLast: totalPriceExcel(i.inventoryLast, i.productPrice),
        }))
        ?.reduce((acc, obj) => {
          Object.keys(obj).forEach((key) => {
            acc[key] = (acc[key] || 0) + +obj[key];
          });
          return acc;
        }, {});

      sum.productStoreBarcode = '';
      sum.productName = '';
      sum.suppplierName = 'Tổng';
      sum.inventoryFirst = formatCur(sum.inventoryFirst);
      sum.prouductPriceFirst = formatCur(sum.prouductPriceFirst);
      sum.importGoods = formatCur(sum.importGoods);
      sum.productPriceImport = formatCur(sum.productPriceImport);
      sum.returnGoods = formatCur(sum.returnGoods);
      sum.productPriceReturn = formatCur(sum.productPriceReturn);
      sum.disposalGoods = formatCur(sum.disposalGoods);
      sum.productPriceDisposal = formatCur(sum.productPriceDisposal);
      sum.transferExportGoods = formatCur(sum.transferExportGoods);
      sum.productPriceTransferExportGoods = formatCur(sum.productPriceTransferExportGoods);
      sum.sellGoods = formatCur(sum.sellGoods);
      sum.productPriceSell = formatCur(sum.productPriceSell);
      sum.inventoryLast = formatCur(sum.inventoryLast);
      sum.productPriceLast = formatCur(sum.productPriceLast);

      data.push(sum);

      const Heading = [
        [
          'Mã vạch',
          'Tên sản phẩm',
          'Nhà cung cấp',
          'Tồn đầu kỳ',
          '',
          // '',
          'Nhập trong kỳ',
          '',

          'Trả trong kỳ',
          '',

          'Hủy trong kỳ',
          '',

          'Chuyển (Nhận)',
          '',

          'Chuyển (Xuất)',
          '',
          // '',
          'Bán hàng',
          '',
          // '',
          'Tồn cuối kỳ',
          '',
          // '',
        ],
        [
          '',
          '',
          '',
          'SL',
          'Tiền',
          // '',
          'SL',
          'Tiền',
          // '',
          'SL',
          'Tiền',
          // '',
          'SL',
          'Tiền',
          // '',
          'SL',
          'Tiền',
          // '',
          'SL',
          'Tiền',
          // '',
          'SL',
          'Tiền',
          // '',
          'SL',
          'Tiền',
        ],
      ];

      // Create a new workbook and worksheet
      const wb = XLSX.utils.book_new();
      // const ws = XLSX.utils.aoa_to_sheet(Heading);
      const ws = XLSX.utils.sheet_add_aoa(wb, Heading, {
        origin: 'A8',
      });
      XLSX.utils.sheet_add_aoa(ws, [['BÁO CÁO XUẤT NHẬP TỒN']], { origin: 'H1' });

      // Thông tin file Excel (filters, tên cửa hàng, nhà cc...)
      XLSX.utils.sheet_add_aoa(ws, [['Nhà cung cấp', headExcelInfo.supplierName]], { origin: 'A3' });
      XLSX.utils.sheet_add_aoa(ws, [['Tìm kiếm theo mã phiếu:', headExcelInfo.barCode]], { origin: 'E3' });
      XLSX.utils.sheet_add_aoa(ws, [['Tìm kiếm theo tên sản phẩm:', headExcelInfo.productName]], { origin: 'I3' });
      XLSX.utils.sheet_add_aoa(ws, [['Danh mục chính:', headExcelInfo.categoryMain]], { origin: 'A4' });
      XLSX.utils.sheet_add_aoa(ws, [['Danh mục cấp 1:', headExcelInfo.category1]], { origin: 'E4' });
      XLSX.utils.sheet_add_aoa(ws, [['Danh mục cấp 2:', headExcelInfo.category2]], { origin: 'I4' });
      XLSX.utils.sheet_add_aoa(ws, [['Từ ngày', moment(headExcelInfo.dateFrom).format('DD/MM/YYYY')]], {
        origin: 'A5',
      });
      XLSX.utils.sheet_add_aoa(ws, [['Đến ngày', moment(headExcelInfo.dateTo).format('DD/MM/YYYY')]], { origin: 'E5' });

      XLSX.utils.sheet_add_json(wb, data, { origin: 'A10', skipHeader: true, skipcolumn: 1 });

      ws['!merges'] = [
        { s: { r: 7, c: 3 }, e: { r: 7, c: 4 } },
        { s: { r: 7, c: 5 }, e: { r: 7, c: 6 } },
        { s: { r: 7, c: 7 }, e: { r: 7, c: 8 } },
        { s: { r: 7, c: 9 }, e: { r: 7, c: 10 } },
        { s: { r: 7, c: 11 }, e: { r: 7, c: 12 } },
        { s: { r: 7, c: 13 }, e: { r: 7, c: 14 } },
        { s: { r: 7, c: 15 }, e: { r: 7, c: 16 } },
        { s: { r: 7, c: 17 }, e: { r: 7, c: 18 } },
      ]; //

      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `Báo cáo xuất nhập tồn.xlsx`);
    }
  };

  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="text-2xl font-bold text-teal-900 mb-8">Xuất - Nhập - Tồn</p>
        <Form form={form} className="mt-5 sm:mt-0" validateTrigger="onChange">
          <div className="bg-white pt-6 pb-10 px-6 rounded-md">{DataTable()}</div>
          <div className="flex justify-end items-center mt-4">
            <button
              disabled={dataExcel?.length === 0}
              type="button"
              className="bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center w-[171px] h-11 justify-center disabled:opacity-60 disabled:pointer-events-none"
              onClick={() => handelTesst(dataExcel)}
            >
              Xuất báo cáo
            </button>
          </div>
        </Form>
      </div>
    </Fragment>
  );
};
export default Page;
