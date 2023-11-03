import React, { useState, Fragment, useEffect } from 'react';
import { Form, Message } from 'components';
import { ColumnUserCreate } from 'columns/user';
import { UserService } from 'services/user';
import './index.less';
import { useLocation } from 'react-router-dom';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { Form as FormAnt } from 'antd';

const Page = () => {
  const [form] = FormAnt.useForm();
  const location = useLocation();
  const [, setLoading] = useState(false);
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const idUser = urlSearch.get('id');
  const [data, setData] = useState({});
  const [roleList, setRoleList] = useState([]);

  useEffect(() => {
    const initFunction = async () => {
      if (idUser) {
        const res = await UserService.getById(parseInt(idUser));
        let roleCode;
        if (res.roleCode === 'ADMIN') {
          roleCode = 'Quản trị viên';
        } else if (res?.roleCode === 'OWNER_STORE') {
          roleCode = 'Chủ cửa hàng';
        } else if (res.roleCode === 'OWNER_SUPPLIER' || res.roleCode === 'DISTRIBUTOR') roleCode = 'Nhà cung cấp';
        setData({ id: idUser, ...res, roleCode });
      } else setData({ roleCode: 'Quản trị viên' });
    };
    initFunction();
  }, [idUser]);

  useEffect(() => {
    const initFunction = async () => {
      const res = await UserService.getRoles();
      setRoleList(res);
    };
    initFunction();
  }, []);

  let title = '';

  switch (pageType) {
    case 'create':
      title = 'Thêm người dùng';
      break;
    case 'detail':
      title = 'Chi tiết người dùng';
      break;
    case 'edit':
      title = 'Chỉnh sửa người dùng';
      break;
    default:
      title = 'Người dùng';
      break;
  }

  const submit = async (values) => {
    try {
      await form.validateFields();
      let code;
      if (values.roleCode === '1' || values.roleCode === 'Quản trị viên') code = 'Quản trị viên';
      else if (values.roleCode === '2' || values.roleCode === 'Chủ cửa hàng') code = 'Chủ cửa hàng';
      else if (values.roleCode === '3' || values.roleCode === 'Nhà cung cấp') code = 'Nhà cung cấp';
      if (code && data.roleCode && data.roleCode !== 'Quản trị viên' && data.roleCode !== code && pageType === 'edit') {
        let role;
        if (data.roleCode === 'Chủ cửa hàng') role = 'chủ cửa hàng';
        else if (data.roleCode === 'Nhà cung cấp') role = 'nhà cung cấp';
        setData({ ...values, roleCode: data.roleCode });
        Message.warning({
          title: 'Thông báo',
          text: `Người dùng này hiện đang là ${role}. Không thể thay đổi vai trò của người dùng này.`,
          showConfirmButton: false,
        });
        return;
      }
      let res;
      let param;
      // let role;
      // let roleId;
      // if (values.roleCode === 'Quản trị viên' || values.roleCode === '1') {
      //   role = 'quản trị viên';
      //   roleId = 1;
      // } else if (values.roleCode === 'Chủ cửa hàng' || values.roleCode === '2') {
      //   role = 'chủ cửa hàng';
      //   roleId = 2;
      // } else if (values.roleCode === 'Nhà cung cấp' || values.roleCode === '3') {
      //   role = 'nhà cung cấp';
      //   roleId = 3;
      // }
      pageType === 'create'
        ? (param = {
            ...values,
            status: 'ACTIVE',
            roleId: 1,
            addressDto: {
              street: 'dien bien phu',
              district: null,
              city: null,
              country: null,
              postCode: null,
            },
            orgId: null,
            subOrgId: null,
          })
        : (param = { ...values, roleId: +data.roleId });

      setLoading(true);
      pageType === 'create' ? (res = await UserService.post(param)) : (res = await UserService.put(param, idUser));
      setLoading(false);
      if (res && pageType === 'create') {
        Message.success({ text: `Thêm quản trị viên thành công` });
        return navigate(`${routerLinks('User')}`);
      } else if (res && pageType === 'edit') {
        Message.success({ text: `Lưu người dùng thành công` });
        return navigate(`${routerLinks('User')}`);
      }
    } catch (err) {
      let role;
      if (values.roleCode === 'Quản trị viên' || values.roleCode === '1') role = 'quản trị viên';
      else if (values.roleCode === 'Chủ cửa hàng' || values.roleCode === '2') role = 'chủ cửa hàng';
      else if (values.roleCode === 'Nhà cung cấp' || values.roleCode === '3') role = 'nhà cung cấp';
      const validationErrors = err.errorFields;
      let checkValidForm = false;
      validationErrors.forEach((valid) => {
        if (valid.errors.length > 0) {
          checkValidForm = true;
        }
      });
      if (checkValidForm) return;
      if (pageType === 'create') {
        Message.error({ text: `Thêm ${role} không thành công` });
      } else if (pageType === 'edit') {
        Message.error({ text: `Lưu ${role} không thành công` });
      }
      setLoading(false);
    }
  };

  const changeActive = async () => {
    try {
      let res;
      if (data.status === 'ACTIVE') {
        // console.log(data.roleCode);
        const subOrgStatus = await UserService.checkactive(data.subOrgId);
        // console.log(subOrgStatus);
        if (data.roleCode === 'Quản trị viên' || data.roleCode === undefined || subOrgStatus === false) {
          Message.confirm({
            text: 'Bạn có chắc muốn hủy kích hoạt người dùng này?',
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Đồng ý',
            onConfirm: async () => {
              res = await UserService.delete(idUser);
              res && Message.success({ text: 'Hủy kích hoạt tài khoản thành công', showConfirmButton: false });
              return navigate(`${routerLinks('User')}`);
            },
          });
        } else {
          let role;
          if (data.roleCode === 'Chủ cửa hàng') role = 'chủ cửa hàng';
          else if (data.roleCode === 'Nhà cung cấp') role = 'nhà cung cấp';
          Message.warning({
            title: 'Thông báo',
            text: `Người dùng này hiện đang là ${role}.
          Không thể hủy kích hoạt người dùng này.
          Vui lòng hủy kích hoạt cửa hàng trước khi hủy kích hoạt người dùng`,
            showConfirmButton: false,
          });
        }
      } else {
        res = await UserService.active(idUser);
        res && Message.success({ text: 'Kích hoạt tài khoản thành công', showConfirmButton: false });
        return navigate(`${routerLinks('User')}`);
      }
    } catch (err) {
      console.log('Error is:', err);
      if (data.status === 'ACTIVE') {
        Message.error({ text: `Hủy kích hoạt tài khoản không thành công` });
      } else {
        Message.error({ text: `Kích hoạt tài khoản không thành công` });
      }
    }
  };

  return (
    <Fragment>
      <div className="min-h-screen store-wrapper">
        <p className="text-2xl text-teal-900 font-semibold">{title}</p>

        <div className="bg-white w-full px-6 rounded-xl mt-5 relative">
          <div>
            <p className="text-xl font-bold text-teal-900 py-4">Thông tin người dùng</p>
          </div>
          <div className="flex ">
            {roleList.length !== 0 && data && data.roleCode && (
              <Form
                className="ml-4 w-full"
                columns={ColumnUserCreate({
                  // pageType: data.status === 'ACTIVE' ? pageType : 'detail',
                  pageType,
                  roleList,
                  roleCode: data?.roleCode,
                  status: data?.status,
                })}
                handSubmit={submit}
                checkHidden={true}
                values={data}
                form={form}
              />
            )}
          </div>
        </div>
        <div className=" flex sm:flex-row flex-col flex-col-reverse sm:justify-between mt-4 ">
          <div className="flex sm:flex-row flex-col items-center ">
            <button
              onClick={() => {
                window.history.back();
                // navigate(`${routerLinks('User')}`);
              }}
              className="px-8 bg-white border-teal-900 hover:border-teal-600 border-solid border
        text-sm p-2 rounded-xl text-teal-900 hover:text-teal-600 mt-1 sm:w-auto w-[60%] h-[44px]"
              id="backBtn"
            >
              Trở về
            </button>
          </div>

          {pageType !== 'detail' && (
            <div className="sm:flex sm:justify-end items-end text-sm">
              {/* {pageType === 'edit' && (
                <button
                  onClick={() => {
                    form.resetFields();
                  }}
                  className="px-4 bg-red-500 text-white text-base p-2 rounded-xl hover:bg-red-400 mt-1 mr-4"
                  id="saveBtn"
                >
                  Hủy thao tác
                </button>
              )} */}
              {/* remove function acctive && unactive */}
              <div className="flex sm:flex-row flex-col items-center hidden">
                {data.status !== 'UNACTIVE' &&
                  (data.status === 'ACTIVE'
                    ? pageType !== 'create' && (
                        <button
                          onClick={() => {
                            changeActive();
                          }}
                          id="saveBtn"
                          className="px-4 bg-red-600 text-white text-sm p-2 rounded-xl hover:bg-red-400 mt-1  sm:mr-5 sm:w-auto w-[60%] h-[44px]"
                        >
                          Hủy kích hoạt
                        </button>
                      )
                    : pageType !== 'create' && (
                        <button
                          onClick={() => {
                            changeActive();
                          }}
                          id="saveBtn"
                          className="px-4 bg-yellow-500 text-white text-sm p-2 rounded-xl hover:bg-yellow-400 mt-1 mr-5 sm:w-auto w-[60%] h-[44px]"
                        >
                          Kích hoạt tài khoản
                        </button>
                      ))}
              </div>

              {(pageType === 'create' || data?.status === 'ACTIVE') && (
                <div className="flex sm:flex-row flex-col items-center">
                  <button
                    onClick={() => {
                      submit(form.getFieldsValue());
                    }}
                    className=" bg-teal-900 text-white text-sm p-2 rounded-xl hover:bg-teal-600 mt-1 sm:w-[130px] w-[60%] h-[44px]"
                    id="deleteBtn"
                  >
                    Lưu
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
