import { Form as FormAnt } from 'antd';
import { ColumnStoreAddUserForm } from 'columns/store-manage-user';
import { Form } from 'components';
import { useAuth } from 'global';
import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { StoreUserManagementService } from 'services/store-user-management';
import { routerLinks } from 'utils';
import './index.less';
// import { ColumnPermissionManagement, ColumnStoreAddUserForm } from 'columns/store-manage-user';

const Page = () => {
  const [form] = FormAnt.useForm();
  const location = useLocation();
  const { user } = useAuth()
  // const [, setLoading] = useState(false);
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const id = urlSearch.get('id');
  const roleId = user?.userInfor?.roleId
  const [data, setData] = useState({
    role: 'Quản trị viên'
  });
  const [listStoreAndBranch, setListStoreAndBranch] = useState([])
  // setPermissionCheckBox
  const [permissionCheckBox,] = useState({
    userManagement: [],
    goodsManagement: [],
    supplierManagement: [],
    storeManagement: [],
    order: [],
    branchManagement: [],
    connectManagement: [],
    goodsTransfer: [],
    orderManagement: [],
    goodsDisposal: [],
    promotionGoods: [],
    goodsReturn: [],
    nonBalOrder: [],
    inventory: [],
  });

  console.log('permissionCheckBox', permissionCheckBox);
  //   const [roleList, setRoleList] = useState([]);
  useEffect(() => {
    const initFunction = async () => {
      const res = await StoreUserManagementService.getListStoreOrBranch({ page: 1, perPage: 99 });
      if (res && res.data?.length > 0) {
        const storeMain = res.data?.find(i => i.isMain === true)
        form.setFieldsValue({ mainStoreName: storeMain?.name ?? '' })
      }

      setListStoreAndBranch(res.data);
    };

    initFunction();
  }, []);

  useEffect(() => {
    const initFunction = async () => {
      if (id) {
        const res = await StoreUserManagementService.getById(id)
        setData({ ...res, role: 'Quản trị viên' });
        // form.setFieldsValue({ role: 'Quản trị viên' })
      }
    };
    initFunction();
  }, [id]);



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
      const param = {
        name: values.userName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        subOrgId: values.subOrgId,
        roleId,
        note: values.note,
      }
      let res;
      pageType === 'create' ? res = await StoreUserManagementService.post(param) : res = await StoreUserManagementService.put({ ...param, isActive: values.status === 'ACTIVE', id })
      if (res) {
        return navigate(`${routerLinks('User')}`);
      }
    } catch (e) {
      return e
    }
  };

  //   const changeActive = async () => {
  //     try {
  //       let res;
  //       if (data.status === 'ACTIVE') {
  //         // console.log(data.roleCode);
  //         const subOrgStatus = await UserService.checkactive(data.subOrgId);
  //         // console.log(subOrgStatus);
  //         if (data.roleCode === 'Quản trị viên' || data.roleCode === undefined || subOrgStatus === false) {
  //           Message.confirm({
  //             text: 'Bạn có chắc muốn hủy kích hoạt người dùng này?',
  //             cancelButtonText: 'Hủy',
  //             confirmButtonText: 'Đồng ý',
  //             onConfirm: async () => {
  //               res = await UserService.delete(idUser);
  //               res && Message.success({ text: 'Hủy kích hoạt tài khoản thành công', showConfirmButton: false });
  //               return navigate(`${routerLinks('User')}`);
  //             },
  //           });
  //         } else {
  //           let role;
  //           if (data.roleCode === 'Chủ cửa hàng') role = 'chủ cửa hàng';
  //           else if (data.roleCode === 'Nhà cung cấp') role = 'nhà cung cấp';
  //           Message.warning({
  //             title: 'Thông báo',
  //             text: `Người dùng này hiện đang là ${role}.
  //           Không thể hủy kích hoạt người dùng này.
  //           Vui lòng hủy kích hoạt cửa hàng trước khi hủy kích hoạt người dùng`,
  //             showConfirmButton: false,
  //           });
  //         }
  //       } else {
  //         res = await UserService.active(idUser);
  //         res && Message.success({ text: 'Kích hoạt tài khoản thành công', showConfirmButton: false });
  //         return navigate(`${routerLinks('User')}`);
  //       }
  //     } catch (err) {
  //       console.log('Error is:', err);
  //       if (data.status === 'ACTIVE') {
  //         Message.error({ text: `Hủy kích hoạt tài khoản không thành công` });
  //       } else {
  //         Message.error({ text: `Kích hoạt tài khoản không thành công` });
  //       }
  //     }
  //   };

  return (
    <Fragment>
      <div className="min-h-screen store-wrapper store-manage-user">
        <p className="text-2xl text-teal-900 font-semibold">{title}</p>

        <div className="bg-white w-full px-6 rounded-xl mt-5 relative">
          <div>
            <p className="text-xl font-bold text-teal-900 py-4">Thông tin người dùng</p>
          </div>
          <div className="flex flex-col">
            {/* {roleList.length !== 0 && data && data.roleCode && ( */}
            <Form
              className="w-full store-manage-user-above-form"
              columns={ColumnStoreAddUserForm({
                // pageType: data.status === 'ACTIVE' ? pageType : 'detail',
                pageType,
                //   roleList,
                listStoreAndBranch,
                roleCode: data?.roleCode,
                status: data?.status,
              })}
              handSubmit={submit}
              checkHidden={true}
              values={data}
              form={form}
            />
            {/* <hr />
            <p className="text-xl font-bold text-teal-900 py-4">Quản lý quyền</p>
            <Form
              className="w-full permission-management"
              columns={ColumnPermissionManagement({
                // pageType: data.status === 'ACTIVE' ? pageType : 'detail',
                pageType,
                //   roleList,
                roleCode: data?.roleCode,
                status: data?.status,
                setPermissionCheckBox,
              })}
              handSubmit={submit}
              checkHidden={true}
              values={data}
              form={form}
            /> */}
            {/* )} */}
          </div>
        </div>
        <div className=" flex sm:flex-row flex-col flex-col-reverse sm:justify-between mt-4 ">
          <div className="flex sm:flex-row flex-col items-center ">
            <button
              onClick={() => {
                // navigate(`${routerLinks('StoreManageUser')}`);
                window.history.back()
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

              {/* {pageType === 'create' && ( */}
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
              {/* )} */}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
