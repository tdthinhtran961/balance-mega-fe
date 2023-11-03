import React from 'react';
import classNames from 'classnames';

const Component = ({ onChange, value = [], placeholder, disabled, ...prop }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && event.target.value) {
      value.push(event.target.value);
      onChange([...value]);
      event.target.value = '';
    }
  };

  return (
    <div
      className={classNames(
        'chips flex flex-wrap bg-white rounded-xl border px-4 border-solid border-gray-300 py-1.5 min-h-[2.65rem] items-center',
        { 'bg-gray-100': disabled },
      )}
    >
      {value.map((item, index) => (
        <div key={index} className="bg-blue-100 rounded-xl py-1 px-2 relative mr-2.5 -left-2.5">
          <button
            type={'button'}
            className="absolute rounded-full -top-1 -right-2 bg-red-100 text-red-500 p-0.5 leading-none z-auto"
            onClick={() => {
              value.splice(index, 1);
              onChange([...value]);
            }}
            disabled={disabled}
          >
            <i className="las la-times" />
          </button>
          {item}
        </div>
      ))}
      <input
        disabled={disabled}
        type="text"
        placeholder={placeholder}
        className={'flex flex-1 focus-visible:outline-0 h-[1.775rem]'}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
export default Component;
