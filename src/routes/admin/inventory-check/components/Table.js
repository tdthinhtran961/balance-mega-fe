import React from 'react';
import { InputNumber, Select, Table } from 'antd';
import { formatCurrency } from 'utils';
import { blockInvalidChar } from 'utils/fucntion';
import classNames from 'classnames';
import './index.less';

const { Option } = Select;

const TableData = ({ dataSource, setDataSource, isLoading, dataArr, data, setListItem, unitChange, setUnitChange, pageType }) => {
  const defaultColumns = [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'code',
      align: 'start',
      render: (text, record, index) => {
        return text;
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      align: 'start',
    },
    {
      title: 'Mã vạch',
      dataIndex: 'barcode',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      render: (text, record, index) => {
        text = dataSource[index]?.inventoryProductUnit
        if (pageType === 'create') {
          return (
            <span className="">
              {text?.length > 0 ? (
                <Select
                  className="w-[100px] rounded-[10px]"
                  placeholder="Đơn vị"
                  optionFilterProp="children"
                  onChange={(event, x) => {
                    const listIndex = [...unitChange];
                    listIndex[index] = +event;
                    setUnitChange(listIndex);
                    const newData = [...dataArr];
                    newData[index].qtyFail = Math.abs(+text[+event]?.quantityBal - newData[index].checkQuantity);
                    newData[index].stockQuantity = +text[+event]?.quantityBal;
                    newData[index].inventoryPrice = +text[+event]?.inventoryPrice;
                    newData[index].valueFail = newData[index].qtyFail * newData[index].inventoryPrice;
                    setDataSource(newData);
                  }}
                  showSearch
                  defaultValue={text[unitChange[index]]?.unitName}
                  filterOption={(input, option) => {
                    return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                >
                  {text &&
                    text.map((item, i) => {
                      return (
                        <Option key={i} value={item.value} title={item.unitName}>
                          {item.unitName}
                        </Option>
                      );
                    })}
                </Select>
              ) : null}
            </span>
          )
        } else {
          return <div>
            {text[unitChange[index]]?.unitName}
          </div>
        }
      }
    },
    {
      title: 'Giá kho',
      dataIndex: 'inventoryPrice',
      render: (text, record, index) => {
        return formatCurrency(text || 0, ' ')
      },
    },
    {
      title: 'Tồn kho logic',
      dataIndex: 'stockQuantity',
      render: (text, record, index) => {
        return text?.toLocaleString('vi-VN') || 0;
      },
    },
    {
      title: 'SL kiểm kê',
      dataIndex: 'checkQuantity',
      width: 150,
      render: (text, record, index) => {
        return data?.status === 'COMPLETED' || data?.status === 'CANCELED' ? (
          <div>{text && text.toLocaleString('vi-VN')}</div>
        ) : (
          <div className="">
            <InputNumber
              // formatter={value => {
              //   if (!value) return '';
              //   return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
              // }}
              // parser={(value) => {
              //   if (!value) {
              //     return null;
              //   }
              //   return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
              // }}
              // maxLength={7}
              type="number"
              onKeyDown={blockInvalidChar}
              value={text}
              style={{
                backgroundColor: 'white',
              }}
              placeholder="Nhập giá trị"
              className="not-sr-only h-9 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[3px] !px-0 focus:!outline-none focus:shadow-none"
              onChange={(e) => {
                const newData = [...dataArr];
                const value = e !== '' ? e : +e.toFixed(2);
                newData[index].stockQuantity = record.stockQuantity;
                newData[index].checkQuantity = value; // 55555
                newData[index].qtyFail = Math.abs(
                  +(newData[index]?.stockQuantity - newData[index]?.checkQuantity).toFixed(2),
                );
                newData[index].valueFail = newData[index].qtyFail * newData[index].inventoryPrice;
                newData[index].index = index;
                setListItem((prev) =>
                  [...prev, newData[index]]
                    .reduce((accumulator, current) => {
                      const indexs = accumulator.findIndex((obj) => obj.id === current.id);
                      if (indexs === -1) {
                        return [...accumulator, current];
                      } else {
                        accumulator.splice(indexs, 1, current);
                        return accumulator;
                      }
                    }, [])
                    .filter((i) => i.checkQuantity !== undefined && i.checkQuantity !== ''),
                );
                setDataSource(newData);
                // }
              }}
            />
          </div>
        );
      },
    },
    {
      title: 'SL sai khác',
      dataIndex: 'qtyFail',
      render: (text, record, index) => {
        if (!record.qtyFail) return 0;
        return (
          <div
            className={classNames('', {
              'text-rose-500': record.qtyFail !== 0,
            })}
          >
            {record?.qtyFail?.toLocaleString('vi-VN')}
          </div>
        );
      },
    },
    {
      title: 'Giá trị sai',
      dataIndex: 'valueFail',
      render: (text, record, index) => {
        if (!record.valueFail) return 0;
        return formatCurrency(record.valueFail.toFixed(0), ' ');
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
    },
    {
      title: 'Người duyệt',
      dataIndex: 'approvalBy',
    },
  ];

  const components = {
    body: {
      // row: EditableRow,
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
      }),
    };
  });

  return (
    <div>
      <Table
        className={`w-full head-table`}
        components={components}
        rowClassName={() => 'editable-row'}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ x: '1600', y: null }}
        size="small"
        loading={isLoading}
      />
    </div>
  );
};

export default TableData;
