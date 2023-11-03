import React, { useState, useEffect, useCallback } from 'react';
import { Select } from 'antd';
import axios from 'axios';

const Component = ({ formItem, form, value, showSearch = true, ...prop }) => {
  const [_list, set_list] = useState(formItem.list ? formItem.list : []);

  const loadData = useCallback(
    async (fullTextSearch) => {
      if (formItem.api) {
        if (!formItem.api.condition || formItem.api.condition(form.getFieldValue)) {
          const url = formItem.api.link(form.getFieldValue);
          if (url) {
            const { data } = await axios.get(url, {
              params: formItem.api.params
                ? formItem.api.params(form.getFieldValue, fullTextSearch, value)
                : { fullTextSearch },
            });
            set_list(data.data.map(formItem.api.format).filter((item) => !!item.value));
          }
        }
      } else if (formItem.renderList) {
        set_list(formItem.renderList(form.getFieldValue, fullTextSearch, formItem.list));
      } else if (formItem.list) {
        set_list(
          formItem.list.filter(
            (item) =>
              !item?.label?.toUpperCase || item?.label?.toUpperCase().indexOf(fullTextSearch.toUpperCase()) > -1,
          ),
        );
      }
    },
    [form, formItem, value],
  );

  useEffect(async () => {
    await loadData('');
  }, [value, formItem]);

  return (
    <Select
      {...prop}
      listHeight={200}
      filterOption={false}
      showSearch={showSearch}
      allowClear
      onBlur={() => loadData('')}
      onSearch={(value) => loadData(value)}
      value={value}
      maxTagPlaceholder={(array) => '+' + array.length}
      mode={formItem.mode}
      optionFilterProp="label"
      onSelect={(value) => formItem?.onSelect && formItem?.onSelect(value, form)}
    >
      {formItem &&
        _list.map((item, index) => (
          <Select.Option key={`${item.value}${index}`} value={item.value}>
            {item.label}
          </Select.Option>
        ))}
    </Select>
  );
};

export default Component;
