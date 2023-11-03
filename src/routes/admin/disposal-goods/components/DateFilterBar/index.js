import moment from 'moment';
import { DatePicker, Space } from 'antd';
import { getFormattedDate, formatDateString } from 'utils';
import React from 'react';
import './index.less';

const DateFilterBar = ({ onChangeDateFrom, onChangeDateTo, showValidateFilter, firstDay, date }) => {
  return (
    <div className="sm:relative sm:mt-0 mt-4">
      <div className="sm:flex gap-4 items-end justify-end">
        <Space direction="vertical" className="flex items-center gap-2 lg:w-[223px] datepicker-from">
          <p className="text-[12px] text-left w-auto lg:w-[56px] sm:mr-0 mr-6">Từ ngày</p>{' '}
          {formatDateString(getFormattedDate(firstDay)) !== '1970/01/01' ? (
            <DatePicker
              onChange={onChangeDateFrom}
              format="DD/MM/YYYY"
              defaultValue={moment(getFormattedDate(firstDay), 'DD/MM/YYYY')}
              disabledDate={(current) => {
                return current && current.valueOf() > Date.now();
              }}
              size={'middle'}
            />
          ) : (
            <DatePicker
              onChange={onChangeDateFrom}
              format="DD/MM/YYYY"
              disabledDate={(current) => {
                return current && current.valueOf() > Date.now();
              }}
              size={'middle'}
            />
          )}
        </Space>
        <Space direction="vertical" className="flex items-center gap-2 sm:mt-0 mt-2 lg:w-[233px]">
          <p className="text-[12px] text-left w-auto lg:w-[56px]">Đến ngày</p>{' '}
          <DatePicker
            onChange={onChangeDateTo}
            format="DD/MM/YYYY"
            defaultValue={moment(getFormattedDate(date), 'DD/MM/YYYY')}
            disabledDate={(current) => {
              return current && current.valueOf() > Date.now();
            }}
            className={'sm:ml-0'}
            size={'middle'}
          />
        </Space>
      </div>
      {showValidateFilter && (
        <span className="text-red-500 absolute right-0 my-1 sm:mb-0 mb-4 z-10">
          Ngày kết thúc phải lớn hơn ngày bắt đầu
        </span>
      )}
    </div>
  );
};

export default DateFilterBar;
