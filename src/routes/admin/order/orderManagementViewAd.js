import React, { Fragment, lazy } from 'react';
import './index.less';

const OrderManagementViewAd = lazy(() => import('./orderViewAdminTabPaneComponents/orderManagement'));

const Page = () => {
  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="font-bold text-2xl text-teal-900 mb-6">Quản lý đơn hàng</p>
        <div className="bg-white w-full px-4 pb-[51px] rounded-xl pt-6 relative">
          <OrderManagementViewAd />
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
