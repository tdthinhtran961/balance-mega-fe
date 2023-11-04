import { Input, List, Modal } from 'antd';
import React, {
  // useEffect,
  useState,
  useRef,
} from 'react';
import './index.less';
import ImportProductCard from './importProductCard';
import ImgNoProduct from 'assets/images/imgNoProduct.png';
// import { Spin } from 'components';
import InfiniteScroll from 'react-infinite-scroll-component';

const ModalAddProduct = ({
  visible,
  setVisible,
  listProduct,
  setListProduct,
  setParams,
  hasMore,
  loading,
  setLoading,
  listOrder,
  setListOrder,
}) => {
  const [dataTempChoose, setDataTempChoose] = useState([]);
  const TimeOutId = useRef();

  return (
    <Modal
      centered
      title={false}
      open={visible}
      maskClosable={false}
      closable={false}
      width={831}
      wrapClassName={'modal-add-importGoodsNonBal-goods'}
      footer={
        <div className="flex justify-between w-full">
          <button
            onClick={() => {
              //   setDataTempChoose([]);
              setVisible(false);
              //   setValueSupplier(temporary);
            }}
            className="w-[106px] h-[44px] hover:bg-teal-900 bg-white border-2 border-radius border-teal-900 hover:text-white text-teal-900 text-sm rounded-[10px]"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              setLoading(true);
              const data = listProduct.filter((goods) => {
                return dataTempChoose.findIndex((item) => item?.barcode === goods?.barcode) === -1;
              });
              setListProduct(data);
              setListOrder(listOrder.concat(dataTempChoose));
              setDataTempChoose([]);
              setLoading(false);
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
        <div className="search-importGoodsNonBal-goods mt-3 ml-2 flex justify-between items-center flex-col gap-2 md:flex-row">
          <div className="relative">
            <Input
              placeholder="Theo mã vạch, tên sản phẩm"
              className="w-[282px] md:w-[320px] !bg-white rounded-[10px] pl-[55px] pr-[10px] py-[10px] border border-solid border-gray-200 h-[45px] importGoodsNonBal-goods-search"
              onChange={(e) => {
                clearTimeout(TimeOutId.current);
                TimeOutId.current = setTimeout(() => {
                  setListProduct([]);
                  setParams((prevState) => ({
                    ...prevState,
                    page: 1,
                    perPage: 12,
                    fullTextSearch: e.target.value,
                  }));
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
        </div>

        <div
          id="scrollableDiv"
          className={`list__products__scroll ${
            listProduct.length <= 3 ? 'h-[210px]' : 'h-[430px]'
          }  mt-8 overflow-auto pr-4`}
        >
          <InfiniteScroll
            dataLength={listProduct.length}
            next={() => {
              setParams((prev) => ({ ...prev, page: prev.page + 1, perPage: 12 }));
            }}
            hasMore={hasMore}
            scrollableTarget="scrollableDiv"
          >
            <List
              loading={loading}
              className="list-add-products list__products__scroll"
              dataSource={listProduct}
              renderItem={(item) => {
                return listProduct.length > 0 ? (
                  <List.Item key={item.id}>
                    <ImportProductCard
                      item={item}
                      dataTempChoose={dataTempChoose}
                      setDataTempChoose={setDataTempChoose}
                      //   choosingImportNonBalGoods={choosingImportNonBalGoods}
                      //   setChoosingImportNonBalGoods={setChoosingImportNonBalGoods}
                      //   setDisabled={setDisabled}
                      //   disabled={disablede}
                      //   showModal={showModal}
                      visible={visible}
                      //   paramsFilterSupplier={paramsFilterSupplier}
                      setParams={setParams}
                      //   pageType={pageType}
                      //   setCheckButton={setCheckButton}
                      //   checkButton={checkButton}
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

export default ModalAddProduct;
