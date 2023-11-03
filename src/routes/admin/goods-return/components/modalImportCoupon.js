import { Input, List, Modal } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import '../index.less';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReturnGoodCardImport from './returnGoodCardImport';
import ImgNoProduct from 'assets/images/imgNoProduct.png';
const ModalImportCoupon = ({
  visible,
  setVisible,
  setSearch,
  paramsReturn,
  setParamsReturn,
  setLoading,
  importCouponListModal,
  setImportCouponListModal,
  setArrayProductlist,
  arrayProductlist,
  hasMoreImport,
  loading
}) => {
  const [showModal, setShowModal] = useState(false);
  const [dataTempChoose, setDataTempChoose] = useState([]);
  useEffect(() => {
    if (visible === true) {
      setShowModal(true);
    } else setShowModal(false);
  }, [visible]);
    const TimeOutId = useRef();
  return (
    <Modal
      title={false}
      centered
      visible={visible}
      width={831}
      maskClosable={false}
      closable={false}
      wrapClassName={'modal-add-disposal-goods'}
      footer={
        <div className="flex justify-between w-full">
          <button
            onClick={() => {
              setDataTempChoose([]);
              setVisible(false);
              setImportCouponListModal([]); 
            }}
            className="w-[106px] h-[44px] hover:bg-teal-900 bg-white border-2 border-radius border-teal-900 hover:text-white text-teal-900 text-sm rounded-[10px]"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              setLoading((prev) => ({ ...prev, loadingProduct: true }));
              const arrayPlush = arrayProductlist
                                .concat(...dataTempChoose)
                                .map(e => ({ 
                                  ...e, 
                                  inventoryProductUnits: e.inventoryProductUnits
                                                        .sort((a, b) => +a.conversionValue - +b.conversionValue)
                                                        .map(f => ({ 
                                                          ...f, 
                                                          isDefault: f.productCode === e.productCodeStore,
                                                        })),
                                }))
              setArrayProductlist(arrayPlush);
              const remainingListProduct = importCouponListModal?.filter((goods) => {
                return dataTempChoose?.findIndex((item) => item?.barcode === goods?.barcode) === -1;
              });
              setImportCouponListModal(remainingListProduct);
              setDataTempChoose([]);
              setLoading((prev) => ({ ...prev, loadingProduct: false }));
            }}
            id="add"
            className="w-[156px] h-[44px] hover:bg-teal-700 bg-teal-900 text-white text-sm rounded-[10px]"
          >
            Thêm
          </button>
        </div>
      }
    >
      <div>
        <div className="search-goods-return ml-2">
          <div className="flex justify-between items-center relative">
            <Input
              placeholder="Tìm kiếm"
              className="w-[320px] !bg-white rounded-[10px] pl-[55px] pr-[10px] py-[10px] border border-solid border-gray-200 h-[45px] promotion-goods-search"
              onChange={(e) => {
                setLoading((prev) => ({ ...prev, loadingProduct: true }));
                clearTimeout(TimeOutId.current);
                setImportCouponListModal([]);
                TimeOutId.current = setTimeout(() => {
                  setParamsReturn((prev) => ({ ...prev, page: 1, perPage: 9, fullTextSearch: e.target.value }));
                }, 500);
                setLoading((prev) => ({ ...prev, loadingProduct: false }));
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
        </div>
        <div
          id="scrollableDiv"
          className={`list__products__scroll ${
            importCouponListModal?.length <= 3 ? 'h-[210px]' : 'h-[430px]'
          }  mt-8 overflow-auto pr-4`}
        >
          <InfiniteScroll
            dataLength={importCouponListModal}
            next={() => {
              setParamsReturn((prev) => ({ ...prev, page: prev.page + 1, perPage: 9 }));
            }}
            hasMore={hasMoreImport}
            scrollableTarget="scrollableDiv"
          >
            <List
              loading={loading}
              className="list-disposal-product list__products__scroll"
              dataSource={importCouponListModal}
              renderItem={(item) => {
                return importCouponListModal.length > 0 ? (
                  <List.Item key={item.id}>
                    <ReturnGoodCardImport
                      key={item.id}
                      item={item}
                      showModal={showModal}
                      dataTempChoose={dataTempChoose}
                      setDataTempChoose={setDataTempChoose}
                      setParamsReturn={setParamsReturn}
                    />
                  </List.Item>
                ) : (
                  <img className="mx-auto" src={ImgNoProduct}></img>
                );
              }}
            />
          </InfiniteScroll>
        </div>
      </div>
    </Modal>
  );
};

export default ModalImportCoupon;
