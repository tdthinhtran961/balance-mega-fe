import React, { useState, Fragment, useEffect, lazy } from 'react';
import { Spin } from 'components';
import './index.less';
import { useLocation } from 'react-router-dom';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { Form as FormAnt, Tabs, Dropdown, Menu, Space } from 'antd';
import { SupplierService } from 'services/supplier';
import { useAuth } from 'global';
import { HookModalForm } from 'hooks';
import { ColumnConnectCancelReason } from 'columns/supplier';
// import TabData from './components/tabHook';
const Detail = lazy(() => import('./contract/contractDetail'));
const SupplierInfo = lazy(() => import('./tabPaneComponents/SupplierInfo'));
const GoodList = lazy(() => import('./tabPaneComponents/GoodList'));
const OrderManagement = lazy(() => import('./tabPaneComponents/OrderManagement'));
// const DataRevenue = lazy(() => import('./supplierDropdownNavbar/SupplierRevenue'));
const OrderRevenue = lazy(() => import('./tabPaneComponents/DataRevenue/order_revenue_admin'));
const ProductRevenue = lazy(() => import('./tabPaneComponents/DataRevenue/product_revenue'));
// const Discount = lazy(() => import('./tabPaneComponents/Discount'));
const DiscountAdmin = lazy(() => import('./tabPaneComponents/Discount_admin'));

const { TabPane } = Tabs;

const Page = () => {
  const [form] = FormAnt.useForm();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  const [managerId, setManagerId] = useState('');
  // const [email, setEmail] = useState([]);
  const urlSearch = new URLSearchParams(location.search);
  const idSupplier = urlSearch.get('id');
  const idStore = urlSearch.get('idStore');
  const site = urlSearch.get('site');
  const view = urlSearch.get('view');
  const [data, setData] = useState({});
  const [tabKey, setTabKey] = useState(urlSearch.get('tab') || 1);
  const { user, changSearchSupplier } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const subOrgId = user?.userInfor?.subOrgId;
  const [isLoading, setIsLoading] = useState(false);
  const [keyDropdown, setKeyDropdown] = useState(1);

  let title = '';

  switch (pageType) {
    case 'detail':
      title = 'Chi tiết nhà cung cấp';
      break;
    case 'edit':
      title = 'Chi tiết nhà cung cấp';
      break;
    case 'info':
      title = 'Thông tin nhà cung cấp';
      break;
    default:
      title = 'Nhà cung cấp';
      break;
  }

  useEffect(() => {
    const initFunction = async () => {
      if (idSupplier) {
        const res = await SupplierService.getById(idSupplier);
        setData(res);
        setManagerId(res?.userRole[0].userAdmin.id);
      }
    };
    site !== 'NonBal' && site !== 'inBal' && site !== 'inBalAd' && initFunction();
  }, [idSupplier]);

  useEffect(() => {
    const initFunction = async () => {
      if (idSupplier) {
        const res = await SupplierService.getByIdInBal(idSupplier);
        setData(res);
        // setManagerId(res?.userRole[0].userAdmin.id);
      }
    };
    (site === 'inBal' || site === 'inBalAd') && initFunction();
  }, [idSupplier]);

  useEffect(() => {
    const initFunction = async () => {
      if (idSupplier && site === 'NonBal') {
        const res = await SupplierService.getByIdNonBal(idSupplier, idStore || subOrgId);
        setData(res);
        // setManagerId(res?.userRole[0].userAdmin.id);
      }
    };
    site === 'NonBal' && initFunction();
  }, [idSupplier]);

  const submit = async (values) => {
    if (!data?.id) return;
    if (site === 'NonBal' && pageType === 'edit') {
      try {
        const param = {
          address: {
            street: values.address,
            wardId: Number(values.ward),
            districtId: Number(values.district),
            provinceId: Number(values.province),
          },
          emailContact: values.email,
          nameContact: values.manageName,
          phoneNumber: values.managePhone,
          name: values.name,
          note: values.note,
          fax: values.fax,
          supplierType: 'NON_BALANCE',
          type: 'SUPPLIER',
          // isActive: true,
        };
        setLoading(true);
        const res = await SupplierService.put(param, idSupplier || subOrgId);
        setLoading(false);
        if (res) {
          return navigate(`${routerLinks('SupplierManagementByStore')}?id=${subOrgId}&tab=2`);
        }
      } catch (err) {
        setLoading(false);
      }
    } else {
      try {
        let res;
        const param = {
          ...values,
          managerId: Number(managerId),
          address: {
            street: values.address,
            // wardId: values?.ward || +data?.ward,
            wardId: isNaN(+values?.ward) ? +data?.wardId : +values?.ward,
            // districtId: values?.district || +data?.district,
            districtId: isNaN(+values?.district) ? +data?.districtId : +values?.district,
            // provinceId: values?.province || +data?.province,
            provinceId: isNaN(+values?.province) ? +data?.provinceId : +values?.province,
          },
          emailContact: values.email,
          nameContact: values.manageName,
          phoneNumber: values.managePhone,
          name: values.name,
          note: values.note,
          fax: values.fax,
          type: 'SUPPLIER',
          supplierType: 'BALANCE',
        };
        setLoading(true);
        pageType === 'edit'
          ? (res = await SupplierService.put(param, idSupplier))
          : (res = await SupplierService.post(param));
        setLoading(false);
        if (res) {
          return navigate(`${routerLinks('Supplier')}`);
        }
      } catch (err) {
        setLoading(false);
      }
    }
  };

  const onChange = (key) => {
    if (!key) return;
    setTabKey(Number(key));
    navigate(routerLinks('SupplierEdit') + `?id=${idSupplier}&tab=${key}`);
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

  const [handleEdit, ModalForm] = HookModalForm({
    title: (data) => 'Hủy kết nối',
    isLoading,
    setIsLoading,
    // handleChange: async () => await handleEdit(),
    columns: ColumnConnectCancelReason({
      // t,
      // formatDate,
    }),
    // GetById: TaxService.getById,
    Post: async (values) => {
      const res = await SupplierService.storeDisconnectNonBalSupplier({ ...values, id: +idSupplier });
      Number(res.statusCode === 200) && navigate(`/store-managerment/edit?id=${idStore}&tab=4&dropKey=1`);
    },
    // Put: async (values, id) => {
    //   return TaxService.put({ ...values}, id)
    // },
    // Delete: TaxService.delete,
    widthModal: 600,
    textSubmit: 'Xác nhận',
    textCancel: 'Hủy',
    className: 'modalFormConnectCancelReason',
  });

  if (!data?.id || loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }

  const handleDropdown = (e) => {
    switch (e?.key) {
      case 'tmp-0':
        setKeyDropdown(1);
        navigate(routerLinks('SupplierEdit') + `?id=${idSupplier}&tab=4&dropKey=${1}`);
        break;
      case 'tmp-1':
        setKeyDropdown(2);
        navigate(routerLinks('SupplierEdit') + `?id=${idSupplier}&tab=4&dropKey=${2}`);
        break;
    }
  };

  const menu = (
    <Menu
      selectable
      defaultSelectedKeys={['1']}
      onClick={handleDropdown}
      items={[
        {
          label: 'Doanh thu theo đơn hàng',
          keyDropdown: '1',
        },
        {
          label: 'Doanh thu theo sản phẩm',
          keyDropdown: '2',
        },
      ]}
    />
  );
  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="font-bold text-2xl text-teal-900">{title}</p>
        <Tabs defaultActiveKey="1" onChange={onChange} activeKey={String(tabKey)} className="mt-5">
          <TabPane tab="Thông tin nhà cung cấp" key="1" className="">
            <div className="bg-white w-full px-6 rounded-xl rounded-tl-none pt-6 relative">
              {Number(tabKey) === 1 && (
                <SupplierInfo
                  // email={email}
                  pageType={pageType}
                  setManagerId={setManagerId}
                  roleCode={roleCode}
                  submit={submit}
                  data={data}
                  form={form}
                  site={site}
                  view={view}
                />
              )}
              <div></div>
            </div>
          </TabPane>
          {roleCode === 'ADMIN' && site !== 'inBal' && site !== 'NonBal' && site !== 'inBalAd' && (
            <TabPane tab="Danh sách hàng hóa" key="2">
              <div className="bg-white w-full px-6 rounded-xl pt-6 pb-4 relative">
                {Number(tabKey) === 2 && <GoodList tabKey={tabKey}/>}
              </div>
            </TabPane>
          )}
          {roleCode === 'ADMIN' && site !== 'inBal' && site !== 'NonBal' && site !== 'inBalAd' && (
            <TabPane tab="Quản lý đơn hàng" key="3">
              <div className="bg-white w-full px-6 rounded-xl pt-6 pb-4 relative">
                {Number(tabKey) === 3 && <OrderManagement tabKey={tabKey} />}
              </div>
            </TabPane>
          )}
          {(site === undefined || site === null) && (
            <>
              {/* <TabPane tab="Doanh thu" key="4">
                <div className="bg-white w-full px-6 rounded-xl pt-6 pb-4 relative">
                  {Number(tabKey) === 4 && <DataRevenue id={idSupplier} />}
                </div>
              </TabPane> */}
              <TabPane
                tab={
                  <Dropdown overlay={menu} trigger={['click']} placement="bottom">
                    <a
                    // onClick={(e) => e.preventDefault()}
                    >
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
                key="4"
              >
                <div className="bg-white w-full px-4 rounded-xl pt-5 pb-4 relative">
                  {Number(tabKey) === 4 && keyDropdown === 1 && (
                    <OrderRevenue subOrgId={idSupplier} keyDropdown={keyDropdown} tabKey={tabKey} />
                  )}
                  {Number(tabKey) === 4 && keyDropdown === 2 && (
                    <ProductRevenue subOrgId={idSupplier} keyDropdown={keyDropdown} />
                  )}
                </div>
              </TabPane>
              <TabPane tab="Chiết khấu" key="5">
                <div className="bg-white w-full px-6 rounded-xl pt-6 pb-4 relative">
                  {Number(tabKey) === 5 && <DiscountAdmin id={idSupplier} tabKey={tabKey}/>}
                </div>
              </TabPane>
              <TabPane tab="Hợp đồng" key="6">
                <div className="bg-white w-full px-6 rounded-xl pt-6 pb-4 relative">
                  {Number(tabKey) === 6 && <Detail />}
                </div>
              </TabPane>
            </>
          )}
        </Tabs>
        {Number(tabKey) !== 6 && (site === undefined || site === null) && (
          <div
            className={`sm:flex flexRowReverse sm:w-auto justify-between sm:mt-7  ${
              +tabKey === 6 ? 'mt-[120px]' : +tabKey === 1 ? 'mt-[75px]' : 'mt-2'
            } `}
          >
            <div className="flex sm:flex-row flex-col items-center mt-2">
              {pageType === 'edit' && tabKey !== 6 ? (
                <button
                  onClick={() => {
                    // window.history.back();
                    navigate(`${routerLinks('Supplier')}?fullTextSearch=${changSearchSupplier}`);
                  }}
                  className="z-10 px-8 sm:w-auto w-[60%] bg-white border-teal-900 hover:border-teal-600 border-solid border
               p-2 rounded-[10px] text-teal-900 hover:text-teal-600 sm:mt-1 mt-2 text-sm h-[45px]"
                >
                  Trở về
                </button>
              ) : pageType === 'detail' && tabKey === 1 ? (
                <button
                  onClick={() => {
                    window.history.back();
                    navigate(`${routerLinks('Quản lý nhà cung cấp')}`);
                  }}
                  className="px-8 sm:w-auto w-[60%] bg-white border-teal-900 hover:border-teal-600 border-solid border
        text-sm p-2 rounded-[10px] text-teal-900 hover:text-teal-600 mt-1"
                  id="backBtn"
                >
                  Trở về
                </button>
              ) : (
                ''
              )}
            </div>
          </div>
        )}
        {(site === 'inBal' || site === 'NonBal' || site === 'inBalAd') && (
          <div className="flex sm:flex-row flex-col items-center sm:justify-between">
            <button
              onClick={() => {
                return window.history.back();
              }}
              className={`sm:px-8 bg-white border-teal-900 hover:border-teal-600 border-solid border
        text-sm p-2 rounded-[10px] text-teal-900 hover:text-teal-600 ${
          pageType === 'edit' && site === 'NonBal' ? 'mt-[80px] sm:mt-7' : 'mt-7'
        } sm:w-auto w-[60%] `}
            >
              Trở về
            </button>
            {ModalForm()}
            {site === 'inBalAd' &&
              roleCode === 'ADMIN' &&
              (data.status === 'DISCONNECT' ? (
                <button
                  onClick={() => {}}
                  className={` bg-teal-900 border-teal-900 border-solid border
        text-sm rounded-[10px] text-white w-[60%] sm:w-[130px] h-[38px] mt-3 sm:mt-7`}
                >
                  Kết nối
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleEdit();
                  }}
                  className={` bg-teal-900 border-teal-900 border-solid border
        text-sm rounded-[10px] text-white w-[60%] sm:w-[130px] h-[38px] mt-3 sm:mt-7`}
                >
                  Hủy kết nối
                </button>
              ))}
          </div>
        )}
      </div>
    </Fragment>
  );
};
export default Page;
