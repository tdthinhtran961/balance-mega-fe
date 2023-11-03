import React, { useState } from 'react';
import { Table, Form, Input, Button } from 'antd';
import { formatCurrency } from 'utils';
// import { Table } from "antd"

const TableLevel1 = ({ roleCode, tabKey, onFinish, handleDeleteProduct, dataNew }) => {
  const [form] = Form.useForm();
  const [checkInput, setCheckInput] = useState(false);
  const [keyCheck, setKeyCheck] = useState(null);
  const columnsTableLevel_1 = [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'code',
      key: 'code',
      className: 'border-none ml-12',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'basicUnit',
      key: 'basicUnit',
    },
    {
      title: 'Đơn giá(VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (text) => formatCurrency(text, ''),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value, record) => {
        return (
          <div>
            {checkInput && +keyCheck === +record.key ? (
              <Form.Item
                name="quantity"
                oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null"
                rules={[
                  {
                    required: true,
                    message: 'Đây là trường bắt buộc',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (+value > +record.afterEntering) {
                        return Promise.reject(new Error('Bạn đã nhập vượt quá số lượng đã có'));
                      } else if (+value <= +record.afterEntering) {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}
              >
                <Input type="number" className="border  w-[80%] h-[2.3rem] rounded-xl mt-4 text-right" />
              </Form.Item>
            ) : (
              <div>{value}</div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      render: (text) => formatCurrency(text, ''),
    },
    {
      title: 'Lý do',
      dataIndex: 'updatedReason',
      key: 'updatedReason',
      width: '15%',
      render: (value, record) => {
        return (
          <div>
            {checkInput && +keyCheck === +record.key ? (
              <Form.Item
                name="updatedReason"
                rules={[
                  {
                    required: true,
                    message: 'Đây là trường bắt buộc',
                  },
                ]}
              >
                <Input
                  placeholder="Nhập lý do"
                  type="text"
                  className=" p-2 border w-[90%] h-[2.3rem] rounded-xl mt-2"
                />
              </Form.Item>
            ) : (
              <div>{value}</div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Hoạt động',
      dataIndex: 'action',
      key: 'action',
      hidden: roleCode === 'OWNER_SUPPLIER' || +tabKey === 4 || roleCode === 'DISTRIBUTOR',
      className: 'border-r-0',
      render: (a, record) => {
        return (
          <Space size="middle flex">
            <div className="flex justify-center">
              {!checkInput || +keyCheck !== +record.key ? (
                <button
                  onClick={(e) => {
                    if (!checkInput) {
                      setKeyCheck(+record.key);
                      setCheckInput(true);
                      form.setFieldsValue({
                        quantity: record.quantity,
                        updatedReason: record.updatedReason,
                      });
                    } else if (checkInput === true) {
                      setCheckInput(false);
                    }
                  }}
                >
                  <i className="las la-pen m-0 p-0 text-blue-500 text-2xl mr-2"></i>
                </button>
              ) : (
                checkInput &&
                +keyCheck === +record.key && (
                  <Button
                    htmlType="submit"
                    type="link"
                    className="buttonEdit"
                    onClick={(e) => onFinish({ record, data: form.getFieldsValue() })}
                  >
                    <i className="las la-save m-0 p-0 text-blue-500 text-2xl mr-2"></i>
                  </Button>
                )
              )}
              <Button className="buttonEdit" onClick={() => handleDeleteProduct(record.id, record)}>
                <i className="lar la-trash-alt m-0 p-0 text-red-500 text-3xl mr-2"></i>
              </Button>
            </div>
          </Space>
        );
      },
    },
  ].filter((col) => col.hidden !== +tabKey && !col.hidden);

  return (
    <div>
      <Form form={form}>
        <Table
          className="tableExp"
          columns={columnsTableLevel_1}
          dataSource={dataNew}
          pagination={false}
          scroll={{ x: 400, y: 400 }}
        />
      </Form>
      {''}
    </div>
  );
};
export default TableLevel1;
