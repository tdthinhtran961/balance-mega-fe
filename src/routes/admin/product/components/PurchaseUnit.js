import React from 'react';
import { Collapse, InputNumber } from 'antd';
import PurchaseUnitTable from './PurchaseUnitTable';
import { blockInvalidChar, isNullOrUndefined } from '../func';
import { formatCurrency } from 'utils';
import classNames from 'classnames';
import '../index.less';

const { Panel } = Collapse;
function PurchaseUnit({ purchaseUnit, setPurchaseUnit, pageType, setDataSource, setPurchasePrice, purchasePrice, productDetail, basicUnit }) {
  return (
    <div className="">
      <Collapse defaultActiveKey={['1']} expandIconPosition="end" className="">
        <Panel header="Đơn vị và giá bán" key="1" className="bg-gray-300 text-black">
          <div className="flex-col sm:flex-row flex items-center justify-between w-full">
            <h2>Đơn vị nhập: {basicUnit}</h2>
            <div
              className={classNames('flex items-center  mt-2 sm:mt-0', {
                'flex-col sm:flex-row': pageType === 'edit',
              })}
            >
                <p className="mr-5">
                  Giá bán (VND)
                  {pageType === 'detail' ? '' : <span className="text-red-600">*</span>}:
                </p>
                {pageType === 'detail' ? (
                  <span className="w-auto sm:w-[241px]">
                    {isNullOrUndefined(purchasePrice) || purchasePrice === '' ? '' : formatCurrency(purchasePrice, ' ')}
                  </span>
                ) : (
                  <InputNumber
                    formatter={(value) => {
                      if (!value) {
                        return;
                      }
                      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                    }}
                    parser={(value) => {
                      if (!value) {
                        return;
                      }
                      return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
                    }}
                    onKeyDown={blockInvalidChar}
                    className="price-input-wrap border border-gray-200 w-[241px] h-9 rounded-lg px-2 !not-sr-only focus:!shadow-none focus:!border-gray-300 focus:!outline-none "
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e)}
                  />
                )}
            </div>
          </div>
          <PurchaseUnitTable data={purchaseUnit} setData={setPurchaseUnit} pageType={pageType} setDataSource={setDataSource} purchasePrice={purchasePrice} setPurchasePrice={setPurchasePrice} productDetail={productDetail} basicUnit={basicUnit} />
        </Panel>
      </Collapse>
    </div>
  );
}

export default PurchaseUnit;
