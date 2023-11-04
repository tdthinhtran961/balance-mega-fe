import React, { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import './index.less';
import { routerLinks } from 'utils';
import { Tabs } from 'antd';
import TabData from './components/TabTableProduct';
import { useAuth } from 'global';

const Page = () => {
  const mount = useRef(false);
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const [tabKey, setTabKey] = useState(urlSearch.get('tab') || 1);
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;

  const initFunction = useCallback(async () => {
    if (!mount.current) {
      mount.current = true;
    }
  }, [mount]);
  const navigateEdit = (id) => {
    return navigate(routerLinks('ProductEdit') + `?id=${id}`);
  };
  useEffect(() => {
    initFunction();
  }, [initFunction]);
  useEffect(() => {
    switch (urlSearch.get('tab')) {
      case '1':
        tabKey !== 1 && setTabKey(1);
        break;
      case '2':
        tabKey !== 2 && setTabKey(2);
        break;
      default:
        setTabKey(1);
        break;
    }
  }, [location.search]);
  const handleChangeTab = (key) => {
    if (!key) return;
    setTabKey(Number(key));
    navigate(`${routerLinks('Product')}?tab=${key}`);
  };

  const items = [
    {
      label:roleCode === 'OWNER_STORE' ? "Balance" : "Danh sách sản phẩm", 
      key:"1", 
      children: <div className="bg-white w-full px-6 rounded-xl rounded-tl-none pt-6 pb-4 relative">
        {+tabKey === 1 && <TabData tabKey={tabKey} navigateEdit={navigateEdit} />}
      </div>
    },
    {
      label:roleCode === 'OWNER_STORE' ? "Non-Balance" : "Phê duyệt sản phẩm", 
      key:"2", 
      children: <div className="bg-white w-full px-6 rounded-xl pt-6 pb-4 relative">
        {+tabKey === 2 && <TabData tabKey={tabKey} navigateEdit={navigateEdit} />}
      </div>
    },
  ]

  return (
    <Fragment>
      <div className="table-category min-h-screen product-wrapper">
        <p className="text-2xl font-bold text-teal-900 mb-6">Quản lý sản phẩm</p>
          <Tabs defaultActiveKey="1" items={items} className="mt-5" onChange={handleChangeTab} activeKey={String(tabKey)}>
          </Tabs>
      </div>
    </Fragment>
  );
};
export default Page;
