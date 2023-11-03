import React, { useState, useRef, useEffect, useContext } from 'react';
import { Form, Table, Input } from 'antd';
import './index.less';
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
  export const blockInvalid = (e) =>
  [
    '/',
    '.',
    ',',
    '[',
    ']',
    '\\',
    "'",
    ';',
    "(",
    ')',
    '!',
    '@','#',"$",'~','`','%','^','&'
  ].includes(e.key) && e.preventDefault();
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
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
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
      [dataIndex]: record[dataIndex]
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
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
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
const TableImportProduct = ({ listArrcheckQuantity, pageType, unitChange }) => {
  const [form] = Form.useForm()
  const defaultColumns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      className: 'text-gray-700 font-bold break-words',
      width: 200
    },
    pageType !== 'edit' &&
    {
      title: 'Nhà cung cấp',
      dataIndex: 'basicUnit',
      className: 'text-gray-700 font-bold',
      width: 190,
      render: (a, record) => {
        return record?.subOrg?.name
      }
    },
    pageType === 'edit' && {
      title: 'Nhà cung cấp',
      dataIndex: 'basicUnit',
      className: 'text-gray-700 font-bold',
      width: 190,
      render: (a, record) => {
        return record?.supplier?.name
      }
    },
    pageType !== 'edit' &&
    {
      title: 'Số lượng trong kho',
      dataIndex: 'quantityInBal',
      className: 'text-gray-700 font-bold',
      key: 'amount',
      width: 180,
      render : (text, record, index) => {
        return record.inventoryProductUnits[unitChange[index]].quantityBal.toLocaleString('vi-VN');
      }
    },
    pageType === 'edit' && {
      title: 'Số lượng trong kho',
      dataIndex: 'quantityInBal',
      className: 'text-gray-700 font-bold',
      key: 'amount',
      width: 180,
      render : (text, record, index) => {
        return record.inventoryProductUnits[unitChange[index]].quantityBal.toLocaleString('vi-VN');
      }
    },
    {
      title: 'Số lượng trả',
      className: 'text-gray-700 font-bold',
      dataIndex: 'quantityUnit',
      width: 180,
      render : (text) => text.toLocaleString('vi-VN')
    },
  ];

  const columns = defaultColumns.map((col) => {
    return {
      ...col,
      onCell: (record) => ({
        record,
        // dataIndex: col.dataIndex,
        editable: col.editable,
        title: col.title,
        key: col.key,
        // handlesavedata,
      }),
    };
  });
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  return (
    <div className='table-checkquantity'>
      <div className=' text-3xl font-medium text-center text-teal-900'> Thông Báo  </div>
      <p className=' text-center mt-4 font-medium text-base'>Số lượng trả vượt quá số lượng trong kho.</p>
      <hr className="mt-10"></hr>
      <div className='mt-2 text-teal-900 text-base ml-[24px]'>Danh sách sản phẩm có số lượng trả hàng vượt quá số lượng trong kho:</div>
      <div className="">
        <Form form={form}>
          <Table
            components={components}
            className={` table-quantity  h-auto ml-4 `}
            rowClassName={() => 'table-row border'}
            dataSource={listArrcheckQuantity}
            columns={columns}
            pagination={false}
            scroll={{ x: '100%', y: null }}
            size="small"
          />
        </Form>
      </div>
    </div>
  );
};
export default TableImportProduct;
