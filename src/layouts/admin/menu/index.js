import { Collapse } from 'components';
import React, { Fragment, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { routerLinks } from 'utils';
import { useNavigate, useLocation } from 'react-router';
import './index.less';
import listMenu from '../menus';
import { useAuth } from '../../../global';

const Layout = ({ isCollapsed = false, set_isCollapsed, setIsCheckMenu, isCheckMenu }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const refMenu = useRef();
  const { menu, user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;

  useEffect(() => {
    import('perfect-scrollbar').then(({ default: PerfectScrollbar }) => {
      new PerfectScrollbar(document.getElementById('menu-sidebar'), {
        suppressScrollX: true,
      });
    });
  }, []);

  useEffect(() => {
    if (isCollapsed) {
      refMenu.current.scrollTop = 0;
    }
  }, [isCollapsed]);

  return (
    <ul className="menu relative h-[calc(100vh-5rem)]" id={'menu-sidebar'} ref={refMenu}>
      {listMenu(roleCode)
        .filter((item) => menu.filter((subItem) => subItem.pageUrl === routerLinks(item.name)).length)
        // eslint-disable-next-line array-callback-return
        .map((item, index) => {
          if (!item.child) {
            return (
              <li
                key={index}
                className={classNames('text-gray-300 flex items-center px-1 py-[5px] m-3 ', {
                  'bg-teal-700 text-white rounded-2xl  ': location.pathname === routerLinks(item.name),
                  'h-[42px]': isCollapsed
                })}
                onClick={() => {
                  navigate(routerLinks(item.name));
                  if (window.innerWidth < 640) {
                    set_isCollapsed(!isCollapsed);
                    setIsCheckMenu(!isCheckMenu);
                  }
                }}
              >
                {item.icon ? (
                  <i className={classNames('text-3xl mr-3', item.icon)} />
                ) : (
                  <img width={30} height={30} className={classNames('text-3xl mr-3 opacity-90')} src={item.iconSvg} />
                )}

                <span
                  className={classNames(
                    'text-gray-300 text-base  transition-all duration-300 ease-in-out font-medium',
                    {
                      'opacity-100': !isCollapsed,
                      'opacity-0 text-[0] hidden': isCollapsed,
                      '!text-white': location.pathname === routerLinks(item.name),
                    },
                  )}
                >
                  {item.name}
                </span>
              </li>
            );
          } else {

            return (
              <Collapse
                key={index}
                classNameParent={classNames('py-1 my-3 items-center ', {
                  'h-[50px] justify-center ': isCollapsed
                })}
                title={
                  <Fragment>
                    <i
                      className={classNames(
                        'text-3xl mr-2.5',
                        item.icon,
                        {
                          'bg-teal-700 text-white rounded-2xl px-[5px] py-[5px] ml-[-5px]': item.child.some(i => routerLinks(i.name) === location.pathname) && isCollapsed
                        }
                        // {'text-white ': location.pathname === routerLinks(item.name)}
                      )}
                      onClick={() => navigate(routerLinks(item.child[0].name))}
                    />
                    <span
                      className={classNames(
                        'text-gray-300 text-base transition-all duration-300 ease-in-out font-medium',
                        {
                          'opacity-100': !isCollapsed,
                          'opacity-0 text-[0] hidden': isCollapsed,
                          '!text-white ': location.pathname === routerLinks(item.name),
                        },
                      )}
                    >
                      {item.name}
                    </span>
                  </Fragment>
                }
                className="flex items-center pr-3 pl-[15px] py-1 text-gray-300"
                showArrow={!isCollapsed}
                popover={isCollapsed}
                isExpand={location.pathname.indexOf(routerLinks(item.name)) === 0}
              >
                <div className="px-2 mx-2">
                  {item.child.map((subItem, index) => {
                    let check = false;
                    menu.filter((menuItem) => {
                      return menuItem.children?.filter((childItem) => {
                        if (childItem.pageUrl === routerLinks(subItem.name)) {
                          check = true;
                        }
                        return true;
                      });
                    });
                    return check ? (
                      <li
                        key={index}
                        className={classNames('py-2 text-gray-300 font-medium text-base text-popover', {
                          'bg-teal-700 !text-white rounded-2xl px-3  ': location.pathname === routerLinks(subItem.name),
                        })}
                        onClick={() => {
                          navigate(routerLinks(subItem.name));
                          if (window.innerWidth < 640) {
                            set_isCollapsed(!isCollapsed);
                            setIsCheckMenu(!isCheckMenu);
                          }
                        }}
                      >
                        <a
                          className="hover:text-gray-300"
                          onClick={() => {
                            navigate(routerLinks(subItem.name));
                            if (window.innerWidth < 640) {
                              set_isCollapsed(!isCollapsed);
                              setIsCheckMenu(!isCheckMenu);
                            }
                          }}
                        >
                          {subItem.name === 'Quản lý chuyển hàng' ? 'Chuyển hàng' : subItem.name}
                        </a>
                      </li>
                    ) : (
                      ''
                    );
                  })}
                </div>
              </Collapse>
            );
          }
        })}
    </ul>
  );
};
export default Layout;
