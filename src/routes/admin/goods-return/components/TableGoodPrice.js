import React from 'react';
import { Col, Row, Input, InputNumber, Popover, Select } from 'antd';
// import  { blockInvalidChar } from './components/tableGoodReturn';
import './index.less';
import { formatCurrency } from 'utils';
import { taxApply } from 'constants/index';

const { Option } = Select;

const TableGoodPrice = ({
  toggleAmount,
  handleDeleteKey,
  handleDeleteKeyNo,
  billCode,
  step,
  pageType,
  isShowSelectProduct,
  Form,
  setFieldsValue,
  getFieldValue,
  arrayProductlist,
  filterTax,
  unitChange,
  setUnitChange,
}) => {
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
  const _renderTableFlowGoodReturn = () => {
    return (
      arrayProductlist &&
      arrayProductlist?.map((item, index) => {
        const indexData = item?.inventoryProductUnits[unitChange[index]]
        return (
          <div key={index}>
            <Row gutter={16} className="py-3 flex items-center goodPriceTable">
              {/* mã ch */}
              <Col className="gutter-row " span={3}>
                <div className="text-sm font-normal text-gray-700 break-all">{item?.storeBarcode}</div>
              </Col>
              <Col className="gutter-row " span={3}>
                <div className="text-sm font-normal text-gray-700 break-all">{item?.barcode}</div>
              </Col>
              <Col className="gutter-row " span={3}>
                <div className="h-full grid grid-cols-product-name items-center gap-4 text-left">
                  <div className="flex items-center">
                    <h5 className="text-sm font-normal text-gray-700 break-normal">{item?.name}</h5>
                  </div>
                </div>
              </Col>
              {pageType === 'detail' && (
                <Col className="gutter-row" span={2}>
                  <Popover trigger="hover" overlayClassName="table-tooltip" content={item?.unit || item?.basicUnit}>
                    <h5 className="text-sm font-normal text-gray-700">{item?.unit || item?.basicUnit.substr(0, 5)}</h5>
                  </Popover>
                </Col>
              )}
              {pageType !== 'detail' && indexData && (
                <Col className="gutter-row" span={2}>
                  <Select
                    className="w-full rounded-[10px]"
                    placeholder="Đơn vị"
                    optionFilterProp="children"
                    onChange={(value, option) => {
                      const listIndex = [...unitChange];
                      listIndex[index] = +value;
                      setUnitChange(listIndex);
                      toggleAmount({ 
                        code: item?.inventoryProductUnits[+value].productCode, 
                        _priceUnit: item?.inventoryProductUnits[+value].inventoryPrice 
                      }, 1, index)
                      setFieldsValue({
                        [`price${item.code}`]: item?.inventoryProductUnits[+value].inventoryPrice,
                      })
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
                </Col>
              )}
              <Col className={`gutter-row ${pageType === 'detail' ? '!pl-[12px]' : ''}`} span={filterTax === taxApply.APPLY ? 1 : 2}>
                <h5 className="text-sm font-normal text-gray-700 text-left break-all">
                  {indexData?.quantityBal}
                </h5>
              </Col>
              <Col className={`gutter-row ${pageType === 'detail' ? '!pl-3' : '!pl-0'}`} span={3}>
                <div className="flex items-center justify-left btn-quantityUnit ">
                  {pageType !== 'detail' && indexData && (
                    <Form.Item
                      name={`price${item.code}`}
                      style={{
                        margin: 0,
                      }}
                      rules={[
                        {
                          required: true,
                          message: `Đơn giá là bắt buộc`,
                        },
                      ]}
                      initialValue={+indexData?.inventoryPrice}
                    >
                      <InputNumber
                        formatter={(value) => {
                          if (!value) {
                            return;
                          }
                          return formatCurrency(value, '');
                        }}
                        parser={(value) => {
                          if (!value) {
                            return;
                          }
                          return formatCurrency(value, '');
                        }}
                        readOnly={pageType === 'detail'}
                        onChange={(value) => {
                          toggleAmount({ code: indexData?.productCode, _priceUnit: value }, 1, index);
                        }}
                        oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null"
                        maxLength={11}
                        onKeyDown={blockInvalidChar}
                        placeholder="Đơn giá"
                        className="priceUnitInput text-left w-[100%] h-[36px] !rounded-xl !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
                      />
                    </Form.Item>
                  )}
                  {pageType === 'detail' && (
                    <span className="text-sm text-black font-normal">
                      {formatCurrency(indexData?.inventoryPrice, '')}
                      </span>
                  )}
                </div>
              </Col>
              <Col
                className={`gutter-row ${pageType === 'detail' ? '!pl-[14px]' : '!pl-0'}`}
                span={filterTax === taxApply.APPLY ? 2 : 3}
              >
                <div>
                  {pageType === 'detail' && (
                    <span className="text-left text-black break-all">{item?.quantity.toLocaleString('vi-VN')}</span>
                  )}
                  {pageType !== 'detail' && (
                    <Form.Item
                      name={pageType === 'create' ? `quantityUnit${item.code}` : `quantity${item.code}`}
                      style={{
                        margin: 0,
                        borderRadius: 0,
                        textAlign: 'center',
                      }}
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (+value > item?.inventoryProductUnits[unitChange]?.quantityBal) {
                              return Promise.reject(
                                new Error(
                                  'SL trả nhỏ hơn hoặc bằng SL nhập là ' + `${item?.inventoryProductUnits[unitChange]?.quantityBal}`,
                                ),
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input
                        readOnly={pageType === 'detail'}
                        type="number"
                        min={0}
                        oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null"
                        onChange={(e) =>
                          toggleAmount(
                            {
                              code: indexData?.productCode,
                              _quantity: +e.target.value && Number(parseFloat(e.target.value).toFixed(2)),
                            },
                            2,
                            index
                          )
                        }
                        onKeyDown={blockInvalidChar}
                        placeholder="Nhập SL"
                        className="quantityInput text-black h-[36px] w-[100%] !rounded-xl !bg-white border border-radius border-gray-200 !px-2"
                      />
                    </Form.Item>
                  )}
                </div>
              </Col>
              {pageType === 'create' && indexData && (
                <Col className="gutter-row !pl-[14px]" span={filterTax === taxApply.APPLY ? 2 : 4}>
                  <div className="text-sm font-normal text-gray-700 break-all">
                    {indexData?.inventoryPrice === undefined || item?.quantityUnit === undefined || indexData.inventoryPrice === null
                      ? ''
                      : formatCurrency(+indexData?.inventoryPrice * +item?.quantityUnit, ' ')}
                  </div>
                </Col>
              )}
              {pageType !== 'create' && (
                <Col className={`gutter-row ${pageType === 'detail' ? '!pl-[12px]' : ''}`} span={4}>
                  <div className="text-sm font-normal text-gray-700 break-all">
                    {indexData?.inventoryPrice === undefined || item?.quantityUnit === undefined || indexData.inventoryPrice === null
                      ? indexData?.inventoryPrice && item?.quantity
                        ? formatCurrency(+indexData?.inventoryPrice * +item?.quantity, ' ')
                        : 0
                      : formatCurrency(+indexData?.inventoryPrice * +item?.quantityUnit, ' ')}
                  </div>
                </Col>
              )}

              {/* Thuế */}
              {filterTax === taxApply.APPLY ? (
                <Col className={`gutter-row ${pageType === 'detail' ? '!pl-[15px]' : '!pl-0'}`} span={1}>
                  <div className={`text-sm font-normal text-gray-700 ${pageType === 'create' ? 'pl-[10px]' : ''}`}>
                    {item?.tax} %
                  </div>
                </Col>
              ) : null}

              {/* tiền sau thuế */}
              {pageType === 'create' && filterTax === taxApply.APPLY && (
                <Col className="gutter-row !pl-[14px]" span={3}>
                  <div className="text-sm font-normal text-gray-700 text-left break-all">
                    {indexData?.inventoryPrice === undefined || item?.quantityUnit === undefined || indexData?.inventoryPrice === null
                      ? ''
                      : formatCurrency(Math.round(+indexData?.inventoryPrice * +item?.quantityUnit * (+item?.tax / 100 + 1)), ' ')}
                  </div>
                </Col>
              )}
              {pageType !== 'create' && filterTax === taxApply.APPLY && (
                <Col className={`gutter-row ${pageType === 'detail' ? '!pl-[15px]' : ''}`} span={3}>
                  <div className="text-sm font-normal text-gray-700 text-left break-all">
                    {indexData?.inventoryPrice === undefined || item?.quantityUnit === undefined || indexData.inventoryPrice === null
                      ? indexData?.inventoryPrice && item?.quantity
                        ? formatCurrency(Math.round(+indexData?.inventoryPrice * +item?.quantity * (+item?.tax / 100 + 1)), ' ')
                        : 0
                      : formatCurrency(Math.round(+indexData?.inventoryPrice * +item?.quantityUnit * (+item?.tax / 100 + 1)), ' ')}
                  </div>
                </Col>
              )}

              {pageType !== 'detail' && (
                <Col className="gutter-row " span={1}>
                  <button className="remove-btn" onClick={() => handleDeleteKey(item.code, item.id)}>
                    <i className="las la-trash-alt text-red-600 text-2xl"></i>
                  </button>
                </Col>
              )}
            </Row>
            <hr />
          </div>
        );
      })
    );
  };
  const _renderTableNotFlowImportProduct = () => {
    return (
      arrayProductlist &&
      arrayProductlist?.map((item, index) => {
        const indexData = item?.inventoryProductUnits[unitChange[index]]
        return (
          <div key={index}>
            <Row gutter={16} className="py-3 flex items-center goodPriceTable">
              <Col className="gutter-row " span={3}>
                <div className="text-sm font-normal text-gray-700 break-all">{item?.storeBarcode}</div>
              </Col>
              <Col className="gutter-row " span={pageType === 'detail' || pageType === 'edit' ? 3 : 3}>
                <div className="text-sm font-normal text-gray-700 break-all">{item?.barcode}</div>
              </Col>
              <Col className="gutter-row " span={filterTax === taxApply.APPLY ? 3 : 3}>
                <div className="h-full grid grid-cols-product-name items-center gap-4 text-left">
                  <div className="flex items-center">
                    <h5 className="text-sm font-normal text-gray-700 break-normal">{item?.name}</h5>
                  </div>
                </div>
              </Col>
              {pageType === 'detail' && (
                <Col className="gutter-row" span={2}>
                  <Popover trigger="hover" overlayClassName="table-tooltip" content={indexData?.unitName}>
                    <h5 className="text-sm font-normal text-gray-700">{indexData?.unitName}</h5>
                  </Popover>
                </Col>
              )}
              {pageType !== 'detail' && indexData && (
                <Col
                  className="gutter-row"
                  span={2}
                >
                  <Select
                    className="w-full rounded-[10px]"
                    placeholder="Đơn vị"
                    optionFilterProp="children"
                    onChange={(value, option) => {
                      const listIndex = [...unitChange];
                      listIndex[index] = +value;
                      setUnitChange(listIndex);
                      toggleAmount({ 
                        code: item?.inventoryProductUnits[+value].productCode, 
                        _priceUnit: item?.inventoryProductUnits[+value].inventoryPrice 
                      }, 1, index)
                      setFieldsValue({
                        [`price${item.code}`]: item?.inventoryProductUnits[+value].inventoryPrice,
                      })
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
                </Col>
              )}
              <Col className={`gutter-row ${pageType === 'detail' ? '!pl-[12px]' : ''}`} span={filterTax === taxApply.APPLY ? 1 : 2}>
                <h5 className="text-sm font-normal text-gray-700 text-left break-all">
                  {indexData?.quantityBal}
                </h5>
              </Col>
              <Col
                className={`gutter-row ${pageType === 'detail' ? '!pl-[10px]' : '!pl-0'}`}
                span={billCode !== undefined ? 2 : 3}
              >
                <div className="flex items-center justify-left btn-quantityUnit text-left">
                  {pageType !== 'detail' && indexData && (
                    <Form.Item
                      name={`price${item.code}`}
                      style={{
                        margin: 0,
                      }}
                      rules={[
                        {
                          required: true,
                          message: `Đơn giá là bắt buộc`,
                        },
                      ]}
                      initialValue={+indexData?.inventoryPrice}
                    >
                      <InputNumber
                        readOnly={pageType === 'detail'}
                        formatter={(value) => {
                          if (!value) {
                            return;
                          }
                          return formatCurrency(value, '');
                        }}
                        parser={(value) => {
                          if (!value) {
                            return;
                          }
                          return formatCurrency(value, '');
                        }}
                        onChange={(value) => {
                          toggleAmount({ code: indexData?.productCode, _priceUnit: value }, 1, index);
                        }}
                        oninput="this.value =!!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null"
                        value={indexData?.inventoryPrice}
                        onKeyDown={blockInvalidChar}
                        placeholder="Đơn giá"
                        className="priceUnitInput  text-black text-left h-[36px] w-[100%] !rounded-xl !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
                      />
                    </Form.Item>
                  )}
                  {pageType === 'detail' && (
                    <span className="text-sm font-normal  text-gray-700 text-right">
                      {formatCurrency(indexData?.inventoryPrice, '')}
                    </span>
                  )}
                </div>
              </Col>
              <Col
                className={`gutter-row ${pageType === 'detail' ? '!pl-[10px]' : '!pl-0'}`}
                span={filterTax === taxApply.APPLY ? 2 : 3}
              >
                <div>
                  {pageType === 'detail' && (
                    <span className="text-black break-all"> {item?.quantity.toLocaleString('vi-VN')}</span>
                  )}
                  {pageType !== 'detail' && (
                    <Form.Item
                      name={pageType === 'create' ? `quantityUnit${item.code}` : `quantity${item.code}`}
                      style={{
                        margin: 0,
                        borderRadius: 0,
                      }}
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (+value > item?.inventoryProductUnits[unitChange]?.quantityBal) {
                              return Promise.reject(
                                new Error('SL trả nhỏ hơn hoặc bằng SL nhập là ' + `${item?.inventoryProductUnits[unitChange]?.quantityBal}`),
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input
                        readOnly={pageType === 'detail'}
                        oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null"
                        type="number"
                        min={0}
                        onChange={(e) => {
                          toggleAmount(
                            {
                              code: indexData?.productCode,
                              _quantity: +e.target.value > 0 && Number(parseFloat(e.target.value).toFixed(2)),
                            },
                            2,
                            index
                          )
                        }}
                        onKeyDown={blockInvalidChar}
                        placeholder="Nhập SL"
                        className="quantityInput h-[36px] p2 w-[100%] !rounded-xl !bg-white border border-radius border-gray-200 !px-2"
                      />
                    </Form.Item>
                  )}
                </div>
              </Col>
              {pageType === 'create' && indexData && (
                <Col className="gutter-row !pl-[14px]" span={filterTax === taxApply.APPLY ? 2 : 4}>
                  <div className="text-sm font-normal text-gray-700 text-left break-all">
                    {indexData?.inventoryPrice === undefined || item?.quantityUnit === undefined || indexData.inventoryPrice === null
                      ? ''
                      : formatCurrency(+indexData?.inventoryPrice * +item?.quantityUnit, ' ')}
                  </div>
                </Col>
              )}
              {pageType !== 'create' && (
                <Col
                  className={`gutter-row ${pageType === 'detail' || pageType === 'edit' ? '!pl-[12px]' : ''} `}
                  span={pageType === 'detail' ? 3 : 2}
                >
                  <div className="text-sm font-normal text-gray-700 text-left break-all">
                    {indexData?.inventoryPrice === undefined || item?.quantityUnit === undefined || indexData.inventoryPrice === null
                      ? indexData?.inventoryPrice && item?.quantity
                        ? formatCurrency(+indexData?.inventoryPrice * +item?.quantity, ' ')
                        : 0
                      : formatCurrency(+indexData?.inventoryPrice * +item?.quantityUnit, ' ')}
                  </div>
                </Col>
              )}
              {/* Thuế */}
              {filterTax === taxApply.APPLY ? (
                <Col
                  className={`gutter-row ${
                    pageType === 'detail' ? '!pl-[14px]' : pageType === 'edit' ? '!pl-3' : '!pl-0'
                  }`}
                  span={1}
                >
                  <div className={`text-sm font-normal text-gray-700 ${pageType === 'create' ? 'pl-[10px]' : ''}`}>
                    {item?.tax}%
                  </div>
                </Col>
              ) : null}

              {/* tiền sau thuế */}
              {pageType === 'create' && filterTax === taxApply.APPLY && (
                <Col className="gutter-row !pl-[14px]" span={+step === 2 ? 3 : 3}>
                  <div className="text-sm font-normal text-gray-700 text-left break-all">
                    {indexData?.inventoryPrice === undefined || item?.quantityUnit === undefined || indexData?.inventoryPrice === null
                      ? ''
                      : formatCurrency(Math.round(+indexData?.inventoryPrice * +item?.quantityUnit * (+item?.tax / 100 + 1)), ' ')}
                  </div>
                </Col>
              )}
              {pageType !== 'create' && filterTax === taxApply.APPLY && (
                <Col
                  className={`gutter-row ${pageType === 'detail' || pageType === 'edit' ? '!pl-[14px]' : ''}`}
                  span={+step === 2 ? 3 : 3}
                >
                  <div className="text-sm font-normal text-gray-700 text-left break-all">
                    {indexData?.inventoryPrice === undefined || item?.quantityUnit === undefined || indexData.inventoryPrice === null
                      ? indexData?.inventoryPrice && item?.quantity
                        ? formatCurrency(Math.round(+indexData?.inventoryPrice * +item?.quantity * (+item?.tax / 100 + 1)), ' ')
                        : 0
                      : formatCurrency(Math.round(+indexData?.inventoryPrice * +item?.quantityUnit * (+item?.tax / 100 + 1)), ' ')}
                  </div>
                </Col>
              )}
              {pageType !== 'detail' && (
                <Col className="gutter-row " span={1}>
                  <button className="remove-btn" onClick={() => handleDeleteKeyNo(item.code, item.id)}>
                    <i className="las la-trash-alt text-red-600 text-2xl"></i>
                  </button>
                </Col>
              )}
            </Row>
            <hr />
          </div>
        );
      })
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className={`goodPriceTable`}>
        {filterTax === taxApply.APPLY ? (
          <Row gutter={8} className="mb-3 ">
            <Col className="gutter-row " span={3}>
              <div className="text-sm font-bold text-gray-700">Mã vạch (CH)</div>
            </Col>
            {pageType === 'create' && (
              <Col className="gutter-row " span={3}>
                <div className="text-sm font-bold text-gray-700">Mã vạch (NCC)</div>
              </Col>
            )}
            {(pageType === 'edit' || pageType === 'detail') && billCode === undefined && (
              <Col className="gutter-row " span={3}>
                <div className="text-sm font-bold text-gray-700">Mã vạch (NCC)</div>
              </Col>
            )}
            {(pageType === 'edit' || pageType === 'detail') && billCode !== undefined && (
              <Col className="gutter-row " span={3}>
                <div className="text-sm font-bold text-gray-700">Mã vạch (NCC)</div>
              </Col>
            )}
            <Col className="gutter-row " span={3}>
              <div className="text-sm font-bold text-gray-700">Tên sản phẩm</div>
            </Col>
            <Col className="gutter-row" span={2}>
              <div className="text-sm font-bold text-gray-700">ĐVT</div>
            </Col>
            <Col className="gutter-row" span={1}>
              <div className="text-sm font-bold text-gray-700">SL</div>
            </Col>
            {pageType !== 'create' && (
              <Col className="gutter-row" span={3}>
                <div className="text-sm font-bold text-gray-700">Đơn giá (VND)</div>
              </Col>
            )}
            {pageType === 'create' && (
              <Col className="gutter-row" span={3}>
                <div className="text-sm font-bold text-gray-700">Đơn giá (VND)</div>
              </Col>
            )}

            <Col className="gutter-row" span={2}>
              <div className="text-sm font-bold text-gray-700">SL trả</div>
            </Col>
            {pageType !== 'detail' && billCode !== undefined && (
              <Col className="gutter-row !pr-0" span={2}>
                <div className="text-sm font-bold text-gray-700">Thành tiền</div>
              </Col>
            )}
            {pageType === 'detail' && billCode !== undefined && (
              <Col className="gutter-row !pr-0" span={2}>
                <div className="text-sm font-bold text-gray-700">Thành tiền</div>
              </Col>
            )}
            {(pageType === 'detail' || pageType === 'edit' || pageType === 'create') && billCode === undefined && (
              <Col className="gutter-row !pr-0" span={pageType === 'edit' || pageType === 'create' ? 2 : 3}>
                <div className="text-sm font-bold text-gray-700">Thành tiền</div>
              </Col>
            )}

            <Col className={`gutter-row ${pageType === 'detail' ? '' : '!pl-0'}`} span={1}>
              <div className="text-sm font-bold text-gray-700">Thuế</div>
            </Col>

            <Col className="gutter-row" span={+step === 2 ? 3 : 3}>
              <div className="text-sm font-bold text-gray-700">Tiền sau thuế</div>
            </Col>
            <Col className="gutter-row text-center" span={1}>
              <div></div>
            </Col>
          </Row>
        ) : (
          <Row gutter={8} className="mb-3 ">
            <Col className="gutter-row " span={3}>
              <div className="text-sm font-bold text-gray-700">Mã vạch (CH)</div>
            </Col>
            {pageType === 'create' && (
              <Col className="gutter-row " span={3}>
                <div className="text-sm font-bold text-gray-700">Mã vạch (NCC)</div>
              </Col>
            )}
            {(pageType === 'edit' || pageType === 'detail') && billCode === undefined && (
              <Col className="gutter-row " span={3}>
                <div className="text-sm font-bold text-gray-700">Mã vạch (NCC)</div>
              </Col>
            )}
            {(pageType === 'edit' || pageType === 'detail') && billCode !== undefined && (
              <Col className="gutter-row " span={3}>
                <div className="text-sm font-bold text-gray-700">Mã vạch (NCC)</div>
              </Col>
            )}
            <Col className="gutter-row " span={3}>
              <div className="text-sm font-bold text-gray-700">Tên sản phẩm</div>
            </Col>
            <Col className="gutter-row" span={2}>
              <div className="text-sm font-bold text-gray-700">ĐVT</div>
            </Col>
            <Col className="gutter-row" span={2}>
              <div className="text-sm font-bold text-gray-700">SL</div>
            </Col>
            {/* {pageType === 'create' && !isShowSelectProduct && (
              <Col className="gutter-row" span={+step === 2 ? 2 : 3}>
                <div className="text-sm font-bold text-gray-700">Số lượng</div>
              </Col>
            )}
            {billCode !== undefined && (
              <Col className="gutter-row" span={2}>
                <div className="text-sm font-bold text-gray-700 ">Số lượng</div>
              </Col>
            )} */}
            {pageType !== 'create' && (
              <Col className="gutter-row" span={3}>
                <div className="text-sm font-bold text-gray-700">Đơn giá (VND)</div>
              </Col>
            )}
            {pageType === 'create' && (
              <Col className="gutter-row" span={isShowSelectProduct ? 3 : 4}>
                <div className="text-sm font-bold text-gray-700">Đơn giá (VND)</div>
              </Col>
            )}

            <Col className="gutter-row" span={3}>
              <div className="text-sm font-bold text-gray-700">SL trả</div>
            </Col>

            {pageType !== 'detail' && billCode !== undefined && (
              <Col className="gutter-row !pr-0" span={3}>
                <div className="text-sm font-bold text-gray-700">Thành tiền</div>
              </Col>
            )}
            {pageType === 'detail' && billCode !== undefined && (
              <Col className="gutter-row !pr-0" span={3}>
                <div className="text-sm font-bold text-gray-700">Thành tiền</div>
              </Col>
            )}
            {(pageType === 'detail' || pageType === 'edit' || pageType === 'create') && billCode === undefined && (
              <Col className="gutter-row !pr-0" span={3}>
                <div className="text-sm font-bold text-gray-700">Thành tiền</div>
              </Col>
            )}

            <Col className="gutter-row text-center" span={1}>
              <div></div>
            </Col>
          </Row>
        )}

        <hr />
        {pageType === 'create' && !isShowSelectProduct && _renderTableFlowGoodReturn()}
        {pageType === 'detail' && billCode !== undefined && _renderTableFlowGoodReturn()}
        {pageType === 'edit' && billCode !== undefined && _renderTableFlowGoodReturn()}

        {isShowSelectProduct && _renderTableNotFlowImportProduct()}
        {pageType === 'detail' && billCode === undefined && _renderTableNotFlowImportProduct()}
        {pageType === 'edit' && billCode === undefined && _renderTableNotFlowImportProduct()}
      </table>
    </div>
  );
};
export default TableGoodPrice;
