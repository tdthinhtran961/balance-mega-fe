import React, { useState } from 'react';
import moment from 'moment';
import { Col, DatePicker, Form, Input, Row, Space, Select } from 'antd';
import { GoodTransferService } from 'services/GoodTransfer';

const TitleForm = (props) => {
  const {
    setSupplier,
    setParams,
    setInforSubOrg,
    setIsNonBalSupplier,
    setValueSupplier,
    params,
    storeId,
    setSupplierType,
    supplierType,
    setItemChoose,
    setValuePartnerName,
  } = props;
  const convertAddress = (address) => {
    if (!address) return '';
    const street = address?.street ? address?.street + ', ' : '';
    const ward = address?.ward && address?.ward ? address?.ward + ', ' : '';
    const district = address?.district && address?.district ? address?.district + ', ' : '';
    const province = address?.province && address?.province ? address?.province + ', ' : '';
    const res = street + ward + district + province;
    if (res[res.length - 2] === ',') {
      return res.slice(0, -2);
    }
    return res;
  };
  const [addBranch, setAddressBranch] = useState('');

  return (
    <>
      {props.pageType === 'create' || props.pageType === 'detail' || props.pageType === 'edit' ? (
        <Row
          gutter={{
            xs: 8,
            sm: 16,
            md: 24,
            lg: 32,
          }}
        >
          {props.pageType !== 'create' ? (
            <div className={`sm:mt-0 mt-2  w-full sm:mb-[16px]`}>
              <Col span={24} sm={12}>
                <div
                  className={`grid md:grid-cols-[190px_minmax(100%,_1fr)]  ${props.pageType !== 'create' && 'mt-4'
                    } items-center`}
                >
                  <span className={`font-normal text-black text-base `}> Mã chuyển hàng: </span>
                  <span className="font-normal text-base text-gray-500 break-all">{props?.data?.code}</span>
                </div>
              </Col>
            </div>
          ) : null}
          <div className="sm:flex items-center w-full sm:mb-[16px] mb-4 mt-2">
            <Col span={24} sm={12}>
              <div className="grid md:grid-cols-[190px_minmax(190px,1fr)] w-full   items-center">
                <span className="font-normal text-black text-base"> Cửa hàng chuyển: </span>
                <span className="font-normal text-base text-gray-500">
                  {props?.data?.store?.name || props?.user?.userInfor?.subOrgName}
                </span>
              </div>
            </Col>
            <Col span={24} sm={12}>
              <div className="sm:mt-0 mt-2">
                <div className="grid md:grid-cols-[190px_minmax(190px,1fr)] w-full  items-center">
                  <span className="font-normal text-black text-base"> Địa chỉ:</span>
                  <span className="font-normal text-base  text-gray-500 break-normal">
                    {convertAddress(props?.data?.store?.address) || props?.addressStoreTransfer}
                  </span>
                </div>
              </div>
            </Col>
          </div>
          <div className="md:flex items-center w-full sm:mb-[16px] mb-4">
            <Col span={24} sm={12}>
              <div className="lg:grid grid-cols-[190px_minmax(100%,_1fr)] items-center">
                <span className="font-normal text-black text-base">Cửa hàng nhận:</span>
                {props.pageType === 'detail' ? (
                  <div className="font-normal text-base text-gray-500"> {props?.data?.storeReceived?.name}</div>
                ) : (
                  <Space>
                    <Form.Item
                      name="nameBrand"
                      style={{ margin: 0 }}
                      rules={[
                        {
                          required: true,
                          message: 'Cửa hàng nhận là bắt buộc',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        // defaultValue={props.listBranchRecive[0]?.name}
                        className="!w-[100%] lg:!w-[60%] !bg-white !border-gray-200 !text-gray-500"
                        style={{
                          width: 337,
                        }}
                        onSelect={(e) => {
                          const data = props?.listBranchRecive?.find((item) => item.id === e).addressBranch;
                          setAddressBranch(data);
                        }}
                        placeholder="Vui lòng chọn cửa hàng"
                      >
                        {props?.listBranchRecive?.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item?.id}>
                              {item?.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Space>
                )}
              </div>
            </Col>
            <Col span={24} sm={12}>
              <div className="sm:mt-0 mt-2 w-full">
                <div className="grid md:grid-cols-[190px_minmax(190px,1fr)] w-full  items-center">
                  <span className="font-normal text-black text-base"> Địa chỉ:</span>
                  <span className="font-normal text-base text-gray-500 break-normal">
                    {convertAddress(props?.data?.storeReceived?.address) || addBranch}
                  </span>
                </div>
              </div>
            </Col>
          </div>
          <div className="md:flex items-center w-full sm:mb-[16px]">
            <Col span={24} sm={12} className="col-disposal-time">
              <div className="md:grid lg:grid-cols-[190px_minmax(100%,_1fr)] items-center time-cancel-field disposal-info-sectiondetail">
                <span className="font-normal text-black text-base">Thời gian chuyển hàng: </span>
                {props.pageType === 'detail' ? (
                  <div className="font-normal text-base text-gray-500">
                    {moment(props?.data?.issuedAt).format('DD/MM/YYYY')}
                  </div>
                ) : (
                  <Space direction="vertical" className="">
                    <Form.Item
                      name="importedAt"
                      style={{
                        margin: 0,
                      }}
                      rules={[
                        {
                          required: true,
                          message: `Thời gian hủy hàng là bắt buộc`,
                        },
                      ]}
                      initialValue={moment()}
                    >
                      <DatePicker
                        // onChange={handleSelectDate}
                        format="DD/MM/YYYY"
                        className="!w-[100%] lg:!w-[60%] !bg-white !border-gray-200 !text-gray-500 "
                        // defaultValue={moment()}
                        disabledDate={(current) => {
                          return moment().add(-1, 'days') >= current;
                          // return current && current.valueOf() < Date.now();
                        }}

                      />
                    </Form.Item>
                  </Space>
                )}

              </div>
            </Col>
            <Col span={24} sm={12}>
              <div className="sm:mt-0 mt-2 w-auto">
                <div className="mb-4 md:grid grid-cols-[190px_minmax(190px,1fr)] w-full items-center">
                  <span className="font-normal text-black text-base">Lý do: <span className="text-[#ff4d4f] text-sm">*</span></span>
                  {props?.pageType === 'detail' ? (
                    <div className="font-normal text-base text-gray-500">{props?.data?.reason}</div>
                  ) : (
                    <Form.Item
                      name="importedReason"
                      style={{
                        margin: 0,
                      }}
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || value.trim() === '') {
                              return Promise.reject(new Error('Lý do nhập hàng là bắt buộc.'));
                            }
                            return Promise.resolve();

                          },
                        }),
                      ]}
                    >

                      <Input
                        className="lg:w-[300px] w-auto  px-3 py-2 !bg-white rounded-[10px] border border-gray-200 focus:!shadow-none focus:!border-gray-200"
                        placeholder="Nhập lý do"
                      />
                    </Form.Item>
                  )}
                </div>
              </div>
            </Col>
          </div>
          <div className="md:flex items-center w-full sm:mb-[16px] mb-4">
            <Col span={24} sm={12} className="goods-return-section-info-col !w-[200px]">
              <div className="md:grid grid-cols-[190px_minmax(180px,_1fr)] items-center goods-return-info-section col-span-5/8">
                <span className="font-normal text-black text-base">Đối tác: </span>
                {/* <Form.Item
                  name="doiTac"
                  rules={[
                    {
                      required: true,
                      message: `Đối tác là bắt buộc`,
                    },
                  ]}
                > */}
                <Select
                  className="!w-[220px] h-[36px] rounded-[10px]  supplier-good-return-select mr-6 mb-4"
                  placeholder="Chọn đối tác"
                  optionFilterProp="children"
                  disabled={props.pageType === 'detail'}
                  value={supplierType}
                  defaultValue="BALANCE"
                  options={[
                    {
                      value: 'BALANCE',
                      label: 'Balance',
                    },
                    {
                      value: 'NON_BALANCE',
                      label: 'Non_Balance',
                    },
                  ]}
                  onSelect={async (e) => {
                    setValueSupplier(null);
                    // setEnableNcc(false)
                    // let data;
                    // setValueSupplierWhenChoosePartner([])
                    if (e === 'BALANCE') {
                      setItemChoose([]);
                      setIsNonBalSupplier(false);
                      setSupplierType(e);

                      try {
                        const res = await GoodTransferService.getListSupplier();
                        setSupplier(res.data);
                        setValuePartnerName(res.data[0].supplier?.name);
                        setInforSubOrg((prev) => ({
                          ...prev,
                          storeId: res.data?.[0]?.storeId,
                          supplierId: res.data?.[0]?.supplierId,
                          infor: res.data?.[0],
                        }));
                        setParams((prev) => ({ ...prev, idSupplier: res.data?.[0]?.supplier?.id }));
                      } catch (err) {
                        console.log(err);
                      }
                    } else if (e === 'NON_BALANCE') {
                      setItemChoose([]);
                      setIsNonBalSupplier(true);
                      setSupplierType(e);
                      try {
                        const res = await GoodTransferService.getListSupplierNonBal({
                          ...params,
                          storeId,
                          supplierType: 'NON_BALANCE',
                        });
                        setSupplier(res.data);
                        setValuePartnerName(res.data[0]?.name);
                        setInforSubOrg((prev) => ({
                          ...prev,
                          storeId: null,
                          supplierId: res.data?.[0]?.id,
                          infor: res.data?.[0],
                        }));
                        setParams((prev) => ({ ...prev, idSupplier: res.data?.[0]?.id }));
                      } catch (err) {
                        console.log(err);
                      }
                    }
                  }}
                ></Select>
                {/* </Form.Item> */}
              </div>
            </Col>
          </div>
        </Row>
      ) : null}
    </>
  );
};
export default TitleForm;
