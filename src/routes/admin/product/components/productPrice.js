import { Form, Input, InputNumber, Table } from 'antd';
import { Message } from 'components';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { formatCurrency } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import { blockInvalidChar } from '../func';
import '../index.less';

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

export const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, pageType,a = true, ...restProps }) => {
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
            className=" h-9 !w-[171px] !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
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
            type="number"
            readOnly={pageType === 'detail'}
            ref={inputRef}
            // formatter={(value) => {
            //   if (!value) {
            //     return;
            //   }
            //   return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            // }}
            // parser={(value) => {
            //   if (!value) {
            //     return;
            //   }
            //   return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
            // }}
            onKeyDown={blockInvalidChar}
            onPressEnter={save}
            onBlur={save}
            placeholder="Nhập giá trị"
            className="percentInput h-9 !w-[171px] !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
          />
        </Form.Item>
      )
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
                dataIndex === 'priceType'
                  ? children[1]
                  : children[1] < 0 || children[1] === undefined
                  ? undefined
                  : children[1] === null || children[1] === undefined
                  ? undefined
                  : formatCurrency(children[1], ' ')
              }
              placeholder={dataIndex === 'priceType' ? 'Nhập loại giá' : 'Nhập giá trị'}
              className="h-9 !w-[171px] !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 arrReadonly checkHidden"
            />
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
              value={
                dataIndex === 'priceType'
                  ? children[1]
                  : children[1] < 0 || children[1] === undefined
                  ? undefined
                  : children[1] === null || children[1] === undefined
                  ? undefined
                  : formatCurrency(children[1], ' ')
              }
              placeholder={dataIndex === 'priceType' ? 'Nhập loại giá' : 'Nhập giá trị'}
              className="h-9 !w-[171px] !rounded-[10px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 arrReadonly  checkHidden"
            />
          </div>
        )}
        {pageType === 'detail' && (
          <div className="ml-4">{dataIndex === 'priceType' ? children : formatCurrency(children[1] || 0, '')}</div>
        )}
      </>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const ProductPrice = ({ priceArr, setPriceArr, pageType, setIsValidate }) => {
  const [isAdd, setIsAdd] = useState(false);
  const [minQuantity, setMinquantity] = useState(false);

  // console.log('priceArr?.filter((i) => i?.minQuantity === undefined || i?.minQuantity === null).length', priceArr?.filter((i) => i?.minQuantity === undefined || i?.minQuantity === null).length, priceArr);

  useEffect(() => {
    if (priceArr?.filter((i) => i?.minQuantity === undefined || i?.minQuantity === null).length) {
      setIsAdd(true);
      return;
    }
    if (priceArr?.filter((i) => i?.minQuantity === 0 || i?.minQuantity === undefined).length) {
      setMinquantity(true);
      return;
    } else {
      setMinquantity(false);
    }

    const newData = [...priceArr]?.filter((i) => i?.minQuantity !== 0);
    for (let i = 0; i < newData?.length; i++) {
      if (+newData[i]?.minQuantity >= +newData[i + 1]?.minQuantity) {
        setIsValidate(true);
        setIsAdd(true);
        return Message.error({ text: 'Số lượng tối thiểu phải lớn hơn số lượng vừa tạo' });
      } else {
        setIsValidate(false);
        setIsAdd(false);
        setMinquantity(false);
      }
    }
  }, [priceArr]);

  const handleDelete = (key) => {
    const newData = priceArr?.filter((item) => item.key !== key);
    setPriceArr(newData);
  };

  const defaultColumns = [
    {
      title: 'STT',
      dataIndex: 'key',
      width: 50,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Chủng loại giá',
      dataIndex: 'priceType',
      width: 200,
      editable: true,
      align: 'start',
    },
    {
      title: 'Số lượng tối thiểu',
      dataIndex: 'minQuantity',
      editable: true,
      width: 200,
    },
    {
      title: 'Giá bán (VND)',
      dataIndex: 'price',
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
        priceArr.length >= 2 ? (
          <>
            {pageType !== 'detail' && (
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

  const handleAdd = () => {
    if (minQuantity) return Message.error({ text: 'Vui lòng nhập số lượng tối thiểu lớn hơn 0' });
    if (priceArr.length > 0 && priceArr[0].price === undefined && priceArr[0].minQuantity === undefined)
      return Message.error({ text: 'Vui lòng nhập thông tin bảng giá' });
    if (isAdd && priceArr?.filter((i) => i?.minQuantity !== undefined || i?.minQuantity !== null).length)
      return Message.error({ text: 'Số lượng tối thiểu phải lớn hơn số lượng vừa tạo' });
    const newData = {
      key: uuidv4(),
      // priceType: undefined,
      // minQuantity: undefined,
      // price: undefined,
    };
    setPriceArr([...priceArr, newData]);
    return true;
  };

  const handleSave = (row) => {
    const newData = [...priceArr];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];

    newData.splice(index, 1, { ...item, ...row });
    setPriceArr(newData);
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
      }),
    };
  });
  return (
    <div className="">
      <div className="flex justify-between mb-[18px]">
        <p className="text-lg font-bold text-teal-900 pt-[19px] sm:text-xl">Bảng giá dành cho cửa hàng</p>
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
        dataSource={priceArr}
        columns={columns}
        pagination={false}
        scroll={{ x: '100%', y: null }}
        size="small"
      />
    </div>
  );
};

export default ProductPrice;
