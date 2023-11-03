import {
  ColumnAddress,
  ColumnAddressWithRepresentative,
  ColumnConnectDetailViewAdForm,
  ColumnFirstSupplierFormWithRepresentative,
  ColumnRepresentativeForm,
  ColumnSupplierForm,
} from 'columns/supplier';
import { Form, Spin } from 'components';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { SupplierService } from 'services/supplier';

const SupplierInfo = ({ email, pageType, setManagerId, roleCode, submit, data, form, site, view }) => {
  const location = useLocation();
  const isActived = data?.isActive;

  const pageTyper =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const [address, setAddress] = useState({
    province: [],
    provinceCode:
      (site === 'inBal' || site === 'inBalAd') && data ? data?.supplier?.address?.province?.code : data?.provinceCode,
    district: [],
    districtCode: site === 'inBal' || site === 'inBalAd' ? data?.supplier?.address?.district?.code : data?.districtCode,
    ward: [],
  });

  useEffect(() => {
    setAddress((prev) => ({
      ...prev,
      provinceCode:
        (site === 'inBal' || site === 'inBalAd') && data ? data?.supplier?.address?.province?.code : data?.provinceCode,
      districtCode:
        site === 'inBal' || site === 'inBalAd' ? data?.supplier?.address?.district?.code : data?.districtCode,
    }));
  }, [data]);

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
      if (address.provinceCode) {
        const res = await SupplierService.getListDistrict(address.provinceCode);
        setAddress((prev) => ({
          ...prev,
          district: res.data,
        }));
      }
    };

    getListDistrict();
  }, [address.provinceCode, data]);

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

  if (!data?.id) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col justify-center">
        {site === 'NonBal' || site === 'inBal' || site === 'inBalAd' ? (
          <>
            <div className="form-information">
              <Form
                className="w-full"
                columns={ColumnSupplierForm({
                  pageType,
                  email,
                  setManagerId,
                  roleCode,
                  pageTyper,
                  isActived,
                  site,
                  view,
                })}
                handSubmit={submit}
                checkHidden={true}
                classGroupButton={'absolute justify-end items-end mt-10 right-0 submit-btn text-sm'}
                values={data}
                form={form}
                isResetForm={false}
              />
            </div>
            <div className="form-address-required sm:mb-[12px]">
              <p className="text-base mb-2 text-black">
                Địa chỉ nhà cung cấp{' '}
                {isActived === false ||
                (pageType === 'edit' && site === 'inBal') ||
                (pageType === 'edit' && site === 'inBalAd') ||
                (site === 'NonBal' && view === 'ad') ? (
                  ''
                ) : (
                  <span className="text-[#ff4d4f] text-sm">*</span>
                )}
              </p>
              <Form
                className={`w-full formAddress ${pageType === 'edit' && site === 'NonBal' ? 'editNonBalSubmit' : ''} `}
                columns={ColumnAddress({
                  pageType,
                  setManagerId,
                  roleCode,
                  address,
                  setAddress,
                  isActived,
                  site,
                  view,
                })}
                handSubmit={submit}
                checkHidden={true}
                values={data}
                form={form}
                textSubmit={
                  data?.isActive === true
                    ? pageType === 'edit' && site !== 'inBal'
                      ? 'Lưu'
                      : pageType === 'info'
                      ? 'Lưu'
                      : null
                    : data?.isActive === false
                    ? null
                    : !data.isActive && site === 'NonBal' && view !== 'ad'
                    ? 'Lưu'
                    : null
                }
                classGroupButton={`absolute sm:w-auto  justify-end  items-end right-0 edit-supplier-btn ${
                  roleCode === 'ADMIN' || site === 'inBal' || site === 'NonBal' ? 'mt-[28px]' : 'mt-[56px]'
                }`}
                isResetForm={false}
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-information">
              <Form
                className="w-full"
                columns={ColumnFirstSupplierFormWithRepresentative({
                  pageType,
                  email,
                  setManagerId,
                  roleCode,
                  pageTyper,
                  isActived,
                  site,
                  view,
                })}
                handSubmit={submit}
                checkHidden={true}
                classGroupButton={'absolute justify-end items-end mt-10 right-0 submit-btn text-sm'}
                values={data}
                form={form}
                isResetForm={false}
              />
            </div>
            <div className="form-address-required sm:mb-[12px]">
              <p className="text-base mb-2 text-black">
                Địa chỉ nhà cung cấp{' '}
                {isActived === false ||
                (pageType === 'edit' && site === 'inBal') ||
                (pageType === 'edit' && site === 'inBalAd') ||
                (site === 'NonBal' && view === 'ad') ? (
                  ''
                ) : (
                  <span className="text-[#ff4d4f] text-sm">*</span>
                )}
              </p>
              <Form
                className="w-full formAddress"
                columns={ColumnAddressWithRepresentative({
                  pageType,
                  setManagerId,
                  roleCode,
                  address,
                  setAddress,
                  isActived,
                  site,
                  view,
                })}
                handSubmit={submit}
                checkHidden={true}
                values={data}
                form={form}
                classGroupButton={`absolute sm:w-auto  justify-end  items-end right-0 edit-supplier-btn ${
                  roleCode === 'ADMIN' || site === 'inBal' || site === 'NonBal' ? 'mt-[28px]' : 'mt-[56px]'
                }`}
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
                  columns={ColumnRepresentativeForm({ pageType, email, setManagerId, site, roleCode, view })}
                  handSubmit={submit}
                  checkHidden={true}
                  classGroupButton={`absolute justify-end items-end !mt-10 right-0 ${pageType === 'info' ? 'create-supplier-info-btn' : 'create-supplier-btn'}  text-sm`}
                  values={email}
                  form={form}
                  isResetForm={false}
                  textSubmit={
                    data?.isActive === true
                      ? pageType === 'edit' && site !== 'inBal'
                        ? 'Lưu'
                        : pageType === 'info'
                        ? 'Lưu'
                        : null
                      : data?.isActive === false
                      ? null
                      : !data.isActive && site === 'NonBal' && view !== 'ad'
                      ? 'Lưu'
                      : null
                  }
                />
              </div>
            </div>
          </>
        )}

        {site === 'inBalAd' && (
          <>
            <hr />
            <div className="connect-detail mt-4 mb-[43px]">
              <p className="text-base mb-2 text-teal-900 font-bold">Chi tiết yêu cầu kết nối</p>
              <Form
                className="w-full"
                columns={ColumnConnectDetailViewAdForm({ pageType, roleCode, pageTyper, isActived, site })}
                // handSubmit={submit}
                checkHidden={true}
                classGroupButton={'absolute justify-end items-end mt-10 right-0 submit-btn text-sm'}
                values={data}
                form={form}
                isResetForm={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SupplierInfo;
