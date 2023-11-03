import React, { useState, Fragment, useEffect, lazy } from 'react';
import { Spin } from 'components';
import '../index.less';
import { useLocation } from 'react-router-dom';
// import { routerLinks } from 'utils';
// import { useNavigate } from 'react-router';
import { Form as FormAnt } from 'antd';
import { SupplierService } from 'services/supplier';
import { useAuth } from 'global';
const SupplierInfo = lazy(() => import('../tabPaneComponents/SupplierInfo'));

const Page = () => {
  const [form] = FormAnt.useForm();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  //   const navigate = useNavigate();
  // const [managerId, setManagerId] = useState('');
  // const [email, setEmail] = useState([]);
  const [data, setData] = useState({});
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const subOrgId = user?.userInfor?.subOrgId;

  useEffect(() => {
    const initFunction = async () => {
      if (subOrgId) {
        const res = await SupplierService.getById(subOrgId);
        setData(res);
        // setManagerId(res?.userRole[0].userAdmin.id);
      }
    };
    initFunction();
  }, [subOrgId]);

  // useEffect(() => {
  //   const fetchGetEmailList = async () => {
  //     try {
  //       const res = await SupplierService.getEmailList({ code: 'OWNER_SUPPLIER' });
  //       setEmail(res.data);
  //     } catch (error) {
  //       return false;
  //     }
  //   };
  //   fetchGetEmailList();
  // }, []);

  const submit = async (values) => {
    try {
      if (!data?.id) return;
      const param = {
        ...values,
        address: {
          street: values.address,
          wardId: values?.ward || +data?.ward,
          districtId: values?.district || +data?.district,
          provinceId: values?.province || +data?.province,
        },
        // isActive: true,
        // code: values?.code,
        type: 'SUPPLIER',
        supplierType: "BALANCE",
        emailContact: values.email,
        nameContact: values.manageName,
        phoneNumber: values.managePhone,
        // managerId: +managerId,
      };
      delete param.manageName;
      delete param.email;
      delete param.code;
      delete param.province;
      delete param.ward;
      delete param.district;
      setLoading(true);
      const res = await SupplierService.put(param, subOrgId);
      if (res) {
        const result = await SupplierService.getById(subOrgId);
        setData(result);
      }
      setLoading(false);
    } catch (err) {
      console.log('Error is:', err);
      setLoading(false);
    }
  };

  if ((pageType === 'info' && !data?.id) || loading)
    return (
      <div className="h-screen items-center flex justify-center">
        <Spin className="w-[200px]" />
      </div>
    );

  return (
    <Fragment>
      <div className="mb-[300px]">
        <p className="font-bold text-2xl text-teal-900 mb-4">Thông tin nhà cung cấp</p>
        <div className="bg-white w-full px-6 rounded-[0.625rem] py-6 relative mb-5">
          <SupplierInfo
            // email={email}
            pageType={pageType}
            // setManagerId={setManagerId}
            roleCode={roleCode}
            submit={submit}
            data={data}
            form={form}
          />
          <div></div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
