import { Col, DatePicker, Form, Input, Row, Select, Space, Spin as SpinAntd } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { formatCurrency, routerLinks } from 'utils';
import { Button, Message, Spin } from 'components';
import { useAuth } from 'global';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { InventoryCheckService } from 'services/inventory-check';
import { StoreService } from 'services/store';
import CategorySelected from './components/CategorySelected';
import TableData from './components/Table';
import PaginationHook from './components/Pagination';
import * as XLSX from 'xlsx';
import classNames from 'classnames';
import './index.less';
moment.locale('vi');

const Page = () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const [loading, setLoading] = useState({
    loadingMainPage: false,
    loadingProduct: false,
    loadingSupplier: false,
    isLoadingSkin: false,
  });
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const storeId = user?.userInfor?.subOrgId;
  const [data, setData] = useState({});
  const uuid = urlSearch.get('uuid');

  const [listItem, setListItem] = useState([]);

  const [dataArr, setDataArr] = useState([]);

  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
    categoryId: null,
    supplierId: null,
    stocktakeUuid: null,
  });

  const [total, setTotal] = useState(0);

  const [disabledButon, setDisabledButton] = useState({
    disabledBtn: false,
  });
  const [CategoryUI, idCategory, setIdCategory, setDataCategory, categoryName] = CategorySelected({ form, data, idSupplierChoosed: params.supplierId });

  const [PaginationUI, pageIndex, pageSize] = PaginationHook({
    total,
    pageSizeRender: (sizePage) => sizePage,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} sản phẩm`,
    idElement: 'table-paginaiton',
    pageIndex: params.page,
    pageSize: params.perPage,
    pageSizeOptions: [10, 20, 30, 40],
  });

  const [supplierList, setSupplierList] = useState([]);

  const [approval, setApproval] = useState(false);

  const [headExcelInfo, setHeadExcelInfo] = useState({
    date: '',
    categoryMain: '',
    category1: '',
    category2: '',
    supplierName: '',
  });

  const [unitChange, setUnitChange] = useState([]);

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      categoryId: idCategory.idCategory2 ?? idCategory.idCategory1 ?? idCategory.idCategoryMain,
    }));
  }, [idCategory]);

  useEffect(() => {
    setParams((prev) => ({ ...prev, page: pageIndex, perPage: pageSize }));
  }, [pageIndex, pageSize]);

  // Edit by Thinh - start (BL-1549)
  const arrayListProduct = useMemo(() => {
    const newArray = [...dataArr]
      .map((a) => {
        const b = [...listItem].find((b) => b.id === a.id);
        if (b) {
          a.checkQuantity = b.checkQuantity;
        }
        return a;
      })
      .map((i) => ({
        ...i,
        inventoryProductUnit: i.inventoryProductUnit
                              .sort((a, b) => +a.conversionValue - +b.conversionValue)
                              .map(item => ({
                                ...item,
                                isDefault: item.productCode === (i.currentUnitCode || i.code),
                              })),
      }))
      .map((i, index) => {
        const defaultUnit = i.inventoryProductUnit[unitChange[index]] || i.inventoryProductUnit.find(e => e.isDefault)
        return ({
          ...i,
          // checkQuantity: i.checkQuantity != null && i.checkQuantity !== ''
          //   ? i.checkQuantity
          //   : defaultUnit?.quantityBal,
          code: defaultUnit?.productCode,
          stockQuantity: pageType === 'create' ? defaultUnit?.quantityBal : i.stockQuantity,  
          qtyFail: i.checkQuantity != null && i.checkQuantity !== ''
            ? i.qtyFail 
              ? i.qtyFail 
              : Math.abs((pageType === 'create' ? defaultUnit?.quantityBal : i.stockQuantity) - i.checkQuantity) 
            : 0,
          valueFail:
            i.checkQuantity != null && i.checkQuantity !== ''
              ? i.qtyFail 
                ? i.qtyFail * defaultUnit?.inventoryPrice 
                : defaultUnit?.inventoryPrice * Math.abs((pageType === 'create' ? defaultUnit?.quantityBal : i.stockQuantity) - i.checkQuantity) 
              : 0,
          inventoryPrice: defaultUnit?.inventoryPrice,
        })
      })
    const listIndex = newArray.map(item => item.inventoryProductUnit.findIndex(e => e.isDefault));
    unitChange.length === 0 && setUnitChange(listIndex);
    return [...newArray];
  }, [dataArr, listItem]);
  // Edit by Thinh - end (BL-1549)

  useEffect(() => {
    if (params.supplierId !== null && pageType === 'edit' && supplierList.length > 0) {
      const item = supplierList.find((i) => i.id === params.supplierId);
      setHeadExcelInfo((prev) => ({ ...prev, supplierName: item?.name ?? '' }));
    }
  }, [params.supplierId, supplierList, pageType]);

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
  }, [location.pathname]);

  useEffect(() => {
    let flag = true;
    const fetchListProduct = async () => {
      setIsLoading(true);
      try {
        const res = await InventoryCheckService.getListProduct(params);
        setTotal(res.count);
        setDataArr(res.data ?? []);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    pageType === 'create' && flag && fetchListProduct();
    pageType === 'edit' && params.stocktakeUuid !== null && flag && fetchListProduct();
    return () => {
      flag = false;
    };
  }, [params.page, params.categoryId, params.stocktakeUuid, params.supplierId, params.perPage, pageType]);

  useEffect(() => {
    const initFunction = async () => {
      if (uuid) {
        setLoading((prev) => ({ ...prev, loadingMainPage: true }));
        try {
          const res = await InventoryCheckService.getById(uuid);
          switch (pageType) {
            case 'edit':
              setIdCategory((prev) => ({
                ...prev,
                idCategoryMain: res?.keyCategoryId,
                idCategory1: res?.firstCategoryId,
                idCategory2: res?.secondCategoryId,
              }));
              setParams((prev) => ({
                ...prev,
                supplierId: res?.supplierId ?? null,
                categoryId: res?.secondCategoryId ?? res?.firstCategoryId ?? res?.keyCategoryId,
                stocktakeUuid: res?.uuid,
              }));
              form.setFieldsValue({
                ...res,
                checkDate: moment(res?.checkDate),
                categoryMain: res?.keyCategoryId,
                category1: res?.firstCategoryId,
                category2: res?.secondCategoryId,
              });
              setData({
                ...res,
                checkDate: moment(res?.checkDate),
              });
              break;
            case 'create':
              setIdCategory((prev) => ({
                ...prev,
                idCategoryMain: res?.keyCategoryId,
                idCategory1: res?.firstCategoryId,
                idCategory2: res?.secondCategoryId,
              }));
              setParams((prev) => ({
                ...prev,
                supplierId: res?.supplierId ?? null,
                categoryId: res?.secondCategoryId ?? res?.firstCategoryId ?? res?.keyCategoryId,
                stocktakeUuid: null,
              }));
              form.setFieldsValue({
                checkDate: moment(res?.checkDate),
                categoryMain: res?.keyCategoryId,
                category1: res?.firstCategoryId,
                category2: res?.secondCategoryId,
                supplierId: res?.supplierId,
              });
              break;
            default:
              break;
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading((prev) => ({ ...prev, loadingMainPage: false }));
        }
      }
    };
    initFunction();
  }, [uuid, pageType]);

  const removeAccents = (str) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };
  const handleDelete = async (id) => {
    if (!id) return null;
    return Message.confirm({
      text: 'Bạn có chắc chắn muốn hủy phiếu kiểm kê này ?',
      title: 'Thông báo',
      onConfirm: async () => {
        const res = await InventoryCheckService.cancel(id, { uuid: id });
        if (res && res.statusCode === 200) {
          return navigate(routerLinks('InventoryCheck'));
        }
      },
    });
  };

  const handleSubmit = async (values) => {
    setDisabledButton((prev) => ({ ...prev, disabledBtn: true }));
    setLoading((prev) => ({ ...prev, isLoadingSkin: true }));
    try {
      const param = {
        code: null,
        description: values.description,
        checkDate: values?.checkDate ? moment(values.checkDate).format('YYYY/MM/DD 00:00:00') : null,
        keyCategoryId: idCategory.idCategoryMain ?? null,
        firstCategoryId: idCategory.idCategory1 ?? null,
        secondCategoryId: idCategory.idCategory2 ?? null,
        supplierId: values.supplierId ?? null,
        status: 'INPROCESS',
        itemList: listItem
          .filter((i) => i.checkQuantity !== undefined && i.checkQuantity !== '')
          .map((i) => ({
            id: i.id,
            checkQuantity: i.checkQuantity,
            inventoryProductUnitId: +i.inventoryProductUnit[unitChange[i.index]].id,
          })),
        approval: false,
      };
      let res;
      switch (pageType) {
        case 'create':
          res = await InventoryCheckService.post({ ...param, uuid: null });
          if (res) {
            return navigate(routerLinks('InventoryCheck'));
          }
          break;
        case 'edit':
          if (approval) {
            res = await InventoryCheckService.post({ ...param, uuid, approval: true });
            res && navigate(routerLinks('InventoryCheck'));
            if (res && res.statusCode === 200) {
              const result = await InventoryCheckService.getById(uuid);
              if (result) {
                setParams((prev) => ({
                  ...prev,
                  supplierId: res?.supplierId ?? null,
                  categoryMain: res?.keyCategoryId,
                  category1: res?.firstCategoryId,
                  category2: res?.secondCategoryId,
                  stocktakeUuid: res?.uuid,
                }));
                setData(result);
              }
            }
            // return navigate(routerLinks('InventoryCheck'));
          } else {
            res = await InventoryCheckService.post({ ...param, uuid });
            if (res) {
              return navigate(routerLinks('InventoryCheck'));
            }
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDisabledButton((prev) => ({ ...prev, disabledBtn: false }));
      setLoading((prev) => ({ ...prev, isLoadingSkin: false }));
    }
  };

  const handleExport = async () => {
    // const values = await form.validateFields();
    // const param = {
    //   code: null,
    //   description: values.description,
    //   checkDate: values?.checkDate ? moment(values.checkDate).format('YYYY/MM/DD 00:00:00') : null,
    //   keyCategoryId: idCategory.idCategoryMain ?? null,
    //   firstCategoryId: idCategory.idCategory1 ?? null,
    //   secondCategoryId: idCategory.idCategory2 ?? null,
    //   supplierId: values.supplierId ?? null,
    //   status: 'INPROCESS',
    //   itemList: listItem.filter((i) => !!i.checkQuantity).map((i) => ({ id: i.id, checkQuantity: i.checkQuantity })),
    //   approval: false,
    // };
    setLoading((prev) => ({ ...prev, isLoadingSkin: true }));

    try {
      // const res = await InventoryCheckService.post({ ...param, uuid }, false);
      // if (res) {
      const result = await InventoryCheckService.getListProduct({ ...params, page: 0, perPage: 0 });
      result.data = result?.data?.map(e => ({
        ...e,
        currentUnit: e.inventoryProductUnit.find(f => f.productCode === e.currentUnitCode),
      }))
      if (result && result?.data?.length > 0) {
        const dataExcel = result?.data?.map((i, idx) => ({
          code: i?.code,
          name: i?.name,
          barcode: i?.barcode,
          unit: i?.currentUnit.unitName,
          inventoryPrice: i?.currentUnit.inventoryPrice || i?.currentUnit.inventoryPrice === 0 ? formatCurrency(i?.currentUnit.inventoryPrice, ' ') : null,
          stockQuantity: i?.stockQuantity || i?.stockQuantity === 0 ? i?.stockQuantity.toLocaleString('vi-VN') : null,
          checkQuantity: i?.checkQuantity || i?.checkQuantity === 0 ? i?.checkQuantity.toLocaleString('vi-VN') : null,
          qtyFail:
            i?.checkQuantity || i?.checkQuantity === 0
              ? Math.abs(i?.stockQuantity - i?.checkQuantity).toLocaleString('vi-VN')
              : null,
          valueFail:
            i?.checkQuantity || i?.checkQuantity === 0
              ? formatCurrency(i?.currentUnit.inventoryPrice * Math.abs(i?.stockQuantity - i?.checkQuantity), ' ')
              : null,
          createdBy: i?.createdBy,
          approvalBy: i?.approvalBy,
        }));
        const Heading = [
          [
            'Mã sản phẩm',
            'Tên sản phẩm',
            'Mã vạch',
            'Đơn vị',
            'Giá kho',
            'Tồn kho logic',
            'SL kiểm kê',
            'SL sai khác',
            'Giá trị sai',
            'Người tạo',
            'Người duyệt',
          ],
        ];
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.sheet_add_aoa(wb, Heading, {
          origin: 'A8',
        });

        XLSX.utils.sheet_add_aoa(ws, [['BÁO CÁO CHI TIẾT KIỂM KÊ']], { origin: 'D1' });
        XLSX.utils.sheet_add_aoa(
          ws,
          [
            [
              'Ngày kiểm kê:',
              form.getFieldValue('checkDate') ? moment(form.getFieldValue('checkDate')).format('DD/MM/YYYY') : null,
            ],
          ],
          { origin: 'A3' },
        );
        XLSX.utils.sheet_add_aoa(ws, [['Mô tả:', form.getFieldValue('description') ?? '']], { origin: 'E3' });
        XLSX.utils.sheet_add_aoa(ws, [['Nhà cung cấp', headExcelInfo.supplierName]], { origin: 'E4' });
        XLSX.utils.sheet_add_aoa(ws, [['Danh mục chính', categoryName.categoryNameMain]], { origin: 'A5' });
        XLSX.utils.sheet_add_aoa(ws, [['Danh mục cấp 1', categoryName.categoryName1]], { origin: 'E5' });
        XLSX.utils.sheet_add_aoa(ws, [['Danh mục cấp 2', categoryName.categoryName2]], { origin: 'I5' });
        XLSX.utils.sheet_add_json(wb, dataExcel, { origin: 'A9', skipHeader: true, skipcolumn: 1 });
        XLSX.utils.book_append_sheet(wb, ws, 'Kiểm kê');
        XLSX.writeFile(wb, 'Chi tiết kiểm kê.xlsx');
      }
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading((prev) => ({ ...prev, isLoadingSkin: false }));
    }
  };

  if (loading.loadingMainPage) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }
  if (loading.isLoadingSkin) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <SpinAntd />
      </div>
    );
  }
  return (
    <Fragment>
      <div className="min-h-screen promotional-good-container">
        <Form form={form} component={false} onFinish={handleSubmit}>
          <p className="text-2xl text-teal-900 font-bold">{!data?.uuid ? 'Tạo kiểm kê' : 'Chi tiết kiểm kê'}</p>
          <div className="bg-white w-full px-6 pt-2 rounded-xl mt-5 relative pb-5">
            <div className="mb-4 border-b border-gray-200">
              <div className="flex mb-4 flex-col sm:flex-row justify-start items-center">
                <h2 className="font-bold text-lg text-teal-900 sm:mr-3 mb-2 sm:mb-0">Thông tin kiểm kê</h2>
              </div>
              <Row
                gutter={{
                  xs: 8,
                  sm: 16,
                  md: 24,
                  lg: 32,
                }}
                className="mb-4 grid grid-cols-1 lg:grid-cols-2"
              >
                <Col span={24} sm={12}>
                  <div className="grid-cols-1 sm:w-[180px] mb-2 lg:mb-0 grid md:grid-cols-[180px_minmax(180px,_1fr)] lg:w-auto items-center">
                    <div className="font-normal text-black text-base mb-2 lg:mb-0">Ngày kiểm kê: </div>
                    <Space direction="vertical" className="">
                      <Form.Item
                        name="checkDate"
                        style={{
                          margin: 0,
                        }}
                        rules={[
                          {
                            required: true,
                            message: `Đây là trường bắt buộc!`,
                          },
                        ]}
                        initialValue={moment()}
                      >
                        <DatePicker
                          className={classNames('w-full bg-white !border-gray-200 !text-gray-500', {
                            formItem__datePicker: data?.status === 'COMPLETED' || data?.status === 'CANCELED',
                          })}
                          disabled={data?.status === 'COMPLETED' || data?.status === 'CANCELED'}
                          format="DD/MM/YYYY"
                          disabledDate={(current) => {
                            return (
                              (current && current.isBefore(moment(), 'dates')) ||
                              (current && current.isAfter(moment(), 'dates'))
                            );
                          }}
                        />
                      </Form.Item>
                    </Space>
                  </div>
                </Col>

                <Col span={24} sm={18}>
                  <div className="grid-cols-1 sm:w-[180px] mb-2 lg:mb-0 grid md:grid-cols-[180px_minmax(180px,1fr)] lg:w-auto items-center mt-1">
                    <span className="font-normal text-black text-base mb-2 lg:mb-0">Mô tả: </span>
                    <Form.Item
                      name="description"
                      style={{
                        margin: 0,
                      }}
                      rules={[
                        {
                          required: true,
                          message: `Đây là trường bắt buộc!`,
                        },
                      ]}
                    >
                      <Input
                        disabled={data?.status === 'COMPLETED' || data?.status === 'CANCELED'}
                        className="input__description w-full !text-gray-500  px-3 py-2 bg-white rounded-[10px] border border-gray-200 focus:!shadow-none focus:!border-gray-200"
                        placeholder="Nhập mô tả"
                      />
                    </Form.Item>
                  </div>
                </Col>

                {/* </div> */}
              </Row>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-base text-teal-900">Danh sách sản phẩm</h2>
                <Form.Item
                  name="supplierId"
                  style={{
                    margin: 0,
                  }}
                >
                  <Select
                    allowClear
                    disabled={data?.status === 'COMPLETED' || data?.status === 'CANCELED'}
                    showSearch
                    onChange={(e, options) => {
                      setIdCategory((prev) => ({
                        ...prev,
                        idCategoryMain: undefined,
                        idCategory1: undefined,
                        idCategory2: undefined,
                      }));
                      setDataCategory((prev) => ({ ...prev, dataCategoryMain: [], dataCategory1: [], dataCategory2: [] }));
                      form.setFieldsValue({ categoryMain: undefined, category1: undefined, category2: undefined });
                      setParams((prev) => ({ ...prev, page: 1, supplierId: e }));
                      setHeadExcelInfo((prev) => ({ ...prev, supplierName: options?.label }));
                    }}
                    placeholder="Chọn nhà cung cấp"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      removeAccents(option?.label ?? '').indexOf(removeAccents(input)) >= 0
                    }
                    // filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={supplierList.map((i) => ({ label: i.name, value: i.id }))}
                    className='select__supplier'
                  />
                </Form.Item>
              </div>
              <div>{CategoryUI()}</div>
              <TableData
                dataSource={arrayListProduct}
                setDataSource={setDataArr}
                isLoading={isLoading}
                dataArr={dataArr}
                data={data}
                setListItem={setListItem}
                unitChange={unitChange}
                setUnitChange={setUnitChange}
                pageType={pageType}
              />
              <div>{PaginationUI()}</div>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row justify-between mt-[22px] items-center">
            <Button
              text="Trở về"
              onClick={() => window.history.back()}
              buttonStyle="primary"
              id="backBtn"
              className="w-[259px] md:w-[106px] mt-4 sm:mt-0"
            />
            <div className="flex justify-center lg:justify-end flex-col md:flex-row gap-4">
              {pageType === 'create' || data?.status === 'INPROCESS' ? (
                <Button
                  text="Lưu"
                  onClick={() => {
                    setApproval(false);
                    form && form.submit();
                  }}
                  disabled={disabledButon.disabledBtn}
                  buttonStyle="default"
                  id="saveBtn"
                  className="w-[259px] md:w-[120px] lg:w-[136px]"
                />
              ) : null}
              {data?.status === 'INPROCESS' && (
                <Button
                  type="submit"
                  text="Phê duyệt"
                  disabled={disabledButon.disabledBtn}
                  onClick={() => {
                    setApproval(true);
                    form && form.submit();
                  }}
                  buttonStyle="default"
                  id="approveBtn"
                  className="w-[259px] md:w-[120px] lg:w-[136px]"
                />
              )}
              {data?.status === 'INPROCESS' && (
                <Button
                  text="Hủy"
                  onClick={() => handleDelete(uuid ?? data?.uuid)}
                  id="deleteBtn"
                  buttonStyle="secondary"
                  className="w-[259px] md:w-[60px] lg:w-[84px] "
                />
              )}

              {(data?.status === 'INPROCESS' || data?.status === 'COMPLETED') && (
                <Button
                  text="Xuất báo cáo"
                  disabled={disabledButon.disabledBtn || dataArr.length === 0}
                  onClick={() => handleExport()}
                  id="outBtn"
                  buttonStyle="primary"
                  className="w-[259px] md:w-[120px] lg:w-[176px]"
                />
              )}
            </div>
          </div>
        </Form>
      </div>
    </Fragment>
  );
};
export default Page;
