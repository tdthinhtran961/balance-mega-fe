import { Form, InputNumber, Table } from 'antd';
import React, { Fragment } from 'react';
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

const TableImportNonBalGoods = ({ dataSource, setDataSource, pageType }) => {
  const handleDelete = (key) => {
    const newData = dataSource?.filter((item) => item.id !== key);
    setDataSource(newData);
  };

  const defaultColumns = [
    {
      title: 'Mã vạch',
      dataIndex: 'code',
      align: 'left',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'basicUnit',
      align: 'left',
    },
    {
      title: 'Đơn giá (VND)',
      dataIndex: 'priceUnit',
      align: 'left',
      render: (text, record, index) => {
        return (
          <Form.Item
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
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
              value={text}
              onKeyDown={blockInvalidChar}
              onChange={(e) => {
                handleSave(e.target.value, record.id, 1);
              }}
              onPressEnter={(e) => handleSave(e.target.value, record.id, 1)}
              onBlur={(e) => handleSave(e.target.value, record.id, 1)}
              className="h-9 !w-[173px] !px-2 !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
              placeholder="Nhập giá trị"
            />
          </Form.Item>
        );
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'left',
      render: (text, record, index) => {
        return (
          <Form.Item
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
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
              value={text}
              onKeyDown={blockInvalidChar}
              onChange={(e) => {
                handleSave(e.target.value, record.id, 2);
              }}
              onPressEnter={(e) => handleSave(e.target.value, record.id, 2)}
              onBlur={(e) => handleSave(e.target.value, record.id, 2)}
              className="h-9 !w-[173px] !px-2 !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
              placeholder="Nhập giá trị"
            />
          </Form.Item>
        );
      },
    },
    {
      title: 'Thành tiền',
      dataIndex: 'beforeTaxMoney',
      align: 'left',
      render: (text, record, index) => {
        if (record.priceUnit === undefined || record.quantity === undefined) {
          return null;
        }
        return 1;
      },
    },
    {
      title: 'Thuế',
      dataIndex: 'tax',
      align: 'left',
    },
    {
      title: 'Tiền thuế',
      dataIndex: 'taxMoney',
      align: 'left',
      render: (text, record, index) => {
        if (record.priceUnit === undefined || record.quantity === undefined) {
          return null;
        }
        return record.beforeTaxMoney * record.tax;
      },
    },
    {
      title: 'Tiền sau thuế',
      dataIndex: 'afterTaxMoney',
      align: 'left',
      render: (text, record, index) => {
        if (record.priceUnit === undefined || record.quantity === undefined) {
          return null;
        }
        return record.taxMoney + record.beforeTaxMoney;
      },
    },
    {
      title: '',
      dataIndex: 'action',
      width: 40,
      fixed: 'right',
      align: 'center',
      render: (_, record) =>
        dataSource.length >= 1 && pageType !== 'detail' ? (
          <>
            <button className="text-2xl mr-2 text-red-500" onClick={() => handleDelete(record.id)}>
              <i className="las la-trash-alt"></i>
            </button>
          </>
        ) : null,
    },
  ];

  const handleSave = (value, key, type = 1) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.id);
    const item = newData[index];
    if (type === 1) {
      newData.splice(index, 1, { ...item, priceUnit: value });
    }
    if (type === 2) {
      newData.splice(index, 1, { ...item, quantity: value });
    }
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      // cell: EditableCell,
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
      }),
    };
  });
  return (
    <Fragment>
      <Table
        className={`w-full table-infomation-order`}
        components={components}
        rowClassName={() => 'editable-row'}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ x: '100%', y: null }}
        size="small"
      />
    </Fragment>
  );
};

export default TableImportNonBalGoods;
