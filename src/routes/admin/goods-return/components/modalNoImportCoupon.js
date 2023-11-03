import { Input, List, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import '../index.less';
// import DisposalGoodsCard from './disposalGoodCard';
import noimage from 'assets/images/noimage.jpg';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReturnGoodCard from './returnGoodCard';
// import { GoodsReturnService } from 'services/GoodReturn.js';
import { Spin } from 'components';
const ModalNoImportCoupon = ({
  visibleNo,
  setVisibleNo,
  listProduct,
  setLoading,
  pageType,
  step,
  hasMore,
  setArrayProductlist,
  arrayProductlist,
  dataSearchFollowCodeProduct,
  arrMap,
  setListProduct,
  setItemChoose,
  itemChoose,
  load,
  remainingListProductList,
  setRemainingListProductList,
  dataDelete,
  setDataDelete,
  setParamsReturn,
  paramsReturn
}) => {
  const [dataTempChoose, setDataTempChoose] = useState([]);
  const [checkButton, setCheckButton] = useState(false);
  const TimeOutId = useRef();
  const array = arrMap().result.concat(dataDelete);
  const [arr, setArr] = useState([]);
  useEffect(() => {
    const a = listProduct?.filter((goods) => {
      return arrayProductlist?.findIndex((item) => item?.barcode === goods?.barcode) === -1;
    });
    setArr(a);
  }, [dataDelete?.length]);

  return (
    <Modal
      title={false}
      centered
      visible={visibleNo}
      width={831}
      onCancel={() => setVisibleNo(false)}
      maskClosable={false}
      closable={false}
      wrapClassName={'modal-add-good-return'}
      footer={
        <div className="flex justify-between ">
          <button
            onClick={() => {
              setDataTempChoose([]);
              setVisibleNo(false);
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
                                                          isDefault: f.productCode === e.code,
                                                        })),
                                }))
              setArrayProductlist(arrayPlush);

              const remainingListProduct = remainingListProductList?.filter((goods) => {
                return dataTempChoose?.findIndex((item) => item?.barcode === goods?.barcode) === -1;
              });
              setListProduct(remainingListProduct);
              setRemainingListProductList(remainingListProduct);
              const a = array?.filter((goods) => {
                return dataTempChoose?.findIndex((item) => item?.barcode === goods?.barcode) === -1;
              });
              a.length === 0 ? a.push(1) : a.push();
              setArr(a);
              // setDataDelete([])
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
                clearTimeout(TimeOutId.current);
                setListProduct([]);
                TimeOutId.current = setTimeout(() => {
                  setParamsReturn((prev) => ({ ...prev, page: 1, perPage: 9, fullTextSearch: e.target.value }));
                }, 200);
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

        <div>
          <div
            id="scrollableDiv"
            className={`list__products__scroll ${
              listProduct.length <= 3 ? 'h-[210px]' : 'h-[430px]'
            }  mt-8 overflow-auto pr-4`}
          >
            {arr[0] !== 1 && (
              <InfiniteScroll
                dataLength={listProduct.length}
                next={() => {
                  setParamsReturn((prev) => ({ ...prev, page: prev.page + 1, perPage: 9 }));
                }}
                hasMore={hasMore}
                scrollableTarget="scrollableDiv"
              >
                {!load ? (
                  <List
                    loading={load}
                    className="list-return-product list__products__scroll"
                    dataSource={array.length === 0 ? arr : array}
                    renderItem={(item) => {
                      return (arr.length === 0 ? array.length : arr.length) > 0 ? (
                        <List.Item key={item.id}>
                          <ReturnGoodCard
                            key={item.id}
                            item={item}
                            pageType={pageType}
                            step={step}
                            setArrayProductlist={setArrayProductlist}
                            arrayProductlist={arrayProductlist}
                            dataSearchFollowCodeProduct={dataSearchFollowCodeProduct}
                            itemChoose={itemChoose}
                            setDataTempChoose={setDataTempChoose}
                            dataTempChoose={dataTempChoose}
                            setCheckButton={setCheckButton}
                            checkButton={checkButton}
                          />
                        </List.Item>
                      ) : (
                        <img className="mx-auto" src={noimage}></img>
                      );
                    }}
                  />
                ) : (
                  <Spin className="w-[200px] mt-10" />
                )}
              </InfiniteScroll>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalNoImportCoupon;
