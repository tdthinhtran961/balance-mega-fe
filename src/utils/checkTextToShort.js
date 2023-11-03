import { Popover } from 'antd';
import React from 'react';

const Util = (text) => {
  return typeof text !== 'string' || text.length < 60 ? (
    text
  ) : (
    <span>
      {text.substr(0, 60)}
      <Popover trigger="hover" overlayClassName="table-tooltip" content={text}>
        <i className="las la-lg la-info-circle link-click" />
      </Popover>
    </span>
  );
};
export default Util;
