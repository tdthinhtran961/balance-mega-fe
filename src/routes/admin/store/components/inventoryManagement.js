import React, { useState, Fragment, useEffect } from 'react';
import { StoreService } from 'services/store';
import '../index.less';
// import classNames from 'classnames';
// import { useNavigate } from 'react-router';
// import { routerLinks } from 'utils';
import { ColumnStoreInventoryManagementTable } from 'columns/store';
import { useAuth } from 'global';
import { HookDataTable } from 'hooks';
import { Select, Form } from 'antd';
import { CategoryService } from 'services/category';

const { Option } = Select;
const Page = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  // const [double, setDouble] = useState(false);
  // const navigate = useNavigate();
  const { user } = useAuth();
  const subOrgId = user?.userInfor?.subOrgId;

  const [unitChange, setUnitChange] = useState([]);
  const [idx, setIdx] = useState(null);
  const [name, setName] = useState(null);
  const [data, setData] = useState([]);
  const [, setIsLoad] = useState({
    loadingMain: false,
    loading1: false,
  });
  const [idSupplierChoosed, setIdSupplierChoosed] = useState();
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

  useEffect(() => {
    const initDataCategory = async () => {
      setIsLoad((prev) => ({ ...prev, loadingMain: true }));
      try {
        const res = (idSupplierChoosed === 'null' || idSupplierChoosed === 'undefined')
          ? await CategoryService.get({})
          : await CategoryService.get({ subOrgId: idSupplierChoosed })
        setDataCategory((prev) => ({ ...prev, dataCategoryMain: res.data }));
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
      if (idCategory.idCategoryMain) {
        setIsLoad((prev) => ({ ...prev, loading1: true }));
        try {
          const res = (idSupplierChoosed === 'null' || idSupplierChoosed === 'undefined')
            ? await CategoryService.get({ id: idCategory.idCategoryMain })
            : await CategoryService.get({ id: idCategory.idCategoryMain, subOrgId: idSupplierChoosed })
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
          const res = (idSupplierChoosed === 'null' || idSupplierChoosed === 'undefined')
            ? await CategoryService.get({ id: idCategory.idCategory1 })
            : await CategoryService.get({ id: idCategory.idCategory1, subOrgId: idSupplierChoosed })
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

  const [supplierList, setSupplierList] = useState([]);
  const storeId = user?.userInfor?.subOrgId;

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

  // const hanldeCaculate = (total, valueChage, index) => {
  //   // return (total / valueChage).toFixed(2);
  //   return total / valueChage ? total / valueChage.toLocaleString('vi-VN') : total / valueChage;
  // };

  const [handleChange, DataInventoryManagement] = HookDataTable({
    isLoading,
    setIsLoading,
    className: 'data-table data-inventory-management-table',
    save: false,
    Get: async (params) => {
      const filterParams = params.filter;
      const { filter, sorts, ...restParams } = params;
      const res = await StoreService.getListInventoryManagement({
        ...restParams,
        idStore: subOrgId,
        ...filterParams,
        categoryId: filterCategory,
        supplierId: idSupplierChoosed,
      });
      const newData = res?.data.map(item => ({
        ...item,
        inventoryProductUnit: item.inventoryProductUnit
                              .sort((a, b) => +a.conversionValue - +b.conversionValue)
                              .map(unit => ({
                                ...unit,
                                isDefault: unit.productCode === item.productCode,
                              })),
      }));
      setData(newData);
      const listIndex = newData.map(item => item.inventoryProductUnit.findIndex(e => e.isDefault));
      setUnitChange(listIndex);
      return res;
    },
    sort: 'sort',
    showSearch: false,
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} sản phẩm`,
    columns: ColumnStoreInventoryManagementTable({
      unitChange,
      setUnitChange,
      // hanldeCaculate,
      setIdx,
      idx,
      name,
      setName,
      data,
    }),
    rightHeader: (
      <div className="relative flex items-center gap-4 flex-col sm:flex-row">
        {/* <Select
          className="w-full sm:w-[245px] rounded-[10px]"
          placeholder="Cửa hàng chính"
          optionFilterProp="children"
          // value={filterStore}
          allowClear
          onChange={(event) => {
            // setFilterStore(event);
            // setFilterSupplier();
            // setSupplierList([]);
          }}
          showSearch
          filterOption={(input, option) => {
            return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          }}
        >
          {mainStoreList &&
            mainStoreList.map((item, index) => {
              return (
                <Option key={index} value={item?.id} title={item?.name}>
                  {item?.name}
                </Option>
              );
            })}
        </Select> */}

        {/* <button
          disabled={double}
          className={classNames(
            'sm:w-[173px] h-[44px] w-[50%] cursor-pointer text-center bg-teal-900 text-white rounded-[10px] hover:bg-teal-700 flex items-center justify-center gap-[10px]',
            {
              'opacity-25': double,
            },
          )}
          onClick={async () => {
            setDouble(true);
            setIsLoading(true);
            await StoreService.asyncWithKioViet(subOrgId);
            await handleChange();
            setDouble(false);
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 0C3.44336 0 1.30859 1.58008 0.4375 3.8125L1.35938 4.1875C2.08789 2.32031 3.85547 1 6 1C7.62109 1 9.06641 1.79492 9.96875 3H8V4H11.5V0.5H10.5V2.04688C9.4043 0.791016 7.78516 0 6 0ZM10.6406 7.8125C9.91211 9.67969 8.14453 11 6 11C4.36133 11 2.92188 10.1934 2.01562 9H4V8H0.5V11.5H1.5V9.95312C2.59375 11.1934 4.19727 12 6 12C8.55664 12 10.6914 10.4199 11.5625 8.1875L10.6406 7.8125Z"
              fill="white"
            />
          </svg>

          <span className="font-normal text-sm">Đồng bộ</span>
        </button> */}
      </div>
    ),
    leftHeader: (
      <>
        <Select
          showSearch
          allowClear
          placeholder="Chọn nhà cung cấp"
          optionFilterProp="children"
          className="w-full sm:w-[300px] text-left"
          onChange={(value) => {
            setIdCategory((prev) => ({
              ...prev,
              idCategoryMain: undefined,
              idCategory1: undefined,
              idCategory2: undefined,
            }));
            setDataCategory((prev) => ({ ...prev, dataCategoryMain: [], dataCategory1: [], dataCategory2: [] }));
            form.setFieldsValue({ categoryMain: undefined, category1: undefined, category2: undefined });
            setIdSupplierChoosed(value);
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
      </>
    ),
    subHeader: (data) => (
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
  });

  useEffect(() => {
    handleChange();
  }, [filterCategory, idSupplierChoosed]);

  return (
    <Fragment>
      <div className="min-h-screen store-wrapper">
        <p className="text-2xl font-bold text-teal-900 mb-6">Tồn kho</p>
        <div className="bg-white w-full px-4 py-6 rounded-[10px] relative">{DataInventoryManagement()}</div>
      </div>
    </Fragment>
  );
};
export default Page;
