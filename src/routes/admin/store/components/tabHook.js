import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ColumnStoreInventoryManagementTable,
  ColumnStoreRevenueByOrderTable,
  ColumnStoreRevenueByProductTable,
  ColumnStoreListProductTable,
  ColumnSupplierListInNNotInBal,
  ColumnBrandManagement,
} from 'columns/store';
import { useAuth } from 'global';
import { HookDataTable, HookModal } from 'hooks';
import { StoreService } from 'services/store';
import { formatCurrency, routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { DatePicker, Space, Table, Form, Select, Input } from 'antd';
import moment from 'moment';
import * as XLSX from 'xlsx';
import '../index.less';
import { CategoryService } from 'services/category';
const { Search } = Input;
const { Option } = Select;
const TabData = ({ tabKey, idStore, keyDropdown, data, text }) => {
  const timeout = useRef();
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const filterStoreId = urlSearch.get('id');
  const filterSupplierURL = urlSearch.get('supplierId');
  const filterCategory1URL = urlSearch.get('categoryId1');
  const filterCategory2URL = urlSearch.get('categoryId2');
  const filterCategory3URL = urlSearch.get('categoryId3');
  const fullTextSearchURL = urlSearch.get('fullTextSearch') !== null ? urlSearch.get('fullTextSearch') : '';
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const [filterDate, setFilterDate] = useState('');
  const [dataExcel, setDataExcel] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [idSupplierChoosed, setIdSupplierChoosed] = useState(filterSupplierURL ?? filterSupplierURL);
  const [filterSupplierName, setFilterSupplierName] = useState();
  const [filterCategory1, setFilterCategory1] = useState(filterCategory1URL ?? filterCategory1URL);
  const [filterCategory2, setFilterCategory2] = useState(filterCategory2URL ?? filterCategory2URL);
  const [filterCategory3, setFilterCategory3] = useState(filterCategory3URL ?? filterCategory3URL);
  const [filterCategoryName1, setFilterCategoryName1] = useState();
  const [filterCategoryName2, setFilterCategoryName2] = useState();
  const [filterCategoryName3, setFilterCategoryName3] = useState();
  const [fullTextSearch, setFullTextSearch] = useState(fullTextSearchURL ?? fullTextSearchURL);

  // dataCategory
  const [dataCategory, setDataCategory] = useState({
    dataCategoryMain: [],
    dataCategory1: [],
    dataCategory2: [],
  });

  // setIdCategory
  const [idCategory, setIdCategory] = useState({
    idCategoryMain: '',
    idCategory1: '',
    idCategory2: '',
  });

  let filterCategoryURL;
  if (filterCategory3 === 'undefined' || filterCategory3 === 'null' || filterCategory3 === null) {
    filterCategoryURL = filterCategory2;
    if (filterCategory2 === 'undefined' || filterCategory2 === 'null' || filterCategory2 === null) {
      filterCategoryURL = filterCategory1;
    } else {
      filterCategoryURL = filterCategory2;
    }
  } else {
    filterCategoryURL = filterCategory3;
  }

  const filterCategory =
    idCategory.idCategory2 || idCategory.idCategory1 || idCategory.idCategoryMain || filterCategoryURL;

  const [paramSExcel, setParamSExcel] = useState({
    page: 0,
    perPage: 0,
    categoryId: filterCategory,
    supplierId: idSupplierChoosed,
    type: '',
  });

  const [headExcelInfo, setHeadExcelInfo] = useState({
    supplierName: filterSupplierName,
    categoryMain: filterCategoryName1,
    category1: filterCategoryName2,
    category2: filterCategoryName3,
  });

  useEffect(() => {
    if (filterDate !== '') {
      handleChange();
    }
  }, [filterDate]);

  const [, setIsLoad] = useState({
    loadingMain: false,
    loading1: false,
  });

  useEffect(() => {
    const initDataCategory = async () => {
      setIsLoad((prev) => ({ ...prev, loadingMain: true }));
      try {
        const res =
          idSupplierChoosed === 'null' || idSupplierChoosed === 'undefined'
            ? await CategoryService.get({})
            : await CategoryService.get({ subOrgId: idSupplierChoosed });
        setDataCategory((prev) => ({ ...prev, dataCategoryMain: res.data }));
        const category = res.find((category) => category?.id === filterCategory1);
        setFilterCategoryName1(category?.name);
      } catch (error) {
        return error;
      } finally {
        setIsLoad((prev) => ({ ...prev, loadingMain: false }));
      }
    };
    initDataCategory();
  }, [idSupplierChoosed]);

  useEffect(() => {
    const initDataCategory = async () => {
      if (
        idCategory.idCategoryMain ||
        (filterCategory1 && filterCategory1 !== 'undefined' && filterCategory1 !== 'null' && filterCategory1 !== null)
      ) {
        setIsLoad((prev) => ({ ...prev, loading1: true }));
        try {
          const res =
            idSupplierChoosed === 'null' || idSupplierChoosed === 'undefined'
              ? await CategoryService.get({ id: idCategory.idCategoryMain || filterCategory1 })
              : await CategoryService.get({
                  id: idCategory.idCategoryMain || filterCategory1,
                  subOrgId: idSupplierChoosed,
                });

          setDataCategory((prev) => ({
            ...prev,
            dataCategory1: res.data,
            // dataCategory2: [],
          }));
        } catch (error) {
          return error;
        } finally {
          setIsLoad((prev) => ({ ...prev, loading1: false }));
        }
      }
    };
    initDataCategory();
  }, [idCategory.idCategoryMain, filterCategory1]);

  useEffect(() => {
    const initDataCategory = async () => {
      if (
        idCategory.idCategory1 ||
        (filterCategory2 && filterCategory2 !== 'undefined' && filterCategory2 !== 'null')
      ) {
        setIsLoad((prev) => ({ ...prev, loading2: true }));
        try {
          const res =
            idSupplierChoosed === 'null' || idSupplierChoosed === 'undefined'
              ? await CategoryService.get({ id: idCategory.idCategory1 || filterCategory2 })
              : await CategoryService.get({
                  id: idCategory.idCategory1 || filterCategory2,
                  subOrgId: idSupplierChoosed,
                });
          setDataCategory((prev) => ({ ...prev, dataCategory2: res.data }));
        } catch (error) {
          return error;
        } finally {
          setIsLoad((prev) => ({ ...prev, loading2: false }));
        }
      }
    };
    setTimeout(() => {
      initDataCategory();
    });
  }, [idCategory.idCategory1, filterCategory2]);

  const handleSelectDate = (date, dateString) => {
    if (!date) {
      setFilterDate('');
      return;
    }
    setFilterDate(moment(date).format('YYYY-MM-DD') + ' 00:00:00');
  };

  useEffect(() => {
    let flag = true;
    const fetchSupplierList = async () => {
      try {
        const res = await StoreService.getListSupplierForFilterProd(
          {
            storeId: idStore,
            type: 'BALANCE',
          },
          'store/all-supplier-store',
        );
        if (flag) setSupplierList(res);
      } catch (error) {
        console.log(error);
      }
    };
    +tabKey === 2 && +keyDropdown === 1 && fetchSupplierList();
    const fetchSupplierList6 = async () => {
      try {
        const res = await StoreService.getListSupplierForFilterProd(
          {
            storeId: idStore,
            type: 'ALL',
          },
          'store/all-supplier-store',
        );
        if (flag) setSupplierList(res);
      } catch (error) {
        console.log(error);
      }
    };
    +tabKey === 6 && fetchSupplierList6();
    return () => {
      flag = false;
    };
  }, []);
  useEffect(() => {
    let flag = true;
    const fetchSupplierListNonBal = async () => {
      try {
        const res = await StoreService.getListSupplierForFilterProd(
          {
            storeId: idStore,
            type: 'NON_BALANCE',
          },
          'store/all-supplier-store',
        );
        if (flag) setSupplierList(res);
      } catch (error) {
        console.log(error);
      }
    };
    +tabKey === 2 && +keyDropdown === 2 && fetchSupplierListNonBal();
    return () => {
      flag = false;
    };
  }, []);

  function navigateWithParams(routeName, params) {
    const navigateParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        navigateParams[key] = value;
      }
    });
    navigate(`${routerLinks(routeName)}?id=${idStore}&tab=${tabKey}&${new URLSearchParams(navigateParams).toString()}`);
  }

  useEffect(() => {
    handleChange();
    tabKey === 2 &&
      navigate(
        `${routerLinks(
          'StoreEdit',
        )}?id=${idStore}&text=${text}&tab=${tabKey}&dropKey=${keyDropdown}&supplierId=${idSupplierChoosed}&categoryId1=${filterCategory1}&categoryId2=${filterCategory2}&categoryId3=${filterCategory3}`,
      );
    (+tabKey === 3 || +tabKey === 4 || +tabKey === 5) &&
      navigateWithParams('StoreEdit', {
        fullTextSearch,
      });
  }, [filterCategory, filterCategory2, filterCategory1, filterCategory3, idSupplierChoosed, fullTextSearch]);

  const formatCur = (value) => {
    if (!value) return 0;
    return value || value === 0 ? value : null;
  };

  const handelExport = async () => {
    const supplierName = supplierList.find((item) => item?.id === idSupplierChoosed);
    const category1 = dataCategory.dataCategoryMain.find((category) => category?.id === filterCategory1);
    const category2 = dataCategory.dataCategory1.find((category) => category?.id === filterCategory2);
    const category3 = dataCategory.dataCategory2.find((category) => category?.id === filterCategory3);
    setFilterCategoryName1(category1?.name);
    setFilterCategoryName2(category2?.name);
    setFilterCategoryName2(category3?.name);
    setFilterSupplierName(supplierName?.name);
    setHeadExcelInfo((prev) => ({
      ...prev,
      categoryMain: category1?.name,
      category1: category2?.name,
      category2: category3?.name,
      currentStatusName: supplierName?.name,
    }));
    setIsLoading(true);
    const res =
      +tabKey === 2 && keyDropdown === 1
        ? await StoreService.getDetailListProduct({
            storeId: idStore,
            type: 'BALANCE',
            categoryId:
              filterCategory === 'undefined' || filterCategory === 'null' || filterCategory === null
                ? ''
                : filterCategory,
            supplierId: idSupplierChoosed,
            ...paramSExcel,
            isGetAll: true,
          })
        : +tabKey === 2 && keyDropdown === 2
        ? await StoreService.getDetailListProduct({
            ...paramSExcel,
            storeId: idStore,
            type: 'NON_BALANCE',
            categoryId:
              filterCategory === 'undefined' || filterCategory === 'null' || filterCategory === null
                ? ''
                : filterCategory,
            supplierId: idSupplierChoosed,
            isGetAll: true,
          })
        : [];
    const data =
      +tabKey === 2 && keyDropdown === 1
        ? res?.data?.map((i) => ({
            index: i?.index, // Số thứ tự
            productCode: i?.code, // Mã sản phẩm
            productName: i?.name, // Tên sản phẩm
            storeBarcode: i?.storeBarcode || i?.supplierBarcode, // Mã vạch
            category: [i?.category?.name, i?.category?.child?.name, i?.category?.child?.child?.name]
              .filter(Boolean)
              .join(' > '), // (Danh mục)
            supplierName: i?.subOrg?.name, // Tên nhà cung cấp
            basicUnit: i?.basicUnit, // Đơn vị tính
            price: i?.price === null ? '' : formatCurrency(formatCur(i?.price), ''), // Giá nhập
            retailPrice: formatCurrency(formatCur(i?.retailPrice), ''), // Giá bán
            type: i?.approveStatus === 'APPROVED' ? 'Đang bán' : 'Ngưng bán', // Trạng thái
            link: i.photos[0]?.url, // Link hình ảnh
          }))
        : res?.data?.map((i) => ({
            index: i?.index, // Số thứ tự
            productCode: i?.code, // Mã sản phẩm
            productName: i?.name, // Tên sản phẩm
            storeBarcode: i?.storeBarcode || i?.supplierBarcode, // Mã vạch
            category: [i?.category?.name, i?.category?.child?.name, i?.category?.child?.child?.name]
              .filter(Boolean)
              .join(' > '), // (Danh mục)
            supplierName: i?.subOrg?.name, // Tên nhà cung cấp
            basicUnit: i?.basicUnit, // Đơn vị tính
            price: i?.price === null ? '' : formatCurrency(formatCur(i?.price), ''), // Giá nhập
            type: i?.approveStatus === 'APPROVED' ? 'Đang bán' : 'Ngưng bán', // Trạng thái
            link: i.photos[0]?.url, // Link hình ảnh
          }));

    const Heading =
      +tabKey === 2 && keyDropdown === 1
        ? [
            [
              'STT',
              'Mã sản phẩm',
              'Tên sản phẩm',
              'Mã vạch',
              'Danh mục',
              'Nhà cung cấp',
              'Đơn vị tính',
              'Giá nhập',
              'Giá bán',
              'Trạng thái',
              'Link hình ảnh',
            ],
          ]
        : [
            [
              'STT',
              'Mã sản phẩm',
              'Tên sản phẩm',
              'Mã vạch',
              'Danh mục',
              'Nhà cung cấp',
              'Đơn vị tính',
              'Giá nhập',
              'Trạng thái',
              'Link hình ảnh',
            ],
          ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.sheet_add_aoa(wb, Heading, {
      origin: 'A7',
    });

    +tabKey === 2 &&
      keyDropdown === 1 &&
      XLSX.utils.sheet_add_aoa(ws, [['DANH SÁCH HÀNG HÓA BALANCE']], { origin: 'D1' });
    +tabKey === 2 &&
      keyDropdown === 2 &&
      XLSX.utils.sheet_add_aoa(ws, [['DANH SÁCH HÀNG HÓA NON-BALANCE']], { origin: 'D1' });
    XLSX.utils.sheet_add_aoa(
      ws,
      [['Chọn nhà cung cấp:', headExcelInfo.supplierName || filterSupplierName || supplierName?.name]],
      { origin: 'A3' },
    );
    XLSX.utils.sheet_add_aoa(
      ws,
      [['Danh mục chính:', headExcelInfo.categoryMain || filterCategoryName1 || category1?.name]],
      { origin: 'A5' },
    );
    XLSX.utils.sheet_add_aoa(
      ws,
      [['Danh mục cấp 1:', headExcelInfo.category1 || filterCategoryName2 || category2?.name]],
      { origin: 'D5' },
    );
    XLSX.utils.sheet_add_aoa(
      ws,
      [['Danh mục cấp 2:', headExcelInfo.category2 || filterCategoryName3 || category3?.name]],
      { origin: 'G5' },
    );
    XLSX.utils.sheet_add_json(wb, data, { origin: 'A8', skipHeader: true, skipcolumn: 1 });

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    +tabKey === 2 && keyDropdown === 1 && XLSX.writeFile(wb, `Danh sách hàng hóa Balance.xlsx`);
    +tabKey === 2 && keyDropdown === 2 && XLSX.writeFile(wb, `Danh sách hàng hóa Non-Balance.xlsx`);
    setIsLoading(false);
  };

  const [handleChange, DataTab] = HookDataTable({
    onRow:
      +tabKey === 2 && +keyDropdown === 1
        ? (data) => ({
            onDoubleClick: (event) => navigate(routerLinks('ProductDetail') + `?id=${data.id}&view=VIEWSTORE`),
          })
        : +tabKey === 2 && +keyDropdown === 2
        ? (data) => ({
            onDoubleClick: (event) =>
              navigate(routerLinks('ProductDetail') + `?id=${data.id}&type=NON_BALANCE&view=VIEWSTORE`),
          })
        : +tabKey === 3
        ? (data) => ({
            onDoubleClick: (event) => navigate(routerLinks('BranchEdit') + `?id=${data.id}&page=branch`),
          })
        : +tabKey === 4 && +keyDropdown === 1
        ? (data) => ({
            onDoubleClick: (event) =>
              navigate(routerLinks('SupplierEdit') + `?idStore=${idStore}&id=${data.id}&site=inBalAd`),
          })
        : +tabKey === 4 && +keyDropdown === 2
        ? (data) => ({
            onDoubleClick: (event) =>
              navigate(routerLinks('SupplierEdit') + `?idStore=${idStore}&id=${data.id}&site=NonBal&view=ad`),
          })
        : +tabKey === 5 && +keyDropdown === 2
        ? (data) => ({
            onDoubleClick: async (event) => await handleDetail(data),
          })
        : '',
    isLoading,
    setIsLoading,
    save: false,
    sort: 'sort',
    loadFirst: false,
    showSearch: false,
    // showSearch:
    //   (+tabKey === 2 && +keyDropdown === 1) || (+tabKey === 2 && +keyDropdown === 2) || +tabKey === 6
    //     ? !!false
    //     : !!true,
    leftHeader: (
      <>
        {+tabKey === 2 && keyDropdown === 1 ? (
          <div className="sm:hidden block">
            <button
              disabled={dataExcel?.length === 0}
              onClick={() => handelExport(dataExcel)}
              className={
                'btn-excel text-teal-900 w-36 h-10 justify-center rounded-[10px] inline-flex items-center bg-white border border-teal-900 sm:mt-0 mt-2'
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none">
                <path d="M19 12C18.7348 12 18.4804 12.1054 18.2929 12.2929C18.1054 12.4804 18 12.7348 18 13V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V13C2 12.7348 1.89464 12.4804 1.70711 12.2929C1.51957 12.1054 1.26522 12 1 12C0.734784 12 0.48043 12.1054 0.292893 12.2929C0.105357 12.4804 0 12.7348 0 13V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H17C17.7956 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7956 20 17V13C20 12.7348 19.8946 12.4804 19.7071 12.2929C19.5196 12.1054 19.2652 12 19 12ZM9.29 13.71C9.3851 13.801 9.49725 13.8724 9.62 13.92C9.7397 13.9729 9.86913 14.0002 10 14.0002C10.1309 14.0002 10.2603 13.9729 10.38 13.92C10.5028 13.8724 10.6149 13.801 10.71 13.71L14.71 9.71C14.8983 9.5217 15.0041 9.2663 15.0041 9C15.0041 8.7337 14.8983 8.4783 14.71 8.29C14.5217 8.1017 14.2663 7.99591 14 7.99591C13.7337 7.99591 13.4783 8.1017 13.29 8.29L11 10.59V1C11 0.734784 10.8946 0.48043 10.7071 0.292893C10.5196 0.105357 10.2652 0 10 0C9.73478 0 9.48043 0.105357 9.29289 0.292893C9.10536 0.48043 9 0.734784 9 1V10.59L6.71 8.29C6.61676 8.19676 6.50607 8.1228 6.38425 8.07234C6.26243 8.02188 6.13186 7.99591 6 7.99591C5.86814 7.99591 5.73757 8.02188 5.61575 8.07234C5.49393 8.1228 5.38324 8.19676 5.29 8.29C5.19676 8.38324 5.1228 8.49393 5.07234 8.61575C5.02188 8.73757 4.99591 8.86814 4.99591 9C4.99591 9.13186 5.02188 9.26243 5.07234 9.38425C5.1228 9.50607 5.19676 9.61676 5.29 9.71L9.29 13.71Z" />
              </svg>
              <span className="pl-2">Xuất file excel</span>
            </button>
          </div>
        ) : +tabKey === 2 && keyDropdown === 2 ? (
          <div className="sm:hidden block">
            <button
              disabled={dataExcel?.length === 0}
              onClick={() => handelExport(dataExcel)}
              className={
                'btn-excel text-teal-900 w-36 h-10 justify-center rounded-[10px] inline-flex items-center bg-white border border-teal-900 sm:mt-0 mt-2'
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none">
                <path d="M19 12C18.7348 12 18.4804 12.1054 18.2929 12.2929C18.1054 12.4804 18 12.7348 18 13V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V13C2 12.7348 1.89464 12.4804 1.70711 12.2929C1.51957 12.1054 1.26522 12 1 12C0.734784 12 0.48043 12.1054 0.292893 12.2929C0.105357 12.4804 0 12.7348 0 13V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H17C17.7956 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7956 20 17V13C20 12.7348 19.8946 12.4804 19.7071 12.2929C19.5196 12.1054 19.2652 12 19 12ZM9.29 13.71C9.3851 13.801 9.49725 13.8724 9.62 13.92C9.7397 13.9729 9.86913 14.0002 10 14.0002C10.1309 14.0002 10.2603 13.9729 10.38 13.92C10.5028 13.8724 10.6149 13.801 10.71 13.71L14.71 9.71C14.8983 9.5217 15.0041 9.2663 15.0041 9C15.0041 8.7337 14.8983 8.4783 14.71 8.29C14.5217 8.1017 14.2663 7.99591 14 7.99591C13.7337 7.99591 13.4783 8.1017 13.29 8.29L11 10.59V1C11 0.734784 10.8946 0.48043 10.7071 0.292893C10.5196 0.105357 10.2652 0 10 0C9.73478 0 9.48043 0.105357 9.29289 0.292893C9.10536 0.48043 9 0.734784 9 1V10.59L6.71 8.29C6.61676 8.19676 6.50607 8.1228 6.38425 8.07234C6.26243 8.02188 6.13186 7.99591 6 7.99591C5.86814 7.99591 5.73757 8.02188 5.61575 8.07234C5.49393 8.1228 5.38324 8.19676 5.29 8.29C5.19676 8.38324 5.1228 8.49393 5.07234 8.61575C5.02188 8.73757 4.99591 8.86814 4.99591 9C4.99591 9.13186 5.02188 9.26243 5.07234 9.38425C5.1228 9.50607 5.19676 9.61676 5.29 9.71L9.29 13.71Z" />
              </svg>
              <span className="pl-2">Xuất file excel</span>
            </button>
          </div>
        ) : (
          ''
        )}
        {+tabKey === 2 && (
          <Select
            showSearch
            allowClear
            placeholder="Chọn nhà cung cấp"
            optionFilterProp="children"
            className="w-full lg:w-[300px] text-left hidden sm:block"
            onChange={(value, options) => {
              setIdCategory((prev) => ({
                ...prev,
                idCategoryMain: undefined,
                idCategory1: undefined,
                idCategory2: undefined,
              }));
              setDataCategory((prev) => ({ ...prev, dataCategoryMain: [], dataCategory1: [], dataCategory2: [] }));
              form.setFieldsValue({ categoryMain: undefined, category1: undefined, category2: undefined });
              setFilterCategory1(undefined);
              setFilterCategory2(undefined);
              setFilterCategory3(undefined);
              setIdSupplierChoosed(value);
              setHeadExcelInfo((prev) => ({
                ...prev,
                supplierName: options?.label,
              }));
              setFilterSupplierName(options?.label);
            }}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={supplierList.map((i) => ({ value: i.id, label: i.name }))}
            defaultValue={
              idSupplierChoosed && idSupplierChoosed !== 'null' && idSupplierChoosed !== 'undefined'
                ? { value: idSupplierChoosed, label: filterSupplierName }
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
        )}
        {(+tabKey === 3 || +tabKey === 4 || +tabKey === 5) && (
          <div className="relative lg:mb-6 w-full sm:w-[245px]">
            <div className="search-container search-product manager_order">
              <Search
                placeholder="Tìm kiếm"
                allowClear
                onChange={(e) => {
                  setFullTextSearch(e.target.value);
                  clearTimeout(timeout.current);
                }}
                defaultValue={fullTextSearch}
                style={{
                  width: 322,
                }}
              />
            </div>
            <i className="text-[18px] las la-search absolute top-3 left-5 sm:z-10 -rotate-90" />
          </div>
        )}

        {+tabKey === 6 && (
          <Select
            showSearch
            allowClear
            placeholder="Chọn nhà cung cấp"
            optionFilterProp="children"
            className="w-full lg:w-[300px] text-left"
            onChange={(value, options) => {
              setIdCategory((prev) => ({
                ...prev,
                idCategoryMain: undefined,
                idCategory1: undefined,
                idCategory2: undefined,
              }));
              setDataCategory((prev) => ({ ...prev, dataCategoryMain: [], dataCategory1: [], dataCategory2: [] }));
              form.setFieldsValue({ categoryMain: undefined, category1: undefined, category2: undefined });
              setFilterCategory1(undefined);
              setFilterCategory2(undefined);
              setFilterCategory3(undefined);
              setIdSupplierChoosed(value);
              setHeadExcelInfo((prev) => ({
                ...prev,
                supplierName: options?.label,
              }));
            }}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={supplierList.map((i) => ({ value: i.id, label: i.name }))}
          >
            {supplierList.map((item, index) => {
              return (
                <Option key={index} value={item?.id} title={item?.name}>
                  {item?.name}
                </Option>
              );
            })}
          </Select>
        )}
      </>
    ),
    Get: async (params) => {
      const filterParams = params.filter;
      const { filter, sorts, ...restParams } = params;
      const res =
        +tabKey === 2 && keyDropdown === 1
          ? await StoreService.getDetailListProduct({
              ...restParams,
              storeId: idStore || filterStoreId,
              type: 'BALANCE',
              ...filterParams,
              categoryId:
                filterCategory === 'undefined' || filterCategory === 'null' || filterCategory === null
                  ? ''
                  : filterCategory,
              supplierId:
                idSupplierChoosed === 'undefined' || idSupplierChoosed === 'null' || idSupplierChoosed === null
                  ? ''
                  : idSupplierChoosed,
            })
          : +tabKey === 2 && keyDropdown === 2
          ? await StoreService.getDetailListProduct({
              ...restParams,
              storeId: idStore,
              type: 'NON_BALANCE',
              ...filterParams,
              categoryId:
                filterCategory === 'undefined' || filterCategory === 'null' || filterCategory === null
                  ? ''
                  : filterCategory,
              supplierId:
                idSupplierChoosed === 'undefined' || idSupplierChoosed === 'null' || idSupplierChoosed === null
                  ? ''
                  : idSupplierChoosed,
            })
          : +tabKey === 3
          ? await StoreService.getListBrandBal({
              ...params,
              fullTextSearch,
              storeId: idStore,
              supplierType: 'BALANCE',
            })
          : +tabKey === 4 && keyDropdown === 1
          ? await StoreService.getDetailListConnectSupplier(
              {
                ...params,
                fullTextSearch,
                idSuppiler: idStore,
              },
              idStore,
            )
          : +tabKey === 4 && keyDropdown === 2
          ? await StoreService.getListSupplierNotInBal({
              ...params,
              fullTextSearch,
              storeId: idStore,
              supplierType: 'NON_BALANCE',
            })
          : +tabKey === 5 && keyDropdown === 1
          ? await StoreService.getListRevenueByProduct({
              ...restParams,
              fullTextSearch,
              idStore,
              ...filterParams,
              categoryId: filterCategory,
            })
          : +tabKey === 5 && keyDropdown === 2
          ? filterDate === ''
            ? StoreService.getListRevenueByOrder({ ...params, idStore, fullTextSearch })
            : StoreService.getListRevenueByOrder({ ...params, fullTextSearch, idStore, filter: { date: filterDate } })
          : +tabKey === 6
          ? await StoreService.getListInventoryManagement({
              ...params,
              idStore,
              categoryId:
                filterCategory === 'undefined' || filterCategory === 'null' || filterCategory === null
                  ? ''
                  : filterCategory,
              supplierId:
                idSupplierChoosed === 'undefined' || idSupplierChoosed === 'null' || idSupplierChoosed === null
                  ? ''
                  : idSupplierChoosed,
            })
          : null;
      setParamSExcel((prev) => ({
        ...prev,
        page: 1,
        perPage: params?.page * params?.perPage,
        ...restParams,
        type: 'BALANCE',
        ...filterParams,
        categoryId: filterCategory,
        supplierId: idSupplierChoosed,
      }));
      setDataExcel(res?.data);
      return res;
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription:
      +tabKey === 4
        ? (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} nhà cung cấp`
        : +tabKey === 4 && +keyDropdown === 2
        ? (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`
        : (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} sản phẩm`,
    columns:
      +tabKey === 2 && +keyDropdown === 1
        ? ColumnStoreListProductTable({
            handleShow: async () => {
              handleChange();
            },
            roleCode,
          })
        : +tabKey === 2 && +keyDropdown === 2
        ? ColumnStoreListProductTable({
            handleShow: async () => {
              handleChange();
            },
            roleCode,
            type: 'NonBal',
          })
        : +tabKey === 3
        ? ColumnBrandManagement({
            handleShow: async () => {
              handleChange();
            },
            roleCode,
          })
        : +tabKey === 4
        ? ColumnSupplierListInNNotInBal({
            handleShow: async () => {
              handleChange();
            },
            roleCode,
          })
        : +tabKey === 5 && +keyDropdown === 1
        ? ColumnStoreRevenueByProductTable({
            handleShow: async () => {
              handleChange();
            },
            roleCode,
          })
        : +tabKey === 5 && +keyDropdown === 2
        ? ColumnStoreRevenueByOrderTable({
            handleShow: async () => {
              handleChange();
            },
            roleCode,
          })
        : +tabKey === 6
        ? ColumnStoreInventoryManagementTable({
            handleShow: async () => {
              handleChange();
            },
            roleCode,
          })
        : null,
    rightHeader: (
      <Fragment>
        {+tabKey === 5 && +keyDropdown === 2 ? (
          <div className="relative">
            <div className="flex gap-4 items-center justify-end">
              <Space direction="vertical" className="flex items-center gap-2">
                <p>Ngày bán</p>{' '}
                <DatePicker
                  onChange={handleSelectDate}
                  format="DD/MM/YYYY"
                  disabledDate={(current) => {
                    return current && current.valueOf() > Date.now();
                  }}
                />
              </Space>
            </div>
          </div>
        ) : +tabKey === 6 ? (
          <div className="relative">
            <button
              className="w-[106px] cursor-pointer h-10 text-center bg-teal-900 text-white rounded-[10px] hover:bg-teal-700"
              onClick={async () => {
                await StoreService.asyncWithKioViet(idStore);
                await handleChange();
              }}
            >
              Đồng bộ
            </button>
          </div>
        ) : +tabKey === 3 ? (
          <div className="relative">
            {data.storeId === null && (
              <button
                className="w-[153px] h-[36px] bg-teal-900 text-white rounded-xl"
                onClick={() => {
                  navigate(`${routerLinks('BranchCreate')}` + `?id=${idStore}&page=branch`);
                }}
              >
                <i className="las la-plus mr-1 bold"></i>
                Thêm chi nhánh
              </button>
            )}
          </div>
        ) : +tabKey === 2 && keyDropdown === 1 ? (
          <div className="hidden sm:block">
            <button
              disabled={dataExcel?.length === 0}
              onClick={() => handelExport(dataExcel)}
              className={
                'btn-excel text-teal-900 w-36 h-10 justify-center rounded-[10px] inline-flex items-center bg-white border border-teal-900 sm:mt-0 mt-2'
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none">
                <path d="M19 12C18.7348 12 18.4804 12.1054 18.2929 12.2929C18.1054 12.4804 18 12.7348 18 13V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V13C2 12.7348 1.89464 12.4804 1.70711 12.2929C1.51957 12.1054 1.26522 12 1 12C0.734784 12 0.48043 12.1054 0.292893 12.2929C0.105357 12.4804 0 12.7348 0 13V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H17C17.7956 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7956 20 17V13C20 12.7348 19.8946 12.4804 19.7071 12.2929C19.5196 12.1054 19.2652 12 19 12ZM9.29 13.71C9.3851 13.801 9.49725 13.8724 9.62 13.92C9.7397 13.9729 9.86913 14.0002 10 14.0002C10.1309 14.0002 10.2603 13.9729 10.38 13.92C10.5028 13.8724 10.6149 13.801 10.71 13.71L14.71 9.71C14.8983 9.5217 15.0041 9.2663 15.0041 9C15.0041 8.7337 14.8983 8.4783 14.71 8.29C14.5217 8.1017 14.2663 7.99591 14 7.99591C13.7337 7.99591 13.4783 8.1017 13.29 8.29L11 10.59V1C11 0.734784 10.8946 0.48043 10.7071 0.292893C10.5196 0.105357 10.2652 0 10 0C9.73478 0 9.48043 0.105357 9.29289 0.292893C9.10536 0.48043 9 0.734784 9 1V10.59L6.71 8.29C6.61676 8.19676 6.50607 8.1228 6.38425 8.07234C6.26243 8.02188 6.13186 7.99591 6 7.99591C5.86814 7.99591 5.73757 8.02188 5.61575 8.07234C5.49393 8.1228 5.38324 8.19676 5.29 8.29C5.19676 8.38324 5.1228 8.49393 5.07234 8.61575C5.02188 8.73757 4.99591 8.86814 4.99591 9C4.99591 9.13186 5.02188 9.26243 5.07234 9.38425C5.1228 9.50607 5.19676 9.61676 5.29 9.71L9.29 13.71Z" />
              </svg>
              <span className="pl-2">Xuất file excel</span>
            </button>
          </div>
        ) : +tabKey === 2 && keyDropdown === 2 ? (
          <div className="hidden sm:block">
            <button
              disabled={dataExcel?.length === 0}
              onClick={() => handelExport(dataExcel)}
              className={
                'btn-excel text-teal-900 w-36 h-10 justify-center rounded-[10px] inline-flex items-center bg-white border border-teal-900 sm:mt-0 mt-2'
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none">
                <path d="M19 12C18.7348 12 18.4804 12.1054 18.2929 12.2929C18.1054 12.4804 18 12.7348 18 13V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V13C2 12.7348 1.89464 12.4804 1.70711 12.2929C1.51957 12.1054 1.26522 12 1 12C0.734784 12 0.48043 12.1054 0.292893 12.2929C0.105357 12.4804 0 12.7348 0 13V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H17C17.7956 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7956 20 17V13C20 12.7348 19.8946 12.4804 19.7071 12.2929C19.5196 12.1054 19.2652 12 19 12ZM9.29 13.71C9.3851 13.801 9.49725 13.8724 9.62 13.92C9.7397 13.9729 9.86913 14.0002 10 14.0002C10.1309 14.0002 10.2603 13.9729 10.38 13.92C10.5028 13.8724 10.6149 13.801 10.71 13.71L14.71 9.71C14.8983 9.5217 15.0041 9.2663 15.0041 9C15.0041 8.7337 14.8983 8.4783 14.71 8.29C14.5217 8.1017 14.2663 7.99591 14 7.99591C13.7337 7.99591 13.4783 8.1017 13.29 8.29L11 10.59V1C11 0.734784 10.8946 0.48043 10.7071 0.292893C10.5196 0.105357 10.2652 0 10 0C9.73478 0 9.48043 0.105357 9.29289 0.292893C9.10536 0.48043 9 0.734784 9 1V10.59L6.71 8.29C6.61676 8.19676 6.50607 8.1228 6.38425 8.07234C6.26243 8.02188 6.13186 7.99591 6 7.99591C5.86814 7.99591 5.73757 8.02188 5.61575 8.07234C5.49393 8.1228 5.38324 8.19676 5.29 8.29C5.19676 8.38324 5.1228 8.49393 5.07234 8.61575C5.02188 8.73757 4.99591 8.86814 4.99591 9C4.99591 9.13186 5.02188 9.26243 5.07234 9.38425C5.1228 9.50607 5.19676 9.61676 5.29 9.71L9.29 13.71Z" />
              </svg>
              <span className="pl-2">Xuất file excel</span>
            </button>
          </div>
        ) : (
          ''
        )}
        {+tabKey === 2 && (
          <Select
            showSearch
            allowClear
            placeholder="Chọn nhà cung cấp"
            optionFilterProp="children"
            className="w-full lg:w-[300px] text-left sm:hidden block mt-5"
            onChange={(value, options) => {
              setIdCategory((prev) => ({
                ...prev,
                idCategoryMain: undefined,
                idCategory1: undefined,
                idCategory2: undefined,
              }));
              tabKey === 2 &&
                navigate(
                  `${routerLinks('StoreEdit')}?id=${idStore}&tab=${tabKey}&dropKey=${keyDropdown}&supplierId=${value}`,
                );
              setDataCategory((prev) => ({ ...prev, dataCategoryMain: [], dataCategory1: [], dataCategory2: [] }));
              form.setFieldsValue({ categoryMain: undefined, category1: undefined, category2: undefined });
              setFilterCategory1(undefined);
              setFilterCategory2(undefined);
              setFilterCategory3(undefined);
              setIdSupplierChoosed(value);
              setHeadExcelInfo((prev) => ({
                ...prev,
                supplierName: options?.label,
              }));
            }}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={supplierList.map((i) => ({ value: i.id, label: i.name }))}
            defaultValue={
              idSupplierChoosed && idSupplierChoosed !== 'null' && idSupplierChoosed !== 'undefined'
                ? { value: idSupplierChoosed, label: filterSupplierName }
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
        )}
      </Fragment>
    ),
    subHeader: (data) =>
      (+tabKey === 2 && +keyDropdown === 1) ||
      (+tabKey === 2 && +keyDropdown === 2) ||
      (+tabKey === 5 && +keyDropdown === 1) ||
      +tabKey === 6 ? (
        <Form form={form} className="min-w-min mt-5 sm:mt-0">
          <div className="grid-cols-1 grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-4 mt-4 mb-4 ">
            <Form.Item name="categoryMain" label="">
              {console.log()}
              <Select
                allowClear
                showSearch
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
                  setFilterCategoryName1(options?.label);
                  setFilterCategory1(value);
                  setFilterCategory2(undefined);
                  setFilterCategory3(undefined);
                  tabKey === 2 &&
                    navigate(
                      `${routerLinks(
                        'StoreEdit',
                      )}?id=${idStore}&tab=${tabKey}&dropKey=${keyDropdown}&supplierId=${idSupplierChoosed}&categoryId1=${value}`,
                    );
                }}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={dataCategory.dataCategoryMain.map((i) => ({ value: i.id, label: i.name }))}
                value={
                  filterCategory1 && filterCategory1 !== 'null' && filterCategory1 !== 'undefined'
                    ? { value: filterCategory1, label: filterCategoryName1 }
                    : null
                }
              />
            </Form.Item>
            <Form.Item name="category1" label="">
              {console.log()}
              <Select
                disabled={dataCategory?.dataCategory1.length === 0}
                allowClear
                showSearch
                placeholder="Danh mục cấp 1"
                optionFilterProp="children"
                className="w-full text-left select-category"
                onChange={(value, options) => {
                  setIdCategory((prev) => ({ ...prev, idCategory1: value, idCategory2: undefined }));
                  setDataCategory((prev) => ({ ...prev, dataCategory2: [] }));
                  form.setFieldsValue({ category2: undefined });
                  setHeadExcelInfo((prev) => ({ ...prev, category1: options?.label }));
                  setFilterCategoryName2(options?.label);
                  setFilterCategory2(value);
                  setFilterCategory3(undefined);
                  tabKey === 2 &&
                    navigate(
                      `${routerLinks(
                        'StoreEdit',
                      )}?id=${idStore}&tab=${tabKey}&dropKey=${keyDropdown}&supplierId=${idSupplierChoosed}&categoryId1=${filterCategory1}&categoryId2=${value}`,
                    );
                }}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={dataCategory.dataCategory1.map((i) => ({ value: i.id, label: i.name }))}
                value={
                  filterCategory2 && filterCategory2 !== 'null' && filterCategory2 !== 'undefined'
                    ? { value: filterCategory2, label: filterCategoryName2 }
                    : null
                }
              />
            </Form.Item>

            <Form.Item name="category2" label="">
              {console.log()}
              <Select
                disabled={dataCategory?.dataCategory2.length === 0}
                allowClear
                showSearch
                placeholder="Danh mục cấp 2"
                optionFilterProp="children"
                className="w-full text-left select-category"
                onChange={(value, options) => {
                  setIdCategory((prev) => ({ ...prev, idCategory2: value }));
                  setHeadExcelInfo((prev) => ({ ...prev, category2: options?.label }));
                  setFilterCategoryName3(options?.label);
                  setFilterCategory3(value);
                  tabKey === 2 &&
                    navigate(
                      `${routerLinks(
                        'StoreEdit',
                      )}?id=${idStore}&tab=${tabKey}&dropKey=${keyDropdown}&supplierId=${idSupplierChoosed}&categoryId1=${filterCategory1}&categoryId2=${filterCategory2}&categoryId3=${value}`,
                    );
                }}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={dataCategory.dataCategory2.map((i) => ({ value: i.id, label: i.name }))}
                value={
                  filterCategory3 && filterCategory3 !== 'null' && filterCategory3 !== 'undefined'
                    ? { value: filterCategory3, label: filterCategoryName3 }
                    : null
                }
              />
            </Form.Item>
          </div>
        </Form>
      ) : null,
  });
  const [handleDetail, ModalHandleDetail] = HookModal({
    className: 'productStoreDetail',
    title: (data) => (
      <>
        <p className="text-xl text-teal-900 font-semibold">Thông tin chi tiết đơn hàng</p>
      </>
    ),
    wrapClassName: 'customDetail',
    isLoading,
    setIsLoading,
    GetById: async (id) => {
      return StoreService.getDetailRevenueByOrder(id);
    },
    handleChange: async () => await handleDetail(),
    widthModal: 830,
    idElement: 'productStoreDetail',
    textCancel: 'Trở về',
    onOk: async (data) => {},
    footerCustom: (handleOk, handleCancel) => (
      <div className="flex sm:justify-start justify-center items-center buttonGroup mb-[33px] ml-[9px]">
        <button
          type={'button'}
          className="px-2 bg-white-500 border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-xl text-teal-900 hover:text-teal-600 mt-1 sm:w-[120px] w-[60%]"
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
      title: 'Giá trị (VND)',
      dataIndex: 'totalItem',
      key: 'totalItem',
      render: (value) => formatCurrency(value, ' '),
    },
    {
      title: 'Khuyến mãi (VND)',
      dataIndex: 'discount',
      key: 'discount',
      render: (value) => formatCurrency(value, ' '),
    },
    {
      title: 'Thành tiền (VND)',
      dataIndex: 'total',
      key: 'total',
      render: (value) => formatCurrency(value, ' '),
    },
  ];

  return (
    <>
      {DataTab()}{' '}
      {ModalHandleDetail((_data) => {
        return (
          <>
            <p className="text-xl text-teal-900 font-bold text-[18px] mb-4">Thông tin chi tiết đơn hàng</p>
            <div className="sm:flex items-center">
              <div className="w-full flex flex-row mb-5 items-center">
                <div className="font-bold order mr-2 text-base text-teal-900 sm:w-[180px]">Mã đơn hàng:</div>
                <div className="text-[16px] text-gray-600 font-normal">{_data?.invoiceCode}</div>
              </div>
              <div className="w-full flex flex-row mb-5 items-center">
                <div className="font-bold text-base text-teal-900 sm:w-[180px]">Ngày bán:</div>
                <div className="text-[16px] text-gray-600 font-normal">{_data?.completedDate}</div>
              </div>
            </div>
            <div className="sm:flex items-center">
              <div className="w-full flex mb-5 items-center">
                <div className="font-bold order mr-2 text-base text-teal-900 sm:w-[180px]">Giá trị đơn hàng: </div>
                <div className="text-[16px] text-gray-600 font-normal">
                  {formatCurrency(Number(_data?.totalPayment) + Number(_data?.discount), ' VND')}
                </div>
              </div>
              <div className="w-full flex mb-5 items-center">
                <div className="font-bold order mr-2 text-base text-teal-900 sm:w-[180px]">Khuyến mãi: </div>
                <div className="text-[16px] text-gray-600 font-normal">{formatCurrency(_data?.discount, ' VND')}</div>
              </div>
            </div>
            <div className="w-full flex mb-5 items-center">
              <div className="font-bold order mr-2 text-base text-teal-900 sm:w-[180px]">Thành tiền: </div>
              <div className="text-[16px] text-gray-600 font-normal">{formatCurrency(_data?.totalPayment, ' VND')}</div>
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
    </>
  );
};

export default TabData;
