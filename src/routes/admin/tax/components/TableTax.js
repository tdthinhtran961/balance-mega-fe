import { Form, Input, InputNumber, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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

export const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, pageType, ...restProps }) => {
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
      dataIndex === 'priceType' ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
        >
          <Input
            readOnly={pageType === 'detail'}
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            placeholder="Nhập loại giá"
            className=" h-9 !w-[171px] !rounded-xl !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
          />
        </Form.Item>
      ) : (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          <InputNumber
            // type="number"
            readOnly={pageType === 'detail'}
            ref={inputRef}
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
            onKeyDown={blockInvalidChar}
            onPressEnter={save}
            onBlur={save}
            placeholder="Nhập giá trị"
            className="percentInput h-9 !w-[171px] !rounded-xl !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
          />
        </Form.Item>
      )
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const TableTax = ({ dataSource, setDataSource, pageType }) => {
  const handleDelete = (key) => {
    const newData = dataSource?.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Thuế suất',
      dataIndex: 'tax',
      width: 200,
      editable: true,
      align: 'start',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      editable: true,
      width: 200,
    },
    {
      title: '',
      dataIndex: 'action',
      width: 40,
      fixed: 'right',
      align: 'center',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <>
            <div className='flex items-center'>
              <button className='mr-4'>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.9297 0.976562C15.1445 0.976562 14.3594 1.28125 13.75 1.89062L1.89062 13.75L1.84375 13.9844L1.02344 18.1094L0.789062 19.2109L1.89062 18.9766L6.01562 18.1562L6.25 18.1094L18.1094 6.25C19.3281 5.03125 19.3281 3.10938 18.1094 1.89062C17.5 1.28125 16.7148 0.976562 15.9297 0.976562ZM15.9297 2.40625C16.3076 2.40625 16.6885 2.5791 17.0547 2.94531C17.7842 3.6748 17.7842 4.46582 17.0547 5.19531L16.5156 5.71094L14.2891 3.48438L14.8047 2.94531C15.1709 2.5791 15.5518 2.40625 15.9297 2.40625ZM13.2344 4.53906L15.4609 6.76562L6.39062 15.8359C5.89844 14.875 5.125 14.1016 4.16406 13.6094L13.2344 4.53906ZM3.20312 14.8281C4.10254 15.1914 4.80859 15.8975 5.17188 16.7969L2.71094 17.2891L3.20312 14.8281Z" fill="#3B82F6" />
                </svg>

              </button>
              <button
                className="text-2xl mr-2 text-red-500 removeBtn"
                onClick={() => handleDelete(record.key)}
                disabled={pageType === 'detail'}
              >
                <i className="las la-trash-alt"></i>
              </button>

            </div>


          </>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData = {
      key: uuidv4(),
      tax: <Input placeholder="Enter" />,
      // minQuantity: undefined,
      // price: undefined,
    };
    setDataSource([...dataSource, newData]);
    return true;
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];

    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };
  // const handleEdit = () => {

  // }
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
      }),
    };
  });
  return (
    <div className="border-t border-t-gray-200">
      <div className="flex justify-between mb-[18px]">

        {pageType !== 'detail' && (
          <button
            className="w-[140px] h-9 leading-[36px] bg-teal-900 text-white text-sm rounded-[10px] hover:bg-teal-600 mt-[47px]"
            onClick={handleAdd}
          >
            <span className="text-base">+</span> Thêm giá
          </button>
        )}
      </div>

      <Table
        className={`w-full product-price-table unique-price ${pageType === 'detail' ? 'hidden-price' : null}`}
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

export default TableTax;
