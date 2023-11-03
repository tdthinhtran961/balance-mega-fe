import React, { useState, useEffect } from 'react';
import { Popover } from 'antd';
import { SketchPicker } from 'react-color';

import { pickTextColorBasedOnBgColorAdvanced } from 'utils';

const Component = ({ value, onChange }) => {
  const [_color, set_color] = useState(value || '#000000');
  const [_borderColor, set_borderColor] = useState(null);
  useEffect(() => {
    set_borderColor(pickTextColorBasedOnBgColorAdvanced(_color, '#EFF5FF', '#555555'));
  }, [_color]);

  return (
    <Popover
      content={
        <SketchPicker
          color={_color}
          onChange={(color) => {
            set_color(color.hex);
            onChange(color.hex);
          }}
        />
      }
      trigger="click"
    >
      <button
        type={'button'}
        className="w-full h-10 rounded-xl"
        style={{ backgroundColor: _color, borderColor: _borderColor }}
      >
        {' '}
      </button>
    </Popover>
  );
};
export default Component;
