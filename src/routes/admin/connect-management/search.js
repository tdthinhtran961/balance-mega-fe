import { React, useRef } from 'react';
import { ConnectManagementService } from 'services/connect-management';
const SearchBar = ({ searchHolder, idSearch, params, idElement, data, setParams, searchKey, setRecommendedSuppliers, setTotal, setSearchKey}) => {
  // const [searchKey, setSearchKey] = useState(searchHolder || localStorage.getItem('searchkey'));
  const timeoutSearch = useRef();
  return (
    <div className="relative data-table pb-[5px]">
      <input
        id={idSearch + '_input_search'}
        className="w-[300px] h-10 rounded-xl text-gray-600 bg-white border border-solid border-gray-100 pr-9 pl-8"
        type="text"
        placeholder={'Tìm kiếm sản phẩm'}
        // defaultValue={searchHolder}
        // value={searchHolder}
        defaultValue={searchKey}
        // value={searchKey}
        onChange={async (e) => {
          clearTimeout(timeoutSearch.current);
          timeoutSearch.current = setTimeout(async () => {
            const res = await ConnectManagementService.getSupplierWithProduct(e.target.value, params, data?.storeId);
            // localStorage.setItem(`searchkey_` + idElement, e.target.value);
            setRecommendedSuppliers(res);
            // setTotal(res?.total);
            setSearchKey(e.target.value);
            // setParams(8);
          }, 500);
        }}
      />
      <i className="text-lg las absolute top-1.5 right-3 z-10 la-search" />
    </div>
  );
};

export default SearchBar;
