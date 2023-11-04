import { Modal, Row, Col, InputNumber } from 'antd';
import React from 'react';
import ProductImage from './components/ProductImage';
import ProductPrice from './components/ProductListPrice';
import { Message } from 'components';

const ModalDetail = ({
  visible,
  setVisible,
  addToCart,
  dataCart,
  setAmount,
  detailProduct,
  setDetailProduct,
  decrease,
  amount,
  blockInvalidChar,
  increase,
  loading,
}) => {
  const handleAddToCart = (data) => {
    if (data.productId !== undefined && data.productId !== null) {
      if (data.quantity === null) {
        return Message.error({ text: 'Xin mời bạn nhập số lượng.' });
      }
      setAmount(1);
      setVisible(false);
      setDetailProduct([]);
      return addToCart(data);
    }
  };
  return (
    <Modal
      title={false}
      centered
      open={visible}
      width={840}
      maskClosable={false}
      closable={false}
      loading={loading}
      footer={
        <div className="flex justify-end w-full">
          <button
            onClick={() => {
              setVisible(false);
              setAmount(1);
            }}
            className="w-[106px] h-[44px] hover:bg-teal-900 bg-white border-2 border-radius border-teal-900 hover:text-white text-teal-900 text-sm rounded-[10px] mr-2 mb-1"
          >
            Đóng
          </button>
        </div>
      }
    >
      <div className="bg-white rounded-xl">
        <h4 className="px-4 text-xl font-semibold text-teal-900 pt-4">Chi tiết sản phẩm</h4>
        <div className="sm:py-6 mt-3 sm:mt-6 sm:pb-0 sm:px-2 overflow-y-scroll max-h-[60vh]">
          <Row
            gutter={{
              xs: 8,
              sm: 16,
              md: 24,
              lg: 32,
            }}
            style={{ marginRight: 0, marginLeft: '-6px' }}
            className="tableChoose"
          >
            <Col span={24} lg={{span:7}} className="!pr-1  FlexTable">
              {detailProduct?.photos?.length > 0 && <ProductImage images={detailProduct?.photos} />}
              <div className="mb-3 btn-amount mt-5">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-full flex items-center justify-center">
                    <button
                      onClick={decrease}
                      className="h-8 w-8 leading-8 text-center rounded-full bg-transparent border border-teal-900 text-teal-900"
                    >
                      <i className="las la-minus"></i>
                    </button>
                    <InputNumber
                      type="number"
                      min={0}
                      value={amount}
                      onKeyDown={blockInvalidChar}
                      onChange={(value) => {
                        setAmount(value && value.toFixed(2));
                      }}
                      className="text-base text-center py-2 px-3 w-36 mx-2 focus:border-teal-900"
                    />
                    <button
                      onClick={increase}
                      className="h-8 w-8 leading-8 text-center rounded-full bg-transparent border border-teal-900 text-teal-900"
                    >
                      <i className="las la-plus"></i>
                    </button>
                  </div>
                </div>
                <div className="text-base text-center mt-3"> {detailProduct?.basicUnit}</div>
                <div className="mt-3 flex justify-center ">
                  <button
                    className="px-5 py-2 flex items-center bg-teal-900 rounded-xl border border-teal-900 text-white hover:bg-teal-700"
                    onClick={() => {
                      handleAddToCart(dataCart);
                    }}
                  >
                    <i className="las la-shopping-cart text-xl mr-2"></i>{' '}
                    <span className="text-sm">Thêm vào giỏ hàng</span>
                  </button>
                </div>
              </div>
            </Col>
            <Col span={24} lg={{span:17}} className="flexCol !pr-0">
              <div className="pb-6 pt-0 pr-0 pl-1 lg:pl-6 bg-white rounded-xl">
                <div className="mb-6">
                  <span className="font-bold sm:text-3xl text-xl text-teal-900 ">{detailProduct?.name}</span>
                </div>
                <div className="flex flex-row gap-4">
                  <div className="flex sm:w-[50%] w-[48%] sm:gap-6 gap-2">
                    <div className="font-bold text-base text-teal-900">Thuế nhập: </div>
                    <div className="font-bold text-base ">{detailProduct?.importTax?.taxRate}%</div>
                  </div>
                  <div className="flex sm:gap-5 gap-2">
                    <div className="font-bold text-base text-teal-900">Thuế bán: </div>
                    <div className="font-bold text-base ">{detailProduct?.exportTax?.taxRate}%</div>
                  </div>
                </div>

                <div className="mb-4 mt-4">
                  <p className="font-bold text-base text-teal-900 table-price">Bảng giá sản phẩm:</p>
                  <ProductPrice
                    listPrice={detailProduct?.productPrice
                      ?.sort((a, b) => a.id - b.id)
                      ?.map((item, index) => ({ ...item, stt: index + 1 }))}
                  />
                </div>

                <Row className="NonFlex block xl:flex">
                  <Col span={24} lg={{span:12}}>
                    <div className="mb-4 grid lg:grid-cols-[112px_minmax(112px,_1fr)] grid-cols-[140px_minmax(112px,_1fr)]">
                      <span className="font-bold text-teal-900 text-base">Mã sản phẩm: </span>
                      <span className="text-base">{detailProduct?.code}</span>
                    </div>
                  </Col>
                  <Col span={24} lg={{span:12}}>
                    <div className="mb-4 grid lg:grid-cols-[112px_minmax(112px,_1fr)] grid-cols-[140px_minmax(112px,_1fr)]">
                      <span className="font-bold text-teal-900 text-base">Mã vạch: </span>
                      <span className="text-base"> {detailProduct?.barcode}</span>
                    </div>
                  </Col>
                  <Col span={24} lg={{span:12}}>
                    <div className="mb-4 grid lg:grid-cols-[112px_minmax(112px,_1fr)] grid-cols-[140px_minmax(112px,_1fr)]">
                      <span className="font-bold text-teal-900 text-base">Thương hiệu: </span>
                      <span className="text-base">{detailProduct?.brand}</span>
                    </div>
                  </Col>
                  <Col span={24} lg={{span:12}}>
                    <div className="mb-4 grid lg:grid-cols-[112px_minmax(112px,_1fr)] grid-cols-[140px_minmax(112px,_1fr)]">
                      <span className="font-bold text-teal-900 text-base">Danh mục: </span>
                      {detailProduct && (
                        <span className="text-base">
                          {detailProduct?.productCategory?.length > 1
                            ? detailProduct?.productCategory?.reduce(
                                (previousValue, currentValue) =>
                                  (previousValue?.category?.name ? previousValue?.category?.name : previousValue) +
                                  ', ' +
                                  currentValue?.category?.name,
                              )
                            : detailProduct?.productCategory?.[0]?.category.name}
                        </span>
                      )}
                    </div>
                  </Col>
                  <Col span={24} lg={{span:12}}>
                    <div className="mb-4 grid lg:grid-cols-[112px_minmax(112px,_1fr)] grid-cols-[140px_minmax(112px,_1fr)]">
                      <span className="font-bold text-teal-900 text-base">Nhà cung cấp: </span>
                      <span className="text-base">{detailProduct?.subOrg?.name}</span>
                    </div>
                  </Col>

                  {detailProduct?.abilitySupply &&
                    (detailProduct?.abilitySupply?.quarter ||
                      detailProduct?.abilitySupply?.month ||
                      detailProduct?.abilitySupply?.year) && (
                      <Col span={24}>
                        <div>
                          <div className="mb-4 grid">
                            <span className="font-bold text-teal-900 text-base">Khả năng cung ứng: </span>
                          </div>
                          <div className="md:flex flex-row sm:gap-4 gap-1 text-base mb-4 sm:ml-0 ml-4 ">
                            {detailProduct?.abilitySupply?.month && (
                              <div className="flex gap-3 sm:w-[33%] text-base">
                                <div className="text-teal-900 font-[16px]">Theo tháng:</div>
                                <div>{detailProduct?.abilitySupply?.month}</div>
                              </div>
                            )}
                            {detailProduct?.abilitySupply?.quarter && (
                              <div className="flex gap-3 sm:w-[30%] ">
                                <div className="text-teal-900  ">Theo quý:</div>
                                <div>{detailProduct?.abilitySupply?.quarter}</div>
                              </div>
                            )}
                            {detailProduct?.abilitySupply?.year && (
                              <div className="flex gap-3  text-base">
                                <div className="text-teal-900  font-[16px]">Theo năm:</div>
                                <div>{detailProduct?.abilitySupply?.year}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Col>
                    )}
                  {detailProduct?.exportMarket && (
                    <Col span={24} lg={{span:12}}>
                      <div className="grid lg:grid-cols-[112px_minmax(112px,_1fr)] grid-cols-[140px_minmax(112px,_1fr)]">
                        <span className="font-bold text-teal-900 text-base">Thị trường xuất khẩu: </span>
                        <span className="text-base">{detailProduct?.exportMarket}</span>
                      </div>
                    </Col>
                  )}
                  {detailProduct?.description && (
                    <Col span={24}>
                      <div className="mb-4 mt-4">
                        <h3 className="font-bold text-teal-900 text-base">Mô tả sản phẩm: </h3>
                        <p className="font-normal  text-base text-justify mt-2 whitespace-pre-wrap">
                          {detailProduct?.description}
                        </p>
                      </div>
                    </Col>
                  )}
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDetail;
