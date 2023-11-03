import React, { useState } from 'react';
import { Checkbox, Divider } from 'antd';
import './index.less';
const CheckboxGroup = Checkbox.Group;

const PermissionCheckBoxGroup = ({
  optionsArr,
  defaultCheckedList = [],
  valueCheckAll,
  setPermissionCheckBox,
  name,
}) => {
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const onChange = (list) => {
    setCheckedList(list);
    setPermissionCheckBox((prev) => ({ ...prev, [name]: list }));
    setIndeterminate(!!list.length && list.length < optionsArr.length);
    setCheckAll(list.length === optionsArr.length);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? optionsArr : []);
    setPermissionCheckBox((prev) => ({ ...prev, [name]: e.target.checked ? optionsArr : [] }));
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <div className="permission-check-box-group">
      <Checkbox
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
        checked={checkAll}
        className="checkAllBox font-semibold"
        name={name}
      >
        {valueCheckAll}
      </Checkbox>
      <Divider />
      <CheckboxGroup
        options={optionsArr}
        value={checkedList}
        onChange={onChange}
        className="check-box-group border border-solid border-gray-300 rounded-xl p-[10px] my-3"
        name={name}
      />
    </div>
  );
};
export default PermissionCheckBoxGroup;
