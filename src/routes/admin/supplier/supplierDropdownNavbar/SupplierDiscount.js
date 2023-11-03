import { useAuth } from 'global';
import React, { Fragment, lazy } from 'react';
import '../index.less';

const Discount = lazy(() => import('../tabPaneComponents/Discount'));

const SupplierDiscount = () => {
  const { user } = useAuth();
  const subOrgId = user?.userInfor?.subOrgId;

  //   if (!data?.id) {
  //     return (
  //       <div className="h-screen w-full flex items-center justify-center">
  //         <Spin className="w-[200px]" />
  //       </div>
  //     );
  //   }

  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="font-bold text-2xl text-teal-900 mb-4">Chiết khấu </p>
        <div className="bg-white w-full px-6 rounded-xl pt-6 pb-4 relative">
          <Discount id={subOrgId} />
        </div>
      </div>
    </Fragment>
  );
};
export default SupplierDiscount;
