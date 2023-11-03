import { Input, List, Select, Skeleton } from 'antd';
import { Spin } from 'components';
import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router';
import { routerLinks } from 'utils';
import PromotionGoodsCard from './components/promotionGoodCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import './index.less';


const { Option } = Select;

const ChooseGoods = ({
  setStep,
  listSupplier,
  listProduct,
  setChoosingPromotionGoods,
  choosingPromotionGoods,
  setParams,
  loading,
  setListProduct,
  setInforSubOrg,
  setSearch,
  isLoadingSkeleton,
  setLoadingSkeleton,
  stop,
  hasMore,
  loadingProduct
}) => {
  const [disabled, setDisabled] = useState(true)
  const navigate = useNavigate();
  // const scrollRef = useRef();



  if (!choosingPromotionGoods || loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }


  return (
    <Fragment>
      <div className="promotion-input min-h-screen ">
        <p className="text-2xl font-bold text-teal-900 mb-6">Nhập hàng trực tiếp</p>
        <div className="bg-white pt-[34px] pb-[60px] px-6 rounded-md">
          <div className="supplier-select block md:flex justify-between items-center">
            <div className="relative">
              <Input
                placeholder="Tìm kiếm"
                className="w-full sm:w-[320px] !bg-white rounded-[10px] pl-[55px] pr-[10px] py-[10px] border border-solid border-gray-200 h-[45px] promotion-goods-search focus:!shadow-none focus:!outline-none"
                onChange={(e) => {
                  setListProduct([]);
                  setTimeout(() => {
                    setParams((prev) => ({ ...prev, page: 1, perPage: 12, fullTextSearch: e.target.value || '' }))
                  }, 500)
                }}
                onPressEnter={(e) => {
                  setListProduct([]);
                  setTimeout(() => {
                    setParams((prev) => ({ ...prev, page: 1, perPage: 12, fullTextSearch: e || '' }))
                  }, 500)
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
            <div className='mt-4 md:mt-0 flex justify-end '>
              <Select
                className="w-full sm:w-[282px] h-[36px] rounded-[10px] flex items-center supplier-promotion-select"
                placeholder="Chọn nhà cung cấp"
                optionFilterProp="children"
                allowClear
                defaultValue={listSupplier?.[0]?.supplier?.name}
                defaultActiveFirstOption
                onChange={(value) => {
                  setLoadingSkeleton(true);
                  setParams((prev) => ({ ...prev, filterSupplier: value || '', page: 1, perPage: 12 }));
                  setListProduct([]);
                  setLoadingSkeleton(false);
                }}
                showSearch
                filterOption={(input, option) => {
                  return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              >
                {listSupplier &&
                  listSupplier.map((item, index) => {
                    return (
                      <Option key={index} value={item?.supplier?.name} title={item?.supplier?.name} className="p-0 promotion-supplier-select-wrapper leading-[32px]">
                        <span
                          className="w-full inline-block promotion-select-item pl-2"
                          onClick={() => {
                            setInforSubOrg({ storeId: item?.storeId, supplierId: item?.supplierId, infor: item });
                          }}
                        >
                          {item?.supplier?.name}
                        </span>
                      </Option>
                    );
                  })}
              </Select>
            </div>
          </div>


          <div
            id="scrollableDiv"
            className='list__products__scroll h-[450px] mt-8 overflow-auto pr-4 overflow-y-scroll'
          >
            <InfiniteScroll
              dataLength={listProduct.length}
              next={() => {
                setParams((prev) => ({ ...prev, page: prev.page + 1, perPage: 8 }));
              }}
              hasMore={hasMore}
              scrollableTarget="scrollableDiv"
              loader={
                <Skeleton
                  avatar
                  paragraph={{
                    rows: 1,
                  }}
                  active
                />
              }
            >
              <List
                loading={loadingProduct}
                className='list-product list__products__scroll'
                dataSource={listProduct}
                renderItem={item => {
                  return (
                    <List.Item key={item.id}>
                      <PromotionGoodsCard
                        key={item.id}
                        item={item}
                        choosingPromotionGoods={choosingPromotionGoods}
                        setChoosingPromotionGoods={setChoosingPromotionGoods}
                        setDisabled={setDisabled}
                        disabled={disabled}
                        setInforSubOrg={setInforSubOrg}
                      />
                    </List.Item>
                  );
                }
                }
              />
            </InfiniteScroll>
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button
            onClick={() => {
              return navigate(`${routerLinks('PromotionalGoods')}`);
            }}
            className="h-[44px] w-[106px] rounded-[10px] bg-white border-teal-900 hover:border-teal-600 border-solid border text-sm text-teal-900 hover:text-teal-600"
            id="backBtn"
          >
            Trở về
          </button>

          <button
            onClick={() => {
              navigate(`${routerLinks('PromotionalGoodsCreate')}?step=2`);
              setStep(2);
            }}
            className="h-[44px] w-[126px] rounded-[10px] bg-teal-900 border-teal-900 border-solid border text-sm text-white disabled:opacity-60"
            id="backBtn"
            disabled={disabled}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </Fragment>
  );
};
export default ChooseGoods;
