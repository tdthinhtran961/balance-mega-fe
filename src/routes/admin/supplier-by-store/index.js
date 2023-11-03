import React, { useState, Fragment, useEffect } from 'react';
import { Spin } from 'components';
import { SupplierService } from 'services/supplier';
import './index.less';
import { useLocation } from 'react-router-dom';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { Tabs } from 'antd';
import { useAuth } from 'global';
import SupplierManagementInBal from './tabPanes/supplierInBal';
import SupplierManagementNotInBal from './tabPanes/supplierNotInBal';

const { TabPane } = Tabs;

const Page = () => {
  const location = useLocation();
  const { user } = useAuth();
  const subOrgId = user?.userInfor?.subOrgId;
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const idStore = urlSearch.get('id');
  const [data, setData] = useState({});
  const [tabKey, setTabKey] = useState(urlSearch.get('tab') || 1);

  useEffect(() => {
    const initFunction = async () => {
      if (idStore || subOrgId) {
        const res = await SupplierService.getById(idStore || subOrgId);
        setData(res);
      }
    };
    initFunction();
  }, [idStore]);

  const handleChangeTab = (key) => {
    if (!key) return;
    setTabKey(Number(key));
    navigate(routerLinks('SupplierManagementByStore') + `?id=${data.id || subOrgId}&tab=${key}`);
  };
  useEffect(() => {
    switch (urlSearch.get('tab')) {
      case '1':
        tabKey !== 1 && setTabKey(1)
        break;
      case '2':
        tabKey !== 2 && setTabKey(2)
        break;
      default:
        setTabKey(1)
        break;
    }
  }, [location.search])
  if (!data?.id)
    return (
      <div className="h-screen items-center flex justify-center">
        <Spin className="w-[200px]" />
      </div>
    );

  return (
    <Fragment>
      <div className="min-h-screen store-wrapper ">
        <p className="sm:text-2xl text-xl font-bold text-teal-900 mb-6">Quản lý nhà cung cấp</p>
        <Tabs onChange={handleChangeTab} className="mt-5" activeKey={String(tabKey)}>
          <TabPane tab="Balance" key="1" className="">
            <div className="bg-white w-full px-6 rounded-[10px] rounded-tl-none pt-6">
              {+tabKey === 1 && <SupplierManagementInBal />}
            </div>
          </TabPane>
          <TabPane tab="Non-Balance" key="2">
            <div className="bg-white w-full px-4 rounded-xl pt-5 pb-4 relative">
              {+tabKey === 2 && <SupplierManagementNotInBal />}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Fragment>
  );
};
export default Page;
