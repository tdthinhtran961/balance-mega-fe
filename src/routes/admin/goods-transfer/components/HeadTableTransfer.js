import React from 'react';
import { Row, Col, Form, Input, Select } from 'antd';
import { formatCurrency, routerLinks } from 'utils';
import { Message } from 'components';
import { GoodTransferService } from 'services/GoodTransfer';
import '../index.less';
import './index.less';

const { Option } = Select;

const HeadTableTransfer = ({ itemChoose, pageType, setItemChoose, data, idOrder, navigate, unitChange, setUnitChange }) => {
  const blockInvalidChar = (e) =>
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
  const toggleAmount = (data, type) => {
    const { code, _priceUnit, _quantity } = data;
    const tempOrder =
      itemChoose &&
      itemChoose.map((item) => {
        if (item.barcode === code) {
          if (type === 1) {
            return { ...item, priceUnit: +_priceUnit };
          }
          if (type === 2) {
            return { ...item, quantity: +_quantity };
          }
        }
        return item;
      });
    return setItemChoose([...tempOrder]);
  };
  const handleDeleteKey = async (code, id) => {
    if (pageType === 'edit') {
      Message.confirm({
        text: 'Bạn có chắc muốn xóa hàng chuyển này?',
        onConfirm: async () => {
          if (itemChoose.length === 1) {
            await GoodTransferService.delete(idOrder);
            return navigate(`${routerLinks('GoodTransfer')}?tab=${2}`);
          }
          const res = await GoodTransferService.deleteTransferItem(id);
          if (res) {
            const newData = itemChoose?.filter((item) => item.code !== code);
            setItemChoose(newData);
            // const removedItems = arrayProductlist?.filter((item) => item.code === code).map((item) => ({ ...item }));
            // setDataOrder((prev) => prev.concat(removedItems));
          }
        },
        title: 'Thông báo',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#DC2626',
        confirmButtonText: 'Đồng ý',
      });
    } else {
      const newData = itemChoose?.filter((item) => item.code !== code);
      setItemChoose(newData);
      // const removedItems = itemChoose?.filter((item) => item.code === code).map((item) => ({ ...item }));
      // setItemChoose((prev) => prev.concat(removedItems));
    }
  };

  const bodyTable = () => {
    return (
      <>
        {itemChoose && itemChoose.length > 0 ? (
          itemChoose.map((item, index) => {
            const indexData = item?.inventoryProductUnits[unitChange[index]]
            return (
            <div key={index}>
              <Row gutter={16} className="py-3 flex items-center">
                <Col className="gutter-row " span={3}>
                  <div className="text-sm font-normal text-gray-700 break-all">{item?.barcode}</div>
                </Col>
                <Col className="gutter-row " span={3}>
                  <div className="text-sm font-normal text-gray-700 break-all">{item?.name}</div>
                </Col>
                <Col className="gutter-row" span={3}>
                  <h5 className="text-sm font-normal text-gray-700 break-all">
                    {' '}
                    {pageType === 'create' ? item?.subOrg?.name : item?.supplier?.name || item?.subOrg?.name}
                  </h5>
                </Col>
                <Col className="gutter-row" span={3}>
                  {pageType === 'detail' && 
                    <h5 className="text-sm font-normal text-gray-700 break-all">
                      {indexData && indexData?.unitName || item?.unit}
                    </h5>
                  }
                  {pageType !== 'detail' && indexData &&
                    <Select
                      className="w-[100px] rounded-[10px]"
                      placeholder="Đơn vị"
                      optionFilterProp="children"
                      onChange={(value, option) => {
                        const listIndex = [...unitChange];
                        listIndex[index] = +value;
                        setUnitChange(listIndex);
                      }}
                      showSearch
                      defaultValue={indexData?.unitName}
                      filterOption={(input, option) => {
                        return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                      }}
                    >
                      {item?.inventoryProductUnits?.map((e, i) => {
                        return (
                          <Option key={i} value={e.value} title={e.unitName}>
                            {e.unitName}
                          </Option>
                        )
                      })}
                    </Select>
                  }
                </Col>
                <Col className="gutter-row" span={4}>
                  <div>
                    <span className="break-all text-black">{formatCurrency(indexData && indexData?.inventoryPrice || item?.price, '')}</span>
                  </div>
                </Col>
                <Col className="gutter-row" span={4}>
                  <div>
                    {pageType === 'detail' && (
                      <span className="break-all text-black">{item?.quantity.toLocaleString('vi-VN')}</span>
                    )}
                    {pageType !== 'detail' && (
                      <Form.Item
                        name={`quantity${item.barcode}`}
                        style={{
                          margin: 0,
                        }}
                        rules={[
                          {
                            required: true,
                            message: `Số lượng là bắt buộc`,
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (+value === 0 && value !== '' && value !== null) {
                                return Promise.reject(new Error('Vui lòng nhập số lượng lớn hơn 0'));
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                        initialValue={item?.quantity || null}
                      >
                        <Input
                          type="number"
                          readOnly={pageType === 'detail'}
                          onChange={(e) =>
                            toggleAmount(
                              {
                                code: item?.barcode,
                                _quantity: e.target.value > 0 && Number(parseFloat(e.target.value).toFixed(2)),
                              },
                              2,
                            )
                          }
                          min={1}
                          onKeyDown={blockInvalidChar}
                          placeholder=" Nhập số lượng"
                          className="w-[80%] h-9 !rounded-xl align-right !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 !px-2"
                        />
                      </Form.Item>
                    )}
                  </div>  
                </Col>
                <Col className="gutter-row" span={3}>
                  {pageType === 'detail' && indexData && (
                    <div className="break-all text-black"> {formatCurrency(+item.quantity * +(indexData?.inventoryPrice), '')}</div>
                  )}
                  {pageType !== 'detail' && indexData && (
                    <div className="text-sm font-normal text-gray-700 break-all">
                      {(item.quantity || (indexData?.inventoryPrice  && item.quantity)) !== undefined
                        ? formatCurrency((+indexData?.inventoryPrice) * +item.quantity, '')
                        : 0}
                    </div>
                  )}
                </Col>
                <Col className="gutter-row " span={1}>
                  {(pageType === 'edit' || pageType === 'create') && (
                    <button className="remove-btn" onClick={() => handleDeleteKey(item.code, item.id)}>
                      <i className="las la-trash-alt text-red-600 text-2xl"></i>
                    </button>
                  )}
                </Col>
              </Row>
              <hr />
            </div>
          )})
        ) : (
          <p className="text-sm text-center mt-3 mb-2">Trống</p>
        )}
      </>
    );
  };
  return (
    <>
      <div className="overflow-x-scroll w-full">
        <div className="AddScrollTable ">
          <Row gutter={16} className="mb-3">
            <Col className="gutter-row " span={3}>
              <div className="text-sm font-bold text-gray-700">Mã vạch</div>
            </Col>
            <Col className="gutter-row " span={3}>
              <div className="text-sm font-bold text-gray-700">Tên sản phẩm</div>
            </Col>
            <Col className="gutter-row " span={3}>
              <div className="text-sm font-bold text-gray-700">Nhà cung cấp</div>
            </Col>
            <Col className="gutter-row" span={3}>
              <div className="text-sm font-bold text-gray-700">Đơn vị tính</div>
            </Col>
            <Col className="gutter-row" span={4}>
              <div className="text-sm font-bold text-gray-700">Đơn giá</div>
            </Col>

            <Col className="gutter-row" span={4}>
              <div className="text-sm font-bold text-gray-700">Số lượng chuyển</div>
            </Col>
            <Col className="gutter-row" span={4}>
              <div className="text-sm font-bold text-gray-700">Thành tiền</div>
            </Col>
            <Col className="gutter-row text-center" span={1}>
              <div></div>
            </Col>
          </Row>
          <hr />
          {bodyTable()}
        </div>
      </div>
    </>
  );
};
export default HeadTableTransfer;
