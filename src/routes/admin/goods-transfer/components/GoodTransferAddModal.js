import React, { useState, useRef } from 'react';
import { Modal, Input, Select, List } from 'antd';
import { Spin } from 'components';
import ImgNoProduct from 'assets/images/imgNoProduct.png';
import InfiniteScroll from 'react-infinite-scroll-component';
import DataProductTransfer from './DataProductTransfer';
import { GoodTransferService } from 'services/GoodTransfer';
const GoodTransferAddMode = ({
  displayModal,
  setDisPlayModal,
  pageType,
  listProduct,
  setListProduct,
  listSupplier,
  setParams,
  params,
  setLoading,
  setItemChoose,
  remainingListProduct,
  storeId,
  hasMore,
  itemChoose,
  setLoad,
  load,
  total,
  isNonBalSupplier,
  idStore,
  supplierType,
  valuePartnerName,
  setValuePartnerName,
}) => {
  const { Option } = Select;
  const [dataTempChoose, setDataTempChoose] = useState([]);
  const [checkButton, setCheckButton] = useState(false);
  const TimeOutId = useRef();
  const fetchMoreData = () => {
    setParams((prev) => ({ ...prev, page: prev.page + 1, perPage: 9 }));
  };
  return (
    <Modal
      open={displayModal}
      title={false}
      centered
      onOke={() => {
        setDisPlayModal(false);
      }}
      closable={false}
      width={831}
      wrapClassName={'modal-add-disposal-goods'}
      footer={
        <div className="flex justify-between w-full">
          <button
            onClick={() => {
              setDataTempChoose([]);
              setDisPlayModal(false);
            }}
            className="w-[106px] h-[44px] hover:bg-teal-900 bg-white border-2 border-radius border-teal-900 hover:text-white text-teal-900 text-sm rounded-[10px]"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              setLoading((prev) => ({ ...prev, loadingProduct: true }));
              setItemChoose(itemChoose.concat(dataTempChoose.map(e => ({
                ...e,
                inventoryProductUnits: e.inventoryProductUnits
                                      .sort((a, b) => +a.conversionValue - +b.conversionValue)
                                      .map(f => ({ ...f, isDefault: f.productCode === e.code }))
              }))));
              setDataTempChoose([]);
              setLoading((prev) => ({ ...prev, loadingProduct: false }));
            }}
            id="add"
            className={`w-[126px] h-[44px] hover:bg-teal-700 bg-teal-900 text-white text-sm rounded-[10px]  `}
          >
            Thêm
          </button>
        </div>
      }
    >
      <div>
        <div className="mt-3 ml-2 flex justify-between items-center flex-col gap-2 md:flex-row">
          <div className="relative">
            <Input
              placeholder="Tìm kiếm"
              className="w-[282px] md:w-[320px] !bg-white rounded-[10px] pl-[55px] pr-[10px] py-[10px] border border-solid border-gray-200 h-[45px] disposal-goods-search"
              onChange={(e) => {
                clearTimeout(TimeOutId.current);
                setListProduct([]);
                TimeOutId.current = setTimeout(() => {
                  setParams((prev) => ({ ...prev, page: 1, perPage: 9, fullTextSearch: e.target.value }));
                }, 500);
              }}
            />
            <svg
              width="19"
              height="19"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-[13px] left-[17px] text-gray-700"
            >
              <path
                d="M5.25 0.5C2.631 0.5 0.5 2.631 0.5 5.25C0.5 7.869 2.631 10 5.25 10C6.37977 10 7.41713 9.60163 8.2334 8.94043L12.8135 13.5205L13.5205 12.8135L8.94043 8.2334C9.60163 7.41713 10 6.37977 10 5.25C10 2.631 7.869 0.5 5.25 0.5ZM5.25 1.5C7.318 1.5 9 3.182 9 5.25C9 7.318 7.318 9 5.25 9C3.182 9 1.5 7.318 1.5 5.25C1.5 3.182 3.182 1.5 5.25 1.5Z"
                fill="#9CA3AF"
              />
            </svg>
          </div>
          <div className="mr-6">
            <Select
              showSearch
              filterOption={(input, option) => {
                return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              className="w-[282px] h-[36px] rounded-[10px] flex items-center supplier-disposal-select !border-gray-200"
              placeholder="Chọn nhà cung cấp"
              optionFilterProp="children"
              value={valuePartnerName}
              defaultValue={listSupplier?.[0]?.supplier?.name || listSupplier?.[0]?.name}
              onChange={(value) => {
                setParams({ ...params, idSupplier: value || '', page: 1 });
                setListProduct([]);
              }}
            >
              {listSupplier &&
                listSupplier.length > 0 &&
                listSupplier.map((item, index) => {
                  return (
                    <Option
                      key={index}
                      value={supplierType === 'NON_BALANCE' ? item?.id : +item?.supplier?.id}
                      title={supplierType === 'NON_BALANCE' ? item?.name : item.supplier?.name}
                      className="p-0 disposal-supplier-select-wrapper leading-[32px]"
                    >
                      <span
                        className="w-full inline-block disposal-select-item pl-2"
                        onClick={async () => {
                          const res = await GoodTransferService.getListProduct(
                            supplierType === 'NON_BALANCE'
                              ? {
                                  ...params,
                                  idSupplier: item?.id,
                                  idStore,
                                  storeId: idStore,
                                  supplierType: 'NON_BALANCE',
                                  page: 1,
                                }
                              : {
                                  ...params,
                                  idSupplier: item?.supplierId,
                                  idStore: item?.storeId,
                                  page: 1,
                                },
                          );
                          setListProduct(res?.data?.inventory);
                          setValuePartnerName(isNonBalSupplier ? item?.name : item?.supplier?.name);
                        }}
                      >
                        {supplierType === 'NON_BALANCE' ? item?.name : item?.supplier?.name}
                      </span>
                    </Option>
                  );
                })}
            </Select>
          </div>
        </div>
        <div
          id="scrollableDiv"
          className={`list__products__scroll ${
            listProduct?.length <= 3 ? 'h-[210px]' : 'h-[430px]'
          }  mt-8 overflow-auto pr-4`}
        >
          <InfiniteScroll
            dataLength={listProduct.length}
            next={fetchMoreData}
            hasMore={hasMore}
            scrollableTarget="scrollableDiv"
          >
            {!load ? (
              <List
                loading={load}
                className="list-disposal-product list__products__scroll"
                dataSource={remainingListProduct}
                renderItem={(item) => {
                  return remainingListProduct.length > 0 ? (
                    <List.Item key={item.id}>
                      <DataProductTransfer
                        key={item.id}
                        item={item}
                        remainingListProduct={remainingListProduct}
                        setDataTempChoose={setDataTempChoose}
                        dataTempChoose={dataTempChoose}
                        setCheckButton={setCheckButton}
                        checkButton={checkButton}
                      />
                    </List.Item>
                  ) : (
                    <img className="mx-auto" src={ImgNoProduct}></img>
                  );
                }}
              />
            ) : (
              <Spin className="w-[200px] mt-10" />
            )}
          </InfiniteScroll>
        </div>
      </div>
    </Modal>
  );
};
export default GoodTransferAddMode;
