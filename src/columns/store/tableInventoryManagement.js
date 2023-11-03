// import { formatCurrency } from "utils";
import { Select } from 'antd';
import React from 'react';
import { formatPrice } from 'utils/fucntion';

const { Option } = Select;
const Column = ({
  unitChange,
  setUnitChange,
  unitValue,
  setUnitValue,
  idx,
  setIdx,
  name,
  setName,
  data,
  hanldeNameUnitChoosed,
}) => {
  return [
    {
      title: 'Mã sản phẩm',
      name: 'productCode',
      tableItem: {
        width: 170,
        sorter: true,
        filter: { type: 'search' },
        render: (text, record, index) => {
          const indexData = data[index];
          text = indexData?.inventoryProductUnit[unitChange[index]]?.productCode;
          return text;
        },
      },
    },
    {
      title: 'Mã vạch (NCC)',
      name: 'supplierBarcode',
      tableItem: {
        filter: { type: 'search' },
      },
    },
    {
      title: 'Mã vạch (CH)',
      name: 'storeBarcode',
      tableItem: {
        filter: { type: 'search' },
        render: (text, record, index) => {
          const indexData = data[index];
          text = indexData?.inventoryProductUnit[unitChange[index]]?.storeBarcode;
          return text;
        },
      },
    },
    {
      title: 'Tên sản phẩm',
      name: 'productName',
      tableItem: {
        sorter: true,
        filter: { type: 'search' },
      },
    },
    {
      title: 'Danh mục',
      name: 'category',
      tableItem: {},
    },
    {
      title: 'Nhà cung cấp',
      name: 'supplierName',
      tableItem: {},
    },
    {
      title: 'Đơn vị',
      name: 'unit',
      tableItem: {
        render: (text, record, index) => {
          const indexData = data[index];
          text = indexData?.inventoryProductUnit;
          return (
          <span className="">
            {text?.length > 0 ? (
              <Select
                className="w-[100px] rounded-[10px]"
                placeholder="Đơn vị"
                optionFilterProp="children"
                defaultValue={text[unitChange[index]]?.unitName}
                onChange={(event, x) => {
                  const listIndex = [...unitChange];
                  listIndex[index] = +event;
                  setUnitChange(listIndex);
                  // setUnitValue()
                }}
                showSearch
                filterOption={(input, option) => {
                  return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                // options={text && text?.map((i) => ({ label: i.name, value: i.value }))}
              >
                {text &&
                  text.map((item, i) => {
                    return (
                      <Option key={i} value={item.value} title={item.unitName}>
                        {/* <span className='w-full inline-block' onClick={()=>setName(item.name)}>
                        </span> */}
                        {item.unitName}
                      </Option>
                    );
                  })}
              </Select>
            ) : null}
          </span>
        )},
      },
    },
    {
      title: 'Số lượng trên KiotViet',
      name: 'numberInKiot',
      width: '15%',
      tableItem: {
        align: 'right',
        render: (value, record, index) => {
          const indexData = data[index];
          value = indexData?.inventoryProductUnit[unitChange[index]]?.quantityKiotviet;
          return value ? value.toLocaleString('vi-VN') : value;
        },
      },
    },
    {
      title: 'Số lượng trên BALANCE',
      width: '15%',
      name: 'numberInBal',
      tableItem: {
        align: 'right',
        render: (value, record, index) => {
          const indexData = data[index];
          value = indexData?.inventoryProductUnit[unitChange[index]]?.quantityBal;
          return value ? value.toLocaleString('vi-VN') : value;
        },
      },
    },
    {
      title: 'Giá kho',
      name: 'inventoryPrice',
      tableItem: {
        align: 'right',
        render: (value, record, index) => {
          const indexData = data[index];
          value = indexData?.inventoryProductUnit[unitChange[index]]?.inventoryPrice;
          return (value ? formatPrice(value) : 0);
        },
      },
    },
    {
      title: 'Thành tiền',
      name: 'tt',
      tableItem: {
        align: 'right',
        render: (value, record, index) => {
          const indexData = data[index];
          value = indexData?.inventoryProductUnit[unitChange[index]];
          return formatPrice(value?.inventoryPrice * value?.quantityBal);
        },
      },
    },
  ];
};
export default Column;
