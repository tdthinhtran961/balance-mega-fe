import { ColumnGoodList } from 'columns/supplier';
import { HookDataTable } from 'hooks';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { SupplierService } from 'services/supplier';
import { routerLinks } from 'utils';
import { Form, Select } from 'antd';
import { CategoryService } from 'services/category';
import { Spin } from 'components';
import { approveStatus } from 'constants/index';
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';
const { Option } = Select;
const GoodList = ({ tabKey }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const urlSearch = new URLSearchParams(location.search);
  const idSupplier = urlSearch.get('id');
  const filterapproveStatusURL = urlSearch.get('approveStatus');
  const filterCategory1URL = urlSearch.get('categoryId1');
  const filterCategory2URL = urlSearch.get('categoryId2');
  const filterCategory3URL = urlSearch.get('categoryId3');

  const [filterCategory1, setFilterCategory1] = useState(filterCategory1URL ?? filterCategory1URL);
  const [filterCategory2, setFilterCategory2] = useState(filterCategory2URL ?? filterCategory2URL);
  const [filterCategory3, setFilterCategory3] = useState(filterCategory3URL ?? filterCategory3URL);
  const [filterCategoryName1, setFilterCategoryName1] = useState();
  const [filterCategoryName2, setFilterCategoryName2] = useState();
  const [filterCategoryName3, setFilterCategoryName3] = useState();
  const listStatus = useRef(Object.values(approveStatus));
  const [currentStatus, setCurrentStatus] = useState(filterapproveStatusURL ?? listStatus.current[1]);
  const [currentStatusName, setCurrentStatusName] = useState();
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
  const [dataExcel, setDataExcel] = useState([]);
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
    supplierId: idSupplier,
    type: '',
  });

  const [headExcelInfo, setHeadExcelInfo] = useState({
    currentStatusName,
    categoryMain: filterCategoryName1,
    category1: filterCategoryName2,
    category2: filterCategoryName3,
  });

  useEffect(() => {
    const initDataCategory = async () => {
      setIsLoad((prev) => ({ ...prev, loadingMain: true }));
      try {
        const res =
          idSupplier === 'null' || idSupplier === 'undefined'
            ? await CategoryService.get({})
            : await CategoryService.get({ subOrgId: idSupplier });
        setDataCategory(() => ({ dataCategoryMain: res.data, dataCategory1: [], dataCategory2: [] }));
        const category = res.find((category) => category?.id === filterCategory1);
        setFilterCategoryName1(category?.name);
      } catch (error) {
        return error;
      } finally {
        setIsLoad((prev) => ({ ...prev, loadingMain: false }));
      }
    };
    initDataCategory();
  }, []);

  useEffect(() => {
    const initDataCategory = async () => {
      if (
        idCategory.idCategoryMain ||
        (filterCategory1 && filterCategory1 !== 'undefined' && filterCategory1 !== 'null' && filterCategory1 !== null)
      ) {
        setIsLoad((prev) => ({ ...prev, loading1: true }));
        try {
          const res =
            idSupplier === 'null' || idSupplier === 'undefined'
              ? await CategoryService.get({ id: idCategory.idCategoryMain || filterCategory1 })
              : await CategoryService.get({ id: idCategory.idCategoryMain || filterCategory1, subOrgId: idSupplier });
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
            idSupplier === 'null' || idSupplier === 'undefined'
              ? await CategoryService.get({ id: idCategory.idCategory1 || filterCategory2 })
              : await CategoryService.get({ id: idCategory.idCategory1 || filterCategory2, subOrgId: idSupplier });
          setDataCategory((prev) => ({ ...prev, dataCategory2: res.data }));
        } catch (error) {
          return error;
        } finally {
          setIsLoad((prev) => ({ ...prev, loading2: false }));
        }
      }
    };
    initDataCategory();
  }, [idCategory.idCategory1, filterCategory2]);

  function navigateWithParams(routeName, params) {
    const navigateParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        navigateParams[key] = value;
      }
    });
    navigate(
      `${routerLinks(routeName)}?id=${idSupplier}&tab=${tabKey}&${new URLSearchParams(navigateParams).toString()}`,
    );
  }

  useEffect(() => {
    handleTableGoodsChange();
    navigateWithParams('SupplierEdit', {
      approveStatus: currentStatus,
      categoryId1: filterCategory1,
      categoryId2: filterCategory2,
      categoryId3: filterCategory3,
    });
  }, [filterCategory, currentStatus, filterCategory2, filterCategory1, filterCategory3]);

  const handelExport = async () => {
    const category1 = dataCategory.dataCategoryMain.find((category) => category?.id === filterCategory1);
    const category2 = dataCategory.dataCategory1.find((category) => category?.id === filterCategory2);
    const category3 = dataCategory.dataCategory2.find((category) => category?.id === filterCategory3);
    setFilterCategoryName1(category1?.name);
    setFilterCategoryName2(category2?.name);
    setFilterCategoryName2(category3?.name);
    setLoading(true);
    const res = await SupplierService.getGoodsList({
      ...paramSExcel,
      supplierId: idSupplier,
      type: 'BALANCE',
      categoryId: filterCategory,
      isGetAll: true,
    });

    const data = res.data?.map((i) => ({
      index: i?.index, // Số thứ tự
      productCode: i?.code, // Mã sản phẩm
      productName: i?.name, // Tên sản phẩm
      storeBarcode: i?.barcode, // Mã vạch
      categoryName: [i?.categoryName?.name, i?.categoryName?.child?.name, i?.categoryName?.child?.child?.name]
        .filter(Boolean)
        .join(' > '),
      basicUnit: i?.basicUnit, // Đơn vị tính
      retailPrice: i?.retailPrice, // Giá bán
      type: i?.status === 'APPROVED' ? 'Đang bán' : 'Ngưng bán', // Trạng thái
      link: i.photos[0]?.url, // Link hình ảnh
    }));

    const Heading = [
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
      origin: 'A5',
    });

    // title
    XLSX.utils.sheet_add_aoa(ws, [['DANH SÁCH HÀNG HÓA']], { origin: 'D1' });
    XLSX.utils.sheet_add_aoa(ws, [['Danh mục chính:', headExcelInfo.categoryMain || filterCategoryName1 || category1?.name]], { origin: 'A3' });
    XLSX.utils.sheet_add_aoa(ws, [['Danh mục cấp 1:', headExcelInfo.category1 || filterCategoryName2 || category2?.name]], { origin: 'D3' });
    XLSX.utils.sheet_add_aoa(ws, [['Danh mục cấp 2:', headExcelInfo.category2 || filterCategoryName3 || category3?.name]], { origin: 'G3' });
    XLSX.utils.sheet_add_aoa(ws, [['Trạng thái:', headExcelInfo.currentStatusName || currentStatusName || t(`constants.approveStatus.${currentStatus}`)]], { origin: 'J3' });
    XLSX.utils.sheet_add_json(wb, data, { origin: 'A6', skipHeader: true, skipcolumn: 1 });

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Danh sách hàng hóa.xlsx`);
    setLoading(false);
  };
  const [handleTableGoodsChange, DataGoodsList] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) =>
        navigate(routerLinks('MechandiseManagementDetail') + `?id=${data.id}` + `&idSupplier=${idSupplier}`),
    }),
    loading,
    save: false,
    sort: 'sort',
    showSearch: false,
    loadFirst: false,
    leftHeader: <div></div>,
    setLoading,
    Get: async (params) => {
      const filterParams = params.filter;
      const { filter, sorts, ...restParams } = params;
      const res = await SupplierService.getGoodsList({
        ...restParams,
        supplierId: idSupplier,
        type: 'BALANCE',
        ...filterParams,
        categoryId:
          filterCategory === 'undefined' || filterCategory === 'null' || filterCategory === null ? '' : filterCategory,
        approveStatus: currentStatus ?? listStatus.current[0],
      });
      setParamSExcel((prev) => ({
        ...prev,
        page: 1,
        perPage: params?.page * params?.perPage,
        ...restParams,
        supplierId: idSupplier,
        type: 'BALANCE',
        ...filterParams,
        categoryId:
          filterCategory === 'undefined' || filterCategory === 'null' || filterCategory === null ? '' : filterCategory,
      }));
      setDataExcel(res?.data);
      return res;
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} sản phẩm`,
    columns: ColumnGoodList({
      handleShow: async (id) => {
        (await SupplierService.getProductById(id)) && handleTableGoodsChange();
      },
    }),
    subHeader: (data) => (
      <div className="block lg:flex flex-row justify-between">
        <div className="block lg:hidden">
          <button
            disabled={dataExcel?.length === 0}
            onClick={() => handelExport(dataExcel)}
            className={
              'lg:mb-0 mb-4 btn-excel text-teal-900 w-36 h-10 justify-center rounded-[10px] inline-flex items-center bg-white border border-teal-900 sm:mt-0 mt-2'
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none">
              <path d="M19 12C18.7348 12 18.4804 12.1054 18.2929 12.2929C18.1054 12.4804 18 12.7348 18 13V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V13C2 12.7348 1.89464 12.4804 1.70711 12.2929C1.51957 12.1054 1.26522 12 1 12C0.734784 12 0.48043 12.1054 0.292893 12.2929C0.105357 12.4804 0 12.7348 0 13V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H17C17.7956 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7956 20 17V13C20 12.7348 19.8946 12.4804 19.7071 12.2929C19.5196 12.1054 19.2652 12 19 12ZM9.29 13.71C9.3851 13.801 9.49725 13.8724 9.62 13.92C9.7397 13.9729 9.86913 14.0002 10 14.0002C10.1309 14.0002 10.2603 13.9729 10.38 13.92C10.5028 13.8724 10.6149 13.801 10.71 13.71L14.71 9.71C14.8983 9.5217 15.0041 9.2663 15.0041 9C15.0041 8.7337 14.8983 8.4783 14.71 8.29C14.5217 8.1017 14.2663 7.99591 14 7.99591C13.7337 7.99591 13.4783 8.1017 13.29 8.29L11 10.59V1C11 0.734784 10.8946 0.48043 10.7071 0.292893C10.5196 0.105357 10.2652 0 10 0C9.73478 0 9.48043 0.105357 9.29289 0.292893C9.10536 0.48043 9 0.734784 9 1V10.59L6.71 8.29C6.61676 8.19676 6.50607 8.1228 6.38425 8.07234C6.26243 8.02188 6.13186 7.99591 6 7.99591C5.86814 7.99591 5.73757 8.02188 5.61575 8.07234C5.49393 8.1228 5.38324 8.19676 5.29 8.29C5.19676 8.38324 5.1228 8.49393 5.07234 8.61575C5.02188 8.73757 4.99591 8.86814 4.99591 9C4.99591 9.13186 5.02188 9.26243 5.07234 9.38425C5.1228 9.50607 5.19676 9.61676 5.29 9.71L9.29 13.71Z" />
            </svg>
            <span className="pl-2">Xuất file excel</span>
          </button>
        </div>
        <Form form={form} className="min-w-min">
          <div className="grid-cols-1 grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
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
                disabled={dataCategory?.dataCategory1.length === 0 && filterCategory2URL === null}
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
            <Form.Item name="approveStatus" label="">
              <Select
                showSearch
                allowClear
                placeholder="Trạng thái"
                optionFilterProp="children"
                className="w-full md:w-[218px] text-left"
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
            </Form.Item>
          </div>
        </Form>
        <div className="lg:block hidden">
          <button
            disabled={dataExcel?.length === 0}
            onClick={() => handelExport(dataExcel)}
            className={
              'lg:mb-0 mb-4 btn-excel text-teal-900 w-36 h-10 justify-center rounded-[10px] inline-flex items-center bg-white border border-teal-900 sm:mt-0 mt-2'
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none">
              <path d="M19 12C18.7348 12 18.4804 12.1054 18.2929 12.2929C18.1054 12.4804 18 12.7348 18 13V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V13C2 12.7348 1.89464 12.4804 1.70711 12.2929C1.51957 12.1054 1.26522 12 1 12C0.734784 12 0.48043 12.1054 0.292893 12.2929C0.105357 12.4804 0 12.7348 0 13V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H17C17.7956 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7956 20 17V13C20 12.7348 19.8946 12.4804 19.7071 12.2929C19.5196 12.1054 19.2652 12 19 12ZM9.29 13.71C9.3851 13.801 9.49725 13.8724 9.62 13.92C9.7397 13.9729 9.86913 14.0002 10 14.0002C10.1309 14.0002 10.2603 13.9729 10.38 13.92C10.5028 13.8724 10.6149 13.801 10.71 13.71L14.71 9.71C14.8983 9.5217 15.0041 9.2663 15.0041 9C15.0041 8.7337 14.8983 8.4783 14.71 8.29C14.5217 8.1017 14.2663 7.99591 14 7.99591C13.7337 7.99591 13.4783 8.1017 13.29 8.29L11 10.59V1C11 0.734784 10.8946 0.48043 10.7071 0.292893C10.5196 0.105357 10.2652 0 10 0C9.73478 0 9.48043 0.105357 9.29289 0.292893C9.10536 0.48043 9 0.734784 9 1V10.59L6.71 8.29C6.61676 8.19676 6.50607 8.1228 6.38425 8.07234C6.26243 8.02188 6.13186 7.99591 6 7.99591C5.86814 7.99591 5.73757 8.02188 5.61575 8.07234C5.49393 8.1228 5.38324 8.19676 5.29 8.29C5.19676 8.38324 5.1228 8.49393 5.07234 8.61575C5.02188 8.73757 4.99591 8.86814 4.99591 9C4.99591 9.13186 5.02188 9.26243 5.07234 9.38425C5.1228 9.50607 5.19676 9.61676 5.29 9.71L9.29 13.71Z" />
            </svg>
            <span className="pl-2">Xuất file excel</span>
          </button>
        </div>
      </div>
    ),
  });
  return <Spin spinning={loading}>{DataGoodsList()}</Spin>;
};

export default GoodList;
