import { Form, Input, InputNumber, Table } from 'antd';
import { Message } from 'components';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { formatCurrency } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import { blockInvalidChar } from '../func';

const EditableContext = React.createContext(null);

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
      dataIndex === 'revenue' ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
        >
          <InputNumber
            formatter={value => {
              if (!value) {
                return;
              }
              return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }}
            parser={value => {
              if (!value) {
                return;
              }
              return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ""))
            }}
            min={0}
            onKeyDown={blockInvalidChar}
            readOnly={pageType === 'detail'}
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            placeholder="Nhập giá trị"
            className="percentInput h-9 !w-[163px] !rounded-[10px]  !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
          />
        </Form.Item>
      ) : (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
        >
          <InputNumber
            formatter={value => {
              if (!value) {
                return;
              }
              return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }}
            parser={value => {
              if (!value) {
                return;
              }
              return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ""))
            }}
            readOnly={pageType === 'detail'}
            min={0}
            onKeyDown={blockInvalidChar}
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            placeholder="Nhập giá trị"
            className="percentInput h-9 !w-full !rounded-[10px]  !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
          />
        </Form.Item>
      )
    ) : (
      <>
        {pageType === 'create' && (
          <div
            onKeyPress={(e) => {
              if (e.key) {
                toggleEdit()
              }
            }}
            onKeyDown={(e) => {
              if (e.key) {
                toggleEdit()
              }
            }}
            onClick={toggleEdit}
          >
            <Input
              value={children[1] <= 0 || children[1] === undefined ? undefined : formatCurrency(children[1], ' ')}
              placeholder="Nhập giá trị"
              className={`h-9 !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 arrReadonly ${dataIndex === 'revenue' ? '!w-[163px]' : '!w-full'}`}
            />

          </div>
        )}
        {pageType === 'edit' && (
          <div
            onKeyPress={(e) => {
              if (e.key) {
                toggleEdit()
              }
            }}
            onKeyDown={(e) => {
              if (e.key) {
                toggleEdit()
              }
            }}
            onClick={toggleEdit}
          >
            <Input
              value={children[1] <= 0 || children[1] === undefined ? undefined : formatCurrency(children[1], ' ')}
              placeholder="Nhập giá trị"
              className={`h-9 !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 arrReadonly ${dataIndex === 'revenue' ? '!w-[163px]' : '!w-full'}`}
            />

          </div>
        )}
        {pageType === 'detail' && <div
          className="ml-4"
        >
          {formatCurrency(children[1] || 0, '')}
        </div>
        }
      </>

    );
  }

  return <td {...restProps}>{childNode}</td>;
};



const ProductDiscountByMoney = ({ setRevenueMoneyArr, revenueMoneyArr, pageType, setIsValidate }) => {
  const [isAdd, setIsAdd] = useState(false)
  const [empty, setEmpty] = useState(false)
  useEffect(() => {
    if (revenueMoneyArr?.filter(i => i?.revenue === 0 || i?.revenue === undefined || i?.revenue === null).length) {
      setEmpty(true)
      return;
    } else {
      setEmpty(false)
    }
    const newData = [...revenueMoneyArr]?.filter(i => i?.revenue !== 0)
    for (let i = 0; i < newData?.length; i++) {
      if (+newData[i]?.revenue >= +newData[i + 1]?.revenue) {
        setIsValidate((prev) => ({ ...prev, tableRevenue: true }))
        setIsAdd(true)
        return Message.error({ text: 'Doanh thu phải lớn hơn doanh thu vừa tạo' })
      } else {
        setIsValidate((prev) => ({ ...prev, tableRevenue: false }))
        setIsAdd(false)
      }
    }
  }, [revenueMoneyArr])

  const handleDelete = (key) => {
    const newData = revenueMoneyArr.filter((item) => item.key !== key);
    setRevenueMoneyArr(newData)
  };

  const defaultColumns = [
    {
      title: 'STT',
      dataIndex: 'key',
      width: 40,
      align: 'center',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Doanh thu (VNĐ)',
      dataIndex: 'revenue',
      width: 150,
      editable: true,
    },
    {
      title: 'Số tiền chiết khấu (VNĐ)',
      dataIndex: 'amountBalance',
      width: 250,
      editable: true,
    },
    {
      title: '',
      dataIndex: 'action',
      width: 30,
      fixed: 'right',
      align: 'center',
      render: (_, record) =>
        revenueMoneyArr.length >= 1 ? (
          <>{
            pageType !== 'detail' && <button className="text-2xl mr-2 text-red-500 removeBtn" onClick={() => handleDelete(record.key)} disabled={pageType === 'detail'}>
              <i className="las la-trash-alt"></i>
            </button>
          }
          </>
        ) : null,
    },
  ];

  const handleAdd = () => {
    if (empty) return Message.error({ text: 'Doanh thu là bắt buộc' })
    if (isAdd) return Message.error({ text: 'Doanh thu phải lớn hơn doanh thu vừa tạo' })
    const newData = {
      key: uuidv4(),

    };
    setRevenueMoneyArr([...revenueMoneyArr, newData]);
  };

  const handleSave = (row) => {
    const newData = [...revenueMoneyArr];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setRevenueMoneyArr(newData)
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
        pageType
      }),
    };
  });
  return (
    <div className=''>
      <div className="flex justify-end items-center mb-4 mt-4">
        {pageType !== 'detail' && (
          <button
            className="w-[160px] h-9 leading-[36px] bg-teal-900 text-white text-sm rounded-[10px] hover:bg-teal-600"
            onClick={handleAdd}
          >
            <span className="text-base">+</span> Thêm chiết khấu
          </button>
        )}
      </div>

      <Table
        className='w-full product-price-table'
        components={components}
        rowClassName={() => 'editable-row'}
        dataSource={revenueMoneyArr}
        columns={columns}
        pagination={false}
        scroll={{ x: '100%', y: null }}
        size="small"

      />
    </div>
  );
};

export default ProductDiscountByMoney;
