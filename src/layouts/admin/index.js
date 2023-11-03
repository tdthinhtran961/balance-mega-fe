import React, { useState, useEffect } from 'react';
import { Dropdown } from 'antd';
import { useNavigate } from 'react-router';
import classNames from 'classnames';

import logo from 'assets/images/logo.png';
import arrow from 'assets/images/arrow.svg';
import back from 'assets/images/return.png';
import up from 'assets/images/uptotop.png';
import menu from 'assets/images/menuIcon.png';
import avatar from 'assets/images/avatar.jpeg';
import { useTranslation } from 'react-i18next';

// import menus from "./menus";
import './index.less';
import { useAuth } from 'global';
import { routerLinks } from 'utils';
import { Avatar } from 'components';
import Menu from './menu';
import { useCart } from 'cartContext';
import { ProfileService } from 'services/profile';
import { ERole } from 'variable';

const Layout = ({ children }) => {
  // menuVertical, permission,
  const { changeLanguage, user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cart, fetchListCart } = useCart();

  const [isCollapsed, set_isCollapsed] = useState(window.innerWidth < 1024);
  const [isDesktop, set_isDesktop] = useState(window.innerWidth > 767);
  const [data, setData] = useState({});
  const [isCheckMenu, setIsCheckMenu] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 1024 && !isCollapsed) {
      setTimeout(() => {
        set_isCollapsed(true);
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // if (window.innerWidth > 1024) {
    //   import('perfect-scrollbar').then(({ default: PerfectScrollbar }) => {
    //     new PerfectScrollbar(document.getElementById('root'), {
    //       suppressScrollX: true,
    //     });
    //   });
    // }
    function handleResize() {
      if (window.innerWidth < 1024 && !isCollapsed) {
        set_isCollapsed(true);
      }
      // set_isDesktop(window.innerWidth > 767);
      set_isDesktop(window.innerWidth > 640);
    }
    window.addEventListener('resize', handleResize, true);
    // import('perfect-scrollbar').then(({ default: PerfectScrollbar }) => {
    //   new PerfectScrollbar(document.getElementById('root'), {
    //     suppressScrollX: true,
    //   });
    // });
    changeLanguage('vi');

    return () => window.removeEventListener('resize', handleResize, true);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);
  const fetchInfo = async () => {
    try {
      const res = await ProfileService.get();
      setData(res);
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);
  const ScrolltoTop = ({ showTopBtn }) => {
    return (
      <div className="top-to-btm">
        {showTopBtn && (
          <img
            // className={classNames('w-12 rounded ml-2', {
            //   hidden: !!isCollapsed || !isDesktop,
            // })}
            className="icon-position icon-style"
            src={up}
            alt=""
            onClick={goToTop}
          />
        )}
      </div>
    );
  };
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const Header = ({ isCollapsed, isDesktop }) => (
    <div className=" ">
      <div className=" relative lg:mb-0 lg:pb-0  pb-24  !bg-gray-100"></div>
      <header
        className={classNames(
          `sm:bg-gray-100 bg-white w-full header  h-18 transition-all duration-300 ease-in-out lg:sticky lg:top-0 block z-10  sm:mb-0 mb-2
         fixed top-0 left-0 `,
          {
            'pl-72': !isCollapsed && isDesktop,
            'pl-32': isCollapsed && isDesktop,
            'pl-28': !isDesktop,
          },
        )}
      >
        {/* {/ <div className="flex items-center justify-end px-5 h-16"> /} */}
        {/* <Select value={i18n.language} onChange={(value) => changeLanguage(value)}>
          <Select.Option value="en"><img src={us} alt="US" className="mr-1 w-4 inline-block relative -top-0.5"/> {t('routes.admin.Layout.English')}</Select.Option>
          <Select.Option value="vi"><img src={vn} alt="VN" className="mr-1 w-4 inline-block relative -top-0.5"/> {t('routes.admin.Layout.Vietnam')}</Select.Option>
        </Select> */}
        <div className="flex items-center justify-end px-5 h-20">
          <div className="flex items-center">
            {(roleCode === 'OWNER_STORE' || roleCode === ERole.sales) && (
              <div className="mr-5 relative flex group">
                <div className="rounded-full text-white w-5 h-5 bg-blue-400 absolute -right-1.5 -top-1.5 leading-none text-center pt-1 text-xs group-hover:animate-bounce">
                  {cart ? cart?.length : 0}
                </div>
                <i
                  className="las la-shopping-cart text-4xl text-gray-500 cursor-pointer"
                  onClick={() => {
                    if(roleCode === ERole.store){
                      navigate(`${routerLinks('CartDetail')}`);
                    }
                    if(roleCode === ERole.sales){
                      navigate(`${routerLinks('CartSalesDetail')}`);
                    }
                    fetchListCart();
                  }}
                />
              </div>
            )}
            {/* <div className="mr-5 relative flex group">
            <div className="rounded-full text-white w-5 h-5 bg-blue-400 absolute -right-1.5 -top-1.5 leading-none text-center pt-1 text-xs group-hover:animate-bounce">
              1
            </div>
            <i className="las la-bell text-4xl text-gray-500" />
          </div> */}
            {/* <div className="mr-5 relative flex group">
            <div className="rounded-full text-white w-5 h-5 bg-yellow-500 absolute -right-1.5 -top-1.5 leading-none text-center pt-1 text-xs group-hover:animate-bounce">
              76
            </div>
            <i className="las la-comment text-4xl text-gray-500" />
          </div> */}
            <Dropdown
              trigger={['click']}
              overlay={
                <ul className="bg-white">
                  <li
                    className="p-2 flex items-center pl-4 cursor-pointer border-b border-solid border-gray-200"
                    style={{
                      wordBreak: 'break-word',
                    }}
                  >
                    <img
                      className="w-[35px] h-[35px] rounded-full object-cover mr-2"
                      src={data?.profileImage || avatar}
                      alt="profile_pic"
                    ></img>
                    <div>
                      <h1 className="font-bold text-sm">{data?.name}</h1>
                      <p className="text-[0.6rem]">{data?.email}</p>
                    </div>
                  </li>
                  <li
                    className="p-2 hover:bg-gray-100 flex items-center pl-4 cursor-pointer"
                    onClick={() => navigate(routerLinks('Profile'))}
                  >
                    <i className="las la-user text-lg mr-2"></i> Thông tin cá nhân
                  </li>
                  <li
                    className="p-2 hover:bg-gray-100 flex items-center pl-4 cursor-pointer"
                    onClick={() => navigate(routerLinks('Profile') + `?tab=2`)}
                  >
                    <i className="las la-key text-lg mr-2"></i> Đổi mật khẩu
                  </li>
                  <li
                    className="p-2 hover:bg-gray-100 flex items-center pl-4 cursor-pointer border-t border-solid border-gray-200"
                    onClick={() => navigate(routerLinks('Login'), { replace: true })}
                  >
                    <i className="las la-sign-out-alt text-lg mr-2"></i> Đăng xuất
                  </li>
                </ul>
              }
              placement="bottomRight"
              overlayClassName="rounded-md shadow-md w-[210px]  overflow-hidden"
            >
              <section className="flex items-center" id={'dropdown-profile'}>
                {data?.profileImage ? (
                  <img
                    className="w-[35px] h-[35px] rounded-full object-cover mr-2"
                    src={data?.profileImage}
                    alt="profile_pic"
                  ></img>
                ) : (
                  <Avatar src={avatar} size={10} />
                )}
              </section>
            </Dropdown>
          </div>
        </div>
      </header>
    </div>
  );
  return (
    <main>
      <Header isCollapsed={isCollapsed} isDesktop={isDesktop} />
      <div
        className={classNames(
          `t-10 sm:rounded-tr-3xl flex
           items-center text-gray-800 hover:text-gray-500 h-20
           ${!isDesktop ? 'fixed top-0 left-0 ' : 'fixed top-0 left-0 '}
             px-5 font-bold transition-all duration-300 ease-in-out z-10`,
          {
            'sm:w-72 justify-between': !isCollapsed && isDesktop,
            'sm:w-[64px] justify-center': isCollapsed,
            'bg-teal-900': isDesktop,
            'bg-white': !isDesktop,
          },
        )}
      >
        <div>
          <a href="/" className="flex items-center">
            <img
              className={classNames('w-12 rounded ml-2', {
                hidden: !!isCollapsed || !isDesktop,
              })}
              src={logo}
              alt=""
            />
            <div
              id={'name-application'}
              className={classNames(
                'transition-all text-white duration-300 ease-in-out absolute left-16 w-40 overflow-ellipsis overflow-hidden ml-7',
                {
                  'opacity-100 text-3xl': !isCollapsed && !!isDesktop,
                  'opacity-0 text-[0px] invisible': !!isCollapsed || !isDesktop,
                },
              )}
            >
              BALANCE
            </div>
          </a>
        </div>

        {isDesktop ? (
          <div
            onClick={() => {
              set_isCollapsed(!isCollapsed);
              // set_isDesktop(!isDesktop);
            }}
          >
            <img
              className={classNames('w-4 cursor-pointer', {
                'rotate-360': (!isCollapsed && isDesktop) || (!isCollapsed && !isDesktop),
                'rotate-180': (isCollapsed && !isDesktop) || (isCollapsed && isDesktop),
              })}
              src={arrow}
              alt=""
            ></img>
          </div>
        ) : (
          <div
            onClick={() => {
              set_isCollapsed(!isCollapsed);
              setIsCheckMenu(!isCheckMenu);
            }}
          >
            <img
              className={classNames(
                'w-7 cursor-pointer translate-x-1',
                // {
                //   'rotate-180': (isCollapsed && isDesktop) || (!isCollapsed && !isDesktop),
                // }
              )}
              src={!isCheckMenu ? menu : back}
              alt=""
            ></img>
          </div>
        )}
        {!isDesktop && (
          <div className="ml-3">
            <img className={classNames('w-12 rounded')} src={logo} alt="" />
          </div>
        )}
      </div>

      <div
        className={classNames(
          'fixed z-10 top-20 sm:left-0 h-screen bg-teal-900 transition-all duration-300 ease-in-out',
          {
            'w-72': !isCollapsed,
            'w-[64px]': isCollapsed,
            '-left-20': isCollapsed && !isDesktop,
          },
        )}
      >
        <Menu
          isCollapsed={isCollapsed}
          set_isCollapsed={set_isCollapsed}
          isCheckMenu={isCheckMenu}
          setIsCheckMenu={setIsCheckMenu}
        />
      </div>
      {!isCollapsed && !isDesktop && (
        <div
          className={'w-full h-[100%] fixed top-0 bg-black opacity-50 z-[2]'}
          onClick={() => {
            set_isCollapsed(true);
            setIsCheckMenu(!isCheckMenu);
          }}
        />
      )}
      <ScrolltoTop showTopBtn={showTopBtn} />
      <div
        className={classNames('bg-gray-100 sm:px-5 px-2 transition-all duration-300 ease-in-out z-10', {
          'sm:ml-72': !isCollapsed && isDesktop,
          'ml-14 sm:ml-20 md:ml-14 ': isCollapsed && isDesktop,
        })}
      >
        {children}
        <footer className="text-center bg-blue-50 mt-10 sm:-mx-5">
          {t('layout.footer', { year: new Date().getFullYear() })}
        </footer>
      </div>
      <div className="hidden h-7 w-7 leading-7" />
    </main>
  );
};
export default Layout;
