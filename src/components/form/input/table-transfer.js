import React, { useState, useEffect, useCallback } from 'react';
import { Table, Transfer } from 'antd';

const Component = ({ showSearch = true, formItem, onChange, value, form, ...restProps }) => {
  const [_dataSource, set_dataSource] = useState([]);
  const [_targetKeys, set_targetKeys] = useState([]);

  const initFunction = useCallback(async () => {
    const data = await formItem.transfer.dataSource(value, form);
    set_dataSource(data);
    const keys = formItem.transfer.targetKeys(data, form, value);
    set_targetKeys(keys);
    onChange(keys);
  }, [form, formItem, onChange, value]);

  useEffect(() => {
    initFunction();
  }, [initFunction]);

  return (
    <Transfer
      {...restProps}
      showSearch
      showSelectAll={false}
      dataSource={_dataSource}
      targetKeys={_targetKeys}
      onChange={(nextTargetKeys) => {
        set_targetKeys(nextTargetKeys);
        onChange(nextTargetKeys);
      }}
      filterOption={(inputValue, item) =>
        formItem.transfer.filter
          ? formItem.transfer.filter(inputValue, item)
          : item.fullName.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
      }
    >
      {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === 'left' ? formItem.transfer.leftColumns : formItem.transfer.rightColumns;

        return (
          <Table
            rowSelection={{
              getCheckboxProps: (item) => ({ disabled: listDisabled || item.disabled }),
              selectedRowKeys: listSelectedKeys,
              onSelectAll(selected, selectedRows) {
                const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ key }) => key);
                const diffKeys = selected
                  ? treeSelectedKeys
                      .filter((x) => !listSelectedKeys.includes(x))
                      .concat(listSelectedKeys.filter((x) => !treeSelectedKeys.includes(x)))
                  : listSelectedKeys
                      .filter((x) => !treeSelectedKeys.includes(x))
                      .concat(treeSelectedKeys.filter((x) => !listSelectedKeys.includes(x)));
                onItemSelectAll(diffKeys, selected);
              },
              onSelect({ key }, selected) {
                onItemSelect(key, selected);
              },
            }}
            columns={columns}
            dataSource={filteredItems}
            size="small"
            style={{ pointerEvents: listDisabled ? 'none' : null }}
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) return;
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
          />
        );
      }}
    </Transfer>
  );
};
export default Component;
