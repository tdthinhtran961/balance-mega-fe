import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

const Component = ({ mask, value, addonBefore, addonAfter, form, disabled, onFirstChange, ...prop }) => {
  const input = useRef();
  if (prop.condition) {
    delete prop.condition;
  }
  useEffect(() => {
    if (mask) {
      import('inputmask').then(({ default: Inputmask }) => Inputmask(mask).mask(input.current));
    }
  }, []);
  return (
    <div className={classNames('ant-input flex items-center', { 'border rounded-xl': !!addonBefore || !!addonAfter })}>
      {!!addonBefore && <div>{addonBefore(form, onFirstChange)}</div>}
      <input
        ref={input}
        className={classNames('w-full h-10 text-gray-600 bg-white px-4 ant-input', {
          'border rounded-xl': !addonBefore && !addonAfter,
          'rounded-l-xl border-r': !addonBefore && !!addonAfter,
          'rounded-r-xl border-l': !!addonBefore && !addonAfter,
          'border-r border-l': !!addonBefore && !!addonAfter,
          'bg-gray-100 text-gray-400': disabled,
        })}
        readOnly={disabled}
        value={value}
        {...prop}
      />
      {!!addonAfter && <div>{addonAfter(form, onFirstChange)}</div>}
    </div>
  );
};
export default Component;
