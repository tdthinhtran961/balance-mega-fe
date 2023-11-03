import { Form, Input, Table } from 'antd';
import classNames from 'classnames';
import { useAuth } from 'global';
import React, { useContext, useEffect, useRef, useState } from 'react';

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, handleEdit, ...restProps }) => {
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
      <Form.Item
        style={{
          margin: 10,
        }}
        name={dataIndex}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" id="editable-cell-value-wrap">
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const CategoryTable = ({
  dataSource,
  setIdCategory,
  handleSearch,
  handleSaveBreadcrumb,
  idCategory,
  isLoad,
  textTitle,
  pageType,
}) => {
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const [tKey, settKey] = useState('a');

  useEffect(() => {
    if (idCategory !== undefined) {
      const querySelector = document.querySelector(`.selected-${idCategory}`);
      if (querySelector !== null) {
        querySelector.classList.add('activeRow');
        querySelector.addEventListener('click', () => {
          querySelector.classList.add('activeRow');
        });
      }
    }
  }, [idCategory]);

  // useEffect(() => {
  //   if (dataSource.length > 0 && pageType === 'create') {
  //     const querySelector = document.querySelector(`.selected-${dataSource[0]?.id}`)
  //     if (querySelector !== null) {
  //       querySelector.classList.add('activeRow');
  //     }
  //     setIdCategory(dataSource[0]?.id)
  //     handleSaveBreadcrumb(dataSource[0])
  //   }
  // }, [dataSource, pageType])

  const handleSelected = (idKey) => {
    settKey(idKey);
  };

  const defaultColumns = [
    {
      title: () => false,
      dataIndex: 'name',
      width: '30%',
      editable: true,
      render: (_, record) => (
        <div className="flex items-center justify-between">
          <div
            id={`rowId-${record.id}`}
            className={`selected-${record.id} category-content w-full flex justify-between items-center !pr-0 text-sm font-normal text-gray-400 break-words gap-2`}
            onClick={() => {
              if (!record) return;
              handleSelected(record.id);
              const querySelector = document.querySelector(`.selected-${record.id}`);
              if (tKey !== 'a' && tKey !== record.id) {
                querySelector !== null && querySelector.classList.remove('activeRow');
              } else {
                querySelector.classList.add('activeRow');
              }
            }}
          >
            {record.name}
          </div>
        </div>
      ),
    },
  ];

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
      onCell: (record) => {
        return {
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
        };
      },
    };
  });
  return (
    <div className="">
      <h1
        className={classNames(
          'text-center py-2 px-[44px] bg-gray-100 text-sm text-teal-900 font-semibold rounded-t-lg border border-gray-200',
          { '!bg-teal-900 !text-white !font-medium': roleCode === 'OWNER_STORE'  },
        )}
      >
        {textTitle}
      </h1>
      <div className="relative">
        <Input
          placeholder="Tìm kiếm"
          className="w-full !bg-white pl-[30px] pr-[10px] py-[10px] !border !border-solid !border-gray-200 !rounded-none h-[36px] category-search"
          onPressEnter={handleSearch}
          onChange={handleSearch}
        />
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-[30%] left-[9px]"
        >
          <path
            d="M5.25 0.5C2.631 0.5 0.5 2.631 0.5 5.25C0.5 7.869 2.631 10 5.25 10C6.37977 10 7.41713 9.60163 8.2334 8.94043L12.8135 13.5205L13.5205 12.8135L8.94043 8.2334C9.60163 7.41713 10 6.37977 10 5.25C10 2.631 7.869 0.5 5.25 0.5ZM5.25 1.5C7.318 1.5 9 3.182 9 5.25C9 7.318 7.318 9 5.25 9C3.182 9 1.5 7.318 1.5 5.25C1.5 3.182 3.182 1.5 5.25 1.5Z"
            fill="#9CA3AF"
          />
        </svg>
      </div>

      <Table
        components={components}
        loading={isLoad}
        rowClassName={() => 'editable-row cursor-pointer'}
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{
          y: 400,
        }}
        className={`category-table border border-gray-200`}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              handleSaveBreadcrumb(record);
              setIdCategory(record.id);
              if (record.id !== idCategory) {
                const querySelector = document.querySelector(`.selected-${idCategory}`);
                querySelector !== null && querySelector.classList.remove('activeRow');
              }
            },
          };
        }}
      />
    </div>
  );
};

export default CategoryTable;
