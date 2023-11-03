import React, { useState, Fragment, useEffect, lazy } from 'react';
import { Message, Spin } from 'components';
import { StoreService } from 'services/store';
import './index.less';
import { useLocation } from 'react-router-dom';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { Form as FormAnt, Tabs, Dropdown, Menu, Space } from 'antd';
import { useAuth } from 'global';
import Address from './components/address';
import TabData from './components/tabHook';
import classNames from 'classnames';
const { TabPane } = Tabs;

const Page = () => {
  const [form] = FormAnt.useForm();
  const location = useLocation();
  const [, setIsLoading] = useState(false);
  const { user, changSearch } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const subOrgId = user?.userInfor?.subOrgId;
  const isMain = user?.userInfor?.isMain;
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const idStore = urlSearch.get('id');
  const pageBranch = urlSearch.get('page');
  const ViewStoreBranch = urlSearch.get('view');
  const [data, setData] = useState({});
  const [emailManager, setEmailManager] = useState([]);
  const [, setManagerId] = useState('');
  const [tabKey, setTabKey] = useState(urlSearch.get('tab') || 1);

  const [keyDropdownSupplierManagementByStore, setKeyDropdownSupplierManagementByStore] = useState(1);
  const [keyDropdownProductManagementByStore, setKeyDropdownProductManagementByStore] = useState(1);
  const [keyDropdown, setKeyDropdown] = useState(1);
  const [isHidden, setIsHidden] = useState(false);
  const [isCall, setIsCall] = useState(false);

  const [connectKioViet, setConnectKioViet] = useState({
    client_id: '',
    client_secret: '',
    retailer: '',
  });

  const RevenueByOrderAdmin = lazy(() => import('./components/revenueByOrder_Admin'));
  const RevenueByProductAdmin = lazy(() => import('./components/revenueByProduct_Admin'));

  const handleDropdown = (e) => {
    switch (e?.key) {
      case '1':
        setKeyDropdown(1);
        navigate(routerLinks('StoreEdit') + `?id=${data.id}&tab=5&dropKey=${e?.key}`);
        break;
      case '2':
        setKeyDropdown(2);
        navigate(routerLinks('StoreEdit') + `?id=${data.id}&tab=5&dropKey=${e?.key}`);
        break;
    }
  };
  const handleDropdownSupplierManagementByStore = (e) => {
    switch (e?.key) {
      case '1':
        setKeyDropdownSupplierManagementByStore(1);
        navigate(routerLinks('StoreEdit') + `?id=${data.id}&tab=4&dropKey=${e?.key}`);
        break;
      case '2':
        setKeyDropdownSupplierManagementByStore(2);
        navigate(routerLinks('StoreEdit') + `?id=${data.id}&tab=4&dropKey=${e?.key}`);
        break;
    }
  };
  const handleDropdownProductManagementByStore = (e) => {
    switch (e?.key) {
      case '1':
        setKeyDropdownProductManagementByStore(1);
        navigate(routerLinks('StoreEdit') + `?id=${data.id}&tab=2&dropKey=${e?.key}`);
        break;
      case '2':
        setKeyDropdownProductManagementByStore(2);
        navigate(routerLinks('StoreEdit') + `?id=${data.id}&tab=2&dropKey=${e?.key}`);
        break;
    }
  };

  useEffect(() => {
    switch (urlSearch.get('tab')) {
      case '1':
        tabKey !== 1 && setTabKey(1);
        break;
      case '2':
        tabKey !== 2 && setTabKey(2);
        break;
      case '3':
        tabKey !== 3 && setTabKey(3);
        break;
      case '4':
        tabKey !== 4 && setTabKey(4);
        break;
      case '5':
        tabKey !== 5 && setTabKey(5);
        break;
      case '6':
        tabKey !== 6 && setTabKey(6);
        break;
      default:
        setTabKey(1);
        break;
    }
  }, [location.search]);
  const dropKey = urlSearch.get('dropKey');
  useEffect(() => {
    if (dropKey && tabKey === 2 && dropKey === 2) {
      return setTabKey(2);
    }
    if (dropKey && tabKey === 2 && dropKey === 1) {
      return setTabKey(1);
    }
    if (dropKey && tabKey === 4 && dropKey === 1) {
      return setTabKey(1);
    }
    if (dropKey && tabKey === 4 && dropKey === 2) {
      return setTabKey(2);
    }
    if (dropKey && tabKey === 5 && dropKey === 1) {
      return setTabKey(1);
    }
    if (dropKey && tabKey === 5 && dropKey === 2) {
      return setTabKey(2);
    }
  }, [location.search]);
  useEffect(() => {
    if (dropKey !== '') {
      switch (urlSearch.get('dropKey')) {
        case '1':
          dropKey !== 1 &&
            (setKeyDropdownProductManagementByStore(1) ||
              setKeyDropdownSupplierManagementByStore(1) ||
              setKeyDropdown(1));
          break;
        case '2':
          dropKey !== 2 &&
            (setKeyDropdownProductManagementByStore(2) ||
              setKeyDropdownSupplierManagementByStore(2) ||
              setKeyDropdown(2));
          break;
        default:
          break;
      }
    }
  }, [location.search]);

  const menu = (
    <Menu
      selectable
      defaultSelectedKeys={['1']}
      onClick={handleDropdown}
      items={[
        {
          label: 'Doanh thu theo đơn hàng',
          key: '1',
        },
        {
          label: 'Doanh thu theo sản phẩm',
          key: '2',
        },
      ]}
    />
  );

  const menuSupplierManagementByStore = (
    <Menu
      selectable
      defaultSelectedKeys={['1']}
      onClick={handleDropdownSupplierManagementByStore}
      items={[
        {
          label: 'BALANCE',
          key: '1',
        },
        {
          label: 'Non - BALANCE',
          key: '2',
        },
      ]}
    />
  );

  const menuProductManagementByStore = (
    <Menu
      selectable
      defaultSelectedKeys={['1']}
      onClick={handleDropdownProductManagementByStore}
      items={[
        {
          label: 'BALANCE',
          key: '1',
        },
        {
          label: 'Non - BALANCE',
          key: '2',
        },
      ]}
    />
  );
  // const  isNullOrUndefined = (value) => value === null || value === undefined
  useEffect(() => {
    const initFunction = async () => {
      if (
        idStore !== null &&
        ((pageBranch === 'branch' && (pageType === 'edit' || pageType === 'information')) || pageType !== 'create')
      ) {
        const res = await StoreService.getById(idStore);
        if (res?.informationConnect?.clientId === null || res?.informationConnect === null) {
          setIsHidden(false);
          setIsCall(false);
        } else {
          setIsHidden(true);
          setIsCall(true);
          setConnectKioViet({
            client_id: res?.informationConnect?.clientId,
            client_secret: res?.informationConnect?.clientSecret,
            retailer: res?.informationConnect?.retailer,
          });
        }
        setData(res);
      }
    };
    initFunction();
  }, [idStore, pageBranch, pageType]);

  useEffect(() => {
    const getListManager = async () => {
      const res = await StoreService.getListManager({ code: 'OWNER_STORE' });
      setEmailManager(res.data);
    };
    getListManager();
  }, []);

  useEffect(() => {
    const initFunction = async () => {
      if (subOrgId !== null && (roleCode === 'OWNER_STORE' ) && pageBranch !== 'branch') {
        const res = await StoreService.getById(subOrgId);
        if (res?.informationConnect?.clientId === null || res?.informationConnect === null) {
          setIsHidden(false);
          setIsCall(false);
        } else {
          setIsHidden(true);
          setIsCall(true);
          setConnectKioViet({
            client_id: res?.informationConnect?.clientId,
            client_secret: res?.informationConnect?.clientSecret,
            retailer: res?.informationConnect?.retailer,
          });
        }
        setData(res);
      }
    };
    initFunction();
  }, [subOrgId, roleCode, pageBranch]);

  const submit = async (values) => {
    try {
      if (!data?.id) return;
      const param = {
        name: values.name,
        type: 'STORE',
        supplierType: 'BALANCE',
        address: {
          street: values?.street,
          wardId: +values?.ward,
          districtId: +values?.district,
          provinceId: +values?.province,
        },
        emailContact: values.emailContact,
        nameContact: values.nameContact,
        phoneNumber: values.phoneNumber,
        note: values.note,
        fax: values.fax,
        // isActive: true,
        // managerId: Number(managerId),
        connectKiot: isHidden
          ? {
              clientSecret: values.client_secret,
              clientId: values.client_id,
              retailer: values.retailer,
              branchId: values.branchId,
            }
          : {},
      };
      setIsLoading(true);
      const res = await StoreService.put(idStore || subOrgId, param);
      setIsLoading(false);
      if (res) {
        roleCode === 'ADMIN' && navigate(`${routerLinks('Quản lý cửa hàng')}`);
      }
    } catch (err) {
      console.log('Error is:', err);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (roleCode !== 'ADMIN') localStorage.removeItem('idStore');
  }, []);

  const submitCreateBranch = async (values) => {
    try {
      if (!data?.id) return;
      const param = {
        name: values.name,
        type: 'STORE',
        supplierType: 'BALANCE',
        address: {
          street: values?.street,
          wardId: +values?.ward,
          districtId: +values?.district,
          provinceId: +values?.province,
        },
        emailContact: values.emailContact,
        nameContact: values.nameContact,
        phoneNumber: values.phoneNumber,
        note: values.note,
        fax: values.fax,
        // isActive: true,
        // managerId: Number(managerId),
        connectKiot: isHidden
          ? {
              clientSecret: values.client_secret,
              clientId: values.client_id,
              retailer: values.retailer,
              branchId: values.branchId,
            }
          : {},
      };
      setIsLoading(true);
      const res = await StoreService.put(
        idStore || subOrgId,
        pageBranch !== 'branch' ? param : { ...param, isStore: idStore || subOrgId },
      );
      setIsLoading(false);
      if (res && pageBranch === 'branch') {
        return roleCode === 'ADMIN' && navigate(routerLinks('BranchEdit') + `?id=${idStore}&tab=3`);
      }
    } catch (err) {
      console.log('Error is:', err);
      setIsLoading(false);
    }
  };

  const handleChangeTab = (key) => {
    if (!key) return;
    if (+key === 3) {
      localStorage.setItem('idStore', idStore);
    }
    setTabKey(Number(key));
    navigate(routerLinks('StoreEdit') + `?id=${data.id || +localStorage.getItem('idStore')}&tab=${key}`);
  };

  if (roleCode === 'ADMIN' && !data?.id && pageBranch !== 'branch')
    return (
      <div className="h-screen items-center flex justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  if (pageType === 'information' && !data?.id)
    return (
      <div className="h-screen items-center flex justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  if (pageBranch === 'branch' && !data?.id)
    return (
      <div className="h-screen items-center flex justify-center">
        <Spin className="w-[200px]" />
      </div>
    );

  return (
    <Fragment>
      <div className="min-h-screen store-wrapper ">
        <p className="text-2xl font-bold text-teal-900 mb-6">
          {pageType === 'edit' || pageType === 'information' ? 'Thông tin cửa hàng' : 'Cửa hàng'}
        </p>
        <Tabs onChange={handleChangeTab} className="mt-5" activeKey={String(tabKey)}>
          <TabPane tab="Thông tin cửa hàng" key="1" className="">
            <div className="bg-white w-full px-6 rounded-[10px] rounded-tl-none pt-6">
              <Address
                submit={pageBranch !== 'branch' ? submit : submitCreateBranch}
                pageType={pageType}
                form={form}
                emailManager={emailManager}
                data={data}
                setManagerId={setManagerId}
                roleCode={roleCode}
                isHidden={isHidden}
                setIsHidden={setIsHidden}
                connectKioViet={connectKioViet}
                setConnectKioViet={setConnectKioViet}
                pageBranch={pageBranch}
                ViewStoreBranch={ViewStoreBranch}
                setIsCall={setIsCall}
                isCall={isCall}
                isMain={!!isMain}
              />
              {(roleCode === 'OWNER_STORE' ) && <div className="h-6"></div>}
            </div>
          </TabPane>
          {roleCode === 'ADMIN' && pageType === 'edit' && pageBranch !== 'branch' && (
            <>
              <TabPane
                tab={
                  <Dropdown overlay={menuProductManagementByStore} trigger={['click']} placement="bottom">
                    <a onClick={(e) => e.preventDefault()}>
                      <Space className="flex items-center">
                        Danh sách hàng hóa{' '}
                        <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M17.876 1.72656L16.7933 0.648437L9.05015 8.35937L1.30696 0.648437L0.224321 1.72656L8.50883 9.97656L9.05015 10.4922L9.59147 9.97656L17.876 1.72656Z"
                            fill="#134E4A"
                          />
                        </svg>
                      </Space>
                    </a>
                  </Dropdown>
                }
                key="2"
              >
                <div className="bg-white w-full px-4 rounded-xl pt-5 pb-4 relative">
                  {+tabKey === 2 && keyDropdownProductManagementByStore === 1 && (
                    <TabData tabKey={tabKey} idStore={idStore} keyDropdown={keyDropdownProductManagementByStore} />
                  )}
                  {+tabKey === 2 && keyDropdownProductManagementByStore === 2 && (
                    <TabData tabKey={tabKey} idStore={idStore} keyDropdown={keyDropdownProductManagementByStore} />
                  )}
                </div>
              </TabPane>
              <TabPane tab={'Danh sách chi nhánh'} key="3">
                <div className="bg-white w-full px-4 rounded-xl pt-5 pb-4 relative">
                  {+tabKey === 3 && <TabData tabKey={tabKey} idStore={idStore} data={data} />}
                </div>
              </TabPane>
              <TabPane
                tab={
                  <Dropdown overlay={menuSupplierManagementByStore} trigger={['click']} placement="bottom">
                    <a onClick={(e) => e.preventDefault()}>
                      <Space className="flex items-center">
                        Quản lý NCC{' '}
                        <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M17.876 1.72656L16.7933 0.648437L9.05015 8.35937L1.30696 0.648437L0.224321 1.72656L8.50883 9.97656L9.05015 10.4922L9.59147 9.97656L17.876 1.72656Z"
                            fill="#134E4A"
                          />
                        </svg>
                      </Space>
                    </a>
                  </Dropdown>
                }
                key="4"
              >
                <div className="bg-white w-full px-4 rounded-xl pt-5 pb-4 relative">
                  {+tabKey === 4 && keyDropdownSupplierManagementByStore === 1 && (
                    <TabData tabKey={tabKey} idStore={idStore} keyDropdown={keyDropdownSupplierManagementByStore} />
                  )}
                  {+tabKey === 4 && keyDropdownSupplierManagementByStore === 2 && (
                    <TabData tabKey={tabKey} idStore={idStore} keyDropdown={keyDropdownSupplierManagementByStore} />
                  )}
                </div>
              </TabPane>
              <TabPane
                tab={
                  <Dropdown overlay={menu} trigger={['click']} placement="bottom">
                    <a onClick={(e) => e.preventDefault()}>
                      <Space className="flex items-center">
                        Doanh thu
                        <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M17.876 1.72656L16.7933 0.648437L9.05015 8.35937L1.30696 0.648437L0.224321 1.72656L8.50883 9.97656L9.05015 10.4922L9.59147 9.97656L17.876 1.72656Z"
                            fill="#134E4A"
                          />
                        </svg>
                      </Space>
                    </a>
                  </Dropdown>
                }
                key="5"
              >
                <div className="bg-white w-full px-4 rounded-xl pt-5 pb-4 relative">
                  {+tabKey === 5 && keyDropdown === 1 && (
                    <RevenueByOrderAdmin tabKey={tabKey} idStore={idStore} keyDropdown={keyDropdown} />
                  )}
                  {+tabKey === 5 && keyDropdown === 2 && (
                    <RevenueByProductAdmin tabKey={tabKey} idStore={idStore} keyDropdown={keyDropdown} />
                  )}
                </div>
              </TabPane>
              <TabPane tab="Quản lý kho" key="6">
                <div className="bg-white w-full px-4 rounded-xl pt-5 pb-4 relative">
                  {+tabKey === 6 && <TabData tabKey={tabKey} idStore={idStore} />}
                </div>
              </TabPane>
            </>
          )}
        </Tabs>
        {+tabKey !== 1 && (
          <div
            className={classNames(`flex sm:flex-row flex-col items-center justify-between  z-10  `, {
              'sm:mt-0 mt-[80px]': pageType === 'information',
              'sm:mt-5 mt-[80px]': pageType === 'edit',
            })}
          >
            {/* <div className='w-full'> */}
            <button
              onClick={() =>
                window?.location?.hash.includes('/store-managerment/edit')
                  ? navigate(`${routerLinks('Quản lý cửa hàng')}?fullTextSearch=${changSearch}`)
                  : window.history.back()
              }
              className={classNames(
                `
                text-center sm:w-[106px] w-[58%] bg-white border-teal-900 hover:border-teal-600 border-solid border rounded-[10px] text-teal-900 hover:text-teal-600  text-sm h-[44px] sm:z-10`,
                {
                  'mb-10 mt-5': pageBranch === 'branch',
                  'mt-2 sm:mr-0 ': pageBranch !== 'branch',
                  '!mt-1 w-[60%]': roleCode === 'ADMIN',
                },
              )}
              id="backBtn"
            >
              Trở về
            </button>
            {/* </div> */}
          </div>
        )}

        {+tabKey === 1 && (
          <div
            className={`flex sm:flex-row flex-col  sm:w-full justify-between sm:mt-2 ${
              +tabKey === 1 ? 'mt-0' : 'mt-[80px]'
            } `}
          >
            {/* ${pageType === 'information' ? 'sm:mt-0 mt-[80px]' : ''} */}
            <div
              className={classNames(`flex sm:flex-row flex-col items-center justify-between  z-10  `, {
                'sm:mt-0 mt-[80px]': pageType === 'information',
                'sm:mt-5 mt-[80px]': pageType === 'edit',
              })}
            >
              {/* <div className='w-full'> */}
              <button
                onClick={() =>
                  window?.location?.hash.includes('/store-managerment/edit')
                    ? navigate(`${routerLinks('Quản lý cửa hàng')}?fullTextSearch=${changSearch}`)
                    : window.history.back()
                }
                className={classNames(
                  `
                text-center sm:w-[106px] w-[58%] bg-white border-teal-900 hover:border-teal-600 border-solid border rounded-[10px] text-teal-900 hover:text-teal-600  text-sm h-[44px] sm:z-10`,
                  {
                    'mb-10 mt-5': pageBranch === 'branch',
                    'mt-2 sm:mr-0 ': pageBranch !== 'branch',
                    '!mt-1 w-[60%]': roleCode === 'ADMIN',
                  },
                )}
                id="backBtn"
              >
                Trở về
              </button>
              {/* </div> */}
            </div>
            {/* <div className={`flex justify-end items-end text-sm ${data?.isActive === true ? 'mr-[130px]' : null}`}> */}
            <div
              className={`flex sm:flex-row flex-col justify-end sm:items-end text-sm sm:mr-[130px] w-full
                // ${data?.isActive === true ? 'sm:mr-[130px]' : null}`}
            >
              <div className="flex sm:flex-row flex-col justify-end items-end">
                {pageBranch === 'branch' && data?.storeId !== null && !!isMain && (
                  <>
                    {data?.isActive === true ? (
                      <button
                        className="h-[44px] sm:mt-0 mt-2 mb-10  sm:ml-0 ml-5 sm:w-[163px] w-[60%] items-end rounded-[10px] text-sm bg-red-500 text-white hover:bg-red-400 mr-6  sm:z-10"
                        onClick={() => {
                          Message.confirm({
                            text: 'Bạn có chắc hủy kích hoạt chi nhánh này ?',
                            onConfirm: async () => {
                              if (!idStore) return null;
                              const res = await StoreService.activeBranch(idStore, { isActive: false });
                              if (res) {
                                return roleCode === 'OWNER_STORE' 
                                  ? navigate(`${routerLinks('BranchManagement')}`)
                                  : roleCode === 'ADMIN'
                                  ? navigate(routerLinks('BranchEdit') + `?id=${idStore}&tab=3`)
                                  : null;
                              }
                            },
                          });
                        }}
                        id="backBtn"
                      >
                        Huỷ hoạt động
                      </button>
                    ) : (
                      <button
                        className="h-[44px] sm:mt-0 mt-2 mb-10  sm:ml-0 ml-5 sm:w-[163px] w-[60%] items-end rounded-[10px] text-sm bg-yellow-500 text-white hover:bg-yellow-400 mr-6  sm:z-10"
                        onClick={() => {
                          Message.confirm({
                            text: 'Bạn có chắc muốn kích hoạt chi nhánh này ?',
                            onConfirm: async () => {
                              if (!idStore) return null;
                              const res = await StoreService.activeBranch(idStore, { isActive: true });
                              if (res) {
                                return roleCode === 'OWNER_STORE' 
                                  ? navigate(`${routerLinks('BranchManagement')}`)
                                  : roleCode === 'ADMIN'
                                  ? navigate(routerLinks('BranchEdit') + `?id=${idStore}&tab=3`)
                                  : null;
                              }
                            },
                          });
                        }}
                        id="backBtn"
                      >
                        Tiếp tục hoạt động
                      </button>
                    )}
                  </>
                )}
              </div>
              {/* {roleCode === 'ADMIN' && data?.isActive === true && (
                <div className={`flex sm:flex-row flex-col items-center ${pageType === 'edit' ? 'sm:mt-5' :''} `}>
                <button
                  onClick={async () => {
                    // Message.confirm({
                    //   text: 'Khi hủy kích hoạt, toàn bộ sản phẩm của cửa hàng sẽ không thể bán được nữa. Bạn chắc chứ?',
                    //   onConfirm: async () => {
                    //     const res = await StoreService.activeStore(Number(data?.id), { isActive: false });
                    //     res && navigate(`${routerLinks('Quản lý cửa hàng')}`);
                    //   },
                    //   confirmButtonColor: '#ffffff',
                    //   cancelButtonText: 'Hủy',
                    //   confirmButtonText: 'Đồng ý',
                    // });

                    Message.confirm({
                      text: 'Khi hủy kích hoạt, toàn bộ sản phẩm của cửa hàng sẽ không thể bán được nữa. Bạn chắc chứ?',
                      onConfirm: async () => {
                        const res = await StoreService.activeStore(Number(data?.id), { isActive: false });
                        res.activeOrder === false && navigate(`${routerLinks('Quản lý cửa hàng')}`);
                        if (res.activeOrder === true) {
                          Message.confirm({
                            text: 'Cửa hàng này có các đơn hàng đang thực hiện giao dịch. Bạn có muốn tiếp tục hủy kích hoạt? Các đơn hàng đang giao dịch sẽ bị hủy.',
                            onConfirm: async () => {
                              const res = await StoreService.activeStoreHaveOrder({ isActive: false }, [data.id]);
                              res && navigate(`${routerLinks('Quản lý cửa hàng')}`);
                            },
                            cancelButtonText: 'Hủy',
                            confirmButtonText: 'Đồng ý',
                          });
                        }
                      },
                      cancelButtonText: 'Hủy',
                      confirmButtonText: 'Đồng ý',
                    });
                  }}
                    className="h-[44px] sm:mt-0 mt-2 sm:ml-0 ml-5 sm:w-[163px] w-[60%] rounded-[10px] text-sm bg-red-500 text-white hover:bg-red-400 mr-6 sm:z-10 z-0"
                  id="deactiveBtn"
                >
                  Ngừng hoạt động
                </button>
                </div>
              )} */}
              {/* {roleCode === 'ADMIN' && data?.isActive === false && (
              )} */}
            </div>
            {/* {ViewStoreBranch === 'store' && (
              <div className='flex sm:flex-row flex-col items-end '>
                <button
                  onClick={(event) => navigate(routerLinks('BranchEdit') + `?id=${idStore}&page=branch`)}
                  className={`h-[44px] sm:w-[130px] w-[60%] sm:mt-0 mt-2  rounded-[10px] text-sm bg-teal-900 text-white  active:bg-teal-600
                `}
                  id="activeBtn"
                >
                  Chỉnh sửa
                </button>
              </div>
            )} */}
          </div>
        )}
      </div>
    </Fragment>
  );
};
export default Page;
