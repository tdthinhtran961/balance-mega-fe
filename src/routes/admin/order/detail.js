import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Message, Select, Spin } from 'components';
import './index.less';
import { useLocation } from 'react-router-dom';
import { formatCurrency, routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { SupplierService } from 'services/supplier';
import { useAuth } from 'global';
import { Table, Space, Form, Input, Button, InputNumber } from 'antd';
import TableImportProduct, { blockInvalidChar, blockInvalidChar1 } from './tabPaneComponents/tableInputProduct';
import classNames from 'classnames';
import TableProduct from './tabPaneComponents/tableListProduct';
import DetailTitle from './tabPaneComponents/detailTitle';
import { taxApply } from 'constants/index';

const Page = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const urlSearch = new URLSearchParams(location?.search);
  const tabKey = urlSearch.get('tabKey');
  const idOrder = urlSearch.get('id');
  const idSupplier = urlSearch.get('idSupplier');
  const view = urlSearch.get('view');
  const [data, setData] = useState({});
  const status = data?.status;
  const [checkInput, setCheckInput] = useState(false);
  const [paymentSupplier, setPaymentSupplier] = useState(0);
  const [keyCheck, setKeyCheck] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrint, setIsLoadingPrint] = useState(false);
  const [checkAmount, setCheckAmount] = useState(false);
  const [checkPaymentSupplier, setCheckPaymentSupplier] = useState(false);
  const [disabledImport, setDisabledImport] = useState(false);
  const formatTime = (time, hour = true) => {
    const timer = new Date(time);
    const yyyy = timer.getFullYear();
    let mm = timer.getMonth() + 1; // Months start at 0!
    let dd = timer.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '/' + mm + '/' + yyyy;
    if (hour)
      return (
        new Date(time).getHours() +
        ':' +
        (new Date(time).getMinutes() < 10 ? '0' : '') +
        new Date(time).getMinutes() +
        ' - ' +
        formattedToday
      );

    return formattedToday;
  };
  const [dataSource, setDataSource] = useState([]);
  const [dataValueTable, setDataValueTable] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataOrderInvoice, setDataOrderInvoice] = useState([]);
  const [filterTax, setFilterTax] = useState();

  useEffect(() => {
    const fetchDetailOrder = async () => {
      if (idOrder) {
        const data = await SupplierService.getDetailGoodsById(idOrder);
        setFilterTax(!!data?.data?.isApplyTax === true ? taxApply?.APPLY : taxApply?.NO_APPLY);
        setData(data?.data);
        setDataTable(
          data?.data?.orderLineItem.map((ele) => {
            const dataProduct = ele?.product;
            return {
              ...ele,
              ...dataProduct,
              storeBarCode: ele?.storeBarcode,
              productId: ele?.product?.id,
            };
          }),
        );
        const dataLevel1 = [];
        const data1 = data?.data?.orderPhase;
        for (let i = 0; i < data1?.length; i++) {
          const dataLevel12 = data1[i].orderLineItemPhase.reduce((acc, item) => {
            return [...acc, item];
          }, []);
          dataLevel1.push(...dataLevel12);
        }
        setDataValueTable(
          dataLevel1.map((ele, index) => {
            const dataOrderLineItem = ele?.orderLineItem;
            const dataProduct = ele?.orderLineItem?.product;
            return {
              ...ele,
              ...dataOrderLineItem,
              ...dataProduct,
              orderLineItemPhaseId: ele?.id,
              quantity: ele?.quantity,
              key: index,
              productId: ele?.orderLineItem?.product?.id,
              totalMoney: +ele?.orderLineItem?.price * +ele?.quantity,
              afterEntering: ele?.orderLineItem?.quantity,
            };
          }),
        );
        setDataOrderInvoice(data?.data?.orderInvoice);
      }
    };
    fetchDetailOrder();
  }, [idOrder]);

  useEffect(() => {
    // bảng con
    for (let i = 0; i < data?.orderPhase?.length; i++) {
      dataSource?.push({
        key: `${i}`,
        id: dataValueTable[i]?.id,
        name: dataValueTable[i]?.name,
        basicUnit: dataValueTable[i]?.basicUnit,
        price: dataValueTable[i]?.price,
        quantity: dataValueTable[i]?.quantity,
        totalMoney: +dataValueTable[i]?.price * +dataValueTable[i]?.quantity,
        orderPhaseId: dataValueTable[i]?.orderPhaseId,
        afterEntering: dataValueTable[i]?.afterEntering,
      });
    }
    setDataSource(dataSource);
  }, [data]);

  const [dataInto, SetDataInto] = useState([]);
  useEffect(() => {
    // bảng cha
    for (let i = 0; i < data?.orderPhase?.length; i++) {
      dataInto?.push({
        key: `${i}`,
        name: `${i + 1}`,
        id: data?.orderPhase[i].id,
        time: formatTime(data?.orderPhase[i]?.receivedDate),
        totalMoney: data?.orderPhase[i]?.totalReceivedOrderPhase,
      });
    }
    SetDataInto(dataInto);
    setIsLoading(!isLoading);
  }, [data]);
  const onFinish = async (values) => {
    if (values?.data?.quantity === 0 || values?.data?.quantity === null) {
      handleDeleteProduct(values?.record?.id, values?.record);
      setKeyCheck(null);
      setCheckInput(false);
    } else {
      if (form.getFieldsError()[0]?.errors?.length === 0 && form.getFieldsError()[1]?.errors?.length === 0) {
        if (values?.data?.updatedReason !== null) {
          await SupplierService.putImportProduct(values);
          const newData = [...dataValueTable];
          const index = newData.findIndex((item) => +item?.key === values?.record?.key);
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            quantity: values?.data?.quantity,
            updatedReason: values?.data?.updatedReason,
          });
          const data = await SupplierService.getDetailGoodsById(idOrder);
          SetDataInto([]);
          setDataTable([]);
          setDataTable(
            data?.data?.orderLineItem.map((ele) => {
              const dataProduct = ele?.product;
              return {
                ...ele,
                ...dataProduct,
                productId: ele?.product?.id,
              };
            }),
          );
          const dataLevel1 = [];
          const data1 = data?.data?.orderPhase;
          for (let i = 0; i < data1?.length; i++) {
            const dataLevel12 = data1[i].orderLineItemPhase.reduce((acc, item) => {
              return [...acc, item];
            }, []);
            dataLevel1.push(...dataLevel12);
          }
          setDataValueTable(newData);
          setDataValueTable(
            dataLevel1.map((ele, index) => {
              const data = ele?.orderLineItem;
              const dataProduct = data?.product;
              return {
                ...ele,
                ...data,
                ...dataProduct,
                orderLineItemPhaseId: ele?.id,
                quantity: ele?.quantity,
                key: index,
                productId: ele?.orderLineItem?.product?.id,
                totalMoney: +ele?.orderLineItem?.price * +ele?.quantity,
              };
            }),
          );
          setData(data?.data);
          setKeyCheck(null);
          setCheckInput(false);
        }
      }
    }
  };
  const handleDeleteProduct = async (id, record) => {
    await SupplierService.deleteProduct(record);
    const data = await SupplierService.getDetailGoodsById(idOrder);
    SetDataInto([]);
    setDataTable([]);
    setDataTable(
      data?.data?.orderLineItem.map((ele) => {
        const dataProduct = ele?.product;
        return {
          ...ele,
          ...dataProduct,
          productId: ele?.product?.id,
        };
      }),
    );
    const dataLevel1 = [];
    const data1 = data?.data?.orderPhase;
    for (let i = 0; i < data1?.length; i++) {
      const dataLevel12 = data1[i].orderLineItemPhase.reduce((acc, item) => {
        return [...acc, item];
      }, []);
      dataLevel1.push(...dataLevel12);
    }
    setDataValueTable(
      dataLevel1.map((ele, index) => {
        const data = ele?.orderLineItem;
        return {
          ...ele,
          ...data,
          orderLineItemPhaseId: ele?.id,
          quantity: ele?.quantity,
          basicUnit: ele?.orderLineItem?.product?.basicUnit,
          key: index,
          productId: ele?.orderLineItem?.product?.id,
          name: ele?.orderLineItem?.product?.name,
          code: ele?.orderLineItem?.product?.code,
          totalMoney: +ele?.orderLineItem?.price * +ele?.quantity,
        };
      }),
    );
    setData(data?.data);
    setKeyCheck(null);
    setCheckInput(false);
  };
  const columnsTableLevel_1 =
    filterTax === taxApply?.APPLY
      ? [
          {
            title: 'Mã vạch (CH)',
            dataIndex: 'storeBarcode',
            key: 'storeBarcode',
            className: 'border-none ml-12',
          },
          {
            title: 'Mã vạch (NCC)',
            dataIndex: 'barcode',
            key: 'barCode',
            className: ' ml-12',
          },
          {
            title: 'Mã sản phẩm',
            dataIndex: 'code',
            key: 'code',
            hidden: roleCode === 'OWNER_SUPPLIER' || +tabKey === 4 || roleCode === 'DISTRIBUTOR',
            className: ' ml-12',
          },
          {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'ĐVT',
            dataIndex: 'basicUnit',
            key: 'basicUnit',
          },
          {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (text) => formatCurrency(text, ''),
          },
          {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (value, record) => {
              return (
                <div>
                  {checkInput && +keyCheck === +record?.key ? (
                    <Form.Item
                      name="quantity"
                      rules={[
                        // {
                        //   required: true,
                        //   message: 'Đây là trường bắt buộc',
                        // },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (+value > +record?.afterEntering) {
                              return Promise.reject(new Error('Bạn đã nhập vượt quá số lượng đã có'));
                            } else if (+value <= +record?.afterEntering) {
                              return Promise.resolve();
                            }
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        type="number"
                        onKeyDown={blockInvalidChar}
                        min={0}
                        placeholder="Nhập số lượng"
                        className="input-number-quantity border w-[60%] h-[2.3rem] rounded-xl mt-4 text-right"
                      />
                    </Form.Item>
                  ) : (
                    <div>{value?.toLocaleString('vi-VN')}</div>
                  )}
                </div>
              );
            },
          },
          {
            title: 'Thành tiền',
            dataIndex: 'totalMoney',
            key: 'totalMoney',
            render: (text) => formatCurrency(text, ''),
          },
          // filterTax === taxApply.APPLY &&
          {
            title: 'Thuế',
            dataIndex: 'tax',
            key: 'tax',
            render: (text, record) => {
              return record && record?.orderLineItem?.tax + '%';
            },
          },
          // filterTax === taxApply.APPLY &&
          {
            title: 'Tiền sau thuế',
            dataIndex: 'money',
            key: 'money',
            render: (text, record) => {
              return (
                record &&
                formatCurrency(
                  Math.round(record?.totalMoney + record?.totalMoney * (record?.orderLineItem?.tax / 100)),
                  '',
                )
              );
            },
          },
          // {
          //   title: 'Lý do',
          //   dataIndex: 'updatedReason',
          //   key: 'updatedReason',
          //   hidden: roleCode === 'OWNER_SUPPLIER' || +tabKey === 4,
          //   width: '15%',
          //   render: (value, record) => {
          //     return (
          //       <Space>
          //         <div>
          //           {checkInput && +keyCheck === +record?.key ? (
          //             <Form.Item
          //               name="updatedReason"
          //               rules={[
          //                 {
          //                   required: true,
          //                   message: 'Đây là trường bắt buộc',
          //                 },
          //               ]}
          //             >
          //               <Input
          //                 placeholder="Nhập lý do"
          //                 type="text"
          //                 className=" p-2 border w-[90%] h-[2.3rem] rounded-xl mt-2"
          //               />
          //             </Form.Item>
          //           ) : (
          //             <div>{value}</div>
          //           )}
          //         </div>
          //       </Space>
          //     );
          //   },
          // },
          // {
          //   title: 'Hoạt động',
          //   dataIndex: 'action',
          //   key: 'action',
          //   hidden: roleCode === 'OWNER_SUPPLIER' || +tabKey === 4,
          //   className: 'border-l-0',
          //   render: (a, record) => {
          //     return (
          //       <Space size="middle flex">
          //         <div className="flex justify-center">
          //           {!checkInput || +keyCheck !== +record?.key ? (
          //             <button
          //               onClick={(e) => {
          //                 if (!checkInput) {
          //                   setKeyCheck(+record?.key);
          //                   setCheckInput(true);
          //                   form.setFieldsValue({
          //                     quantity: record?.quantity,
          //                     updatedReason: record?.updatedReason,
          //                   });
          //                 } else if (checkInput === true) {
          //                   setCheckInput(false);
          //                 }
          //               }}
          //             >
          //               <i className="las la-pen m-0 p-0 text-blue-500 text-2xl mr-2"></i>
          //             </button>
          //           ) : (
          //             checkInput &&
          //             +keyCheck === +record?.key && (
          //               <Button
          //                 htmlType="submit"
          //                 type="link"
          //                 className="buttonEdit border-none active:bg-neutral-50 border-0 rounded-0"
          //                 onClick={(e) => onFinish({ record, data: form.getFieldsValue() })}
          //               >
          //                 <i className="las la-save m-0 p-0 text-blue-500 text-2xl mr-2"></i>
          //               </Button>
          //             )
          //           )}
          //           <button className="buttonDelete " onClick={() => handleDeleteProduct(record?.id, record)}>
          //             <i className="lar la-trash-alt m-0 p-0 text-red-500 text-3xl mr-2"></i>
          //           </button>
          //         </div>
          //       </Space>
          //     );
          //   },
          // },
        ].filter((col) => col.hidden !== +tabKey && !col.hidden)
      : [
          {
            title: 'Mã vạch (CH)',
            dataIndex: 'storeBarcode',
            key: 'storeBarcode',
            className: 'border-none ml-12',
          },
          {
            title: 'Mã vạch (NCC)',
            dataIndex: 'barcode',
            key: 'barCode',
            className: ' ml-12',
          },
          {
            title: 'Mã sản phẩm',
            dataIndex: 'code',
            key: 'code',
            hidden: roleCode === 'OWNER_SUPPLIER' || +tabKey === 4 || roleCode === 'DISTRIBUTOR',
            className: ' ml-12',
          },
          {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'ĐVT',
            dataIndex: 'basicUnit',
            key: 'basicUnit',
          },
          {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (text) => formatCurrency(text, ''),
          },
          {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (value, record) => {
              return (
                <div>
                  {checkInput && +keyCheck === +record?.key ? (
                    <Form.Item
                      name="quantity"
                      rules={[
                        {
                          required: true,
                          message: 'Đây là trường bắt buộc',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (+value > +record?.afterEntering) {
                              return Promise.reject(new Error('Bạn đã nhập vượt quá số lượng đã có'));
                            } else if (+value <= +record?.afterEntering) {
                              return Promise.resolve();
                            }
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        type="number"
                        onKeyDown={blockInvalidChar}
                        min={0}
                        placeholder="Nhập số lượng"
                        className="input-number-quantity border w-[60%] h-[2.3rem] rounded-xl mt-4 text-right"
                      />
                    </Form.Item>
                  ) : (
                    <div>{value.toLocaleString('vi-VN')}</div>
                  )}
                </div>
              );
            },
          },
          {
            title: 'Thành tiền',
            dataIndex: 'totalMoney',
            key: 'totalMoney',
            render: (text) => formatCurrency(text, ''),
          },

          {
            title: 'Lý do',
            dataIndex: 'updatedReason',
            key: 'updatedReason',
            hidden: roleCode === 'OWNER_SUPPLIER' || +tabKey === 4 || roleCode === 'DISTRIBUTOR',
            width: '15%',
            render: (value, record) => {
              return (
                <Space>
                  <div>
                    {checkInput && +keyCheck === +record?.key ? (
                      <Form.Item
                        name="updatedReason"
                        rules={[
                          {
                            required: true,
                            message: 'Đây là trường bắt buộc',
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập lý do"
                          type="text"
                          className=" p-2 border w-[90%] h-[2.3rem] rounded-xl mt-2"
                        />
                      </Form.Item>
                    ) : (
                      <div>{value}</div>
                    )}
                  </div>
                </Space>
              );
            },
          },
          {
            title: 'Hoạt động',
            dataIndex: 'action',
            key: 'action',
            hidden: roleCode === 'OWNER_SUPPLIER' || +tabKey === 4 || roleCode === 'DISTRIBUTOR',
            className: 'border-l-0',
            render: (a, record) => {
              return (
                <Space size="middle flex">
                  <div className="flex justify-center">
                    {!checkInput || +keyCheck !== +record?.key ? (
                      <button
                        onClick={(e) => {
                          if (!checkInput) {
                            setKeyCheck(+record?.key);
                            setCheckInput(true);
                            form.setFieldsValue({
                              quantity: record?.quantity,
                              updatedReason: record?.updatedReason,
                            });
                          } else if (checkInput === true) {
                            setCheckInput(false);
                          }
                        }}
                      >
                        <i className="las la-pen m-0 p-0 text-blue-500 text-2xl mr-2"></i>
                      </button>
                    ) : (
                      checkInput &&
                      +keyCheck === +record?.key && (
                        <Button
                          htmlType="submit"
                          type="link"
                          className="buttonEdit border-none active:bg-neutral-50 border-0 rounded-0"
                          onClick={(e) => onFinish({ record, data: form.getFieldsValue() })}
                        >
                          <i className="las la-save m-0 p-0 text-blue-500 text-2xl mr-2"></i>
                        </Button>
                      )
                    )}
                    <button className="buttonDelete " onClick={() => handleDeleteProduct(record?.id, record)}>
                      <i className="lar la-trash-alt m-0 p-0 text-red-500 text-3xl mr-2"></i>
                    </button>
                  </div>
                </Space>
              );
            },
          },
        ].filter((col) => col.hidden !== +tabKey && !col.hidden);

  const expandedRowRender = (row) => {
    const data = dataValueTable.map((ele, index) => {
      if (+ele?.orderPhaseId === +row?.id) {
        return { ...ele, key: index };
      }
      return false;
    });
    const dataNew = data.filter((item) => item !== false);
    return (
      <div>
        <Form
          className="tableExp"
          form={form}
          // onFinish={onFinish}
          //  onFinishFailed={onFinishFailed}
        >
          {/* <TableLevel1
            roleCode={roleCode}
            tabKey={tabKey}
            onFinish={onFinish}
            handleDeleteProduct={handleDeleteProduct}
            dataNew={dataNew}
          /> */}
          <Table
            className="tableLevl1"
            columns={columnsTableLevel_1}
            dataSource={dataNew}
            pagination={false}
            scroll={{ x: 400, y: null }}
          />
        </Form>{' '}
      </div>
    );
  };

  const submit = async (id) => {
    import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        icon: 'warning',
        title: 'Thông báo',
        text: 'Bạn có chắc muốn xác nhận đơn hàng này?',
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy',
        reverseButtons: true,
        preConfirm: async () => {
          const res = await SupplierService.confirmOrder(id, data?.updateOrderCount);
          if (res) {
            Message.success({
              text: res.message,
              title: 'Thành công',
              cancelButtonText: 'Đóng',
            });
            return navigate(`${routerLinks('OrderManagement')}?tab=2`);
          } else {
            return false;
          }
        },
      }),
    );
  };

  const haveShipped = async (idOrder) => {
    const res = await SupplierService.deliveryOrder(idOrder);
    res &&
      Message.success({
        text: res.message,
        title: 'Thành công',
        cancelButtonText: 'Đóng',
      });
    navigate(`${routerLinks('OrderManagement')}?tab=3`);
  };

  let cancelledByWho = '';
  switch (data?.isStoreCancel) {
    case true:
      cancelledByWho = 'Cửa hàng';
      break;
    case false:
      cancelledByWho = 'Nhà cung cấp';
      break;
  }

  const cancel = async () =>
    import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        // title: 'Thông báo',
        html: `
              <h1 class="text-[2.5rem] font-bold mt-10 mb-5">Thông báo</h1>
              <p class="mb-5">Bạn có chắc muốn hủy đơn hàng này?</p>
              <div class="flex wrapper w-full flex-col">
              <label for="reason" class="label_reason w-[43px]">
                Lý do
              </label>
              <select id="reason" class="w-full h-10 text-gray-600 bg-white pr-9 pl-4 ant-input rounded-xl">
                <option value="Sai địa chỉ">Sai địa chỉ</option>
                <option value="Sản phẩm không hợp lệ">Sản phẩm không hợp lệ</option>
                <option value="Không đủ số lượng">Không đủ số lượng</option>
                <option value="other" selected>Khác</option>
              </select>
              <div id="alert" class="ant-form-item-explain-error text-left" style="display: none">Xin vui lòng chọn lý do</div>
              </div>
              <textarea id="content" class="ant-input px-4 py-3 w-full rounded-xl text-gray-600 bg-white border border-solid text-sm h-[200px]" style="display: none" placeholder="Vui lòng nhập lý do của bạn"></textarea>
              <div id="alert-content" class="text-red-500 text-base text-left" style="display: none" >Hãy điền lý do của bạn !</div>`,
        showConfirmButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy',
        reverseButtons: true,
        showCancelButton: true,
        showCloseButton: true,
        width: 580,
        willOpen: () => {
          const reason = document.getElementById('reason');
          const content = document.getElementById('content');
          if (reason.value && reason.value === 'other') {
            content.style.display = 'block';
          } else {
            content.style.display = 'none';
          }
        },
        didOpen: () => {
          const reason = document.getElementById('reason');
          const content = document.getElementById('content');
          const message = document.getElementById('alert');
          const alertContent = document.getElementById('alert-content');
          reason.oninput = () => {
            if (message.style.display === 'block') message.style.display = 'none';
            reason.setAttribute('style', 'border:none;');
            if (reason?.value === 'other') {
              content.style.display = 'block';
            } else {
              content.removeAttribute('style');
              content.style.display = 'none';
              alertContent.style.display = 'none';
            }
          };
          content.oninput = () => {
            if (content.value || content.value.trim().length > 0) {
              alertContent.style.display = 'none';
              content.removeAttribute('style');
              return true;
            }
          };
        },
        preConfirm: async () => {
          const reason = document.getElementById('reason');
          const message = document.getElementById('alert');
          const otherReasonContent = document.getElementById('content');
          const alertContent = document.getElementById('alert-content');
          if (!reason.value || reason.value.trim().length === 0) {
            message.style.display = 'block';
            reason.focus();
            reason.setAttribute('style', 'border-color: #ff4d4f');
            return false;
          }
          if ((!otherReasonContent.value || otherReasonContent.value.trim().length === 0) && reason.value === 'other') {
            alertContent.style.display = 'block';
            otherReasonContent.focus();
            otherReasonContent.setAttribute('style', 'border-color: #ff4d4f');
            return false;
          }

          const res = await SupplierService.cancelOrder(idOrder, {
            reason: document.getElementById('content').value || document.getElementById('reason').value,
            // content: document.getElementById('content').value,
          });
          res &&
            Message.success({
              text: res.message,
              title: 'Thành công',
              cancelButtonText: 'Đóng',
            });
          return navigate(`${routerLinks('OrderManagement')}?tab=5`);
          // confirmOrderSuccess('Bạn đã hủy đơn hàng thành công');
        },
      }),
    );

  const caculatePrice = useCallback(() => {
    const valueVoucher = Number(data?.voucher?.voucherValue ?? 0);
    const voucherType = data?.voucher?.voucherType;
    const conditionApplyAmount = Number(data?.voucher?.conditionApplyAmount ?? 0);
    const totalOrder = Number(data?.total ?? 0) + Number(data?.voucherAmount ?? 0);
    const totalReceived = Number(data?.totalReceived ?? 0);
    const totalTax = Number(data?.totalTax ?? 0);
    const totalAfterTax = totalReceived + totalTax;
    const status = data?.paymentSupplierStatus;

    let totalAll = 0;
    let discount = 0;
    let discountPercent = '';
    switch (voucherType) {
      case 'PERCENT':
        if (totalAfterTax < conditionApplyAmount) {
          discount = 0;
          totalAll = totalAfterTax;
          discountPercent = '(' + valueVoucher + '%)';
          // discountPercent = null;
        } else {
          discount = totalAfterTax * (valueVoucher / 100);
          totalAll = totalAfterTax - discount;
          discountPercent = '(' + valueVoucher + '%)';
        }
        break;
      case 'CASH':
        if (totalAfterTax < conditionApplyAmount) {
          discount = 0;
          totalAll = totalAfterTax;
          discountPercent = null;
        } else {
          discount = valueVoucher;
          totalAll = totalAfterTax - discount;
          discountPercent = '(' + ((valueVoucher / totalAfterTax) * 100).toFixed(2) + '%)';
        }
        break;
      default:
        totalAll = totalAfterTax - discount;
        break;
    }
    discountPercent = data?.voucher === null ? null : discountPercent;
    return {
      conditionApplyAmount,
      totalOrder,
      totalReceived,
      totalTax,
      totalAfterTax,
      discountPercent,
      discount,
      totalAll,
      status,
    };
  }, [data]);
  const caculatePriceNoTax = useCallback(() => {
    const valueVoucher = Number(data?.voucher?.voucherValue ?? 0);
    const voucherType = data?.voucher?.voucherType;
    const conditionApplyAmount = Number(data?.voucher?.conditionApplyAmount ?? 0);
    const totalOrder = Number(data?.total ?? 0) + Number(data?.voucherAmount ?? 0);
    const totalReceived = Number(data?.totalReceived ?? 0);

    let totalAll = 0;
    let discount = 0;
    let discountPercent = '';
    switch (voucherType) {
      case 'PERCENT':
        if (totalReceived < conditionApplyAmount) {
          discount = 0;
          totalAll = totalReceived;
          discountPercent = null;
        } else {
          discount = totalReceived * (valueVoucher / 100);
          totalAll = totalReceived - discount;
          discountPercent = '(' + valueVoucher + '%)';
        }
        break;
      case 'CASH':
        if (totalReceived < conditionApplyAmount) {
          discount = 0;
          totalAll = totalReceived;
          discountPercent = null;
        } else {
          discount = valueVoucher;
          totalAll = totalReceived - discount;
          discountPercent = '(' + ((valueVoucher / totalReceived) * 100).toFixed(2) + '%)';
        }
        break;
      default:
        totalAll = +tabKey === 3 || +tabKey === 4 ? totalReceived - discount : totalOrder - discount;
        break;
    }
    discountPercent = data?.voucher === null ? null : discountPercent;
    // setPaymentSupplier(Number(totalAll) - Number(data?.paymentSupplierOrder))
    return {
      conditionApplyAmount,
      totalOrder,
      totalReceived,
      discountPercent,
      discount,
      totalAll,
    };
  }, [data, tabKey]);

  if (!data?.id || isLoadingPrint) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="min-h-screen orderProduct">
        <p className="text-2xl text-teal-900 font-medium">Quản lý đơn hàng</p>
        <div className="bg-white w-full px-4 rounded-xl mt-5 relative pb-5 tableExtend">
          <div className="flex flex-row items-center order-detail-title">
            <p className="text-xl font-bold text-teal-900 py-4 mr-5 order-info-title">Thông tin đơn hàng</p>
            {status === 'WAITING_APPROVED' ? (
              <p className="text-[16px] text-yellow-400 py-4 flex flex-row items-center order-detail-status">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Chờ xác nhận</span>
              </p>
            ) : status === 'WAITING_PICKUP' && roleCode === 'OWNER_STORE' ? (
              <p className="text-[16px] text-[#F97316] py-4 flex flex-row items-center order-detail-status">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Chờ lấy hàng</span>
              </p>
            ) : status === 'WAITING_PICKUP' && (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') ? (
              <p className="text-[16px] text-[#F97316] py-4 flex flex-row items-center order-detail-status">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Chờ lấy hàng</span>
              </p>
            ) : status === 'WAITING_PICKUP' && roleCode === 'ADMIN' ? (
              <p className="text-[16px] text-[#F97316] py-4 flex flex-row items-center order-detail-status">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Chờ lấy hàng</span>
              </p>
            ) : status === 'DELIVERY_RECEIVE' || status === 'DELIVERY_RECEIVED' || status === 'DELIVERY_RECEIVING' ? (
              <p className="text-[16px] text-[#3B82F6] py-4 flex flex-row items-center order-detail-status">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Đang giao</span>
              </p>
            ) : status === 'DELIVERED' ? (
              <p className="text-[16px] text-[#16A34A] py-4 flex flex-row items-center order-detail-status">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Đã giao</span>
              </p>
            ) : status === 'CANCELLED' ? (
              <p className="text-[16px] text-[#EF4444] py-4 flex flex-row items-center order-detail-status">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Đã hủy</span>
              </p>
            ) : status === 'PROCESSING' ? (
              <p className="text-[16px] text-[#f97316] py-4 flex flex-row items-center order-detail-status">
                <i className="mr-1 text-lg las la-tag"></i>
                <span className="text-[16px]">Chờ lấy hàng</span>
              </p>
            ) : (
              ''
            )}
          </div>
          <DetailTitle
            roleCode={roleCode}
            status={status}
            tabKey={tabKey}
            data={data}
            view={view}
            formatTime={formatTime}
          />
          <hr />
          {data && data?.orderLineItem?.length > 0 && (
            <>
              <div className="flex justify-between items-center flex-col sm:flex-row mb-4 mt-4">
                <p className="text-[16px] font-bold text-teal-900 py-4 sm:mr-5">Chi tiết đơn hàng</p>
                <Select
                  disabled={true}
                  defaultValue={filterTax}
                  className="w-wull sm:w-[245px]"
                  allowClear={false}
                  placeHolder="Chọn thuế"
                  list={[
                    { label: 'Áp dụng thuế', value: taxApply?.APPLY },
                    { label: 'Không áp dụng thuế', value: taxApply?.NO_APPLY },
                  ]}
                  // onChange={(value) => setFilterTax(value)}
                />
              </div>
              <TableImportProduct
                filterTax={filterTax}
                dataSource={dataTable.map((ele, index) => ({ ...ele, key: index }))}
                setDataSourceValue={setDataTable}
                tabKey={tabKey}
                roles={user}
                checkAmount={checkAmount}
                setCheckAmount={setCheckAmount}
              />
              <div className="clear-both"></div>{' '}
              {data &&
                data?.orderLineItem?.length > 0 &&
                +tabKey === 3 &&
                user?.userInfor?.roleCode !== 'OWNER_SUPPLIER' &&
                user?.userInfor?.roleCode !== 'DISTRIBUTOR' && (
                  <>
                    <div className="flex justify-end items-end text-sm mt-4 mr-5">
                      {data && data?.orderLineItem?.filter((item) => item?.remainQuantity > 0)?.length > 0 ? (
                        <button
                          disabled={disabledImport}
                          onClick={
                            async () => {
                              setDisabledImport(true);
                              await SupplierService.postImportProduct(dataTable);
                              const data = await SupplierService.getDetailGoodsById(idOrder);
                              SetDataInto([]);
                              setDataTable([]);
                              setDataTable(
                                data?.data?.orderLineItem.map((ele) => {
                                  const dataProduct = ele?.product;
                                  return {
                                    ...ele,
                                    ...dataProduct,
                                    storeBarCode: ele?.storeBarcode,
                                    productId: ele?.product?.id,
                                  };
                                }),
                              );
                              const dataLevel1 = [];
                              const data1 = data?.data?.orderPhase;
                              for (let i = 0; i < data1?.length; i++) {
                                const dataLevel12 = data1[i]?.orderLineItemPhase.reduce((acc, item) => {
                                  return [...acc, item];
                                }, []);
                                dataLevel1.push(...dataLevel12);
                              }
                              setDataValueTable(
                                dataLevel1.map((ele, index) => {
                                  const data = ele?.orderLineItem;
                                  const dataProduct = data.product;
                                  return {
                                    ...ele,
                                    ...data,
                                    ...dataProduct,
                                    orderLineItemPhaseId: ele?.id,
                                    quantity: ele?.quantity,
                                    key: index,
                                    productId: ele?.orderLineItem?.product?.id,
                                    totalMoney: +ele?.orderLineItem?.price * +ele?.quantity,
                                  };
                                }),
                              );
                              setData(data?.data);
                              setDisabledImport(false);
                            }
                            // }
                          }
                          className={classNames(
                            'px-4 bg-teal-900 w-[132px] h-[44px] text-white text-base p-2 rounded-[10px] hover:bg-teal-600 mt-1 mr-4 mb-2 disabled:opacity-60',
                            {
                              'hover:bg-teal-900': disabledImport === true,
                            },
                          )}
                        >
                          Nhập hàng
                        </button>
                      ) : (
                        <button
                          className="`px-4 disabled:opacity-60  w-[132px] h-[44px] bg-teal-900 text-white  text-base p-2 rounded-[10px]  mt-1 mr-4 mb-2
                    `"
                          disabled
                        >
                          Nhập hàng
                        </button>
                      )}
                    </div>
                  </>
                )}
              {/* } */}
              {(+tabKey === 3 || +tabKey === 4) && (
                <>
                  <p className="text-[16px] font-bold text-teal-900 py-4 mr-5">Danh sách nhập hàng</p>
                  <div className="tableExtend overflow-x-auto">
                    <TableProduct
                      filterTax={filterTax}
                      dataInto={dataInto}
                      dataSource={dataInto}
                      expandedRowRender={expandedRowRender}
                      dataValueTable={dataValueTable}
                      data={data}
                      setIsLoadingPrint={setIsLoadingPrint}
                      tabKey={tabKey}
                    />
                  </div>
                </>
              )}
              {(view === 'admin' || +tabKey === 4) && (
                <>
                  {filterTax === taxApply?.APPLY ? (
                    <div className="flex justify-end flex-col  mt-[26px] w-full sm:w-[50%]  ml-auto">
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Tổng tiền hàng:</p>
                        {view === 'admin' ? (
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(+data?.total + data?.voucherAmount - +data?.totalTax, ' VND')}
                          </p>
                        ) : (
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(data?.totalReceived, ' VND')}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Tiền thuế:</p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(+data?.totalTax, ' VND')}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Tiền sau thuế:</p>
                        {view === 'admin' ? (
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(Math.round(+data?.total + data?.voucherAmount), ' VND')}
                          </p>
                        ) : (
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(Math.round(+data?.totalReceived + +data?.totalTax), ' VND')}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Chiết khấu: </p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(Math.round(+data?.voucherReceiptAmount), ' VND') + ' '}
                          {data?.voucher === null || data?.voucher?.voucherReceiptAmount
                            ? null
                            : caculatePrice().discountPercent}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Tổng tiền:</p>
                        {view === 'admin' ? (
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(Math.round(+data?.total), ' VND')}
                          </p>
                        ) : (
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(
                              Math.round(+data?.totalReceived + +data?.totalTax - +data?.voucherReceiptAmount),
                              ' VND',
                            )}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Đã trả nhà cung cấp:</p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(+data?.paymentSupplierOrder, ' VND')}
                        </p>
                      </div>
                      {caculatePrice().status !== 'PAID' && (
                        <>
                          <div className="flex justify-between">
                            <p className="text-teal-900 font-bold text-base">Số tiền thanh toán:</p>
                            <p className="text-slate-700 font-bold text-right">
                              <InputNumber
                                placeholder="Nhập số tiền"
                                value={paymentSupplier}
                                formatter={(value) => {
                                  if (!value) {
                                    return;
                                  }
                                  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                                }}
                                parser={(value) => {
                                  if (!value) {
                                    return;
                                  }
                                  return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
                                }}
                                onKeyDown={blockInvalidChar1}
                                className="input-payment input-number-quantity border w-[60%] h-[2.3rem] rounded-xl mt-1 text-right text-base"
                                onChange={(e) => {
                                  if (e > caculatePrice().totalAll - +data?.paymentSupplierOrder || e < 0) {
                                    setCheckPaymentSupplier(true);
                                  } else {
                                    setCheckPaymentSupplier(false);
                                  }
                                  setPaymentSupplier(parseFloat(e));
                                }}
                              />
                            </p>
                          </div>
                          {checkPaymentSupplier && (
                            <p className="text-red-500 text-right">
                              Số tiền nhập không được lớn hơn tổng số tiền cần thanh toán.
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-end flex-col  mt-[26px] w-full sm:w-[50%]  ml-auto">
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Tổng tiền hàng:</p>
                        {view === 'admin' ? (
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(caculatePriceNoTax().totalOrder, ' VND')}
                          </p>
                        ) : (
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(caculatePriceNoTax().totalReceived, ' VND')}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Chiết khấu: </p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(Math.round(caculatePriceNoTax().discount), ' VND') + ' '}
                          {data?.voucher === null || data?.voucher?.voucherReceiptAmount
                            ? null
                            : caculatePriceNoTax().discountPercent}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Tổng tiền:</p>
                        {view === 'admin' ? (
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(Math.round(caculatePriceNoTax().totalAll), ' VND')}
                          </p>
                        ) : (
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(Math.round(+caculatePriceNoTax().totalAll), ' VND')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
              {view === 'admin' ||
                (+tabKey !== 3 && +tabKey !== 4 && (
                  <>
                    {filterTax === taxApply?.APPLY ? (
                      <div className="flex justify-end flex-col mt-[26px] w-full sm:w-[50%] ml-auto">
                        <div className="flex justify-between">
                          <p className="text-teal-900 font-bold text-base">Tổng tiền hàng:</p>
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(+data?.total + data?.voucherAmount - +data?.totalTax, ' VND')}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-teal-900 font-bold text-base">Tiền thuế:</p>
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(data?.totalTax, ' VND')}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-teal-900 font-bold text-base">Tiền sau thuế:</p>
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(Math.round(+data?.total + data?.voucherAmount), ' VND')}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-teal-900 font-bold text-base">Chiết khấu: </p>
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(Math.round(data?.voucherAmount ?? 0), ' VND') + ' '}
                            {data?.voucher === null
                              ? null
                              : data?.voucher?.voucherType === 'PERCENT'
                              ? '(' + data?.voucher?.voucherValue + '%)'
                              : '(' +
                                ((data?.voucher?.voucherValue / (+data?.total + data?.voucherAmount)) * 100).toFixed(
                                  2,
                                ) +
                                '%)'}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-teal-900 font-bold text-base">Tổng tiền:</p>
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(Math.round(data?.total), ' VND')}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end flex-col  mt-[26px] w-full sm:w-[50%] ml-auto">
                        <div className="flex justify-between">
                          <p className="text-teal-900 font-bold text-base">Tổng tiền hàng:</p>
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(+caculatePriceNoTax().totalOrder, ' VND')}
                          </p>
                        </div>

                        <div className="flex justify-between">
                          <p className="text-teal-900 font-bold text-base">Chiết khấu: </p>
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(Math.round(data?.voucherAmount), ' VND') + ' '}
                            {data?.voucher === null
                              ? null
                              : data?.voucher?.voucherType === 'PERCENT'
                              ? '(' + data?.voucher?.voucherValue + '%)'
                              : '(' +
                                ((data?.voucher?.voucherValue / (+data?.total + data?.voucherAmount)) * 100).toFixed(
                                  2,
                                ) +
                                '%)'}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-teal-900 font-bold text-base">Tổng tiền:</p>
                          <p className="text-slate-700 font-bold text-base text-right">
                            {formatCurrency(Math.round(data?.total ?? 0), ' VND')}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ))}
              {tabKey === '3' && (
                <div>
                  {filterTax === taxApply?.APPLY ? (
                    <div className="flex justify-end flex-col  mt-[26px] w-full sm:w-[80%] ml-auto">
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base ">
                          Chiết khấu sẽ được áp dụng khi tổng tiền nhập hàng sau thuế đạt bằng hoặc lớn hơn:
                        </p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(caculatePrice().conditionApplyAmount, ' VND')}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base ">Tổng giá trị đơn hàng:</p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(caculatePrice().totalOrder, ' VND')}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Tổng giá trị nhập kho:</p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(caculatePrice().totalReceived, ' VND')}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Tiền thuế:</p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(caculatePrice().totalTax, ' VND')}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Tổng tiền nhập hàng sau thuế:</p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(caculatePrice().totalAfterTax, ' VND')}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">
                          Chiết khấu: {caculatePrice().discountPercent ? caculatePrice().discountPercent : null}
                        </p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(caculatePrice().discount, ' VND') + ' '}
                          {/* {caculatePrice().discountPercent} */}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Tổng cộng:</p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(caculatePrice().totalAll, ' VND')}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Số tiền thanh toán:</p>
                        <p className="text-slate-700 font-bold text-right">
                          <InputNumber
                            placeholder="Nhập số tiền"
                            defaultValue={paymentSupplier}
                            formatter={(value) => {
                              if (!value) {
                                return;
                              }
                              return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                            }}
                            parser={(value) => {
                              if (!value) {
                                return;
                              }
                              return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
                            }}
                            onKeyDown={blockInvalidChar1}
                            className="input-payment input-number-quantity border w-[60%] h-[2.3rem] rounded-xl mt-1 text-right text-base"
                            onChange={(e) => {
                              if (e > caculatePrice().totalAll || e < 0) {
                                setCheckPaymentSupplier(true);
                              } else {
                                setCheckPaymentSupplier(false);
                              }
                              setPaymentSupplier(parseFloat(e));
                            }}
                          />
                        </p>
                      </div>
                      {checkPaymentSupplier && (
                        <p className="text-red-500 text-right">
                          Số tiền nhập không được lớn hơn tổng số tiền cần thanh toán.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-end flex-col  mt-[26px] w-full sm:w-[80%] ml-auto">
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base ">
                          Chiết khấu sẽ được áp dụng khi tổng tiền nhập hàng sau thuế đạt bằng hoặc lớn hơn:
                        </p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(caculatePriceNoTax().conditionApplyAmount, ' VND')}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base ">Tổng giá trị đơn hàng:</p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(caculatePriceNoTax().totalOrder, ' VND')}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Tổng giá trị nhập kho:</p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(caculatePriceNoTax().totalReceived, ' VND')}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Chiết khấu:</p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(caculatePriceNoTax().discount, ' VND') + ' '}
                          {caculatePriceNoTax().discountPercent}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-teal-900 font-bold text-base">Tổng cộng:</p>
                        <p className="text-slate-700 font-bold text-base text-right">
                          {formatCurrency(caculatePriceNoTax().totalAll, ' VND')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {tabKey === '5' && (
            <>
              <hr className=" mt-5" />
              <p className="text-xl font-bold text-teal-900 py-4 mr-5">Thông tin hủy đơn</p>

              <div className="flex items-center  text-base cancel-order-info">
                <p className="font-bold text-black mb-2 w-[160px]">Hủy bởi:</p>
                <p className="mb-2">{cancelledByWho}</p>
              </div>
              <div className="flex items-center  text-base cancel-order-info">
                <p className="font-bold text-black mb-2 w-[160px]">Thời gian hủy đơn:</p>
                <p className="mb-2">{formatTime(data?.cancelledAt)}</p>
              </div>
              <div className="flex items-center  text-base cancel-order-info">
                <p className="font-bold text-black mb-2 w-[160px]">Lý do hủy đơn:</p>
                <p className="mb-2">{data?.cancelledReason}</p>
              </div>
            </>
          )}
          {view === 'admin' && status === 'CANCELLED' && (
            <>
              <hr className="mt-5" />
              <p className="text-xl font-bold text-teal-900 py-4 mr-5">Thông tin hủy đơn</p>

              <div className="flex items-center text-base cancel-order-info">
                <p className="font-bold text-black mb-2 w-[160px] cancel-order-info">Hủy bởi:</p>
                <p className="mb-2">{cancelledByWho}</p>
              </div>
              <div className="flex items-center text-base cancel-order-info">
                <p className="font-bold text-black mb-2 w-[160px] cancel-order-info">Thời gian hủy đơn:</p>
                <p className="mb-2">{formatTime(data?.cancelledAt)}</p>
              </div>
              <div className="flex items-center text-base cancel-order-info">
                <p className="font-bold text-black mb-2 w-[160px] cancel-order-info">Lý do hủy đơn:</p>
                <p className="mb-2">{data?.cancelledReason}</p>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-between mt-6 sm:ml-0 ml-4 items-center button-group">
          <div className="flex">
            {window?.location?.hash.includes('management') ? (
              <button
                onClick={() => {
                  window.history.back();
                }}
                className={`px-8 bg-white border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-[10px] text-teal-900 hover:text-teal-600 mt-1 h-10`}
                id="backBtn"
              >
                Trở về
              </button>
            ) : view === 'admin' && idSupplier ? (
              <button
                onClick={() => {
                  window.history.back();
                  // navigate(`${routerLinks('SupplierEdit')}?id=${idSupplier}&tab=3`);
                }}
                className={`px-8 bg-white border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-[10px] text-teal-900 hover:text-teal-600 mt-1 h-10 ${
          +tabKey === 3
            ? 'back-button-tab3'
            : +tabKey === 2
            ? 'back-button-tab2'
            : roleCode === 'OWNER_STORE' && +tabKey === 1
            ? 'back-button-storeView'
            : 'back-button'
        }`}
                id="backBtn"
              >
                Trở về
              </button>
            ) : (
              <button
                onClick={() => {
                  // navigate(`${routerLinks('OrderManagement')}`);
                  window.history.back();
                }}
                className={`px-8 bg-white border-teal-900 hover:border-teal-600 border-solid border
        text-base p-2 rounded-[10px] text-teal-900 hover:text-teal-600 lg:h-10 sm:mr-2 ${
          +tabKey === 3 && roleCode === 'OWNER_STORE'
            ? 'back-button-tab3-storeView'
            : +tabKey === 3 && roleCode !== 'OWNER_STORE'
            ? 'back-button-tab3'
            : +tabKey === 2
            ? 'back-button-tab2'
            : roleCode === 'OWNER_STORE' && +tabKey === 1
            ? 'back-button-storeView'
            : 'back-button'
        }`}
                id="backBtn"
              >
                Trở về
              </button>
            )}
          </div>
          <div>
            {+tabKey === 2 && roleCode === 'OWNER_STORE' && (
              <div className="flex justify-end items-center text-sm button-group-rightSide">
                <button
                  onClick={async () => {
                    setIsLoadingPrint(true);
                    const response = await SupplierService.printPurchaseOrder(idOrder);
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(new Blob([response], { type: response.type }));
                    link.target = '_blank';
                    // link.download = values.fileName || values.name;
                    link.download = `Phiếu đặt hàng - Mã đơn: ${data?.code}`;
                    document?.body?.appendChild(link);
                    link.click();
                    link?.parentNode?.removeChild(link);
                    setIsLoadingPrint(false);
                  }}
                  className="flex justify-center items-center gap-[10px] px-4 bg-transparent border border-solid border-teal-900 text-teal-900 text-base p-[6.5px] rounded-[10px] sm:mr-0 mr-4 print-button"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="print-svg hidden md:inline-block"
                  >
                    <path
                      d="M3.625 0.5V4.875H2.375C1.34717 4.875 0.5 5.72217 0.5 6.75V13H3.625V15.5H12.375V13H15.5V6.75C15.5 5.72217 14.6528 4.875 13.625 4.875H12.375V0.5H3.625ZM4.875 1.75H11.125V4.875H4.875V1.75ZM2.375 6.125H13.625C13.979 6.125 14.25 6.396 14.25 6.75V11.75H12.375V9.25H3.625V11.75H1.75V6.75C1.75 6.396 2.021 6.125 2.375 6.125ZM3 6.75C2.65576 6.75 2.375 7.03076 2.375 7.375C2.375 7.71924 2.65576 8 3 8C3.34424 8 3.625 7.71924 3.625 7.375C3.625 7.03076 3.34424 6.75 3 6.75ZM4.875 10.5H11.125V14.25H4.875V10.5Z"
                      fill="#134E4A"
                    />
                  </svg>
                  <span>In phiếu đặt hàng</span>
                </button>
              </div>
            )}
            <div className="flex flex-col md:flex-row">
              {+tabKey === 4 && roleCode === 'OWNER_STORE' && (
                <button
                  onClick={async () => {
                    setIsLoadingPrint(true);
                    const receivingNotes = dataOrderInvoice.filter(
                      (item) => item.typeOrderInvoice === 'RECEIVING_NOTE',
                    );
                    const NoteKey = receivingNotes[0]?.url;
                    if (NoteKey) {
                      const responsive = await SupplierService.downloadWhenCreateWithKey(NoteKey);
                      const link = document.createElement('a');
                      link.href = window.URL.createObjectURL(new Blob([responsive], { type: responsive.type }));
                      link.target = '_blank';
                      link.download = `Phiếu nhập hàng - Mã đơn: ${receivingNotes[0]?.code}`;
                      document.body.appendChild(link);
                      link.click();
                      link?.parentNode?.removeChild(link);
                    }

                    setIsLoadingPrint(false);
                  }}
                  className={` print-button-ex mb-2 md:mb-0 mr-0 md:mr-3 flex justify-center items-center gap-[10px] px-4 hover:bg-white bg-transparent border border-solid border-teal-900 font-size-[14px] text-teal-900 text-base p-[6.5px] rounded-[10px] ${
                    (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && 'mr-[18px] h-11 lg:h-10'
                  }`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="print-svg hidden md:inline-block"
                  >
                    <path
                      d="M3.625 0.5V4.875H2.375C1.34717 4.875 0.5 5.72217 0.5 6.75V13H3.625V15.5H12.375V13H15.5V6.75C15.5 5.72217 14.6528 4.875 13.625 4.875H12.375V0.5H3.625ZM4.875 1.75H11.125V4.875H4.875V1.75ZM2.375 6.125H13.625C13.979 6.125 14.25 6.396 14.25 6.75V11.75H12.375V9.25H3.625V11.75H1.75V6.75C1.75 6.396 2.021 6.125 2.375 6.125ZM3 6.75C2.65576 6.75 2.375 7.03076 2.375 7.375C2.375 7.71924 2.65576 8 3 8C3.34424 8 3.625 7.71924 3.625 7.375C3.625 7.03076 3.34424 6.75 3 6.75ZM4.875 10.5H11.125V14.25H4.875V10.5Z"
                      fill="#134E4A"
                    />
                  </svg>
                  <span>In phiếu nhập hàng</span>
                </button>
              )}
              {+tabKey === 4 && roleCode === 'OWNER_STORE' && caculatePrice().status !== 'PAID' && (
                <button
                  disabled={checkPaymentSupplier}
                  onClick={async () => {
                    const res = await SupplierService.paidSupplier(idOrder, paymentSupplier);
                    res &&
                      Message.success({
                        text: res.message,
                        title: 'Thành công',
                        cancelButtonText: 'Đóng',
                      });
                    return navigate(`${routerLinks('OrderManagement')}?tab=4`);
                  }}
                  className="print-button-ex px-4 bg-teal-900 text-white text-base p-2 rounded-[10px] hover:bg-teal-600 sm:mr-0 mr-4 confirm-order-button"
                >
                  Thanh toán
                </button>
              )}
            </div>
            {(tabKey === '1' && roleCode === 'OWNER_STORE') ||
            (tabKey === '1' && (roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR')) ? (
              <div className="flex justify-end items-center text-sm button-group-rightSide">
                {roleCode === 'OWNER_STORE' && (
                  <button
                    onClick={() => {
                      // idOrder
                      navigate(routerLinks('OrderEdit') + `?id=${idOrder}`);
                    }}
                    className={`px-4 bg-teal-900 text-white text-base p-2 rounded-[10px] hover:bg-teal-700 mr-4 cancel-order-button`}
                  >
                    Chỉnh sửa
                  </button>
                )}
                <button
                  onClick={async () => {
                    setIsLoadingPrint(true);
                    const response = await SupplierService.printPurchaseOrder(idOrder);
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(new Blob([response], { type: response.type }));
                    link.target = '_blank';
                    // link.download = values.fileName || values.name;
                    link.download = `Phiếu đặt hàng - Mã đơn: ${data.code}`;
                    document.body.appendChild(link);
                    link.click();
                    link?.parentNode?.removeChild(link);
                    setIsLoadingPrint(false);
                  }}
                  className="flex justify-center items-center gap-[10px] px-4 bg-transparent border border-solid border-teal-900 text-teal-900 text-base p-[6.5px] rounded-[10px] mr-4 print-button"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="print-svg hidden md:inline-block"
                  >
                    <path
                      d="M3.625 0.5V4.875H2.375C1.34717 4.875 0.5 5.72217 0.5 6.75V13H3.625V15.5H12.375V13H15.5V6.75C15.5 5.72217 14.6528 4.875 13.625 4.875H12.375V0.5H3.625ZM4.875 1.75H11.125V4.875H4.875V1.75ZM2.375 6.125H13.625C13.979 6.125 14.25 6.396 14.25 6.75V11.75H12.375V9.25H3.625V11.75H1.75V6.75C1.75 6.396 2.021 6.125 2.375 6.125ZM3 6.75C2.65576 6.75 2.375 7.03076 2.375 7.375C2.375 7.71924 2.65576 8 3 8C3.34424 8 3.625 7.71924 3.625 7.375C3.625 7.03076 3.34424 6.75 3 6.75ZM4.875 10.5H11.125V14.25H4.875V10.5Z"
                      fill="#134E4A"
                    />
                  </svg>
                  <span>In phiếu đặt hàng</span>
                </button>
                <button
                  onClick={() => {
                    cancel();
                  }}
                  className={`px-4 bg-red-500 text-white text-base p-2 rounded-[10px] hover:bg-red-400 sm:mr-0 ${
                    roleCode === 'OWNER_STORE' ? 'md:mr-0' : 'md:mr-4'
                  } mr-4 cancel-order-button`}
                >
                  Hủy đơn hàng
                </button>
                {(roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && (
                  <button
                    onClick={() => {
                      submit(idOrder);
                    }}
                    className="px-4 bg-teal-900 text-white text-base p-2 rounded-[10px] hover:bg-teal-600 sm:mr-0 mr-4 confirm-order-button"
                  >
                    Xác nhận đơn hàng
                  </button>
                )}
              </div>
            ) : tabKey === '2' ? (
              <div className="flex justify-end items-center text-sm button-group-rightSide">
                {(roleCode === 'OWNER_SUPPLIER' || roleCode === 'STORE_OWNER' || roleCode === 'DISTRIBUTOR') && (
                  <>
                    <button
                      onClick={async () => {
                        setIsLoadingPrint(true);
                        const response = await SupplierService.printPurchaseOrder(idOrder);
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(new Blob([response], { type: response.type }));
                        link.target = '_blank';
                        // link.download = values.fileName || values.name;
                        link.download = `Phiếu đặt hàng - Mã đơn: ${data.code}`;
                        document.body.appendChild(link);
                        link.click();
                        link?.parentNode?.removeChild(link);
                        setIsLoadingPrint(false);
                      }}
                      className="flex justify-center items-center gap-[10px] px-4 bg-transparent border border-solid border-teal-900 font-size-[14px] text-teal-900 text-base p-[6.5px] mr-[16px] rounded-[10px] print-button"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="print-svg hidden md:inline-block"
                      >
                        <path
                          d="M3.625 0.5V4.875H2.375C1.34717 4.875 0.5 5.72217 0.5 6.75V13H3.625V15.5H12.375V13H15.5V6.75C15.5 5.72217 14.6528 4.875 13.625 4.875H12.375V0.5H3.625ZM4.875 1.75H11.125V4.875H4.875V1.75ZM2.375 6.125H13.625C13.979 6.125 14.25 6.396 14.25 6.75V11.75H12.375V9.25H3.625V11.75H1.75V6.75C1.75 6.396 2.021 6.125 2.375 6.125ZM3 6.75C2.65576 6.75 2.375 7.03076 2.375 7.375C2.375 7.71924 2.65576 8 3 8C3.34424 8 3.625 7.71924 3.625 7.375C3.625 7.03076 3.34424 6.75 3 6.75ZM4.875 10.5H11.125V14.25H4.875V10.5Z"
                          fill="#134E4A"
                        />
                      </svg>
                      <span>In phiếu đặt hàng</span>
                    </button>
                    <button
                      onClick={() => {
                        haveShipped(idOrder);
                      }}
                      className="px-4 bg-teal-900 text-white text-base p-2 rounded-[10px] hover:bg-teal-600 abcbcbc shipped-button mr-1"
                    >
                      Đã chuyển hàng
                    </button>
                  </>
                )}
              </div>
            ) : tabKey !== '5' ? (
              <>
                <div className="flex justify-end items-end sm:mr-0 mr-4 text-sm button-group-tab3">
                  {(((roleCode === 'OWNER_SUPPLIER' || roleCode === 'DISTRIBUTOR') && +tabKey !== 4) ||
                    (roleCode === 'OWNER_STORE' && +tabKey !== 4)) && (
                    <button
                      onClick={async () => {
                        setIsLoadingPrint(true);
                        const response = await SupplierService.printPurchaseOrder(idOrder);
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(new Blob([response], { type: response.type }));
                        link.target = '_blank';
                        link.download = `Phiếu đặt hàng - Mã đơn: ${data.code}`;
                        document.body.appendChild(link);
                        link.click();
                        link?.parentNode?.removeChild(link);
                        setIsLoadingPrint(false);
                      }}
                      className={`flex justify-center items-center gap-[10px] px-4 bg-transparent border border-solid border-teal-900 font-size-[14px] text-teal-900 text-base p-[6.5px] rounded-[10px] ${
                        +tabKey === 3 ? 'print-button-tab3' : 'print-button'
                      } `}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="print-svg hidden md:inline-block"
                      >
                        <path
                          d="M3.625 0.5V4.875H2.375C1.34717 4.875 0.5 5.72217 0.5 6.75V13H3.625V15.5H12.375V13H15.5V6.75C15.5 5.72217 14.6528 4.875 13.625 4.875H12.375V0.5H3.625ZM4.875 1.75H11.125V4.875H4.875V1.75ZM2.375 6.125H13.625C13.979 6.125 14.25 6.396 14.25 6.75V11.75H12.375V9.25H3.625V11.75H1.75V6.75C1.75 6.396 2.021 6.125 2.375 6.125ZM3 6.75C2.65576 6.75 2.375 7.03076 2.375 7.375C2.375 7.71924 2.65576 8 3 8C3.34424 8 3.625 7.71924 3.625 7.375C3.625 7.03076 3.34424 6.75 3 6.75ZM4.875 10.5H11.125V14.25H4.875V10.5Z"
                          fill="#134E4A"
                        />
                      </svg>
                      <span>In phiếu đặt hàng</span>
                    </button>
                  )}
                  {roleCode === 'OWNER_STORE' &&
                    data?.orderPhase?.length > 0 &&
                    +tabKey === 3 &&
                    (caculatePrice().totalReceived > 0 || caculatePriceNoTax().totalReceived > 0) && (
                      <div className="ml-[16px]">
                        <button
                          disabled={checkPaymentSupplier}
                          onClick={async () => {
                            if (
                              (data?.status !== 'DELIVERY_RECEIVED' &&
                                data?.voucher !== null &&
                                caculatePrice().totalReceived < caculatePrice().conditionApplyAmount) ||
                              caculatePriceNoTax().totalReceived < caculatePriceNoTax().conditionApplyAmount
                            ) {
                              Message.confirm({
                                title: 'Thông báo',
                                html:
                                  '<p>Đơn hàng chưa được nhận đủ. Việc xuất phiếu có thể ảnh hướng đến chiết khấu ban đầu của đơn hàng.</p>' +
                                  '<p>Bạn có muốn tiếp tục việc xuất phiếu ?</p>',
                                width: '33em',
                                onConfirm: async () => {
                                  Message.confirm({
                                    title: 'Thông báo',
                                    html:
                                      '<p> Khi xuất phiếu nhập hàng, đơn hàng sẽ kết thúc và không thể nhập thêm đợt hàng bổ sung.</p>' +
                                      '<p>Bạn có muốn tiếp tục việc xuất phiếu không?</p>',
                                    width: '33em',
                                    onConfirm: async () => {
                                      setIsLoadingPrint(true);
                                      const data = await SupplierService.exportBillCombineCreating(
                                        idOrder,
                                        paymentSupplier,
                                      );
                                      if (data) {
                                        const NoteKey = data?.data?.key;
                                        const responsive = await SupplierService.downloadWhenCreateWithKey(NoteKey);
                                        const link = document.createElement('a');
                                        link.href = window.URL.createObjectURL(
                                          new Blob([responsive], { type: responsive.type }),
                                        );
                                        link.target = '_blank';
                                        link.download = `Phiếu nhập hàng - Mã đơn: ${data.code || 'Đang cập nhật'}`;
                                        document.body.appendChild(link);
                                        link.click();
                                        link?.parentNode?.removeChild(link);
                                        setIsLoadingPrint(false);
                                      }
                                      if (data === '') {
                                        return false;
                                      } else {
                                        return navigate(`${routerLinks('OrderManagement')}?tab=4`);
                                      }
                                    },
                                    confirmButtonText: 'Tiếp tục',
                                    cancelButtonText: 'Hủy',
                                    confirmButtonColor: '#134E4A',
                                  });
                                },
                                confirmButtonText: 'Tiếp tục',
                                cancelButtonText: 'Hủy',
                                confirmButtonColor: '#134E4A',
                              });
                            } else {
                              if (data && data?.orderLineItem?.filter((item) => item?.remainQuantity > 0)?.length > 0) {
                                Message.confirm({
                                  title: 'Thông báo',
                                  html:
                                    '<p> Khi xuất phiếu nhập hàng, đơn hàng sẽ kết thúc và không thể nhập thêm đợt hàng bổ sung.</p>' +
                                    '<p>Bạn có muốn tiếp tục việc xuất phiếu không?</p>',
                                  width: '33em',
                                  onConfirm: async () => {
                                    setIsLoadingPrint(true);
                                    const data = await SupplierService.exportBillCombineCreating(
                                      idOrder,
                                      paymentSupplier,
                                    );
                                    if (data) {
                                      const NoteKey = data?.data?.key;
                                      const responsive = await SupplierService.downloadWhenCreateWithKey(NoteKey);
                                      const link = document.createElement('a');
                                      link.href = window.URL.createObjectURL(
                                        new Blob([responsive], { type: responsive.type }),
                                      );
                                      link.target = '_blank';
                                      link.download = `Phiếu nhập hàng - Mã đơn: ${data.code || 'Đang cập nhật'}`;
                                      document.body.appendChild(link);
                                      link.click();
                                      link?.parentNode?.removeChild(link);
                                      setIsLoadingPrint(false);
                                    }
                                    if (data === '') {
                                      return false;
                                    } else {
                                      return navigate(`${routerLinks('OrderManagement')}?tab=4`);
                                    }
                                  },
                                  confirmButtonText: 'Tiếp tục',
                                  cancelButtonText: 'Hủy',
                                  confirmButtonColor: '#134E4A',
                                });
                              } else {
                                setIsLoadingPrint(true);
                                const data = await SupplierService.exportBillCombineCreating(idOrder, paymentSupplier);
                                if (data) {
                                  const NoteKey = data?.data?.key;
                                  const responsive = await SupplierService.downloadWhenCreateWithKey(NoteKey);
                                  const link = document.createElement('a');
                                  link.href = window.URL.createObjectURL(
                                    new Blob([responsive], { type: responsive.type }),
                                  );
                                  link.target = '_blank';
                                  link.download = `Phiếu nhập hàng - Mã đơn: ${data.code || 'Đang cập nhật'}`;
                                  document.body.appendChild(link);
                                  link.click();
                                  link?.parentNode?.removeChild(link);
                                  setIsLoadingPrint(false);
                                }
                                if (data === '') {
                                  return false;
                                } else {
                                  return navigate(`${routerLinks('OrderManagement')}?tab=4`);
                                }
                              }
                            }
                          }}
                          className={classNames(
                            'px-4 bg-teal-900 text-white text-base p-2 rounded-[10px] mt-1 export-button',
                            {
                              '!hover:bg-teal-600': checkPaymentSupplier,
                            },
                          )}
                        >
                          Xuất phiếu nhập hàng
                        </button>
                      </div>
                    )}
                </div>
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
