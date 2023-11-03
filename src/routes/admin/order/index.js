import React, { useState, Fragment, useEffect } from 'react';
import './index.less';
import { useLocation } from 'react-router-dom';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { Tabs } from 'antd';
import { useAuth } from 'global';
import TabData from './tabPaneComponents/tabHook';
import OrderManagementViewAd from './orderManagementViewAd';
import { OrdersService } from 'services/order';
const { TabPane } = Tabs;
const Page = () => {
  const location = useLocation();
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const urlSearch = new URLSearchParams(location.search);
  const [tabKey, setTabKey] = useState(urlSearch.get('tab') || 1);
  const [counter, setCounter] = useState({});
  let title = '';

  switch (pageType) {
    case 'detail':
      title = 'Chi tiết đơn hàng';
      break;
    default:
      title = 'Quản lý đơn hàng';
      break;
  }
  useEffect(() => {
    const fetchCounter = async () => {
      const res = await OrdersService.get();
      setCounter(res?.data?.counter);
    };
    fetchCounter();
  }, [location.pathname]);
  useEffect(() => {
    switch (urlSearch.get('tab')) {
      case '1':
        tabKey !== 1 && setTabKey(1);
        break;
      case '2':
        tabKey !== 2 && setTabKey(2);
        break;
      case '3':
        tabKey !== 3 && setTabKey(3);
        break;
      case '4':
        tabKey !== 4 && setTabKey(4);
        break;
      case '5':
        tabKey !== 5 && setTabKey(5);
        break;
      default:
        setTabKey(1);
        break;
    }
  }, [location.search]);
  const navigateDetail = (idOrder) => {
    return navigate(routerLinks('OrderDetail') + `?id=${idOrder}`);
  };
  const handleChangeTab = (key) => {
    if (!key) return;
    setTabKey(Number(key));
    navigate(`${routerLinks('OrderManagement')}?tab=${key}`);
  };

  return (
    <Fragment>
      {roleCode !== 'ADMIN' ? (
        <div className="min-h-screen ">
          <p className="font-bold sm:text-2xl text-xl text-teal-900 ">{title}</p>
          <Tabs
            destroyInactiveTabPane={true}
            defaultActiveKey="1"
            onChange={handleChangeTab}
            className="mt-5"
            activeKey={String(tabKey)}
          >
            <TabPane
              tab={`Chờ xác nhận ${
                counter?.WAITING_APPROVED || counter?.WAITING_APPROVED === 0
                  ? `(` + counter?.WAITING_APPROVED + ')'
                  : ''
              }`}
              key="1"
              className=""
            >
              <div className="bg-white w-full px-6 rounded-xl rounded-tl-none pt-6 pb-4 relative">
                {+tabKey === 1 && (
                  <TabData statusName="WAITING_APPROVED" tabKey={tabKey} navigateDetail={navigateDetail} />
                )}
              </div>
            </TabPane>
            <TabPane
              tab={`${
                user?.userInfor?.roleCode === 'OWNER_STORE'
                  ? `Chờ lấy hàng ${
                      counter?.WAITING_PICKUP || counter?.WAITING_PICKUP === 0
                        ? `(` + counter?.WAITING_PICKUP + ')'
                        : ''
                    }`
                  : (user?.userInfor?.roleCode === 'OWNER_SUPPLIER' || user?.userInfor?.roleCode === 'DISTRIBUTOR')
                  ? `Chờ lấy hàng ${
                      counter?.WAITING_PICKUP || counter?.WAITING_PICKUP === 0
                        ? `(` + counter?.WAITING_PICKUP + ')'
                        : ''
                    }`
                  : `Chờ lấy hàng ${
                      counter?.WAITING_PICKUP || counter?.WAITING_PICKUP === 0
                        ? `(` + counter?.WAITING_PICKUP + ')'
                        : ''
                    }`
              }`}
              key="2"
            >
              <div className="bg-white w-full px-6 rounded-xl pt-6 pb-4 relative min-h-[calc(100vh-60px-64px-1.25rem)]">
                {+tabKey === 2 && (
                  <TabData statusName="WAITING_PICKUP" tabKey={tabKey} navigateDetail={navigateDetail} />
                )}
              </div>
            </TabPane>
            <TabPane
              tab={`Đang giao ${
                counter?.DELIVERY_RECEIVE || counter?.DELIVERY_RECEIVE === 0
                  ? `(` + counter?.DELIVERY_RECEIVE + ')'
                  : ''
              }`}
              key="3"
            >
              <div className="bg-white w-full px-6 rounded-xl pt-6 pb-4 relative min-h-[calc(100vh-60px-64px-1.25rem)]">
                {+tabKey === 3 && (
                  <TabData statusName="DELIVERY_RECEIVE" tabKey={tabKey} navigateDetail={navigateDetail} />
                )}
              </div>
            </TabPane>
            <TabPane
              tab={`Đã giao ${counter?.DELIVERED || counter?.DELIVERED === 0 ? `(` + counter?.DELIVERED + ')' : ''}`}
              key="4"
            >
              <div className="bg-white w-full px-6 rounded-xl pt-6 pb-4 relative min-h-[calc(100vh-60px-64px-1.25rem)]">
                {+tabKey === 4 && <TabData statusName="DELIVERED" tabKey={tabKey} navigateDetail={navigateDetail} />}
              </div>
            </TabPane>
            <TabPane
              tab={`Đã hủy ${counter?.CANCELLED || counter?.CANCELLED === 0 ? `(` + counter?.CANCELLED + ')' : ''}`}
              key="5"
            >
              <div className="bg-white w-full px-6 rounded-xl pt-6 pb-4 relative min-h-[calc(100vh-60px-64px-1.25rem)]">
                {+tabKey === 5 && <TabData statusName="CANCELLED" tabKey={tabKey} navigateDetail={navigateDetail} />}
              </div>
            </TabPane>
          </Tabs>
        </div>
      ) : (
        <>
          <OrderManagementViewAd />
        </>
      )}
    </Fragment>
  );
};
export default Page;
