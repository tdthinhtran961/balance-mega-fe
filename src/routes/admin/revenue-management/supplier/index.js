import React, { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import './index.less';
import { routerLinks } from 'utils';
import { Tabs } from 'antd';
import OrderRevenue from './order_revenue';
import ProductRevenue from './product_revenue';
const { TabPane } = Tabs;

const Page = () => {
  const mount = useRef(false);
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const [tabKey, setTabKey] = useState(urlSearch.get('tab') || 1);
  const navigate = useNavigate();

  const initFunction = useCallback(async () => {
    if (!mount.current) {
      mount.current = true;
    }
  }, [mount]);
  useEffect(() => {
    initFunction();
  }, [initFunction]);
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
  const handleChangeTab = (key) => {
    if (!key) return;
    setTabKey(Number(key));
    navigate(`${routerLinks('RevenueManagementSupplier')}?tab=${key}`);
  };

  return (
    <Fragment>
      <div className="table-category min-h-screen product-wrapper">
        <p className="text-2xl font-bold text-teal-900 mb-6">Doanh thu nhà cung cấp</p>
          <Tabs defaultActiveKey="1" className="mt-5" onChange={handleChangeTab} activeKey={String(tabKey)}>
            <TabPane tab="Doanh thu theo đơn hàng" key="1">
              <div className="bg-white w-full px-6 rounded-xl rounded-tl-none pt-6 pb-4 relative">
                {+tabKey === 1 && <OrderRevenue tabKey={tabKey} />}
              </div>
            </TabPane>
            <TabPane tab="Doanh thu theo sản phẩm" key="2">
              <div className="bg-white w-full px-6 rounded-xl pt-6 pb-4 relative">
                {+tabKey === 2 && <ProductRevenue tabKey={tabKey} />}
              </div>
            </TabPane>
          </Tabs>
      </div>
    </Fragment>
  );
};
export default Page;
