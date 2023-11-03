import React from 'react';
import classNames from 'classnames';

function Component({ text = '', className = '', onClick, buttonStyle = 'default', id = 'btn', type = 'button', disabled = false }) {
  return (
    <button
      id={id}
      disabled={disabled}
      className={classNames('border text-center rounded-[10px] h-10 disabled:opacity-60 disabled:pointer-events-none ' + className, {
        'bg-teal-900 border-teal-900 text-white hover:bg-teal-700 hover:border-teal-700': buttonStyle === 'default',
        'bg-white border-teal-900 text-teal-900 hover:text-teal-500 hover:border-teal-500': buttonStyle === 'primary',
        'bg-red-600 border-red-600 text-white hover:bg-red-400 hover:border-red-400': buttonStyle === 'secondary',
      })}
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
}

export default Component;
