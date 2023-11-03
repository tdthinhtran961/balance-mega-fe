import { Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { CategoryService } from 'services/category';

function CategorySelected({ form, data, idSupplierChoosed }) {

  const [dataCategory, setDataCategory] = useState({
    dataCategoryMain: [],
    dataCategory1: [],
    dataCategory2: [],
  });

  const [idCategory, setIdCategory] = useState({
    idCategoryMain: null,
    idCategory1: null,
    idCategory2: null,
  });

  const [categoryName, setCategoryName] = useState({
    categoryNameMain: null,
    categoryName1: null,
    categoryName2: null,
  });

  const [, setIsLoad] = useState({
    loadingMain: false,
    loading1: false,
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
  }, [location.pathname, idSupplierChoosed]);

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
  return [
    () => (
      <div form={form} className="min-w-min mt-5 sm:mt-0">
        <div className="grid-cols-1 grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-1 sm:gap-4 mt-4 mb-4 ">
          <Form.Item name="categoryMain">
            <Select
              disabled={data?.status === 'COMPLETED' || data.status === 'CANCELED'}
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
                setCategoryName((prev) => ({ ...prev, categoryNameMain: options?.label }))
                form.setFieldsValue({ category1: undefined, category2: undefined });
              }}
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
              disabled={dataCategory?.dataCategory1.length === 0 || data?.status === 'COMPLETED' || data?.status === 'CANCELED'}
              showSearch
              allowClear
              placeholder="Danh mục cấp 1"
              optionFilterProp="children"
              className="w-full text-left select-category"
              onChange={(value, options) => {
                setIdCategory((prev) => ({ ...prev, idCategory1: value, idCategory2: undefined }));
                setDataCategory((prev) => ({ ...prev, dataCategory2: [] }));
                setCategoryName((prev) => ({ ...prev, categoryName1: options?.label }))
                form.setFieldsValue({ category2: undefined });
              }}
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={dataCategory.dataCategory1.map((i) => ({ value: i.id, label: i.name }))}
            />
          </Form.Item>
          <Form.Item name="category2" label="">
            <Select
              disabled={dataCategory?.dataCategory2.length === 0 || data?.status === 'COMPLETED' || data?.status === 'CANCELED'}
              showSearch
              allowClear
              placeholder="Danh mục cấp 2"
              optionFilterProp="children"
              className="w-full text-left select-category"
              onChange={(value, options) => {
                setIdCategory((prev) => ({ ...prev, idCategory2: value }))
                setCategoryName((prev) => ({ ...prev, categoryName2: options?.label }))
              }}
              // onSearch={onSearch}
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={dataCategory.dataCategory2.map((i) => ({ value: i.id, label: i.name }))}
            />
          </Form.Item>
        </div>
      </div>
    ),
    idCategory,
    setIdCategory,
    setDataCategory,
    categoryName
  ];
}

export default CategorySelected;
