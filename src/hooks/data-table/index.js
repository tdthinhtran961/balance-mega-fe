import React, { useState, useEffect, useRef, Fragment, useCallback } from 'react';
import { v4 } from 'uuid';
import { Table, Radio, Checkbox, DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import moment from 'moment';
import classNames from 'classnames';

import { Pagination } from 'components';
import { cleanObjectKeyNull, getQueryStringParams } from 'utils';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;
const Hook = ({
  isLoading,
  setIsLoading,
  Get,
  id = () => true,
  showList = true,
  footer,
  defaultRequest = {},
  pageIndex = 'page',
  pageSize = 'perPage',
  sort = 'sorts',
  filter = 'filter',
  fullTextSearch = 'fullTextSearch',
  filterDate = {},
  columns = [],
  loading = false,
  showPagination = true,
  leftHeader,
  rightHeader,
  showSearch = true,
  save = true,
  searchPlaceholder,
  subHeader,
  xScroll,
  yScroll = null,
  emptyText = <div>Trống</div>,
  loadFirst = true,
  onRow = () => { },
  pageSizeOptions = [10, 20, 30, 40],
  pageSizeRender = (sizePage) => sizePage + ' / page',
  pageSizeWidth = '115px',
  paginationDescription = (from, to, total) => from + '-' + to + ' of ' + total + ' items',
  idElement = 'temp-' + v4(),
  className = 'data-table',
  ...prop
}) => {
  const [idTable] = useState('temp-' + v4());
  const idE = useRef(idElement);
  const [objData, setObjData] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const param = useRef(
    localStorage.getItem(idTable)
      ? JSON.parse(localStorage.getItem(idTable))
      : {
        [pageIndex]: 1,
        [pageSize]: 10,
        ...defaultRequest,
      },
  );
  const timeoutSearch = useRef();
  const cols = useRef();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const prePage = useRef(param.current[pageIndex]);

  useEffect(() => {
    return () => {
      localStorage.removeItem(idTable);
    };
  }, [idTable]);

  const onChange = useCallback(
    async (request) => {
      if (request) {
        localStorage.setItem(idTable, JSON.stringify(request));
        param.current = { ...request };
        if (save) {
          if (request[sort] && typeof request[sort] === 'object') {
            request[sort] = JSON.stringify(request[sort]);
          }
          if (request[filter] && typeof request[filter] === 'object') {
            request[filter] = JSON.stringify(request[filter]);
          }
          if (request[filterDate] && typeof request[filterDate] === 'object') {
            request[filterDate] = JSON.stringify(request[filterDate]);
          }
          navigate(location.pathname + '?' + new URLSearchParams(request).toString());
        }
      } else if (localStorage.getItem(idTable)) {
        param.current = JSON.parse(localStorage.getItem(idTable));
      }

      
      if (showList && Get) {
        setIsLoading && setIsLoading(true);
        const { data, count, ...prop } = await Get(param.current, id());
        if ((prePage.current === param.current[pageIndex] ||!data || data.length === 0) && param.current[pageIndex] > 1) {
          await onChange({
            ...param.current,
            page: 1,
          });
        } else {
          setObjData(prop);
          setDataSource(data || []);
          setTotalData(count);
          setIsLoading && setIsLoading(false);
        }
        prePage.current = param.current[pageIndex];
      } else {
        setIsLoading && setIsLoading(false);
      }
      
    },
    [Get, id, idTable, pageIndex, setIsLoading, showList],
  );

  const params =
    save && location.search && location.search.indexOf('=') > -1
      ? { ...param.current, ...getQueryStringParams(location.search) }
      : param.current;

  if (params[filter] && typeof params[filter] === 'string') {
    params[filter] = JSON.parse(params[filter]);
  }
  if (params[sort] && typeof params[sort] === 'string') {
    params[sort] = JSON.parse(params[sort]);
  }

  const mount = useRef(false);
  const handleSearch = useCallback(async () => {
    if (loadFirst) {
      const _params = {
        ...params,
        [sort]: JSON.stringify(params[sort]),
        [filter]: JSON.stringify(params[filter]),
        [filterDate]: JSON.stringify(params[filterDate])
      };
      await onChange(cleanObjectKeyNull(_params));
    }
  }, [filter, fullTextSearch, loadFirst, onChange, pageIndex, pageSize, params, save, sort, filterDate]);

  useEffect(() => {
    if (!mount.current) {
      mount.current = true;
      handleSearch();
    }
  }, [mount, handleSearch, location.search, showList]);

  const groupButton = (confirm, clearFilters, key, value) => (
    <div className="grid grid-cols-2 gap-2 mt-1">
      <button
        type={'button'}
        className="bg-gray-200 p-2 sm:px-4 sm:py-2.5 rounded-xl hover:bg-gray-300 "
        onClick={() => clearFilters()}
      >
        {t('components.datatable.reset')}
      </button>
      <button
        type={'button'}
        className="bg-teal-900 text-white p-2 sm:px-4 sm:py-2.5 rounded-xl hover:bg-teal-700 inline-flex items-center justify-center"
        onClick={() => confirm(value)}
      >
        <i className="las la-search mr-1" />
        {t('components.datatable.search')}
      </button>
    </div>
  );
  const ref = useRef();

  const getColumnSearchInput = (key) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div className="p-1">
        <input
          className="w-full h-10 rounded-xl text-gray-600 bg-white border border-solid border-gray-300 pr-9 pl-4 mb-1"
          value={selectedKeys}
          type="text"
          placeholder={t('components.datatable.pleaseEnterValueToSearch')}
          onChange={(e) => {setSelectedKeys(e.target.value)}}
          onKeyDown={(e) => {
            if (e.key) return e.key !== 'Enter';
          }}
        />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </div>
    ),
    filterIcon: (filtered) => <i className="las la-lg la-search" style={{ color: filtered ? '#3699FF' : undefined }} />,
    onFilterDropdownOpenChange: (visible) => {
      if (visible && ref.current) {
        setTimeout(() => ref.current.select());
      }
    },
  });

  const getColumnSearchRadio = (filters, key) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <Fragment>
        <RadioGroup options={filters} value={selectedKeys} onChange={(e) => setSelectedKeys(e.target.value + '')} />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </Fragment>
    ),
    filterIcon: (filtered) => (
      <i className="las la-lg la-dot-circle" style={{ color: filtered ? '#3699FF' : undefined }} />
    ),
  });

  const getColumnSearchCheckbox = (filters, key) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <Fragment>
        <CheckboxGroup options={filters} value={selectedKeys} onChange={(e) => setSelectedKeys(e)} />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </Fragment>
    ),
    filterIcon: (filtered) => (
      <i className="las la-lg la-check-square" style={{ color: filtered ? '#3699FF' : undefined }} />
    ),
  });

  const getColumnSearchDate = (key) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <Fragment>
        <RangePicker
          renderExtraFooter={() => (
            <button
              type={'button'}
              className="bg-blue-100 w-full px-3 py-1 rounded-xl hover:bg-blue-500 hover:text-white"
              onClick={() => document.activeElement.blur()}
            >
              {t('components.datatable.ok')}
            </button>
          )}
          format={['DD/MM/YYYY', 'DD/MM/YY']}
          value={!!selectedKeys && selectedKeys.length ? [moment(selectedKeys[0]), moment(selectedKeys[1])] : []}
          onChange={(e) => setSelectedKeys(e)}
        />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </Fragment>
    ),
    filterIcon: (filtered) => (
      <i className="las la-lg la-calendar" style={{ color: filtered ? '#3699FF' : undefined }} />
    ),
  });
  cols.current = columns
    .filter((col) => !!col && !!col.tableItem)
    .map((col, index) => {
      let item = col.tableItem;

      if (item.filter) {
        if (params[filter] && params[filter][col.name]) {
          item = { ...item, defaultFilteredValue: params[filter][col.name] };
        }
        switch (item.filter.type) {
          case 'radio':
            item = {
              ...item,
              ...getColumnSearchRadio(item.filter.list, col.name),
            };
            break;
          case 'checkbox':
            item = {
              ...item,
              ...getColumnSearchCheckbox(item.filter.list, col.name),
            };
            break;
          case 'date':
            item = { ...item, ...getColumnSearchDate(col.name) };
            break;
          case 'search':
            item = { ...item, ...getColumnSearchInput(col.name) };
            break;
          default:
            item = { ...item }
        }
        delete item.filter;
      }

      if (item.sorter && params[sort] && params[sort][col.name]) {
        item.defaultSortOrder =
          params[sort][col.name] === 'ASC' ? 'ascend' : params[sort][col.name] === 'DESC' ? 'descend' : '';
      }



      // if (!item.render) {
      //   item.render = (text) => checkTextToShort(text);
      // }
      
      
      if (typeof item.width === 'number') item.className = 'cursor-col-resize';

      return {
        title: col.title,
        dataIndex: col.name,
        onHeaderCell: () => typeof item.width === 'number' && ({
          onMouseDown: e => { widthTemp.current = e.clientX; },
          onMouseUp: () => { widthTemp.current = null; },
          onMouseMove: e => {
            clearTimeout(timeoutWidth.current);
            if (widthTemp.current) {
              timeoutWidth.current = setTimeout(() => {
                _columns[index] = _columns[index] + Math.round((e.clientX - widthTemp.current) * .05);
                set_columns([..._columns]);
              }, 3)
            }
          }
        }),
        ...item,
      };
    });
  const timeoutWidth = useRef();
  const widthTemp = useRef();
  const [_columns, set_columns] = useState(cols.current.map((item) => item.width));
  const xScrollRef = useRef(xScroll);
  if (_columns.length !== cols.current.length) {
    set_columns(cols.current.map((item) => item.width));
  }
  const handleTableChange = (pagination, filters = {}, sorts, tempFullTextSearch, filterDate) => {
    let tempPageIndex = pagination ? pagination.current : params[pageIndex];
    const tempPageSize = pagination ? pagination.pageSize : params[pageSize];

    const tempSort =
      sorts && sorts?.field && sorts?.order
        ? {
          [sorts.field]: sorts.order === 'ascend' ? 'ASC' : sorts.order === 'descend' ? 'DESC' : '',
        }
        : sorts?.field
          ? null
          : sorts;

    if (tempFullTextSearch !== params[fullTextSearch]) {
      tempPageIndex = 1;
    }
    const tempParams = cleanObjectKeyNull({
      [pageIndex]: tempPageIndex,
      [pageSize]: tempPageSize,
      [sort]: tempSort,
      [filter]: cleanObjectKeyNull(filters),
      [fullTextSearch]: tempFullTextSearch,
      [filterDate]: filterDate
    });
    onChange && onChange(tempParams);
  };

  return [
    onChange,
    (data, columns) => {
      if (columns) {
        columns = columns.map((col) => ({
          title: col.title,
          dataIndex: col.name,
        }));
      }
      return (
        <div className={classNames(className, 'intro-x')}>
          <div className="sm:flex justify-between items-center mb-2.5 flex-wrap">
            {!!showSearch && (
              <div className="relative">
                <input
                  id={idE.current + '_input_search'}
                  className="sm:w-80 w-full inline-block h-10 rounded-xl text-gray-600 bg-white border border-solid border-gray-100 pr-9 pl-8 "
                  defaultValue={params[fullTextSearch]}
                  type="text"
                  placeholder={searchPlaceholder || t('components.datatable.pleaseEnterValueToSearch')}
                  onChange={() => {
                    clearTimeout(timeoutSearch.current);
                    timeoutSearch.current = setTimeout(() => {
                      handleTableChange(
                        null,
                        params[filter],
                        params[sort],
                        document.getElementById(idE.current + '_input_search').value.trim(),
                      );
                    }, 500);
                  }}
                  onKeyPress={(e) => {
                    e.key === 'Enter' &&
                      handleTableChange(
                        null,
                        params[filter],
                        params[sort],
                        document.getElementById(idE.current + '_input_search').value.trim(),
                      );
                  }}
                />
                <i
                  className={classNames('text-lg las absolute top-1.5 right-3 z-10', {
                    'la-search': !params[fullTextSearch],
                    'la-times': !!params[fullTextSearch],
                  })}
                  onClick={() => {
                    if (params[fullTextSearch]) {
                      document.getElementById(idE.current + '_input_search').value = '';
                      handleTableChange(null, params[filter], params[sort], null);
                    }
                  }}
                />
              </div>
            )}
            {!!leftHeader && <div>{leftHeader}</div>}
            {!!rightHeader && <div className='my-3 lg:my-0 text-left'>{rightHeader}</div>}
          </div>
          {subHeader && subHeader(totalData)}
          {!!showList && (
            <Fragment>
              <Table
                onRow={onRow}
                locale={{
                  emptyText: <div className="bg-gray-100 text-gray-400 py-4">{emptyText}</div>,
                }}
                loading={isLoading}
                columns={
                  columns ||
                  _columns.map((item, index) => {
                    if (item) {
                      cols.current[index].width = item;
                    }
                    return cols.current[index];
                  })
                }
                pagination={false}
                dataSource={(data || dataSource).map((item) => ({
                  ...item,
                  key: item.id || v4(),
                }))}
                onChange={(pagination, filters, sorts) =>
                  handleTableChange(null, filters, sorts, params[fullTextSearch])
                }
                showSorterTooltip={false}
                scroll={{ x: xScrollRef.current, y: yScroll }}
                size="small"
                {...prop}
              />
              {showPagination && (
                <Pagination
                  total={totalData}
                  pageIndex={+params[pageIndex]}
                  pageSize={+params[pageSize]}
                  pageSizeOptions={pageSizeOptions}
                  pageSizeRender={pageSizeRender}
                  pageSizeWidth={pageSizeWidth}
                  queryParams={(pagination) =>
                    handleTableChange(pagination, params[filter], params[sort], params[fullTextSearch])
                  }
                  paginationDescription={paginationDescription}
                  idElement={idE.current}
                  {...prop}
                />
              )}
            </Fragment>
          )}
          {!!footer && <div className="footer">{footer(objData)}</div>}
        </div>
      );
    },
    params,
  ];
};
export default Hook;
