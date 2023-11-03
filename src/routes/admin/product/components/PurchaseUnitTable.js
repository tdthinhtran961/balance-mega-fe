import { Form, Input, Table, InputNumber } from 'antd';
import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { formatCurrency } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import { blockInvalidChar } from '../func';
import { Unit } from 'services/unit';
import '../index.less';

const EditableContext = React.createContext(null);

export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      component={false}
    // onFinishFailed={({ errorFields }) =>
    //   errorFields.length && form.scrollToField(errorFields[0].name, { behavior: 'smooth' })
    // }
    // validateTrigger="onChange"
    >
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, pageType, rowIndex, data, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      dataIndex === 'price' || dataIndex === 'basePrice' ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: 'Đây là trường bắt buộc.',
            },
          ]}
        >
          <InputNumber
            // type="number"
            readOnly={pageType === 'detail' || dataIndex === 'basePrice'}
            ref={inputRef}
            formatter={(value) => {
              if (!value) {
                return;
              }
              return `${Number.parseFloat(value).toFixed(0)}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }}
            parser={(value) => {
              if (!value) {
                return;
              }
              return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, '')).toFixed(2);
            }}
            // defaultValue={(dataIndex === 'basePrice' && data?.isActive && +data?.productDetail?.basePrice !== 0 && data?.basicData) ? +data?.productDetail?.basePrice : undefined}
            onKeyDown={blockInvalidChar}
            onPressEnter={save}
            onBlur={save}
            onChange={(e) => {
              const newData = [...data.data];
              if (dataIndex === 'basePrice') {
                if (newData[rowIndex].unit === data?.basicData?.name) {
                  data?.setIsUnitChange(true);
                  newData[rowIndex].basePrice = +e;
                  data.setData(newData);
                }
              } else if (dataIndex === 'price' && newData[rowIndex].unit === data?.basicData?.name) {
                data?.setPurchasePrice(+e)
              }
            }}
            placeholder="Nhập giá trị"
            className="percentInput h-9 !w-full !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 !shadow-none"
          />
        </Form.Item>
      ) : dataIndex === 'barcode' ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          // rules={
          //   dataIndex !== 'barcode'
          //     ? [
          //       {
          //         required: true,
          //         message: 'Đây là trường bắt buộc.',
          //       },
          //     ]
          //     : [
          //       {
          //         type: 'custom',
          //         validator: (form) => ({
          //           validator: async (rule, value) => {
          //             if (value?.toString()?.length > 13) {
          //               return Promise.reject(new Error('Vui lòng nhập tối đa 13 ký tự.'));
          //             } else return Promise.resolve();
          //           },
          //         }),
          //       },
          //     ]
          // }
          rules={[
            {
              type: 'custom',
              validator: (form) => ({
                validator: async (rule, value) => {
                  if (value?.toString()?.length > 13) {
                    return Promise.reject(new Error('Vui lòng nhập tối đa 13 ký tự.'));
                  } else return Promise.resolve();
                },
              }),
            },
          ]}
        >
          <Input
            type='number'
            readOnly={pageType === 'detail'}
            ref={inputRef}
            onKeyDown={blockInvalidChar}
            onPressEnter={save}
            onBlur={save}
            onChange={(e) => {
              const newData = [...data.data];
              newData[rowIndex].barcode = e.target.value;
              data.setData(newData);
              if (newData[rowIndex].unit === data?.basicData?.name) {
                data.setDataSource((prev) => ({
                  ...prev,
                  storeBarcode: e.target.value,
                }));
              }
            }}
            value={data?.data[rowIndex]?.barcode}
            placeholder="Nhập giá trị"
            className={classNames(
              'h-9 !w-full !px-2 !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200',
              {
                // '!w-[112px]': dataIndex === 'unit',
                // '!w-[122px]': dataIndex === 'exchangeValue',
                // '!w-[123px]': dataIndex === 'purchasePrice',
                // '!w-[116px]': dataIndex === 'price',
                // '!w-[124px]': dataIndex === 'code',
              },
            )}
          />
        </Form.Item>
      ) : (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          // rules={
          //   dataIndex !== 'barcode'
          //     ? [
          //       {
          //         required: true,
          //         message: 'Đây là trường bắt buộc.',
          //       },
          //     ]
          //     : [
          //       {
          //         type: 'custom',
          //         validator: (form) => ({
          //           validator: async (rule, value) => {
          //             if (value?.toString()?.length > 13) {
          //               return Promise.reject(new Error('Vui lòng nhập tối đa 13 ký tự.'));
          //             } else return Promise.resolve();
          //           },
          //         }),
          //       },
          //     ]
          // }
          rules={[
            {
              required: true,
              message: 'Đây là trường bắt buộc.',
            },
          ]}
        >
          <Input
            readOnly={pageType === 'detail' || rowIndex + 1 <= data?.productDetail?.retailPrice?.length}
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === ',') {
                e.key = '.';
              }
              blockInvalidChar(e);
            }}
            onPressEnter={save}
            onBlur={save}
            onChange={(e) => {
              const newData = [...data.data];
              if (newData[rowIndex].unit && newData[rowIndex].unit !== 'undefined' && newData[rowIndex].unit !== 'null' && newData[rowIndex].unit === data?.basicData?.name) {
                newData[rowIndex].coefficient = +e.target.value;
                data.basicData.conversionValue = +e.target.value;
              } else if (data?.isActive) {
                newData[rowIndex].coefficient = +e.target.value;
                newData[rowIndex].basePrice = +data.productDetail.basePrice / data.basicData.conversionValue * +e.target.value;
                data.setData(newData);
              } else {
                newData[rowIndex].coefficient = +e.target.value;
                newData[rowIndex].basePrice = +data?.productDetail?.basePrice * +e.target.value;
              }
              data?.setIsUnitChange(true);
            }}
            placeholder="Nhập giá trị"
            className={classNames(
              'h-9 !w-full !px-2 !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200',
              {
                // '!w-[112px]': dataIndex === 'unit',
                // '!w-[122px]': dataIndex === 'exchangeValue',
                // '!w-[123px]': dataIndex === 'purchasePrice',
                // '!w-[116px]': dataIndex === 'price',
                // '!w-[124px]': dataIndex === 'code',
              },
            )}
          />
        </Form.Item>
      )
    ) : (
      <>
        {pageType === 'edit' && (
          <div
            onKeyPress={(e) => {
              if (e.key) {
                toggleEdit();
              }
            }}
            onKeyDown={(e) => {
              if (e.key) {
                toggleEdit();
              }
            }}
            onClick={toggleEdit}
          >
            <Input
              readOnly={(dataIndex === 'coefficient' || dataIndex === 'basePrice') && rowIndex + 1 <= data?.productDetail?.retailPrice?.length}
              onKeyDown={blockInvalidChar}
              value={
                dataIndex === 'barcode'
                  ? data?.data[rowIndex]?.barcode || children[1]
                  : dataIndex === 'coefficient'
                    ? children[1]
                    : children[1] < 0 || children[1] === undefined
                      ? undefined
                      : formatCurrency(children[1], '')
              }
              defaultValue={(dataIndex === 'basePrice' && data?.isActive && data?.productDetail?.retailPrice?.length === 0) ? formatCurrency(+data?.productDetail?.basePrice, '') : undefined}
              placeholder={'Nhập giá trị'}
              className={classNames(
                'arrReadonly  checkHidden h-9 !rounded-[10px] !px-2 !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 !w-full',
              )}
            />
          </div>
        )}
        {pageType === 'detail' && (
          <div className="ml-4">
            {dataIndex === 'unit' || dataIndex === 'barcode' || dataIndex === 'coefficient'
              ? children
              : formatCurrency(children[1] || 0, '')}
          </div>
        )}
      </>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const PurchaseUnitTable = ({ data, setData, pageType, setDataSource, purchasePrice, setPurchasePrice, productDetail, basicUnit }) => {
  const handleDelete = (key) => {
    const newData = data?.filter((item) => item.key !== key);
    setData(newData);
  };
  
  const listUnit1 = useRef();
  
  useEffect(async () => {
    const { data } = await Unit.getUnitChild();
    listUnit1.current = data;
  }, [])
  
  const units = useRef([])
  
  const getNextUnitByUnit1 = async (unit1) => {
    const { data } = await Unit.getUnitParentByChild(unit1.parentId);
    units.current = [unit1, ...data];
  }
  
  const [isUnitChange, setIsUnitChange] = useState(false);
  const basicData = useRef({
    name: basicUnit?.trim(), 
    conversionValue: 1,
  });
  
  useEffect(() => {
    if (isUnitChange) {
      if (inputRef.current) {
        const index = productDetail.retailPrice.length === 0
          ? units.current.findIndex(e => e.name.trim().toLowerCase() === basicUnit.trim().toLowerCase())
          : productDetail.retailPrice.findIndex(e => e.unit.trim().toLowerCase() === basicUnit.trim().toLowerCase());
        const baseUnit = index !== -1 ? data[index] : data[data.length - 1];
        data.forEach((e, i) => {
          if (i !== index) {
            e.basePrice = (baseUnit?.coefficient) ? +baseUnit?.basePrice / baseUnit.coefficient * e.coefficient : undefined;
          }
          handleSave(e);
        })
      } else {
        data.forEach(e => handleSave(e))
      }
      setIsUnitChange(false);
    }
  }, [isUnitChange])

  const inputRef = useRef();
  
  const checkInputUnit1 = async (value, record, index) => {
    if (index === 0 && inputRef.current) {
      const unit = listUnit1.current.find(e => {
        return e.name.trim().toLowerCase() === value.trim().toLowerCase()
      });
      if (unit) {
        await getNextUnitByUnit1(unit);
        if (value) {
          if (units.current.length > 0) {
            setData([]);
            const indexBasicUnit = units.current.findIndex(e => e.name.trim().toLowerCase() === basicUnit.trim().toLowerCase());
            for (let i = 0; i < units.current.length; i++) {
              const coefficient = units.current[i].conversionValue;
              const unitName = units.current[i].name;
              const params = {
                unit: unitName, 
                coefficient: coefficient,
                isActive: i === 0,
                barcode: productDetail.barcode,
                basePrice: productDetail.basePrice * coefficient,
              }
              if (indexBasicUnit !== -1) {
                basicData.current = units.current[indexBasicUnit];
                if (indexBasicUnit === i) {
                  handleAdd({ 
                    ...params,
                    basePrice: productDetail.basePrice, 
                    code: productDetail.code, 
                  }, true);
                } else {
                  handleAdd({ 
                    ...params,
                    basePrice: productDetail.basePrice / basicData.current.conversionValue * coefficient,
                  });
                }
              } else {
                handleAdd(params);
              }
            }
          }
        }
      } else {
        setData((prev) => [prev[0], { 
          unit: basicUnit.trim(), 
          coefficient: 1,
          isActive: true,
          barcode: productDetail.barcode,
          basePrice: productDetail.basePrice, 
          code: productDetail.code, 
        }]);
        handleAdd();
      }
    } else {
      const newData = [...data];
      newData[index].unit = value;
      setData((prev) => newData);
    }
  }

  useEffect(() => {
    const defaultChecked = async () => {
      if (productDetail?.retailPrice?.length === 0) {
        await data;
        if (units.current && inputRef.current) {
          inputRef.current = document.getElementById("unit-0");
        }
      } else {
        const index = productDetail?.retailPrice?.findIndex((e) => e.isActive);
        inputRef.current = document.getElementById(`unit-${index}`);
      }
      if (inputRef.current) {
        inputRef.current.checked = true;
      }
    }
    defaultChecked();
  }, [units.current])

  useEffect(() => {
    if (inputRef.current) {
      const index = +inputRef.current.id.split("").reverse()[0];
      const newData = data.map((e, i) => {
        return { ...e, isActive: i === index };
      })
      setData(newData);
    }
  }, [inputRef.current])

  const defaultColumns = [
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      width: 150,
      render: (_, record, index) => {
        return (
          <>
            <Input
              readOnly={pageType === 'detail' || index + 1 <= productDetail?.retailPrice?.length}
              onChange={(e) => {
                if (pageType !== 'detail' && index + 1 > productDetail?.retailPrice?.length) {
                  checkInputUnit1(e.target.value, record, index);
                }
              }}
              placeholder="Nhập đơn vị"
              onPressEnter={(e) => {
                if (pageType !== 'detail' && index + 1 > productDetail?.retailPrice?.length) {
                  checkInputUnit1(e.target.value, record, index);
                }
              }}
              onBlur={(e) => {
                if (pageType !== 'detail' && index + 1 > productDetail?.retailPrice?.length) {
                  checkInputUnit1(e.target.value, record, index);
                }
              }}
              className={classNames(
                `selectUnit w-full h-9 !px-2 !py-0 !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200`,
              )}
              defaultValue={data[index].unit ?? undefined}
            />
          </>
        )
      }
    },
    {
      title: 'Giá trị quy đổi',
      dataIndex: 'coefficient',
      editable: true,
      width: 150,
    },
    {
      title: 'Giá gốc (VND)',
      dataIndex: 'basePrice',
      editable: true,
      width: 150,
    },
    {
      title: 'Giá bán (VND)',
      dataIndex: 'price',
      editable: true,
      width: 150,
    },
    {
      title: 'Mã vạch (CH)',
      dataIndex: 'barcode',
      editable: true,
      width: 150,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'code',
      width: 150,
    },
    {
      title: 'Đơn vị chính',
      dataIndex: 'isActive',
      align: 'center',
      width: 100,
      render: (_, record, index) => {
        return (
          <>
            <input
              className='unitInput hidden'
              type="radio"
              name='isActive'
              id={`unit-${index}`}
              onClick={(e) => {
                if (inputRef.current === e.target) {
                  e.target.checked = false;
                  inputRef.current = null;
                } else {
                  inputRef.current = e.target;
                }
                handleSave({...record, isActive: e.target.checked})
              }}
              disabled={pageType === 'detail' || productDetail.retailPrice?.length > 0}
              // checked={productDetail.retailPrice?.length > 0 && productDetail.retailPrice.findIndex((e) => e.isActive) === index}
            />
            <label htmlFor={`unit-${index}`} className={`inline-flex items-center ${pageType !== 'detail' && productDetail.retailPrice?.length === 0 ? 'cursor-pointer' : ''}`}>
              <div className="bg-white border-2 rounded border-gray w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">  
                <svg className="hidden w-3 h-3 text-blue-400 pointer-events-none" version="1.1" viewBox="0 0 17 12" xmlns="http://www.w3.org/2000/svg">  
                <g fill="none" fillRule="evenodd">  
                  <g transform="translate(-9 -11)" fill="#1F73F1" fillRule="nonzero">  
                  <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />  
                  </g>  
                </g>  
                </svg>  
              </div>
            </label>
          </>
        )
      }
    },
    {
      title: '',
      dataIndex: 'action',
      fixed: pageType !== 'detail' ? 'right' : null,
      width: 50,
      align: 'center',
      render: (_, record, index) =>
        (productDetail?.retailPrice?.length === 0 && data.length >= 2)
          || (productDetail?.retailPrice?.length > 0 && index + 1 > productDetail?.retailPrice?.length) 
        ? (
          <>
            {pageType !== 'detail' && (
              <button
                className="text-2xl mr-2 text-red-500 removeBtn"
                onClick={() => {
                  handleDelete(record.key);
                  if (inputRef.current && inputRef.current.id === `unit-${index}`) {
                    inputRef.current = null;
                  }
                }}
                disabled={pageType === 'detail'}
              >
                <i className="las la-trash-alt"></i>
              </button>
            )}
          </>
        ) : null,
    },
  ];

  const handleAdd = (value, isBasic = false) => {
    if (value) {
      const newData = Object.keys(value).length === 0 ? {
        key: uuidv4(),
        isActive: false,
        barcode: productDetail.barcode,
      } : {
        ...value,
        key: uuidv4(),
      };
      setData((prev) => {
        const result = [...prev.splice(0, prev.length - 1), newData];
        if (!isBasic && inputRef.current) {
          basicData.current = {
            name: basicUnit.trim(), 
            conversionValue: 1,
          };
          result.push({
            unit: basicData.current.name,
            coefficient: prev[prev.length - 1]?.coefficient || basicData.current.conversionValue,
            isActive: true,
            barcode: productDetail.barcode,
            basePrice: prev[prev.length - 1]?.basePrice || productDetail.basePrice, 
            code: productDetail.code, 
          });
        }
        return result;
      });
    }
    return true;
  };

  const handleSave = (row) => {
    setData((prev) => {
      const newData = [...prev];
      const index = newData.findIndex((item) => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row });
      return newData;
    });
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record, rowIndex) => ({
        rowIndex,
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        pageType,
        data: {
          data: data,
          setData: setData,
          setDataSource: setDataSource,
          basicData: basicData.current,
          setIsUnitChange: setIsUnitChange,
          units: units.current,
          purchasePrice: purchasePrice,
          setPurchasePrice: setPurchasePrice,
          productDetail: productDetail,
          isActive: !!inputRef.current,
        }
      }),
    };
  });
  return (
    <div className=''>
      <div className="flex justify-end mb-[18px]">
        {pageType !== 'detail' && (
          <button
            className="w-[140px] h-9 leading-[36px] bg-teal-900 text-white text-sm rounded-[10px] hover:bg-teal-600 mt-[47px]"
            onClick={(e) => handleAdd({})}
          >
            <span className="text-base">+</span> Thêm đơn vị
          </button>
        )}
      </div>

      <Table
        className={`w-full purchaseUnitPrice unique-price ${pageType === 'detail' ? 'hidden-price' : null}`}
        components={components}
        rowClassName={() => 'editable-row'}
        dataSource={data}
        columns={columns}
        pagination={false}
        scroll={{ x: '100%', y: null }}
        size="medium"
      />
    </div>
  );
};

export default PurchaseUnitTable;
