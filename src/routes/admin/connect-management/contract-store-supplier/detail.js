import React, { Fragment } from 'react';
import { useNavigate } from 'react-router';
import { routerLinks } from 'utils';
// import { Select } from 'antd';
import './index.less';

const Detail = () => {
  const navigate = useNavigate();
  //   const { Option } = Select;

  //   const handleChange = (value) => {
  //     console.log(`selected ${value}`);
  //   };
  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="text-2xl text-teal-900">Hợp đồng kết nối</p>
        <div className="bg-white w-full px-4 rounded-xl mt-5 relative pb-5">
          {/* Section chung tất cả */}
          <div className="flex flex-row items-center">
            <p className="text-xl font-bold text-teal-900 py-4 mr-5">Chi tiết hợp đồng</p>
          </div>
          <div className="w-full sm:flex sm:flex-row">
            <div className="w-full">
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Mã hợp đồng:</div>
                <div>HĐ1234567xyz88</div>
              </div>
              <div className="w-full flex flex-row mb-5 items-center statusCheck">
                <div className="font-bold text-teal-900 w-[150px]">Trạng thái:</div>
                {/* <div>
                  <Select
                    defaultValue="Chờ ký"
                    style={{
                      width: 248,
                    }}
                    onChange={handleChange}
                  >
                    <Option value="Chờ ký">Chờ ký</Option>
                    <Option value="Đã ký">Đã ký</Option>
                    <Option value="Cửa hàng từ chối">Cửa hàng từ chối</Option>
                  </Select>
                </div> */}
                <div>Chờ ký</div>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Ngày tạo:</div>
                <div>01/06/2022</div>
              </div>
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Mẫu hợp đồng:</div>
                <div>
                  <a
                    target="_blank"
                    onClick={() => {
                      navigate(`${routerLinks('SampleContractBetweenStoreNSupplier')}`);
                    }}
                  >
                    <span className="text-[#3B82F6] underline">Nhấn vào đây</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <hr />
          {/* Chi tiết yêu cầu */}
          <div className="flex flex-row items-center">
            <p className="text-base font-bold text-teal-900 py-4 mr-5">Chi tiết yêu cầu</p>
          </div>
          <div className="w-full sm:flex sm:flex-row">
            <div className="w-full">
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Mã yêu cầu:</div>
                <div>YC10000001</div>
              </div>
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Trạng thái:</div>
                <div>Đã phê duyệt</div>
              </div>
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Tên sản phẩm:</div>
                <div>Gạo ST25</div>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Ngày yêu cầu:</div>
                <div>01/06/2022</div>
              </div>
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Ngày phê duyệt:</div>
                <div>01/06/2022</div>
              </div>
              <div className="w-full sm:flex sm:flex-row mb-5">
                <div className="font-bold text-teal-900 mr-5 flex-none">Yêu cầu chi tiết về sản phẩm:</div>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
              </div>
            </div>
          </div>

          <hr />
          {/* Thông tin cửa hàng */}
          <div className="flex flex-row items-center">
            <p className="text-base font-bold text-teal-900 py-4 mr-5">Thông tin cửa hàng</p>
          </div>
          <div className="w-full sm:flex sm:flex-row">
            <div className="w-full">
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Cửa hàng:</div>
                <div>Cửa hàng số 1</div>
              </div>
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Số điện thoại:</div>
                <div>0234123987</div>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Tên chủ cửa hàng:</div>
                <div>Thuận javascript</div>
              </div>
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Địa chỉ:</div>
                <div>Số 1 đường B, phường 2, Quận C, TP Hồ Chí Minh</div>
              </div>
            </div>
          </div>
          <hr />
          {/* Thông tin nhà cung cấp           */}
          <div className="flex flex-row items-center">
            <p className="text-base font-bold text-teal-900 py-4 mr-5">Thông tin nhà cung cấp</p>
          </div>
          <div className="w-full sm:flex sm:flex-row">
            <div className="w-full">
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Nhà cung cấp:</div>
                <div>Nhựt java</div>
              </div>
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Số điện thoại:</div>
                <div>0234123987</div>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Tên chủ cung ứng:</div>
                <div>Huy backend</div>
              </div>
              <div className="w-full flex flex-row mb-5">
                <div className="font-bold text-teal-900 w-[150px]">Địa chỉ:</div>
                <div>Số 1 đường B, phường 2, Quận C, TP Hồ Chí Minh</div>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col items-center justify-between mt-10 ">
            <button
              onClick={() => {
                navigate(`${routerLinks('Contract')}`);
              }}
              className="px-8 bg-white-500 border-teal-900 hover:border-teal-600 border-solid border
            text-[14px] p-2 rounded-xl text-teal-900 hover:text-teal-600 mt-1 sm:w-auto w-[60%]"
              id="backBtn"
            >
              Trở về
            </button>
            {/* <button
              onClick={() => {
              }}
              className="bg-teal-900 text-white text-[14px] px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center"
              id="refusedAllBtn"
            >
              Cập nhật hợp đồng
            </button> */}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Detail;
