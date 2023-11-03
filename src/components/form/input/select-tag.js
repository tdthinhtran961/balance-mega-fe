import React, { useState, useEffect, useCallback } from 'react';
import { Select } from 'antd';
import axios from 'axios';

import { Avatar } from 'components';

const Component = ({ tag, onChange, form, value, ...prop }) => {
  const [_options, set_options] = useState([]);
  const loadData = useCallback(
    async (fullTextSearch = '', value) => {
      const { data } = await axios.get(tag.api, {
        params: tag.params
          ? tag.params(form.getFieldValue, fullTextSearch, value && value.filter((item) => !!item))
          : { fullTextSearch },
      });
      set_options(
        data.data.map((item, index) => ({
          label: tag.avatar ? (
            <Avatar key={index} size="5" src={item[tag.avatar]} text={item[tag.label]} />
          ) : (
            item[tag.label]
          ),
          value: item[tag.value],
          avatar: item[tag.avatar],
        })),
      );
    },
    [tag, form.getFieldValue],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Select
      {...prop}
      listHeight={200}
      value={value || []}
      onSearch={(fullTextSearch) => loadData(fullTextSearch, value)}
      onBlur={() => loadData()}
      mode="multiple"
      optionFilterProp="label"
      showArrow
      filterOption={false}
      maxTagPlaceholder={(array) => '+' + array.length}
      tagRender={({ label, value, closable, onClose }) => {
        return (
          label && (
            <div className="bg-blue-100 rounded-xl py-1 px-2 relative mr-2.5 -left-2.5">
              <button
                disabled={prop.disabled}
                type={'button'}
                className="absolute rounded-full -top-1 -right-2 bg-red-100 text-red-500 p-0.5 leading-none z-auto"
                onClick={onClose}
              >
                <i className="las la-times" />
              </button>

              {label}
            </div>
          )
        );
      }}
      onChange={(value) => {
        onChange(value);
        loadData('', value);
      }}
      style={{ width: '100%' }}
      options={_options}
    />
  );
};
export default Component;
