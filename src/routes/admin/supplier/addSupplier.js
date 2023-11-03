import React, { useState, Fragment, useEffect } from 'react';
import { Form, Spin } from 'components';

import './index.less';
import { useLocation } from 'react-router-dom';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { Form as FormAnt } from 'antd';
import { SupplierService } from 'services/supplier';
import {
  ColumnAddress,
  ColumnAddressWithRepresentative,
  ColumnFirstSupplierFormWithRepresentative,
  ColumnRepresentativeForm,
  ColumnSupplierForm,
} from 'columns/supplier';
import { useAuth } from 'global';

const Page = () => {
  const [form] = FormAnt.useForm();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const idSupplier = urlSearch.get('id');
  const site = urlSearch.get('site');

  const [email, setEmail] = useState([]);
  const [managerId, setManagerId] = useState('');
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const subOrgId = user?.userInfor?.subOrgId;

  const [address, setAddress] = useState({
    province: [],
    provinceCode: '',
    district: [],
    districtCode: '',
    ward: [],
  });

  useEffect(() => {
    const getListProvince = async () => {
      const res = await SupplierService.getListProvince();
      setAddress((prev) => ({
        ...prev,
        province: res.data,
      }));
    };
    getListProvince();
  }, []);

  useEffect(() => {
    const getListDistrict = async () => {
      if (address?.provinceCode) {
        const res = await SupplierService.getListDistrict(address.provinceCode);
        setAddress((prev) => ({
          ...prev,
          district: res.data,
        }));
      }
    };
    getListDistrict();
  }, [address.provinceCode]);
  useEffect(() => {
    const getListWard = async () => {
      if (address.districtCode) {
        const res = await SupplierService.getListWard(address.districtCode);
        setAddress((prev) => ({
          ...prev,
          ward: res.data,
        }));
      }
    };
    getListWard();
  }, [address.districtCode]);

  useEffect(() => {
    const initFunction = async () => {
      if (idSupplier) {
        const res = await SupplierService.getById(idSupplier);
        if (res.isActive) {
          res.isActive = 1;
        } else {
          res.isActive = 2;
        }
      }
    };
    initFunction();
  }, [idSupplier]);

  useEffect(() => {
    const fetchGetEmailList = async () => {
      try {
        const res = await SupplierService.getEmailList({ code: 'OWNER_SUPPLIER' });
        setEmail(res.data);
      } catch (error) {
        return false;
      }
    };
    fetchGetEmailList();
  }, []);

  let title = '';

  switch (pageType) {
    case 'create':
      title = 'Thêm nhà cung cấp';
      break;
    case 'edit':
      title = 'Chỉnh sửa nhà cung cấp';
      break;
    default:
      title = 'Nhà cung cấp';
      break;
  }

  const submit = async (values) => {
    if (site === 'NonBal') {
      try {
        let res;
        // if (values.isActive === 1) {
        //   values.isActive = true;
        // } else if (values.isActive === 2) {
        //   values.isActive = false;
        // }
        const param = {
          ...values,
          address: {
            street: values.address,
            wardId: Number(values.ward),
            districtId: Number(values.district),
            provinceId: Number(values.province),
          },
          supplierType: "NON_BALANCE",
          emailContact: values.email,
          nameContact: values.manageName,
          phoneNumber: values.managePhone,
          type: "SUPPLIER",
          // isActive: true,
        };
        setLoading(true);
        pageType === 'create'
          ? (res = await SupplierService.post(param))
          : (res = await SupplierService.put(param, idSupplier));
        setLoading(false);
        if (res) {
          return navigate(`${routerLinks('SupplierManagementByStore')}?id=${subOrgId}&tab=2`);
        }
      } catch (err) {
        setLoading(false);
      }
    } else {
      try {
        let res;
        if (values.isActive === 1) {
          values.isActive = true;
        } else if (values.isActive === 2) {
          values.isActive = false;
        }
        const param = {
          ...values,
          address: {
            street: values.address,
            wardId: Number(values.ward),
            districtId: Number(values.district),
            provinceId: Number(values.province),
          },
          type: 'SUPPLIER',
          supplierType: "BALANCE",
          emailContact: values.email,
          nameContact: values.manageName,
          phoneNumber: values.managePhone,
          // isActive: true,
          managerId: Number(managerId),
        };
        setLoading(true);
        pageType === 'create'
          ? (res = await SupplierService.post(param))
          : (res = await SupplierService.put(param, idSupplier));
        setLoading(false);
        if (res) {
          return navigate(`${routerLinks('Supplier')}`);
        }
      } catch (err) {
        setLoading(false);
      }
    }
  };

  if (!email || loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="text-2xl font-bold text-teal-900 mb-8">{title}</p>
        {site === 'NonBal' ? (
          <div className="bg-white w-full px-4 rounded-xl mt-5 relative">
            <div>
              <p className="text-xl font-bold text-teal-900 py-[18px]">Thông tin nhà cung cấp</p>
            </div>
            <div className="flex flex-col justify-center">
              <div className="form-information">
                <Form
                  className="w-full"
                  columns={ColumnSupplierForm({ pageType, email, setManagerId, site })}
                  handSubmit={submit}
                  checkHidden={true}
                  classGroupButton={'absolute justify-end items-end mt-10 right-0 submit-btn text-sm'}
                  values={email}
                  form={form}
                  isResetForm={false}
                />
              </div>
              <div className="form-address-required">
                <p className="text-base mb-2 text-black">
                  Địa chỉ nhà cung cấp <span className="text-[#ff4d4f] text-sm">*</span>
                </p>
                <Form
                  className="w-full formAddress"
                  columns={ColumnAddress({ pageType, setManagerId, roleCode, address, setAddress, site })}
                  handSubmit={submit}
                  checkHidden={true}
                  textSubmit={pageType === 'create' ? 'Lưu' : null}
                  classGroupButton={'absolute justify-end items-end mt-10 right-0 create-supplier-btn text-sm'}
                  values={email}
                  form={form}
                  isResetForm={false}
                />
              </div>
            </div>
            <div></div>
          </div>
        ) : (
          <div className="bg-white w-full px-4 rounded-xl mt-5 relative">
            <div>
              <p className="text-xl font-bold text-teal-900 py-[18px]">Thông tin nhà cung cấp</p>
            </div>
            <div className="flex flex-col justify-center">
              <div className="form-information">
                <Form
                  className="w-full"
                  columns={ColumnFirstSupplierFormWithRepresentative({ pageType, email, setManagerId, site })}
                  handSubmit={submit}
                  checkHidden={true}
                  classGroupButton={'absolute justify-end items-end mt-10 right-0 submit-btn text-sm'}
                  values={email}
                  form={form}
                  isResetForm={false}
                />
              </div>
              <div className="form-address-required">
                <p className="text-base mb-2 text-black">
                  Địa chỉ nhà cung cấp <span className="text-[#ff4d4f] text-sm">*</span>
                </p>
                <Form
                  className="w-full formAddress"
                  columns={ColumnAddressWithRepresentative({
                    pageType,
                    setManagerId,
                    roleCode,
                    address,
                    setAddress,
                    site,
                  })}
                  handSubmit={submit}
                  checkHidden={true}
                  classGroupButton={'absolute justify-end items-end mt-10 right-0 create-supplier-btn text-sm'}
                  values={email}
                  form={form}
                  isResetForm={false}
                />
              </div>
              <div>
                <p className="text-xl font-bold text-teal-900 pb-[18px]">Thông tin người đại diện</p>
              </div>
              <div className="flex flex-col justify-center">
                <div className="form-information">
                  <Form
                    className="w-full"
                    columns={ColumnRepresentativeForm({ pageType, email, setManagerId, site, roleCode })}
                    handSubmit={submit}
                    checkHidden={true}
                    classGroupButton={'absolute justify-end items-end mt-10 right-0 create-supplier-btn text-sm'}
                    values={email}
                    form={form}
                    isResetForm={false}
                    textSubmit={pageType === 'create' ? 'Lưu' : null}
                  />
                </div>
              </div>
            </div>
            <div></div>
          </div>
        )}
        <div className="flex sm:flex-row flex-col items-center justify-between sm:mt-10 mt-[55px]">
          {site === 'NonBal' ? (
            <button
              onClick={() => {
                return window.history.back();
              }}
              className="h-[44px] sm:w-[106px] w-[60%] rounded-[10px] bg-white border-teal-900 hover:border-teal-600 border-solid border
        text-sm  text-teal-900 hover:text-teal-600 sm:z-10 sm:mt-0 mt-10"
              id="backBtn"
            >
              Trở về
            </button>
          ) : (
            <button
              onClick={() => {
                navigate(`${routerLinks('Quản lý nhà cung cấp')}`);
              }}
              className="h-[44px] sm:w-[106px] w-[60%] rounded-[10px] bg-white border-teal-900 hover:border-teal-600 border-solid border
        text-sm  text-teal-900 hover:text-teal-600 sm:z-10 sm:mt-0 mt-10"
              id="backBtn"
            >
              Trở về
            </button>
          )}
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
