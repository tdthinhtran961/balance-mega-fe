import React from 'react';
import classNames from 'classnames';

const Component = ({ spinning = true, text = 'Now Loading...', children, className = '' }) => {
  return (
    <div className={classNames('relative min-h-[80px]')}>
      <div
        className={classNames(
          'w-full h-full flex-col absolute top-0 left-0 right-0 bottom-0 z-10 mx-0 flex justify-center items-center transition-all ease-in-out duration-300',
          {
            'invisible opacity-0': !spinning,
            'visible opacity-100': spinning,
          },
        )}
      >
        <h5 className="mb-2 text-blue-500">{text}</h5>
        <div className="loader w-24 h-5">
          <div className="bar bar1 w-24 h-5 absolute flex items-center" />
          <div className="bar bar2 w-24 h-5 absolute flex items-center" />
          <div className="bar bar3 w-24 h-5 absolute flex items-center" />
        </div>
      </div>
      <div className={classNames(className, { 'opacity-50': spinning })}>{children}</div>
    </div>
  );
};
export default Component;
