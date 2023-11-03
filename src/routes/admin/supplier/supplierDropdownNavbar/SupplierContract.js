import React, { Fragment, lazy } from 'react';
import '../index.less';
const Detail = lazy(() => import('../contract/contractDetail'));

const Page = () => {
  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="font-bold text-2xl text-teal-900 mb-4">Hợp đồng</p>
        <div className="bg-white w-full px-6 rounded-xl pt-6 pb-4 relative">
          <Detail />
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
