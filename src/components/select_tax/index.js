import { Select } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

function Component({
  className = '',
  placeHolder = '',
  onChange,
  onSearch,
  list = [],
  showSearch = true,
  allowClear = true,
  type = 'list',
  param = {},
  callBack,
  ...rest
}) {

  const [options, setOptions] = useState(list);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    type === 'api' && fetchOptions();
  }, [type]);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const response = await callBack(param)

      const data = response.data;
      setOptions(prevOptions => [...prevOptions, ...data]);
      setHasMore(data.length !== 0);
    } finally {
      setLoading(false);
    }
  };
  const handleDropdownVisibleChange = async (open) => {
    if (open && hasMore) {
      await fetchOptions();
      setPage(page + 1);
    }
  };

  const handlePopupScroll = async (event) => {
    const { target } = event;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight && hasMore) {
      await fetchOptions();
      setPage(page + 1);
    }
  };
  return (
    <Select
      onDropdownVisibleChange={handleDropdownVisibleChange}
      onPopupScroll={handlePopupScroll}
      allowClear={allowClear}
      className={classNames('' + className)}
      showSearch={showSearch}
      placeholder={placeHolder}
      optionFilterProp="children"
      onChange={onChange}
      onSearch={onSearch}
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
      options={type === 'list' ? list : options}
      loading={loading}
      {...rest}
    />
  );
}

export default Component;
