import { React, useState, useRef } from 'react';
// import { useTranslation } from 'react-i18next';

const SearchBar = ({ searchHolder, idSearch, onChange }) => {
  // const { t } = useTranslation();
  const [searchKey, setSearchKey] = useState(searchHolder);
  const timeoutSearch = useRef();

  return (
    <div className="relative data-table">
      <input
        id={idSearch + '_input_search'}
        // id={idElement + '_input_search'}
        // id="Add"
        className="w-[300px] h-10 rounded-xl text-gray-600 bg-white border border-solid border-gray-100 pr-9 pl-8"
        // defaultValue={params.fullTextSearch}
        type="text"
        placeholder={'Tìm kiếm sản phẩm'}
        // ref={timeoutSearch}
        defaultValue={searchKey}
        // onChange={() => {
        //     clearTimeout(timeoutSearch.current);
        //     timeoutSearch.current = setTimeout(() => {
        //     handleTableChange(
        //         null,
        //         params[filter],
        //         params[sort],
        //         document.getElementById(idElement + '_input_search').value,
        //     );
        //     }, 500);
        // }}
        // onKeyPress={(e) => {
        //     e.key === 'Enter' &&
        //     handleTableChange(
        //         null,
        //         params[filter],
        //         params[sort],
        //         document.getElementById(idElement + '_input_search').value,
        //     );
        // }}
        onChange={(e) => {
          clearTimeout(timeoutSearch.current);
          timeoutSearch.current = setTimeout(() => {
            onChange(e.target.value);
            setSearchKey(e.target.value);
          }, 500);
        }}
      />
      <i
        className="text-lg las absolute top-1.5 right-3 z-10 la-search"
        // onClick={() => {
        //     if (params.fullTextSearch) {
        //     document.getElementById(idElement + '_input_search').value = '';
        //     handleTableChange(null, params[filter], params[sort], null);
        //     }
        // }}
      />
    </div>
  );
};

export default SearchBar;
