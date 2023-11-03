import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Select } from 'antd';
import classNames from 'classnames';


const PaginationHook = ({
  total = 4,
  pageSizeOptions = [],
  pageSize = 10,
  pageIndex = 1,
  queryParams = () => { },
  pageSizeRender = (sizePage) => sizePage + ' / page',
  pageSizeWidth = '115px',
  paginationDescription = (from, to, total) => from + '-' + to + ' of ' + total + ' items',
  idElement = 'pagination',
  className = 'pagination',
  firstPageDisabled = ({ pageIndex }) => pageIndex - 10 <= 0,
  lastPageDisabled = ({ pageIndex, lastIndex }) => pageIndex + 10 > lastIndex,
  firstPage = ({ pageIndex }) => pageIndex - 10,
  lastPage = ({ pageIndex }) => pageIndex + 10,
}) => {
  const [page, setPage] = useState(1)
  const [perPage, setPerpage] = useState(10)
  const listOfPageItem = useRef([]);
  const [ranges, setRanges] = useState([]);
  const [lastNumber, set_lastNumber] = useState(0);
  const buildIndexes = useCallback(() => {
    const lastIndex = getLastIndex(total, pageSize);
    listOfPageItem.current = getListOfPageItem(pageIndex, lastIndex);
    setRanges([(pageIndex - 1) * pageSize + 1, Math.min(pageIndex * pageSize, total)]);
  }, [pageIndex, pageSize, total]);

  useEffect(() => {
    buildIndexes();
  }, [buildIndexes]);

  const getLastIndex = (total, pageSize) => {
    return Math.ceil(total / pageSize);
  };

  const onPageSizeChange = (size) => {
    setPerpage(size)
    queryParams({ pageSize: size, current: pageIndex });
    buildIndexes();
  };

  const onPageIndexChange = ({ type, index }) => {
    switch (type) {
      case 'prev':
        index = pageIndex - 1;
        break;
      case 'prev_10':
        index = firstPage({ pageIndex, lastIndex: lastNumber });
        break;
      case 'next':
        index = pageIndex + 1;
        break;
      case 'next_10':
        index = lastPage({ pageIndex, lastIndex: lastNumber });
        break;
      default:
    }
    setPage(index)
    queryParams({ pageSize, current: index });
  };

  const getListOfPageItem = (pageIndex, lastIndex) => {
    const concatWithPrevNext = (listOfPage) => {
      const prev10Item = {
        type: 'prev_10',
        disabled: firstPageDisabled({ pageIndex, lastIndex }),
      };
      const prevItem = {
        type: 'prev',
        disabled: pageIndex === 1,
      };
      const nextItem = {
        type: 'next',
        disabled: pageIndex === lastIndex,
      };
      const next10Item = {
        type: 'next_10',
        disabled: lastPageDisabled({ pageIndex, lastIndex }),
      };
      set_lastNumber(listOfPage.length);
      return [prev10Item, prevItem, ...listOfPage, nextItem, next10Item];
    };
    const generatePage = (start, end) => {
      const list = [];
      for (let i = start; i <= end; i++) {
        list.push({
          index: i,
          type: 'page_' + i,
        });
      }
      return list;
    };

    if (lastIndex <= 9) {
      return concatWithPrevNext(generatePage(1, lastIndex));
    } else {
      const generateRangeItem = (selected, last) => {
        let listOfRange = [];
        const prevFiveItem = {
          type: 'prev_5',
        };
        const nextFiveItem = {
          type: 'next_5',
        };
        const firstPageItem = generatePage(1, 1);
        const lastPageItem = generatePage(lastIndex, lastIndex);
        if (selected < 4) {
          listOfRange = [...generatePage(2, 4), nextFiveItem];
        } else if (selected < last - 3) {
          listOfRange = [prevFiveItem, ...generatePage(selected - 1, selected + 1), nextFiveItem];
        } else {
          listOfRange = [prevFiveItem, ...generatePage(last - 3, last - 1)];
        }
        return [...firstPageItem, ...listOfRange, ...lastPageItem];
      };
      return concatWithPrevNext(generateRangeItem(pageIndex, lastIndex));
    }
  };

  return [() => {
    return total > 0 && (
      <div className={classNames(className, 'sm:flex lg:flex-row flex-col items-center lg:justify-between  mt-3 select-none')}>

        <div className={`left ${window.innerWidth <= 640 ? 'flex lg:flex-row  flex-row' : ''}    ${(window.innerWidth > 740 && window.innerWidth <= 1023) ? 'absolute left-0' : ''} `}>
          <Select
            id={idElement + '_page_size'}
            defaultValue={pageSize}
            style={{ minWidth: pageSizeWidth }}
            onChange={(value) => onPageSizeChange(value)}
          >
            {pageSizeOptions.map((item, index) => (
              <Select.Option key={index} value={item}>
                {pageSizeRender(item)}
              </Select.Option>
            ))}
          </Select>
          <span className="lg:ml-3 ml-[4px] text-black">{paginationDescription(ranges[0], ranges[1], total)}</span>
        </div>
        <div className="  md:mt-10 lg:mt-0 mt-3 right flex justify-center  lg:p-1 rounded-xl bg-white">
          {/* mt-3 sm:mt-0 right flex justify-center border border-gray-100 p-1 rounded-xl bg-white */}
          <div className="flex md:flex-wrap justify-center duration-300  transition-all">
            {listOfPageItem.current.map((page, index) => (
              <button
                type={'button'}
                disabled={page.disabled}
                key={index}
                id={idElement + '_' + page.type}
                className={classNames(
                  'text-center duration-300 transition-all py-1 px-2.5 text-sm font-medium leading-normal h-8 rounded-xl text-teal-900',
                  {
                    'text-teal-900 hover:text-teal-700': pageIndex !== page.index,
                    'bg-teal-900 rounded-full text-white hover:text-white': pageIndex === page.index,
                    'pointer-events-none': page.disabled || ['next_5', 'prev_5'].includes(page.type),
                    'text-blue-300': page.disabled,
                  },
                )}
                onClick={() => onPageIndexChange(page)}
              >
                {page.type === 'prev' && <i className="las la-angle-left text-sm text-gray-300" />}
                {page.type === 'next' && <i className="las la-angle-right text-sm text-gray-300" />}
                {page.type === 'prev_10' && <i className="las la-angle-double-left text-sm text-gray-300" />}
                {page.type === 'next_10' && <i className="las la-angle-double-right text-sm text-gray-300" />}
                {page.type.indexOf('page') === 0 && page.index}
                {(page.type === 'prev_5' || page.type === 'next_5') && '...'}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }, page, perPage, onPageIndexChange];

};
export default PaginationHook;
