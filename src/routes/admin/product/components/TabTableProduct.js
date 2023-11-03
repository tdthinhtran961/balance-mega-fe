import {
  ColumnProductApprovalTable,
  ColumnProductStoreTableInBal,
  ColumnProductStoreTableNonBal,
  ColumnProductTable,
} from 'columns/product';
import { useAuth } from 'global';
import { HookDataTable } from 'hooks';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { ProductService } from 'services/product';
import { routerLinks, formatCurrency } from 'utils';
import { Select, Form } from 'antd';
import { CategoryService } from 'services/category';
import { approveStatus } from 'constants/index';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import * as XLSX from 'xlsx';
const { Option } = Select;
const TabData = ({ tabKey }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [dataExcel, setDataExcel] = useState([]);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;

  const [dataCategory, setDataCategory] = useState({
    dataCategoryMain: [],
    dataCategory1: [],
    dataCategory2: [],
  });

  console.log();

  const storeId = user?.userInfor?.subOrgId;
  const urlSearch = new URLSearchParams(location.search);
  const filterSupplierURL = urlSearch.get('supplierId');
  const filterapproveStatusURL = urlSearch.get('approveStatus');
  const filterCategory1URL = urlSearch.get('categoryId1');
  const filterCategory2URL = urlSearch.get('categoryId2');
  const filterCategory3URL = urlSearch.get('categoryId3');
  const [supplierList, setSupplierList] = useState([]);
  const [idSupplierChoosed, setIdSupplierChoosed] = useState(
    (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') ? storeId : filterSupplierURL ?? filterSupplierURL,
  );
  const [filterSupplierName, setFilterSupplierName] = useState();
  const [filterCategory1, setFilterCategory1] = useState(filterCategory1URL ?? filterCategory1URL);
  const [filterCategory2, setFilterCategory2] = useState(filterCategory2URL ?? filterCategory2URL);
  const [filterCategory3, setFilterCategory3] = useState(filterCategory3URL ?? filterCategory3URL);
  const [filterCategoryName1, setFilterCategoryName1] = useState();
  const [filterCategoryName2, setFilterCategoryName2] = useState();
  const [filterCategoryName3, setFilterCategoryName3] = useState();

  const listStatus = useRef(Object.values(approveStatus));
  const [currentStatus, setCurrentStatus] = useState(filterapproveStatusURL ?? listStatus.current[1]);
  const [currentStatusName, setCurrentStatusName] = useState();

  // setIdCategory
  const [idCategory, setIdCategory] = useState({
    idCategoryMain: '',
    idCategory1: '',
    idCategory2: '',
  });

  const [, setIsLoad] = useState({
    loadingMain: false,
    loading1: false,
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
    storeId,
  });

  const [headExcelInfo, setHeadExcelInfo] = useState({
    supplierName: filterSupplierName,
    currentStatusName,
    categoryMain: filterCategoryName1,
    category1: filterCategoryName2,
    category2: filterCategoryName3,
  });

  useEffect(() => {
    let flag = true;
    const fetchSupplierList = async () => {
      try {
        const res = await ProductService.getListSupplierForFilterProd(
          {
            storeId,
            type: 'BALANCE',
          },
          roleCode,
        );
        if (flag) setSupplierList(res);
      } catch (error) {
        console.log(error);
      }
    };
    ((roleCode === 'ADMIN' && +tabKey === 1) ||
      (roleCode === 'ADMIN' && +tabKey === 2) ||
      ((roleCode === 'OWNER_STORE' ) && +tabKey === 1)) &&
      fetchSupplierList();
    return () => {
      flag = false;
    };
  }, []);

  useEffect(() => {
    let flag = true;
    const fetchSupplierListWaitingApproved = async () => {
      try {
        const res = await ProductService.getListSupplierWaitingApproved();
        if (flag) setSupplierList(res);
      } catch (error) {
        console.log(error);
      }
    };
    roleCode === 'ADMIN' && +tabKey === 2 && fetchSupplierListWaitingApproved();
    return () => {
      flag = false;
    };
  }, []);

  useEffect(() => {
    let flag = true;
    const fetchSupplierListNonBal = async () => {
      try {
        const res = await ProductService.getListSupplierForFilterProd(
          {
            storeId,
            type: 'NON_BALANCE',
          },
          roleCode,
        );
        if (flag) setSupplierList(res);
      } catch (error) {
        console.log(error);
      }
    };
    (roleCode === 'OWNER_STORE' ) && +tabKey === 2 && fetchSupplierListNonBal();
    return () => {
      flag = false;
    };
  }, []);

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
    console.log();
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
          setDataCategory((prev) => ({
            ...prev,
            dataCategory2: res?.data,
          }));
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

  function navigateWithParams(routeName, params) {
    const navigateParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        navigateParams[key] = value;
      }
    });
    navigate(`${routerLinks(routeName)}?tab=${tabKey}&${new URLSearchParams(navigateParams).toString()}`);
  }

  useEffect(() => {
    handleChange();
    navigateWithParams('Product', {
      supplierId: idSupplierChoosed,
      approveStatus: currentStatus,
      categoryId1: filterCategory1,
      categoryId2: filterCategory2,
      categoryId3: filterCategory3,
    });
  }, [filterCategory, idSupplierChoosed, currentStatus, filterCategory2, filterCategory1, filterCategory3]);

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
    setFilterCategoryName3(category3?.name);
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
      (+tabKey === 1 && (roleCode === 'OWNER_STORE' )) ||
      (+tabKey === 1 && roleCode === 'ADMIN')
        ? await ProductService.get({
            ...paramSExcel,
            type: 'BALANCE',
            categoryId:
              filterCategory === 'undefined' || filterCategory === 'null' || filterCategory === null
                ? ''
                : filterCategory,
            supplierId:
              idSupplierChoosed === 'undefined' || idSupplierChoosed === 'null' || idSupplierChoosed === null
                ? ''
                : idSupplierChoosed,

            storeId,
            isGetAll: true,
          })
        : +tabKey === 2 && (roleCode === 'OWNER_STORE' )
        ? await ProductService.get({
            ...paramSExcel,
            type: 'NON_BALANCE',
            categoryId: filterCategory,
            supplierId: idSupplierChoosed,
            storeId,
            isGetAll: true,
          })
        : +tabKey === 1 && roleCode !== 'OWNER_STORE'
        ? await ProductService.get({
            ...paramSExcel,
            type: 'BALANCE',
            categoryId:
              filterCategory === 'undefined' || filterCategory === 'null' || filterCategory === null
                ? ''
                : filterCategory,
            supplierId:
              idSupplierChoosed === 'undefined' || idSupplierChoosed === 'null' || idSupplierChoosed === null
                ? ''
                : idSupplierChoosed,

            storeId,
            isGetAll: true,
          })
        : [];
    const data =
      +tabKey === 1 && (roleCode === 'OWNER_STORE' )
        ? res.data?.map((i) => ({
            index: i?.index, // Số thứ tự
            productCode: i?.code, // Mã sản phẩm
            productName: i?.name, // Tên sản phẩm
            storeBarcode: i?.storeBarcode || i?.supplierBarcode, // Mã vạch
            category: [i?.category?.name, i?.category?.child?.name, i?.category?.child?.child?.name]
              .filter(Boolean)
              .join(' > '),
            supplierName: i?.supplierName || i?.supplierNameStore, // Tên nhà cung cấp
            basicUnit: i?.basicUnit, // Đơn vị tính
            price: i?.price ? formatCurrency(formatCur(i?.price), '') : null, // Giá nhập
            retailPrice: i?.retailPrice ? formatCurrency(formatCur(i?.retailPrice), '') : null, // Giá bán
            type: i?.approveStatus === 'APPROVED' ? 'Đang bán' : 'Ngưng bán', // Trạng thái
            link: i.photos[0]?.url, // Link hình ảnh
          }))
        : +tabKey === 2 && (roleCode === 'OWNER_STORE' )
        ? res.data?.map((i) => ({
            index: i?.index, // Số thứ tự
            productCode: i?.code, // Mã sản phẩm
            productName: i?.name, // Tên sản phẩm
            storeBarcode: i?.storeBarcode || i?.supplierBarcode, // Mã vạch
            category: [i?.category?.name, i?.category?.child?.name, i?.category?.child?.child?.name]
              .filter(Boolean)
              .join(' > '),
            supplierName: i?.supplierName || i?.supplierNameStore, // Tên nhà cung cấp
            basicUnit: i?.basicUnit, // Đơn vị tính
            price: i?.price ? formatCurrency(formatCur(i?.price), '') : null, // Giá nhập
            sellingPrice: i?.sellingPrice ? formatCurrency(formatCur(i?.sellingPrice), '') : null, // Giá bán
            type: i?.approveStatus === 'APPROVED' ? 'Đang bán' : 'Ngưng bán', // Trạng thái
            link: i.photos[0]?.url, // Link hình ảnh
          }))
        : +tabKey === 1 && roleCode !== 'OWNER_STORE'
        ? res.data?.map((i) => ({
            index: i?.index, // Số thứ tự
            productCode: i?.code, // Mã sản phẩm
            productName: i?.name, // Tên sản phẩm
            storeBarcode: i?.barcode, // Mã vạch
            category: [i?.category?.name, i?.category?.child?.name, i?.category?.child?.child?.name]
              .filter(Boolean)
              .join(' > '),
            basicUnit: i?.basicUnit, // Đơn vị tính
            retailPrice: formatCurrency(formatCur(i?.retailPrice), ''), // Giá bán
            type: i?.approveStatus === 'APPROVED' ? 'Đang bán' : 'Ngưng bán', // Trạng thái
            link: i.photos[0]?.url, // Link hình ảnh
          }))
        : [];

    const Heading =
      +tabKey === 1 && (roleCode === 'OWNER_STORE' )
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
        : +tabKey === 2 && (roleCode === 'OWNER_STORE' )
        ? [
            [
              'STT',
              'Mã sản phẩm',
              'Tên sản phẩm',
              'Mã vạch',
              'Danh mục',
              'Nhà cung cấp',
              'Đơn vị tính',
              'Giá nhập',
              'Giá bán',
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
              'Đơn vị tính',
              'Giá bán',
              'Trạng thái',
              'Link hình ảnh',
            ],
          ];

    const wb = XLSX.utils.book_new();
    // Heading
    const ws = XLSX.utils.sheet_add_aoa(wb, Heading, {
      origin: 'A7',
    });

    // title
    +tabKey === 1 &&
      (roleCode === 'OWNER_STORE' ) &&
      XLSX.utils.sheet_add_aoa(ws, [['DANH SÁCH SẢN PHẨM BALANCE']], { origin: 'D1' });

    +tabKey === 2 &&
      (roleCode === 'OWNER_STORE' ) &&
      XLSX.utils.sheet_add_aoa(ws, [['DANH SÁCH SẢN PHẨM NON-BALANCE']], { origin: 'D1' });

    +tabKey === 1 &&
      roleCode !== 'OWNER_STORE' &&
      XLSX.utils.sheet_add_aoa(ws, [['DANH SÁCH SẢN PHẨM']], { origin: 'D1' });

    // supplierName ADMIN && OWNER_STORE
    (roleCode === 'ADMIN' || roleCode === 'OWNER_STORE' ) &&
      XLSX.utils.sheet_add_aoa(
        ws,
        [['Chọn nhà cung cấp:', headExcelInfo.supplierName || filterSupplierName || supplierName?.name]],
        { origin: 'A3' },
      );
    XLSX.utils.sheet_add_json(wb, data, { origin: 'A8', skipHeader: true, skipcolumn: 1 });

    roleCode === 'ADMIN' &&
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            'Trạng thái:',
            headExcelInfo.currentStatusName || currentStatusName || t(`constants.approveStatus.${currentStatus}`),
          ],
        ],
        {
          origin: 'D3',
        },
      );

    // OWNER_SUPPLIER
    (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') &&
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            'Trạng thái:',
            headExcelInfo.currentStatusName || currentStatusName || t(`constants.approveStatus.${currentStatus}`),
          ],
        ],
        {
          origin: 'A3',
        },
      );
    XLSX.utils.sheet_add_aoa(
      ws,
      [['Danh mục chính:', headExcelInfo.categoryMain || filterCategoryName1 || category1?.name]],
      {
        origin: 'A5',
      },
    );
    XLSX.utils.sheet_add_aoa(
      ws,
      [['Danh mục cấp 1:', headExcelInfo.category1 || filterCategoryName2 || category2?.name]],
      {
        origin: 'D5',
      },
    );
    XLSX.utils.sheet_add_aoa(
      ws,
      [['Danh mục cấp 2:', headExcelInfo.category2 || filterCategoryName3 || category3?.name]],
      {
        origin: 'G5',
      },
    );

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    +tabKey === 1 &&
      (roleCode === 'OWNER_STORE' ) &&
      XLSX.writeFile(wb, `Danh sách sản phẩm Balance.xlsx`);
    +tabKey === 2 &&
      (roleCode === 'OWNER_STORE' ) &&
      XLSX.writeFile(wb, `Danh sách sản phẩm Non-Balance.xlsx`);
    +tabKey === 1 &&
      roleCode !== 'OWNER_STORE' &&
      XLSX.writeFile(wb, `Danh sách sản phẩm.xlsx`);
    setIsLoading(false);
  };

  const [handleChange, DataTab] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: () =>
        +tabKey === 2 && (roleCode === 'OWNER_STORE' )
          ? navigate(routerLinks('ProductDetail') + `?id=${data.id}&type=NON_BALANCE`)
          : navigate(routerLinks('ProductDetail') + `?id=${data.id}`),
    }),
    save: false,
    isLoading,
    setIsLoading,
    sort: 'sort',
    showSearch: false,
    leftHeader: (
      <>
        <div className="block sm:hidden">
          {(+tabKey === 2 && (roleCode === 'OWNER_STORE' )) ||
            (+tabKey === 1 && (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && (
              <div className="flex xl:justify-end gap-4 lg:gap-4 xl:mt-0 sm:mt-4 mt-0 flex-col md:flex-row">
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
                <button
                  className={
                    'hover:text-white text-teal-900 w-36 h-10 justify-center rounded-[10px] inline-flex items-center hover:bg-teal-900 bg-white border border-teal-900'
                  }
                  onClick={() => navigate(`${routerLinks('ProductImport')}?step=1`)}
                  id="importBtn"
                >
                  {'Nhập từ file excel'}
                </button>
                <button
                  className={
                    'text-white w-36 h-10 justify-center rounded-xl inline-flex items-center bg-teal-900 hover:bg-teal-700'
                  }
                  onClick={() => navigate(`${routerLinks('ProductCreate')}?step=1&type=NON_BALANCE`)}
                  id="storeAddBtn"
                >
                  <i className="las la-plus mr-1 bold"></i>
                  {' Thêm mới'}
                </button>
              </div>
            ))}
          {+tabKey === 1 && (roleCode === 'OWNER_STORE' || roleCode === 'ADMIN' ) && (
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
          )}
        </div>
        <div className="flex xl:justify-end justify-start gap-4 lg:gap-4 flex-col md:flex-row mt-5 md:mt-0">
          {roleCode === 'ADMIN' || roleCode === 'OWNER_STORE'  ? (
            <Select
              showSearch
              allowClear
              placeholder="Chọn nhà cung cấp"
              optionFilterProp="children"
              className={classNames('hidden sm:block w-full lg:w-[300px] text-left', {
                'sm:w-[300px]': +tabKey === 2 && (roleCode === 'OWNER_STORE' ),
              })}
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
              options={supplierList.map((i, index) => ({ value: i.id, label: i.name, key: index }))}
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
          ) : null}
          {+tabKey === 1 && (roleCode === 'ADMIN' || roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') ? (
            <Select
              showSearch
              allowClear
              placeholder="Trạng thái"
              optionFilterProp="children"
              className={classNames('sm:block w-full sm:w-[218px] text-left')}
              onChange={(value, options) => {
                setCurrentStatus(value);
                setCurrentStatusName(options?.title);
                setHeadExcelInfo((prev) => ({
                  ...prev,
                  currentStatusName: options?.title,
                }));
              }}
              filterOption={(input, option) => (option?.label ?? 'ALL').toLowerCase().includes(input.toLowerCase())}
              defaultValue={
                currentStatus && currentStatus !== 'null' && currentStatus !== 'undefined'
                  ? { value: currentStatus, label: currentStatusName }
                  : null
              }
            >
              {listStatus.current.map((item, index) => {
                return (
                  <Option key={index} value={item} title={t(`constants.approveStatus.${item}`)}>
                    {t(`constants.approveStatus.${item}`)}
                  </Option>
                );
              })}
            </Select>
          ) : null}
        </div>
      </>
    ),
    Get: async (params) => {
      const filterParams = params.filter;
      const { filter, sorts, ...restParams } = params;
      const res =
        +tabKey === 1 && roleCode !== 'OWNER_STORE'
          ? await ProductService.get({
              ...restParams,
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
              storeId,
              approveStatus: currentStatus ?? listStatus.current[0],
            })
          : +tabKey === 2 && roleCode !== 'OWNER_STORE'
          ? await ProductService.getProductApproval({
              ...restParams,
              ...filterParams,
              type: 'BALANCE',
              categoryId:
                filterCategory === 'undefined' || filterCategory === 'null' || filterCategory === null
                  ? ''
                  : filterCategory,
              supplierId:
                idSupplierChoosed === 'undefined' || idSupplierChoosed === 'null' || idSupplierChoosed === null
                  ? ''
                  : idSupplierChoosed,
              storeId,
            })
          : +tabKey === 1 && (roleCode === 'OWNER_STORE' )
          ? await ProductService.get({
              ...restParams,
              type: 'BALANCE',
              ...filterParams,
              categoryId: filterCategory,
              supplierId: idSupplierChoosed,
              storeId,
            })
          : +tabKey === 2 && (roleCode === 'OWNER_STORE' )
          ? await ProductService.get({
              ...restParams,
              type: 'NON_BALANCE',
              ...filterParams,
              categoryId: filterCategory,
              supplierId:
                idSupplierChoosed === 'undefined' || idSupplierChoosed === 'null' || idSupplierChoosed === null
                  ? ''
                  : idSupplierChoosed,
              storeId,
            })
          : null;
      setParamSExcel((prev) => ({
        ...prev,
        page: 1,
        perPage: params?.page * params?.perPage,
        ...restParams,
        type: 'BALANCE',
        ...filterParams,
        categoryId:
          filterCategory === 'undefined' || filterCategory === 'null' || filterCategory === null ? '' : filterCategory,
        supplierId: idSupplierChoosed,
        storeId,
        approveStatus: currentStatus ?? listStatus.current[0],
      }));
      setDataExcel(res?.data);
      return res;
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} sản phẩm`,
    columns:
      +tabKey === 1 && roleCode !== 'OWNER_STORE'
        ? ColumnProductTable({ roleCode })
        : +tabKey === 2 && roleCode !== 'OWNER_STORE'
        ? ColumnProductApprovalTable({ roleCode })
        : +tabKey === 1 && (roleCode === 'OWNER_STORE' )
        ? ColumnProductStoreTableInBal()
        : +tabKey === 2 && (roleCode === 'OWNER_STORE' )
        ? ColumnProductStoreTableNonBal()
        : null,
    rightHeader: (
      <Fragment>
        {+tabKey === 1 && (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') ? (
          <div className="hidden sm:flex flex xl:justify-end justify-start gap-4 lg:gap-4 flex-col md:flex-row">
            <button
              disabled={dataExcel?.length === 0}
              onClick={() => handelExport(dataExcel)}
              className={
                'btn-excel text-teal-900 w-40 h-10 justify-center rounded-[10px] inline-flex items-center bg-white border border-teal-900 sm:mt-0 mt-2'
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none">
                <path d="M19 12C18.7348 12 18.4804 12.1054 18.2929 12.2929C18.1054 12.4804 18 12.7348 18 13V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V13C2 12.7348 1.89464 12.4804 1.70711 12.2929C1.51957 12.1054 1.26522 12 1 12C0.734784 12 0.48043 12.1054 0.292893 12.2929C0.105357 12.4804 0 12.7348 0 13V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H17C17.7956 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7956 20 17V13C20 12.7348 19.8946 12.4804 19.7071 12.2929C19.5196 12.1054 19.2652 12 19 12ZM9.29 13.71C9.3851 13.801 9.49725 13.8724 9.62 13.92C9.7397 13.9729 9.86913 14.0002 10 14.0002C10.1309 14.0002 10.2603 13.9729 10.38 13.92C10.5028 13.8724 10.6149 13.801 10.71 13.71L14.71 9.71C14.8983 9.5217 15.0041 9.2663 15.0041 9C15.0041 8.7337 14.8983 8.4783 14.71 8.29C14.5217 8.1017 14.2663 7.99591 14 7.99591C13.7337 7.99591 13.4783 8.1017 13.29 8.29L11 10.59V1C11 0.734784 10.8946 0.48043 10.7071 0.292893C10.5196 0.105357 10.2652 0 10 0C9.73478 0 9.48043 0.105357 9.29289 0.292893C9.10536 0.48043 9 0.734784 9 1V10.59L6.71 8.29C6.61676 8.19676 6.50607 8.1228 6.38425 8.07234C6.26243 8.02188 6.13186 7.99591 6 7.99591C5.86814 7.99591 5.73757 8.02188 5.61575 8.07234C5.49393 8.1228 5.38324 8.19676 5.29 8.29C5.19676 8.38324 5.1228 8.49393 5.07234 8.61575C5.02188 8.73757 4.99591 8.86814 4.99591 9C4.99591 9.13186 5.02188 9.26243 5.07234 9.38425C5.1228 9.50607 5.19676 9.61676 5.29 9.71L9.29 13.71Z" />
              </svg>
              <span className="pl-2">Xuất file excel</span>
            </button>
            <button
              className={
                'hover:text-white text-teal-900 w-40 h-10 justify-center rounded-[10px] inline-flex items-center hover:bg-teal-900 bg-white border border-teal-900'
              }
              onClick={() => navigate(`${routerLinks('ProductImport')}?step=1`)}
              id="importBtn"
            >
              {'Nhập từ file excel'}
            </button>
            <button
              className={
                ' text-white w-40 h-10 justify-center rounded-[10px] inline-flex items-center bg-teal-900 hover:bg-teal-700'
              }
              onClick={() => navigate(`${routerLinks('ProductCreate')}?step=1`)}
              id="addBtn"
            >
              <i className="las la-plus mr-1 bold"></i>
              {' Thêm sản phẩm'}
            </button>
          </div>
        ) : +tabKey === 2 && (roleCode === 'OWNER_STORE' ) ? (
          <div className="sm:block hidden">
            <div className="flex xl:justify-end gap-4 lg:gap-4 xl:mt-0 sm:mt-4 mt-0 flex-col md:flex-row">
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
              <button
                className={
                  'hover:text-white text-teal-900 w-36 h-10 justify-center rounded-[10px] inline-flex items-center hover:bg-teal-900 bg-white border border-teal-900'
                }
                onClick={() => navigate(`${routerLinks('ProductImport')}?step=1`)}
                id="importBtn"
              >
                {'Nhập từ file excel'}
              </button>
              <button
                className={
                  'text-white w-36 h-10 justify-center rounded-xl inline-flex items-center bg-teal-900 hover:bg-teal-700'
                }
                onClick={() => navigate(`${routerLinks('ProductCreate')}?step=1&type=NON_BALANCE`)}
                id="storeAddBtn"
              >
                <i className="las la-plus mr-1 bold"></i>
                {' Thêm mới'}
              </button>
            </div>
          </div>
        ) : (+tabKey === 1 && (roleCode === 'OWNER_STORE' )) ||
          (+tabKey === 1 && roleCode === 'ADMIN') ? (
          <div className="sm:block hidden">
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
        ) : null}
        {roleCode === 'ADMIN' || roleCode === 'OWNER_STORE'  ? (
          <Select
            showSearch
            allowClear
            placeholder="Chọn nhà cung cấp"
            optionFilterProp="children"
            className={classNames('w-full lg:w-[300px] text-left block sm:hidden mt-5', {
              'sm:w-[300px]': +tabKey === 2 && (roleCode === 'OWNER_STORE' ),
            })}
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
            options={supplierList.map((i, index) => ({ value: i.id, label: i.name, key: index }))}
          >
            {supplierList.map((item, index) => {
              return (
                <Option key={index} value={item?.id} title={item?.name}>
                  {item?.name}
                </Option>
              );
            })}
          </Select>
        ) : null}
      </Fragment>
    ),
    loadFirst: false,
    subHeader: (data) => {
      return (
        <Form form={form} className="min-w-min mt-5 sm:mt-0">
          <div className="grid-cols-1 grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-4 lg:my-4 md:my-0 my-4 ">
            <Form.Item name="categoryMain" label="">
              {console.log()}
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
                  setFilterCategoryName1(options?.label);
                  setFilterCategory1(value);
                  setFilterCategory2(undefined);
                  setFilterCategory3(undefined);
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
                  setFilterCategoryName2(options?.label);
                  setFilterCategory2(value);
                  setFilterCategory3(undefined);
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
                disabled={dataCategory?.dataCategory2.length === 0 && filterCategory3URL === null}
                showSearch
                allowClear
                placeholder="Danh mục cấp 2"
                optionFilterProp="children"
                className="w-full text-left select-category"
                onChange={(value, options) => {
                  setIdCategory((prev) => ({ ...prev, idCategory2: value }));
                  setHeadExcelInfo((prev) => ({ ...prev, category2: options?.label }));
                  setFilterCategoryName3(options?.label);
                  setFilterCategory3(value);
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
      );
    },
  });

  return (
    <div
      className={classNames({
        tableProduct: +tabKey === 2 && (roleCode === 'OWNER_STORE' ),
        tableProductSupplier: +tabKey === 1 && (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR'),
      })}
    >
      {DataTab()}
    </div>
  );
};

export default TabData;
