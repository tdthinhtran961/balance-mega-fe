import { Form as FormAnt } from 'antd';
// import { ColumnStoreAddUserForm } from 'columns/store-manage-user';
import { Form, Spin } from 'components';
// import { useAuth } from 'global';
import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { routerLinks } from 'utils';
import './index.less';
import { ColumnFormVouchers } from 'columns/promotionManagement';
import moment from 'moment';
import 'moment/locale/vi';
import { VoucherService } from 'services/voucher';
// import { ColumnPermissionManagement, ColumnStoreAddUserForm } from 'columns/store-manage-user';
moment.locale('vi');

const Page = () => {
  const [form] = FormAnt.useForm();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const uuid = urlSearch.get('uuid');
  const [data, setData] = useState({
    voucherType: 'CASH',
  });
  const [method, setMethod] = useState('CASH');

  useEffect(() => {
    const initFunction = async () => {
      setLoading(true);
      try {
        if (uuid) {
          const res = await VoucherService.getById(uuid);
          setData({ ...res });
          form.setFieldsValue({ ...res });
        }
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    initFunction();
  }, [uuid, location.pathname]);

  let title = '';

  switch (pageType) {
    case 'create':
      title = 'Thêm mới voucher';
      break;
    case 'edit':
      title = 'Chỉnh sửa voucher';
      break;
    default:
      title = '';
      break;
  }
  useEffect(() => {
    setMethod(method);
  }, [method]);

  const submit = async () => {
    try {
      setIsDisabled(true);
      const values = await form.validateFields();
      const param = {
        code: values.code,
        voucherType: values.voucherType,
        voucherValue: values.voucherValue,
        conditionApplyAmount: values.conditionApplyAmount,
        description: values.description,
        startDate: values?.startDate ? moment(values?.startDate).format('YYYY/MM/DD 00:00:00') : null,
        endDate: values?.endDate ? moment(values?.endDate).format('YYYY/MM/DD 23:59:59') : null,
        releaseQuantity: values?.releaseQuantity,
      };
      let res;
      pageType === 'create'
        ? (res = await VoucherService.post(param))
        : (res = await VoucherService.put({ ...param, uuid }));
      setIsDisabled(false);
      if (res) {
        return navigate(`${routerLinks('VoucherManagement')}`);
      }
    } catch (e) {
      setIsDisabled(false);
      return e;
    }
  };
  if (loading) {
    return (
      <div className="h-screen items-center flex justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }
  return (
    <Fragment>
      <div className="min-h-screen promotion-detail">
        <p className="text-2xl text-teal-900 font-semibold">{title}</p>

        <div className="bg-white w-full px-6 rounded-xl mt-5 relative">
          <div className="flex flex-col sm:flex-row item justify-between">
            <p className="text-xl font-bold text-teal-900 py-4">Thông tin voucher</p>
            {data?.balanceQuantity !== data?.releaseQuantity && (
              <p className="text-base font-normal text-red-600 py-4">
                Voucher đã được sử dụng. Bạn không thể chỉnh sửa.
              </p>
            )}
          </div>
          <div className="flex flex-col">
            {/* {roleList.length !== 0 && data && data.roleCode && ( */}

            <Form
              className="w-full store-manage-user-above-form"
              columns={ColumnFormVouchers({
                pageType,
                form,
                setMethod,
                method,
                data,
              })}
              handSubmit={submit}
              // checkHidden={true}
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
                window.history.back();
              }}
              className="px-8 bg-white border-teal-900 hover:border-teal-600 border-solid border
        text-sm p-2 rounded-xl text-teal-900 hover:text-teal-600 mt-1 sm:w-auto w-[60%] h-[44px]"
              id="backBtn"
            >
              Trở về
            </button>
          </div>

          {(pageType === 'create' || (pageType === 'edit' && data?.balanceQuantity === data?.releaseQuantity)) && (
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

              {(pageType === 'create' || pageType === 'edit') && (
                <div className="flex sm:flex-row flex-col items-center">
                  <button
                    onClick={() => {
                      submit(form.getFieldsValue());
                    }}
                    disabled={isDisabled}
                    className=" bg-teal-900 text-white text-sm p-2 rounded-xl hover:bg-teal-600 mt-1 sm:w-[130px] w-[60%] h-[44px]"
                    id="saveBtn"
                  >
                    {pageType === 'create' ? 'Lưu' : 'Lưu'}
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
