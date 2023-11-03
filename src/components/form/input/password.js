import React, { useState } from 'react';
import classNames from 'classnames';

const Component = ({ ...prop }) => {
  const [toggle, set_toggle] = useState(true);
  if (prop.value === undefined) {
    prop.value = '';
  }

  return (
    <div className="relative">
      <input
        {...prop}
        type={toggle ? 'password' : 'text'}
        className="w-full h-10 rounded-xl text-gray-600 bg-white border border-solid py-2 pr-9 pl-4 ant-input pr-9"
      />
      <i
        onClick={() => set_toggle(!toggle)}
        className={classNames('text-lg las absolute top-1.5 right-3 z-10', {
          'la-eye-slash': !toggle,
          'la-eye': toggle,
        })}
      />
    </div>
  );
};
export default Component;
