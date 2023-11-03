import './index.less';
import { Card, List, Skeleton, Select, Input } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { InputProductService } from 'services/input-product';
import { formatCurrency, routerLinks } from 'utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCart } from 'cartContext';
import { blockInvalidChar } from './cartDetail';
import ModalDetail from './modalDetial';
const { Search } = Input;
const { Option } = Select;

function Page() {
  const location = useLocation();
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const idProduct = urlSearch.get('id');
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [listProduct, setListProduct] = useState([]);
  const [total, setTotal] = useState(8);
  const [detailProduct, setDetailProduct] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { addToCart } = useCart();
  const timeout = useRef();
  const [, setNameSupplier] = useState('');
  const [visible, setVisible] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    perPage: 8,
    fullTextSearch: '',
    filterSupplier: '',
    // filterCategory: '',
  });

  const key = 'id';
  const arrayListProduct = [...new Map(listProduct?.map((item) => [item[key], item])).values()];

  const fetchListProduct = async () => {
    if (loading) {
      return;
    }
    if (total !== 0 && arrayListProduct?.length >= total) {
      setHasMore(false);
      return;
    } else {
      setHasMore(true);
    }
    try {
      setLoading(true);
      const resProduct = await InputProductService.getListProduct(params);
      setListProduct(listProduct.concat(resProduct?.data));
      setTotal(resProduct?.count);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchListProduct();
  }, [params]);

  let title = '';

  switch (pageType) {
    case 'product':
      title = 'Sản phẩm';
      break;
    case 'detail':
      title = 'Sản phẩm';
      break;
    default:
      title = 'Cửa hàng';
      break;
  }

  const increase = () => {
    setAmount((amount) => {
      const tempAmount = Math.floor(Number(amount)) + 1;
      return tempAmount;
    });
  };
  const decrease = () => {
    setAmount((amount) => {
      let tempAmount = Number.isInteger(Number(amount)) ? Math.floor(Number(amount)) - 1 : Math.floor(Number(amount));
      if (tempAmount < 0) tempAmount = 1;
      return tempAmount;
    });
  };
  const dataCart = {
    productId: detailProduct?.id || idProduct,
    quantity: amount,
  };

  const [listSupplier, setSupplier] = useState([]);

  useEffect(() => {
    const fetchListFilter = async () => {
      const res = await InputProductService.getListSupplier();
      setSupplier(res.data);
    };
    fetchListFilter();
  }, []);

  const onSearch = (value) => {
    setParams({ ...params, page: 1, fullTextSearch: value || '' });
    setListProduct([]);
  };

  return (
    <Fragment>
      <div className="table-category min-h-screen input-product-wrapper">
        <p className="text-2xl font-bold text-teal-900 mb-6">
          {pageType === 'detail' && (
            <button className="h-10 w-10 bg-teal-900 text-white rounded-lg mr-2" onClick={() => window.history.back()}>
              <i className="las la-arrow-left"></i>
            </button>
          )}
          {title}
        </p>
        {pageType === 'product' && (
          <div className="bg-white rounded-xl">
            <div className="px-4 pb-14 pt-6">
              <div className="md:flex items-center justify-between mb-10">
                <div className="relative lg:mb-6 lg:w-[278px] sm:w-[311px] w-full">
                  <div className="search-container search-product">
                    <Search
                      placeholder="Theo mã vạch, tên sản phẩm"
                      allowClear
                      onSearch={onSearch}
                      onChange={(e) => {
                        clearTimeout(timeout.current);
                        timeout.current = setTimeout(() => {
                          setListProduct([]);
                          setParams({ ...params, page: 1, fullTextSearch: e.target.value || '' });
                        }, 500);
                      }}
                      style={{
                        width: 322,
                      }}
                    />
                  </div>
                  <i className="text-[22px] las la-search absolute top-3 left-5 sm:z-10 -rotate-90" />
                </div>
                <div className="select-product lg:flex items-center -mt-[4px]">
                  <Select
                    className="w-full"
                    allowClear
                    showSearch
                    placeholder="Chọn nhà cung cấp"
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }}
                    onChange={(v) => {
                      if (!v) {
                        setParams({ ...params, page: 1, filterSupplier: '' });
                        setNameSupplier('');
                        setListProduct([]);
                      } else {
                        setParams({ ...params, page: 1, filterSupplier: v || '' });
                        setNameSupplier(v);
                        setListProduct([]);
                      }
                    }}
                  >
                    {listSupplier &&
                      listSupplier.map((item, index) => {
                        return (
                          <Option key={index} value={item?.supplier?.name} title={item?.supplier?.name}>
                            {item?.supplier?.name}
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </div>

              <InfiniteScroll
                id="scrollableDiv"
                dataLength={arrayListProduct.length}
                next={() => {
                  setParams((prev) => ({ ...prev, page: params.page + 1, perPage: 8 }));
                }}
                hasMore={hasMore}
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
                  loading={loading}
                  className="list-product"
                  dataSource={arrayListProduct}
                  renderItem={(item) => (
                    <List.Item key={item.id}>
                      <div key={item.id} span={6} style={{ marginBottom: 20 }}>
                        <Card
                          hoverable
                          className="card__wrap"
                          cover={
                            <img
                              alt={item.name}
                              src={item?.photos?.[0]?.url}
                              style={{ height: 180, width: '100%' }}
                              className="object-cover "
                                onClick={async () => {
                                  setLoading(true);
                                  const resProductDetail = await InputProductService.getProductDetailById(item?.id);
                                  setDetailProduct(resProductDetail);
                                  item?.id && setVisible(true);
                                  setLoading(false);
                                // navigate(`${routerLinks('InputProductDetail')}?id=${item?.id}`);
                                // window.scrollTo(0, 0);
                              }}
                            />
                          }
                        >
                          <h4
                            className="text-gray-600 font-normal text-base text-center truncate"
                            onClick={() => navigate(`${routerLinks('InputProductDetail')}?id=${item?.id}`)}
                          >
                            {item.name}
                          </h4>
                          <h5 className="font-bold text-gray-600 text-xs text-center mb-3">{item?.subOrg?.name}</h5>
                          <div className="flex items-center justify-center">
                            <span className="font-bold text-xl text-teal-900">
                              {formatCurrency(item?.productPrice?.[0]?.price, ' VND')}
                            </span>
                          </div>
                          <button
                            className="mt-3 px-5 py-2 items-center bg-teal-900 rounded-xl border border-teal-900 text-white hover:bg-teal-700"
                            onClick={async () => {
                              setLoading(true);
                              const resProductDetail = await InputProductService.getProductDetailById(item?.id);
                              setDetailProduct(resProductDetail);
                              item?.id && setVisible(true);
                              setLoading(false);
                            }}
                          >
                            <span className="text-sm">Thêm vào giỏ hàng</span>
                          </button>
                        </Card>
                      </div>
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </div>
        )}
      </div>
      {visible && (
        <ModalDetail
          visible={visible}
          setVisible={setVisible}
          addToCart={addToCart}
          dataCart={dataCart}
          amount={amount}
          setAmount={setAmount}
          detailProduct={detailProduct}
          setDetailProduct={setDetailProduct}
          decrease={decrease}
          blockInvalidChar={blockInvalidChar}
          increase={increase}
          setLoading={setLoading}
          loading={loading}
        />
      )}
    </Fragment>
  );
}

export default Page;
