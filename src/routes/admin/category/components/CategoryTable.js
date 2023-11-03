import { Button, Form, Input, Table, Tooltip } from 'antd';
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
        rules={[
          {
            required: true,
            message: `Không được để trống`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} className=" h-10 w-full" onBlur={() => setEditing(false)} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap h-full w-full"
        id="editable-cell-value-wrap"
        onDoubleClick={() => handleEdit(toggleEdit())}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const CategoryTable = ({
  dataSource,
  setDataSource,
  handleSearch,
  setIdParent,
  idParent,
  isDisabled,
  type,
  handleSave,
  handleDelete,
  handleAdd,
  onScroll,
  scrollRef,
  className,
  loading,
  setDisabled,
  first,
  search,
  valueSearch,
  setValueSearch,
}) => {
  const [tKey, settKey] = useState('a');
  const [showAddInput, setShowAddInput] = useState(false);
  const [showValidate, setShowValidate] = useState(false);

  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  const [categoryAdd, setCategoryAdd] = useState('');

  // useEffect(() => {
  //   if (idParent !== undefined) {
  //     if (document.querySelector(`.abc${idParent}`) === null) {
  //       return 1;
  //     } else {
  //       document.querySelector(`.abc${idParent}`).classList.add('activeRow');
  //       document.querySelector(`.abc${idParent}`).addEventListener('click', () => {
  //         document.querySelector(`.abc${idParent}`).classList.add('activeRow');
  //       });
  //     }
  //   }
  // }, [idParent])

  // useEffect(async () => {
  //   let isMounted = false
  //   const fetchFirstRowData = async () => {
  //     try {
  //       if (dataSource.length > 0) {
  //         if(!isMounted){

  //           document.querySelector(`.abc${dataSource[0].id}`).click();
  //           // setIdParent(dataSource[0].id)
  //         }
  //       }
  //     } catch (error) {

  //     }
  //   };
  //   fetchFirstRowData();
  //   return () => {
  //     isMounted = true
  //   }
  // }, [dataSource, loading]);

  // useEffect(async () => {
  //   const fetchFirstRowData = async () => {
  //     try {
  //       // if (dataSource[0] === undefined) return 1;
  //       if (dataSource[0]) {
  //         await document.querySelector(`.abc${dataSource[0].id}`).click();
  //         await setIdParent(dataSource[0].id);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchFirstRowData();
  // }, [dataSource, loading]);

  useEffect(() => {
    if (showAddInput === false) {
      setShowValidate(false);
    }
  }, [showAddInput]);

  useEffect(() => {
    if (!idParent) {
      setShowAddInput(false);
    }
  }, [idParent]);

  const handleSelected = (idKey) => {
    settKey(idKey);
  };

  const handleEdit = (record) => {
    if (record?.id === undefined) return;
    const targLink = document.querySelector(`.abc${record.id}`);
    const clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('dblclick', true, true);
    targLink.addEventListener('dblclick', (e) => {}, false);
    targLink.dispatchEvent(clickEvent);
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
            className={`abc${record.id} category-content w-full flex justify-between items-center !pr-0 text-sm font-normal text-gray-400 break-words gap-2`}
            onClick={() => {
              if (!record) return;
              handleSelected(record.id);
              if (tKey !== 'a' && tKey !== record.id) {
                if (document.querySelector(`.abc${tKey}`) === null) {
                  document.querySelector(`.abc${record.id}`).classList.remove('activeRow');
                } else {
                  document.querySelector(`.abc${tKey}`).classList.remove('activeRow');
                }
              } else {
                document.querySelector(`.abc${record.id}`).classList.add('activeRow');
              }
              document.querySelector(`.abc${record.id}`).classList.add('activeRow');
            }}
          >
            {record.name}
            <Tooltip
              placement="top"
              trigger="click"
              className="cursor-pointer flex-none category-tooltip"
              color="white"
              title={
                <div className="flex flex-col">
                  <button
                    className=" w-full py-[6px] px-4 rounded-t-lg hover:bg-gray-200"
                    onClick={() => handleEdit(record)}
                  >
                    <div className="flex items-center gap-2">
                      <svg width="11" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10.9531 0.984375C10.4297 0.984375 9.90625 1.1875 9.5 1.59375L1.59375 9.5L1.5625 9.65625L1.01562 12.4062L0.859375 13.1406L1.59375 12.9844L4.34375 12.4375L4.5 12.4062L12.4062 4.5C13.2188 3.6875 13.2188 2.40625 12.4062 1.59375C12 1.1875 11.4766 0.984375 10.9531 0.984375ZM10.9531 1.9375C11.2051 1.9375 11.459 2.05273 11.7031 2.29688C12.1895 2.7832 12.1895 3.31055 11.7031 3.79688L11.3438 4.14062L9.85938 2.65625L10.2031 2.29688C10.4473 2.05273 10.7012 1.9375 10.9531 1.9375ZM9.15625 3.35938L10.6406 4.84375L4.59375 10.8906C4.26562 10.25 3.75 9.73438 3.10938 9.40625L9.15625 3.35938ZM2.46875 10.2188C3.06836 10.4609 3.53906 10.9316 3.78125 11.5312L2.14062 11.8594L2.46875 10.2188Z"
                          fill="#6B7280"
                        />
                      </svg>

                      <span style={{color: '#6B7280'}}>Chỉnh sửa</span>
                    </div>
                  </button>
                  <hr />
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="py-[6px] px-4 rounded-b-lg hover:bg-gray-200"
                    // type="primary"
                  >
                    <div className="flex items-center justify-center gap-2 ">
                      <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4.5 0C4.23828 0 3.9707 0.091797 3.78125 0.28125C3.5918 0.470703 3.5 0.738281 3.5 1V1.5H0.5V2.5H1V10.5C1 11.3223 1.67773 12 2.5 12H8.5C9.32227 12 10 11.3223 10 10.5V2.5H10.5V1.5H7.5V1C7.5 0.738281 7.4082 0.470703 7.21875 0.28125C7.0293 0.091797 6.76172 0 6.5 0H4.5ZM4.5 1H6.5V1.5H4.5V1ZM2 2.5H9V10.5C9 10.7773 8.77734 11 8.5 11H2.5C2.22266 11 2 10.7773 2 10.5V2.5ZM3 4V9.5H4V4H3ZM5 4V9.5H6V4H5ZM7 4V9.5H8V4H7Z"
                          fill="#6B7280"
                        />
                      </svg>
                      <span style={{color: '#6B7280'}}>Xóa danh mục</span>
                    </div>
                  </button>
                </div>
              }
            >
              <svg
                width="4"
                height="12"
                viewBox="0 0 2 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M1 0C0.447266 0 0 0.447266 0 1C0 1.55273 0.447266 2 1 2C1.55273 2 2 1.55273 2 1C2 0.447266 1.55273 0 1 0ZM1 4C0.447266 4 0 4.44727 0 5C0 5.55273 0.447266 6 1 6C1.55273 6 2 5.55273 2 5C2 4.44727 1.55273 4 1 4ZM1 8C0.447266 8 0 8.44727 0 9C0 9.55273 0.447266 10 1 10C1.55273 10 2 9.55273 2 9C2 8.44727 1.55273 8 1 8Z"
                  fill="#9CA3AF"
                />
              </svg>
            </Tooltip>
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
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        handleEdit,
      }),
    };
  });

  return (
    <div className="category-parent">
      <div className="relative">
        <Input
          // allowClear
          placeholder="Tìm kiếm"
          className="w-full !bg-white pl-[30px] pr-[10px] py-[10px] border border-solid border-gray-200 h-[36px] category-search"
          onPressEnter={handleSearch}
          onChange={handleSearch}
          value={valueSearch}
          id="category-search"
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
        // rowClassName={() => `editable-row`}
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{
          y: 400,
        }}
        loading={loading}
        rowClassName={(record, index) => console.log()}
        className={`category-table border border-gray-200 ${className}`}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setIdParent(record.id);
            },
          };
        }}
        ref={scrollRef}
        // onScroll={onScroll}
      />

      {showAddInput && (
        <div className="relative">
          <Form.Item
            id="my_form"
            rules={[
              {
                required: true,
                message: `Không được để trống`,
              },
            ]}
            onReset={() => form.reset()}
          >
            <Input
              ref={inputRef}
              autoFocus={true}
              className="w-full !bg-white p-[10px] border border-solid border-gray-200 h-[36px] category-add rounded-b-lg relative"
              id="category-add"
              onPressEnter={(e) => {
                handleAdd(e.target.value).then(() => setCategoryAdd(''));
              }}
              value={categoryAdd}
              // onBlur={() => setShowAddInput(false)}
              onChange={async (e) => {
                if (e.target.value && e.target.value.trim().length === 0) {
                  setShowValidate(true);
                } else {
                  setShowValidate(false);
                  setCategoryAdd(e.target.value);
                }
              }}
            />

            <div
              className={`absolute ${showValidate ? 'top-[17%]' : 'top-[28%]'} right-[10px] cursor-pointer`}
              onClick={() => {
                setCategoryAdd('');
              }}
            >
              <svg
                width="13"
                height="14"
                viewBox="0 0 11 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-45 scale-125"
              >
                <path
                  d="M10.1667 5.33268H6.16666V1.33268C6.16666 1.15587 6.09642 0.986302 5.97139 0.861278C5.84637 0.736254 5.6768 0.666016 5.49999 0.666016C5.32318 0.666016 5.15361 0.736254 5.02859 0.861278C4.90356 0.986302 4.83332 1.15587 4.83332 1.33268V5.33268H0.833323C0.656512 5.33268 0.486943 5.40292 0.361919 5.52794C0.236895 5.65297 0.166656 5.82254 0.166656 5.99935C0.166656 6.17616 0.236895 6.34573 0.361919 6.47075C0.486943 6.59578 0.656512 6.66602 0.833323 6.66602H4.83332V10.666C4.83332 10.8428 4.90356 11.0124 5.02859 11.1374C5.15361 11.2624 5.32318 11.3327 5.49999 11.3327C5.6768 11.3327 5.84637 11.2624 5.97139 11.1374C6.09642 11.0124 6.16666 10.8428 6.16666 10.666V6.66602H10.1667C10.3435 6.66602 10.513 6.59578 10.6381 6.47075C10.7631 6.34573 10.8333 6.17616 10.8333 5.99935C10.8333 5.82254 10.7631 5.65297 10.6381 5.52794C10.513 5.40292 10.3435 5.33268 10.1667 5.33268Z"
                  fill="#134E4A"
                />
              </svg>
            </div>
            {showValidate && <span className="text-red-500">Không được để trống</span>}
          </Form.Item>
        </div>
      )}

      <div className="mt-1">
        {showAddInput === false ? (
          <Button
            className="h-[44px] w-full border border-dashed border-teal-900 !bg-white !text-teal-900 flex items-center justify-center gap-[6px]"
            onClick={() => {
              setShowAddInput(true);
            }}
            type="primary"
            disabled={!idParent}
          >
            {/* {showAddInput ? (
            <div className="flex items-center justify-center gap-[6px]">
              <svg
                width="13"
                height="14"
                viewBox="0 0 11 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-45"
              >
                <path
                  d="M10.1667 5.33268H6.16666V1.33268C6.16666 1.15587 6.09642 0.986302 5.97139 0.861278C5.84637 0.736254 5.6768 0.666016 5.49999 0.666016C5.32318 0.666016 5.15361 0.736254 5.02859 0.861278C4.90356 0.986302 4.83332 1.15587 4.83332 1.33268V5.33268H0.833323C0.656512 5.33268 0.486943 5.40292 0.361919 5.52794C0.236895 5.65297 0.166656 5.82254 0.166656 5.99935C0.166656 6.17616 0.236895 6.34573 0.361919 6.47075C0.486943 6.59578 0.656512 6.66602 0.833323 6.66602H4.83332V10.666C4.83332 10.8428 4.90356 11.0124 5.02859 11.1374C5.15361 11.2624 5.32318 11.3327 5.49999 11.3327C5.6768 11.3327 5.84637 11.2624 5.97139 11.1374C6.09642 11.0124 6.16666 10.8428 6.16666 10.666V6.66602H10.1667C10.3435 6.66602 10.513 6.59578 10.6381 6.47075C10.7631 6.34573 10.8333 6.17616 10.8333 5.99935C10.8333 5.82254 10.7631 5.65297 10.6381 5.52794C10.513 5.40292 10.3435 5.33268 10.1667 5.33268Z"
                  fill="#134E4A"
                />
              </svg>
              <span>Hoàn tác</span>
            </div>
          ) : ( */}
            <div className="flex items-center justify-center gap-[6px]">
              <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.1667 5.33268H6.16666V1.33268C6.16666 1.15587 6.09642 0.986302 5.97139 0.861278C5.84637 0.736254 5.6768 0.666016 5.49999 0.666016C5.32318 0.666016 5.15361 0.736254 5.02859 0.861278C4.90356 0.986302 4.83332 1.15587 4.83332 1.33268V5.33268H0.833323C0.656512 5.33268 0.486943 5.40292 0.361919 5.52794C0.236895 5.65297 0.166656 5.82254 0.166656 5.99935C0.166656 6.17616 0.236895 6.34573 0.361919 6.47075C0.486943 6.59578 0.656512 6.66602 0.833323 6.66602H4.83332V10.666C4.83332 10.8428 4.90356 11.0124 5.02859 11.1374C5.15361 11.2624 5.32318 11.3327 5.49999 11.3327C5.6768 11.3327 5.84637 11.2624 5.97139 11.1374C6.09642 11.0124 6.16666 10.8428 6.16666 10.666V6.66602H10.1667C10.3435 6.66602 10.513 6.59578 10.6381 6.47075C10.7631 6.34573 10.8333 6.17616 10.8333 5.99935C10.8333 5.82254 10.7631 5.65297 10.6381 5.52794C10.513 5.40292 10.3435 5.33268 10.1667 5.33268Z"
                  fill="#134E4A"
                />
              </svg>
              <span>Thêm danh mục</span>
            </div>
            {/* )} */}
          </Button>
        ) : (
          <Button
            className="h-[44px] w-full border border-dashed border-teal-900 !bg-white !text-teal-900 flex items-center justify-center gap-[6px]"
            onClick={() =>
              handleAdd(inputRef.current.input.value).then(() => {
                setShowAddInput(false);
                setCategoryAdd('');
              })
            }
            type="primary"
            disabled={!idParent}
          >
            <div className="flex items-center justify-center gap-[6px]">
              <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.1667 5.33268H6.16666V1.33268C6.16666 1.15587 6.09642 0.986302 5.97139 0.861278C5.84637 0.736254 5.6768 0.666016 5.49999 0.666016C5.32318 0.666016 5.15361 0.736254 5.02859 0.861278C4.90356 0.986302 4.83332 1.15587 4.83332 1.33268V5.33268H0.833323C0.656512 5.33268 0.486943 5.40292 0.361919 5.52794C0.236895 5.65297 0.166656 5.82254 0.166656 5.99935C0.166656 6.17616 0.236895 6.34573 0.361919 6.47075C0.486943 6.59578 0.656512 6.66602 0.833323 6.66602H4.83332V10.666C4.83332 10.8428 4.90356 11.0124 5.02859 11.1374C5.15361 11.2624 5.32318 11.3327 5.49999 11.3327C5.6768 11.3327 5.84637 11.2624 5.97139 11.1374C6.09642 11.0124 6.16666 10.8428 6.16666 10.666V6.66602H10.1667C10.3435 6.66602 10.513 6.59578 10.6381 6.47075C10.7631 6.34573 10.8333 6.17616 10.8333 5.99935C10.8333 5.82254 10.7631 5.65297 10.6381 5.52794C10.513 5.40292 10.3435 5.33268 10.1667 5.33268Z"
                  fill="#134E4A"
                />
              </svg>
              <span>Lưu</span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CategoryTable;
