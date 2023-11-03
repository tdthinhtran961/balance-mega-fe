import React, { Fragment, useEffect, useState } from 'react';
import './index.less';
import { routerLinks, formatCurrency } from 'utils';
import { useNavigate } from 'react-router';
import { HookDataTable } from 'hooks';
import { SupplierService } from 'services/supplier';
// import { useAuth } from 'global';
import { Select } from 'antd';

import { useAuth } from 'global';
import { ColumnDisposalGoods } from 'columns/merchandiseManagement';
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

  const navigateDetail = (idOrder) => {
    return navigate(routerLinks('OrderDetail') + `?id=${idOrder}`);
  };

  const [storeList, setStoreList] = useState([]);
  const [filterStore, setFilterStore] = useState();

  useEffect(() => {
    const fetchListFilter = async () => {
      const storeList = await SupplierService.getStoreListWithOrder();
      setStoreList(storeList.data);
    };
    fetchListFilter();
  }, []);

  const [handleChange, DataTab] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => navigate(routerLinks('DisposalDetailAdmin') + `?view=admin&id=${data?.id}`),
    }),
    isLoading,
    setIsLoading,
    showSearch: true,
    save: false,
    Get: async (params) => {
      // { ...params, filterSupplier, filterStore }
      return SupplierService.getDisposalGoodsList({ ...params, idStore: filterStore, type: 'DISPOSAL_GOOD' });
    },
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiển thị ${from} - ${to} / Tổng số ${total}`,
    columns: ColumnDisposalGoods({
      handDelete: async (id) => {
        (await SupplierService.delete(id)) && handleChange();
      },
      formatCurrency,
      navigateDetail,
      roleCode,
    }),
    rightHeader: (
      <div className="flex justify-end items-center">
        <Select
          className="w-[245px] rounded-[10px]"
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
      </div>
    ),
  });

  useEffect(() => {
    handleChange();
  }, [filterStore]);

  return (
    <Fragment>
      <div className="min-h-screen">
        <p className="text-2xl font-bold text-teal-900 mb-6">Hủy hàng</p>
        <div className="bg-white w-full rounded-xl mt-5 relative pt-4 pb-6 px-6">
          <div className="">{DataTab()}</div>
        </div>
      </div>
    </Fragment>
  );
};
export default PromotionOrderManagement;
