import React, { useState, useEffect, Fragment } from 'react';
import { Form, Message, Upload } from 'components';
import './profile.less';
import { useLocation } from 'react-router-dom';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { Form as FormAnt, Tabs } from 'antd';
import avatar from 'assets/images/default-profile.png';
import { ColumnPassword, ColumnInfo, ColumnAddress } from 'columns/profile';
// import { ColumnPassword, ColumnInfo } from 'columns/profile';

import { ProfileService } from 'services/profile';

const { TabPane } = Tabs;

const Page = () => {
  const [form] = FormAnt.useForm();
  const [infoForm] = FormAnt.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const [data, setData] = useState({});
  const [tabKey, setTabKey] = useState(urlSearch.get('tab') || '1');
  const [edit, setEdit] = useState(false);
  // const [province, setProvince] = useState([]);
  // const [provinceCode, setProvinceCode] = useState('');
  // const [district, setDistrict] = useState([]);
  // const [districtCode, setDistrictCode] = useState('');
  // const [ward, setWard] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  // useEffect(() => {
  //   const getListProvince = async () => {
  //     const res = await ProfileService.getListProvince();
  //     setProvince(res.data);
  //   };
  //   getListProvince();
  // }, []);
  // useEffect(() => {
  //   const getListDistrict = async () => {
  //     if (provinceCode) {
  //       const res = await ProfileService.getListDistrict(provinceCode);
  //       setDistrict(res.data);
  //     }
  //   };
  //   getListDistrict();
  // }, [provinceCode]);
  // useEffect(() => {
  //   const getListWard = async () => {
  //     if (districtCode) {
  //       const res = await ProfileService.getListWard(districtCode);
  //       setWard(res.data);
  //     }
  //   };
  //   getListWard();
  // }, [districtCode]);

  const fetchInfo = async () => {
    try {
      const res = await ProfileService.get();
      setData(res);
      setImageUrl(res?.profileImage);
      // setDistrictCode(res?.address?.district?.code);
      // setProvinceCode(res?.address?.province?.code);
    } catch (err) {
      return false;
    }
  };
  useEffect(() => {
    switch (urlSearch.get('tab')) {
      case 1:
        tabKey !== 1 && setTabKey(1)
        break;
      case 2:
        tabKey !== 2 && setTabKey(2)
        break;
      default:
        setTabKey(1)
        break;
    }
  }, [location.search])
  useEffect(() => {
    fetchInfo();
  }, []);

  useEffect(() => {
    setTabKey(urlSearch.get('tab') || '1');
  }, [location]);

  const onChange = (key) => {
    if (!key) return;
    setTabKey(key);
    navigate(routerLinks('Profile') + `?tab=${key}`);
  };

  const changePassword = async (values) => {
    try {
      await form.validateFields();
      const res = await ProfileService.changePassword(values);
      res && Message.success({ text: `Đổi mật khẩu thành công!` });
    } catch (err) {
      return false;
    }
  };

  const submit = async (values) => {
    try {
      await infoForm.validateFields();
      const params = {
        ...values,
        image: imageUrl,

      };
      const res = await ProfileService.put(params);
      res  && res.data.isChangeEmail &&
      Message.success(
        {
          text: "Bạn đã thay đổi thông tin thành công, Vui lòng đăng nhập lại !",
          confirmButtonColor: '#ffffff',
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Đóng'
        }
      )
      // setTimeout(()=>{
      //   navigate(`${routerLinks("Login")}`);
      // },500)
      // res &&
      //   Message.success({ text: `Lưu thành công!` }).then((result) => {
      //     window.location.reload();
      //   });
      setEdit(false);
      // fetchInfo();
      // res && window.location.reload();
    } catch (err) {
      return false;
    }
  };

  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="font-bold text-2xl text-teal-900 mb-5">Thông tin cá nhân</p>
        <div className="flex flex-col bg-white w-full lg:flex-row lg:justify-center lg:bg-gray-100 user-detail-general-form">
          {/* Left form */}
          <div className="bg-white relative w-auto max-w-[80%] lg:w-[30%] 2xl:w-[25%] p-[24px] rounded-xl " style={{ height: 'fit-content' }}>
            <div className="flex justify-center flex-col items-center sm:pb-10">
              {/* {edit ? ( */}
              <>
                <Upload
                  onlyImage={true}
                  maxSize={20}
                  action={async (file) => {
                    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
                       return Message.error({
                        text: 'Định dạng file không hợp lệ. Vui lòng chỉ tải lên file ảnh có định dạng jpg/jpeg/png.',
                         cancelButtonText: 'Đóng'
                      });
                    }
                    const urlArr = await ProfileService.post(file, 'USER');
                    setImageUrl(urlArr[0] ?? '');
                  }}
                >
                  <img
                    src={imageUrl || avatar}
                    alt="productImage"
                    className="aspect-square object-cover rounded-[0.625rem] shadow-md bg-gray-100 cursor-pointer max-h-[500px]"
                  />
                  <div className="w-[55px] h-[45px] bg-teal-600 opacity-80 absolute right-0 bottom-0 rounded-tl-[0.625rem] rounded-br-[0.625rem] flex items-center justify-center">
                    <i className="las la-camera text-white text-xl"></i>
                  </div>
                </Upload>
              </>

              <div className="text-center mt-5 flex items-center justify-center flex-col w-[120%]">
                <h1 className="font-bold text-xl mb-2">{data && data?.name}</h1>
                {data &&
                  data?.userRole &&
                  data?.userRole.length > 0 &&
                  data?.userRole[0]?.mtRole &&
                  data?.userRole[0].mtRole?.name && (
                    <div className="w-full flex flex-row mb-1 text-base justify-center items-center">
                      <p className="w-[22.5px] mr-2">
                        <i className="las la-user-friends text-xl"></i>
                      </p>
                      <div className="text-base">
                        {data &&
                          data?.userRole &&
                          data?.userRole.length > 0 &&
                          data?.userRole[0]?.mtRole &&
                          data?.userRole[0].mtRole?.name === 'owner store' ? 'Chủ cửa hàng' :
                          (data?.userRole[0].mtRole?.name === 'admin' ? 'Quản trị viên' : 'Chủ nhà cung cấp')}
                      </div>
                    </div>
                  )}
                {data && data?.subOrg && data?.subOrg.name && (
                  <div className="w-full flex flex-row text-base items-center justify-center">
                    <div className="w-[30px] flex-none">
                      <svg
                        width="18"
                        height="20"
                        viewBox="0 0 18 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className=""
                      >
                        <path
                          d="M2.57121 11.3493C2.36322 11.3513 2.19582 11.5207 2.1962 11.7286C2.1962 15.8394 5.54067 19.1861 9.65163 19.1861C9.70359 19.1861 9.75542 19.1861 9.80712 19.1851C9.81502 19.1857 9.82279 19.1874 9.83069 19.1874L9.83056 19.1875C9.84663 19.1874 9.8627 19.1865 9.87864 19.1843C13.8849 19.0638 17.1067 15.7678 17.1067 11.7327C17.1067 7.69999 13.8885 4.40548 9.88549 4.28136C9.85603 4.27708 9.8263 4.27641 9.7967 4.27922C9.74835 4.27828 9.69706 4.27734 9.64844 4.27734C9.44072 4.27708 9.27185 4.44462 9.27051 4.65236V11.349L2.57121 11.3493ZM16.3462 11.3493H14.0608C14.0355 10.4535 13.8897 9.56526 13.6271 8.70839C14.1109 8.40277 14.5581 8.04236 14.9595 7.63443C15.7869 8.70397 16.2704 9.99935 16.3462 11.3493V11.3493ZM14.9595 15.8209C14.5581 15.4129 14.1109 15.0525 13.6271 14.7469C13.8897 13.8879 14.0355 12.9974 14.0608 12.0994H16.3462C16.2704 13.4514 15.787 14.7489 14.9595 15.8208V15.8209ZM12.9524 14.3731H12.9526C12.0383 13.9201 11.0397 13.6629 10.0205 13.6173V12.0994H13.3098C13.2867 12.8692 13.1667 13.6331 12.9526 14.3731H12.9524ZM9.27051 18.2865C8.07051 17.5977 7.13996 16.4847 6.58456 15.0862C7.41922 14.6598 8.33447 14.4146 9.27051 14.3668V18.2865ZM10.0205 18.2865V14.3686C10.9556 14.4206 11.8695 14.6674 12.7036 15.0935C12.148 16.4885 11.2205 17.599 10.0205 18.2866V18.2865ZM9.27051 13.6161C8.25332 13.662 7.2565 13.9171 6.34216 14.3654C6.13123 13.6275 6.01391 12.8663 5.993 12.0993H9.27051V13.6161ZM4.34228 15.8193C3.51541 14.7476 3.03232 13.4508 2.95679 12.0993H5.24214C5.26719 12.9948 5.41236 13.8829 5.67366 14.7397C5.18938 15.0466 4.7426 15.409 4.34228 15.8193V15.8193ZM4.83472 16.3931C5.167 16.0466 5.53583 15.7372 5.93509 15.4706C6.38135 16.5514 7.03076 17.477 7.85389 18.1933C6.70546 17.872 5.6632 17.2506 4.83472 16.3928V16.3931ZM11.4495 18.1933C12.2707 17.4784 12.9195 16.5551 13.3656 15.4771V15.4772C13.7646 15.7424 14.1341 16.0498 14.4674 16.394C13.6391 17.2511 12.5974 17.8721 11.4495 18.1933L11.4495 18.1933ZM14.4674 7.07207C14.134 7.41641 13.7647 7.72378 13.3657 7.98908C12.9197 6.91121 12.2712 5.98793 11.4498 5.27286C12.5976 5.59402 13.6391 6.21503 14.4673 7.07207H14.4674ZM10.0205 5.1794C11.2205 5.86724 12.1481 6.97779 12.7038 8.37294C11.8697 8.79911 10.9558 9.04607 10.0205 9.09802V5.1794ZM10.0205 9.84877C11.0404 9.80002 12.0388 9.5398 12.9527 9.0843C13.1639 9.82186 13.2839 10.5826 13.3098 11.3493H10.0205V9.84877Z"
                          fill="#6B7280"
                        />
                        <path
                          d="M4.51591 10.6853C4.58662 10.7716 4.69176 10.8223 4.80318 10.8241H4.80345C4.91488 10.8223 5.01988 10.7718 5.09073 10.6857L7.6169 7.67406C9.14769 6.09733 9.16188 3.5464 7.64583 1.98126C6.92689 1.23194 5.93274 0.809236 4.89426 0.811533H4.89346C3.82913 0.811667 2.81115 1.24693 2.07572 2.01623C0.538213 3.58881 0.517471 6.14149 2.02697 7.71109L4.51591 10.6853ZM2.61305 2.53937C3.20784 1.91568 4.03162 1.56237 4.89332 1.56144H4.89399C5.72916 1.55943 6.52887 1.89921 7.10717 2.5019C8.34653 3.78144 8.33007 5.87006 7.07061 7.15824C7.06391 7.16494 7.05762 7.17177 7.05146 7.17913L4.80386 9.85637L2.59349 7.21664C2.58773 7.20968 2.58157 7.20338 2.57528 7.19682C1.33592 5.91728 1.35237 3.82866 2.61305 2.53945L2.61305 2.53937Z"
                          fill="#6B7280"
                        />
                        <path
                          d="M4.84126 6.67375C5.38661 6.67375 5.90961 6.45706 6.29518 6.07149C6.68076 5.68591 6.89745 5.16292 6.89731 4.61757C6.89731 4.07236 6.68075 3.54936 6.29518 3.16379C5.90961 2.77807 5.38661 2.56152 4.84126 2.56152C4.29591 2.56152 3.77292 2.77822 3.38734 3.16379C3.00177 3.54936 2.78522 4.07236 2.78522 4.61771C2.78575 5.16278 3.00258 5.6854 3.38803 6.07084C3.77361 6.45628 4.29619 6.6731 4.8413 6.67379L4.84126 6.67375ZM4.84126 3.31149C5.18772 3.31149 5.51988 3.44917 5.76485 3.69412C6.00981 3.93907 6.14734 4.27121 6.14734 4.61771C6.14734 4.96406 6.0098 5.29632 5.76485 5.54129C5.5199 5.78625 5.18775 5.92379 4.84126 5.92379C4.49491 5.92379 4.16265 5.78624 3.91767 5.54129C3.67272 5.29634 3.53518 4.96406 3.53518 4.61771C3.53559 4.27135 3.67326 3.93936 3.91809 3.69453C4.16304 3.44971 4.49491 3.3119 4.84126 3.31149V3.31149Z"
                          fill="#6B7280"
                        />
                      </svg>
                    </div>
                    <div className="text-base">{data && data?.subOrg && data?.subOrg?.name}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl w-[90%] lg:w-[70%] 2xl:w-[75%] ml-0 lg:ml-[20px] profile">
            <Tabs defaultActiveKey="1" onChange={onChange} activeKey={String(tabKey)} className="mt-5">
              <TabPane tab="Thông tin cá nhân" key="1" className="">
                <div className="bg-white w-full pr-6 rounded-xl rounded-tl-none pt-6 relative">
                  <Form
                    className="!ml-4 w-full info"
                    columns={ColumnInfo({ edit })}
                    // handSubmit={submit}
                    checkHidden={true}
                    values={data}
                    form={infoForm}
                  />
                  {/* <h1 className="mb-2 ml-4 text-base">
                    Địa chỉ cửa hàng<span className="text-red-400">*</span>
                  </h1> */}
                  <Form
                    className="!ml-4 w-full address"
                    columns={ColumnAddress({
                      // edit,
                      // province,
                      // district,
                      // ward,
                      // setDistrictCode,
                      // setProvinceCode,
                    })}
                    // handSubmit={submit}
                    checkHidden={true}
                    values={data}
                    form={infoForm}
                  />
                </div>
              </TabPane>
              <TabPane tab="Đổi mật khẩu" key="2">
                <div className="bg-white w-full pr-6 rounded-xl pt-6 pb-4 relative">
                  <Form
                    className="!ml-4 w-full info"
                    columns={ColumnPassword()}
                    // handSubmit={submit}
                    checkHidden={true}
                    // values={data}
                    form={form}
                  />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>

        <div className="flex sm:flex-row flex-col items-center justify-end mt-7 ">
          {/* {(edit || tabKey === '2') && ( */}
          <button
            onClick={() => {
              form.resetFields();
              infoForm.resetFields();
              // setImageUrl(data?.profileImage);
            }}
            className="px-4 bg-white border-teal-900 hover:border-teal-600 border-solid border
              text-sm p-2 rounded-[0.625rem] text-teal-900 hover:text-teal-600 mt-2 sm:mr-4 sm:w-auto w-[60%] h-[44px]"
            id="saveBtn"
          >
            Hủy thao tác
          </button>
          {/* )} */}
          {/* {tabKey === '1' && !edit && (
            <button
              // onClick={() => submit(form.getFieldsValue())}
              onClick={() => setEdit(true)}
              className="px-4 bg-teal-900 text-white text-base p-2 rounded-xl hover:bg-teal-600 mt-1"
              id="submitBtn"
            >
              Chỉnh sửa
            </button>
          )} */}
          {tabKey === '1' && (
            <button
              //   onClick={() => submit(form.getFieldsValue())}
              onClick={() => {
                submit(infoForm.getFieldsValue());
                // setEdit(false);
              }}
              className="px-4 bg-teal-900 text-white text-sm p-2 rounded-[0.625rem] hover:bg-teal-600 mt-2 sm:w-28 w-[60%] h-[44px]"
              id="submitBtn"
            >
              Lưu
            </button>
          )}
          {tabKey === '2' && (
            <button
              onClick={() => changePassword(form.getFieldsValue())}
              className="px-4 bg-teal-900 text-white text-sm p-2 rounded-[0.625rem] hover:bg-teal-600 mt-1 sm:w-auto w-[60%] h-[44px]"
              id="submitBtn"
            >
              Đổi mật khẩu
            </button>
          )}
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
