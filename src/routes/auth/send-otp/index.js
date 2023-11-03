import React, { useState, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Message, Form, Spin } from 'components';
import { routerLinks } from 'utils';
import { UserService } from 'services/user';
import { ColumnSendOtp } from 'columns/auth';
import { Link } from 'react-router-dom';
import './index.less'

const Page = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const submit = async (values) => {
    try {
      setLoading(true);
      const res = await UserService.sendOtp({
        ...values,
        uuid: location.state.uuid,
        email: location.state.email,
      });
      if (res.statusCode === 200) {
        navigate(routerLinks('ResetPass'), {
          state: { uuid: res.data.uuid, email: location.state.email },
        });
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      await Message.error(err.response.data.message);
    }
  };

  return (
    <Fragment>
      <div className="mb-8 title-auth">
        <h1 className='!text-[30px] md:!text-[48px]'>{'Quên Mật Khẩu'}</h1>
        <h5>{'Vui lòng nhập mã OTP đã gửi đến email của bạn'}</h5>
      </div>
      <Spin spinning={loading}>
        <Form
          className="mx-auto form-login"
          columns={ColumnSendOtp({ t })}
          classGroupButton="sm:!mt-2"
          textSubmit={'Gửi OTP'}
          handSubmit={submit}
          idSubmit={'sendotp-btn'}
        />
      </Spin>
      <div className="text-center mt-4">
        <Link className="text-cyan-700 underline" to={routerLinks('Login')}>
          {'Quay trở lại Đăng nhập'}
        </Link>
      </div>
    </Fragment>
  );
};

export default Page;
