import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useAuth } from 'global';
import { Form, Spin } from 'components';
import { routerLinks } from 'utils';
import { ColumnLogin } from 'columns/auth';
import { UserService } from 'services/user';
import './index.less';

const Page = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const submit = async (values) => {
    try {
      setLoading(true);
      const res = await UserService.login({
        ...values,
        username: values.email,
      });
      setLoading(false);
      if (res.data) {
        auth.login(res.data);
        const page = res.data.menu[0];
        if (page && page.children && page.children.length > 0) {
          const childPage = page.children[0];
          navigate(childPage.pageUrl, { replace: true });
        } else {
          navigate(page.pageUrl, { replace: true });
        }
        // navigate(routerLinks('User'), { replace: true });
      }
    } catch (err) {
      console.log('Error is:', err);
      setLoading(false);
    }
  };

  return (
    <div className="relative bottom-0 right-0 allColor">
      <div className="mb-8 title-auth">
        <h1 className="colorText !text-[30px] md:!text-[48px] ">{'Đăng Nhập'}</h1>
        <h5 className="text-teal-900 colorText">
          {'Vui lòng đăng nhập bằng tài khoản được cung cấp bởi quản lý hệ thống'}
        </h5>
      </div>
      <Spin spinning={loading}>
        <Form
          className="w-3/4 mx-auto form-login colorText"
          columns={ColumnLogin({ t })}
          textSubmit={'Đăng Nhập'}
          handSubmit={submit}
          idSubmit={'submit-btn'}
        />
      </Spin>
      <div
        className="intro-x pt-1 -mt-28 bottom-16 right-12 sm:right-[6rem] lg:right-16
       md:mt-1 absolute xl:absolute  xl:pt-1 xl:-mt-32"
      >
        <Link className=" underline colorText " id="reset-pass-link" to={routerLinks('ForgotPass')}>
          {'Quên mật khẩu?'}
        </Link>
      </div>
    </div>
  );
};
// to={routerLinks("ForgotPass")}
export default Page;
