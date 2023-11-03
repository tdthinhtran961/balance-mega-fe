import { Form, Input, Table } from 'antd';
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



const TableInformationOrder = ({ dataSource, setDataSource, pageType }) => {

  const handleDelete = (key) => {
    const newData = dataSource?.filter((item) => item.id !== key);
    setDataSource(newData);
  };

  const defaultColumns = [
    {
      title: 'STT',
      dataIndex: 'key',
      width: 80,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      align: 'start',
      render: (text, record, index) => {
        return (
          <div>
            {pageType !== 'detail' ? (
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
                <Input
                  value={text}
                  onChange={(e) => {
                    handleSave(e.target.value, record.id);
                  }}
                  onPressEnter={(e) => handleSave(e.target.value, record.id)}
                  onBlur={(e) => handleSave(e.target.value, record.id)}
                  className="h-9 !w-full !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
                  placeholder="Nhập nội dung"
                />
              </Form.Item>
            ) : (
              <span> {record.content ?? ''}</span>
            )}
          </div>
        );
      },
    },
    {
      title: 'File đính kèm',
      dataIndex: 'url',
      render: (text, record, index) => {
        return (
          <a href={text} target="_blank" className="text-blue-500 underline" rel="noreferrer">
            {text?.split('/')?.reverse()[0]}
          </a>
        );
      },
    },
    {
      title: '',
      dataIndex: 'action',
      width: 40,
      fixed: 'right',
      align: 'center',
      render: (_, record) =>
       (dataSource.length >= 1 && pageType !== 'detail') ? (
          <>
            <button
              className="text-2xl mr-2 text-red-500"
              onClick={() => handleDelete(record.id)}
            >
              <i className="las la-trash-alt"></i>
            </button>
          </>
        ) : null,
    },
  ];
  const defaultColumnsDetail = [
    {
      title: 'STT',
      dataIndex: 'key',
      width: 80,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      align: 'start',
      render: (text, record, index) => {
        return (
          <div>
            {pageType !== 'detail' ? (
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
                <Input
                  value={text}
                  onChange={(e) => {
                    handleSave(e.target.value, record.id);
                  }}
                  onPressEnter={(e) => handleSave(e.target.value, record.id)}
                  onBlur={(e) => handleSave(e.target.value, record.id)}
                  className="h-9 !w-full !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
                  placeholder="Nhập nội dung"
                />
              </Form.Item>
            ) : (
              <span> {record.content ?? ''}</span>
            )}
          </div>
        );
      },
    },
    {
      title: 'File đính kèm',
      dataIndex: 'url',
      render: (text, record, index) => {
        return (
          <a href={text} target="_blank" className="text-blue-500 underline" rel="noreferrer">
            {text?.split('/')?.reverse()[0]}
          </a>
        );
      },
    },

  ];
  const handleSave = (value, key) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, content: value });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      // cell: EditableCell,
    },
  };
  const columns = pageType  !== 'detail' ? ( defaultColumns.map((col) => {
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
  })) :(
    defaultColumnsDetail.map((col) => {
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
    })
  )
  return (
    <Fragment>
      <Table
        className={`w-full  table-infomation-order mb-5`}
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

export default TableInformationOrder;
