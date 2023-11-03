import React, { useState, Fragment } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Message, Form, Spin } from 'components';
import { routerLinks } from 'utils';
import { UserService } from 'services/user';
import { ColumnForgetPassword } from 'columns/auth';
import { Link } from 'react-router-dom';
import './index.less'
const Page = ({ location }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const submit = async (values) => {
    try {
      setLoading(true);
      const res = await UserService.forgotPass({
        ...values,
      });
      if (res.data.uuid) {
        setLoading(false);
        navigate(routerLinks('SendOTP'), {
          state: { uuid: res.data.uuid, email: values.email },
        });
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      await Message.error(err.response.data.message);
    }
  };

  return (
    <Fragment>
      <div className="mb-8 title-auth">
        <h1 className='!text-[30px] md:!text-[48px]'>{'Quên Mật Khẩu'}</h1>
        <h5>{'Vui lòng nhập e-mail của bạn. Mã xác minh OTP sẽ được gửi cho bạn'}</h5>
      </div>
      <Spin spinning={loading}>
        <Form
          className="w-3/4 mx-auto form-login"
          columns={ColumnForgetPassword({ t })}
          textSubmit={'Lấy mã OTP'}
          classGroupButton="sm:!mt-3"
          handSubmit={submit}
          idSubmit={'forgot-password-btn'}
        />
      </Spin>
      <div className="text-center mt-4">
        {/* absolute xl:absolute */}
        <Link className="text-cyan-700 underline" to={routerLinks('Login')} id="back">
          {'Quay trở lại Đăng nhập'}
        </Link>
      </div>
    </Fragment>
  );
};

export default Page;
