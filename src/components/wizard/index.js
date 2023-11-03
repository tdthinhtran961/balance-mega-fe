import React from 'react';
import classNames from 'classnames';
const Component = ({ steps = [], current = 0 }) => {
  return (
    <div className={`w-full flex flex-wrap items-center my-5`}>
      {steps.map((step, index) => {
        let bgRec = 'bg-gray-500';
        let bg = 'bg-gray-500 lg:bg-gray-500';
        let border = 'border-l-gray-500';
        let width = 'w-full md:w-1/3 lg:w-1/5';

        if (index === current) {
          border = 'border-l-blue-500';
          bgRec = 'bg-blue-500';
        }
        if (index < current) {
          border = 'border-l-green-500';
          bg = 'bg-green-500 lg:bg-green-500';
          bgRec = 'bg-green-500';
        }
        if (index === current - 1) {
          bg = 'bg-blue-500 lg:bg-blue-500';
        }
        if (index === steps.length - 1) {
          bg = 'bg-white';
        }
        if (steps.length % 2 === 1 && index > steps.length - 3) {
          width = 'w-full md:w-1/2 lg:w-1/5';
        }

        if (index === 2) {
          bg = bg + ' md:bg-white';
        }

        return (
          <div
            className={classNames('h-20 relative border-white border-b border-white md:border-0', width)}
            key={index}
          >
            <div
              className={classNames('w-full h-full text-center pr-8 flex flex-col justify-center text-white', bgRec)}
            >
              <h4 className="font-bold text-white">Step {index + 1}</h4>
              <p className="text-sm">{step.title}</p>
            </div>
            <div
              className={classNames(
                `hidden md:block absolute top-0 w-0 h-0 z-10 border-b-[40px]
              border-t-[40px] border-b-transparent border-t-transparent border-l-[30px]`,
                border,
                {
                  'right-[0]': index === steps.length - 1,
                  'right-[2px]': index !== steps.length - 1,
                },
              )}
            ></div>
            <div
              className="hidden md:block absolute top-0 right-0 w-0 h-0 z-[1] border-b-[40px] border-t-[40px]
                    border-b-transparent border-t-transparent border-l-white border-l-[30px]"
            ></div>
            <div className={classNames(`hidden md:block w-[30px] h-20 absolute top-0 right-0 z-0`, bg)}></div>
          </div>
        );
      })}
    </div>
  );
};
export default Component;
