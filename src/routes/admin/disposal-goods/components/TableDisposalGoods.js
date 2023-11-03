import { Form, Input, InputNumber, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { formatCurrency } from 'utils';
import '../index.less';

const EditableContext = React.createContext(null);
export const blockInvalidChar = (e) =>
{
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
    'Enter',
    'Tab',
  ];
  if (e.ctrlKey || e.metaKey) {
    chars = chars.concat(['a', 'c', 'x', 'v', 'y', 'z']);
  }
  return !chars.includes(e.key) && e.preventDefault();
}
export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  pageType,
  isValidate,
  ...restProps
}) => {
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
      <>
        {dataIndex === 'priceUnit' && (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `${title} là bắt buộc`,
              },
            ]}
          >
            <InputNumber
              readOnly={pageType === 'detail'}
              ref={inputRef}
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
              onKeyDown={blockInvalidChar}
              onPressEnter={save}
              onBlur={save}
              placeholder="Enter giá trị và Enter"
              className="percentInput h-9 !w-[163px] !rounded-xl !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
            />
          </Form.Item>
        )}

        {dataIndex === 'quantity' && (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `${title} là bắt buộc`,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value === 0) {
                    return Promise.reject(new Error('Vui lòng nhập giá trị lớn hơn 0'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber
              readOnly={pageType === 'detail'}
              ref={inputRef}
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
              onKeyDown={blockInvalidChar}
              onPressEnter={save}
              onBlur={save}
              placeholder="Nhập giá trị và Enter"
              className="percentInput h-9 !w-[138px] !rounded-xl !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
            />
          </Form.Item>
        )}
      </>
    ) : (
      <>
        {pageType === 'create' && (
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
              value={
                children[1] < 0 || children[1] === undefined || children[1] === null
                  ? undefined
                  : formatCurrency(children[1], ' ')
              }
              placeholder={'Nhập giá trị và Enter'}
              className={`h-9 !px-[11px] !rounded-xl !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 ${
                dataIndex === 'priceUnit' ? '!w-[163px]' : '!w-[138px]'
              }`}
            />
            {isValidate && <p> Trường bắt buộc nhập</p>}
          </div>
        )}
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
              onKeyDown={blockInvalidChar}
              value={children[1] < 0 || children[1] === undefined ? undefined : formatCurrency(children[1], ' ')}
              placeholder={'Nhập giá trị và Enter'}
              className={`h-9 !px-[11px] !rounded-xl !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 ${
                dataIndex === 'priceUnit' ? '!w-[163px]' : '!w-[138px]'
              }`}
            />
          </div>
        )}
        {pageType === 'detail' && (
          <div className="">{dataIndex === 'priceType' ? children : formatCurrency(children[1] || 0, '')}</div>
        )}
      </>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const TableDisposalGoods = ({ dataSource, setDataSource, pageType, isValidate, setDataOrder }) => {
  // const [isAdd, setIsAdd] = useState(false);

  // useEffect(() => {
  //   if (dataSource?.filter((i) => i?.minQuantity === 0 || i?.minQuantity === undefined || i?.minQuantity === null).length) {
  //     setIsAdd(true);
  //     return;
  //   }
  //   const newData = [...dataSource]?.filter((i) => i?.minQuantity !== 0);
  //   for (let i = 0; i < newData?.length; i++) {
  //     if (+newData[i]?.minQuantity >= +newData[i + 1]?.minQuantity) {
  //       setIsValidate(true);
  //       setIsAdd(true);
  //       return Message.error({ text: 'Số lượng tối thiểu phải lớn hơn số lượng vừa tạo' });
  //     } else {
  //       setIsValidate(false);
  //       setIsAdd(false);
  //     }
  //   }
  // }, [dataSource]);

  const handleDelete = (key) => {
    const newData = dataSource?.filter((item) => item.key !== key);
    setDataSource(newData);
    const removedItems = dataSource?.filter((item) => item.key === key).map((item) => ({ ...item, isDeleted: true }));
    setDataOrder((prev) => prev.concat(removedItems));
  };

  const defaultColumns = [
    {
      title: 'Mã vạch',
      dataIndex: 'code',
      align: 'start',
      width: 145,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: '100',
      render: (_, record) => (
        <div className="flex items-center">
          {/* <img
            src={pageType === 'create' ? record?.photos?.[0]?.url : record.image || record?.photos?.[0]?.url}
            alt=""
            className="w-[46px] h-[39px] object-cover rounded-[4px] overflow-hidden"
          /> */}
          <span className="">{record.name}</span>
        </div>
      ),
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplierName',
      width: 150,
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'unit',
      width: 100,
    },
    // {
    //   title: 'Đơn giá (VND)',
    //   dataIndex: 'priceUnit',
    //   editable: true,
    //   width: 200,
    // },
    {
      title: 'Số lượng hủy',
      dataIndex: 'quantity',
      editable: true,
      width: 160,
    },
    // {
    //   title: 'Thành tiền (VND)',
    //   dataIndex: 'totalPrice',
    //   render: (_, record) => {
    //     if (record.priceUnit === undefined || record.quantity === undefined) {
    //       return null;
    //     }
    //     return formatCurrency(+record.priceUnit * +record.quantity, ' ');
    //   },
    // },
    {
      title: '',
      dataIndex: 'isDeleted',
      width: 40,
      fixed: 'right',
      align: 'center',
      render: (_, record) =>
        dataSource.length >= 0 ? (
          <>
            {pageType === 'edit' && (
              <button
                className="text-2xl mr-2 text-red-500 removeBtn"
                onClick={() => handleDelete(record.key)}
                disabled={pageType === 'detail'}
              >
                <i className="las la-trash-alt"></i>
              </button>
            )}
          </>
        ) : null,
    },
  ];

  // const handleAdd = () => {
  //   // if (isAdd) return Message.error({ text: 'Số lượng tối thiểu phải lớn hơn số lượng vừa tạo' });
  //   const newData = {
  //     key: uuidv4(),
  //     // priceType: undefined,
  //     // minQuantity: undefined,
  //     // price: undefined,
  //   };
  //   setDataSource([...dataSource, newData]);
  //   return true;
  // };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];

    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
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
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        pageType,
        isValidate,
      }),
    };
  });
  return (
    <div className="">
      <Table
        className={`w-full table-disposal-goods `}
        components={components}
        rowClassName={() => 'editable-row'}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ x: '100%', y: null }}
        size="small"
      />
    </div>
  );
};

export default TableDisposalGoods;
