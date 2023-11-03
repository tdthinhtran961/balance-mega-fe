import React, { Fragment, useEffect, useState } from 'react';
import './../index.less';
import { routerLinks, formatCurrency } from 'utils';
import { useNavigate } from 'react-router';
import { HookDataTable } from 'hooks';
import { SupplierService } from 'services/supplier';
// import { useAuth } from 'global';
import { Select } from 'antd';
import { ColumnPromotionGoods } from 'columns/orderManagement';
import { useAuth } from 'global';
const { Option } = Select;

const PromotionOrderManagement = () => {
  //   const location = useLocation();
  //   const pageType =
  //     location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const navigate = useNavigate();
  //   const urlSearch = new URLSearchParams(location.search);
  const { user } = useAuth();
  const roleCode = user?.userInfor?.roleCode;
  const [isLoading, setIsLoading] = useState(false);

  //   let title = '';

  //   switch (pageType) {
  //     case 'detail':
  //       title = 'Chi tiết đơn hàng';
  //       break;
  //     default:
  //       title = 'Danh sách đơn hàng';
  //       break;
  //   }

  const navigateDetail = (idOrder) => {
    return navigate(routerLinks('OrderDetail') + `?id=${idOrder}`);
  };

  const [supplierList, setSupplierList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [filterSupplier, setFilterSupplier] = useState();
  const [filterStore, setFilterStore] = useState();

  useEffect(() => {
    const fetchListFilter = async () => {
      const supplierList = await SupplierService.getSupplierListWithOrder();
      setSupplierList(supplierList.data);
      const storeList = await SupplierService.getStoreListWithOrder();
      setStoreList(storeList.data);
    };
    fetchListFilter();
  }, []);

  const [handleChange, DataTab] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => navigate(routerLinks('PromotionOrderDetail') + `?view=admin&id=${data?.id}`),
    }),
    isLoading,
    setIsLoading,
    showSearch: true,
    save: false,
    Get: async (params) => {
      // { ...params, filterSupplier, filterStore }
      return SupplierService.getPromotionOrderList({ ...params, supplierId: filterSupplier, storeId: filterStore });
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total} đơn hàng`,
    columns: ColumnPromotionGoods({
      handDelete: async (id) => {
        (await SupplierService.delete(id)) && handleChange();
      },
      formatCurrency,
      navigateDetail,
      roleCode,
    }),
    rightHeader: (
      <div className="flex items-center">
        <Select
          className="mr-6 w-[245px] rounded-[10px]"
          placeholder="Chọn cửa hàng"
          optionFilterProp="children"
          allowClear
          onChange={(event) => {
            setFilterStore(event);
          }}
        >
          {storeList &&
            storeList.map((item, index) => {
              return (
                <Option key={index} value={item?.id}>
                  {item?.name}
                </Option>
              );
            })}
        </Select>
        <Select
          className="w-[245px] rounded-[10px]"
          placeholder="Chọn nhà cung cấp"
          optionFilterProp="children"
          allowClear
          onChange={(event) => {
            setFilterSupplier(event);
          }}
        >
          {supplierList &&
            supplierList.map((item, index) => {
              return (
                <Option key={index} value={item?.id}>
                  {item?.name}
                </Option>
              );
            })}
        </Select>
      </div>
    ),
  });

  useEffect(() => {
    handleChange();
  }, [filterStore, filterSupplier]);

  return (
    <Fragment>
      <div className="">{DataTab()}</div>
    </Fragment>
  );
};
export default PromotionOrderManagement;
