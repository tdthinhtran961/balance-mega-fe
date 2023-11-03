import React, { useEffect, useState } from 'react';
import { Form, Table, Input, Tooltip } from 'antd';
import { formatCurrency } from 'utils';
import '../index.less';
import { taxApply } from 'constants/index';
// import NoImage from 'assets/images/no-image-info.jpg';
// import { Message } from 'components';
// const EditableContext = React.createContext(null);
export const blockInvalidChar1 = (e) =>
  ![
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'Backspace',
    'Delete',
    // ',',
    // '.',
    'ArrowRight',
    'ArrowLeft',
    // 'Enter',
  ].includes(e.key) && e.preventDefault();

export const blockInvalidChar = (e) => {
  let chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'Backspace',
    'Delete',
    ',',
    '.',
    'ArrowRight',
    'ArrowLeft',
  ];
  if (e.ctrlKey || e.metaKey) {
    chars = chars.concat(['a', 'c', 'x', 'v', 'y', 'z']);
  }
  return !chars.includes(e.key) && e.preventDefault();
};
// export const EditableRow = ({ index, ...props }) => {
//   const [form] = Form.useForm();

//   return (
//     <Form form={form} component={false}>
//       <EditableContext.Provider value={form}>
//         <tr {...props} />
//       </EditableContext.Provider>
//     </Form>
//   );
// };

const TableImportProduct = ({
  dataSource,
  setDataSourceValue,
  tabKey,
  roles,
  checkAmount,
  setCheckAmount,
  filterTax,
}) => {
  const [showError, setShowError] = useState(null);
  const [arr, setArr] = useState([]);
  const roleCode = roles?.userInfor?.roleCode;
  const updateData = (value, record) => {
    if (value > 0) {
      setCheckAmount(false);
    }
    if (value.toString().length > 0) {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => record.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, { ...item, amount: value });
      setDataSourceValue(newData);
    }
    // if (value === 0) {
    //   form.setF
    // }
  };

  useEffect(() => {
    setArr(arr);
  }, [arr]);

  const defaultColumns =
    filterTax === taxApply.APPLY
      ? [
          {
            title: 'Mã vạch (CH)',
            dataIndex: 'storeBarCode',
            className: 'text-gray-700 border-none ',
            render: (text, record) => {
              return text !== null ? text : record?.storeBarcode;
            },
          },
          {
            title: 'Mã vạch (NCC)',
            dataIndex: 'barcode',
            className: 'text-gray-700',
          },
          // {
          //   title: 'Mã sản phẩm',
          //   dataIndex: 'code',
          //   className: 'text-gray-700 border-none',
          // },
          {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            className: 'text-gray-700  nameProduct ',
            render: (text, record) => {
              return (
                <Tooltip placement="topLeft" title={text} mouseEnterDelay={0.1} mouseLeaveDelay={0.1}>
                  <p className="line-clamp text-ellipsis p-0 font-medium break-all">{text}</p>
                </Tooltip>
              );
            },
          },
          {
            title: 'ĐVT',
            dataIndex: 'basicUnit',
            className: 'text-gray-700',
          },
          {
            title: 'Đơn giá',
            className: 'text-gray-700',
            dataIndex: 'price',
            render: (text) => formatCurrency(text, ''),
          },
          {
            title: 'Số lượng',
            dataIndex: 'quantity',
            className: 'text-gray-700',
            render: (text) => text.toLocaleString('vi-VN'),
          },
          {
            title: 'Thành tiền',
            dataIndex: 'totalPrice',
            className: 'text-gray-700',
            render: (_, record) => {
              if (record.price === undefined || record.quantity === undefined) {
                return null;
              }
              return formatCurrency(+record.price * +record.quantity, ' ');
            },
          },

          {
            title: 'Thuế',
            dataIndex: 'tax',
            key: 'tax',
            className: 'text-gray-700',
            render: (text) => {
              return text && text + '%';
            },
            // wd
          },
          {
            title: 'Tiền sau thuế',
            dataIndex: 'remainQuantity',
            key: 'remainQuantity',
            className: 'text-gray-700',
            render: (text, record) => {
              return (
                record &&
                formatCurrency(
                  Math.round(+record.quantity * record.price + +record.quantity * record.price * (record.tax / 100)),
                  '',
                )
              );
            },
          },
          {
            title: 'Đã nhận',
            dataIndex: 'totalReceived',
            key: 'totalReceived',
            className: 'text-gray-700',
            render: (text) => text.toLocaleString('vi-VN'),
            // wd
          },
          {
            title: 'Còn lại',
            dataIndex: 'remainQuantity',
            key: 'remainQuantity',
            className: 'text-gray-700',
            render: (text) => text.toLocaleString('vi-VN'),
          },

          {
            title: '',
            dataIndex: 'amount',
            className: 'text-gray-700 ',
            key: 'amount',
            render: (a, record, index) => {
              return (
                tabKey === '3' && (
                  // <Form form={form}>
                  <Form.Item
                    name={'amount'}
                    className=""
                    rules={
                      [
                        // ({ getFieldValue }) => ({
                        //   validator(_, value) {
                        // if (+value <= +record.remainQuantity && record.id) {
                        //   return Promise.resolve();
                        // } else {
                        //   return Promise.reject(new Error(' Số lượng nhập đã vượt quá số lượng còn lại.'));
                        // }
                        //   },
                        // }),
                        // {
                        //   required: true,
                        //   message: 'Vui lòng nhập giá trị hợp lệ'
                        // }
                      ]
                    }
                  >
                    {record.remainQuantity !== 0 ? (
                      <div>
                        <Input
                          type="number"
                          placeholder="Nhập hàng"
                          // oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null"
                          onChange={(e) => {
                            const preval = Number(parseFloat(e.target.value).toFixed(2));
                            // if (preval === 0 || preval === '') {
                            //   setShowError(index);
                            //   arr.push(index);
                            //   const uniqueArray = [...new Set(arr)];
                            //   setArr(uniqueArray);
                            //   updateData(preval, record);
                            // } else {
                            setShowError(null);
                            const removeIndex = arr.filter((item) => item !== index);
                            const uniqueArray = [...new Set(removeIndex)];
                            setArr(uniqueArray);
                            updateData(preval, record);
                            // }
                          }}
                          // onBlur={(e) => {
                          //   const preval = Number(e.target.value);
                          //   if (preval === 0 || preval === '') {
                          //     setShowError(true);
                          //   } else {
                          //     setShowError(false);
                          //     updateData(preval, record);
                          //   }
                          // }}
                          min={0}
                          onKeyDown={blockInvalidChar}
                          className={`border-2 border-solid text-right w-[119px] h-[36px] mt-4 rounded-[0.75rem] pr-2`}
                        />
                        {/* <div className="text-red-500">Vui lòng nhập số lượng</div> */}
                        {/* {checkAmount && Message.error({ text: "vui lòng nhập số lượng" })} */}
                      </div>
                    ) : (
                      <Input
                        placeholder="Nhập hàng"
                        className={`border border-solid text-center w-[119px] h-[36px] rounded-[0.625rem] mt-4 `}
                        disabled
                      />
                    )}
                    {arr.map((i, index) => {
                      if (arr[index] === record.key) {
                        return (
                          <span
                            key={index}
                            className="text-red-500 absolute right-0 my-1 sm:mb-0 mb-4 z-10 whitespace-nowrap"
                          >
                            Vui lòng nhập giá trị hợp lệ
                          </span>
                        );
                      } else return false;
                    })}
                  </Form.Item>
                )
              );
            },
          },
        ]
      : [
          {
            title: 'Mã vạch (CH)',
            dataIndex: 'storeBarCode',
            className: 'text-gray-700 border-none ',
            render: (text, record) => {
              return text !== null ? text : record?.storeBarcode;
            },
          },
          {
            title: 'Mã vạch (NCC)',
            dataIndex: 'barcode',
            className: 'text-gray-700',
          },
          // {
          //   title: 'Mã sản phẩm',
          //   dataIndex: 'code',
          //   className: 'text-gray-700 border-none',
          // },
          {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            className: 'text-gray-700  nameProduct ',
            render: (text, record) => {
              return (
                <Tooltip placement="topLeft" title={text} mouseEnterDelay={0.1} mouseLeaveDelay={0.1}>
                  <p className="line-clamp text-ellipsis p-0 font-medium">{text}</p>
                </Tooltip>
              );
            },
          },
          {
            title: 'ĐVT',
            dataIndex: 'basicUnit',
            className: 'text-gray-700',
          },
          {
            title: 'Đơn giá',
            className: 'text-gray-700',
            dataIndex: 'price',
            render: (text) => formatCurrency(text, ''),
          },
          {
            title: 'Số lượng',
            dataIndex: 'quantity',
            className: 'text-gray-700',
            render: (text) => text.toLocaleString('vi-VN'),
          },
          {
            title: 'Thành tiền',
            dataIndex: 'totalPrice',
            className: 'text-gray-700',
            render: (_, record) => {
              if (record.price === undefined || record.quantity === undefined) {
                return null;
              }
              return formatCurrency(+record.price * +record.quantity, ' ');
            },
          },
          {
            title: 'Đã nhận',
            dataIndex: 'totalReceived',
            key: 'totalReceived',
            className: 'text-gray-700',
            // wd
          },
          {
            title: 'Còn lại',
            dataIndex: 'remainQuantity',
            key: 'remainQuantity',
            className: 'text-gray-700',
            render: (text) => text.toLocaleString('vi-VN'),
          },

          {
            title: '',
            dataIndex: 'amount',
            className: 'text-gray-700 ',
            key: 'amount',
            render: (a, record, index) => {
              return (
                tabKey === '3' && (
                  // <Form form={form}>
                  <Form.Item
                    name={'amount'}
                    className=""
                    rules={
                      [
                        // ({ getFieldValue }) => ({
                        //   validator(_, value) {
                        // if (+value <= +record.remainQuantity && record.id) {
                        //   return Promise.resolve();
                        // } else {
                        //   return Promise.reject(new Error(' Số lượng nhập đã vượt quá số lượng còn lại.'));
                        // }
                        //   },
                        // }),
                        // {
                        //   required: true,
                        //   message: 'Vui lòng nhập giá trị hợp lệ'
                        // }
                      ]
                    }
                  >
                    {record.remainQuantity !== 0 ? (
                      <div>
                        <Input
                          type="number"
                          placeholder="Nhập hàng"
                          // oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null"
                          onChange={(e) => {
                            const preval = Number(e.target.value);
                            if (preval === 0 || preval === '') {
                              setShowError(index);
                              updateData(preval, record);
                            } else {
                              setShowError(null);
                              updateData(preval, record);
                            }
                          }}
                          // onBlur={(e) => {
                          //   const preval = Number(e.target.value);
                          //   if (preval === 0 || preval === '') {
                          //     setShowError(true);
                          //   } else {
                          //     setShowError(false);
                          //     updateData(preval, record);
                          //   }
                          // }}
                          min={0}
                          onKeyDown={blockInvalidChar}
                          className={`border-2 border-solid text-right w-[119px] h-[36px] mt-4 rounded-[0.75rem]`}
                        />
                        {/* <div className="text-red-500">Vui lòng nhập số lượng</div> */}
                        {/* {checkAmount && Message.error({ text: "vui lòng nhập số lượng" })} */}
                      </div>
                    ) : (
                      <Input
                        placeholder="Nhập hàng"
                        className={`border border-solid text-center w-[119px] h-[36px] rounded-[0.625rem] mt-4 `}
                        disabled
                      />
                    )}
                    {showError === record.key && (
                      <span className="text-red-500 absolute right-0 my-1 sm:mb-0 mb-4 z-10 whitespace-nowrap">
                        Vui lòng nhập giá trị hợp lệ
                      </span>
                    )}
                  </Form.Item>
                )
              );
            },
          },
        ];
  const defaultColumns1 =
    filterTax === taxApply.APPLY
      ? [
          {
            title: 'Mã vạch (CH)',
            dataIndex: 'storeBarcode',
            className: 'text-gray-700 border-none ',
            render: (text, record) => {
              return text !== null ? text : record.storeBarCode;
            },
          },
          {
            title: 'Mã vạch (NCC)',
            dataIndex: 'barcode',
            className: 'text-gray-700',
          },
          // {
          //   title: 'Mã sản phẩm',
          //   dataIndex: 'code',
          //   className: 'text-gray-700',
          // },
          {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            className: 'text-gray-700  nameProduct ',
            render: (text, record) => {
              return (
                <Tooltip placement="topLeft" title={text} mouseEnterDelay={0.1} mouseLeaveDelay={0.1}>
                  <p className="line-clamp text-ellipsis p-3 font-medium truncate">{text}</p>
                </Tooltip>
              );
            },
          },
          {
            title: 'Đơn vị tính',
            dataIndex: 'basicUnit',
            className: 'text-gray-700',
          },
          {
            title: 'Đơn giá (VND)',
            className: 'text-gray-700',
            dataIndex: 'price',
            render: (text) => formatCurrency(text, ''),
          },
          {
            title: 'Số lượng',
            dataIndex: 'quantity',
            className: 'text-gray-700',
            render: (text) => text.toLocaleString('vi-VN'),
          },
          {
            title: 'Thành tiền (VND)',
            dataIndex: 'totalPrice',
            className: 'text-gray-700',
            render: (_, record) => {
              if (record.price === undefined || record.quantity === undefined) {
                return null;
              }
              return formatCurrency(+record.price * +record.quantity, ' ');
            },
          },
          {
            title: 'Thuế',
            dataIndex: 'tax',
            key: 'tax',
            className: 'text-gray-700',
            render: (text) => {
              return text && text + '%';
            },
            // wd
          },
          {
            title: 'Tiền sau thuế',
            dataIndex: 'remainQuantity',
            key: 'remainQuantity',
            className: 'text-gray-700',
            render: (text, record) => {
              return (
                record &&
                formatCurrency(
                  +record.quantity * +record.price + +record.quantity * +record.price * (record.tax / 100),
                  '',
                )
              );
            },
          },
        ]
      : [
          {
            title: 'Mã vạch (CH)',
            dataIndex: 'storeBarcode',
            className: 'text-gray-700 border-none ',
            render: (text, record) => {
              return text !== null ? text : record.storeBarCode;
            },
          },
          {
            title: 'Mã vạch (NCC)',
            dataIndex: 'barcode',
            className: 'text-gray-700',
          },
          // {
          //   title: 'Mã sản phẩm',
          //   dataIndex: 'code',
          //   className: 'text-gray-700',
          // },
          {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            className: 'text-gray-700  nameProduct ',
            render: (text, record) => {
              return (
                <Tooltip placement="topLeft" title={text} mouseEnterDelay={0.1} mouseLeaveDelay={0.1}>
                  <p className="line-clamp text-ellipsis p-3 font-medium">{text}</p>
                </Tooltip>
              );
            },
          },
          {
            title: 'Đơn vị tính',
            dataIndex: 'basicUnit',
            className: 'text-gray-700',
          },
          {
            title: 'Đơn giá (VND)',
            className: 'text-gray-700',
            dataIndex: 'price',
            render: (text) => formatCurrency(text, ''),
          },
          {
            title: 'Số lượng',
            dataIndex: 'quantity',
            className: 'text-gray-700',
            render: (text) => text.toLocaleString('vi-VN'),
          },
          {
            title: 'Thành tiền (VND)',
            dataIndex: 'totalPrice',
            className: 'text-gray-700',
            render: (_, record) => {
              if (record.price === undefined || record.quantity === undefined) {
                return null;
              }
              return formatCurrency(+record.price * +record.quantity, ' ');
            },
          },
        ];
  // const handlesavedata = (row) => {
  //   const newData = [...dataSource];
  //   const index = newData.findIndex((item) => row.key === item.key);
  //   const item = newData[index];
  //   newData.splice(index, 1, { ...item, ...row });
  //   setDataSourceValue(newData);
  // };
  const columns =
    +tabKey === 3 && (roleCode === 'OWNER_STORE' )
      ? defaultColumns.map((col) => {
          return {
            ...col,
            onCell: (record) => ({
              record,
              editable: col.editable,
              title: col.title,
              key: col.key,
            }),
          };
        })
      : defaultColumns1.map((col) => {
          return {
            ...col,
            onCell: (record) => ({
              record,
              editable: col.editable,
              title: col.title,
              key: col.key,
            }),
          };
        });
  const components = {
    body: {
      // row: EditableRow,
      // cell: EditableCell,
    },
  };

  return (
    <div className="">
      {/* <Form form={form} onFinish={onFinishQuantity} > */}
      <Table
        components={components}
        className={`w-[100%] tableImport  h-auto  `}
        rowClassName={() => 'table-row'}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ x: '100%', y: null }}
        size="small"
      />
      {/* </Form> */}
    </div>
  );
};
export default TableImportProduct;
