import { Spin } from 'components';
import React, { Fragment } from 'react';


function Page() {
    return ( 
        <Fragment>
            <div className="cart min-h-screen md:h-full h-full tableOrderProductCart ">
        <p className="text-2xl font-bold text-teal-900 mb-4">{'Quản Lý Khách Hàng'}</p>
        <Spin spinning={true}>
        </Spin>
        </div>
        </Fragment>
     );
}

export default Page;