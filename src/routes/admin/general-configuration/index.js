import React, { Fragment, useState } from 'react';
import { Message, Form, Spin } from 'components';
import { UserService } from 'services/user';
import { KiotViet } from 'services/kiotviet';
import './index.less';

const Page = () => {

  const [loading, setLoading] = useState(false);

  const getApiSyncKiot = async () => {
    const res = await KiotViet.sync();
    if (res.statusCode === 200) {
      res && Message.success({ text: 'Đồng bộ thành công' });
    }
  }

  const getApiResetPass = async (value) => {
    setLoading(true);
    try {
      const res = await UserService.resetPassDefault(value);
      if (res.statusCode === 200) {
        res && Message.success({ text: 'Reset mật khẩu thành công' });
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  return (
    <Fragment>
      <div className="table-store min-h-screen ">
        <p className="text-2xl font-bold text-teal-900 mb-6">Cấu hình chung</p>
        <div className="bg-white pt-6 pb-10 px-6 rounded-md table-store flex">
          <div className='inline-flex flex-col min-w-[300px]'>
            <button
              className={
                'bg-teal-900 text-white px-4 py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-end justify-center w-[300px]'
              }
              onClick={() => getApiSyncKiot()}
              id="syncBtn"
            >
              {'Đồng bộ danh mục KiotViet'}
            </button>
            <Spin spinning={loading}>
              <Form
                className="w-full mx-auto form-reset-pass colorText mt-6"
                columns={[
                  {
                    name: 'email',
                    formItem: {
                      placeholder: 'Nhập email',
                      rules: [{ type: 'required' }, { type: 'email' }],
                    },
                  },
                ]}
                textSubmit={'Reset mật khẩu'}
                handSubmit={getApiResetPass}
                idSubmit={'reset-pass-btn'}
              />
            </Spin>
          </div>
          <div></div>
        </div>
      </div>
    </Fragment>
  );
};

export default Page;
