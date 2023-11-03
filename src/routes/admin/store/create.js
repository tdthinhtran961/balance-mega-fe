import React, { useState, Fragment, useEffect } from 'react';
import { Form, Message } from 'components';
import { StoreService } from 'services/store';
import './index.less';
import { useLocation } from 'react-router-dom';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { Form as FormAnt } from 'antd';
import { ColumnStoreForm } from 'columns/store';
import { useAuth } from 'global';

const Page = () => {
  const [form] = FormAnt.useForm();
  const location = useLocation();
  const [, setLoading] = useState(false);

  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const idStore = urlSearch.get('id');
  const pageBranch = urlSearch.get('page');
  const [data, setData] = useState({});
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const [emailManager, setEmailManager] = useState([]);
  const [, setManagerId] = useState([]);
  const [isHidden, setIsHidden] = useState(false);
  const [isCall, setIsCall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState({
    province: [],
    provinceCode: '',
    district: [],
    districtCode: '',
    ward: [],
  });
  const [listBranch, setListBranch] = useState([]);
  const [connectKioViet, setConnectKioViet] = useState({
    client_id: '',
    client_secret: '',
    retailer: '',
  });
  useEffect(() => {
    const initFetchList = async () => {
      setIsLoading(true);
      try {
        if (
          isCall &&
          connectKioViet.client_id !== '' &&
          connectKioViet.client_secret !== '' &&
          connectKioViet.retailer !== ''
        ) {
          const res = await StoreService.getListBranch({
            clientId: connectKioViet.client_id,
            clientSecret: connectKioViet.client_secret,
            retailer: connectKioViet.retailer,
          });
          setListBranch(res.data);
        }
      } catch (error) {
        setIsCall(false);
        setListBranch([]);
        setIsLoading(false);
        return error;
      } finally {
        setIsCall(false);
        setIsLoading(false);
      }
    };
    initFetchList();
    setIsCall(false);
  }, [isCall, connectKioViet]);

  useEffect(() => {
    setListBranch(listBranch);
  }, [listBranch]);

  useEffect(() => {
    const initFunction = async () => {
      if (idStore) {
        const res = await StoreService.getById(idStore);
        setData(res);
      }
    };
    initFunction();
  }, [idStore]);

  useEffect(() => {
    const getListManager = async () => {
      const res = await StoreService.getListManager({ code: 'OWNER_STORE' });
      setEmailManager(res.data);
    };
    getListManager();
  }, []);

  useEffect(() => {
    const getListProvince = async () => {
      const res = await StoreService.getListProvince();
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
        const res = await StoreService.getListDistrict(address.provinceCode);
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
        const res = await StoreService.getListWard(address.districtCode);
        setAddress((prev) => ({
          ...prev,
          ward: res.data,
        }));
      }
    };
    getListWard();
  }, [address.districtCode]);

  let title = '';

  switch (pageType) {
    case 'create':
      title = 'Thêm cửa hàng';
      break;
    default:
      title = 'Cửa hàng';
      break;
  }
  const isNullOrUndefinedOrEmpty = (value) => value === undefined || value === null || value === '';
  const handleConnectGetListBranches = async () => {
    if (isNullOrUndefinedOrEmpty(form.getFieldValue('client_id')))
      return Message.error({ text: 'clientId là bắt buộc' });
    if (isNullOrUndefinedOrEmpty(form.getFieldValue('client_secret')))
      return Message.error({ text: 'client_secret là bắt buộc' });
    if (isNullOrUndefinedOrEmpty(form.getFieldValue('retailer')))
      return Message.error({ text: 'retailer là bắt buộc' });
    const res = await StoreService.getListBranch({
      clientId: form.getFieldValue('client_id'),
      clientSecret: form.getFieldValue('client_secret'),
      retailer: form.getFieldValue('retailer'),
    });
    res && setListBranch(res.data);
  };
  const submit = async (values) => {
    try {
      const param = {
        name: values.name,
        type: 'STORE',
        supplierType: 'BALANCE',
        address: {
          street: values?.street,
          wardId: +values?.ward,
          districtId: +values?.district,
          provinceId: +values?.province,
        },
        emailContact: values.emailContact,
        nameContact: values.nameContact,
        phoneNumber: values.phoneNumber,
        note: values.note,
        fax: values.fax,
        // isActive: true,
        // managerId: Number(managerId),
        connectKiot: isHidden
          ? {
              clientSecret: values.client_secret,
              clientId: values.client_id,
              retailer: values.retailer,
              branchId: values.branchId,
            }
          : {},
      };

      setLoading(true);
      const res = await StoreService.post(
        pageBranch === 'branch' ? { ...param, storeId: +localStorage.getItem('idStore') } : param,
      );
      setLoading(false);
      if (res && pageBranch !== 'branch') {
        return navigate(`${routerLinks('Quản lý cửa hàng')}`);
      }
      if (res && pageBranch === 'branch' && roleCode === 'ADMIN') {
        return navigate(routerLinks('StoreEdit') + `?id=${+localStorage.getItem('idStore')}&tab=${3}`);
      }
      if (res && pageBranch === 'branch') {
        return navigate(routerLinks('BranchManagement'));
      }
    } catch (err) {
      console.log('Error is:', err);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="min-h-screen store-wrapper">
        <p className="text-2xl font-bold text-teal-900 mb-8">{title}</p>
        <div className="bg-white w-full px-6 rounded-xl mt-5 relative">
          <div>
            <p className="text-xl font-bold text-teal-900 py-4">Thông tin cửa hàng</p>
          </div>
          <div className="flex form-information">
            <Form
              className="w-full"
              columns={ColumnStoreForm({
                pageType,
                emailManager,
                setManagerId,
                roleCode,
                address,
                setAddress,
                data,
                isHidden,
                setIsHidden,
                setConnectKioViet,
                listBranch,
                setIsCall,
                isLoading,
                setListBranch,
                handleConnectGetListBranches,
              })}
              handSubmit={submit}
              checkHidden={true}
              classGroupButton={
                'absolute sm:justify-end sm:items-end items-center sm:mt-[32px] sm:right-0 create-store-btn sm:w-[140px]'
              }
              textSubmit={pageType === 'create' ? 'Lưu' : null}
              values={emailManager}
              form={form}
            />
          </div>
          {/* <div className='form-address-required'>
            <p className='text-base mb-2 text-black'>Địa chỉ cửa hàng <span className='text-[#ff4d4f] text-sm'>*</span></p>
            <Form
              className="w-full"
              columns={ColumnStoreAddressForm({ pageType, roleCode, address, setAddress })}
              handSubmit={submit}
              textSubmit={pageType === 'create' ? 'Lưu' : null}
              checkHidden={true}
              classGroupButton={'absolute sm:justify-end sm:items-end items-center sm:mt-[32px] sm:right-0 create-store-btn sm:w-[140px]'}
              values={data}
              form={form}
              idSubmit="idAddress"
            />
          </div> */}
        </div>
        <div className="flex sm:flex-row flex-col items-center justify-between sm:mt-[32px]  mt-2 ">
          <button
            onClick={() => window.history.back()}
            className="h-[44px] sm:w-[106px] w-[60%] rounded-[10px] bg-white border-teal-900 hover:border-teal-600 border-solid sm:mt-0 mt-[50px] border
        text-sm  text-teal-900 hover:text-teal-600"
            id="backBtn"
          >
            Trở về
          </button>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
