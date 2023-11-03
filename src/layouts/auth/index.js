import React, { useEffect, useRef, useCallback } from 'react';
import { useAuth } from 'global';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import footerImage from 'assets/images/footer.png';
import './index.less';
// import logo from 'assets/images/logo.svg';

const Layout = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const mount = useRef(false);
  const initFunction = useCallback(async () => {
    // if (!!auth.user?.token) {
    //   await UserService.logout();
    // }
    await logout();
  }, [logout]);

  useEffect(() => {
    if (!mount.current) {
      mount.current = true;
      initFunction();
    }
  }, [mount, initFunction]);
  let imageURL = '';

  switch (location.pathname) {
    // case '/auth/login':
    //   imageURL = "bg-[url('assets/images/bg-login.png')]";
    //   break;
    // case '/auth/forgot-password':
    //   imageURL = "bg-[url('assets/images/bg-forgot.png')]";
    //   break;
    // case '/auth/send-otp':
    //   imageURL = "bg-[url('assets/images/bg-otp.png')]";
    //   break;
    // case '/auth/reset-password':
    //   imageURL = "bg-[url('assets/images/bg-reset.png')]";
    //   break;
    default:
      imageURL = "bg-[url('assets/images/bg-default.png')]";
      break;
  }
  return (
    <div className="layout-auth h-screen min-h-screen w-full drop-shadow-2xl flex flex-col relative">
      <div className="bg-white bg-cover bg-center h-full relative min-h-[600px] ">
        <div className="block lg:flex  h-full">
          <div className="w-full lg:w-1/2  relative lg:flex justify-between flex-col hidden">
            <div
              className={classNames(
                imageURL,
                'w-full lg:min-h-full  min-h-[600px] relative overflow-hidden flex justify-between flex-col bg-left-top bg-no-repeat bg-cover bg-clip-border',
              )}
            >
              {/* <img
                src={logo}
                alt="logoUhouse"
                className="w-20 sm:w-32 p-4 rounded-[10px] absolute top-[47px] left-[56px]"
                style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                }}
              /> */}
            </div>
          </div>
          <div className="p-10 flex flex-col grid m-auto items-center">{children}</div>
        </div>
        <div
          className="absolute w-full z-10 bottom-0 h-28"
          style={{
            backgroundImage: 'url(' + footerImage + ')',
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute -translate-x-1/2  top-1/2 left-1/2 text-white">
            <p className="hidden sm:block">Powered By ARI Technology Co ., JSC </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Layout;
