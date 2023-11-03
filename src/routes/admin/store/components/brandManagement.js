import React, { useState,Fragment } from "react";
import { HookDataTable } from "hooks";
import { useNavigate } from "react-router";
import { routerLinks } from "utils";
import { StoreService } from 'services/store';
import { ColumnBrandManagement } from 'columns/store'
import { useAuth } from "global";
const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const storeId = user?.userInfor?.subOrgId;
  const [isBranch,setIsBrand] = useState()
  // console.log(isBranch);
  // useEffect(() => {
  //   handleChange()
  // }, [])
  const [, DataBrandManagement] = HookDataTable({
    onRow: (data) =>
    ({
      onDoubleClick: (event) => navigate(routerLinks('BranchDetail') + `?id=${data.id}&page=branch`)
    }),
    isLoading,
    setIsLoading,
    save: true,
    Get: async (params) => {
      // eslint-disable-next-line
      const data = await StoreService.getListBrandBal({ ...params, supplierType: "BALANCE", storeId: storeId })
      setIsBrand(data?.isBranch)
      return data
    },
    columns: ColumnBrandManagement(),
    pageSizeRender: (page) => page,
    pageSizeWidth: '70px',
    paginationDescription: (from, to, total) => `Hiên thị ${from} - ${to}/Tổng số ${total} chi nhánh`,
    rightHeader: (
      <div className="relative">
        {isBranch && (
        <button className="w-[153px] h-[36px] bg-teal-900 text-white rounded-xl"
          onClick={() => {
            navigate(`${routerLinks('BranchCreate')}` + `?page=branch`)
          }}
        >
          <i className="las la-plus mr-1 bold"></i>
          Thêm chi nhánh
        </button>
        ) }
      </div>
    )
  })
  return (
    <Fragment>
      <div className="min-h-screen store-wrapper">
        <p className="text-2xl font-bold text-teal-900 mb-6">Quản lý chi nhánh</p>
        <div className="bg-white w-full px-4 py-6 rounded-[10px] relative">
        {DataBrandManagement()}
        </div>
      </div>
    </Fragment>
  )
}
export default Page;
